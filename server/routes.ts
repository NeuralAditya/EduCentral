import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTestSchema, insertQuestionSchema, insertTestAttemptSchema, insertAnswerSchema } from "@shared/schema";
import { assessVideoResponse, assessPhotoSubmission, assessTextResponse, transcribeAudio } from "./services/openai";
import multer from "multer";

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Get dashboard data
  app.get("/api/dashboard/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const stats = await storage.getUserStats(userId);
      const recentAttempts = await storage.getAttemptsByUser(userId);
      const availableTests = await storage.getPublishedTests();

      res.json({
        stats,
        recentAttempts: recentAttempts.slice(0, 5),
        availableTests: availableTests.slice(0, 10),
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard data" });
    }
  });

  // Get all published tests
  app.get("/api/tests", async (req, res) => {
    try {
      const tests = await storage.getPublishedTests();
      res.json(tests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tests" });
    }
  });

  // Get test with questions
  app.get("/api/tests/:id", async (req, res) => {
    try {
      const testId = parseInt(req.params.id);
      const test = await storage.getTestWithQuestions(testId);
      
      if (!test) {
        return res.status(404).json({ message: "Test not found" });
      }

      res.json(test);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch test" });
    }
  });

  // Create new test
  app.post("/api/tests", async (req, res) => {
    try {
      const validatedData = insertTestSchema.parse(req.body);
      const test = await storage.createTest(validatedData);
      res.status(201).json(test);
    } catch (error) {
      res.status(400).json({ message: "Invalid test data" });
    }
  });

  // Add question to test
  app.post("/api/tests/:testId/questions", async (req, res) => {
    try {
      const testId = parseInt(req.params.testId);
      const validatedData = insertQuestionSchema.parse({
        ...req.body,
        testId,
      });
      const question = await storage.createQuestion(validatedData);
      res.status(201).json(question);
    } catch (error) {
      res.status(400).json({ message: "Invalid question data" });
    }
  });

  // Start test attempt
  app.post("/api/attempts", async (req, res) => {
    try {
      const validatedData = insertTestAttemptSchema.parse(req.body);
      const attempt = await storage.createTestAttempt(validatedData);
      res.status(201).json(attempt);
    } catch (error) {
      res.status(400).json({ message: "Invalid attempt data" });
    }
  });

  // Get test attempt
  app.get("/api/attempts/:id", async (req, res) => {
    try {
      const attemptId = parseInt(req.params.id);
      const attempt = await storage.getAttemptWithDetails(attemptId);
      
      if (!attempt) {
        return res.status(404).json({ message: "Attempt not found" });
      }

      res.json(attempt);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch attempt" });
    }
  });

  // Submit MCQ answer
  app.post("/api/attempts/:attemptId/answers", async (req, res) => {
    try {
      const attemptId = parseInt(req.params.attemptId);
      const { questionId, answerData, timeSpent } = req.body;

      const question = await storage.getQuestion(questionId);
      if (!question) {
        return res.status(404).json({ message: "Question not found" });
      }

      let score = 0;
      let aiAssessment = null;

      // Score MCQ answers
      if (question.type === "mcq" && question.correctAnswer === answerData.answer) {
        score = question.points || 1;
      }

      const answer = await storage.createAnswer({
        attemptId,
        questionId,
        answerType: "text",
        answerData,
        score,
        maxScore: question.points || 1,
        aiAssessment,
        timeSpent,
      });

      res.status(201).json(answer);
    } catch (error) {
      res.status(400).json({ message: "Failed to submit answer" });
    }
  });

  // Submit video response
  app.post("/api/attempts/:attemptId/video", upload.single("video"), async (req, res) => {
    try {
      const attemptId = parseInt(req.params.attemptId);
      const { questionId, timeSpent } = req.body;

      if (!req.file) {
        return res.status(400).json({ message: "No video file provided" });
      }

      const question = await storage.getQuestion(parseInt(questionId));
      if (!question) {
        return res.status(404).json({ message: "Question not found" });
      }

      // Transcribe audio from video (simplified - in real app would extract audio)
      const transcription = await transcribeAudio(req.file.buffer);
      
      // Assess the video response
      const assessment = await assessVideoResponse(
        transcription,
        question.question,
        question.points || 10
      );

      const answer = await storage.createAnswer({
        attemptId,
        questionId: question.id,
        answerType: "video",
        answerData: {
          transcription,
          videoSize: req.file.size,
        },
        score: assessment.score,
        maxScore: assessment.maxScore,
        aiAssessment: {
          feedback: assessment.feedback,
          criteria: assessment.criteria,
          type: "video",
        },
        timeSpent: parseInt(timeSpent),
      });

      res.status(201).json(answer);
    } catch (error) {
      console.error("Video assessment error:", error);
      res.status(500).json({ message: "Failed to assess video response" });
    }
  });

  // Submit photo response
  app.post("/api/attempts/:attemptId/photo", upload.single("photo"), async (req, res) => {
    try {
      const attemptId = parseInt(req.params.attemptId);
      const { questionId, timeSpent } = req.body;

      if (!req.file) {
        return res.status(400).json({ message: "No photo file provided" });
      }

      const question = await storage.getQuestion(parseInt(questionId));
      if (!question) {
        return res.status(404).json({ message: "Question not found" });
      }

      // Convert image to base64
      const base64Image = req.file.buffer.toString('base64');
      
      // Assess the photo submission
      const assessment = await assessPhotoSubmission(
        base64Image,
        question.question,
        question.points || 10
      );

      const answer = await storage.createAnswer({
        attemptId,
        questionId: question.id,
        answerType: "photo",
        answerData: {
          imageSize: req.file.size,
          mimeType: req.file.mimetype,
        },
        score: assessment.score,
        maxScore: assessment.maxScore,
        aiAssessment: {
          feedback: assessment.feedback,
          criteria: assessment.criteria,
          type: "photo",
        },
        timeSpent: parseInt(timeSpent),
      });

      res.status(201).json(answer);
    } catch (error) {
      console.error("Photo assessment error:", error);
      res.status(500).json({ message: "Failed to assess photo response" });
    }
  });

  // Submit text answer
  app.post("/api/attempts/:attemptId/text", async (req, res) => {
    try {
      const attemptId = parseInt(req.params.attemptId);
      const { questionId, answer: textAnswer, timeSpent } = req.body;

      const question = await storage.getQuestion(questionId);
      if (!question) {
        return res.status(404).json({ message: "Question not found" });
      }

      // Assess text response with AI
      const assessment = await assessTextResponse(
        textAnswer,
        question.question,
        question.correctAnswer || undefined,
        question.points || 10
      );

      const answer = await storage.createAnswer({
        attemptId,
        questionId,
        answerType: "text",
        answerData: { answer: textAnswer },
        score: assessment.score,
        maxScore: assessment.maxScore,
        aiAssessment: {
          feedback: assessment.feedback,
          keyPoints: assessment.keyPoints,
          type: "text",
        },
        timeSpent,
      });

      res.status(201).json(answer);
    } catch (error) {
      console.error("Text assessment error:", error);
      res.status(500).json({ message: "Failed to assess text response" });
    }
  });

  // Complete test attempt
  app.patch("/api/attempts/:id/complete", async (req, res) => {
    try {
      const attemptId = parseInt(req.params.id);
      const { timeSpent } = req.body;

      const answers = await storage.getAnswersByAttempt(attemptId);
      const totalScore = answers.reduce((sum, answer) => sum + (answer.score || 0), 0);
      const maxScore = answers.reduce((sum, answer) => sum + (answer.maxScore || 0), 0);

      // Calculate AI overall rating (simplified)
      const avgCriteriaRating = answers
        .filter(a => a.aiAssessment && typeof a.aiAssessment === 'object' && 'criteria' in a.aiAssessment)
        .reduce((sum, a: any) => {
          const criteria = a.aiAssessment.criteria;
          if (criteria && typeof criteria === 'object') {
            const ratings = Object.values(criteria) as number[];
            return sum + ratings.reduce((s, r) => s + r, 0) / ratings.length;
          }
          return sum;
        }, 0) / Math.max(answers.length, 1) || 7;

      const attempt = await storage.updateTestAttempt(attemptId, {
        status: "completed",
        completedAt: new Date(),
        totalScore,
        maxScore,
        timeSpent,
        aiOverallRating: Math.round(avgCriteriaRating),
      });

      res.json(attempt);
    } catch (error) {
      res.status(500).json({ message: "Failed to complete attempt" });
    }
  });

  // Get user's test results
  app.get("/api/users/:userId/results", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const attempts = await storage.getAttemptsByUser(userId);
      
      const results = await Promise.all(
        attempts.map(async (attempt) => {
          const details = await storage.getAttemptWithDetails(attempt.id);
          return details;
        })
      );

      res.json(results.filter(Boolean));
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch results" });
    }
  });

  // Learning module endpoints
  app.get("/api/learning/modules", async (req, res) => {
    try {
      const modules = await storage.getPublishedModules();
      res.json(modules);
    } catch (error) {
      console.error("Error fetching learning modules:", error);
      res.status(500).json({ error: "Failed to fetch learning modules" });
    }
  });

  app.get("/api/learning/modules/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const module = await storage.getModuleWithLessons(id);
      if (!module) {
        return res.status(404).json({ error: "Module not found" });
      }
      res.json(module);
    } catch (error) {
      console.error("Error fetching module:", error);
      res.status(500).json({ error: "Failed to fetch module" });
    }
  });

  app.get("/api/learning/stats", async (req, res) => {
    try {
      // For now, assume user ID 1 (in a real app, get from session)
      const userId = 1;
      let stats = await storage.getUserGameStats(userId);
      
      if (!stats) {
        stats = await storage.createOrUpdateUserStats(userId, {
          totalXp: 0,
          level: 1,
          streak: 0,
          badges: [],
          achievements: [],
        });
      }
      
      res.json(stats);
    } catch (error) {
      console.error("Error fetching user stats:", error);
      res.status(500).json({ error: "Failed to fetch user stats" });
    }
  });

  app.get("/api/learning/lessons/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const lesson = await storage.getLesson(id);
      if (!lesson) {
        return res.status(404).json({ error: "Lesson not found" });
      }
      res.json(lesson);
    } catch (error) {
      console.error("Error fetching lesson:", error);
      res.status(500).json({ error: "Failed to fetch lesson" });
    }
  });

  app.post("/api/learning/progress", async (req, res) => {
    try {
      const progressData = req.body;
      const progress = await storage.createUserProgress(progressData);
      
      // Award XP to user
      if (progressData.isCompleted && progressData.userId) {
        const lesson = await storage.getLesson(progressData.lessonId);
        if (lesson?.xpReward) {
          await storage.addXpToUser(progressData.userId, lesson.xpReward);
          await storage.updateUserStreak(progressData.userId);
        }
      }
      
      res.json(progress);
    } catch (error) {
      console.error("Error creating progress:", error);
      res.status(500).json({ error: "Failed to create progress" });
    }
  });

  app.get("/api/learning/progress/:userId/:moduleId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const moduleId = parseInt(req.params.moduleId);
      const progress = await storage.getUserModuleProgress(userId, moduleId);
      res.json(progress);
    } catch (error) {
      console.error("Error fetching progress:", error);
      res.status(500).json({ error: "Failed to fetch progress" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

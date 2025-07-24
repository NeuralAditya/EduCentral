import { Router } from "express";
import { db } from "../db";
import { 
  topics, 
  quizzes, 
  quizQuestions, 
  quizAttempts, 
  topicProgress, 
  badges, 
  userBadges, 
  leaderboard,
  insertTopicSchema,
  insertQuizSchema,
  insertQuizQuestionSchema,
  insertQuizAttemptSchema,
  type Topic,
  type Quiz,
  type QuizQuestion,
  type QuizAttempt
} from "@shared/schema";
import { eq, desc, and, sql } from "drizzle-orm";

const router = Router();

// Get all topics
router.get("/topics", async (req, res) => {
  try {
    const allTopics = await db.select().from(topics).where(eq(topics.isActive, true));
    res.json(allTopics);
  } catch (error) {
    console.error("Error fetching topics:", error);
    res.status(500).json({ error: "Failed to fetch topics" });
  }
});

// Get topic by ID
router.get("/topics/:topicId", async (req, res) => {
  try {
    const topicId = parseInt(req.params.topicId);
    const [topic] = await db.select().from(topics).where(eq(topics.id, topicId));
    
    if (!topic) {
      return res.status(404).json({ error: "Topic not found" });
    }
    
    res.json(topic);
  } catch (error) {
    console.error("Error fetching topic:", error);
    res.status(500).json({ error: "Failed to fetch topic" });
  }
});

// Get quizzes for a topic
router.get("/topics/:topicId/quizzes", async (req, res) => {
  try {
    const topicId = parseInt(req.params.topicId);
    const topicQuizzes = await db
      .select()
      .from(quizzes)
      .where(and(eq(quizzes.topicId, topicId), eq(quizzes.isPublished, true)))
      .orderBy(quizzes.level, quizzes.id);
    
    res.json(topicQuizzes);
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    res.status(500).json({ error: "Failed to fetch quizzes" });
  }
});

// Get quiz by ID
router.get("/:quizId", async (req, res) => {
  try {
    const quizId = parseInt(req.params.quizId);
    const [quiz] = await db.select().from(quizzes).where(eq(quizzes.id, quizId));
    
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }
    
    res.json(quiz);
  } catch (error) {
    console.error("Error fetching quiz:", error);
    res.status(500).json({ error: "Failed to fetch quiz" });
  }
});

// Get quiz questions
router.get("/:quizId/questions", async (req, res) => {
  try {
    const quizId = parseInt(req.params.quizId);
    const questions = await db
      .select()
      .from(quizQuestions)
      .where(eq(quizQuestions.quizId, quizId))
      .orderBy(quizQuestions.orderIndex);
    
    res.json(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ error: "Failed to fetch questions" });
  }
});

// Submit quiz
router.post("/:quizId/submit", async (req, res) => {
  try {
    const quizId = parseInt(req.params.quizId);
    const { answers } = req.body;
    const userId = req.user?.id || 1; // Default user for demo
    
    // Get quiz and questions
    const [quiz] = await db.select().from(quizzes).where(eq(quizzes.id, quizId));
    const questions = await db
      .select()
      .from(quizQuestions)
      .where(eq(quizQuestions.quizId, quizId))
      .orderBy(quizQuestions.orderIndex);
    
    if (!quiz || !questions.length) {
      return res.status(404).json({ error: "Quiz not found" });
    }
    
    // Calculate score
    let correctAnswers = 0;
    const detailedAnswers = questions.map(question => {
      const userAnswer = answers[question.id] || "";
      const isCorrect = userAnswer === question.correctAnswer;
      if (isCorrect) correctAnswers++;
      
      return {
        questionId: question.id,
        question: question.question,
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        explanation: question.explanation
      };
    });
    
    const score = Math.round((correctAnswers / questions.length) * 100);
    const totalPoints = correctAnswers * quiz.pointsPerQuestion;
    
    // Save attempt
    const [attempt] = await db
      .insert(quizAttempts)
      .values({
        quizId,
        userId,
        score,
        totalQuestions: questions.length,
        correctAnswers,
        timeSpent: 0, // Would track actual time in real implementation
        answers: detailedAnswers
      })
      .returning();
    
    res.json({
      attemptId: attempt.id,
      score,
      correctAnswers,
      totalQuestions: questions.length,
      totalPoints,
      passed: score >= quiz.passingScore
    });
  } catch (error) {
    console.error("Error submitting quiz:", error);
    res.status(500).json({ error: "Failed to submit quiz" });
  }
});

// Get quiz attempt results
router.get("/attempts/:attemptId", async (req, res) => {
  try {
    const attemptId = parseInt(req.params.attemptId);
    const [attempt] = await db
      .select()
      .from(quizAttempts)
      .where(eq(quizAttempts.id, attemptId));
    
    if (!attempt) {
      return res.status(404).json({ error: "Attempt not found" });
    }
    
    res.json(attempt);
  } catch (error) {
    console.error("Error fetching attempt:", error);
    res.status(500).json({ error: "Failed to fetch attempt" });
  }
});

// Get user progress for all topics
router.get("/user-progress", async (req, res) => {
  try {
    const userId = req.user?.id || 1; // Default user for demo
    
    // This would fetch actual user progress from the database
    // For now, returning mock data
    res.json({
      totalQuizzes: 15,
      completedQuizzes: 8,
      totalPoints: 1250,
      averageScore: 85,
      rank: 15,
      badges: ['first-quiz', 'quick-learner', 'consistent']
    });
  } catch (error) {
    console.error("Error fetching user progress:", error);
    res.status(500).json({ error: "Failed to fetch user progress" });
  }
});

export default router;
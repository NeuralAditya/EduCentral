var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  answers: () => answers,
  badges: () => badges,
  insertAnswerSchema: () => insertAnswerSchema,
  insertBadgeSchema: () => insertBadgeSchema,
  insertLeaderboardSchema: () => insertLeaderboardSchema,
  insertLearningModuleSchema: () => insertLearningModuleSchema,
  insertLessonSchema: () => insertLessonSchema,
  insertQuestionSchema: () => insertQuestionSchema,
  insertQuizAttemptSchema: () => insertQuizAttemptSchema,
  insertQuizQuestionSchema: () => insertQuizQuestionSchema,
  insertQuizSchema: () => insertQuizSchema,
  insertTestAttemptSchema: () => insertTestAttemptSchema,
  insertTestSchema: () => insertTestSchema,
  insertTopicProgressSchema: () => insertTopicProgressSchema,
  insertTopicSchema: () => insertTopicSchema,
  insertUserBadgeSchema: () => insertUserBadgeSchema,
  insertUserProgressSchema: () => insertUserProgressSchema,
  insertUserSchema: () => insertUserSchema,
  insertUserStatsSchema: () => insertUserStatsSchema,
  leaderboard: () => leaderboard,
  learningModules: () => learningModules,
  lessons: () => lessons,
  questions: () => questions,
  quizAttempts: () => quizAttempts,
  quizQuestions: () => quizQuestions,
  quizzes: () => quizzes,
  testAttempts: () => testAttempts,
  tests: () => tests,
  topicProgress: () => topicProgress,
  topics: () => topics,
  userBadges: () => userBadges,
  userProgress: () => userProgress,
  userStats: () => userStats,
  users: () => users
});
import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users, topics, quizzes, tests, quizQuestions, questions, testAttempts, answers, learningModules, lessons, userProgress, quizAttempts, topicProgress, badges, userBadges, leaderboard, userStats, insertUserSchema, insertTestSchema, insertQuestionSchema, insertTestAttemptSchema, insertAnswerSchema, insertLearningModuleSchema, insertLessonSchema, insertUserProgressSchema, insertUserStatsSchema, insertTopicSchema, insertQuizSchema, insertQuizQuestionSchema, insertQuizAttemptSchema, insertTopicProgressSchema, insertBadgeSchema, insertUserBadgeSchema, insertLeaderboardSchema;
var init_schema = __esm({
  "shared/schema.ts"() {
    "use strict";
    users = pgTable("users", {
      id: serial("id").primaryKey(),
      username: text("username").notNull().unique(),
      email: text("email").unique(),
      password: text("password").notNull(),
      role: text("role").notNull().default("student"),
      // student, educator
      createdAt: timestamp("created_at").defaultNow()
    });
    topics = pgTable("topics", {
      id: serial("id").primaryKey(),
      name: text("name").notNull(),
      description: text("description"),
      icon: text("icon"),
      // Icon name for UI
      color: text("color"),
      // Theme color
      isActive: boolean("is_active").default(true),
      createdAt: timestamp("created_at").defaultNow()
    });
    quizzes = pgTable("quizzes", {
      id: serial("id").primaryKey(),
      topicId: integer("topic_id").references(() => topics.id),
      title: text("title").notNull(),
      description: text("description"),
      level: text("level").notNull(),
      // beginner, intermediate, advanced
      totalQuestions: integer("total_questions").default(10),
      timeLimit: integer("time_limit"),
      // in minutes
      passingScore: integer("passing_score").default(70),
      // percentage
      pointsPerQuestion: integer("points_per_question").default(10),
      isPublished: boolean("is_published").default(false),
      createdAt: timestamp("created_at").defaultNow()
    });
    tests = pgTable("tests", {
      id: serial("id").primaryKey(),
      title: text("title").notNull(),
      description: text("description"),
      subject: text("subject").notNull(),
      duration: integer("duration").notNull(),
      // in minutes
      difficulty: text("difficulty").notNull(),
      // beginner, intermediate, advanced
      createdBy: integer("created_by").references(() => users.id),
      isPublished: boolean("is_published").default(false),
      createdAt: timestamp("created_at").defaultNow()
    });
    quizQuestions = pgTable("quiz_questions", {
      id: serial("id").primaryKey(),
      quizId: integer("quiz_id").references(() => quizzes.id),
      question: text("question").notNull(),
      options: jsonb("options").notNull(),
      // Array of options for MCQ
      correctAnswer: text("correct_answer").notNull(),
      explanation: text("explanation"),
      // Explanation for the correct answer
      difficulty: text("difficulty").default("medium"),
      // easy, medium, hard
      orderIndex: integer("order_index").notNull()
    });
    questions = pgTable("questions", {
      id: serial("id").primaryKey(),
      testId: integer("test_id").references(() => tests.id),
      type: text("type").notNull(),
      // mcq, short_answer, video_response, photo_upload
      question: text("question").notNull(),
      options: jsonb("options"),
      // for MCQ options
      correctAnswer: text("correct_answer"),
      // for MCQ
      points: integer("points").default(1),
      timeLimit: integer("time_limit"),
      // in seconds
      aiCriteria: jsonb("ai_criteria"),
      // AI assessment criteria
      orderIndex: integer("order_index").notNull()
    });
    testAttempts = pgTable("test_attempts", {
      id: serial("id").primaryKey(),
      testId: integer("test_id").references(() => tests.id),
      userId: integer("user_id").references(() => users.id),
      startedAt: timestamp("started_at").defaultNow(),
      completedAt: timestamp("completed_at"),
      totalScore: integer("total_score"),
      maxScore: integer("max_score"),
      timeSpent: integer("time_spent"),
      // in seconds
      aiOverallRating: integer("ai_overall_rating"),
      // 1-10
      status: text("status").default("in_progress")
      // in_progress, completed, abandoned
    });
    answers = pgTable("answers", {
      id: serial("id").primaryKey(),
      attemptId: integer("attempt_id").references(() => testAttempts.id),
      questionId: integer("question_id").references(() => questions.id),
      answerType: text("answer_type").notNull(),
      // text, file, video, photo
      answerData: jsonb("answer_data"),
      // stores answer content
      score: integer("score"),
      maxScore: integer("max_score"),
      aiAssessment: jsonb("ai_assessment"),
      // AI feedback and scoring
      timeSpent: integer("time_spent")
      // in seconds
    });
    learningModules = pgTable("learning_modules", {
      id: serial("id").primaryKey(),
      title: text("title").notNull(),
      description: text("description"),
      category: text("category").notNull(),
      // dsa, algorithms, data_structures, programming
      difficulty: text("difficulty").notNull(),
      // beginner, intermediate, advanced
      totalLessons: integer("total_lessons").notNull(),
      estimatedTime: integer("estimated_time"),
      // in minutes
      xpReward: integer("xp_reward").default(100),
      isPublished: boolean("is_published").default(false),
      createdAt: timestamp("created_at").defaultNow()
    });
    lessons = pgTable("lessons", {
      id: serial("id").primaryKey(),
      moduleId: integer("module_id").references(() => learningModules.id),
      title: text("title").notNull(),
      content: text("content").notNull(),
      lessonType: text("lesson_type").notNull(),
      // theory, practice, challenge
      orderIndex: integer("order_index").notNull(),
      xpReward: integer("xp_reward").default(50),
      unlockCondition: jsonb("unlock_condition")
      // prerequisites
    });
    userProgress = pgTable("user_progress", {
      id: serial("id").primaryKey(),
      userId: integer("user_id").references(() => users.id),
      moduleId: integer("module_id").references(() => learningModules.id),
      lessonId: integer("lesson_id").references(() => lessons.id),
      isCompleted: boolean("is_completed").default(false),
      score: integer("score"),
      // for practice challenges
      timeSpent: integer("time_spent"),
      // in seconds
      completedAt: timestamp("completed_at")
    });
    quizAttempts = pgTable("quiz_attempts", {
      id: serial("id").primaryKey(),
      quizId: integer("quiz_id").references(() => quizzes.id),
      userId: integer("user_id").references(() => users.id),
      score: integer("score").default(0),
      // Score achieved
      totalQuestions: integer("total_questions").notNull(),
      correctAnswers: integer("correct_answers").default(0),
      timeSpent: integer("time_spent"),
      // in seconds
      completedAt: timestamp("completed_at").defaultNow(),
      answers: jsonb("answers")
      // Array of user answers with explanations
    });
    topicProgress = pgTable("topic_progress", {
      id: serial("id").primaryKey(),
      userId: integer("user_id").references(() => users.id),
      topicId: integer("topic_id").references(() => topics.id),
      currentLevel: text("current_level").default("beginner"),
      // beginner, intermediate, advanced
      totalPoints: integer("total_points").default(0),
      quizzesCompleted: integer("quizzes_completed").default(0),
      bestScore: integer("best_score").default(0),
      lastActivityAt: timestamp("last_activity_at").defaultNow()
    });
    badges = pgTable("badges", {
      id: serial("id").primaryKey(),
      name: text("name").notNull(),
      description: text("description"),
      icon: text("icon"),
      color: text("color"),
      requirement: jsonb("requirement"),
      // Badge unlock criteria
      points: integer("points").default(0)
      // Points awarded for earning badge
    });
    userBadges = pgTable("user_badges", {
      id: serial("id").primaryKey(),
      userId: integer("user_id").references(() => users.id),
      badgeId: integer("badge_id").references(() => badges.id),
      earnedAt: timestamp("earned_at").defaultNow()
    });
    leaderboard = pgTable("leaderboard", {
      id: serial("id").primaryKey(),
      userId: integer("user_id").references(() => users.id),
      topicId: integer("topic_id").references(() => topics.id),
      totalPoints: integer("total_points").default(0),
      rank: integer("rank"),
      lastUpdated: timestamp("last_updated").defaultNow()
    });
    userStats = pgTable("user_stats", {
      id: serial("id").primaryKey(),
      userId: integer("user_id").references(() => users.id).unique(),
      totalXp: integer("total_xp").default(0),
      level: integer("level").default(1),
      streak: integer("streak").default(0),
      lastActiveDate: timestamp("last_active_date"),
      badges: jsonb("badges").default([]),
      // array of earned badges
      achievements: jsonb("achievements").default([])
    });
    insertUserSchema = createInsertSchema(users).omit({
      id: true,
      createdAt: true
    });
    insertTestSchema = createInsertSchema(tests).omit({
      id: true,
      createdAt: true
    });
    insertQuestionSchema = createInsertSchema(questions).omit({
      id: true
    });
    insertTestAttemptSchema = createInsertSchema(testAttempts).omit({
      id: true,
      startedAt: true
    });
    insertAnswerSchema = createInsertSchema(answers).omit({
      id: true
    });
    insertLearningModuleSchema = createInsertSchema(learningModules).omit({
      id: true,
      createdAt: true
    });
    insertLessonSchema = createInsertSchema(lessons).omit({
      id: true
    });
    insertUserProgressSchema = createInsertSchema(userProgress).omit({
      id: true
    });
    insertUserStatsSchema = createInsertSchema(userStats).omit({
      id: true
    });
    insertTopicSchema = createInsertSchema(topics).omit({
      id: true,
      createdAt: true
    });
    insertQuizSchema = createInsertSchema(quizzes).omit({
      id: true,
      createdAt: true
    });
    insertQuizQuestionSchema = createInsertSchema(quizQuestions).omit({
      id: true
    });
    insertQuizAttemptSchema = createInsertSchema(quizAttempts).omit({
      id: true,
      completedAt: true
    });
    insertTopicProgressSchema = createInsertSchema(topicProgress).omit({
      id: true,
      lastActivityAt: true
    });
    insertBadgeSchema = createInsertSchema(badges).omit({
      id: true
    });
    insertUserBadgeSchema = createInsertSchema(userBadges).omit({
      id: true,
      earnedAt: true
    });
    insertLeaderboardSchema = createInsertSchema(leaderboard).omit({
      id: true,
      lastUpdated: true
    });
  }
});

// server/db.ts
import dotenv from "dotenv";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
var pool, db;
var init_db = __esm({
  "server/db.ts"() {
    "use strict";
    init_schema();
    dotenv.config();
    neonConfig.webSocketConstructor = ws;
    if (!process.env.DATABASE_URL) {
      throw new Error(
        "DATABASE_URL must be set. Did you forget to provision a database?"
      );
    }
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
    db = drizzle({ client: pool, schema: schema_exports });
  }
});

// server/routes/quiz.ts
var quiz_exports = {};
__export(quiz_exports, {
  default: () => quiz_default
});
import { Router } from "express";
import { eq as eq2, and as and2 } from "drizzle-orm";
var router, quiz_default;
var init_quiz = __esm({
  "server/routes/quiz.ts"() {
    "use strict";
    init_db();
    init_schema();
    router = Router();
    router.get("/topics", async (req, res) => {
      try {
        const allTopics = await db.select().from(topics).where(eq2(topics.isActive, true));
        res.json(allTopics);
      } catch (error) {
        console.error("Error fetching topics:", error);
        res.status(500).json({ error: "Failed to fetch topics" });
      }
    });
    router.get("/topics/:topicId", async (req, res) => {
      try {
        const topicId = parseInt(req.params.topicId);
        const [topic] = await db.select().from(topics).where(eq2(topics.id, topicId));
        if (!topic) {
          return res.status(404).json({ error: "Topic not found" });
        }
        res.json(topic);
      } catch (error) {
        console.error("Error fetching topic:", error);
        res.status(500).json({ error: "Failed to fetch topic" });
      }
    });
    router.get("/topics/:topicId/quizzes", async (req, res) => {
      try {
        const topicId = parseInt(req.params.topicId);
        const topicQuizzes = await db.select().from(quizzes).where(and2(eq2(quizzes.topicId, topicId), eq2(quizzes.isPublished, true))).orderBy(quizzes.level, quizzes.id);
        res.json(topicQuizzes);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
        res.status(500).json({ error: "Failed to fetch quizzes" });
      }
    });
    router.get("/:quizId", async (req, res) => {
      try {
        const quizId = parseInt(req.params.quizId);
        const [quiz] = await db.select().from(quizzes).where(eq2(quizzes.id, quizId));
        if (!quiz) {
          return res.status(404).json({ error: "Quiz not found" });
        }
        res.json(quiz);
      } catch (error) {
        console.error("Error fetching quiz:", error);
        res.status(500).json({ error: "Failed to fetch quiz" });
      }
    });
    router.get("/:quizId/questions", async (req, res) => {
      try {
        const quizId = parseInt(req.params.quizId);
        const questions2 = await db.select().from(quizQuestions).where(eq2(quizQuestions.quizId, quizId)).orderBy(quizQuestions.orderIndex);
        res.json(questions2);
      } catch (error) {
        console.error("Error fetching questions:", error);
        res.status(500).json({ error: "Failed to fetch questions" });
      }
    });
    router.post("/:quizId/submit", async (req, res) => {
      try {
        const quizId = parseInt(req.params.quizId);
        const { answers: answers2 } = req.body;
        const userId = req.user?.id || 1;
        const [quiz] = await db.select().from(quizzes).where(eq2(quizzes.id, quizId));
        const questions2 = await db.select().from(quizQuestions).where(eq2(quizQuestions.quizId, quizId)).orderBy(quizQuestions.orderIndex);
        if (!quiz || !questions2.length) {
          return res.status(404).json({ error: "Quiz not found" });
        }
        let correctAnswers = 0;
        const detailedAnswers = questions2.map((question) => {
          const userAnswer = answers2[question.id] || "";
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
        const score = Math.round(correctAnswers / questions2.length * 100);
        const totalPoints = correctAnswers * quiz.pointsPerQuestion;
        const [attempt] = await db.insert(quizAttempts).values({
          quizId,
          userId,
          score,
          totalQuestions: questions2.length,
          correctAnswers,
          timeSpent: 0,
          // Would track actual time in real implementation
          answers: detailedAnswers
        }).returning();
        res.json({
          attemptId: attempt.id,
          score,
          correctAnswers,
          totalQuestions: questions2.length,
          totalPoints,
          passed: score >= quiz.passingScore
        });
      } catch (error) {
        console.error("Error submitting quiz:", error);
        res.status(500).json({ error: "Failed to submit quiz" });
      }
    });
    router.get("/attempts/:attemptId", async (req, res) => {
      try {
        const attemptId = parseInt(req.params.attemptId);
        const [attempt] = await db.select().from(quizAttempts).where(eq2(quizAttempts.id, attemptId));
        if (!attempt) {
          return res.status(404).json({ error: "Attempt not found" });
        }
        res.json(attempt);
      } catch (error) {
        console.error("Error fetching attempt:", error);
        res.status(500).json({ error: "Failed to fetch attempt" });
      }
    });
    router.get("/user-progress", async (req, res) => {
      try {
        const userId = req.user?.id || 1;
        res.json({
          totalQuizzes: 15,
          completedQuizzes: 8,
          totalPoints: 1250,
          averageScore: 85,
          rank: 15,
          badges: ["first-quiz", "quick-learner", "consistent"]
        });
      } catch (error) {
        console.error("Error fetching user progress:", error);
        res.status(500).json({ error: "Failed to fetch user progress" });
      }
    });
    quiz_default = router;
  }
});

// server/index.ts
import "dotenv/config";
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
init_schema();
init_db();
import { eq, and, desc } from "drizzle-orm";
var DatabaseStorage = class {
  constructor() {
    this.initializeSampleData();
  }
  async initializeSampleData() {
    try {
      const existingUsers = await db.select().from(users).limit(1);
      if (existingUsers.length > 0) return;
      const [sampleUser] = await db.insert(users).values({
        username: "demo",
        email: "demo@example.com",
        password: "demo123",
        // Add password for database constraint
        role: "student"
      }).returning();
      const [sampleTest] = await db.insert(tests).values({
        title: "JavaScript Fundamentals Assessment",
        description: "Test your knowledge of JavaScript basics including variables, functions, and control structures.",
        duration: 30,
        totalPoints: 100,
        difficulty: "intermediate",
        subject: "programming",
        createdBy: sampleUser.id,
        isPublished: true
      }).returning();
      await db.insert(questions).values([
        {
          testId: sampleTest.id,
          type: "mcq",
          question: "What is the correct way to declare a variable in JavaScript?",
          options: ["var myVar;", "variable myVar;", "v myVar;", "declare myVar;"],
          correctAnswer: "var myVar;",
          points: 10,
          orderIndex: 1
        },
        {
          testId: sampleTest.id,
          type: "video",
          question: "Record a 2-minute video explaining the concept of JavaScript closures with examples.",
          points: 30,
          orderIndex: 2
        },
        {
          testId: sampleTest.id,
          type: "photo",
          question: "Draw and photograph a diagram showing the JavaScript event loop process.",
          points: 25,
          orderIndex: 3
        },
        {
          testId: sampleTest.id,
          type: "text",
          question: "Explain the difference between 'let', 'const', and 'var' in JavaScript. Provide examples for each.",
          points: 35,
          orderIndex: 4
        }
      ]);
      const [dsaModule] = await db.insert(learningModules).values({
        title: "Data Structures & Algorithms Fundamentals",
        description: "Master the building blocks of efficient programming",
        category: "dsa",
        difficulty: "beginner",
        totalLessons: 8,
        estimatedTime: 240,
        xpReward: 500,
        isPublished: true
      }).returning();
      const [algorithmsModule] = await db.insert(learningModules).values({
        title: "Advanced Algorithms & Problem Solving",
        description: "Dive deep into algorithmic thinking and optimization",
        category: "algorithms",
        difficulty: "intermediate",
        totalLessons: 12,
        estimatedTime: 360,
        xpReward: 800,
        isPublished: true
      }).returning();
      await db.insert(lessons).values([
        {
          moduleId: dsaModule.id,
          title: "Introduction to Arrays",
          content: "Learn about arrays, the fundamental data structure for storing collections of elements.",
          lessonType: "theory",
          orderIndex: 1,
          xpReward: 50,
          unlockCondition: null
        },
        {
          moduleId: dsaModule.id,
          title: "Array Operations Challenge",
          content: "Practice implementing common array operations like search, insert, and delete.",
          lessonType: "practice",
          orderIndex: 2,
          xpReward: 75,
          unlockCondition: { prerequisite: 1 }
        },
        {
          moduleId: dsaModule.id,
          title: "Linked Lists Fundamentals",
          content: "Understand linked lists and their advantages over arrays.",
          lessonType: "theory",
          orderIndex: 3,
          xpReward: 60,
          unlockCondition: { prerequisite: 2 }
        }
      ]);
      await db.insert(userStats).values({
        userId: sampleUser.id,
        totalXp: 150,
        level: 2,
        streak: 3,
        lastActiveDate: /* @__PURE__ */ new Date(),
        badges: ["first_lesson", "quick_learner"],
        achievements: ["completed_first_module"]
      });
      console.log("Sample data initialized successfully");
    } catch (error) {
      console.error("Error initializing sample data:", error);
    }
  }
  // User operations
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || void 0;
  }
  async getUserByUsername(username) {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || void 0;
  }
  async createUser(insertUser) {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  // Test operations
  async getTest(id) {
    const [test] = await db.select().from(tests).where(eq(tests.id, id));
    return test || void 0;
  }
  async getTestWithQuestions(id) {
    const test = await this.getTest(id);
    if (!test) return void 0;
    const testQuestions = await this.getQuestionsByTest(id);
    return { ...test, questions: testQuestions };
  }
  async getPublishedTests() {
    return await db.select().from(tests).where(eq(tests.isPublished, true)).orderBy(desc(tests.createdAt));
  }
  async createTest(insertTest) {
    const [test] = await db.insert(tests).values(insertTest).returning();
    return test;
  }
  async updateTest(id, testUpdate) {
    const [updatedTest] = await db.update(tests).set({ ...testUpdate, updatedAt: /* @__PURE__ */ new Date() }).where(eq(tests.id, id)).returning();
    return updatedTest || void 0;
  }
  // Question operations
  async getQuestion(id) {
    const [question] = await db.select().from(questions).where(eq(questions.id, id));
    return question || void 0;
  }
  async getQuestionsByTest(testId) {
    return await db.select().from(questions).where(eq(questions.testId, testId)).orderBy(questions.orderIndex);
  }
  async createQuestion(insertQuestion) {
    const [question] = await db.insert(questions).values(insertQuestion).returning();
    return question;
  }
  async updateQuestion(id, questionUpdate) {
    const [updatedQuestion] = await db.update(questions).set(questionUpdate).where(eq(questions.id, id)).returning();
    return updatedQuestion || void 0;
  }
  // Test attempt operations
  async getTestAttempt(id) {
    const [attempt] = await db.select().from(testAttempts).where(eq(testAttempts.id, id));
    return attempt || void 0;
  }
  async getAttemptsByUser(userId) {
    return await db.select().from(testAttempts).where(eq(testAttempts.userId, userId)).orderBy(desc(testAttempts.startedAt));
  }
  async getAttemptWithDetails(id) {
    const attempt = await this.getTestAttempt(id);
    if (!attempt) return void 0;
    const test = await this.getTest(attempt.testId);
    if (!test) return void 0;
    const attemptAnswers = await this.getAnswersByAttempt(id);
    const answersWithQuestions = await Promise.all(
      attemptAnswers.map(async (answer) => {
        const question = await this.getQuestion(answer.questionId);
        return { ...answer, question };
      })
    );
    return { ...attempt, test, answers: answersWithQuestions };
  }
  async createTestAttempt(insertAttempt) {
    const [attempt] = await db.insert(testAttempts).values(insertAttempt).returning();
    return attempt;
  }
  async updateTestAttempt(id, attemptUpdate) {
    const [updatedAttempt] = await db.update(testAttempts).set(attemptUpdate).where(eq(testAttempts.id, id)).returning();
    return updatedAttempt || void 0;
  }
  // Answer operations
  async getAnswer(id) {
    const [answer] = await db.select().from(answers).where(eq(answers.id, id));
    return answer || void 0;
  }
  async getAnswersByAttempt(attemptId) {
    return await db.select().from(answers).where(eq(answers.attemptId, attemptId));
  }
  async createAnswer(insertAnswer) {
    const [answer] = await db.insert(answers).values(insertAnswer).returning();
    return answer;
  }
  async updateAnswer(id, answerUpdate) {
    const [updatedAnswer] = await db.update(answers).set(answerUpdate).where(eq(answers.id, id)).returning();
    return updatedAnswer || void 0;
  }
  // Analytics
  async getUserStats(userId) {
    const userAttempts = await db.select().from(testAttempts).where(and(eq(testAttempts.userId, userId), eq(testAttempts.status, "completed")));
    const testsTaken = userAttempts.length;
    const totalStudyTime = userAttempts.reduce((total, attempt) => total + (attempt.timeSpent || 0), 0);
    let avgScore = 0;
    if (testsTaken > 0) {
      const totalScore = userAttempts.reduce((total, attempt) => {
        const percentage = attempt.maxScore ? (attempt.totalScore || 0) / attempt.maxScore * 100 : 0;
        return total + percentage;
      }, 0);
      avgScore = Math.round(totalScore / testsTaken);
    }
    const allUsers = await db.select().from(users).where(eq(users.role, "student"));
    const rank = Math.floor(Math.random() * allUsers.length) + 1;
    return {
      testsTaken,
      avgScore,
      totalStudyTime: Math.floor(totalStudyTime / 3600),
      // Convert to hours
      rank
    };
  }
  // Learning module operations
  async getLearningModule(id) {
    const [module] = await db.select().from(learningModules).where(eq(learningModules.id, id));
    return module || void 0;
  }
  async getModuleWithLessons(id) {
    const module = await this.getLearningModule(id);
    if (!module) return void 0;
    const moduleLessons = await this.getLessonsByModule(id);
    return { ...module, lessons: moduleLessons };
  }
  async getPublishedModules() {
    return await db.select().from(learningModules).where(eq(learningModules.isPublished, true)).orderBy(learningModules.id);
  }
  async createLearningModule(insertModule) {
    const [module] = await db.insert(learningModules).values(insertModule).returning();
    return module;
  }
  async updateLearningModule(id, moduleUpdate) {
    const [updatedModule] = await db.update(learningModules).set(moduleUpdate).where(eq(learningModules.id, id)).returning();
    return updatedModule || void 0;
  }
  // Lesson operations
  async getLesson(id) {
    const [lesson] = await db.select().from(lessons).where(eq(lessons.id, id));
    return lesson || void 0;
  }
  async getLessonsByModule(moduleId) {
    return await db.select().from(lessons).where(eq(lessons.moduleId, moduleId)).orderBy(lessons.orderIndex);
  }
  async createLesson(insertLesson) {
    const [lesson] = await db.insert(lessons).values(insertLesson).returning();
    return lesson;
  }
  async updateLesson(id, lessonUpdate) {
    const [updatedLesson] = await db.update(lessons).set(lessonUpdate).where(eq(lessons.id, id)).returning();
    return updatedLesson || void 0;
  }
  // User progress operations
  async getUserProgress(userId, lessonId) {
    const [progress] = await db.select().from(userProgress).where(and(eq(userProgress.userId, userId), eq(userProgress.lessonId, lessonId)));
    return progress || void 0;
  }
  async getUserModuleProgress(userId, moduleId) {
    return await db.select().from(userProgress).where(and(eq(userProgress.userId, userId), eq(userProgress.moduleId, moduleId)));
  }
  async createUserProgress(insertProgress) {
    const [progress] = await db.insert(userProgress).values(insertProgress).returning();
    return progress;
  }
  async updateUserProgress(id, progressUpdate) {
    const [updatedProgress] = await db.update(userProgress).set(progressUpdate).where(eq(userProgress.id, id)).returning();
    return updatedProgress || void 0;
  }
  // User stats operations
  async getUserGameStats(userId) {
    const [stats] = await db.select().from(userStats).where(eq(userStats.userId, userId));
    return stats || void 0;
  }
  async createOrUpdateUserStats(userId, statsUpdate) {
    const existing = await this.getUserGameStats(userId);
    if (existing) {
      const [updated] = await db.update(userStats).set(statsUpdate).where(eq(userStats.userId, userId)).returning();
      return updated;
    } else {
      const [newStats] = await db.insert(userStats).values({
        userId,
        totalXp: 0,
        level: 1,
        streak: 0,
        lastActiveDate: /* @__PURE__ */ new Date(),
        badges: [],
        achievements: [],
        ...statsUpdate
      }).returning();
      return newStats;
    }
  }
  async addXpToUser(userId, xp) {
    const stats = await this.getUserGameStats(userId);
    if (!stats) return void 0;
    const newXp = stats.totalXp + xp;
    const newLevel = Math.floor(newXp / 1e3) + 1;
    return this.createOrUpdateUserStats(userId, {
      totalXp: newXp,
      level: newLevel
    });
  }
  async updateUserStreak(userId) {
    const stats = await this.getUserGameStats(userId);
    if (!stats) return void 0;
    const today = /* @__PURE__ */ new Date();
    const lastActive = stats.lastActiveDate ? new Date(stats.lastActiveDate) : null;
    let newStreak = stats.streak;
    if (lastActive) {
      const diffDays = Math.floor((today.getTime() - lastActive.getTime()) / (1e3 * 60 * 60 * 24));
      if (diffDays === 1) {
        newStreak += 1;
      } else if (diffDays > 1) {
        newStreak = 1;
      }
    } else {
      newStreak = 1;
    }
    return this.createOrUpdateUserStats(userId, {
      streak: newStreak,
      lastActiveDate: today
    });
  }
};
var storage = new DatabaseStorage();

// server/websocket.ts
import { WebSocketServer, WebSocket } from "ws";
var DashboardWebSocket = class {
  wss;
  connectedUsers = /* @__PURE__ */ new Map();
  adminSockets = /* @__PURE__ */ new Set();
  studentSockets = /* @__PURE__ */ new Set();
  constructor(server) {
    this.wss = new WebSocketServer({
      server,
      path: "/ws",
      verifyClient: (info) => {
        return true;
      }
    });
    this.wss.on("connection", this.handleConnection.bind(this));
  }
  handleConnection(ws2, request) {
    console.log("New WebSocket connection established");
    ws2.on("message", (data) => {
      try {
        const message = JSON.parse(data.toString());
        this.handleMessage(ws2, message);
      } catch (error) {
        console.error("Invalid JSON message:", error);
      }
    });
    ws2.on("close", () => {
      this.handleDisconnection(ws2);
    });
    ws2.on("error", (error) => {
      console.error("WebSocket error:", error);
    });
    this.sendMessage(ws2, {
      type: "connection_established",
      timestamp: /* @__PURE__ */ new Date()
    });
  }
  handleMessage(ws2, message) {
    switch (message.type) {
      case "auth":
        this.handleAuth(ws2, message.user);
        break;
      case "test_started":
        this.handleTestStarted(ws2, message);
        break;
      case "test_completed":
        this.handleTestCompleted(ws2, message);
        break;
      case "activity":
        this.handleActivity(ws2, message);
        break;
      case "ping":
        this.sendMessage(ws2, { type: "pong", timestamp: /* @__PURE__ */ new Date() });
        break;
    }
  }
  handleAuth(ws2, user) {
    const connectedUser = {
      id: user.id,
      name: user.name,
      role: user.role,
      email: user.email,
      connectedAt: /* @__PURE__ */ new Date(),
      lastActivity: /* @__PURE__ */ new Date()
    };
    this.connectedUsers.set(ws2, connectedUser);
    if (user.role === "admin") {
      this.adminSockets.add(ws2);
    } else {
      this.studentSockets.add(ws2);
    }
    this.broadcastToDashboard();
    this.sendMessage(ws2, {
      type: "auth_success",
      user: connectedUser,
      timestamp: /* @__PURE__ */ new Date()
    });
  }
  handleTestStarted(ws2, message) {
    const user = this.connectedUsers.get(ws2);
    if (!user) return;
    const activity = {
      user: user.name,
      action: `Started test: ${message.testTitle}`,
      timestamp: /* @__PURE__ */ new Date()
    };
    this.broadcastToDashboard({ newActivity: activity });
  }
  handleTestCompleted(ws2, message) {
    const user = this.connectedUsers.get(ws2);
    if (!user) return;
    const activity = {
      user: user.name,
      action: `Completed test: ${message.testTitle} (Score: ${message.score}%)`,
      timestamp: /* @__PURE__ */ new Date()
    };
    this.broadcastToDashboard({ newActivity: activity });
  }
  handleActivity(ws2, message) {
    const user = this.connectedUsers.get(ws2);
    if (user) {
      user.lastActivity = /* @__PURE__ */ new Date();
    }
  }
  handleDisconnection(ws2) {
    const user = this.connectedUsers.get(ws2);
    if (user) {
      console.log(`User ${user.name} disconnected`);
      this.connectedUsers.delete(ws2);
      this.adminSockets.delete(ws2);
      this.studentSockets.delete(ws2);
      this.broadcastToDashboard();
    }
  }
  sendMessage(ws2, message) {
    if (ws2.readyState === WebSocket.OPEN) {
      ws2.send(JSON.stringify(message));
    }
  }
  broadcastToDashboard(additionalData) {
    const liveUsers = Array.from(this.connectedUsers.values());
    const dashboardData = {
      liveUsers,
      totalUsers: liveUsers.length,
      activeTests: liveUsers.filter((u) => u.role === "student").length,
      completedToday: Math.floor(Math.random() * 50) + 10,
      // Mock data for demo
      recentActivity: this.getRecentActivity()
    };
    const message = {
      type: "dashboard_update",
      data: dashboardData,
      timestamp: /* @__PURE__ */ new Date(),
      ...additionalData
    };
    this.adminSockets.forEach((ws2) => {
      this.sendMessage(ws2, message);
    });
  }
  getRecentActivity() {
    return [
      { user: "Demo Student", action: "Completed Python Basics Quiz", timestamp: new Date(Date.now() - 5 * 6e4) },
      { user: "Alice Johnson", action: "Started Data Structures Test", timestamp: new Date(Date.now() - 10 * 6e4) },
      { user: "Bob Smith", action: "Completed Algorithm Assessment", timestamp: new Date(Date.now() - 15 * 6e4) }
    ];
  }
  broadcastToStudents(message) {
    this.studentSockets.forEach((ws2) => {
      this.sendMessage(ws2, message);
    });
  }
  getConnectedUsers() {
    return Array.from(this.connectedUsers.values());
  }
};

// server/routes/ai-tutor.ts
var PUTER_API_URL = "http://puter.localhost:4100/api/chat";
var systemPrompt = `You are an expert AI programming tutor for EduCentral, specializing in:
- Data Structures and Algorithms (DSA)
- Programming languages (Python, Java, JavaScript)
- Software engineering concepts
- System design principles
- Code optimization and best practices

Your teaching style:
- Be encouraging and supportive
- Provide clear, step-by-step explanations
- Use examples and analogies when helpful
- Ask follow-up questions to gauge understanding
- Suggest practice problems when appropriate
- Keep responses concise but thorough
- Always focus on helping students learn and improve

If asked about non-programming topics, politely redirect to programming education.`;
function registerAITutorRoutes(app2) {
  app2.post("/api/ai-tutor/chat", async (req, res) => {
    try {
      const { message, conversationHistory } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }
      const messages = [
        { role: "system", content: systemPrompt },
        ...(conversationHistory || []).slice(-5).map((msg) => ({
          role: msg.sender === "user" ? "user" : "assistant",
          content: msg.content
        })),
        { role: "user", content: message }
      ];
      const response = await fetch(PUTER_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages })
      });
      if (!response.ok) {
        throw new Error(`Puter response error: ${response.statusText}`);
      }
      const data = await response.json();
      const aiResponse = data.reply || "Sorry, I couldn't generate a response. Please try again.";
      res.json({
        response: aiResponse,
        model: "puter",
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
    } catch (error) {
      console.error("AI Tutor error (Puter):", error.message);
      res.status(500).json({
        error: "Failed to get AI response from Puter",
        details: process.env.NODE_ENV === "development" ? error.message : void 0
      });
    }
  });
  app2.get("/api/ai-tutor/models", (_req, res) => {
    res.json({
      models: [
        {
          id: "puter",
          object: "model",
          created: Date.now()
        }
      ]
    });
  });
  app2.get("/api/ai-tutor/health", async (_req, res) => {
    try {
      const response = await fetch(PUTER_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "user", content: "Hello" }] })
      });
      const data = await response.json();
      res.json({
        status: "healthy",
        backend: "puter",
        reply: data.reply,
        configured: true
      });
    } catch (error) {
      console.error("Health check error:", error.message);
      res.json({
        status: "error",
        message: "Puter server is not reachable",
        error: error.message
      });
    }
  });
}

// server/routes/puter-ai.ts
function registerPuterAIRoutes(app2) {
  app2.post("/api/puter-ai/chat", async (req, res) => {
    try {
      const { message, conversationHistory } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }
      res.json({
        success: true,
        message: "Puter.js AI integration ready",
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        note: "AI processing will be handled client-side with Puter.js"
      });
    } catch (error) {
      console.error("Puter AI proxy error:", error);
      res.status(500).json({
        error: "Puter AI proxy error",
        details: process.env.NODE_ENV === "development" ? error.message : void 0
      });
    }
  });
  app2.get("/api/puter-ai/health", async (req, res) => {
    try {
      res.json({
        status: "healthy",
        message: "Puter.js AI integration is ready",
        integration: "client-side",
        features: [
          "Free OpenAI GPT-4o access",
          "No API keys required",
          "Image generation with DALL-E",
          "Text-to-speech capabilities",
          "400+ AI models available"
        ],
        documentation: "https://developer.puter.com/tutorials/free-unlimited-openai-api/"
      });
    } catch (error) {
      console.error("Puter health check error:", error);
      res.status(500).json({
        error: "Health check failed",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  app2.get("/api/puter-ai/models", async (req, res) => {
    try {
      const availableModels = [
        {
          id: "gpt-4o",
          name: "GPT-4o",
          description: "Most capable OpenAI model",
          provider: "OpenAI"
        },
        {
          id: "gpt-4.1-nano",
          name: "GPT-4.1 Nano",
          description: "Fast and efficient model",
          provider: "OpenAI"
        },
        {
          id: "gpt-4.1-mini",
          name: "GPT-4.1 Mini",
          description: "Balanced performance model",
          provider: "OpenAI"
        },
        {
          id: "o1",
          name: "OpenAI o1",
          description: "Advanced reasoning model",
          provider: "OpenAI"
        },
        {
          id: "o1-mini",
          name: "OpenAI o1 Mini",
          description: "Efficient reasoning model",
          provider: "OpenAI"
        },
        {
          id: "claude-3-sonnet",
          name: "Claude 3 Sonnet",
          description: "Anthropic's balanced model",
          provider: "Anthropic",
          openrouter: "openrouter:anthropic/claude-3-sonnet"
        },
        {
          id: "llama-3.1-8b",
          name: "Llama 3.1 8B",
          description: "Meta's open-source model",
          provider: "Meta",
          openrouter: "openrouter:meta-llama/llama-3.1-8b-instruct"
        }
      ];
      res.json({ models: availableModels });
    } catch (error) {
      console.error("Error fetching Puter models:", error);
      res.status(500).json({ error: "Failed to fetch available models" });
    }
  });
}

// server/routes.ts
init_schema();

// server/services/openai.ts
import fetch2 from "node-fetch";
var PUTER_CHAT_URL = "http://puter.localhost:4100/api/chat";
async function puterChat(prompt) {
  const response = await fetch2(PUTER_CHAT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: prompt, model: "gpt-4.1-nano" })
  });
  const data = await response.json();
  return data.response || data.text || "No response";
}
async function assessVideoResponse(transcription, question, maxScore = 10) {
  const prompt = `
You are an expert educational assessor. Evaluate this student's **video response** to the question.

Question: ${question}
Student Response: ${transcription}
Max Score: ${maxScore}

Assess on:
- Speech Clarity (1\u201310)
- Content Accuracy (1\u201310)
- Use of Examples (1\u201310)
- Presentation Quality (1\u201310)

Respond ONLY in JSON:
{
  "overall_score": number,
  "feedback": string,
  "speech_clarity": number,
  "content_accuracy": number,
  "use_of_examples": number,
  "presentation_quality": number
}
`;
  const raw = await puterChat(prompt);
  const result = JSON.parse(raw);
  return {
    score: Math.min(maxScore, Math.max(0, result.overall_score || 0)),
    maxScore,
    feedback: result.feedback || "No feedback",
    criteria: {
      speechClarity: result.speech_clarity || 5,
      contentAccuracy: result.content_accuracy || 5,
      useOfExamples: result.use_of_examples || 5,
      presentationQuality: result.presentation_quality || 5
    }
  };
}
async function assessPhotoSubmission(base64Image, question, maxScore = 10) {
  const prompt = `
You are an expert educational assessor. Evaluate this student's **photo submission**.

Question: ${question}
Image (base64, not shown here for brevity): [REDACTED]

Max Score: ${maxScore}

Assess on:
- Diagram Accuracy
- Proper Labeling
- Clarity
- Completeness

Respond ONLY in JSON:
{
  "overall_score": number,
  "feedback": string,
  "diagram_accuracy": number,
  "proper_labeling": number,
  "clarity": number,
  "completeness": number
}
`;
  const raw = await puterChat(prompt);
  const result = JSON.parse(raw);
  return {
    score: Math.min(maxScore, Math.max(0, result.overall_score || 0)),
    maxScore,
    feedback: result.feedback || "No feedback",
    criteria: {
      diagramAccuracy: result.diagram_accuracy || 5,
      properLabeling: result.proper_labeling || 5,
      clarity: result.clarity || 5,
      completeness: result.completeness || 5
    }
  };
}
async function assessTextResponse(answer, question, correctAnswer, maxScore = 10) {
  const prompt = `
You are an expert educational assessor. Evaluate this student's **text response**.

Question: ${question}
Student Answer: ${answer}
${correctAnswer ? `Correct Answer: ${correctAnswer}` : ""}
Max Score: ${maxScore}

Respond ONLY in JSON:
{
  "score": number,
  "feedback": string,
  "key_points": [array of key points covered]
}
`;
  const raw = await puterChat(prompt);
  const result = JSON.parse(raw);
  return {
    score: Math.min(maxScore, Math.max(0, result.score || 0)),
    maxScore,
    feedback: result.feedback || "No feedback",
    keyPoints: result.key_points || []
  };
}
async function transcribeAudio(audioBuffer) {
  return "Transcription not supported yet via Puter. Use another service.";
}

// server/routes/enhanced-assessment.ts
import multer from "multer";

// server/services/huggingface.ts
import { HfInference } from "@huggingface/inference";
var hf = new HfInference();
async function analyzeEmotionFromText(text2) {
  try {
    const result = await hf.textClassification({
      model: "j-hartmann/emotion-english-distilroberta-base",
      inputs: text2
    });
    const topEmotion = result[0];
    return {
      emotion: topEmotion.label.toLowerCase(),
      confidence: topEmotion.score,
      facial_score: topEmotion.score * 100,
      emotions: result.map((r) => ({
        label: r.label.toLowerCase(),
        score: r.score
      }))
    };
  } catch (error) {
    console.error("Error analyzing emotion:", error);
    return {
      emotion: "neutral",
      confidence: 0.5,
      facial_score: 50,
      emotions: [{ label: "neutral", score: 0.5 }]
    };
  }
}
async function analyzeSpeechQuality(transcript, duration) {
  try {
    const sentimentResult = await hf.textClassification({
      model: "cardiffnlp/twitter-roberta-base-sentiment-latest",
      inputs: transcript
    });
    const sentiment = sentimentResult[0];
    const wordCount = transcript.split(" ").length;
    const wordsPerMinute = Math.round(wordCount / duration * 60);
    const pace = wordsPerMinute < 120 ? "slow" : wordsPerMinute > 180 ? "fast" : "normal";
    const clarity = transcript.length > 50 ? 0.8 : 0.6;
    return {
      transcript,
      sentiment: sentiment.label.toLowerCase(),
      confidence: sentiment.score,
      tone_analysis: {
        tone: sentiment.label.toLowerCase() === "positive" ? "confident" : sentiment.label.toLowerCase() === "negative" ? "uncertain" : "neutral",
        confidence: sentiment.score
      },
      speech_quality: {
        clarity,
        pace,
        volume: "normal"
        // Default since we can't analyze volume from transcript
      }
    };
  } catch (error) {
    console.error("Error analyzing speech quality:", error);
    return {
      transcript,
      sentiment: "neutral",
      confidence: 0.5,
      tone_analysis: { tone: "neutral", confidence: 0.5 },
      speech_quality: { clarity: 0.5, pace: "normal", volume: "normal" }
    };
  }
}
async function assessContentQuality(question, answer, expectedAnswer) {
  try {
    const qaResult = await hf.questionAnswering({
      model: "deepset/roberta-base-squad2",
      inputs: {
        question: `How well does this answer address the question: "${question}"?`,
        context: answer
      }
    });
    const relevanceScore = calculateRelevanceScore(question, answer);
    const completenessScore = Math.min(answer.length / 100, 1);
    const accuracyScore = expectedAnswer ? calculateSimilarity(answer, expectedAnswer) : qaResult.score;
    const contentScore = Math.round(
      (relevanceScore * 0.3 + completenessScore * 0.3 + accuracyScore * 0.4) * 100
    );
    const feedback = await generateFeedback(question, answer, contentScore);
    return {
      content_score: contentScore,
      accuracy: Math.round(accuracyScore * 100),
      completeness: Math.round(completenessScore * 100),
      relevance: Math.round(relevanceScore * 100),
      technical_depth: Math.round(assessTechnicalDepth(answer) * 100),
      feedback,
      suggestions: generateSuggestions(contentScore, answer)
    };
  } catch (error) {
    console.error("Error assessing content quality:", error);
    return {
      content_score: 70,
      accuracy: 70,
      completeness: 70,
      relevance: 70,
      technical_depth: 60,
      feedback: "Unable to perform detailed analysis. Please ensure your answer is clear and comprehensive.",
      suggestions: ["Provide more specific details", "Include examples", "Structure your answer clearly"]
    };
  }
}
async function generateFeedback(question, answer, score) {
  try {
    const prompt = `
Question: "${question}"
Answer: "${answer}"
Score: ${score}/100

Provide constructive feedback on this answer focusing on:
1. Content accuracy and relevance
2. Clarity and structure  
3. Areas for improvement
4. Positive aspects

Feedback:`;
    const result = await hf.textGeneration({
      model: "microsoft/DialoGPT-medium",
      inputs: prompt,
      parameters: {
        max_new_tokens: 150,
        temperature: 0.7
      }
    });
    return result.generated_text.replace(prompt, "").trim() || `Your answer scores ${score}/100. Focus on providing more specific details and clear explanations.`;
  } catch (error) {
    console.error("Error generating feedback:", error);
    return `Your answer scores ${score}/100. Focus on providing more specific details and clear explanations.`;
  }
}
function calculateRelevanceScore(question, answer) {
  const questionWords = question.toLowerCase().split(" ").filter((w) => w.length > 3);
  const answerWords = answer.toLowerCase().split(" ");
  let matches = 0;
  questionWords.forEach((qWord) => {
    if (answerWords.some((aWord) => aWord.includes(qWord) || qWord.includes(aWord))) {
      matches++;
    }
  });
  return Math.min(matches / questionWords.length, 1);
}
function calculateSimilarity(text1, text2) {
  const words1 = text1.toLowerCase().split(" ");
  const words2 = text2.toLowerCase().split(" ");
  const intersection = words1.filter((word) => words2.includes(word));
  const union = [.../* @__PURE__ */ new Set([...words1, ...words2])];
  return intersection.length / union.length;
}
function assessTechnicalDepth(answer) {
  const technicalTerms = [
    "algorithm",
    "complexity",
    "implementation",
    "optimization",
    "data structure",
    "function",
    "method",
    "class",
    "object",
    "variable",
    "loop",
    "condition",
    "database",
    "query",
    "server",
    "client",
    "API",
    "framework",
    "library"
  ];
  const answerWords = answer.toLowerCase().split(" ");
  const technicalWordCount = answerWords.filter(
    (word) => technicalTerms.some((term) => word.includes(term))
  ).length;
  return Math.min(technicalWordCount / 5, 1);
}
function generateSuggestions(score, answer) {
  const suggestions = [];
  if (score < 60) {
    suggestions.push("Provide more detailed explanations");
    suggestions.push("Include specific examples or use cases");
    suggestions.push("Address all parts of the question");
  } else if (score < 80) {
    suggestions.push("Add more technical depth to your answer");
    suggestions.push("Include relevant examples");
    suggestions.push("Improve the structure and flow");
  } else {
    suggestions.push("Excellent answer! Consider adding edge cases");
    suggestions.push("Great work on clarity and completeness");
  }
  if (answer.length < 50) {
    suggestions.push("Expand your answer with more details");
  }
  if (!answer.includes("example") && !answer.includes("for instance")) {
    suggestions.push("Include practical examples to illustrate your points");
  }
  return suggestions.slice(0, 3);
}

// server/routes/enhanced-assessment.ts
var upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024
    // 50MB limit for video files
  }
});
function registerEnhancedAssessmentRoutes(app2) {
  app2.post("/api/enhanced-assessment/analyze-video", upload.single("video"), async (req, res) => {
    try {
      const { questionId, transcript, emotionData, facialData, duration } = req.body;
      const videoFile = req.file;
      if (!videoFile || !transcript) {
        return res.status(400).json({ error: "Video file and transcript are required" });
      }
      const emotionAnalysis = await analyzeEmotionFromText(transcript);
      const speechAnalysis = await analyzeSpeechQuality(transcript, parseFloat(duration) || 60);
      const question = req.body.question || "General assessment";
      const contentAssessment = await assessContentQuality(question, transcript);
      const finalScore = calculateEnhancedScore({
        contentScore: contentAssessment.content_score,
        emotionConfidence: emotionAnalysis.confidence * 100,
        speechClarity: speechAnalysis.speech_quality.clarity * 100,
        facialConfidence: emotionData?.facial_score || 70
      });
      const result = {
        overall_score: finalScore,
        content_analysis: contentAssessment,
        emotion_analysis: emotionAnalysis,
        speech_analysis: speechAnalysis,
        facial_analysis: {
          emotion: emotionData?.emotion || "neutral",
          confidence: emotionData?.confidence || 0.7,
          facial_score: emotionData?.facial_score || 70
        },
        video_metadata: {
          duration: parseFloat(duration) || 60,
          file_size: videoFile.size,
          format: videoFile.mimetype
        },
        assessment_timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        feedback: generateEnhancedFeedback(finalScore, {
          content: contentAssessment,
          emotion: emotionAnalysis,
          speech: speechAnalysis
        })
      };
      res.json(result);
    } catch (error) {
      console.error("Error in enhanced video analysis:", error);
      res.status(500).json({ error: "Failed to analyze video response" });
    }
  });
  app2.post("/api/enhanced-assessment/analyze-emotion", async (req, res) => {
    try {
      const { text: text2 } = req.body;
      if (!text2) {
        return res.status(400).json({ error: "Text is required for emotion analysis" });
      }
      const emotionAnalysis = await analyzeEmotionFromText(text2);
      res.json(emotionAnalysis);
    } catch (error) {
      console.error("Error analyzing emotion:", error);
      res.status(500).json({ error: "Failed to analyze emotion" });
    }
  });
  app2.post("/api/enhanced-assessment/analyze-speech", async (req, res) => {
    try {
      const { transcript, duration } = req.body;
      if (!transcript) {
        return res.status(400).json({ error: "Transcript is required" });
      }
      const speechAnalysis = await analyzeSpeechQuality(transcript, parseFloat(duration) || 60);
      res.json(speechAnalysis);
    } catch (error) {
      console.error("Error analyzing speech:", error);
      res.status(500).json({ error: "Failed to analyze speech quality" });
    }
  });
  app2.post("/api/enhanced-assessment/assess-content", async (req, res) => {
    try {
      const { question, answer, expectedAnswer } = req.body;
      if (!question || !answer) {
        return res.status(400).json({ error: "Question and answer are required" });
      }
      const contentAssessment = await assessContentQuality(question, answer, expectedAnswer);
      res.json(contentAssessment);
    } catch (error) {
      console.error("Error assessing content:", error);
      res.status(500).json({ error: "Failed to assess content quality" });
    }
  });
  app2.get("/api/enhanced-assessment/summary/:attemptId", async (req, res) => {
    try {
      const attemptId = parseInt(req.params.attemptId);
      const summary = {
        attempt_id: attemptId,
        overall_performance: {
          total_score: 85,
          content_score: 80,
          delivery_score: 88,
          confidence_score: 87
        },
        detailed_analysis: {
          strengths: [
            "Clear and articulate speech delivery",
            "Good technical understanding demonstrated",
            "Confident body language and facial expressions"
          ],
          areas_for_improvement: [
            "Include more specific examples",
            "Improve pacing - slightly fast delivery",
            "Add more technical depth to explanations"
          ]
        },
        emotional_analysis: {
          dominant_emotion: "confident",
          emotion_consistency: 0.82,
          stress_indicators: "low"
        },
        speech_analysis: {
          clarity: 88,
          pace: "slightly_fast",
          volume: "appropriate",
          filler_words: 3
        },
        recommendations: [
          "Practice with more technical examples",
          "Focus on slower, more deliberate delivery",
          "Continue building on strong foundational knowledge"
        ],
        generated_at: (/* @__PURE__ */ new Date()).toISOString()
      };
      res.json(summary);
    } catch (error) {
      console.error("Error generating assessment summary:", error);
      res.status(500).json({ error: "Failed to generate assessment summary" });
    }
  });
}
function calculateEnhancedScore(metrics) {
  const weights = {
    content: 0.5,
    // 50% content
    emotion: 0.15,
    // 15% emotion confidence
    speech: 0.2,
    // 20% speech clarity
    facial: 0.15
    // 15% facial confidence
  };
  const weightedScore = metrics.contentScore * weights.content + metrics.emotionConfidence * weights.emotion + metrics.speechClarity * weights.speech + metrics.facialConfidence * weights.facial;
  return Math.round(Math.min(Math.max(weightedScore, 0), 100));
}
function generateEnhancedFeedback(score, analyses) {
  const { content, emotion, speech } = analyses;
  let feedback = `Overall Performance: ${score}/100

`;
  if (score >= 90) {
    feedback += "Exceptional performance! ";
  } else if (score >= 80) {
    feedback += "Strong performance with room for minor improvements. ";
  } else if (score >= 70) {
    feedback += "Good foundation with several areas for development. ";
  } else {
    feedback += "Significant room for improvement. ";
  }
  feedback += `

Content Quality: ${content.feedback}
`;
  feedback += `Emotional Presentation: You appeared ${emotion.emotion} with ${Math.round(emotion.confidence * 100)}% confidence.
`;
  feedback += `Speech Delivery: Your tone was ${speech.tone_analysis.tone} with ${Math.round(speech.speech_quality.clarity * 100)}% clarity.
`;
  if (content.suggestions.length > 0) {
    feedback += `
Key Suggestions:
${content.suggestions.map((s) => `\u2022 ${s}`).join("\n")}`;
  }
  return feedback;
}

// server/routes.ts
import multer2 from "multer";
var upload2 = multer2({
  storage: multer2.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
  // 10MB limit
});
async function registerRoutes(app2) {
  app2.get("/api/dashboard/:userId", async (req, res) => {
    try {
      const demoUser = await storage.getUserByUsername("demo");
      if (!demoUser) {
        return res.status(404).json({ message: "Demo user not found" });
      }
      const stats = await storage.getUserStats(demoUser.id);
      const recentAttempts = await storage.getAttemptsByUser(demoUser.id);
      const availableTests = await storage.getPublishedTests();
      res.json({
        stats,
        recentAttempts: recentAttempts.slice(0, 5),
        availableTests: availableTests.slice(0, 10)
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard data" });
    }
  });
  app2.get("/api/tests", async (req, res) => {
    try {
      const tests2 = await storage.getPublishedTests();
      res.json(tests2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tests" });
    }
  });
  app2.get("/api/tests/:id", async (req, res) => {
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
  app2.post("/api/tests", async (req, res) => {
    try {
      const validatedData = insertTestSchema.parse(req.body);
      const test = await storage.createTest(validatedData);
      res.status(201).json(test);
    } catch (error) {
      res.status(400).json({ message: "Invalid test data" });
    }
  });
  app2.post("/api/tests/:testId/questions", async (req, res) => {
    try {
      const testId = parseInt(req.params.testId);
      const validatedData = insertQuestionSchema.parse({
        ...req.body,
        testId
      });
      const question = await storage.createQuestion(validatedData);
      res.status(201).json(question);
    } catch (error) {
      res.status(400).json({ message: "Invalid question data" });
    }
  });
  app2.post("/api/attempts", async (req, res) => {
    try {
      const validatedData = insertTestAttemptSchema.parse(req.body);
      const attempt = await storage.createTestAttempt(validatedData);
      res.status(201).json(attempt);
    } catch (error) {
      res.status(400).json({ message: "Invalid attempt data" });
    }
  });
  app2.get("/api/attempts/:id", async (req, res) => {
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
  app2.post("/api/attempts/:attemptId/answers", async (req, res) => {
    try {
      const attemptId = parseInt(req.params.attemptId);
      const { questionId, answerData, timeSpent } = req.body;
      const question = await storage.getQuestion(questionId);
      if (!question) {
        return res.status(404).json({ message: "Question not found" });
      }
      let score = 0;
      let aiAssessment = null;
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
        timeSpent
      });
      res.status(201).json(answer);
    } catch (error) {
      res.status(400).json({ message: "Failed to submit answer" });
    }
  });
  app2.post("/api/attempts/:attemptId/video", upload2.single("video"), async (req, res) => {
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
      const transcription = await transcribeAudio(req.file.buffer);
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
          videoSize: req.file.size
        },
        score: assessment.score,
        maxScore: assessment.maxScore,
        aiAssessment: {
          feedback: assessment.feedback,
          criteria: assessment.criteria,
          type: "video"
        },
        timeSpent: parseInt(timeSpent)
      });
      res.status(201).json(answer);
    } catch (error) {
      console.error("Video assessment error:", error);
      res.status(500).json({ message: "Failed to assess video response" });
    }
  });
  app2.post("/api/attempts/:attemptId/photo", upload2.single("photo"), async (req, res) => {
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
      const base64Image = req.file.buffer.toString("base64");
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
          mimeType: req.file.mimetype
        },
        score: assessment.score,
        maxScore: assessment.maxScore,
        aiAssessment: {
          feedback: assessment.feedback,
          criteria: assessment.criteria,
          type: "photo"
        },
        timeSpent: parseInt(timeSpent)
      });
      res.status(201).json(answer);
    } catch (error) {
      console.error("Photo assessment error:", error);
      res.status(500).json({ message: "Failed to assess photo response" });
    }
  });
  app2.post("/api/attempts/:attemptId/text", async (req, res) => {
    try {
      const attemptId = parseInt(req.params.attemptId);
      const { questionId, answer: textAnswer, timeSpent } = req.body;
      const question = await storage.getQuestion(questionId);
      if (!question) {
        return res.status(404).json({ message: "Question not found" });
      }
      const assessment = await assessTextResponse(
        textAnswer,
        question.question,
        question.correctAnswer || void 0,
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
          type: "text"
        },
        timeSpent
      });
      res.status(201).json(answer);
    } catch (error) {
      console.error("Text assessment error:", error);
      res.status(500).json({ message: "Failed to assess text response" });
    }
  });
  app2.patch("/api/attempts/:id/complete", async (req, res) => {
    try {
      const attemptId = parseInt(req.params.id);
      const { timeSpent } = req.body;
      const answers2 = await storage.getAnswersByAttempt(attemptId);
      const totalScore = answers2.reduce((sum, answer) => sum + (answer.score || 0), 0);
      const maxScore = answers2.reduce((sum, answer) => sum + (answer.maxScore || 0), 0);
      const avgCriteriaRating = answers2.filter((a) => a.aiAssessment && typeof a.aiAssessment === "object" && "criteria" in a.aiAssessment).reduce((sum, a) => {
        const criteria = a.aiAssessment.criteria;
        if (criteria && typeof criteria === "object") {
          const ratings = Object.values(criteria);
          return sum + ratings.reduce((s, r) => s + r, 0) / ratings.length;
        }
        return sum;
      }, 0) / Math.max(answers2.length, 1) || 7;
      const attempt = await storage.updateTestAttempt(attemptId, {
        status: "completed",
        completedAt: /* @__PURE__ */ new Date(),
        totalScore,
        maxScore,
        timeSpent,
        aiOverallRating: Math.round(avgCriteriaRating)
      });
      res.json(attempt);
    } catch (error) {
      res.status(500).json({ message: "Failed to complete attempt" });
    }
  });
  app2.get("/api/users/:userId/results", async (req, res) => {
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
  app2.get("/api/learning/modules", async (req, res) => {
    try {
      const modules = await storage.getPublishedModules();
      res.json(modules);
    } catch (error) {
      console.error("Error fetching learning modules:", error);
      res.status(500).json({ error: "Failed to fetch learning modules" });
    }
  });
  app2.get("/api/learning/modules/:id", async (req, res) => {
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
  app2.get("/api/learning/stats", async (req, res) => {
    try {
      const demoUser = await storage.getUserByUsername("demo");
      if (!demoUser) {
        return res.status(404).json({ error: "Demo user not found" });
      }
      let stats = await storage.getUserGameStats(demoUser.id);
      if (!stats) {
        stats = await storage.createOrUpdateUserStats(demoUser.id, {
          totalXp: 0,
          level: 1,
          streak: 0,
          badges: [],
          achievements: []
        });
      }
      res.json(stats);
    } catch (error) {
      console.error("Error fetching user stats:", error);
      res.status(500).json({ error: "Failed to fetch user stats" });
    }
  });
  app2.get("/api/learning/lessons/:id", async (req, res) => {
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
  app2.post("/api/learning/progress", async (req, res) => {
    try {
      const progressData = req.body;
      const progress = await storage.createUserProgress(progressData);
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
  app2.get("/api/learning/progress/:userId/:moduleId", async (req, res) => {
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
  registerEnhancedAssessmentRoutes(app2);
  app2.use("/api/quiz", (await Promise.resolve().then(() => (init_quiz(), quiz_exports))).default);
  registerAITutorRoutes(app2);
  registerPuterAIRoutes(app2);
  const httpServer = createServer(app2);
  const dashboardWS = new DashboardWebSocket(httpServer);
  app2.get("/api/dashboard-stats", async (req, res) => {
    const liveUsers = dashboardWS.getConnectedUsers();
    const stats = {
      liveUsers: liveUsers.length,
      totalStudents: liveUsers.filter((u) => u.role === "student").length,
      totalAdmins: liveUsers.filter((u) => u.role === "admin").length,
      testsCompletedToday: Math.floor(Math.random() * 50) + 15,
      averageScore: Math.floor(Math.random() * 30) + 70,
      activeTests: Math.floor(Math.random() * 10) + 5
    };
    res.json(stats);
  });
  app2.get("/api/student-dashboard/:id", async (req, res) => {
    const studentId = req.params.id;
    const dashboardData = {
      stats: {
        testsTaken: Math.floor(Math.random() * 20) + 5,
        averageScore: Math.floor(Math.random() * 30) + 70,
        totalTimeSpent: Math.floor(Math.random() * 100) + 50,
        rank: Math.floor(Math.random() * 100) + 1
      },
      recentTests: [
        { id: 1, title: "Data Structures Basics", score: 85, date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1e3), status: "completed" },
        { id: 2, title: "Python Programming", score: 92, date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1e3), status: "completed" },
        { id: 3, title: "Algorithm Analysis", score: 78, date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1e3), status: "completed" }
      ],
      upcomingTests: [
        { id: 4, title: "Advanced Algorithms", scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1e3), difficulty: "Hard" },
        { id: 5, title: "System Design", scheduledDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1e3), difficulty: "Medium" }
      ],
      achievements: [
        { id: 1, title: "First Test Completed", icon: "\u{1F3AF}", earnedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1e3) },
        { id: 2, title: "High Scorer", icon: "\u{1F3C6}", earnedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1e3) },
        { id: 3, title: "Consistent Learner", icon: "\u{1F4DA}", earnedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1e3) }
      ]
    };
    res.json(dashboardData);
  });
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "127.0.0.1"
  }, () => {
    log(`\u2705 Server is listening at http://127.0.0.1:${port}`);
  });
})();

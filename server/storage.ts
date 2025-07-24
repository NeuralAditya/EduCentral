import { users, tests, questions, testAttempts, answers, learningModules, lessons, userProgress, userStats, type User, type InsertUser, type Test, type InsertTest, type Question, type InsertQuestion, type TestAttempt, type InsertTestAttempt, type Answer, type InsertAnswer, type LearningModule, type InsertLearningModule, type Lesson, type InsertLesson, type UserProgress, type InsertUserProgress, type UserStats, type InsertUserStats, type TestWithQuestions, type AttemptWithDetails, type ModuleWithLessons, type LessonWithProgress } from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Test operations
  getTest(id: number): Promise<Test | undefined>;
  getTestWithQuestions(id: number): Promise<TestWithQuestions | undefined>;
  getPublishedTests(): Promise<Test[]>;
  createTest(test: InsertTest): Promise<Test>;
  updateTest(id: number, test: Partial<Test>): Promise<Test | undefined>;

  // Question operations
  getQuestion(id: number): Promise<Question | undefined>;
  getQuestionsByTest(testId: number): Promise<Question[]>;
  createQuestion(question: InsertQuestion): Promise<Question>;
  updateQuestion(id: number, question: Partial<Question>): Promise<Question | undefined>;

  // Test attempt operations
  getTestAttempt(id: number): Promise<TestAttempt | undefined>;
  getAttemptsByUser(userId: number): Promise<TestAttempt[]>;
  getAttemptWithDetails(id: number): Promise<AttemptWithDetails | undefined>;
  createTestAttempt(attempt: InsertTestAttempt): Promise<TestAttempt>;
  updateTestAttempt(id: number, attempt: Partial<TestAttempt>): Promise<TestAttempt | undefined>;

  // Answer operations
  getAnswer(id: number): Promise<Answer | undefined>;
  getAnswersByAttempt(attemptId: number): Promise<Answer[]>;
  createAnswer(answer: InsertAnswer): Promise<Answer>;
  updateAnswer(id: number, answer: Partial<Answer>): Promise<Answer | undefined>;

  // Analytics
  getUserStats(userId: number): Promise<{
    testsTaken: number;
    avgScore: number;
    totalStudyTime: number;
    rank: number;
  }>;

  // Learning module operations
  getLearningModule(id: number): Promise<LearningModule | undefined>;
  getModuleWithLessons(id: number): Promise<ModuleWithLessons | undefined>;
  getPublishedModules(): Promise<LearningModule[]>;
  createLearningModule(module: InsertLearningModule): Promise<LearningModule>;
  updateLearningModule(id: number, module: Partial<LearningModule>): Promise<LearningModule | undefined>;

  // Lesson operations
  getLesson(id: number): Promise<Lesson | undefined>;
  getLessonsByModule(moduleId: number): Promise<Lesson[]>;
  createLesson(lesson: InsertLesson): Promise<Lesson>;
  updateLesson(id: number, lesson: Partial<Lesson>): Promise<Lesson | undefined>;

  // User progress operations
  getUserProgress(userId: number, lessonId: number): Promise<UserProgress | undefined>;
  getUserModuleProgress(userId: number, moduleId: number): Promise<UserProgress[]>;
  createUserProgress(progress: InsertUserProgress): Promise<UserProgress>;
  updateUserProgress(id: number, progress: Partial<UserProgress>): Promise<UserProgress | undefined>;

  // User stats operations
  getUserGameStats(userId: number): Promise<UserStats | undefined>;
  createOrUpdateUserStats(userId: number, stats: Partial<InsertUserStats>): Promise<UserStats>;
  addXpToUser(userId: number, xp: number): Promise<UserStats | undefined>;
  updateUserStreak(userId: number): Promise<UserStats | undefined>;
}

export class DatabaseStorage implements IStorage {
  constructor() {
    // Initialize sample data if needed
    this.initializeSampleData();
  }

  private async initializeSampleData() {
    try {
      // Check if data already exists
      const existingUsers = await db.select().from(users).limit(1);
      if (existingUsers.length > 0) return; // Data already exists

      // Create a sample user
      const [sampleUser] = await db
        .insert(users)
        .values({
          username: "demo",
          email: "demo@example.com",
          password: "demo123", // Add password for database constraint
          role: "student",
        })
        .returning();

      // Create a sample test
      const [sampleTest] = await db
        .insert(tests)
        .values({
          title: "JavaScript Fundamentals Assessment",
          description: "Test your knowledge of JavaScript basics including variables, functions, and control structures.",
          duration: 30,
          totalPoints: 100,
          difficulty: "intermediate",
          subject: "programming",
          createdBy: sampleUser.id,
          isPublished: true,
        })
        .returning();

      // Create sample questions
      await db.insert(questions).values([
        {
          testId: sampleTest.id,
          type: "mcq",
          question: "What is the correct way to declare a variable in JavaScript?",
          options: ["var myVar;", "variable myVar;", "v myVar;", "declare myVar;"],
          correctAnswer: "var myVar;",
          points: 10,
          orderIndex: 1,
        },
        {
          testId: sampleTest.id,
          type: "video",
          question: "Record a 2-minute video explaining the concept of JavaScript closures with examples.",
          points: 30,
          orderIndex: 2,
        },
        {
          testId: sampleTest.id,
          type: "photo",
          question: "Draw and photograph a diagram showing the JavaScript event loop process.",
          points: 25,
          orderIndex: 3,
        },
        {
          testId: sampleTest.id,
          type: "text",
          question: "Explain the difference between 'let', 'const', and 'var' in JavaScript. Provide examples for each.",
          points: 35,
          orderIndex: 4,
        },
      ]);

      // Create sample learning modules
      const [dsaModule] = await db
        .insert(learningModules)
        .values({
          title: "Data Structures & Algorithms Fundamentals",
          description: "Master the building blocks of efficient programming",
          category: "dsa",
          difficulty: "beginner",
          totalLessons: 8,
          estimatedTime: 240,
          xpReward: 500,
          isPublished: true,
        })
        .returning();

      const [algorithmsModule] = await db
        .insert(learningModules)
        .values({
          title: "Advanced Algorithms & Problem Solving",
          description: "Dive deep into algorithmic thinking and optimization",
          category: "algorithms",
          difficulty: "intermediate",
          totalLessons: 12,
          estimatedTime: 360,
          xpReward: 800,
          isPublished: true,
        })
        .returning();

      // Create sample lessons for DSA module
      await db.insert(lessons).values([
        {
          moduleId: dsaModule.id,
          title: "Introduction to Arrays",
          content: "Learn about arrays, the fundamental data structure for storing collections of elements.",
          lessonType: "theory",
          orderIndex: 1,
          xpReward: 50,
          unlockCondition: null,
        },
        {
          moduleId: dsaModule.id,
          title: "Array Operations Challenge",
          content: "Practice implementing common array operations like search, insert, and delete.",
          lessonType: "practice",
          orderIndex: 2,
          xpReward: 75,
          unlockCondition: { prerequisite: 1 },
        },
        {
          moduleId: dsaModule.id,
          title: "Linked Lists Fundamentals",
          content: "Understand linked lists and their advantages over arrays.",
          lessonType: "theory",
          orderIndex: 3,
          xpReward: 60,
          unlockCondition: { prerequisite: 2 },
        },
      ]);

      // Create sample user stats
      await db
        .insert(userStats)
        .values({
          userId: sampleUser.id,
          totalXp: 150,
          level: 2,
          streak: 3,
          lastActiveDate: new Date(),
          badges: ["first_lesson", "quick_learner"],
          achievements: ["completed_first_module"],
        });

      console.log("Sample data initialized successfully");
    } catch (error) {
      console.error("Error initializing sample data:", error);
    }
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Test operations
  async getTest(id: number): Promise<Test | undefined> {
    const [test] = await db.select().from(tests).where(eq(tests.id, id));
    return test || undefined;
  }

  async getTestWithQuestions(id: number): Promise<TestWithQuestions | undefined> {
    const test = await this.getTest(id);
    if (!test) return undefined;

    const testQuestions = await this.getQuestionsByTest(id);
    return { ...test, questions: testQuestions };
  }

  async getPublishedTests(): Promise<Test[]> {
    return await db.select().from(tests).where(eq(tests.isPublished, true)).orderBy(desc(tests.createdAt));
  }

  async createTest(insertTest: InsertTest): Promise<Test> {
    const [test] = await db
      .insert(tests)
      .values(insertTest)
      .returning();
    return test;
  }

  async updateTest(id: number, testUpdate: Partial<Test>): Promise<Test | undefined> {
    const [updatedTest] = await db
      .update(tests)
      .set({ ...testUpdate, updatedAt: new Date() })
      .where(eq(tests.id, id))
      .returning();
    return updatedTest || undefined;
  }

  // Question operations
  async getQuestion(id: number): Promise<Question | undefined> {
    const [question] = await db.select().from(questions).where(eq(questions.id, id));
    return question || undefined;
  }

  async getQuestionsByTest(testId: number): Promise<Question[]> {
    return await db.select().from(questions).where(eq(questions.testId, testId)).orderBy(questions.orderIndex);
  }

  async createQuestion(insertQuestion: InsertQuestion): Promise<Question> {
    const [question] = await db
      .insert(questions)
      .values(insertQuestion)
      .returning();
    return question;
  }

  async updateQuestion(id: number, questionUpdate: Partial<Question>): Promise<Question | undefined> {
    const [updatedQuestion] = await db
      .update(questions)
      .set(questionUpdate)
      .where(eq(questions.id, id))
      .returning();
    return updatedQuestion || undefined;
  }

  // Test attempt operations
  async getTestAttempt(id: number): Promise<TestAttempt | undefined> {
    const [attempt] = await db.select().from(testAttempts).where(eq(testAttempts.id, id));
    return attempt || undefined;
  }

  async getAttemptsByUser(userId: number): Promise<TestAttempt[]> {
    return await db.select().from(testAttempts).where(eq(testAttempts.userId, userId)).orderBy(desc(testAttempts.startedAt));
  }

  async getAttemptWithDetails(id: number): Promise<AttemptWithDetails | undefined> {
    const attempt = await this.getTestAttempt(id);
    if (!attempt) return undefined;

    const test = await this.getTest(attempt.testId);
    if (!test) return undefined;

    const attemptAnswers = await this.getAnswersByAttempt(id);
    const answersWithQuestions = await Promise.all(
      attemptAnswers.map(async (answer) => {
        const question = await this.getQuestion(answer.questionId!);
        return { ...answer, question: question! };
      })
    );

    return { ...attempt, test, answers: answersWithQuestions };
  }

  async createTestAttempt(insertAttempt: InsertTestAttempt): Promise<TestAttempt> {
    const [attempt] = await db
      .insert(testAttempts)
      .values(insertAttempt)
      .returning();
    return attempt;
  }

  async updateTestAttempt(id: number, attemptUpdate: Partial<TestAttempt>): Promise<TestAttempt | undefined> {
    const [updatedAttempt] = await db
      .update(testAttempts)
      .set(attemptUpdate)
      .where(eq(testAttempts.id, id))
      .returning();
    return updatedAttempt || undefined;
  }

  // Answer operations
  async getAnswer(id: number): Promise<Answer | undefined> {
    const [answer] = await db.select().from(answers).where(eq(answers.id, id));
    return answer || undefined;
  }

  async getAnswersByAttempt(attemptId: number): Promise<Answer[]> {
    return await db.select().from(answers).where(eq(answers.attemptId, attemptId));
  }

  async createAnswer(insertAnswer: InsertAnswer): Promise<Answer> {
    const [answer] = await db
      .insert(answers)
      .values(insertAnswer)
      .returning();
    return answer;
  }

  async updateAnswer(id: number, answerUpdate: Partial<Answer>): Promise<Answer | undefined> {
    const [updatedAnswer] = await db
      .update(answers)
      .set(answerUpdate)
      .where(eq(answers.id, id))
      .returning();
    return updatedAnswer || undefined;
  }

  // Analytics
  async getUserStats(userId: number): Promise<{
    testsTaken: number;
    avgScore: number;
    totalStudyTime: number;
    rank: number;
  }> {
    const userAttempts = await db
      .select()
      .from(testAttempts)
      .where(and(eq(testAttempts.userId, userId), eq(testAttempts.status, "completed")));

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

    // Calculate rank (simplified - in a real app this would be more sophisticated)
    const allUsers = await db.select().from(users).where(eq(users.role, "student"));
    const rank = Math.floor(Math.random() * allUsers.length) + 1;

    return {
      testsTaken,
      avgScore,
      totalStudyTime: Math.floor(totalStudyTime / 3600), // Convert to hours
      rank,
    };
  }

  // Learning module operations
  async getLearningModule(id: number): Promise<LearningModule | undefined> {
    const [module] = await db.select().from(learningModules).where(eq(learningModules.id, id));
    return module || undefined;
  }

  async getModuleWithLessons(id: number): Promise<ModuleWithLessons | undefined> {
    const module = await this.getLearningModule(id);
    if (!module) return undefined;

    const moduleLessons = await this.getLessonsByModule(id);
    return { ...module, lessons: moduleLessons };
  }

  async getPublishedModules(): Promise<LearningModule[]> {
    return await db.select().from(learningModules).where(eq(learningModules.isPublished, true)).orderBy(learningModules.id);
  }

  async createLearningModule(insertModule: InsertLearningModule): Promise<LearningModule> {
    const [module] = await db
      .insert(learningModules)
      .values(insertModule)
      .returning();
    return module;
  }

  async updateLearningModule(id: number, moduleUpdate: Partial<LearningModule>): Promise<LearningModule | undefined> {
    const [updatedModule] = await db
      .update(learningModules)
      .set(moduleUpdate)
      .where(eq(learningModules.id, id))
      .returning();
    return updatedModule || undefined;
  }

  // Lesson operations
  async getLesson(id: number): Promise<Lesson | undefined> {
    const [lesson] = await db.select().from(lessons).where(eq(lessons.id, id));
    return lesson || undefined;
  }

  async getLessonsByModule(moduleId: number): Promise<Lesson[]> {
    return await db.select().from(lessons).where(eq(lessons.moduleId, moduleId)).orderBy(lessons.orderIndex);
  }

  async createLesson(insertLesson: InsertLesson): Promise<Lesson> {
    const [lesson] = await db
      .insert(lessons)
      .values(insertLesson)
      .returning();
    return lesson;
  }

  async updateLesson(id: number, lessonUpdate: Partial<Lesson>): Promise<Lesson | undefined> {
    const [updatedLesson] = await db
      .update(lessons)
      .set(lessonUpdate)
      .where(eq(lessons.id, id))
      .returning();
    return updatedLesson || undefined;
  }

  // User progress operations
  async getUserProgress(userId: number, lessonId: number): Promise<UserProgress | undefined> {
    const [progress] = await db
      .select()
      .from(userProgress)
      .where(and(eq(userProgress.userId, userId), eq(userProgress.lessonId, lessonId)));
    return progress || undefined;
  }

  async getUserModuleProgress(userId: number, moduleId: number): Promise<UserProgress[]> {
    return await db
      .select()
      .from(userProgress)
      .where(and(eq(userProgress.userId, userId), eq(userProgress.moduleId, moduleId)));
  }

  async createUserProgress(insertProgress: InsertUserProgress): Promise<UserProgress> {
    const [progress] = await db
      .insert(userProgress)
      .values(insertProgress)
      .returning();
    return progress;
  }

  async updateUserProgress(id: number, progressUpdate: Partial<UserProgress>): Promise<UserProgress | undefined> {
    const [updatedProgress] = await db
      .update(userProgress)
      .set(progressUpdate)
      .where(eq(userProgress.id, id))
      .returning();
    return updatedProgress || undefined;
  }

  // User stats operations
  async getUserGameStats(userId: number): Promise<UserStats | undefined> {
    const [stats] = await db.select().from(userStats).where(eq(userStats.userId, userId));
    return stats || undefined;
  }

  async createOrUpdateUserStats(userId: number, statsUpdate: Partial<InsertUserStats>): Promise<UserStats> {
    const existing = await this.getUserGameStats(userId);
    
    if (existing) {
      const [updated] = await db
        .update(userStats)
        .set(statsUpdate)
        .where(eq(userStats.userId, userId))
        .returning();
      return updated;
    } else {
      const [newStats] = await db
        .insert(userStats)
        .values({
          userId,
          totalXp: 0,
          level: 1,
          streak: 0,
          lastActiveDate: new Date(),
          badges: [],
          achievements: [],
          ...statsUpdate,
        })
        .returning();
      return newStats;
    }
  }

  async addXpToUser(userId: number, xp: number): Promise<UserStats | undefined> {
    const stats = await this.getUserGameStats(userId);
    if (!stats) return undefined;

    const newXp = stats.totalXp + xp;
    const newLevel = Math.floor(newXp / 1000) + 1; // 1000 XP per level

    return this.createOrUpdateUserStats(userId, {
      totalXp: newXp,
      level: newLevel,
    });
  }

  async updateUserStreak(userId: number): Promise<UserStats | undefined> {
    const stats = await this.getUserGameStats(userId);
    if (!stats) return undefined;

    const today = new Date();
    const lastActive = stats.lastActiveDate ? new Date(stats.lastActiveDate) : null;
    
    let newStreak = stats.streak;
    if (lastActive) {
      const diffDays = Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
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
      lastActiveDate: today,
    });
  }
}

export const storage = new DatabaseStorage();
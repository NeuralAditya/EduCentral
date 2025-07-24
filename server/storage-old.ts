import { users, tests, questions, testAttempts, answers, learningModules, lessons, userProgress, userStats, type User, type InsertUser, type Test, type InsertTest, type Question, type InsertQuestion, type TestAttempt, type InsertTestAttempt, type Answer, type InsertAnswer, type LearningModule, type InsertLearningModule, type Lesson, type InsertLesson, type UserProgress, type InsertUserProgress, type UserStats, type InsertUserStats, type TestWithQuestions, type AttemptWithDetails, type ModuleWithLessons, type LessonWithProgress } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Test operations
  getTest(id: number): Promise<Test | undefined>;
  getTestWithQuestions(id: number): Promise<TestWithQuestions | undefined>;
  getPublishedTests(): Promise<Test[]>;
  getTestsByCreator(creatorId: number): Promise<Test[]>;
  createTest(test: InsertTest): Promise<Test>;
  updateTest(id: number, test: Partial<Test>): Promise<Test | undefined>;
  deleteTest(id: number): Promise<boolean>;

  // Question operations
  getQuestion(id: number): Promise<Question | undefined>;
  getQuestionsByTest(testId: number): Promise<Question[]>;
  createQuestion(question: InsertQuestion): Promise<Question>;
  updateQuestion(id: number, question: Partial<Question>): Promise<Question | undefined>;
  deleteQuestion(id: number): Promise<boolean>;

  // Test attempt operations
  getTestAttempt(id: number): Promise<TestAttempt | undefined>;
  getAttemptWithDetails(id: number): Promise<AttemptWithDetails | undefined>;
  getAttemptsByUser(userId: number): Promise<TestAttempt[]>;
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

  private initializeSampleData() {
    // Create sample user
    const sampleUser: User = {
      id: this.currentIds.user++,
      username: "john_doe",
      password: "hashedpassword",
      role: "student",
      createdAt: new Date(),
    };
    this.users.set(sampleUser.id, sampleUser);

    // Create sample educator
    const educator: User = {
      id: this.currentIds.user++,
      username: "prof_smith",
      password: "hashedpassword",
      role: "educator",
      createdAt: new Date(),
    };
    this.users.set(educator.id, educator);

    // Create sample tests
    const physicsTest: Test = {
      id: this.currentIds.test++,
      title: "Physics Mock Exam",
      description: "Comprehensive physics assessment with AI-powered evaluation",
      subject: "Physics",
      duration: 90,
      difficulty: "intermediate",
      createdBy: educator.id,
      isPublished: true,
      createdAt: new Date(),
    };
    this.tests.set(physicsTest.id, physicsTest);

    const biologyTest: Test = {
      id: this.currentIds.test++,
      title: "Biology Assessment",
      description: "Biology test with photo upload requirements",
      subject: "Biology",
      duration: 60,
      difficulty: "beginner",
      createdBy: educator.id,
      isPublished: true,
      createdAt: new Date(),
    };
    this.tests.set(biologyTest.id, biologyTest);

    // Create sample questions
    const questions = [
      {
        id: this.currentIds.question++,
        testId: physicsTest.id,
        type: "mcq",
        question: "What is the acceleration due to gravity on Earth's surface approximately equal to?",
        options: ["9.8 m/s²", "10.8 m/s²", "8.8 m/s²", "11.8 m/s²"],
        correctAnswer: "9.8 m/s²",
        points: 5,
        timeLimit: 60,
        aiCriteria: null,
        orderIndex: 1,
      },
      {
        id: this.currentIds.question++,
        testId: physicsTest.id,
        type: "video_response",
        question: "Explain Newton's Third Law of Motion with a practical example. Record a 2-minute video response.",
        options: null,
        correctAnswer: null,
        points: 10,
        timeLimit: 180,
        aiCriteria: {
          criteria: ["Speech clarity", "Content accuracy", "Use of examples", "Presentation quality"]
        },
        orderIndex: 2,
      },
      {
        id: this.currentIds.question++,
        testId: biologyTest.id,
        type: "photo_upload",
        question: "Draw and photograph a cell diagram showing organelles.",
        options: null,
        correctAnswer: null,
        points: 8,
        timeLimit: 300,
        aiCriteria: {
          criteria: ["Diagram accuracy", "Proper labeling", "Clarity", "Completeness"]
        },
        orderIndex: 1,
      },
    ];

    questions.forEach(q => this.questions.set(q.id, q as Question));

    // Create sample learning modules
    const dsaModule: LearningModule = {
      id: this.currentIds.learningModule++,
      title: "Data Structures & Algorithms Fundamentals",
      description: "Master the building blocks of efficient programming",
      category: "dsa",
      difficulty: "beginner",
      totalLessons: 8,
      estimatedTime: 240,
      xpReward: 500,
      isPublished: true,
      createdAt: new Date(),
    };
    this.learningModules.set(dsaModule.id, dsaModule);

    const algorithmsModule: LearningModule = {
      id: this.currentIds.learningModule++,
      title: "Advanced Algorithms & Problem Solving",
      description: "Dive deep into algorithmic thinking and optimization",
      category: "algorithms",
      difficulty: "intermediate",
      totalLessons: 12,
      estimatedTime: 360,
      xpReward: 800,
      isPublished: true,
      createdAt: new Date(),
    };
    this.learningModules.set(algorithmsModule.id, algorithmsModule);

    // Create sample lessons for DSA module
    const dsaLessons = [
      {
        id: this.currentIds.lesson++,
        moduleId: dsaModule.id,
        title: "Introduction to Arrays",
        content: "Learn about arrays, the fundamental data structure for storing collections of elements.",
        lessonType: "theory",
        orderIndex: 1,
        xpReward: 50,
        unlockCondition: null,
      },
      {
        id: this.currentIds.lesson++,
        moduleId: dsaModule.id,
        title: "Array Operations Challenge",
        content: "Practice implementing common array operations like search, insert, and delete.",
        lessonType: "practice",
        orderIndex: 2,
        xpReward: 75,
        unlockCondition: { prerequisite: this.currentIds.lesson - 1 },
      },
      {
        id: this.currentIds.lesson++,
        moduleId: dsaModule.id,
        title: "Linked Lists Fundamentals",
        content: "Understand linked lists and their advantages over arrays.",
        lessonType: "theory",
        orderIndex: 3,
        xpReward: 60,
        unlockCondition: { prerequisite: this.currentIds.lesson - 1 },
      },
    ];

    dsaLessons.forEach(lesson => this.lessons.set(lesson.id, lesson as Lesson));

    // Create sample user stats
    const sampleUserStats: UserStats = {
      id: this.currentIds.userStats++,
      userId: sampleUser.id,
      totalXp: 150,
      level: 2,
      streak: 3,
      lastActiveDate: new Date(),
      badges: ["first_lesson", "quick_learner"],
      achievements: ["completed_first_module"],
    };
    this.userStatsMap.set(sampleUser.id, sampleUserStats);
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      ...insertUser,
      id: this.currentIds.user++,
      createdAt: new Date(),
      role: insertUser.role || "student",
    };
    this.users.set(user.id, user);
    return user;
  }

  // Test operations
  async getTest(id: number): Promise<Test | undefined> {
    return this.tests.get(id);
  }

  async getTestWithQuestions(id: number): Promise<TestWithQuestions | undefined> {
    const test = this.tests.get(id);
    if (!test) return undefined;

    const testQuestions = Array.from(this.questions.values())
      .filter(q => q.testId === id)
      .sort((a, b) => a.orderIndex - b.orderIndex);

    const creator = test.createdBy ? this.users.get(test.createdBy) : undefined;

    return {
      ...test,
      questions: testQuestions,
      createdByUser: creator,
    };
  }

  async getPublishedTests(): Promise<Test[]> {
    return Array.from(this.tests.values()).filter(test => test.isPublished);
  }

  async getTestsByCreator(creatorId: number): Promise<Test[]> {
    return Array.from(this.tests.values()).filter(test => test.createdBy === creatorId);
  }

  async createTest(insertTest: InsertTest): Promise<Test> {
    const test: Test = {
      ...insertTest,
      id: this.currentIds.test++,
      createdAt: new Date(),
    };
    this.tests.set(test.id, test);
    return test;
  }

  async updateTest(id: number, testUpdate: Partial<Test>): Promise<Test | undefined> {
    const test = this.tests.get(id);
    if (!test) return undefined;

    const updatedTest = { ...test, ...testUpdate };
    this.tests.set(id, updatedTest);
    return updatedTest;
  }

  async deleteTest(id: number): Promise<boolean> {
    return this.tests.delete(id);
  }

  // Question operations
  async getQuestion(id: number): Promise<Question | undefined> {
    return this.questions.get(id);
  }

  async getQuestionsByTest(testId: number): Promise<Question[]> {
    return Array.from(this.questions.values())
      .filter(q => q.testId === testId)
      .sort((a, b) => a.orderIndex - b.orderIndex);
  }

  async createQuestion(insertQuestion: InsertQuestion): Promise<Question> {
    const question: Question = {
      ...insertQuestion,
      id: this.currentIds.question++,
    };
    this.questions.set(question.id, question);
    return question;
  }

  async updateQuestion(id: number, questionUpdate: Partial<Question>): Promise<Question | undefined> {
    const question = this.questions.get(id);
    if (!question) return undefined;

    const updatedQuestion = { ...question, ...questionUpdate };
    this.questions.set(id, updatedQuestion);
    return updatedQuestion;
  }

  async deleteQuestion(id: number): Promise<boolean> {
    return this.questions.delete(id);
  }

  // Test attempt operations
  async getTestAttempt(id: number): Promise<TestAttempt | undefined> {
    return this.testAttempts.get(id);
  }

  async getAttemptWithDetails(id: number): Promise<AttemptWithDetails | undefined> {
    const attempt = this.testAttempts.get(id);
    if (!attempt) return undefined;

    const test = this.tests.get(attempt.testId!);
    if (!test) return undefined;

    const attemptAnswers = Array.from(this.answers.values())
      .filter(a => a.attemptId === id)
      .map(answer => ({
        ...answer,
        question: this.questions.get(answer.questionId!)!,
      }))
      .filter(a => a.question);

    return {
      ...attempt,
      test,
      answers: attemptAnswers,
    };
  }

  async getAttemptsByUser(userId: number): Promise<TestAttempt[]> {
    return Array.from(this.testAttempts.values())
      .filter(attempt => attempt.userId === userId)
      .sort((a, b) => new Date(b.startedAt!).getTime() - new Date(a.startedAt!).getTime());
  }

  async createTestAttempt(insertAttempt: InsertTestAttempt): Promise<TestAttempt> {
    const attempt: TestAttempt = {
      ...insertAttempt,
      id: this.currentIds.testAttempt++,
      startedAt: new Date(),
    };
    this.testAttempts.set(attempt.id, attempt);
    return attempt;
  }

  async updateTestAttempt(id: number, attemptUpdate: Partial<TestAttempt>): Promise<TestAttempt | undefined> {
    const attempt = this.testAttempts.get(id);
    if (!attempt) return undefined;

    const updatedAttempt = { ...attempt, ...attemptUpdate };
    this.testAttempts.set(id, updatedAttempt);
    return updatedAttempt;
  }

  // Answer operations
  async getAnswer(id: number): Promise<Answer | undefined> {
    return this.answers.get(id);
  }

  async getAnswersByAttempt(attemptId: number): Promise<Answer[]> {
    return Array.from(this.answers.values()).filter(a => a.attemptId === attemptId);
  }

  async createAnswer(insertAnswer: InsertAnswer): Promise<Answer> {
    const answer: Answer = {
      ...insertAnswer,
      id: this.currentIds.answer++,
    };
    this.answers.set(answer.id, answer);
    return answer;
  }

  async updateAnswer(id: number, answerUpdate: Partial<Answer>): Promise<Answer | undefined> {
    const answer = this.answers.get(id);
    if (!answer) return undefined;

    const updatedAnswer = { ...answer, ...answerUpdate };
    this.answers.set(id, updatedAnswer);
    return updatedAnswer;
  }

  // Analytics
  async getUserStats(userId: number): Promise<{
    testsTaken: number;
    avgScore: number;
    totalStudyTime: number;
    rank: number;
  }> {
    const userAttempts = Array.from(this.testAttempts.values())
      .filter(attempt => attempt.userId === userId && attempt.status === "completed");

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
    const allUsers = Array.from(this.users.values()).filter(u => u.role === "student");
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
    return this.learningModules.get(id);
  }

  async getModuleWithLessons(id: number): Promise<ModuleWithLessons | undefined> {
    const module = this.learningModules.get(id);
    if (!module) return undefined;

    const lessons = Array.from(this.lessons.values())
      .filter(lesson => lesson.moduleId === id)
      .sort((a, b) => a.orderIndex - b.orderIndex);

    return { ...module, lessons };
  }

  async getPublishedModules(): Promise<LearningModule[]> {
    return Array.from(this.learningModules.values())
      .filter(module => module.isPublished)
      .sort((a, b) => a.id - b.id);
  }

  async createLearningModule(module: InsertLearningModule): Promise<LearningModule> {
    const newModule: LearningModule = {
      ...module,
      id: this.currentIds.learningModule++,
      createdAt: new Date(),
    };
    this.learningModules.set(newModule.id, newModule);
    return newModule;
  }

  async updateLearningModule(id: number, module: Partial<LearningModule>): Promise<LearningModule | undefined> {
    const existing = this.learningModules.get(id);
    if (!existing) return undefined;

    const updated = { ...existing, ...module };
    this.learningModules.set(id, updated);
    return updated;
  }

  // Lesson operations
  async getLesson(id: number): Promise<Lesson | undefined> {
    return this.lessons.get(id);
  }

  async getLessonsByModule(moduleId: number): Promise<Lesson[]> {
    return Array.from(this.lessons.values())
      .filter(lesson => lesson.moduleId === moduleId)
      .sort((a, b) => a.orderIndex - b.orderIndex);
  }

  async createLesson(lesson: InsertLesson): Promise<Lesson> {
    const newLesson: Lesson = {
      ...lesson,
      id: this.currentIds.lesson++,
    };
    this.lessons.set(newLesson.id, newLesson);
    return newLesson;
  }

  async updateLesson(id: number, lesson: Partial<Lesson>): Promise<Lesson | undefined> {
    const existing = this.lessons.get(id);
    if (!existing) return undefined;

    const updated = { ...existing, ...lesson };
    this.lessons.set(id, updated);
    return updated;
  }

  // User progress operations
  async getUserProgress(userId: number, lessonId: number): Promise<UserProgress | undefined> {
    return Array.from(this.userProgress.values())
      .find(progress => progress.userId === userId && progress.lessonId === lessonId);
  }

  async getUserModuleProgress(userId: number, moduleId: number): Promise<UserProgress[]> {
    return Array.from(this.userProgress.values())
      .filter(progress => progress.userId === userId && progress.moduleId === moduleId);
  }

  async createUserProgress(progress: InsertUserProgress): Promise<UserProgress> {
    const newProgress: UserProgress = {
      ...progress,
      id: this.currentIds.userProgress++,
    };
    this.userProgress.set(newProgress.id, newProgress);
    return newProgress;
  }

  async updateUserProgress(id: number, progress: Partial<UserProgress>): Promise<UserProgress | undefined> {
    const existing = this.userProgress.get(id);
    if (!existing) return undefined;

    const updated = { ...existing, ...progress };
    this.userProgress.set(id, updated);
    return updated;
  }

  // User stats operations
  async getUserGameStats(userId: number): Promise<UserStats | undefined> {
    return this.userStatsMap.get(userId);
  }

  async createOrUpdateUserStats(userId: number, stats: Partial<InsertUserStats>): Promise<UserStats> {
    const existing = this.userStatsMap.get(userId);
    
    if (existing) {
      const updated = { ...existing, ...stats };
      this.userStatsMap.set(userId, updated);
      return updated;
    } else {
      const newStats: UserStats = {
        id: this.currentIds.userStats++,
        userId,
        totalXp: 0,
        level: 1,
        streak: 0,
        lastActiveDate: new Date(),
        badges: [],
        achievements: [],
        ...stats,
      };
      this.userStatsMap.set(userId, newStats);
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

export const storage = new MemStorage();

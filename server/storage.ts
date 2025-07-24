import { users, tests, questions, testAttempts, answers, type User, type InsertUser, type Test, type InsertTest, type Question, type InsertQuestion, type TestAttempt, type InsertTestAttempt, type Answer, type InsertAnswer, type TestWithQuestions, type AttemptWithDetails } from "@shared/schema";

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
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private tests: Map<number, Test>;
  private questions: Map<number, Question>;
  private testAttempts: Map<number, TestAttempt>;
  private answers: Map<number, Answer>;
  private currentIds: {
    user: number;
    test: number;
    question: number;
    testAttempt: number;
    answer: number;
  };

  constructor() {
    this.users = new Map();
    this.tests = new Map();
    this.questions = new Map();
    this.testAttempts = new Map();
    this.answers = new Map();
    this.currentIds = {
      user: 1,
      test: 1,
      question: 1,
      testAttempt: 1,
      answer: 1,
    };

    // Initialize with sample data
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
}

export const storage = new MemStorage();

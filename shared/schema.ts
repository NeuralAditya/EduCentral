import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("student"), // student, educator
  createdAt: timestamp("created_at").defaultNow(),
});

export const topics = pgTable("topics", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  icon: text("icon"), // Icon name for UI
  color: text("color"), // Theme color
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const quizzes = pgTable("quizzes", {
  id: serial("id").primaryKey(),
  topicId: integer("topic_id").references(() => topics.id),
  title: text("title").notNull(),
  description: text("description"),
  level: text("level").notNull(), // beginner, intermediate, advanced
  totalQuestions: integer("total_questions").default(10),
  timeLimit: integer("time_limit"), // in minutes
  passingScore: integer("passing_score").default(70), // percentage
  pointsPerQuestion: integer("points_per_question").default(10),
  isPublished: boolean("is_published").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const tests = pgTable("tests", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  subject: text("subject").notNull(),
  duration: integer("duration").notNull(), // in minutes
  difficulty: text("difficulty").notNull(), // beginner, intermediate, advanced
  createdBy: integer("created_by").references(() => users.id),
  isPublished: boolean("is_published").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const quizQuestions = pgTable("quiz_questions", {
  id: serial("id").primaryKey(),
  quizId: integer("quiz_id").references(() => quizzes.id),
  question: text("question").notNull(),
  options: jsonb("options").notNull(), // Array of options for MCQ
  correctAnswer: text("correct_answer").notNull(),
  explanation: text("explanation"), // Explanation for the correct answer
  difficulty: text("difficulty").default("medium"), // easy, medium, hard
  orderIndex: integer("order_index").notNull(),
});

export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  testId: integer("test_id").references(() => tests.id),
  type: text("type").notNull(), // mcq, short_answer, video_response, photo_upload
  question: text("question").notNull(),
  options: jsonb("options"), // for MCQ options
  correctAnswer: text("correct_answer"), // for MCQ
  points: integer("points").default(1),
  timeLimit: integer("time_limit"), // in seconds
  aiCriteria: jsonb("ai_criteria"), // AI assessment criteria
  orderIndex: integer("order_index").notNull(),
});

export const testAttempts = pgTable("test_attempts", {
  id: serial("id").primaryKey(),
  testId: integer("test_id").references(() => tests.id),
  userId: integer("user_id").references(() => users.id),
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  totalScore: integer("total_score"),
  maxScore: integer("max_score"),
  timeSpent: integer("time_spent"), // in seconds
  aiOverallRating: integer("ai_overall_rating"), // 1-10
  status: text("status").default("in_progress"), // in_progress, completed, abandoned
});

export const answers = pgTable("answers", {
  id: serial("id").primaryKey(),
  attemptId: integer("attempt_id").references(() => testAttempts.id),
  questionId: integer("question_id").references(() => questions.id),
  answerType: text("answer_type").notNull(), // text, file, video, photo
  answerData: jsonb("answer_data"), // stores answer content
  score: integer("score"),
  maxScore: integer("max_score"),
  aiAssessment: jsonb("ai_assessment"), // AI feedback and scoring
  timeSpent: integer("time_spent"), // in seconds
});

// Learning gamification tables
export const learningModules = pgTable("learning_modules", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull(), // dsa, algorithms, data_structures, programming
  difficulty: text("difficulty").notNull(), // beginner, intermediate, advanced
  totalLessons: integer("total_lessons").notNull(),
  estimatedTime: integer("estimated_time"), // in minutes
  xpReward: integer("xp_reward").default(100),
  isPublished: boolean("is_published").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  moduleId: integer("module_id").references(() => learningModules.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  lessonType: text("lesson_type").notNull(), // theory, practice, challenge
  orderIndex: integer("order_index").notNull(),
  xpReward: integer("xp_reward").default(50),
  unlockCondition: jsonb("unlock_condition"), // prerequisites
});

export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  moduleId: integer("module_id").references(() => learningModules.id),
  lessonId: integer("lesson_id").references(() => lessons.id),
  isCompleted: boolean("is_completed").default(false),
  score: integer("score"), // for practice challenges
  timeSpent: integer("time_spent"), // in seconds
  completedAt: timestamp("completed_at"),
});

export const quizAttempts = pgTable("quiz_attempts", {
  id: serial("id").primaryKey(),
  quizId: integer("quiz_id").references(() => quizzes.id),
  userId: integer("user_id").references(() => users.id),
  score: integer("score").default(0), // Score achieved
  totalQuestions: integer("total_questions").notNull(),
  correctAnswers: integer("correct_answers").default(0),
  timeSpent: integer("time_spent"), // in seconds
  completedAt: timestamp("completed_at").defaultNow(),
  answers: jsonb("answers"), // Array of user answers with explanations
});

export const topicProgress = pgTable("topic_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  topicId: integer("topic_id").references(() => topics.id),
  currentLevel: text("current_level").default("beginner"), // beginner, intermediate, advanced
  totalPoints: integer("total_points").default(0),
  quizzesCompleted: integer("quizzes_completed").default(0),
  bestScore: integer("best_score").default(0),
  lastActivityAt: timestamp("last_activity_at").defaultNow(),
});

export const badges = pgTable("badges", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  icon: text("icon"),
  color: text("color"),
  requirement: jsonb("requirement"), // Badge unlock criteria
  points: integer("points").default(0), // Points awarded for earning badge
});

export const userBadges = pgTable("user_badges", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  badgeId: integer("badge_id").references(() => badges.id),
  earnedAt: timestamp("earned_at").defaultNow(),
});

export const leaderboard = pgTable("leaderboard", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  topicId: integer("topic_id").references(() => topics.id),
  totalPoints: integer("total_points").default(0),
  rank: integer("rank"),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const userStats = pgTable("user_stats", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).unique(),
  totalXp: integer("total_xp").default(0),
  level: integer("level").default(1),
  streak: integer("streak").default(0),
  lastActiveDate: timestamp("last_active_date"),
  badges: jsonb("badges").default([]), // array of earned badges
  achievements: jsonb("achievements").default([]),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertTestSchema = createInsertSchema(tests).omit({
  id: true,
  createdAt: true,
});

export const insertQuestionSchema = createInsertSchema(questions).omit({
  id: true,
});

export const insertTestAttemptSchema = createInsertSchema(testAttempts).omit({
  id: true,
  startedAt: true,
});

export const insertAnswerSchema = createInsertSchema(answers).omit({
  id: true,
});

export const insertLearningModuleSchema = createInsertSchema(learningModules).omit({
  id: true,
  createdAt: true,
});

export const insertLessonSchema = createInsertSchema(lessons).omit({
  id: true,
});

export const insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
});

export const insertUserStatsSchema = createInsertSchema(userStats).omit({
  id: true,
});

export const insertTopicSchema = createInsertSchema(topics).omit({
  id: true,
  createdAt: true,
});

export const insertQuizSchema = createInsertSchema(quizzes).omit({
  id: true,
  createdAt: true,
});

export const insertQuizQuestionSchema = createInsertSchema(quizQuestions).omit({
  id: true,
});

export const insertQuizAttemptSchema = createInsertSchema(quizAttempts).omit({
  id: true,
  completedAt: true,
});

export const insertTopicProgressSchema = createInsertSchema(topicProgress).omit({
  id: true,
  lastActivityAt: true,
});

export const insertBadgeSchema = createInsertSchema(badges).omit({
  id: true,
});

export const insertUserBadgeSchema = createInsertSchema(userBadges).omit({
  id: true,
  earnedAt: true,
});

export const insertLeaderboardSchema = createInsertSchema(leaderboard).omit({
  id: true,
  lastUpdated: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Test = typeof tests.$inferSelect;
export type InsertTest = z.infer<typeof insertTestSchema>;

export type Question = typeof questions.$inferSelect;
export type InsertQuestion = z.infer<typeof insertQuestionSchema>;

export type TestAttempt = typeof testAttempts.$inferSelect;
export type InsertTestAttempt = z.infer<typeof insertTestAttemptSchema>;

export type Answer = typeof answers.$inferSelect;
export type InsertAnswer = z.infer<typeof insertAnswerSchema>;

export type LearningModule = typeof learningModules.$inferSelect;
export type InsertLearningModule = z.infer<typeof insertLearningModuleSchema>;

export type Lesson = typeof lessons.$inferSelect;
export type InsertLesson = z.infer<typeof insertLessonSchema>;

export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;

export type UserStats = typeof userStats.$inferSelect;
export type InsertUserStats = z.infer<typeof insertUserStatsSchema>;

// Additional types for frontend
export type TestWithQuestions = Test & {
  questions: Question[];
  createdByUser?: User;
};

export type AttemptWithDetails = TestAttempt & {
  test: Test;
  answers: (Answer & { question: Question })[];
};

export type ModuleWithLessons = LearningModule & {
  lessons: Lesson[];
  userProgress?: UserProgress[];
};

export type LessonWithProgress = Lesson & {
  progress?: UserProgress;
};

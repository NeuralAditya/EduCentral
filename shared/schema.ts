import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("student"), // student, educator
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

// Additional types for frontend
export type TestWithQuestions = Test & {
  questions: Question[];
  createdByUser?: User;
};

export type AttemptWithDetails = TestAttempt & {
  test: Test;
  answers: (Answer & { question: Question })[];
};

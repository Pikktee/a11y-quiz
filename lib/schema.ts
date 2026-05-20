import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export type Answer = {
  question: string;
  user_answer: string;
  correct_answer: string;
  is_correct: boolean;
  category?: string;
  explanation?: string;
  sc_reference?: string;
};

export const quizResults = sqliteTable("quiz_results", {
  resultId: text("result_id").primaryKey(),
  name: text("name").notNull(),
  language: text("language", { enum: ["de", "en"] }).notNull(),
  module: text("module").notNull(),
  difficulty: text("difficulty", {
    enum: ["anfaenger", "fortgeschritten", "experte"],
  }).notNull(),
  score: integer("score").notNull(),
  total: integer("total").notNull(),
  answers: text("answers", { mode: "json" }).notNull().$type<Answer[]>(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export type QuizResult = typeof quizResults.$inferSelect;

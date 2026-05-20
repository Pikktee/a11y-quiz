import { z } from "zod";

export const answerSchema = z.object({
  question: z.string().min(1),
  user_answer: z.string().min(1),
  correct_answer: z.string().min(1),
  is_correct: z.boolean(),
  category: z.string().optional(),
  explanation: z.string().optional(),
  sc_reference: z.string().optional(),
});

export const quizSubmissionSchema = z
  .object({
    name: z.string().min(1).max(100),
    language: z.enum(["de", "en"]),
    module: z.string().min(1).max(100),
    difficulty: z.enum(["anfaenger", "fortgeschritten", "experte"]),
    score: z.number().int().min(0),
    total: z.number().int().min(1),
    answers: z.array(answerSchema).min(1),
  })
  .refine((data) => data.score <= data.total, {
    message: "score must not exceed total",
    path: ["score"],
  })
  .refine((data) => data.answers.length === data.total, {
    message: "answers.length must equal total",
    path: ["answers"],
  });

export type QuizSubmission = z.infer<typeof quizSubmissionSchema>;

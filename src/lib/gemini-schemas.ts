import { z } from "zod";

export const TechnicalTermSchema = z.object({
    term: z.string(),
    definition: z.string(),
});

export const GeneratedQuestionSchema = z.object({
    text: z.string().min(1),
    category: z.enum(["Technical", "Behavioral", "Situational"]),
    difficulty: z.enum(["Novice", "Advanced", "Hard"]),
    explanation: z.string().min(1),
    example: z.string().min(1),
    technical_terms: z.array(TechnicalTermSchema).default([]),
});

export const GeneratedQuestionsSchema = z.array(GeneratedQuestionSchema);

export const EvaluationSchema = z.object({
    rating: z.number().min(1).max(5),
    feedback: z.string().min(1),
    suggestions: z.array(z.string()).min(1),
});

export const InterviewFeedbackSchema = z.object({
    overallRating: z.number().min(1).max(5),
    score: z.number().min(0).max(20),
    maxScore: z.number(),
    avgResponseTime: z.number().min(0),
    strengths: z.array(z.string()).min(1),
    weaknesses: z.array(z.string()).min(1),
    detailedFeedback: z.string().min(1),
    suggestions: z.array(z.string()).min(1),
});

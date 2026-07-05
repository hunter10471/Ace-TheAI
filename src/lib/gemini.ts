import { GoogleGenAI, Type, Schema } from "@google/genai";
import { z } from "zod";
import {
    GeneratedQuestionsSchema,
    EvaluationSchema,
    InterviewFeedbackSchema,
} from "./gemini-schemas";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GEMINI_API_KEY });

const MODEL = "gemini-2.5-flash";

export interface TechnicalTerm {
    term: string;
    definition: string;
}

export interface GeneratedQuestion {
    text: string;
    category: "Technical" | "Behavioral" | "Situational";
    difficulty: "Novice" | "Advanced" | "Hard";
    explanation: string;
    example: string;
    technical_terms: TechnicalTerm[];
}

export interface UserProfile {
    job_title: string;
    years_of_experience: string;
    key_skills: string[];
    professional_goal: string;
}

export interface InterviewContext {
    userProfile: UserProfile;
    interviewType: "Technical" | "Behavioral" | "Situational" | "Mock";
    difficulty: "Novice" | "Advanced" | "Hard";
    duration: number;
    currentQuestionIndex: number;
    previousQuestions: string[];
    userResponses: string[];
}

export interface InterviewFeedback {
    overallRating: number;
    score: number;
    maxScore: number;
    avgResponseTime: number;
    strengths: string[];
    weaknesses: string[];
    detailedFeedback: string;
    suggestions: string[];
}

/**
 * Runs a prompt with Gemini structured output and validates the JSON
 * against a Zod schema. Retries once — with schema-constrained output a
 * parse failure is rare, but the retry is cheap insurance.
 */
async function generateStructured<T>(
    prompt: string,
    responseSchema: Schema,
    zodSchema: z.ZodType<T>
): Promise<T> {
    let lastError: unknown;

    for (let attempt = 0; attempt < 2; attempt++) {
        try {
            const response = await ai.models.generateContent({
                model: MODEL,
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema,
                },
            });

            return zodSchema.parse(JSON.parse(response.text ?? ""));
        } catch (error) {
            lastError = error;
            console.error(
                `Gemini structured generation failed (attempt ${attempt + 1}):`,
                error
            );
        }
    }

    throw lastError instanceof Error
        ? lastError
        : new Error("Gemini structured generation failed");
}

const technicalTermSchema: Schema = {
    type: Type.OBJECT,
    properties: {
        term: { type: Type.STRING },
        definition: { type: Type.STRING },
    },
    required: ["term", "definition"],
};

const generatedQuestionsSchema: Schema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            text: { type: Type.STRING },
            category: {
                type: Type.STRING,
                enum: ["Technical", "Behavioral", "Situational"],
            },
            difficulty: {
                type: Type.STRING,
                enum: ["Novice", "Advanced", "Hard"],
            },
            explanation: { type: Type.STRING },
            example: { type: Type.STRING },
            technical_terms: {
                type: Type.ARRAY,
                items: technicalTermSchema,
            },
        },
        required: [
            "text",
            "category",
            "difficulty",
            "explanation",
            "example",
            "technical_terms",
        ],
    },
};

const evaluationSchema: Schema = {
    type: Type.OBJECT,
    properties: {
        rating: { type: Type.INTEGER },
        feedback: { type: Type.STRING },
        suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
    },
    required: ["rating", "feedback", "suggestions"],
};

const interviewFeedbackSchema: Schema = {
    type: Type.OBJECT,
    properties: {
        overallRating: { type: Type.INTEGER },
        score: { type: Type.INTEGER },
        maxScore: { type: Type.INTEGER },
        avgResponseTime: { type: Type.INTEGER },
        strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
        weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
        detailedFeedback: { type: Type.STRING },
        suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
    },
    required: [
        "overallRating",
        "score",
        "maxScore",
        "avgResponseTime",
        "strengths",
        "weaknesses",
        "detailedFeedback",
        "suggestions",
    ],
};

export async function generatePersonalizedQuestions(
    userProfile: UserProfile,
    count: number = 20
): Promise<GeneratedQuestion[]> {
    const prompt = `Generate ${count} personalized interview questions for a user with the following profile:

Job Title: ${userProfile.job_title}
Years of Experience: ${userProfile.years_of_experience}
Key Skills: ${userProfile.key_skills?.join(", ") || "Not specified"}
Professional Goal: ${userProfile.professional_goal || "Not specified"}

Requirements:
- Mix of categories: 40% Technical, 35% Behavioral, 25% Situational
- Mix of difficulties: 50% Novice, 30% Advanced, 20% Hard
- Each question should be relevant to their job title and experience level
- Provide detailed, educational answers that teach users how to ace their interviews

For each question:
- In "explanation": Provide a comprehensive, step-by-step guide on how to answer the question. Include specific phrases to use, how to structure the response, and what to emphasize. Make it educational and actionable.
- In "example": Give a detailed real-world example showing exactly how to apply the answer, including specific details and outcomes.
- In "technical_terms": Include any technical terms, jargon, or concepts mentioned in the explanation or example, with simple definitions.
- Structure answers clearly with steps or bullet points when helpful.`;

    const questions = await generateStructured(
        prompt,
        generatedQuestionsSchema,
        GeneratedQuestionsSchema
    );

    return questions.slice(0, count);
}

export async function generateNextQuestion(
    context: InterviewContext
): Promise<string> {
    const prompt = `You are a senior ${
        context.userProfile.job_title
    } with 15+ years of experience conducting a ${
        context.interviewType
    } interview for a ${context.difficulty} level position.

User Profile:
- Job Title: ${context.userProfile.job_title}
- Experience: ${context.userProfile.years_of_experience}
- Skills: ${context.userProfile.key_skills?.join(", ") || "Not specified"}
- Goal: ${context.userProfile.professional_goal || "Not specified"}

Interview Context:
- Type: ${context.interviewType}
- Difficulty: ${context.difficulty}
- Duration: ${context.duration} minutes
- Current Question Number: ${context.currentQuestionIndex + 1}
- Previous Questions Asked: ${context.previousQuestions.join(" | ")}
- User's Previous Responses: ${context.userResponses.join(" | ")}

CRITICAL: Generate a completely different question from the previous ones. Do NOT repeat any question that has already been asked.

For ${
        context.interviewType
    } interviews, generate REALISTIC questions that actual senior professionals would ask:

TECHNICAL QUESTIONS (for different roles):
- Doctor: "Walk me through your differential diagnosis process for a patient presenting with chest pain and shortness of breath. What specific tests would you order and why?"
- Software Engineer: "How would you design a scalable microservices architecture for a real-time messaging system handling 1M+ concurrent users?"
- Data Scientist: "Explain how you would approach building a recommendation system for an e-commerce platform. What algorithms would you consider and how would you evaluate them?"
- Product Manager: "How would you prioritize features for a mobile app with limited development resources and competing stakeholder demands?"
- Marketing Manager: "Walk me through your approach to launching a new product in a saturated market. How would you differentiate and measure success?"

BEHAVIORAL QUESTIONS:
- "Tell me about a time when you had to make a critical decision with incomplete information. What was your process and what was the outcome?"
- "Describe a situation where you had to lead a team through a major organizational change. How did you handle resistance?"
- "Give me an example of when you failed at something important. What did you learn and how did you apply those lessons?"

SITUATIONAL QUESTIONS:
- "You discover a critical error in production that's affecting customers. Walk me through your immediate response and escalation process."
- "A key team member is consistently missing deadlines. How would you address this situation?"
- "You're given a project with unrealistic timelines. How do you handle this with stakeholders?"

Difficulty level ${context.difficulty}:
- Novice: Basic concepts, fundamental knowledge, entry-level expectations
- Advanced: Intermediate concepts, practical applications, mid-level experience
- Hard: Complex scenarios, deep technical knowledge, senior-level expectations

Generate ONE specific, realistic question that:
1. Is completely different from previous questions
2. Matches the interview type and difficulty
3. Is specific to the user's job title and experience level
4. Sounds like it's coming from a real senior professional
5. Requires detailed, practical knowledge

Return ONLY the question text, nothing else. Make it sound natural and professional.`;

    const response = await ai.models.generateContent({
        model: MODEL,
        contents: prompt,
    });

    return (response.text ?? "").trim();
}

export async function evaluateResponse(
    question: string,
    userResponse: string,
    context: InterviewContext
): Promise<{
    rating: number;
    feedback: string;
    suggestions: string[];
}> {
    const prompt = `You are a senior ${context.userProfile.job_title} evaluating a candidate's response in a ${context.difficulty} level ${context.interviewType} interview.

Question: "${question}"
Candidate Response: "${userResponse}"

Evaluate this response on a scale of 1-5 where:
1 = Poor (vague, incorrect, or missing key points)
2 = Below Average (some relevant points but lacks depth)
3 = Average (adequate response with room for improvement)
4 = Good (solid response with good examples and structure)
5 = Excellent (comprehensive, well-structured, with specific examples)

Provide:
1. A numerical rating (1-5)
2. Detailed feedback explaining the rating
3. 2-3 specific suggestions for improvement`;

    const evaluation = await generateStructured(
        prompt,
        evaluationSchema,
        EvaluationSchema
    );

    return {
        rating: Math.max(1, Math.min(5, Math.round(evaluation.rating))),
        feedback: evaluation.feedback,
        suggestions: evaluation.suggestions,
    };
}

export async function generateInterviewFeedback(
    context: InterviewContext,
    questionRatings: number[],
    responseTimes: number[]
): Promise<InterviewFeedback> {
    const prompt = `You are a senior ${
        context.userProfile.job_title
    } providing comprehensive feedback for a ${context.difficulty} level ${
        context.interviewType
    } interview.

Interview Summary:
- Job Title: ${context.userProfile.job_title}
- Interview Type: ${context.interviewType}
- Difficulty: ${context.difficulty}
- Questions Asked: ${context.previousQuestions.length}
- Average Rating: ${(
        questionRatings.reduce((a, b) => a + b, 0) /
        Math.max(1, questionRatings.length)
    ).toFixed(1)}/5
- Average Response Time: ${(
        responseTimes.reduce((a, b) => a + b, 0) /
        Math.max(1, responseTimes.length)
    ).toFixed(0)} seconds

Questions and Responses:
${context.previousQuestions.map((q, i) => `Q${i + 1}: ${q}`).join("\n")}

${context.userResponses.map((r, i) => `A${i + 1}: ${r}`).join("\n")}

Provide comprehensive feedback including:
1. Overall rating (1-5)
2. Score calculation (rating * 4, max 20) with maxScore always 20
3. Average response time in seconds
4. 3-4 key strengths
5. 3-4 areas for improvement (weaknesses)
6. Detailed feedback with specific examples
7. 4-5 actionable suggestions for future interviews`;

    const feedback = await generateStructured(
        prompt,
        interviewFeedbackSchema,
        InterviewFeedbackSchema
    );

    return {
        overallRating: Math.max(
            1,
            Math.min(5, Math.round(feedback.overallRating))
        ),
        score: Math.max(0, Math.min(20, Math.round(feedback.score))),
        maxScore: 20,
        avgResponseTime: Math.max(0, Math.round(feedback.avgResponseTime)),
        strengths: feedback.strengths,
        weaknesses: feedback.weaknesses,
        detailedFeedback: feedback.detailedFeedback,
        suggestions: feedback.suggestions,
    };
}

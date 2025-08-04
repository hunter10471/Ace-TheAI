import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import {
    createInterviewSession,
    updateInterviewSession,
    createInterviewFeedback,
    getCurrentUser,
} from "@/lib/interview-operations";
import {
    generateNextQuestion,
    evaluateResponse,
    generateInterviewFeedback,
    InterviewContext,
    InterviewFeedback as GeminiFeedback,
} from "@/lib/gemini";

export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        const body = await request.json();
        const { action, ...data } = body;

        switch (action) {
            case "start":
                return await handleStartInterview(user.id, data);
            case "next_question":
                return await handleNextQuestion(user.id, data);
            case "evaluate_response":
                return await handleEvaluateResponse(user.id, data);
            case "complete":
                return await handleCompleteInterview(user.id, data);
            default:
                return NextResponse.json(
                    { success: false, error: "Invalid action" },
                    { status: 400 }
                );
        }
    } catch (error: any) {
        console.error("Interview API error:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}

async function handleStartInterview(userId: string, data: any) {
    const { interviewType, difficulty, duration, jobTitle } = data;

    // Create interview session
    const sessionData = {
        user_id: userId,
        interview_type: interviewType,
        difficulty: difficulty,
        duration: duration,
        job_title: jobTitle,
        status: "in_progress",
        started_at: new Date().toISOString(),
        current_question_index: 0,
        questions_asked: [],
        user_responses: [],
        question_ratings: [],
        response_times: [],
    };

    const session = await createInterviewSession(sessionData);

    // Generate first question
    const context: InterviewContext = {
        userProfile: {
            job_title: jobTitle,
            years_of_experience: "2-5 years", // Default, could be fetched from user profile
            key_skills: [],
            professional_goal: "",
        },
        interviewType,
        difficulty,
        duration,
        currentQuestionIndex: 0,
        previousQuestions: [],
        userResponses: [],
    };

    const firstQuestion = await generateNextQuestion(context);

    return NextResponse.json({
        success: true,
        data: {
            sessionId: session.id,
            question: firstQuestion,
            session,
        },
    });
}

async function handleNextQuestion(userId: string, data: any) {
    const {
        sessionId,
        currentQuestion,
        userResponse,
        responseTime,
        currentQuestionIndex,
        questionsAsked,
        userResponses,
        questionRatings,
        responseTimes,
        rating,
    } = data;

    // Update session with current response
    const session = await updateInterviewSession(sessionId, {
        current_question_index: currentQuestionIndex + 1,
        questions_asked: [...questionsAsked, currentQuestion],
        user_responses: [...userResponses, userResponse],
        question_ratings: [...questionRatings, rating],
        response_times: [...responseTimes, responseTime],
    });

    // Check if we've reached the maximum questions for the duration
    const maxQuestions = Math.ceil(session.duration / 2); // Roughly 2 minutes per question
    if (session.current_question_index >= maxQuestions) {
        return NextResponse.json({
            success: false,
            error: "Interview completed - maximum questions reached",
            data: { session },
        });
    }

    // Generate next question
    const context: InterviewContext = {
        userProfile: {
            job_title: session.job_title,
            years_of_experience: "2-5 years",
            key_skills: [],
            professional_goal: "",
        },
        interviewType: session.interview_type,
        difficulty: session.difficulty,
        duration: session.duration,
        currentQuestionIndex: session.current_question_index,
        previousQuestions: session.questions_asked,
        userResponses: session.user_responses,
    };

    const nextQuestion = await generateNextQuestion(context);

    // Ensure the next question is different from all previous questions
    const allPreviousQuestions = [...session.questions_asked, currentQuestion];
    if (allPreviousQuestions.includes(nextQuestion)) {
        // Generate a different question by adding more context and emphasizing uniqueness
        const alternativeContext: InterviewContext = {
            ...context,
            currentQuestionIndex: session.current_question_index + 1,
            previousQuestions: allPreviousQuestions,
        };

        // Try multiple times to get a unique question
        let alternativeQuestion = await generateNextQuestion(
            alternativeContext
        );
        let attempts = 0;

        while (
            allPreviousQuestions.includes(alternativeQuestion) &&
            attempts < 3
        ) {
            alternativeContext.currentQuestionIndex += 1;
            alternativeQuestion = await generateNextQuestion(
                alternativeContext
            );
            attempts++;
        }

        return NextResponse.json({
            success: true,
            data: {
                question: alternativeQuestion,
                session,
            },
        });
    }

    return NextResponse.json({
        success: true,
        data: {
            question: nextQuestion,
            session,
        },
    });
}

async function handleEvaluateResponse(userId: string, data: any) {
    const { question, userResponse, sessionId, currentQuestionIndex } = data;

    // Get session data
    const session = await updateInterviewSession(sessionId, {
        current_question_index: currentQuestionIndex,
    });

    const context: InterviewContext = {
        userProfile: {
            job_title: session.job_title,
            years_of_experience: "2-5 years",
            key_skills: [],
            professional_goal: "",
        },
        interviewType: session.interview_type,
        difficulty: session.difficulty,
        duration: session.duration,
        currentQuestionIndex: session.current_question_index,
        previousQuestions: session.questions_asked || [],
        userResponses: session.user_responses || [],
    };

    const evaluation = await evaluateResponse(question, userResponse, context);

    return NextResponse.json({
        success: true,
        data: evaluation,
    });
}

async function handleCompleteInterview(userId: string, data: any) {
    const { sessionId, questionRatings, responseTimes } = data;

    // Get session data
    const session = await updateInterviewSession(sessionId, {
        status: "completed",
        completed_at: new Date().toISOString(),
        question_ratings: questionRatings,
        response_times: responseTimes,
    });

    // Generate comprehensive feedback
    const context: InterviewContext = {
        userProfile: {
            job_title: session.job_title,
            years_of_experience: "2-5 years",
            key_skills: [],
            professional_goal: "",
        },
        interviewType: session.interview_type,
        difficulty: session.difficulty,
        duration: session.duration,
        currentQuestionIndex: session.current_question_index,
        previousQuestions: session.questions_asked || [],
        userResponses: session.user_responses || [],
    };

    const feedback: GeminiFeedback = await generateInterviewFeedback(
        context,
        questionRatings,
        responseTimes
    );

    // Save feedback to database
    const feedbackData = {
        session_id: sessionId,
        overall_rating: feedback.overallRating,
        score: feedback.score,
        max_score: feedback.maxScore,
        avg_response_time: feedback.avgResponseTime,
        strengths: feedback.strengths,
        weaknesses: feedback.weaknesses,
        detailed_feedback: feedback.detailedFeedback,
        suggestions: feedback.suggestions,
        questions_asked: session.questions_asked,
        user_responses: session.user_responses,
        question_ratings: questionRatings,
        response_times: responseTimes,
    };

    const savedFeedback = await createInterviewFeedback(feedbackData);

    return NextResponse.json({
        success: true,
        data: {
            session,
            feedback: savedFeedback,
            summary: {
                score: feedback.score,
                maxScore: feedback.maxScore,
                rating: feedback.overallRating,
                avgResponseTime: feedback.avgResponseTime,
                strengths: feedback.strengths,
                weaknesses: feedback.weaknesses,
            },
        },
    });
}

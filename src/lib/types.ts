import { IconType } from "react-icons";

export interface NavLink {
    route: string;
    name: string;
}

export interface Feature {
    img: string;
    backgroundColor: string;
    heading: string;
    desc: string;
}

export interface ProcessStep {
    image: string;
    title: string;
    description: string;
}

export interface SidebarLink {
    label: string;
    url?: string;
    icon?: IconType;
}

export interface User {
    id: string;
    name: string;
    email: string;
    password: string | null;
    created_at: string;
    provider?: string;
    provider_id?: string;
}

export interface UserFormData {
    name: string;
    email: string;
    password: string;
}

export enum DashboardStatsCardType {
    PracticeSessions = "practice-sessions",
    InterviewSuccess = "interview-success",
    InterviewThisWeek = "interview-this-week",
}

export interface InterviewSession {
    id: string;
    user_id: string;
    interview_type: string;
    difficulty: string;
    duration: number;
    job_title: string;
    status: string;
    started_at: string;
    completed_at?: string;
    current_question_index: number;
    questions_asked: string[];
    user_responses: string[];
    question_ratings: number[];
    response_times: number[];
    created_at: string;
    updated_at: string;
}

export interface InterviewFeedback {
    id: string;
    session_id: string;
    overall_rating: number;
    score: number;
    max_score: number;
    avg_response_time: number;
    strengths: string[];
    weaknesses: string[];
    detailed_feedback: string;
    suggestions: string[];
    questions_asked: string[];
    user_responses: string[];
    question_ratings: number[];
    response_times: number[];
    created_at: string;
}

export interface FeedbackEntry {
    id: string;
    date: string;
    title: string;
    category: "Technical" | "Behavioral" | "Situational" | "Mock";
    rating: number;
    summary: string;
    explanation?: string;
    example?: string;
    session?: InterviewSession;
    feedback?: InterviewFeedback;
}

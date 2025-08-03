-- Database Setup for Google Authentication and Profile Management
-- Run this in your Supabase SQL editor

-- Check if the users table exists and has the correct structure
-- If not, create it with all necessary columns

CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    provider VARCHAR(50),
    provider_id VARCHAR(255),
    -- Profile fields
    date_of_birth DATE,
    phone_number VARCHAR(20),
    country VARCHAR(100),
    job_title VARCHAR(100),
    years_of_experience VARCHAR(10),
    key_skills TEXT[],
    professional_goal TEXT
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_provider ON users(provider);
CREATE INDEX IF NOT EXISTS idx_users_provider_id ON users(provider_id);

-- Add unique constraint for provider_id when provider is google
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_google_provider_id
ON users(provider_id)
WHERE provider = 'google';

-- Questions table for storing generated questions
CREATE TABLE IF NOT EXISTS questions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    category VARCHAR(20) CHECK (category IN ('Technical', 'Behavioral', 'Situational')),
    difficulty VARCHAR(20) CHECK (difficulty IN ('Novice', 'Advanced', 'Hard')),
    explanation TEXT NOT NULL,
    example TEXT NOT NULL,
    technical_terms JSONB DEFAULT '[]'::jsonb,
    generated_date DATE DEFAULT CURRENT_DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User bookmarks table
CREATE TABLE IF NOT EXISTS user_bookmarks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, question_id)
);

-- Daily generation tracking table
CREATE TABLE IF NOT EXISTS daily_question_generation (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    generation_date DATE DEFAULT CURRENT_DATE,
    questions_generated INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, generation_date)
);

-- Generation jobs table for tracking background generation processes
CREATE TABLE IF NOT EXISTS generation_jobs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    result JSONB,
    error TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_questions_user_id ON questions(user_id);
CREATE INDEX IF NOT EXISTS idx_questions_generated_date ON questions(generated_date);
CREATE INDEX IF NOT EXISTS idx_questions_category ON questions(category);
CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON questions(difficulty);
CREATE INDEX IF NOT EXISTS idx_user_bookmarks_user_id ON user_bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_user_bookmarks_question_id ON user_bookmarks(question_id);
CREATE INDEX IF NOT EXISTS idx_daily_generation_user_date ON daily_question_generation(user_id, generation_date);
CREATE INDEX IF NOT EXISTS idx_generation_jobs_user_id ON generation_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_generation_jobs_status ON generation_jobs(status);
CREATE INDEX IF NOT EXISTS idx_generation_jobs_created_at ON generation_jobs(created_at);


-- Check the table structure
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position; 
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

-- Insert a test user to verify the table works
-- (You can delete this later)
INSERT INTO users (name, email, password, provider)
VALUES ('Test User', 'test@example.com', 'hashedpassword', 'credentials')
ON CONFLICT (email) DO NOTHING;

-- Check the table structure
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position; 
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

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

export async function generatePersonalizedQuestions(
    userProfile: UserProfile,
    count: number = 20
): Promise<GeneratedQuestion[]> {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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

Return ONLY a valid JSON array with this exact structure:
[
  {
    "text": "Question text here",
    "category": "Technical|Behavioral|Situational",
    "difficulty": "Novice|Advanced|Hard",
    "explanation": "A comprehensive, step-by-step guide on how to answer this question. Include specific phrases to use, structure your response, and what to emphasize. Make it educational and actionable.",
    "example": "A detailed real-world example showing exactly how to apply the answer, including specific details and outcomes",
    "technical_terms": [
      {
        "term": "technical term used in explanation/example",
        "definition": "Simple definition of the technical term"
      }
    ]
  }
]

Important: 
- In "explanation": Provide a detailed, educational guide on how to answer the question
- In "example": Give a comprehensive example with specific details
- Make answers descriptive and actionable - users should learn exactly what to say
- In "technical_terms": Include any technical terms, jargon, or concepts mentioned in the explanation or example
- Keep technical term definitions simple and easy to understand
- Structure answers clearly with steps or bullet points when helpful`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Extract JSON from the response
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (!jsonMatch) {
            throw new Error("No valid JSON found in response");
        }

        const questions = JSON.parse(jsonMatch[0]) as GeneratedQuestion[];

        // Validate the structure and normalize categories/difficulties
        const validatedQuestions = questions.map((q, index) => {
            if (
                !q.text ||
                !q.category ||
                !q.difficulty ||
                !q.explanation ||
                !q.example
            ) {
                throw new Error(`Invalid question structure at index ${index}`);
            }

            // Normalize category to match database constraints
            const normalizedCategory = q.category.trim();
            if (
                !["Technical", "Behavioral", "Situational"].includes(
                    normalizedCategory
                )
            ) {
                throw new Error(
                    `Invalid category "${normalizedCategory}" at index ${index}`
                );
            }

            // Normalize difficulty to match database constraints
            const normalizedDifficulty = q.difficulty.trim();
            if (
                !["Novice", "Advanced", "Hard"].includes(normalizedDifficulty)
            ) {
                throw new Error(
                    `Invalid difficulty "${normalizedDifficulty}" at index ${index}`
                );
            }

            return {
                ...q,
                category: normalizedCategory as
                    | "Technical"
                    | "Behavioral"
                    | "Situational",
                difficulty: normalizedDifficulty as
                    | "Novice"
                    | "Advanced"
                    | "Hard",
            };
        });

        return validatedQuestions.slice(0, count);
    } catch (error) {
        console.error("Error generating questions with Gemini:", error);

        // Fallback to mock questions if Gemini fails
        return generateFallbackQuestions(userProfile, count);
    }
}

export async function generateNextQuestion(
    context: InterviewContext
): Promise<string> {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text().trim();
    } catch (error) {
        console.error("Error generating next question:", error);
        return generateFallbackQuestion(context);
    }
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
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `You are a senior ${
            context.userProfile.job_title
        } evaluating a candidate's response in a ${context.difficulty} level ${
            context.interviewType
        } interview.

Question: "${question}"
Candidate Response: "${userResponse}"

User Profile:
- Job Title: ${context.userProfile.job_title}
- Experience: ${context.userProfile.years_of_experience}
- Skills: ${context.userProfile.key_skills?.join(", ") || "Not specified"}

Evaluate this response as a senior professional would. Provide:
1. A rating from 1-5 (1=poor, 5=excellent)
2. Professional feedback explaining what was good and what could be improved
3. 2-3 specific suggestions for improvement

IMPORTANT: Do NOT use phrases like "Thank you for your response" or "Here's my feedback". Write as a senior professional giving direct, constructive feedback.

Consider:
- Technical accuracy and depth of knowledge
- Practical application and real-world relevance
- Communication clarity and structure
- Use of specific examples and measurable outcomes
- Professional tone and confidence
- Alignment with the candidate's experience level
- Problem-solving approach and critical thinking

Return ONLY a valid JSON object with this exact structure:
{
  "rating": 4,
  "feedback": "Your approach to the differential diagnosis shows solid clinical reasoning. You correctly identified the key diagnostic tests, though I'd like to see more consideration of alternative diagnoses. Your communication is clear and structured well.",
  "suggestions": ["Include more differential diagnoses in your initial assessment", "Consider the cost-benefit analysis of diagnostic tests", "Practice explaining complex medical concepts to patients"]
}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Extract JSON from the response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("No valid JSON found in response");
        }

        return JSON.parse(jsonMatch[0]);
    } catch (error) {
        console.error("Error evaluating response:", error);
        return {
            rating: 3,
            feedback:
                "Your response demonstrates basic understanding of the concept. Consider providing more specific examples and technical details relevant to your role.",
            suggestions: [
                "Provide specific examples from your experience",
                "Include technical details and methodologies",
                "Structure your response with clear steps or frameworks",
            ],
        };
    }
}

export async function generateInterviewFeedback(
    context: InterviewContext,
    questionRatings: number[],
    responseTimes: number[]
): Promise<InterviewFeedback> {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const avgRating =
            questionRatings.reduce((a, b) => a + b, 0) / questionRatings.length;
        const avgResponseTime =
            responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;

        const prompt = `Generate comprehensive interview feedback for a ${
            context.interviewType
        } interview.

Interview Summary:
- Type: ${context.interviewType}
- Difficulty: ${context.difficulty}
- Job Title: ${context.userProfile.job_title}
- Experience: ${context.userProfile.years_of_experience}
- Questions Answered: ${context.currentQuestionIndex + 1}
- Average Rating: ${avgRating.toFixed(1)}/5
- Average Response Time: ${avgResponseTime.toFixed(1)} seconds

User Responses: ${context.userResponses.join(" | ")}

Generate comprehensive feedback including:
1. Overall rating (1-5)
2. Score calculation (based on ratings and response quality)
3. 3-4 specific strengths
4. 3-4 areas for improvement
5. Detailed feedback summary
6. 3-4 actionable suggestions

Return ONLY a valid JSON object with this exact structure:
{
  "overallRating": 4,
  "score": 16,
  "maxScore": 20,
  "avgResponseTime": 45,
  "strengths": ["Strength 1", "Strength 2", "Strength 3"],
  "weaknesses": ["Weakness 1", "Weakness 2", "Weakness 3"],
  "detailedFeedback": "Comprehensive feedback summary...",
  "suggestions": ["Suggestion 1", "Suggestion 2", "Suggestion 3"]
}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Extract JSON from the response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("No valid JSON found in response");
        }

        return JSON.parse(jsonMatch[0]);
    } catch (error) {
        console.error("Error generating interview feedback:", error);
        return generateFallbackFeedback(
            context,
            questionRatings,
            responseTimes
        );
    }
}

function generateFallbackQuestion(context: InterviewContext): string {
    const jobTitle = context.userProfile.job_title.toLowerCase();

    const questions = {
        Technical: {
            doctor: [
                "Walk me through your differential diagnosis process for a patient presenting with chest pain and shortness of breath. What specific tests would you order and why?",
                "How do you approach a patient with multiple comorbidities who presents with acute symptoms? What's your prioritization strategy?",
                "Describe your process for interpreting complex lab results and communicating findings to patients and their families.",
            ],
            "software engineer": [
                "How would you design a scalable microservices architecture for a real-time messaging system handling 1M+ concurrent users?",
                "Walk me through your approach to debugging a production issue that's affecting multiple users across different regions.",
                "How do you ensure code quality and maintainability in a large codebase with multiple developers?",
            ],
            "data scientist": [
                "Explain how you would approach building a recommendation system for an e-commerce platform. What algorithms would you consider?",
                "How do you handle missing data in a large dataset? Walk me through your methodology.",
                "Describe your process for validating and testing machine learning models before deployment.",
            ],
            default: [
                `As a ${context.userProfile.job_title}, how do you approach complex problem-solving in your field?`,
                `Can you explain a technical concept you recently learned and how you applied it in practice?`,
                `What's your experience with industry-standard tools and methodologies in your role?`,
            ],
        },
        Behavioral: {
            doctor: [
                "Tell me about a time when you had to deliver difficult news to a patient or their family. How did you handle it?",
                "Describe a situation where you had to work with a difficult colleague in a high-pressure medical environment.",
                "Give me an example of when you had to make a critical medical decision with incomplete information.",
            ],
            "software engineer": [
                "Tell me about a time when you had to work with a difficult team member on a critical project. How did you handle it?",
                "Describe a project where you had to learn a new technology quickly to meet a deadline.",
                "Can you share an example of when you had to make a difficult technical decision that affected the entire team?",
            ],
            default: [
                "Tell me about a time when you had to work with a difficult team member. How did you handle it?",
                "Describe a project where you had to learn something new quickly. What was the outcome?",
                "Can you share an example of when you had to make a difficult decision at work?",
            ],
        },
        Situational: {
            doctor: [
                "You discover a critical error in a patient's treatment plan. Walk me through your immediate response and escalation process.",
                "A patient is refusing a recommended treatment. How would you handle this situation?",
                "You're given a patient with multiple complex conditions and limited time. How do you prioritize your approach?",
            ],
            "software engineer": [
                "You discover a critical bug in production that's affecting customers. Walk me through your immediate response and escalation process.",
                "A key team member is consistently missing deadlines. How would you address this situation?",
                "You're given a project with unrealistic timelines. How do you handle this with stakeholders?",
            ],
            default: [
                "If you discovered a critical error in production, what would be your immediate steps?",
                "How would you handle a situation where a client is unhappy with your work?",
                "What would you do if you disagreed with your manager's decision?",
            ],
        },
    };

    const categoryQuestions =
        questions[context.interviewType as keyof typeof questions];
    const jobSpecificQuestions =
        categoryQuestions[jobTitle as keyof typeof categoryQuestions] ||
        categoryQuestions.default;
    return jobSpecificQuestions[
        context.currentQuestionIndex % jobSpecificQuestions.length
    ];
}

function generateFallbackFeedback(
    context: InterviewContext,
    questionRatings: number[],
    responseTimes: number[]
): InterviewFeedback {
    const avgRating =
        questionRatings.reduce((a, b) => a + b, 0) / questionRatings.length;
    const avgResponseTime =
        responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;

    return {
        overallRating: Math.round(avgRating),
        score: Math.round(avgRating * 4),
        maxScore: 20,
        avgResponseTime: Math.round(avgResponseTime),
        strengths: [
            "Good understanding of core concepts",
            "Clear communication style",
            "Professional approach to problem-solving",
        ],
        weaknesses: [
            "Could provide more specific examples",
            "Consider improving response structure",
            "Work on time management during responses",
        ],
        detailedFeedback: `You completed a ${context.difficulty} level ${
            context.interviewType
        } interview for a ${
            context.userProfile.job_title
        } position. Your overall performance was solid, with an average rating of ${avgRating.toFixed(
            1
        )}/5. You demonstrated good foundational knowledge and maintained a professional demeanor throughout the interview.`,
        suggestions: [
            "Practice providing specific examples from your experience",
            "Work on structuring your responses more clearly",
            "Focus on quantifying your achievements when possible",
            "Consider preparing more detailed answers for common questions",
        ],
    };
}

function generateFallbackQuestions(
    userProfile: UserProfile,
    count: number
): GeneratedQuestion[] {
    const baseQuestions = [
        {
            text: `As a ${userProfile.job_title}, how do you approach problem-solving in your daily work?`,
            category: "Technical" as const,
            difficulty: "Novice" as const,
            explanation:
                'Start by clearly defining the problem: "When I encounter a problem, I first make sure I understand exactly what needs to be solved." Then explain your systematic approach: "I follow a structured method: 1) Gather all relevant information and requirements, 2) Break the problem into smaller, manageable components, 3) Research potential solutions and best practices, 4) Evaluate options based on feasibility and impact, 5) Implement the best solution step by step, 6) Test thoroughly and document the process." Emphasize continuous learning: "I always document what I learn so I can apply it to future problems."',
            example:
                "Here's how I applied this approach: Our e-commerce website was experiencing slow loading times during peak hours. I started by gathering data - checking server logs, monitoring performance metrics, and talking to users. I broke this down into smaller issues: database query performance, server response times, and frontend optimization. I researched solutions like database indexing, caching strategies, and CDN implementation. I prioritized database optimization first since it had the biggest impact. I implemented query optimization and database indexing, which improved page load times by 60%. I documented the process so the team could apply similar optimizations to other parts of the system.",
            technical_terms: [
                {
                    term: "database indexing",
                    definition:
                        "Creating data structures to speed up database queries by organizing data for faster retrieval",
                },
                {
                    term: "query optimization",
                    definition:
                        "The process of improving database query performance by analyzing and restructuring queries",
                },
                {
                    term: "caching",
                    definition:
                        "Storing frequently accessed data in a faster storage location to improve performance",
                },
                {
                    term: "CDN",
                    definition:
                        "Content Delivery Network - a system of servers that deliver content to users based on their geographic location",
                },
            ],
        },
        {
            text: `Describe a challenging project you worked on as a ${userProfile.job_title}. What made it difficult and how did you overcome it?`,
            category: "Behavioral" as const,
            difficulty: "Advanced" as const,
            explanation:
                'Use the STAR method to structure your response. Start with Situation: "I led a critical system migration project that involved moving our entire customer database to a new platform." Describe the Task: "We needed to migrate 50,000 customer records without any downtime or data loss." Explain the Action: "I created a comprehensive project plan with detailed timelines, assigned clear responsibilities to team members, and established multiple testing phases. I also prepared a rollback plan in case of issues. I coordinated daily standups to track progress and address blockers immediately." End with the Result: "We successfully completed the migration with zero downtime, zero data loss, and improved system performance by 40%. The project was completed on time and under budget."',
            example:
                "I led a system migration project where we had to move from an old legacy platform to a modern cloud-based solution. The main challenges were: coordinating a team of 8 developers across different time zones, ensuring data integrity during the transfer, and maintaining 24/7 system availability. I overcame these by creating a detailed project timeline with specific milestones, setting up automated testing procedures, and implementing a blue-green deployment strategy. I also established clear communication channels and daily progress reports. The migration was completed successfully with zero downtime, and we saw a 40% improvement in system performance. The project taught me the importance of thorough planning and clear communication in complex technical projects.",
            technical_terms: [
                {
                    term: "STAR method",
                    definition:
                        "Situation, Task, Action, Result - a structured approach to answering behavioral interview questions",
                },
                {
                    term: "system migration",
                    definition:
                        "The process of moving data or applications from one system to another",
                },
                {
                    term: "data integrity",
                    definition:
                        "The accuracy and consistency of data throughout its lifecycle",
                },
                {
                    term: "blue-green deployment",
                    definition:
                        "A deployment strategy that maintains two identical production environments to ensure zero downtime",
                },
            ],
        },
        {
            text: `If you had to explain ${
                userProfile.key_skills?.[0] || "your main skill"
            } to a non-technical stakeholder, how would you approach it?`,
            category: "Situational" as const,
            difficulty: "Novice" as const,
            explanation:
                'Start by acknowledging the importance of clear communication: "I believe that being able to explain technical concepts in simple terms is crucial for successful collaboration." Explain your approach: "I use the \'explain like I\'m 5\' method but adapted for business professionals. I avoid all technical jargon and use simple, everyday analogies that they can relate to. I focus on the business value and benefits rather than technical details." Provide specific techniques: "I use concrete examples from their industry, connect everything back to business goals, and always ask for feedback to ensure they understand."',
            example:
                'When explaining database optimization to our marketing team, I avoid technical terms like "query optimization" and "indexing." Instead, I say: "Think of our website like a busy restaurant. Right now, when a customer asks for a specific dish, the waiter has to check every table and every menu to find it. Database optimization is like organizing the restaurant with a clear menu system, numbered tables, and a host who knows exactly where everything is. Now when a customer asks for something, the waiter can find it quickly. This means our website loads faster, customers don\'t get frustrated and leave, and we make more sales. It\'s like upgrading from a disorganized kitchen to a well-organized one."',
            technical_terms: [
                {
                    term: "database optimization",
                    definition:
                        "The process of improving database performance and efficiency",
                },
                {
                    term: "query optimization",
                    definition:
                        "The process of improving database query performance by analyzing and restructuring queries",
                },
                {
                    term: "indexing",
                    definition:
                        "Creating data structures to speed up database queries by organizing data for faster retrieval",
                },
            ],
        },
    ];

    // Generate more questions based on the user's profile
    const additionalQuestions: GeneratedQuestion[] = [];

    const categories = ["Technical", "Behavioral", "Situational"] as const;
    const difficulties = ["Novice", "Advanced", "Hard"] as const;

    for (let i = 0; i < count - baseQuestions.length; i++) {
        const category = categories[i % 3];
        const difficulty = difficulties[i % 3];

        additionalQuestions.push({
            text: `Question ${i + 4} for ${userProfile.job_title} position`,
            category,
            difficulty,
            explanation: `This is a ${difficulty.toLowerCase()} ${category.toLowerCase()} question relevant to your role.`,
            example: `Sample answer demonstrating ${difficulty.toLowerCase()} level understanding.`,
            technical_terms: [],
        });
    }

    return [...baseQuestions, ...additionalQuestions];
}

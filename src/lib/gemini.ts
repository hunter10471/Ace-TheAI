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

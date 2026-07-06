/**
 * Seeds a demo account with a year of interview history so every
 * dashboard, chart, and history page renders fully populated.
 * Idempotent: re-running wipes and recreates the demo user's data.
 *
 *   node scripts/seed-demo.mjs
 *
 * Demo login: demo@acetheai.com / Demo123!
 */
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import { readFileSync } from "fs";

const env = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
const get = (key) =>
	env
		.match(new RegExp(`^${key}=(.*)$`, "m"))?.[1]
		?.trim()
		.replace(/^["']|["']$/g, "");

const supabase = createClient(
	get("NEXT_PUBLIC_SUPABASE_URL"),
	get("NEXT_PUBLIC_SUPABASE_ANON_KEY")
);

const DEMO_EMAIL = "demo@acetheai.com";

const PROFILE = {
	name: "Alex Morgan",
	job_title: "Full Stack Developer",
	years_of_experience: "3-5 years",
	key_skills: ["JavaScript", "TypeScript", "React", "Node.js", "PostgreSQL"],
	professional_goal:
		"To grow into a senior full-stack role leading complex product features end to end",
	country: "United States",
	phone_number: "+1 415 555 0132",
};

const QUESTIONS = [
	["How would you design the state management for a large React dashboard with dozens of independent widgets?", "Technical", "Advanced"],
	["Explain the difference between optimistic and pessimistic UI updates. When would you choose each?", "Technical", "Advanced"],
	["Walk me through what happens from typing a URL into the browser to the page rendering.", "Technical", "Novice"],
	["How do you prevent SQL injection and XSS in a Node.js + React application?", "Technical", "Advanced"],
	["Design a rate limiter for a public REST API. What trade-offs do the common algorithms make?", "Technical", "Hard"],
	["How would you migrate a large monolithic Express app to a modular or microservices architecture with zero downtime?", "Technical", "Hard"],
	["What are React Server Components and when do they beat client components?", "Technical", "Advanced"],
	["How do database indexes work, and how do you decide what to index?", "Technical", "Advanced"],
	["Explain event loop behavior in Node.js when mixing timers, promises, and I/O.", "Technical", "Hard"],
	["Tell me about a time you had to deliver a feature with an unclear specification. How did you proceed?", "Behavioral", "Novice"],
	["Describe a conflict you had with a teammate about a technical decision. How was it resolved?", "Behavioral", "Advanced"],
	["Tell me about the project you're most proud of and your specific contribution.", "Behavioral", "Novice"],
	["Describe a time you missed a deadline. What did you learn and change afterwards?", "Behavioral", "Advanced"],
	["Tell me about a time you received difficult feedback from a manager or code review.", "Behavioral", "Novice"],
	["You discover a critical bug in production on Friday evening. Walk me through your response.", "Situational", "Advanced"],
	["A key dependency you rely on announces end-of-life in three months. What's your plan?", "Situational", "Hard"],
	["Your team's velocity has dropped for two sprints. As a senior engineer, what do you do?", "Situational", "Advanced"],
	["A stakeholder demands a feature that you believe will harm performance. How do you handle it?", "Situational", "Advanced"],
	["You inherit a codebase with no tests and frequent regressions. Where do you start?", "Situational", "Novice"],
	["How would you onboard a junior developer to a complex codebase effectively?", "Situational", "Novice"],
	["What is the difference between TCP and UDP, and when does a web developer care?", "Technical", "Novice"],
	["Explain database transactions and isolation levels with a practical example.", "Technical", "Hard"],
	["Describe a time you had to learn a new technology quickly to unblock a project.", "Behavioral", "Advanced"],
	["How do you approach estimating work for a feature you've never built before?", "Behavioral", "Advanced"],
];

const STRENGTH_POOL = [
	"Clear, structured communication using the STAR method",
	"Strong grasp of JavaScript fundamentals and async patterns",
	"Practical examples drawn from real project experience",
	"Good instinct for trade-offs between speed and correctness",
	"Solid database and API design reasoning",
	"Stayed calm and methodical on unfamiliar questions",
	"Asked clarifying questions before answering",
	"Quantified impact with concrete metrics",
];
const WEAKNESS_POOL = [
	"Answers occasionally ran long before reaching the point",
	"Could go deeper on system design scalability concerns",
	"Missed edge cases in the error-handling discussion",
	"Limited detail on testing strategy",
	"Some hesitation on advanced database internals",
	"Could structure behavioral answers more tightly",
];
const SUGGESTION_POOL = [
	"Practice the STAR method for behavioral answers",
	"Lead with the conclusion, then justify it",
	"Prepare 3-4 reusable stories with measurable outcomes",
	"Review indexing and query-plan fundamentals",
	"Do timed mock interviews to tighten response length",
	"Study common system design patterns (caching, queues, sharding)",
];

const TYPES = ["Technical", "Behavioral", "Situational", "Mock"];
const DIFFS = ["Novice", "Advanced", "Hard"];
const DURATIONS = [15, 30, 45];

const pick = (arr, seed, n) =>
	Array.from({ length: n }, (_, i) => arr[(seed + i * 3) % arr.length]);

async function wipeExisting() {
	const { data: existing } = await supabase
		.from("users")
		.select("id")
		.eq("email", DEMO_EMAIL)
		.maybeSingle();
	if (!existing) return null;

	const { data: sessions } = await supabase
		.from("interview_sessions")
		.select("id")
		.eq("user_id", existing.id);
	const sessionIds = (sessions ?? []).map((s) => s.id);
	if (sessionIds.length) {
		await supabase.from("interview_feedback").delete().in("session_id", sessionIds);
		await supabase.from("interview_sessions").delete().eq("user_id", existing.id);
	}
	await supabase.from("user_bookmarks").delete().eq("user_id", existing.id);
	await supabase.from("questions").delete().eq("user_id", existing.id);
	console.log(`Wiped previous demo data (${sessionIds.length} sessions)`);
	return existing.id;
}

async function main() {
	const existingId = await wipeExisting();
	const userId = existingId ?? randomUUID();

	if (!existingId) {
		const password = await bcrypt.hash("Demo123!", 10);
		const { error } = await supabase.from("users").insert([
			{ id: userId, email: DEMO_EMAIL, password, provider: "credentials", ...PROFILE },
		]);
		if (error) throw new Error(`user insert: ${error.message}`);
		console.log("Created demo user");
	}

	// Question bank
	const questionRows = QUESTIONS.map(([text, category, difficulty], i) => ({
		user_id: userId,
		text,
		category,
		difficulty,
		explanation:
			"Structure your answer top-down: state your approach in one sentence, then walk through the key decisions, trade-offs, and how you would validate the result. Tie it back to a real project where possible.",
		example:
			"In a recent project I faced a similar problem; I explained the constraint, compared two options, chose one for a measurable reason, and shipped it — then verified the outcome with metrics.",
		technical_terms: [],
		generated_date: new Date(Date.now() - (i % 12) * 30 * 864e5).toISOString(),
		is_active: true,
	}));
	{
		const { error } = await supabase.from("questions").insert(questionRows);
		if (error) throw new Error(`questions insert: ${error.message}`);
		console.log(`Inserted questions: ${questionRows.length}`);
	}

	// A year of interviews: ~72 sessions, denser + better-rated recently
	const now = Date.now();
	const sessions = [];
	let count = 0;
	for (let month = 11; month >= 0; month--) {
		const perMonth = month > 8 ? 4 : month > 4 ? 6 : 8; // older -> fewer
		for (let k = 0; k < perMonth; k++) {
			const daysAgo = month * 30 + Math.floor((k * 30) / perMonth) + ((count * 7) % 4);
			const started = new Date(now - daysAgo * 864e5 - ((count * 13) % 10) * 36e5);
			const progress = (11 - month) / 11; // 0 oldest -> 1 newest
			const noise = ((count * 31) % 10) / 10 - 0.45;
			const rating = Math.min(5, Math.max(1, Math.round(2.6 + progress * 1.9 + noise)));
			const duration = DURATIONS[count % DURATIONS.length];
			const nQ = Math.max(3, Math.min(8, Math.ceil(duration / 6)));
			const qs = pick(QUESTIONS, count, nQ).map((q) => q[0]);
			sessions.push({
				user_id: userId,
				interview_type: TYPES[count % TYPES.length],
				difficulty: DIFFS[count % DIFFS.length],
				duration,
				job_title: "Full Stack Developer",
				status: "completed",
				started_at: started.toISOString(),
				completed_at: new Date(started.getTime() + duration * 6e4).toISOString(),
				created_at: started.toISOString(),
				current_question_index: nQ,
				questions_asked: qs,
				user_responses: qs.map(
					() =>
						"I approached this by clarifying the requirements first, outlining my plan, then walking through the implementation details and trade-offs, closing with how I validated the result."
				),
				question_ratings: qs.map((_, i) =>
					Math.min(5, Math.max(1, rating + ((i + count) % 3) - 1))
				),
				response_times: qs.map((_, i) => 45 + ((count * 17 + i * 11) % 75)),
				_rating: rating,
			});
			count++;
		}
	}

	// Two extra sessions inside the current week for the weekly-activity chart
	for (let d = 1; d <= 2; d++) {
		const started = new Date(now - d * 864e5);
		const qs = pick(QUESTIONS, d, 5).map((q) => q[0]);
		sessions.push({
			user_id: userId,
			interview_type: d === 1 ? "Technical" : "Mock",
			difficulty: "Advanced",
			duration: 30,
			job_title: "Full Stack Developer",
			status: "completed",
			started_at: started.toISOString(),
			completed_at: new Date(started.getTime() + 18e5).toISOString(),
			created_at: started.toISOString(),
			current_question_index: 5,
			questions_asked: qs,
			user_responses: qs.map(() => "Structured answer with a real project example and measured outcome."),
			question_ratings: qs.map((_, i) => 4 + (i % 2)),
			response_times: qs.map((_, i) => 50 + i * 9),
			_rating: 4,
		});
	}

	const feedbacks = [];
	for (const s of sessions) {
		const { _rating, ...row } = s;
		const { data, error } = await supabase
			.from("interview_sessions")
			.insert([row])
			.select("id")
			.single();
		if (error) throw new Error(`session insert: ${error.message}`);
		feedbacks.push({
			session_id: data.id,
			overall_rating: _rating,
			score: _rating * 4,
			max_score: 20,
			avg_response_time: Math.round(
				row.response_times.reduce((a, b) => a + b, 0) / row.response_times.length
			),
			strengths: pick(STRENGTH_POOL, feedbacks.length, 3),
			weaknesses: pick(WEAKNESS_POOL, feedbacks.length, 2),
			suggestions: pick(SUGGESTION_POOL, feedbacks.length, 3),
			detailed_feedback: `You handled this ${row.difficulty.toLowerCase()} ${row.interview_type.toLowerCase()} interview ${
				_rating >= 4 ? "very well" : _rating === 3 ? "solidly" : "with room to grow"
			}. Your strongest answers led with a clear conclusion and used concrete project examples; keep tightening response length and pre-empting edge cases to reach the next level.`,
			questions_asked: row.questions_asked,
			user_responses: row.user_responses,
			question_ratings: row.question_ratings,
			response_times: row.response_times,
			created_at: row.completed_at,
		});
	}
	{
		const { error } = await supabase.from("interview_feedback").insert(feedbacks);
		if (error) throw new Error(`feedback insert: ${error.message}`);
	}
	console.log(`Inserted sessions + feedback: ${sessions.length}`);
	console.log(`Demo login: ${DEMO_EMAIL} / Demo123!`);
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});

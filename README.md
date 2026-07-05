# Ace The AI Interview Coach

A modern, AI-powered interview preparation platform designed to help users excel in their job interviews through personalized coaching, real-time feedback, and comprehensive progress tracking.

## 🚀 Project Overview

Ace The AI Interview Coach is a Next.js-based web application that provides an interactive platform for interview preparation. The application features a comprehensive dashboard with practice sessions, feedback tracking, and performance analytics to help users improve their interview skills.

## ✨ Features

### AI (Google Gemini, structured output)

-   **Personalized question bank**: 20 questions per generation, tailored to the user's job title, experience, skills, and goals — with explanations, worked examples, and technical-term glossaries
-   **Live AI mock interviews**: the interviewer generates each next question from the user's real profile and previous answers, evaluates every response 1-5 with feedback and suggestions, and produces a full end-of-interview report
-   **Reliable JSON**: every AI call uses Gemini schema-constrained output (`gemini-2.5-flash`) validated with Zod — no fragile text parsing
-   **Rate limited**: per-user limits on AI endpoints backed by Supabase

### Product

-   **Auth**: NextAuth v5 with Google OAuth + credentials (bcrypt), central middleware guard for all dashboard pages and APIs, ownership checks on every session-scoped API
-   **Dashboard**: live stats — weekly sessions, success-rate chart, practice-day calendar, hours practiced — computed from real interview data, with empty states for new accounts
-   **Performance analytics**: rating trends, difficulty success rates, category breakdowns
-   **Feedback history**: searchable, filterable archive of past interview reports
-   **Profile & settings**: profile editing, password change, persisted language and data-sharing preferences
-   **Issue reporting**: in-app report modal writes to the database

## 🛠️ Tech Stack

### Frontend

-   **Framework**: Next.js 14 (App Router)
-   **Language**: TypeScript (strict build gates on)
-   **Styling**: Tailwind CSS with dark/light themes
-   **Forms**: Formik + Yup, Zod on the server
-   **Charts**: Recharts
-   **State Management**: Zustand

### Backend & Database

-   **Authentication**: NextAuth.js v5 (Google OAuth + credentials)
-   **Database**: Supabase (Postgres) — schema in `database_setup.sql`
-   **AI**: Google Gemini via `@google/genai`, JSON-schema structured output
-   **API**: Next.js API routes with session + ownership checks

### Development Tools

-   **Linting**: ESLint with Airbnb config
-   **Code Formatting**: Prettier
-   **Git Hooks**: Husky + Commitlint
-   **Package Manager**: npm

## 📁 Project Structure

```
ace_the_ai/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── dashboard/          # Dashboard pages
│   │   │   ├── feedback-history/
│   │   │   ├── performance/
│   │   │   ├── practice-interviews/
│   │   │   ├── profile/
│   │   │   ├── question-bank/
│   │   │   └── settings/
│   │   ├── api/               # API routes
│   │   └── actions/           # Server actions
│   ├── components/            # React components
│   │   ├── big/              # Large page components
│   │   ├── medium/           # Feature components
│   │   ├── small/            # Reusable UI components
│   │   └── ui/               # UI primitives
│   └── lib/                  # Utilities and types
├── public/assets/            # Static assets
└── tailwind.config.ts       # Tailwind configuration
```

## 🎯 Key Features

### Landing Page

-   **Hero Section**: Interactive AI conversation demo
-   **Features Showcase**: Personalized preparation, real-time feedback, progress tracking
-   **Process Steps**: 6-step guide to getting started
-   **Reviews**: User testimonials slider
-   **Call-to-Action**: Ready banner and footer

### Dashboard

-   **Welcome Header**: Personalized greeting with user info
-   **Statistics Cards**: Practice sessions, success rate, upcoming interviews
-   **Quick Actions**: Practice today, view feedback, explore questions
-   **Activity Stats**: Weekly activity tracking
-   **Featured Content**: Curated interview tips
-   **Calendar**: Interview scheduling with highlights

### Practice Interviews

-   **Interview Modes**: Technical, Behavioral, Situational
-   **Difficulty Levels**: Novice, Advanced, Hard
-   **Real-time Feedback**: AI-powered response analysis
-   **Progress Tracking**: Session history and improvement metrics

### Question Bank

-   **AI-Generated Questions**: Personalized questions using Google Gemini AI
-   **Background Generation**: Generate questions in the background - you can leave the page and return later
-   **Real-time Status Updates**: See generation progress and get notified when complete
-   **On-Demand Generation**: Generate new questions anytime
-   **Categorized Questions**: Technical, Behavioral, Situational
-   **Difficulty Filtering**: Novice to Hard levels
-   **Bookmarking**: Save important questions for later review
-   **Search Functionality**: Search through all your generated questions
-   **Sorting**: Sort by newest or oldest questions
-   **All Questions View**: See all questions you've ever generated
-   **Duplicate Prevention**: Automatic cleanup of duplicate questions

### Performance Analytics

-   **Success Rate Tracking**: Interview performance over time
-   **Category Analysis**: Performance by question type
-   **Progress Charts**: Visual improvement tracking
-   **Detailed Insights**: Strengths and areas for improvement

## 🚀 Getting Started

### Prerequisites

-   Node.js 18+
-   npm or yarn
-   Git

### Installation

1. **Clone the repository**

    ```bash
    git clone <repository-url>
    cd ace_the_ai
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Set up environment variables**

    ```bash
    cp .env.example .env.local
    ```

    Add your configuration:

    ```env
    AUTH_SECRET=your-auth-secret
    NEXTAUTH_SECRET=your-nextauth-secret
    NEXTAUTH_URL=http://localhost:3000
    NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
    GOOGLE_CLIENT_ID=your-google-client-id
    GOOGLE_CLIENT_SECRET=your-google-client-secret
    GOOGLE_GEMINI_API_KEY=your-gemini-api-key
    ```

4. **Set up the database**

    Run `database_setup.sql` in the Supabase SQL editor. The file is
    idempotent — re-run it after pulling updates to apply new migrations
    (it includes the tables, indexes, and the `check_rate_limit` function).

5. **Run the development server**

    ```bash
    npm run dev
    ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

-   `npm run dev` - Start development server
-   `npm run build` - Build for production
-   `npm run start` - Start production server
-   `npm run lint` - Run ESLint
-   `npm run prepare` - Set up Git hooks

## 🎨 Design System

### Color Palette

-   **Primary**: `#FF6F61` (Coral)
-   **Primary Dark**: `#FE5B4B`
-   **Secondary**: `#F8F7F4` (Off-white)
-   **Text**: `#2D2D2D` (Dark gray)
-   **Background**: `#F5F5F5` (Light gray)

### Typography

-   **Font**: Roboto (Google Fonts)
-   **Weights**: 100, 300, 400, 500, 700

### Component Architecture

-   **Big Components**: Page-level components (Hero, Container, Sidebar)
-   **Medium Components**: Feature components (ActionCard, Feature, Modal)
-   **Small Components**: Reusable UI elements (Button, Input, Heading)
-   **UI Primitives**: Base components (Table, Chart)

## 🔧 Configuration

### Tailwind CSS

The project uses a custom Tailwind configuration with:

-   Custom color palette
-   Dark mode support
-   Custom animations
-   Responsive breakpoints

### ESLint

Configured with:

-   Airbnb style guide
-   TypeScript support
-   React best practices
-   Accessibility rules
-   Security rules

## 📱 Responsive Design

The application is fully responsive with breakpoints:

-   **Mobile**: < 768px
-   **Tablet**: 768px - 1024px
-   **Desktop**: > 1024px

## 🌙 Dark Mode

The application supports both light and dark themes with:

-   Automatic theme detection
-   Manual theme toggle
-   Persistent theme preference
-   Consistent color schemes

## 🔐 Authentication & Security

-   Google OAuth + email/password (bcrypt) via NextAuth v5
-   Central `middleware.ts` guard: unauthenticated users are redirected from
    `/dashboard/*` and get 401s from `/api/*`
-   Every API derives the user from the session and scopes reads/writes to
    rows the user owns
-   Supabase-backed fixed-window rate limiting on AI endpoints

## 📊 Data Management

-   All dashboard, performance, question-bank, and feedback data is loaded
    live from Supabase (`src/lib/*-operations.ts`)
-   User settings (language, data sharing) persist to the `users` table via
    server actions
-   AI responses are schema-constrained and Zod-validated before they touch
    the database

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Development Guidelines

### Code Style

-   Follow TypeScript best practices
-   Use functional components with hooks
-   Implement proper error handling
-   Write meaningful component names
-   Add proper TypeScript types

### Component Structure

-   One component per file
-   Export default for main component
-   Use proper prop interfaces
-   Implement responsive design
-   Follow accessibility guidelines

### File Naming

-   PascalCase for components
-   camelCase for utilities
-   kebab-case for CSS classes
-   Descriptive names for clarity

## 🐛 Known Issues

-   API integrations not yet implemented
-   Authentication using mock data
-   Charts showing placeholder data
-   Some interactive features disabled

## 🚧 Roadmap

### Phase 1: Backend Integration

-   [ ] Supabase database setup
-   [ ] User authentication
-   [ ] Real data persistence
-   [ ] API route implementation

### Phase 2: AI Features

-   [ ] AI-powered interview feedback
-   [ ] Natural language processing
-   [ ] Personalized recommendations
-   [ ] Real-time analysis

### Phase 3: Advanced Features

-   [ ] Video interview practice
-   [ ] Peer practice sessions
-   [ ] Interview scheduling
-   [ ] Advanced analytics

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

-   **Frontend Development**: React/Next.js
-   **UI/UX Design**: Custom design system
-   **Backend**: Supabase integration (in progress)
-   **AI Integration**: Planned feature

## 📞 Support

For support and questions:

-   Create an issue in the repository
-   Contact the development team
-   Check the documentation

---

**Note**: This is a development version with UI-only implementation. API integrations and backend functionality are currently in progress.

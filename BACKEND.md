# ⚙️ SkillsCraft Backend Implementation & Setup Guide

Welcome to the **SkillsCraft Backend Documentation**. SkillsCraft utilizes Next.js Server Actions, API Routes, PostgreSQL with Prisma ORM, Google Gemini AI (1.5 Flash), and Inngest for background cron jobs.

---

## 🛠️ Architecture & Backend Stack

| Component | Technology | Role |
| :--- | :--- | :--- |
| **Server Logic** | Next.js Server Actions (`actions/`) | Secure server-side function execution without explicit REST endpoints |
| **API Layer** | Next.js API Routes (`app/api/`) | Webhooks, Inngest triggers, and external endpoints |
| **Database** | PostgreSQL (Neon Tech) | Relational database storage |
| **ORM** | Prisma 7.2.0 | Type-safe database client & migration tool |
| **Authentication** | NextAuth v5 / Auth.js / Auth Adapters | Authentication, session management, and OAuth integrations |
| **AI Integration** | Google Gemini API (`@google/generative-ai` / OpenAI client) | Resume optimization, interview question generation & cover letters |
| **Background Jobs** | Inngest | Cron jobs, background workers, and automated industry insight updates |
| **Validation** | Zod | Server-side schema validation for forms & API payloads |

---

## 🗄️ Database Schema (`prisma/schema.prisma`)

```mermaid
erDiagram
    USER ||--o{ RESUME : owns
    USER ||--o{ COVER_LETTER : owns
    USER ||--o{ ASSESSMENT : completes
    USER }o--o| INDUSTRY_INSIGHT : belongs_to
    
    USER {
        string id PK
        string email
        string name
        string bio
        int experience
        string[] skills
        string industry
    }

    RESUME {
        string id PK
        string userId FK
        string content
        json resumeData
        float atsScore
        string feedback
    }

    COVER_LETTER {
        string id PK
        string userId FK
        string content
        string jobDescription
        string companyName
        string jobTitle
    }

    ASSESSMENT {
        string id PK
        string userId FK
        float quizScore
        json[] questions
        string interviewType
        int timeSpent
        string difficulty
    }

    INDUSTRY_INSIGHT {
        string id PK
        string industry
        json[] salaryRanges
        float growthRate
        string demandLevel
        string[] topSkills
    }
```

### Key Models Overview
- **`User`**: Stores user authentication data, professional profile (skills, bio, experience), and industry reference.
- **`Resume`**: Stores raw & AI-enhanced Markdown resume content alongside structured form data and ATS feedback scores.
- **`CoverLetter`**: Stores generated cover letter content and target job description context.
- **`Assessment`**: Stores technical/non-technical quiz attempts, score analytics, feedback tips, and categories.
- **`IndustryInsight`**: Stores market trends, salary brackets, top skills, growth rate, and demand level for various tech sectors.

---

## 🔌 Server Actions (`actions/`)

The backend logic is primarily built using Next.js Server Actions:

- **`actions/resume.js`**:
  - `saveResume(content)`: Persists user resume data into PostgreSQL.
  - `improveWithAI({ currentResume, type })`: Calls Gemini 1.5 Flash to optimize bullet points for ATS scanners.
- **`actions/assessment.js`**:
  - `generateQuiz()`: Prompts Gemini AI to generate customized technical interview questions based on user skills & industry.
  - `saveAssessmentResult({ questions, answers, score })`: Computes quiz performance, provides improvement tips, and saves results.
- **`actions/generate-cover-letter.js`**:
  - Prompts Gemini AI with profile info, job description, and company name to craft a tailored cover letter.
- **`actions/industry.ts` / `actions/dashboard.js`**:
  - Fetches or generates live industry trends, demand indicators, and salary estimates.
- **`actions/user.js`**:
  - `updateUserOnboarding(data)`: Validates user profile data with Zod and updates the database.

---

## 🤖 AI Engine (Google Gemini 1.5 Flash Integration)

Gemini 1.5 Flash is invoked in Server Actions using structured prompt engineering to guarantee structured JSON or Markdown outputs:

```javascript
// Example Gemini Prompt Structure for Mock Interview Question Generation
const prompt = `
Generate a 10-question technical quiz for a ${user.industry} professional with skills: ${user.skills.join(", ")}.
Format the response strictly as a JSON array of objects:
[
  {
    "question": "...",
    "options": ["A", "B", "C", "D"],
    "correctAnswer": "...",
    "explanation": "..."
  }
]
`;
```

---

## 🔄 Background Jobs (Inngest Integration)

Inngest handles automated background tasks without blocking HTTP requests:

- **Cron Job Endpoint**: `app/api/inngest/route.js`
- **Weekly Industry Insight Updater**: Runs on a schedule to re-query Gemini API for updated market outlooks, emerging skills, and salary benchmarks, then updates `IndustryInsight` records in PostgreSQL.

---

## ⚡ Setup & Backend Running Instructions

### 1. Database Setup (PostgreSQL)
Ensure you have a PostgreSQL database connection string (e.g., from [Neon.tech](https://neon.tech), Supabase, or Local PostgreSQL).

Configure `.env`:
```env
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
GEMINI_API_KEY="AIzaSy..."
AUTH_SECRET="your_random_auth_secret_key"
INNGEST_EVENT_KEY="your_inngest_event_key"
INNGEST_SIGNING_KEY="your_inngest_signing_key"
```

### 2. Run Database Migrations
Sync the Prisma schema with your database:
```bash
npx prisma db push
# or
npx prisma migrate dev --name init
```

Generate Prisma Client:
```bash
npx prisma generate
```

### 3. Seed Initial Industry Insights
Seed the database with baseline industry data:
```bash
npm run seed-insights
```

### 4. Run Inngest Dev Server (Optional for background jobs)
Start the Inngest local execution engine to test cron jobs:
```bash
npx inngest-cli@latest dev
```
Inngest dashboard will be available at **[http://localhost:8288](http://localhost:8288)**.

### 5. Launch Application Backend & API
Start the Next.js development environment:
```bash
npm run dev
```
The server will start at `http://localhost:3000` with Server Actions and API endpoints active.

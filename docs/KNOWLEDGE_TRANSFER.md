# 📘 SkillsCraft – Enterprise Knowledge Transfer (KT) & Technical Specification

Welcome to **SkillsCraft** (AI-Based Career Guidance Platform). This document serves as the authoritative, enterprise-grade Knowledge Transfer (KT) specification designed for software engineers, technical leads, and system architects joining the project.

This guide explains not only **WHAT** the platform does, but **WHY** architectural decisions were made, **HOW** every internal module operates, **HOW** data flows across serverless lambdas and microservice containers, and **HOW** to maintain, debug, extend, and deploy the platform in production environments.

---

## 📑 Table of Contents
1. [🌐 1. Project Overview](#1-project-overview)
2. [💼 2. Business Flow & User Journey](#2-business-flow--user-journey)
3. [🏗️ 3. High-Level Architecture](#3-high-level-architecture)
4. [🛠️ 4. Technology Stack Specification](#4-technology-stack-specification)
5. [🗂️ 5. Folder & Directory Structure](#5-folder--directory-structure)
6. [🧩 6. Module-Wise Technical Deep-Dive](#6-module-wise-technical-deep-dive)
7. [🎨 7. Frontend Architecture & Component Topology](#7-frontend-architecture--component-topology)
8. [⚙️ 8. Backend Architecture & RPC Server Actions](#8-backend-architecture--rpc-server-actions)
9. [🔀 9. Hybrid Architecture (Serverless + Microservices)](#9-hybrid-architecture-serverless--microservices)
10. [🗄️ 10. Database Documentation & Prisma Schema](#10-database-documentation--prisma-schema)
11. [🔐 11. Authentication & Authorization Flow](#11-authentication--authorization-flow)
12. [📝 12. Resume Builder Workflow](#12-resume-builder-workflow)
13. [🔬 13. Resume Analysis & ATS Engine](#13-resume-analysis--ats-engine)
14. [🎤 14. Mock Interview Engine](#14-mock-interview-engine)
15. [🔊 15. Speech Recognition & Audio Pipeline](#15-speech-recognition--audio-pipeline)
16. [🔍 16. Opportunity Finder & Scraping Engine](#16-opportunity-finder--scraping-engine)
17. [🤖 17. AI Integrations & Prompt Engineering](#17-ai-integrations--prompt-engineering)
18. [🔌 18. Complete API & Server Action Specifications](#18-complete-api--server-action-specifications)
19. [🛡️ 19. Middleware & Interceptor Pipeline](#19-middleware--interceptor-pipeline)
20. [🔄 20. Asynchronous Background Jobs & Cron Scheduling](#20-asynchronous-background-jobs--cron-scheduling)
21. [📥 21. Multi-Format File Upload & Extraction Pipeline](#21-multi-format-file-upload--extraction-pipeline)
22. [📊 22. Interactive Dashboard Engine](#22-interactive-dashboard-engine)
23. [⚡ 23. Request Execution & End-to-End Lifecycle](#23-request-execution--end-to-end-lifecycle)
24. [🚨 24. System Error Handling & Resilience Strategy](#24-system-error-handling--resilience-strategy)
25. [🛡️ 25. Security & Data Protection Standard](#25-security--data-protection-standard)
26. [🚀 26. Deployment & Environment Setup Guide](#26-deployment--environment-setup-guide)
27. [⚡ 27. Performance Optimization & Caching Strategy](#27-performance-optimization--caching-strategy)
28. [📏 28. Engineering Coding Standards & Git Workflow](#28-engineering-coding-standards--git-workflow)
29. [🔧 29. System Maintenance & Extension Guide](#29-system-maintenance--extension-guide)
30. [🛠️ 30. Comprehensive Troubleshooting Guide](#30-comprehensive-troubleshooting-guide)
31. [🔮 31. Future Engineering Scope & Roadmap](#31-future-engineering-scope--roadmap)
32. [📖 32. Technical Glossary](#32-technical-glossary)
33. [📎 33. Appendix & Infrastructure Commands](#33-appendix--infrastructure-commands)

---

## 🌐 1. Project Overview

### Project Name
**SkillsCraft – AI-Based Career Guidance Platform**

### Vision
To empower candidates, job seekers, and engineers by providing an end-to-end AI guidance system that elevates resume impact, delivers real-time voice and technical interview practice, benchmarks market industry compensation, and tracks real-world software opportunities.

### Objectives
1. **Reduce Career Prep Friction**: Provide automated AI resume tailoring, ATS scoring, and bullet-point rewrite engines.
2. **Realistic Mock Practice**: Offer dual speech-to-text engines (Deepgram WebSocket + Faster-Whisper FastAPI) to evaluate spoken answers, delivery clarity, and technical correctness.
3. **Data-Driven Market Intelligence**: Provide up-to-date industry insights including salary percentiles (Min, Median, Max in LPA), demand metrics, and skill gap visualizations.
4. **Aggregated Opportunity Access**: Automate ingestion and tracking of jobs, internships, hackathons, and open-source programs from remote platforms and technical portals.

### Problem Statement
Modern technical job seekers face three major bottlenecks:
- **ATS Blackbox Filtering**: Applicant Tracking Systems filter out up to 75% of candidate resumes due to unoptimized markdown formats, missing technical keywords, and unquantified achievement metrics.
- **High Interview Anxiety & Lack of Practice**: Traditional mock interviews are expensive, non-scalable, and lack automated technical and behavioral feedback loops.
- **Scattered Job Information**: Candidates spend excessive hours cross-referencing multiple job portals, hackathon sites, and open-source repositories without unified tracking metrics.

### Proposed Solution
SkillsCraft provides a unified, full-stack career acceleration platform combining **Next.js 16 (App Router)**, **React 19**, **Prisma ORM with PostgreSQL**, **Google Gemini 1.5 Flash AI**, an **Asynchronous Inngest Background Queue**, a **Python FastAPI Faster-Whisper Microservice**, and a **Node.js WebSocket Proxy Gateway**.

### Target Users
- **Software Developers & Engineers**: Seeking structured ATS resume enhancement, technical interview preparation, and job tracking.
- **Students & Early Career Professionals**: Looking for career onboarding, skill gap analysis, internship discovery, and hackathon participation.
- **Career Switchers**: Needing industry insight benchmarks, skill recommendations, and custom cover letter generation.

---

## 💼 2. Business Flow & User Journey

### Complete End-to-End User Journey Diagram

```mermaid
flowchart TD
    Start([User Visits SkillsCraft]) --> Auth{Authenticated?}
    Auth -- No --> Landing[Landing Page / Hero]
    Landing --> Register[Sign Up / Login Credentials or Google OAuth]
    Register --> AuthCheck[Create DB User & NextAuth Session Token]
    Auth -- Yes --> OnboardCheck{Onboarding Complete?}
    AuthCheck --> OnboardCheck

    OnboardCheck -- No --> Onboarding[Onboarding Wizard: Industry, Bio, Skills & Experience]
    Onboarding --> SaveProfile[Server Action: updateUserOnboarding]
    SaveProfile --> Dashboard

    OnboardCheck -- Yes --> Dashboard[User Dashboard / Home Hub]

    Dashboard --> Core1[Resume Builder & Intelligence]
    Dashboard --> Core2[Mock Interview & Speech Studio]
    Dashboard --> Core3[Assessment Quiz Engine]
    Dashboard --> Core4[AI Cover Letter Generator]
    Dashboard --> Core5[Opportunity Finder Grid]
    Dashboard --> Core6[Industry Market Insights]

    Core1 --> ParsePDF[Upload PDF/DOCX or Enter Text]
    ParsePDF --> GeminiATS[Gemini ATS Score & Rewrite Engine]
    GeminiATS --> SaveResume[Save Resume to DB & Export PDF]

    Core2 --> MicPerm[Request Camera & Microphone Permissions]
    MicPerm --> AudioStream[Stream Audio via Node WS Proxy / FastAPI Whisper]
    AudioStream --> GeminiEval[Gemini AI Answer & Speech Evaluation]
    GeminiEval --> SaveAssessment[Save Assessment History & Feedback]

    Core3 --> GenQuiz[Server Action: generateQuiz via Gemini]
    GenQuiz --> TakeQuiz[Timer Countdown & Radio Answer Selection]
    TakeQuiz --> GradeQuiz[Server Action: evaluateAssessment & Save Score]

    Core4 --> JobDetails[Enter Job Title, Company & Job Description]
    JobDetails --> GenCover[Server Action: createCoverLetter via Gemini]
    GenCover --> SaveCover[Save Draft & Export Markdown/PDF]

    Core5 --> SearchFilter[Filter Jobs, Internships, Hackathons & Open Source]
    SearchFilter --> Bookmark[Server Action: toggleSaveOpportunity]
    Bookmark --> SyncLive[Inngest Scraping & Sync Engine]

    Core6 --> SalaryChart[View Salary Brackets in LPA & Skill Demand Badges]
    SalaryChart --> InngestCron[Weekly Inngest Cron Auto-Refreshes Insights]
```

---

## 🏗️ 3. High-Level Architecture

SkillsCraft employs a **Hybrid Microservices & Serverless System Topology**. Stateless web rendering, database transactions, and AI orchestrations are hosted on serverless lambdas, while heavy GPU/CPU audio processing and long-lived WebSocket streaming are segregated into dedicated microservices.

### System Topology Diagram

```mermaid
graph TB
    subgraph ClientBrowser ["Client Layer - Web Browser"]
        ReactUI["React 19 / Next.js 16 UI"]
        HookState["React State & Custom Hooks"]
        MediaRecorder["Browser Web MediaRecorder API"]
    end

    subgraph SecurityMiddleware ["Security & Interceptor Layer"]
        AuthMW["NextAuth Middleware (middleware.js)"]
        CORSMW["FastAPI CORS Interceptor"]
        DocParserMW["Binary Document Parser Middleware"]
    end

    subgraph ServerlessAppServer ["Serverless Layer - Next.js App Server"]
        ServerActions["Server Actions RPC (actions/)"]
        APIRoutes["REST Route Handlers (app/api/)"]
        PrismaClient["Prisma ORM 7.2.0 Engine"]
        InngestClient["Inngest Event & Cron Queue"]
    end

    subgraph MicroserviceLayer ["Dedicated Microservice Layer"]
        FastAPIServer["Python FastAPI Server (:8000)"]
        WhisperModel["Faster-Whisper STT Model"]
        WSProxyServer["Node.js WS Proxy Gateway (:8080)"]
    end

    subgraph CloudInfrastructure ["Cloud Services & Database"]
        PostgresDB[("PostgreSQL Database (Neon / Local)")]
        GeminiAI["Google Gemini 1.5 Flash API"]
        DeepgramSaaS["Deepgram Nova-2 Streaming API"]
    end

    ReactUI --> AuthMW
    AuthMW --> ServerActions
    AuthMW --> APIRoutes
    MediaRecorder --> WSProxyServer
    MediaRecorder --> FastAPIServer
    
    ServerActions --> GeminiAI
    ServerActions --> PrismaClient
    InngestClient --> ServerActions
    PrismaClient --> PostgresDB
    
    FastAPIServer --> WhisperModel
    WSProxyServer --> DeepgramSaaS
    APIRoutes --> FastAPIServer
```

---

## 🛠️ 4. Technology Stack Specification

| Technology | Version | Purpose | Why It Was Selected | Engineering Alternatives |
| :--- | :--- | :--- | :--- | :--- |
| **Next.js** | `16.1.3` | Full-stack Web Framework (App Router) | Native Server Components, Server Actions (RPC), integrated routing, zero-bundle API serverless execution. | Remix, Vite + Express, Nuxt.js |
| **React** | `19.2.3` | UI Rendering Library | Concurrent rendering features, optimized hooks state, wide ecosystem support. | Vue 3, Svelte 5, Angular |
| **Tailwind CSS** | `4.0.0` | Utility-First Styling Framework | High-performance CSS engine, dark mode theme tokens, responsive utility classes. | Styled Components, CSS Modules, Bootstrap |
| **Prisma** | `7.2.0` | Relational ORM | Type-safe database queries, schema migration management, auto-generated TypeScript/JS types. | Drizzle ORM, TypeORM, Sequelize |
| **PostgreSQL** | `v16+` | Primary Relational Database | ACID compliance, JSONB document support, array data types (`String[]`), seamless serverless hosting on Neon.tech. | MySQL, MongoDB, SQLite |
| **Google Gemini AI**| `1.5 Flash` | Core AI & Prompt Engineering Engine | Low latency, 1M+ token context window, structured JSON output mode, superior reasoning cost-efficiency. | OpenAI GPT-4o, Anthropic Claude 3.5 |
| **Deepgram SDK** | `5.7.0` | Real-time Streaming Speech-to-Text | Low latency (<300ms) Nova-2 speech model, WebSocket streaming support. | AssemblyAI, Google Speech-to-Text |
| **FastAPI** | `0.110+` | Python Microservice Framework | Asynchronous I/O execution, native Python ML bindings, OpenAPI documentation. | Flask, Django REST Framework |
| **Faster-Whisper** | `1.0+` | Local Speech Recognition Engine | 4x faster execution than OpenAI Whisper, CTranslate2 backend optimization, CPU/GPU support. | Standard OpenAI Whisper, Torch-Whisper |
| **Inngest** | `3.54.0` | Serverless Queue & Cron System | Event-driven background jobs, automatic retries, step execution, no persistent Redis cluster requirement. | BullMQ, Celery, AWS SQS |
| **NextAuth / Auth.js**| `5.0.0-beta` | Authentication Engine | JWT session strategy, OAuth 2.0 integration (Google), Prisma database adapter support. | Supabase Auth, Clerk, Firebase Auth |
| **WebSocket (`ws`)** | `8.21.1` | Real-time Audio Stream Gateway | Low overhead, full-duplex binary frame streaming for microphone audio data. | Socket.io, Server-Sent Events (SSE) |
| **`pdf-parse` / `mammoth`**| `2.4 / 1.12` | PDF & Word Document Ingestion | Fast server-side raw text extraction from binary file buffers without browser rendering. | PDF.js, Tesseract OCR |

---

## 🗂️ 5. Folder & Directory Structure

```
Skills-craft/
├── actions/                         # Next.js Server Actions (RPC Backend API layer)
│   ├── assessment.js                # Quiz generation, grading, and history persistence
│   ├── auth.js                      # Authentication helper server actions
│   ├── cover-letter.js              # AI Cover letter generation & CRUD operations
│   ├── dashboard.js                 # User metrics & industry dashboard aggregators
│   ├── generate-cover-letter.js      # Dedicated Gemini cover letter prompt action
│   ├── industry-page.js             # Detailed industry sector analytics actions
│   ├── industry.ts                  # Industry TypeScript type mappings & data actions
│   ├── opportunities-sync.js        # Background scraper sync action triggers
│   ├── opportunities.js             # Opportunity search, filtering & bookmarking
│   ├── parse-document.js            # PDF & DOCX binary parsing action
│   ├── public.js                    # Unauthenticated landing page stats actions
│   ├── resume-intelligence.js       # ATS scoring, gap analysis & AI rewrites
│   ├── resume.js                    # Resume CRUD & form builder state actions
│   └── user.js                      # User onboarding & profile management actions
├── app/                             # Next.js App Router (Pages, Layouts & API Routes)
│   ├── (auth)/                      # Authentication route group (Sign-in, Sign-up)
│   ├── (main)/                      # Authenticated application layout & pages
│   │   ├── account/                 # User settings & profile management page
│   │   ├── cover-letter/            # Cover letter generator & preview interfaces
│   │   ├── dashboard/               # Main application analytics dashboard
│   │   ├── industry/                # Market insight analytics page
│   │   ├── interview/               # Interview sessions, quiz & speech studio
│   │   ├── opportunities/           # Job & hackathon finder card grid
│   │   └── resume/                  # Resume builder & ATS intelligence scanner
│   ├── api/                         # REST API Route Handlers
│   │   ├── auth/[...nextauth]/      # NextAuth OAuth & credential endpoints
│   │   ├── deepgram/                # Deepgram API key & handshake routes
│   │   ├── industries/              # Industry select option data routes
│   │   ├── inngest/                 # Inngest background job webhook endpoint
│   │   ├── seed/                    # Database initial seed routes
│   │   ├── seed-insights/           # Industry insight manual trigger route
│   │   ├── transcribe/              # Audio proxy route forwarding to FastAPI
│   │   └── user/                    # User profile REST endpoints
│   ├── onboarding/                  # Multi-step user onboarding wizard
│   ├── globals.css                  # Tailwind CSS v4 design tokens & CSS variables
│   └── layout.js                    # Root HTML layout & global provider imports
├── backend/                         # Dedicated Python FastAPI Microservice
│   ├── main.py                      # FastAPI server app & Faster-Whisper model handler
│   ├── requirements.txt             # Python package dependencies
│   ├── uploads/                     # Storage directory for temporary audio files
│   └── venv/                        # Python virtual environment
├── components/                      # React UI Components
│   ├── dashboard/                   # Dashboard charts & insight summary cards
│   ├── industry/                    # Recharts salary bar charts & skill badges
│   ├── interview/                   # Voice interview canvas & quiz components
│   ├── resume/                      # Resume form entries, preview & ATS diff UI
│   ├── ui/                          # Shadcn UI primitives (Button, Card, Input, etc.)
│   ├── header.jsx                   # Sticky application header & navigation
│   ├── footer.jsx                   # Global application footer
│   ├── hero.jsx                     # Interactive landing page hero section
│   └── user-button.jsx              # NextAuth profile avatar & menu trigger
├── data/                            # Static lookup data & industry JSON configurations
├── hooks/                           # Custom React Hooks
│   ├── use-fetch.js                 # Wrapper hook for tracking Server Action state
│   └── useSpeechRecognition.js      # Audio recording & STT integration hook
├── lib/                             # Utility modules, DB clients & AI prompts
│   ├── ai/                          # Google Gemini prompt functions & evaluate rules
│   │   ├── evaluateAnswers.js       # Interview answer AI grading engine
│   │   ├── generateIndustryInsights.js# AI industry trend generator
│   │   ├── generateInterviewQuestions.js# Dynamic quiz question generator
│   │   └── improveResume.js         # Resume bullet AI rewrite engine
│   ├── inngest/                     # Inngest client & background cron definitions
│   │   ├── client.js                # Inngest client instance
│   │   └── functions.js             # Cron functions (weekly insight refresh)
│   ├── stt/                         # Speech-to-text provider abstractions
│   ├── checkUser.js                 # Database user session verification utility
│   └── prisma.js                    # Prisma Client singleton initialization
├── middleware.js                    # NextAuth route protection middleware
├── prisma/                          # Prisma ORM Configurations
│   └── schema.prisma                # Relational database models & enum definitions
├── server/                          # Dedicated Node.js WebSocket Microservice
│   └── deepgram-ws.js               # Full-duplex WebSocket audio proxy for Deepgram
├── auth.config.js                   # NextAuth OAuth provider configurations
├── auth.js                          # NextAuth instance setup & credential authorize
├── next.config.mjs                  # Next.js environment & compiler configurations
├── package.json                     # Node.js project manifest & script commands
└── start-server.bat                 # Multi-process launch script for Windows
```

---

## 🧩 6. Module-Wise Technical Deep-Dive

Below is the exhaustive architectural specification for all 14 core system modules:

```carousel
### 📄 1. Resume Builder
- **Path**: [`app/(main)/resume/page.jsx`](file:///c:/Users/lenovo/Documents/GitHub/Skills-craft/app/\(main\)/resume/page.jsx) & [`components/dashboard/resume-builder.jsx`](file:///c:/Users/lenovo/Documents/GitHub/Skills-craft/components/dashboard/resume-builder.jsx)
- **Purpose**: Interactive dual-pane builder enabling multi-tab form data entry and real-time Markdown preview.
- **Inputs**: Form state (`contactInfo`, `summary`, `experience`, `education`, `projects`, `skills`).
- **Outputs**: Sanitized Markdown string & JSON structured state persisted in PostgreSQL.
- **Database Tables**: `Resume`, `User`.
- **Server Actions**: `saveResume(content)` ([`actions/resume.js`](file:///c:/Users/lenovo/Documents/GitHub/Skills-craft/actions/resume.js)).
- **External Dependencies**: `@uiw/react-md-editor`, `html2pdf.js`.
<!-- slide -->
### 🔬 2. Resume Intelligence & ATS Engine
- **Path**: [`components/resume/resume-intelligence.jsx`](file:///c:/Users/lenovo/Documents/GitHub/Skills-craft/components/resume/resume-intelligence.jsx)
- **Purpose**: Analyzes resume content against target job descriptions to compute ATS match scores, extract missing technical keywords, and generate AI bullet rewrites.
- **Inputs**: Resume text / PDF / DOCX file, target job description.
- **Outputs**: ATS Score (0-100), Keyword Match Matrix, Action Item List, Rewritten Bullet Diffs.
- **Database Tables**: `Resume`.
- **Server Actions**: `analyzeResumeIntelligence`, `improveWholeResumeAction` ([`actions/resume-intelligence.js`](file:///c:/Users/lenovo/Documents/GitHub/Skills-craft/actions/resume-intelligence.js)).
- **External Dependencies**: Google Gemini 1.5 Flash AI, `pdf-parse`, `mammoth`.
<!-- slide -->
### 🎤 3. Speech Mock Interview Studio
- **Path**: [`components/interview/interview-preview.jsx`](file:///c:/Users/lenovo/Documents/GitHub/Skills-craft/components/interview/interview-preview.jsx)
- **Purpose**: Voice interview simulation studio evaluating candidate speech responses, vocal confidence, and technical content.
- **Inputs**: Real-time PCM audio stream from microphone.
- **Outputs**: Live text transcript stream, evaluated speech score, AI feedback summary.
- **Database Tables**: `Assessment`.
- **Server Actions**: `saveAssessmentResult` ([`actions/assessment.js`](file:///c:/Users/lenovo/Documents/GitHub/Skills-craft/actions/assessment.js)).
- **Microservices**: Node WebSocket Proxy (`:8080`), Python FastAPI (`:8000`).
<!-- slide -->
### ⏱️ 4. Technical Assessment Quiz Engine
- **Path**: [`app/(main)/interview/session/[assessmentId]/page.jsx`](file:///c:/Users/lenovo/Documents/GitHub/Skills-craft/app/\(main\)/interview/session/\[assessmentId\]/page.jsx)
- **Purpose**: Multi-choice technical quiz session generator with countdown timer and score evaluation.
- **Inputs**: Selected radio answer indexes, elapsed timer seconds.
- **Outputs**: Calculated percentage score, category breakdown, improvement tips.
- **Database Tables**: `Assessment`, `User`.
- **Server Actions**: `generateQuiz`, `evaluateAssessment` ([`actions/assessment.js`](file:///c:/Users/lenovo/Documents/GitHub/Skills-craft/actions/assessment.js)).
- **External Dependencies**: Google Gemini 1.5 Flash AI.
<!-- slide -->
### ✉️ 5. Cover Letter Generator
- **Path**: [`app/(main)/cover-letter/new/page.jsx`](file:///c:/Users/lenovo/Documents/GitHub/Skills-craft/app/\(main\)/cover-letter/new/page.jsx)
- **Purpose**: Authors custom cover letters tailored to specific company postings.
- **Inputs**: `jobTitle`, `companyName`, `jobDescription`.
- **Outputs**: Markdown cover letter document.
- **Database Tables**: `CoverLetter`, `User`.
- **Server Actions**: `createCoverLetter` ([`actions/cover-letter.js`](file:///c:/Users/lenovo/Documents/GitHub/Skills-craft/actions/cover-letter.js)).
<!-- slide -->
### 📈 6. Industry Insights Analytics
- **Path**: [`app/(main)/industry/page.jsx`](file:///c:/Users/lenovo/Documents/GitHub/Skills-craft/app/\(main\)/industry/page.jsx) & [`components/industry/SalaryChart.jsx`](file:///c:/Users/lenovo/Documents/GitHub/Skills-craft/components/industry/SalaryChart.jsx)
- **Purpose**: Displays market statistics, salary distributions (Min/Median/Max in LPA), demand metrics, and in-demand skills.
- **Inputs**: User selected industry category.
- **Outputs**: Interactive Recharts bar graph & skill badges.
- **Database Tables**: `IndustryInsight`, `User`.
- **Server Actions**: `getIndustryInsight` ([`actions/industry.ts`](file:///c:/Users/lenovo/Documents/GitHub/Skills-craft/actions/industry.ts)).
- **Background Worker**: Inngest weekly cron function.
<!-- slide -->
### 🔍 7. Opportunity Finder Grid
- **Path**: [`app/(main)/opportunities/page.jsx`](file:///c:/Users/lenovo/Documents/GitHub/Skills-craft/app/\(main\)/opportunities/page.jsx)
- **Purpose**: Searchable, filterable card grid listing jobs, internships, hackathons, and open-source programs.
- **Inputs**: Search string, filters (Type, Remote, Paid).
- **Outputs**: Actionable card grid with bookmark status.
- **Database Tables**: `Opportunity`, `UserOpportunity`.
- **Server Actions**: `getOpportunities`, `toggleSaveOpportunity` ([`actions/opportunities.js`](file:///c:/Users/lenovo/Documents/GitHub/Skills-craft/actions/opportunities.js)).
<!-- slide -->
### 🚀 8. Onboarding Wizard
- **Path**: [`app/onboarding/page.jsx`](file:///c:/Users/lenovo/Documents/GitHub/Skills-craft/app/onboarding/page.jsx)
- **Purpose**: Collects initial user profile metrics (industry, sub-industry, experience level, skills, bio).
- **Database Tables**: `User`.
- **Server Actions**: `updateUserOnboarding` ([`actions/user.js`](file:///c:/Users/lenovo/Documents/GitHub/Skills-craft/actions/user.js)).
<!-- slide -->
### 🔐 9. Authentication Engine
- **Path**: [`auth.js`](file:///c:/Users/lenovo/Documents/GitHub/Skills-craft/auth.js), [`auth.config.js`](file:///c:/Users/lenovo/Documents/GitHub/Skills-craft/auth.config.js)
- **Purpose**: Secure sign-in via Email/Password Credentials or Google OAuth 2.0.
- **Database Tables**: `User`, `Account`, `Session`, `VerificationToken`.
<!-- slide -->
### 📊 10. User Dashboard
- **Path**: [`app/(main)/dashboard/page.jsx`](file:///c:/Users/lenovo/Documents/GitHub/Skills-craft/app/\(main\)/dashboard/page.jsx)
- **Purpose**: Unified analytics hub displaying assessment scores, resume status, recent activities, and recommendations.
- **Database Tables**: `User`, `Assessment`, `Resume`, `IndustryInsight`.
- **Server Actions**: `getDashboardData` ([`actions/dashboard.js`](file:///c:/Users/lenovo/Documents/GitHub/Skills-craft/actions/dashboard.js)).
<!-- slide -->
### 👤 11. User Settings & Account Management
- **Path**: [`app/(main)/account/page.jsx`](file:///c:/Users/lenovo/Documents/GitHub/Skills-craft/app/\(main\)/account/page.jsx)
- **Purpose**: Enables users to update profile details, bio, skills array, and password credentials.
<!-- slide -->
### 🔔 12. Notifications & Toast System
- **Path**: Native client integration using `sonner` toast notification manager.
- **Purpose**: Displays real-time toast alerts for async operation successes, server action failures, and audio status.
```

---

## 🎨 7. Frontend Architecture & Component Topology

The frontend is built on **React 19** and **Next.js 16 App Router**. Component responsibilities are divided between stateless Server Components (SSR / SEO) and interactive Client Components (`"use client"`).

### Component Hierarchy Diagram

```mermaid
graph TD
    RootLayout["app/layout.js (Root Layout)"] --> ThemeProv["components/theme-provider.jsx"]
    RootLayout --> SessionProv["components/session-provider.jsx"]
    RootLayout --> Header["components/header.jsx"]
    RootLayout --> MainContent["Page View Container"]
    RootLayout --> Footer["components/footer.jsx"]

    Header --> UserBtn["components/user-button.jsx"]
    Header --> NavLinks["Navigation Route Links"]

    MainContent --> DashboardPage["app/(main)/dashboard/page.jsx"]
    MainContent --> ResumePage["app/(main)/resume/page.jsx"]
    MainContent --> InterviewPage["app/(main)/interview/page.jsx"]
    MainContent --> OpportunitiesPage["app/(main)/opportunities/page.jsx"]

    DashboardPage --> InsightsCard["components/dashboard/industry-insights-card.jsx"]
    DashboardPage --> StatsGrid["components/stats.jsx"]

    ResumePage --> ResumeBuilder["components/dashboard/resume-builder.jsx"]
    ResumeBuilder --> EntryForm["components/resume/EntryForm.jsx"]
    ResumeBuilder --> ResumePreview["components/resume/ResumePreview.jsx"]
    ResumePage --> ResumeIntel["components/resume/resume-intelligence.jsx"]

    InterviewPage --> SpeechStudio["components/interview/interview-preview.jsx"]
    InterviewPage --> QuizSession["app/(main)/interview/session/[id]/page.jsx"]

    SpeechStudio --> WaveVisualizer["FrequencyVisualizer (Web Audio Canvas)"]
```

---

## ⚙️ 8. Backend Architecture & RPC Server Actions

The primary backend logic resides within **Next.js Server Actions** (`actions/`). Server actions run exclusively on the server, removing the need for manual API routing, controllers, or HTTP boilerplate.

### Server Actions Matrix & Handlers

| Action File | Exported Method | Inputs | Operation & Logic | Database Tables |
| :--- | :--- | :--- | :--- | :--- |
| [`actions/resume.js`](file:///c:/Users/lenovo/Documents/GitHub/Skills-craft/actions/resume.js) | `saveResume(content)` | `content: string` | Validates auth session, upserts Markdown resume record indexed by `userId`. | `Resume` |
| [`actions/resume.js`](file:///c:/Users/lenovo/Documents/GitHub/Skills-craft/actions/resume.js) | `getResume()` | None | Fetches single `Resume` record owned by current session user. | `Resume` |
| [`actions/resume-intelligence.js`](file:///c:/Users/lenovo/Documents/GitHub/Skills-craft/actions/resume-intelligence.js) | `analyzeResumeIntelligence(data)` | `{ resumeText, targetJob }` | Formats Gemini AI prompt, computes ATS score, extracts key gaps & action items. | `Resume` |
| [`actions/assessment.js`](file:///c:/Users/lenovo/Documents/GitHub/Skills-craft/actions/assessment.js) | `generateQuiz()` | None | Reads user `industry` & `skills`, prompts Gemini AI to construct 10 multiple-choice questions. | `User`, `Assessment` |
| [`actions/assessment.js`](file:///c:/Users/lenovo/Documents/GitHub/Skills-craft/actions/assessment.js) | `evaluateAssessment(payload)` | `{ assessmentId, answers }` | Compares candidate selections with answer keys, calculates score percentage, updates DB. | `Assessment` |
| [`actions/cover-letter.js`](file:///c:/Users/lenovo/Documents/GitHub/Skills-craft/actions/cover-letter.js) | `createCoverLetter(data)` | `{ jobTitle, companyName, jobDescription }` | Merges user profile with job parameters, invokes Gemini AI to generate custom cover letter. | `CoverLetter`, `User` |
| [`actions/opportunities.js`](file:///c:/Users/lenovo/Documents/GitHub/Skills-craft/actions/opportunities.js) | `getOpportunities(filters)` | `{ type, search, remote }` | Queries `Opportunity` table with Prisma WHERE clauses and joins user save status. | `Opportunity`, `UserOpportunity` |
| [`actions/user.js`](file:///c:/Users/lenovo/Documents/GitHub/Skills-craft/actions/user.js) | `updateUserOnboarding(data)` | `{ industry, bio, skills, experience }` | Validates Zod schema, updates `User` database record with profile details. | `User` |
| [`actions/parse-document.js`](file:///c:/Users/lenovo/Documents/GitHub/Skills-craft/actions/parse-document.js) | `parseDocumentAction(formData)` | `formData (file)` | Receives binary buffer, inspects MIME type, extracts raw string text using `pdf-parse`/`mammoth`. | None |

---

## 🔀 9. Hybrid Architecture (Serverless + Microservices)

SkillsCraft leverages a **Hybrid Model**:
- **Serverless Engine (Vercel / Next.js)**: Serves web UI, authentication, database CRUD, and short AI API calls. Zero idle cost.
- **Dedicated Microservices (Python FastAPI + Node WS Proxy)**: Dedicated long-lived processes handling continuous GPU/CPU Faster-Whisper audio transcription and persistent WebSocket audio streaming.

```mermaid
sequenceDiagram
    autonumber
    actor Client as Web Browser Client
    participant Serverless as Next.js Serverless Bridge (/api/transcribe)
    participant FastAPI as Python FastAPI Microservice (:8000)
    participant CloudSTT as Deepgram SaaS API

    Client->>Serverless: POST /api/transcribe (Audio Blob)
    Note over Serverless: Attempt 1: Call Local Dedicated Microservice
    Serverless->>FastAPI: POST /api/transcribe (4s Timeout)
    alt FastAPI Service Online
        FastAPI->>FastAPI: Run Faster-Whisper Inference
        FastAPI-->>Serverless: Return { transcript, language }
        Serverless-->>Client: Return JSON Transcript (Source: FastAPI)
    else FastAPI Unavailable or Timeout
        Serverless->>CloudSTT: Fallback to Cloud Speech API
        CloudSTT-->>Serverless: Return Transcribed Text
        Serverless-->>Client: Return JSON Transcript (Source: Deepgram Cloud)
    end
```

---

## 🗄️ 10. Database Documentation & Prisma Schema

The application uses **PostgreSQL** configured via **Prisma ORM** ([`prisma/schema.prisma`](file:///c:/Users/lenovo/Documents/GitHub/Skills-craft/prisma/schema.prisma)).

### Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    USER ||--o{ ACCOUNT : "has OAuth accounts"
    USER ||--o{ SESSION : "has sessions"
    USER ||--o{ RESUME : "owns 1:1"
    USER ||--o{ COVER_LETTER : "owns 1:N"
    USER ||--o{ ASSESSMENT : "attempts 1:N"
    USER }o--o| INDUSTRY_INSIGHT : "belongs to"
    USER ||--o{ USER_OPPORTUNITY : "tracks 1:N"
    OPPORTUNITY ||--o{ USER_OPPORTUNITY : "saved in"

    USER {
        string id PK
        string email UK
        string name
        string password
        string bio
        int experience
        string[] skills
        string industry
        string industryInsightId FK
        datetime createdAt
    }

    RESUME {
        string id PK
        string userId FK, UK
        string content
        json resumeData
        float atsScore
        string feedback
        datetime createdAt
    }

    COVER_LETTER {
        string id PK
        string userId FK
        string content
        string jobDescription
        string companyName
        string jobTitle
        string status
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
        string industry UK
        json[] salaryRanges
        float growthRate
        string demandLevel
        string[] topSkills
    }

    OPPORTUNITY {
        string id PK
        string externalId UK
        string type
        string title
        string organization
        boolean isRemote
        boolean isPaid
        string url
    }

    USER_OPPORTUNITY {
        string id PK
        string userId FK
        string opportunityId FK
        string status
        string notes
    }
```

---

## 🔐 11. Authentication & Authorization Flow

Authentication is managed via **NextAuth v5 (Auth.js)** supporting both Credentials (hashed password via `bcryptjs`) and Google OAuth 2.0.

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Browser
    participant Middleware as middleware.js
    participant Auth as NextAuth Handler (auth.js)
    participant DB as PostgreSQL (Prisma)

    User->>Browser: Submit Login Form (Email & Password)
    Browser->>Auth: POST /api/auth/callback/credentials
    Auth->>DB: findUnique({ where: { email } })
    DB-->>Auth: Return User Record & Hashed Password
    Auth->>Auth: Compare Passwords with bcrypt.compare()
    alt Credentials Valid
        Auth-->>Browser: Issue Signed NextAuth JWT Session Cookie
        Browser->>Middleware: Access Protected Route (/dashboard)
        Middleware->>Middleware: Validate req.auth Session Token
        Middleware-->>Browser: Render Requested Page Content
    else Invalid Credentials
        Auth-->>Browser: Return Auth Error Callback
    end
```

---

## 📝 12. Resume Builder Workflow

The Resume Builder provides an interactive split-pane environment combining schema-validated form entry with live reactive Markdown rendering.

```mermaid
sequenceDiagram
    autonumber
    actor Candidate
    participant UI as ResumeBuilder (React Component)
    participant Form as React Hook Form + Zod
    participant Action as saveResume Server Action
    participant DB as PostgreSQL (Resume Model)

    Candidate->>UI: Select Resume Tab (Experience, Skills, Projects)
    Candidate->>Form: Edit Section Fields
    Form->>UI: Update In-Memory JSON State
    UI->>UI: Re-render Reactive ResumePreview Pane
    Candidate->>UI: Click "Save Resume"
    UI->>Action: saveResume(markdownString)
    Action->>DB: upsert({ where: { userId }, create, update })
    DB-->>Action: Return Saved Resume Record
    Action-->>UI: Display Toast Notification ("Resume Saved Successfully")
```

---

## 🔬 13. Resume Analysis Engine

The Resume Intelligence Engine evaluates resume relevance against target job descriptions.

```mermaid
flowchart TD
    Upload[Upload PDF / DOCX File or Text] --> Buffer[Read File Buffer in Server Action]
    Buffer --> ParseMime{Check MIME Type}
    ParseMime -- PDF --> PDFParse[pdf-parse / pdf2json Extractor]
    ParseMime -- DOCX --> Mammoth[mammoth.extractRawText]
    PDFParse --> CleanText[Extracted Raw Resume Text]
    Mammoth --> CleanText
    CleanText --> PromptBuilder[Construct Structured Gemini AI Prompt]
    PromptBuilder --> GeminiAPI[Execute Google Gemini 1.5 Flash Request]
    GeminiAPI --> ParseJSON[Parse Structured JSON Output]
    ParseJSON --> OutputScore[ATS Score: 0-100]
    ParseJSON --> OutputGaps[Extracted Missing Keywords]
    ParseJSON --> OutputDiff[AI Rewritten Impact Bullet Points]
    OutputScore --> SaveDB[Update Resume Model in PostgreSQL]
```

---

## 🎤 14. Mock Interview Engine

The Mock Interview engine allows candidates to perform interactive speech mock interviews with live transcription and automated scoring.

```mermaid
sequenceDiagram
    autonumber
    actor Candidate
    participant Studio as Speech Interview Studio UI
    participant WSProxy as Node.js WS Proxy (:8080)
    participant Deepgram as Deepgram Nova-2 SaaS
    participant Action as evaluateAssessment Action
    participant Gemini as Google Gemini AI

    Candidate->>Studio: Click "Start Voice Interview"
    Studio->>WSProxy: Open WebSocket Connection (ws://localhost:8080)
    WSProxy->>Deepgram: Connect Upstream WebSocket Gateway
    loop Live Audio Streaming
        Candidate->>Studio: Speak Answer into Microphone
        Studio->>WSProxy: Stream Raw Binary PCM Chunks
        WSProxy->>Deepgram: Forward Binary Chunks
        Deepgram-->>WSProxy: Stream Real-time Transcribed Text
        WSProxy-->>Studio: Send Transcript Frame to Browser
        Studio->>Studio: Render Live Subtitles & Wave Visualizer Canvas
    end
    Candidate->>Studio: Stop Interview Session
    Studio->>Action: submitSpeechAnswer(transcript)
    Action->>Gemini: Prompt Answer Scoring & Delivery Analysis
    Gemini-->>Action: Return Technical Score & Improvement Tips
    Action->>DB: Save Assessment Performance Entry
    Action-->>Studio: Render Feedback Breakdown & Score Radar Chart
```

---

## 🔊 15. Speech Recognition & Audio Pipeline

SkillsCraft integrates a dual-provider speech-to-text pipeline with automatic failover capabilities.

```mermaid
graph TD
    Mic[Microphone Input] --> AudioHook[useSpeechRecognition Hook]
    AudioHook --> Mode{Execution Mode}
    Mode -- Live WebSocket Streaming --> WSGateway[Node WS Proxy :8080]
    WSGateway --> Deepgram[Deepgram Nova-2 API]
    Deepgram --> LiveTranscript[Live Subtitle Stream UI]

    Mode -- File Buffer Upload --> NextProxy[Next.js API Route /api/transcribe]
    NextProxy --> FastAPI[Python FastAPI :8000]
    FastAPI --> Whisper[Faster-Whisper Model]
    Whisper --> FullTranscript[Full Verified Audio Transcript]

    FastAPI -. Fallback on Failure .-> SaaSFallback[Deepgram Cloud API Fallback]
```

---

## 🔍 16. Opportunity Finder

The Opportunity Finder aggregates career listings, internships, hackathons, and open-source programs into a unified, filterable database.

```mermaid
flowchart TD
    UserQuery[User Filter: Type, Remote, Search Query] --> Action[getOpportunities Server Action]
    Action --> DBQuery[Prisma Query Opportunity Table]
    DBQuery --> JoinUser[Include UserOpportunity Status for Session User]
    JoinUser --> RenderGrid[Render Card Grid with Saved Badges]
    UserClick[User Clicks Bookmark Icon] --> SaveAction[toggleSaveOpportunity Server Action]
    SaveAction --> UpsertUserOp[Upsert UserOpportunity Record]
    
    CronTrigger[Inngest Background Scraper Trigger] --> ExternalScrape[Scrape RemoteOK, Devpost, LeetCode]
    ExternalScrape --> UpsertOps[Upsert New Opportunity Rows by externalId]
```

---

## 🤖 17. AI Integrations & Prompt Engineering

All AI operations utilize **Google Gemini 1.5 Flash** (`@google/generative-ai` / OpenAI client integration) configured with strict JSON mode outputs.

```javascript
// Sample Gemini Prompt Blueprint for Technical Quiz Generation
const prompt = `
You are an expert technical interviewer for the ${user.industry} industry.
Generate a 10-question technical quiz evaluating skills: ${user.skills.join(", ")}.

Format your response strictly as a JSON object matching this schema:
{
  "questions": [
    {
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "correctAnswer": "string",
      "explanation": "string"
    }
  ]
}
`;
```

### AI Module Summary Matrix

| Feature | Target AI Model | Temperature | Response Format | Primary Objective |
| :--- | :--- | :--- | :--- | :--- |
| **Resume ATS Scanner** | Gemini 1.5 Flash | 0.2 | Structured JSON | ATS score calculation, missing keyword extraction, bullet rewrites. |
| **Quiz Generator** | Gemini 1.5 Flash | 0.4 | Structured JSON | 10 industry-tailored multiple-choice technical questions. |
| **Answer Evaluator** | Gemini 1.5 Flash | 0.3 | Structured JSON | Technical correctness evaluation, score (0-100), improvement feedback. |
| **Cover Letter Generator** | Gemini 1.5 Flash | 0.7 | Markdown Text | Tailored, high-impact cover letter matching candidate experience to job post. |
| **Industry Insight Generator**| Gemini 1.5 Flash | 0.3 | Structured JSON | Salary range calculations, market growth rates, trending skills updates. |

---

## 🔌 18. Complete API & Server Action Specifications

### 1. Server Actions (RPC Execution)

#### `saveResume(content: string)`
- **Path**: [`actions/resume.js`](file:///c:/Users/lenovo/Documents/GitHub/Skills-craft/actions/resume.js)
- **Authentication**: Required (`auth()`).
- **Input**: Markdown resume string.
- **Output**: Updated `Resume` database record.

#### `generateQuiz()`
- **Path**: [`actions/assessment.js`](file:///c:/Users/lenovo/Documents/GitHub/Skills-craft/actions/assessment.js)
- **Authentication**: Required (`auth()`).
- **Input**: None (Reads user profile from DB).
- **Output**: Array of 10 JSON quiz question objects.

#### `createCoverLetter(payload)`
- **Path**: [`actions/cover-letter.js`](file:///c:/Users/lenovo/Documents/GitHub/Skills-craft/actions/cover-letter.js)
- **Input**: `{ jobTitle: string, companyName: string, jobDescription: string }`.
- **Output**: Created `CoverLetter` database record.

### 2. REST API Route Handlers (`app/api/`)

| Route Endpoint | HTTP Method | Request Payload | Response Body | Status Codes |
| :--- | :--- | :--- | :--- | :--- |
| `/api/auth/[...nextauth]` | `GET / POST` | Credentials / OAuth Callback | Session Token / Redirect | `200, 302, 401` |
| `/api/transcribe` | `POST` | `multipart/form-data (audio)` | `{ transcript: string, source: string }` | `200, 400, 500` |
| `/api/inngest` | `GET / POST` | Inngest Webhook Signatures | Inngest Function State | `200, 403` |
| `/api/deepgram` | `GET` | Handshake Headers | `{ token: string }` | `200, 500` |

---

## 🛡️ 19. Middleware & Interceptor Pipeline

```mermaid
flowchart LR
    IncomingReq[Incoming HTTP / WS Request] --> AuthMW[NextAuth Middleware middleware.js]
    AuthMW -- Unauthenticated Protected Path --> RedirectLogin[Redirect to /sign-in]
    AuthMW -- Authorized --> CORSMW[FastAPI / API CORS Interceptor]
    CORSMW --> RouteHandler[Server Action / API Route Execution]
    RouteHandler --> ParseMW[Binary Document Parsing Engine]
    ParseMW --> Execution[Database & AI Processing]
```

---

## 🔄 20. Asynchronous Background Jobs & Cron Scheduling

Background processing is executed using **Inngest** ([`lib/inngest/`](file:///c:/Users/lenovo/Documents/GitHub/Skills-craft/lib/inngest/)).

```javascript
// Weekly Inngest Background Cron Worker (lib/inngest/functions.js)
export const syncIndustryInsights = inngest.createFunction(
  { id: "sync-industry-insights" },
  { cron: "0 0 * * 0" }, // Runs every Sunday at Midnight
  async ({ step }) => {
    const industries = ["Software Engineering", "Data Science", "Cybersecurity"];
    for (const industry of industries) {
      await step.run(`update-${industry}`, async () => {
        // Query Gemini API & update PostgreSQL via Prisma
        await db.industryInsight.upsert({
          where: { industry },
          update: { lastUpdated: new Date() },
          create: { industry, topSkills: ["React", "Python", "Docker"] }
        });
      });
    }
  }
);
```

---

## 📥 21. Multi-Format File Upload & Extraction Pipeline

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Browser
    participant Action as parseDocumentAction (parse-document.js)
    participant PDFParse as pdf-parse Library
    participant Mammoth as mammoth (DOCX) Library

    User->>Browser: Select File Upload (.pdf or .docx)
    Browser->>Action: POST FormData File Buffer
    Action->>Action: Inspect File Buffer Header MIME Type
    alt File is PDF
        Action->>PDFParse: pdfParse(buffer)
        PDFParse-->>Action: Extracted Raw Text
    else File is DOCX
        Action->>Mammoth: mammoth.extractRawText({ buffer })
        Mammoth-->>Action: Extracted Raw Text
    end
    Action-->>Browser: Return Clean Text Payload
```

---

## 📊 22. Interactive Dashboard Engine

The User Dashboard ([`app/(main)/dashboard/page.jsx`](file:///c:/Users/lenovo/Documents/GitHub/Skills-craft/app/\(main\)/dashboard/page.jsx)) aggregates data from multiple PostgreSQL tables in a single server-side data fetch (`getDashboardData`).

```mermaid
graph TD
    DashboardAction[getDashboardData Server Action] --> Query1[db.user.findUnique]
    DashboardAction --> Query2[db.assessment.findMany]
    DashboardAction --> Query3[db.resume.findUnique]
    DashboardAction --> Query4[db.industryInsight.findUnique]

    Query1 --> UserMetrics[User Profile & Skills]
    Query2 --> AssessmentStats[Average Quiz Score & Completed Interviews]
    Query3 --> ResumeScore[ATS Score & Formatting Feedback]
    Query4 --> SalaryRanges[Salary Percentiles & Market Demand]

    UserMetrics --> CombinePayload[Combined Dashboard JSON Payload]
    AssessmentStats --> CombinePayload
    ResumeScore --> CombinePayload
    SalaryRanges --> CombinePayload

    CombinePayload --> DashboardUI[Render Dashboard Cards & Analytics UI]
```

---

## ⚡ 23. Request Execution & End-to-End Lifecycle

```
[User Browser]
      │
      ▼
1. User triggers action (e.g. Save Resume)
      │
      ▼
2. Client invokes Next.js Server Action: saveResume(content)
      │
      ▼
3. Server Action verifies auth session via auth()
      │
      ▼
4. Server Action executes Prisma DB operation: db.resume.upsert()
      │
      ▼
5. PostgreSQL updates record and returns result
      │
      ▼
6. Server Action returns response payload to client component
      │
      ▼
7. React state updates and triggers toast alert
```

---

## 🚨 24. System Error Handling & Resilience Strategy

- **Server Action Boundaries**: All server actions wrap database and API calls in `try/catch` blocks, throwing user-friendly string errors to the UI.
- **FastAPI Microservice Fallback**: If the local Python FastAPI microservice is offline or times out (4s threshold), the system automatically routes audio transcription requests to Cloud SaaS (Deepgram).
- **Graceful UI Toast Alerts**: Toast messages rendered via `sonner` notify users of non-blocking errors without crashing the component tree.
- **Database Connection Pooling**: Prisma Client singleton instances prevent database connection exhaustion during serverless function scaling.

---

## 🛡️ 25. Security & Data Protection Standard

1. **Authentication Guarding**: All server actions and API routes check session validity (`auth()`) before processing requests.
2. **SQL Injection Prevention**: Prisma ORM uses parameterized SQL queries exclusively.
3. **Password Hashing**: User passwords are encrypted using `bcryptjs` with a cost factor of 10.
4. **Environment Variables**: Sensitive keys (`AUTH_SECRET`, `GEMINI_API_KEY`, `DATABASE_URL`) are isolated on the server side and never exposed to client bundles.
5. **CSRF & XSS Protection**: Next.js automatically sanitizes HTML inputs and validates request origin headers.

---

## 🚀 26. Deployment & Environment Setup Guide

### Environment Variables Matrix (`.env`)

```env
DATABASE_URL="postgresql://user:password@localhost:5432/skillscraft?sslmode=disable"
AUTH_SECRET="your-generated-super-secret-auth-key"
GOOGLE_CLIENT_ID="your-google-oauth-client-id"
GOOGLE_CLIENT_SECRET="your-google-oauth-client-secret"
GEMINI_API_KEY="AIzaSy..."
DEEPGRAM_API_KEY="your-deepgram-api-key"
NEXT_PUBLIC_STT_API_URL="http://localhost:8000"
NEXT_PUBLIC_WS_URL="ws://localhost:8080"
INNGEST_EVENT_KEY="your-inngest-event-key"
INNGEST_SIGNING_KEY="your-inngest-signing-key"
```

### Installation & Launch Commands

```bash
# 1. Install Node.js Dependencies
npm install

# 2. Setup Database & Prisma Migrations
npx prisma db push
npx prisma generate

# 3. Seed Initial Industry Benchmark Data
npm run seed-insights

# 4. Setup Python FastAPI Microservice
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# 5. Launch Node WebSocket Proxy (In root folder)
npm run deepgram

# 6. Launch Next.js Application Server
npm run dev
```

---

## ⚡ 27. Performance Optimization & Caching Strategy

- **Server-Side Rendering (SSR)**: Core dashboard pages are rendered on the server to reduce bundle sizes.
- **Prisma Client Singleton**: Managed via [`lib/prisma.js`](file:///c:/Users/lenovo/Documents/GitHub/Skills-craft/lib/prisma.js) to avoid multiple connection instantiations in hot-reloading development environments.
- **Lazy Loading & Code Splitting**: Heavy interactive components (such as Recharts graphs and audio visualizers) are dynamically imported using `next/dynamic`.
- **Model In-Memory Caching**: Python FastAPI loads the Faster-Whisper model into RAM once at startup as a singleton instance.

---

## 📏 28. Engineering Coding Standards & Git Workflow

1. **Folder Conventions**: Keep React components inside feature subdirectories under `components/` or `app/(main)/[feature]/_components/`.
2. **Server Actions Convention**: Always tag server action files with `"use server"` at line 1.
3. **Commit Message Format**: Follow standard conventions: `feat: add speech visualizer canvas`, `fix: resolve resume parser mime check`.
4. **Branching Strategy**: Use feature branches (`feature/resume-ats-scanner`, `fix/fastapi-cors`) merged into `main` via pull requests.

---

## 🔧 29. System Maintenance & Extension Guide

### How to Add a New Module
1. **Define Schema**: Add any required models or fields in `prisma/schema.prisma` and run `npx prisma db push`.
2. **Create Server Actions**: Add RPC methods under `actions/[new-feature].js` tagged with `"use server"`.
3. **Build UI Components**: Create page routes under `app/(main)/[new-feature]/page.jsx` and reusable components in `components/[new-feature]/`.
4. **Update Navigation**: Add route shortcuts in `components/header.jsx`.

---

## 🛠️ 30. Comprehensive Troubleshooting Guide

| Issue / Symptom | Probable Cause | Resolution Step |
| :--- | :--- | :--- |
| **Prisma Engine Error** | Database connection URL incorrect or unreachable. | Verify `DATABASE_URL` string in `.env` and confirm PostgreSQL server is active. |
| **FastAPI Microservice Offline** | Python environment missing dependencies or port 8000 blocked. | Run `uvicorn main:app --reload --port 8000` inside `backend/` and check `requirements.txt`. |
| **WebSocket Connection Failed** | Node WS proxy process not running on port 8080. | Execute `npm run deepgram` in terminal to launch `server/deepgram-ws.js`. |
| **Gemini AI Rate Exceeded** | Free tier API quota reached or invalid API key. | Confirm `GEMINI_API_KEY` validity in Google AI Studio console. |
| **NextAuth Unauthorized Redirect** | Session cookie missing or `AUTH_SECRET` mismatched. | Clear browser cookies and ensure `AUTH_SECRET` is set in `.env`. |

---

## 🔮 31. Future Engineering Scope & Roadmap

- **Docker Containerization**: Packaging Next.js web app, FastAPI backend, and Node WS proxy into multi-stage Docker containers with `docker-compose`.
- **Kubernetes Deployment**: Orchestrating microservice instances on cloud container clusters (GKE / EKS).
- **Redis Cache Integration**: Caching AI response payloads and opportunity query results using Redis / Upstash.
- **Native Mobile Application**: Building cross-platform iOS/Android apps using React Native sharing the existing Server Action backend.

---

## 📖 32. Technical Glossary

- **ATS (Applicant Tracking System)**: Automated software used by employers to screen and rank candidate resumes.
- **Server Action**: Next.js RPC function executing directly on the server without explicit REST route configuration.
- **Prisma ORM**: Object-Relational Mapping library providing type-safe database access for Node.js/TypeScript.
- **Faster-Whisper**: Optimized Python implementation of OpenAI Whisper model using CTranslate2.
- **Inngest**: Event-driven serverless background job queue for running asynchronous workflows and cron tasks.
- **JWT (JSON Web Token)**: Statistically signed token format used for stateless authentication session management.

---

## 📎 33. Appendix & Infrastructure Commands

### Useful Developer Commands

```bash
# Push database schema updates without migration files (Development)
npx prisma db push

# Open interactive Prisma Studio database viewer GUI
npx prisma studio

# Run ESLint validation checks
npm run lint

# Start local Inngest development server GUI
npx inngest-cli@latest dev
```

---
*Documentation Compiled & Verified for SkillsCraft Engineering Handover.*

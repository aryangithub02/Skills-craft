# 🚀 SkillsCraft Complete Implementation & Setup Guide (Frontend & Backend)

Welcome to the unified **Frontend & Backend Implementation Guide** for **SkillsCraft (AI Career Coach)**. This guide covers how to set up, configure, run, and understand both the client-side architecture and server-side infrastructure.

---

## 📌 Executive Summary

- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS v4, Shadcn UI, Recharts, `html2pdf.js`, `@uiw/react-md-editor`.
- **Backend**: Next.js Server Actions, Next.js API Routes, PostgreSQL (Neon Tech), Prisma 7 ORM, NextAuth v5, Google Gemini 1.5 Flash API, Inngest Background Cron Jobs.

---

## 📑 Quick Links
- 🎨 **[Frontend Documentation](file:///c:/Users/lenovo/Documents/GitHub/Skills-craft/FRONTEND.md)**
- ⚙️ **[Backend Documentation](file:///c:/Users/lenovo/Documents/GitHub/Skills-craft/BACKEND.md)**

---

## 🏗️ System Architecture Overview

```mermaid
graph TD
    subgraph Client ["Frontend (Next.js 16 App Router)"]
        UI[Landing Page & Dashboard]
        RB[Resume Builder & PDF Preview]
        MI[Mock Interview Quiz & Charts]
        CL[Cover Letter Generator]
    end

    subgraph Server ["Backend Infrastructure"]
        SA[Next.js Server Actions]
        API[API Routes & Webhooks]
        ING[Inngest Background Workers]
    end

    subgraph External ["External Services & Data"]
        DB[(PostgreSQL Database via Prisma)]
        AI[Google Gemini 1.5 Flash API]
        AUTH[Auth Provider]
    end

    UI --> SA
    RB --> SA
    MI --> SA
    CL --> SA

    SA --> DB
    SA --> AI
    API --> ING
    ING --> DB
    ING --> AI
```

---

## 🚀 Complete Step-by-Step Setup & How To Start

### Step 1: Clone & Install Dependencies
```bash
# Navigate to project root
cd Skills-craft

# Install all npm dependencies
npm install
```

### Step 2: Configure Environment Variables
Create a `.env` file in the root directory:

```env
# Database Connection (PostgreSQL / Neon)
DATABASE_URL="postgresql://your_user:your_password@your_host/your_database?sslmode=require"

# AI Integration Key
GEMINI_API_KEY="your_gemini_api_key_here"

# NextAuth / Authentication
AUTH_SECRET="your_auth_secret_here"
AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Inngest Background Jobs (Optional for local testing)
INNGEST_EVENT_KEY="your_inngest_event_key"
INNGEST_SIGNING_KEY="your_inngest_signing_key"
```

### Step 3: Setup & Seed Database
Sync your Prisma schema with PostgreSQL and seed initial market data:

```bash
# Generate Prisma Client
npx prisma generate

# Push Database Schema to PostgreSQL
npx prisma db push

# Seed Industry Insights data
npm run seed-insights
```

### Step 4: Start Inngest Background Dev Server (Optional)
In a separate terminal tab, run Inngest dev server to handle background cron jobs:
```bash
npx inngest-cli@latest dev
```
Inngest dashboard will run on **[http://localhost:8288](http://localhost:8288)**.

### Step 5: Start the Application
Run the Next.js development server:

```bash
npm run dev
```

Open your browser at 👉 **[http://localhost:3000](http://localhost:3000)**.

---

## 🎨 Frontend Summary
- **App Router Structure**: `app/(auth)`, `app/(main)/dashboard`, `app/(main)/resume`, `app/(main)/interview`, `app/(main)/cover-letter`, `app/onboarding`.
- **UI Components**: Built with Shadcn UI (Radix primitives) located in `components/ui/`.
- **Visual Analytics**: Interactive Recharts graphs for interview score trends.
- **PDF Export**: Client-side rendering of Markdown preview to PDF file using `html2pdf.js`.

---

## ⚙️ Backend Summary
- **Data Models (`prisma/schema.prisma`)**: `User`, `Resume`, `CoverLetter`, `Assessment`, `IndustryInsight`, `Account`, `Session`.
- **Server Actions (`actions/`)**:
  - `actions/resume.js`: AI resume improvement using Gemini 1.5 Flash.
  - `actions/assessment.js`: AI interview question generation & scoring.
  - `actions/generate-cover-letter.js`: AI cover letter generation.
  - `actions/user.js`: User onboarding & profile updates.
  - `actions/industry.ts`: Industry market insights fetcher.
- **Background Jobs (`app/api/inngest/route.js`)**: Weekly scheduled updates of industry market trends and salary data.

---

## 🧪 Verification & Testing Commands

| Purpose | Command |
| :--- | :--- |
| **Run Dev Server** | `npm run dev` |
| **Build Production App** | `npm run build` |
| **Start Production Server** | `npm run start` |
| **Run Linting** | `npm run lint` |
| **Seed Insights Data** | `npm run seed-insights` |
| **Prisma Studio (DB Inspector)** | `npx prisma studio` |

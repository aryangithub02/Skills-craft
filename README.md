# SkillsCraft 🚀

![SkillsCraft Logo](/skillscraft_logo_1768835132077.png)

**SkillsCraft** is an AI-powered career coaching platform designed to guide students and professionals toward career success. By leveraging the Gemini API and advanced automation, SkillsCraft offers a suite of tools to build, refine, and simulate the career journey.

## 🌟 Core Features

### 1. 🔐 Authentication & Onboarding
- **Secure Access**: Google and Email authentication options.
- **Smart Onboarding**: A guided flow capturing industry preferences, skills, and professional bio.
- **Data Integrity**: All forms are rigorously validated using **Zod**.

### 2. 📊 Industry Insights Dashboard
- **Live Market Data**: Displays weekly updated industry trends and market insights.
- **Background Automation**: Powered by **Inngest** cron jobs to fetch and process data in the background without affecting UI performance.

### 3. 📝 AI Resume Builder ("Improve with AI")
- **Gemini Powered**: Sends raw user bullet points to **Gemini 1.5 Flash**.
- **ATS Optimization**: Returns ATS-optimized content in Markdown format, tailored for maximum impact.

### 4. 📄 PDF Export System
- **Real-time Conversion**: Uses `html2pdf` to convert live Markdown previews into professional, downloadable PDF documents.

### 5. 🎤 Mock Interview System
- **AI Simulation**: Interactive technical interview sessions with AI-generated questions.
- **Performance Tracking**: Quiz results and feedback are stored in **PostgreSQL**.
- **Visual Analytics**: Interactive charts powered by **Recharts** to visualize improvement over time.

### 6. ✉️ AI Cover Letter Generator
- **Dynamic Creation**: Generates tailored cover letters based on specific job descriptions, company names, and your stored profile data.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: React 19 / JavaScript
- **Styling**: Tailwind CSS, Shadcn UI
- **AI Model**: [Google Gemini 1.5 Flash](https://deepmind.google/technologies/gemini/)
- **Background Jobs**: [Inngest](https://www.inngest.com/)
- **Database**: PostgreSQL (Prisma/Drizzle)
- **Validation**: Zod
- **Visualization**: Recharts

## 🚀 Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🤝 Contributing

This project is currently under active development.


const { PrismaClient } = require("@prisma/client");
const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");
require("dotenv").config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("❌ DATABASE_URL environment variable is missing.");
  process.exit(1);
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const defaultInsights = [
  {
    industry: "Tech",
    salaryRanges: [
      { role: "Software Engineer", min: 70000, max: 130000 },
      { role: "Frontend Developer", min: 65000, max: 120000 },
      { role: "Backend Developer", min: 75000, max: 140000 },
      { role: "Full Stack Engineer", min: 80000, max: 150000 },
      { role: "DevOps Engineer", min: 85000, max: 145000 },
    ],
    growthRate: 18.5,
    demandLevel: "High",
    topSkills: ["React", "Next.js", "Node.js", "TypeScript", "Python", "Cloud Architecture"],
    marketOutlook: "High",
    keyTrends: ["AI Integration", "Serverless Computing", "Cybersecurity Emphasis", "Remote Work Models"],
    recommendedSkills: ["Generative AI", "Docker", "Kubernetes", "PostgreSQL", "Tailwind CSS"],
    lastUpdated: new Date(),
    nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  },
  {
    industry: "Healthcare",
    salaryRanges: [
      { role: "Registered Nurse", min: 60000, max: 95000 },
      { role: "Health Data Analyst", min: 65000, max: 110000 },
      { role: "Medical Assistant", min: 35000, max: 55000 },
    ],
    growthRate: 12.0,
    demandLevel: "High",
    topSkills: ["Patient Care", "Health Informatics", "EHR Systems", "Clinical Research"],
    marketOutlook: "High",
    keyTrends: ["Telehealth Expansion", "AI Diagnostics", "Personalized Medicine"],
    recommendedSkills: ["Data Analytics", "HIPAA Compliance", "Telemedicine Tools"],
    lastUpdated: new Date(),
    nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  },
  {
    industry: "Finance",
    salaryRanges: [
      { role: "Financial Analyst", min: 65000, max: 115000 },
      { role: "Risk Manager", min: 85000, max: 140000 },
      { role: "Investment Banker", min: 100000, max: 200000 },
    ],
    growthRate: 9.5,
    demandLevel: "Medium",
    topSkills: ["Financial Modeling", "Data Analysis", "Risk Assessment", "Python"],
    marketOutlook: "Medium",
    keyTrends: ["Fintech Growth", "Algorithmic Trading", "Blockchain & Crypto"],
    recommendedSkills: ["SQL", "PowerBI", "Financial Accounting"],
    lastUpdated: new Date(),
    nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  },
  {
    industry: "Marketing",
    salaryRanges: [
      { role: "Digital Marketer", min: 50000, max: 90000 },
      { role: "SEO Specialist", min: 48000, max: 85000 },
      { role: "Growth Lead", min: 80000, max: 140000 },
    ],
    growthRate: 10.0,
    demandLevel: "Medium",
    topSkills: ["SEO/SEM", "Content Strategy", "Google Analytics", "Social Media"],
    marketOutlook: "Medium",
    keyTrends: ["AI Content Automation", "Data-Driven Marketing", "Video Content Primacy"],
    recommendedSkills: ["Copywriting", "Marketing Analytics", "Paid Ads"],
    lastUpdated: new Date(),
    nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  },
];

async function seed() {
  console.log("🌱 Seeding Industry Insights database...\n");

  try {
    for (const insight of defaultInsights) {
      const result = await prisma.industryInsight.upsert({
        where: { industry: insight.industry },
        update: insight,
        create: insight,
      });
      console.log(`✅ Seeded/Updated insight for: ${result.industry}`);
    }

    console.log("\n🎉 Industry Insights seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding industry insights:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

seed();

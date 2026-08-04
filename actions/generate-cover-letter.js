"use server";

import { db } from "@/lib/prisma";
import { auth } from "@/auth";

export async function generateCoverLetter(data) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized. Please sign in.");

  const userId = session.user.id;
  const userEmail = session.user.email;

  const user = await db.user.findFirst({
    where: {
      OR: [
        { id: userId || "" },
        { email: userEmail || "" }
      ]
    }
  });

  if (!user) throw new Error("User not found. Please log in again.");

  // Fetch the user's resume for rich context
  const resume = await db.resume.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" }
  });

  const candidateName = user.name || "Candidate";
  const userSkills = (user.skills || []).join(", ") || "Software Development, Technical Problem Solving, Team Collaboration";
  const userIndustry = user.industry || "Technology";
  const resumeContent = resume?.content || `Candidate Skills: ${userSkills}. Industry: ${userIndustry}.`;

  const jobTitle = data.jobTitle || "Software Engineer";
  const companyName = data.companyName || "Target Company";
  const jobDescription = data.jobDescription || "";

  const prompt = `
    You are an elite career coach and executive resume writer.
    Write a compelling, tailored, highly professional Markdown cover letter for the following position:
    
    JOB TITLE: ${jobTitle}
    COMPANY NAME: ${companyName}
    JOB DESCRIPTION:
    ${jobDescription}
    
    CANDIDATE NAME: ${candidateName}
    CANDIDATE RESUME / SKILLS CONTEXT:
    ${resumeContent}
    
    REQUIREMENTS:
    1. Direct, enthusiastic opening expressing interest in ${jobTitle} at ${companyName}.
    2. Highlight matching technical skills, experience, and accomplishments relevant to the job requirements.
    3. Include a strategic paragraph explaining why the candidate aligns with ${companyName}'s vision.
    4. Provide a strong closing call-to-action requesting an interview.
    5. Return ONLY clean Markdown without code fences or extra conversational filler.
  `;

  // Models to try in order of preference
  const models = [
    "meta-llama/llama-3.3-70b-instruct",
    "google/gemini-2.5-flash",
    "deepseek/deepseek-r1",
    "qwen/qwen-2.5-72b-instruct"
  ];

  let apiKey = process.env.OPENROUTER_API_KEY || process.env.GEMINI_API_KEY;

  if (apiKey) {
    for (const model of models) {
      try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "HTTP-Referer": `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}`,
            "X-Title": "SkillsCraft AI",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model,
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
            max_tokens: 1200
          })
        });

        if (response.ok) {
          const result = await response.json();
          const generatedText = result.choices?.[0]?.message?.content;
          if (generatedText && generatedText.trim()) {
            return generatedText.trim().replace(/^```markdown\n/, "").replace(/\n```$/, "");
          }
        }
      } catch (err) {
        console.warn(`[CoverLetterAI] Model ${model} failed, trying next:`, err.message);
      }
    }
  }

  // Fallback high-quality Cover Letter generator if API is unconfigured or rate limited
  return generateDeterministicCoverLetter({ candidateName, jobTitle, companyName, jobDescription, userSkills });
}

function generateDeterministicCoverLetter({ candidateName, jobTitle, companyName, jobDescription, userSkills }) {
  return `Dear Hiring Manager at **${companyName}**,

I am writing to express my strong enthusiasm for the **${jobTitle}** position at **${companyName}**. With a solid technical foundation in **${userSkills}**, I am confident in my ability to make an immediate impact on your engineering initiatives.

### Why I Am a Strong Fit

Throughout my career, I have focused on delivering scalable, high-performance solutions and driving impactful technical outcomes. Your job requirements align closely with my core competencies:

- **Technical Mastery**: Proficient in core modern technologies (**${userSkills}**), allowing me to design and implement robust architectures.
- **Problem Solving & Execution**: Experienced in taking complex product requirements from initial concepts to production deployment.
- **Collaborative Engineering**: Accustomed to working in fast-paced team environments, participating in code reviews, and contributing to engineering best practices.

### Alignment with ${companyName}

I have been following **${companyName}**'s growth and innovation in the tech industry. I am particularly drawn to your mission and would welcome the opportunity to leverage my expertise in **${userSkills}** to solve challenging technical problems for your platform.

Thank you for your time and consideration. I would welcome the opportunity to discuss how my background and skills align with **${companyName}**'s goals in an interview.

Sincerely,  
**${candidateName}**  
*${userSkills.split(',')[0] || 'Software Engineer'}*`;
}

import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

/**
 * Generates interview questions based on user's industry, domain, and experience
 */
export async function generateInterviewQuestions(userData) {
  console.log(`🤖 Generating interview questions for: ${userData.industry} - ${userData.domain}`);

  // Generate 10 MCQ questions total
  const totalQuestions = 10;

  // Determine distribution based on interview type
  let technicalCount = 7;
  let nonTechnicalCount = 3;

  // Adjust counts based on interview type
  if (userData.interviewType === 'technical') {
    technicalCount = 10;
    nonTechnicalCount = 0;
  } else if (userData.interviewType === 'non-technical') {
    technicalCount = 0;
    nonTechnicalCount = 10;
  } else if (userData.interviewType === 'mixed') {
    technicalCount = 5;
    nonTechnicalCount = 5;
  }

  // Create skills list combining user skills and top skills
  const allSkills = [...new Set([...userData.skills || [], ...userData.topSkills || []])];

  const systemPrompt = `
    You are an expert technical interviewer specializing in the ${userData.industry} industry.
    Your task is to generate EXACTLY ${totalQuestions} Multiple Choice Questions (MCQs).
    
    Target Profile:
    - Industry: ${userData.industry}
    - Domain: ${userData.domain}
    ${userData.specificTopic ? `- Specific Topic: ${userData.specificTopic}` : ''}
    - Experience Level: ${userData.experience} years
    - Key Skills: ${allSkills.join(', ')}


    Question Distribution (CRITICAL):
    - EXACTLY ${technicalCount} technical questions (deep dives into ${userData.specificTopic ? userData.specificTopic : userData.domain} and ${userData.industry} specific workflows)
    - EXACTLY ${nonTechnicalCount} behavioral knowledge questions (scenario-based, focusing on communication and problem solving)

    - TOTAL MUST BE EXACTLY ${totalQuestions} QUESTIONS.

    Strict Relevance & Variety Rules:
    1. Every question MUST be directly relevant to the "${userData.domain}" domain within the "${userData.industry}" industry.
    ${userData.specificTopic ? `2. CRITICAL: The ${technicalCount} technical questions MUST focus specifically on "${userData.specificTopic}".` : '2. Variety is CRITICAL. DO NOT ask multiple questions about the same specific concept.'}
    3. Ensure a broad spectrum of topics is covered:
       - For technical domains: cover architecture, security, performance, best practices, specific frameworks/languages, and data handling.
       - For behavioral: cover leadership, conflict resolution, technical growth, and communication.
    4. STRICTLY FORBIDDEN: Do not generate duplicate or very similar questions. Every question must be a unique challenge.
    5. DO NOT ask about technologies outside the "${userData.specificTopic ? userData.specificTopic : userData.domain}" scope.


    Formatting Rules:
    1. All questions MUST be MCQs with exactly 4 options.
    2. Options must be plain text. DO NOT add "A)", "B)", "1.", or any other prefixes.
    3. The "correctAnswer" field must EXACTLY match one of the strings in the "options" array.
    4. "explanation" should be professional and concise (max 2 sentences).
    5. Difficulty must be appropriate for ${userData.experience} years of experience.
    6. Return ONLY a valid JSON array of objects. No introductory text or markdown code blocks.

    JSON Schema:
    [
      {
        "type": "technical" | "behavioral",
        "difficulty": "beginner" | "intermediate" | "advanced",
        "question": "The question text here...",
        "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
        "correctAnswer": "Option 1",
        "explanation": "Brief explanation of why this answer is correct.",
        "userAnswer": "",
        "score": null,
        "feedback": ""
      }
    ]

    Ensure all questions are high-quality, unique, and strictly relevant to ${userData.domain}.
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: "meta-llama/llama-3.3-70b-instruct",
      messages: [
        { role: "system", content: systemPrompt }
      ],
      temperature: 0.5,
    });

    const text = completion.choices[0].message.content;
    console.log("-----------------------------------------");
    console.log("🤖 RAW AI RESPONSE FROM OPENROUTER:");
    console.log(text);
    console.log("-----------------------------------------");

    if (!text || text.trim() === '') {
      throw new Error("AI returned an empty response");
    }

    // Extract JSON from the response
    let jsonString = text;

    // More robust JSON extraction (find first [ and last ])
    const firstBracket = text.indexOf('[');
    const lastBracket = text.lastIndexOf(']');
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');

    if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
      jsonString = text.substring(firstBracket, lastBracket + 1);
    } else if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      jsonString = text.substring(firstBrace, lastBrace + 1);
    } else {
      jsonString = text
        .replace(/```(?:json)?/g, "")
        .replace(/```/g, "")
        .trim();
    }

    /**
     * Attempts to fix common JSON errors from small LLMs (like Llama 3 8B)
     */
    const fixMalformedJson = (str) => {
      let fixed = str
        // Remove markdown code blocks if any survived
        .replace(/```json/g, "")
        .replace(/```/g, "")
        // Remove comments
        .replace(/\/\/.*$/gm, "")
        .replace(/\/\*[\s\S]*?\*\//g, "")
        // Handle smart quotes
        .replace(/[\u201C\u201D\u2018\u2019]/g, '"')
        // Fix unquoted keys (e.g., { type: "technical" } -> { "type": "technical" })
        .replace(/([{,]\s*)(['"]?)([a-zA-Z0-9_]+)\2\s*:/g, '$1"$3":')
        // Fix unescaped quotes inside strings (common in options/questions)
        .replace(/(?<!\\)"(?=[^,\]}]*"\s*[,\]}])/g, '')
        // Fix trailing commas
        .replace(/,\s*([\]}])/g, '$1')
        // Fix single quotes to double quotes for values
        .replace(/:\s*'([^']*)'/g, ':"$1"');

      return fixed;
    };

    let questions;
    try {
      questions = JSON.parse(jsonString);
    } catch (parseError) {
      console.error("❌ Initial JSON Parsing failed. Attempting cleanup...");
      try {
        const fixedJson = fixMalformedJson(jsonString);
        console.log("🛠️ Attempting parse with fixed JSON...");
        questions = JSON.parse(fixedJson);
        // Normalize object wrappers
        if (questions.questions && Array.isArray(questions.questions)) {
          questions = questions.questions;
        } else if (!Array.isArray(questions)) {
          questions = [questions];
        }
      } catch (e) {
        console.error("❌ Final JSON Parsing failed completely.");
        console.log("Problematic string after extraction was:", jsonString);
        throw new Error(`Failed to parse AI response: ${e.message}. Check server logs for full response.`);
      }
    }

    // Validate and normalize the questions
    const normalizedQuestions = questions.map(question => ({
      ...question,
      options: Array.isArray(question.options) ? question.options : [],
      correctAnswer: question.correctAnswer || "",
      explanation: question.explanation || "",
      userAnswer: question.userAnswer || "",
      score: question.score || null,
      feedback: question.feedback || "",
    }));

    if (normalizedQuestions.length === 0) {
      throw new Error("No valid questions were extracted from AI response");
    }

    return normalizedQuestions;
  } catch (error) {
    console.error("❌ Error in generateInterviewQuestions:", error);
    throw error;
  }
}
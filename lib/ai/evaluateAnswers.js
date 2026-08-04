import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

/**
 * Evaluates all answers in an assessment and provides scores and feedback
 */
export async function evaluateAnswers(questions) {
  console.log(`🤖 Evaluating ${questions.length} answers`);

  // Format questions for the AI prompt
  const formattedQuestions = questions.map((q, index) => ({
    index,
    type: q.type,
    question: q.question,
    userAnswer: q.userAnswer,
    expectedKeyPoints: q.expectedKeyPoints
  })).filter(q => q.userAnswer && q.userAnswer.trim() !== '');

  if (formattedQuestions.length === 0) {
    throw new Error("No answered questions to evaluate");
  }

  const systemPrompt = `
    You are an expert technical interviewer.
    Evaluate these interview answers for a ${questions[0]?.type || 'technical'} role.
    
    For each answer, provided are the question and the user's response.
    Evaluate based on:
    1. Technical accuracy (for technical questions)
    2. Communication clarity and professional tone
    3. Completeness (did they hit the expected key points?)
    4. Confidence and structure of the response
    
    Questions and Answers:
    ${JSON.stringify(formattedQuestions, null, 2)}
    
    Response format (return ONLY valid JSON, no markdown):
    {
      "evaluatedQuestions": [
        {
          "question": "string",
          "userAnswer": "string",
          "score": number (0-10),
          "feedback": "2-3 sentences of constructive feedback",
          "technicalAccuracy": number (0-10),
          "communication": number (0-10)
        }
      ],
      "overallScore": number (0-100),
      "technicalScore": number (0-100),
      "communicationScore": number (0-100),
      "confidenceScore": number (0-100),
      "problemSolvingScore": number (0-100),
      "strengths": ["strength1", "strength2", "strength3"],
      "weaknesses": ["weakness1", "weakness2"],
      "actionPlan": ["action1", "action2", "action3"],
      "improvementTips": ["tip1", "tip2", "tip3"]
    }
    
    Be honest and constructive. Score generously but fairly.
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: "meta-llama/llama-3.3-70b-instruct",
      messages: [
        { role: "system", content: systemPrompt }
      ],
    });

    const text = completion.choices[0].message.content;
    console.log("-----------------------------------------");
    console.log("🤖 RAW EVALUATION RESPONSE:");
    console.log(text);
    console.log("-----------------------------------------");

    if (!text || text.trim() === '') {
      throw new Error("AI returned an empty response for evaluation");
    }

    // Extract JSON
    let jsonString = text;
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');

    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      jsonString = text.substring(firstBrace, lastBrace + 1);
    } else {
      jsonString = text
        .replace(/```(?:json)?/g, "")
        .replace(/```/g, "")
        .trim();
    }

    /**
     * Attempts to fix common JSON errors from small LLMs
     */
    const fixMalformedJson = (str) => {
      let fixed = str
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .replace(/\/\/.*$/gm, "")
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/[\u201C\u201D\u2018\u2019]/g, '"')
        .replace(/([{,]\s*)(['"]?)([a-zA-Z0-9_]+)\2\s*:/g, '$1"$3":')
        .replace(/(?<!\\)"(?=[^,\]}]*"\s*[,\]}])/g, '')
        .replace(/,\s*([\]}])/g, '$1')
        .replace(/:\s*'([^']*)'/g, ':"$1"');

      return fixed;
    };

    let evaluationResult;
    try {
      evaluationResult = JSON.parse(jsonString);
    } catch (parseError) {
      console.error("❌ Initial Evaluation JSON Parsing failed. Attempting cleanup...");
      try {
        const fixedJson = fixMalformedJson(jsonString);
        evaluationResult = JSON.parse(fixedJson);
      } catch (e) {
        console.error("❌ Final Evaluation JSON Parsing failed completely.");
        throw new Error(`Failed to parse AI evaluation response: ${e.message}`);
      }
    }

    // Ensure all questions are included in the result (even unanswered ones)
    const completeEvaluatedQuestions = questions.map((originalQuestion, idx) => {
      const evaluatedQuestion = evaluationResult.evaluatedQuestions?.find(q =>
        q.question === originalQuestion.question || q.index === idx
      );

      if (evaluatedQuestion) {
        return {
          ...originalQuestion,
          ...evaluatedQuestion
        };
      }

      // If the question wasn't evaluated (possibly because it had no answer), return original with defaults
      return {
        ...originalQuestion,
        score: 0,
        feedback: "No answer provided.",
        technicalAccuracy: 0,
        communication: 0
      };
    });

    return {
      evaluatedQuestions: completeEvaluatedQuestions,
      overallScore: evaluationResult.overallScore ?? 50,
      technicalScore: evaluationResult.technicalScore ?? Math.round((evaluationResult.overallScore || 50) * 0.9),
      communicationScore: evaluationResult.communicationScore ?? Math.round((evaluationResult.overallScore || 50) * 0.85),
      confidenceScore: evaluationResult.confidenceScore ?? Math.round((evaluationResult.overallScore || 50) * 0.8),
      problemSolvingScore: evaluationResult.problemSolvingScore ?? Math.round((evaluationResult.overallScore || 50) * 0.85),
      strengths: evaluationResult.strengths || ["Clear explanation of concepts", "Good technical knowledge"],
      weaknesses: evaluationResult.weaknesses || ["Could provide more detailed examples", "Consider structuring answers more clearly"],
      actionPlan: evaluationResult.actionPlan || evaluationResult.improvementTips || [],
      improvementTips: evaluationResult.improvementTips || [
        "Review key technical concepts in your domain",
        "Practice structuring your answers using the STAR method",
        "Provide more specific examples in your responses"
      ]
    };
  } catch (error) {
    console.error("Error evaluating answers:", error);

    // Return fallback evaluation in case of AI failure
    const evaluatedQuestions = questions.map(q => ({
      ...q,
      score: q.userAnswer ? 5 : 0,
      feedback: q.userAnswer ? "Good attempt. Practice more detailed explanations." : "No answer provided.",
      technicalAccuracy: q.userAnswer ? 5 : 0,
      communication: q.userAnswer ? 5 : 0
    }));

    return {
      evaluatedQuestions,
      overallScore: 50,
      technicalScore: 48,
      communicationScore: 52,
      confidenceScore: 45,
      problemSolvingScore: 50,
      strengths: ["Attempted all questions"],
      weaknesses: ["Answers need more depth and detail"],
      actionPlan: [
        "Review key technical concepts in your domain",
        "Practice structuring your answers using the STAR method",
        "Explain your reasoning more clearly"
      ],
      improvementTips: [
        "Review key technical concepts in your domain",
        "Practice structuring your answers using the STAR method",
        "Explain your reasoning more clearly"
      ]
    };
  }
}
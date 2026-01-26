"use server";

import { db } from "@/lib/prisma";
import { auth } from "@/auth";
import { generateInterviewQuestions } from "@/lib/ai/generateInterviewQuestions";
import { evaluateAnswers } from "@/lib/ai/evaluateAnswers";
import { mapToInsightCategory } from "@/lib/industry-mapper";

/**
 * Creates a new assessment and generates questions using AI in one consolidated step
 */
export async function createAssessment(assessmentData) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      console.error(`❌ User not found for ID: ${userId}`);
      throw new Error("User not found in database");
    }

    console.log(`🤖 Starting assessment generation for user: ${user.id} (${assessmentData.industry})`);

    // Fetch industry insights manually to get top skills
    let topSkills = [];
    if (user.industry) {
      const insightCategory = mapToInsightCategory(user.industry);
      if (insightCategory) {
        const insights = await db.industryInsight.findUnique({
          where: { industry: insightCategory },
          select: { topSkills: true }
        });
        if (insights) topSkills = insights.topSkills;
      }
    }

    // Prepare data for AI prompt
    const userDataForAI = {
      industry: assessmentData.industry,
      domain: assessmentData.domain,
      specificTopic: assessmentData.specificTopic,
      experience: assessmentData.experience || 0,
      skills: user.skills || [],
      topSkills: topSkills,
      interviewType: assessmentData.interviewType || 'mixed'
    };


    // Generate questions using AI BEFORE creating the record
    console.log("⏱️ Calling AI for questions...");
    const questions = await generateInterviewQuestions(userDataForAI);

    if (!questions || !Array.isArray(questions)) {
      console.error("❌ questions is not an array:", questions);
      throw new Error("AI failed to generate a valid list of questions");
    }
    console.log(`✅ AI generated ${questions.length} questions`);

    // Extract unique topics from questions
    const topics = [...new Set(questions.map(q => q.type || 'technical'))];
    if (assessmentData.specificTopic) {
      topics.push(assessmentData.specificTopic);
    }


    // Create assessment with generated questions
    console.log("💾 Saving to database...");
    const assessment = await db.assessment.create({
      data: {
        userId: user.id,
        category: assessmentData.specificTopic
          ? `${assessmentData.industry} - ${assessmentData.domain} (${assessmentData.specificTopic})`
          : `${assessmentData.industry} - ${assessmentData.domain}`,

        questions: questions.map(q => ({
          type: q.type || 'technical',
          difficulty: q.difficulty || 'medium',
          question: q.question || '',
          userAnswer: q.userAnswer || '',
          score: q.score || null,
          feedback: q.feedback || '',
          options: q.options || [],
          correctAnswer: q.correctAnswer || '',
          explanation: q.explanation || ''
        })),
        interviewType: assessmentData.interviewType || 'mixed',
        difficulty: assessmentData.difficulty || 'medium',
        topicsTested: topics,
      },
    });

    console.log(`✨ Assessment created successfully: ${assessment.id}`);

    // Return a sanitized version of the assessment to avoid serialization issues
    return {
      success: true,
      assessmentId: assessment.id,
      questionsCount: assessment.questions.length
    };
  } catch (error) {
    console.error("❌ CRITICAL ERROR in createAssessment:", error);
    return { success: false, error: error.message || "An unexpected error occurred" };
  }
}

/**
 * Updates an assessment with generated questions
 */
export async function updateAssessmentWithQuestions(assessmentId, questions) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  try {

    // Ensure the questions array is properly formatted as JSON
    const validatedQuestions = questions.map(q => ({
      type: q.type || '',
      difficulty: q.difficulty || 'medium',
      question: q.question || '',
      userAnswer: q.userAnswer || '',
      score: q.score || null,
      feedback: q.feedback || '',
      options: q.options || [],
      correctAnswer: q.correctAnswer || '',
      explanation: q.explanation || ''
    }));

    const updatedAssessment = await db.assessment.update({
      where: { id: assessmentId },
      data: { questions: validatedQuestions },
    });

    return { success: true, assessmentId: updatedAssessment.id };
  } catch (error) {
    console.error("Error updating assessment with questions:", error);
    throw error;
  }
}

/**
 * Updates a specific question's user answer in an assessment (client-side only)
 * Actual database update happens when user submits all answers
 */
export async function updateQuestionAnswerLocally(assessmentId, questionIndex, userAnswer) {
  // This function only validates and prepares data for bulk update
  // Database update happens during submission
  return { success: true, assessmentId, questionIndex, userAnswer };
}

/**
 * Generates interview questions using AI and updates the assessment
 */
export async function generateAndStoreQuestions(assessmentId) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  try {

    // Get the assessment to get category information
    const assessment = await db.assessment.findUnique({
      where: { id: assessmentId },
      include: {
        user: true
      }
    });

    if (!assessment) {
      throw new Error("Assessment not found");
    }

    // Fetch industry insights manually
    let topSkills = [];
    if (assessment.user.industry) {
      const insightCategory = mapToInsightCategory(assessment.user.industry);
      if (insightCategory) {
        const insights = await db.industryInsight.findUnique({
          where: { industry: insightCategory },
          select: { topSkills: true }
        });
        if (insights) topSkills = insights.topSkills;
      }
    }

    // Prepare data for AI prompt
    const userData = {
      industry: assessment.user.industry,
      domain: assessment.category.split(' - ')[1] || '',
      experience: assessment.user.experience || 0,
      skills: assessment.user.skills || [],
      topSkills: topSkills,
      interviewType: assessment.interviewType || 'mixed'
    };

    // Generate questions using AI
    const questions = await generateInterviewQuestions(userData);

    // Extract unique topics from questions
    const topics = [...new Set(questions.map(q => q.type))];

    // Update assessment with generated questions and topics
    await updateAssessmentWithQuestions(assessmentId, questions);
    await db.assessment.update({
      where: { id: assessmentId },
      data: { topicsTested: topics }
    });

    return { success: true, questions };
  } catch (error) {
    console.error("Error generating and storing questions:", error);
    throw error;
  }
}

/**
 * Evaluates all answers in an assessment and updates scores
 */
export async function evaluateAssessment(assessmentId) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  try {

    const assessment = await db.assessment.findUnique({
      where: { id: assessmentId },
    });

    if (!assessment || !assessment.questions || assessment.questions.length === 0) {
      throw new Error("Assessment has no questions to evaluate");
    }

    // Check if all questions have user answers
    const hasUnansweredQuestions = assessment.questions.some(q => !q.userAnswer || q.userAnswer.trim() === '');
    if (hasUnansweredQuestions) {
      throw new Error("Cannot evaluate assessment with unanswered questions");
    }

    let evaluationResult;
    try {
      // Use AI evaluation for personalized feedback
      console.log("🤖 Using AI to evaluate answers...");
      evaluationResult = await evaluateAnswers(assessment.questions);

      // Overwrite scores based on correct/incorrect match for MCQs to ensure accuracy
      // This is crucial for MCQs - we don't want AI hallucinating scores
      evaluationResult.evaluatedQuestions = evaluationResult.evaluatedQuestions.map(q => {
        // If the question has a definitive correct answer, use it for scoring
        if (q.correctAnswer) {
          const isCorrect = q.userAnswer === q.correctAnswer;
          return {
            ...q,
            score: isCorrect ? 10 : 0,
            // Keep AI feedback but prepend correctness
            feedback: isCorrect
              ? "Correct! " + q.feedback
              : `Incorrect. The correct answer is: ${q.correctAnswer}. ` + q.feedback
          };
        }
        return q;
      });

      // Recalculate overall score based on deterministic scores
      const totalScore = evaluationResult.evaluatedQuestions.reduce((sum, q) => sum + (q.score || 0), 0);
      const maxPossibleScore = evaluationResult.evaluatedQuestions.length * 10;
      evaluationResult.overallScore = (totalScore / maxPossibleScore) * 100;

    } catch (aiError) {
      console.error("AI evaluation failed, using fallback:", aiError);
      // Fallback to simple evaluation matching
      const evaluatedQuestions = assessment.questions.map(q => {
        const isCorrect = q.correctAnswer ? q.userAnswer === q.correctAnswer : false; // Default to false if no correct answer stored
        return {
          ...q,
          score: isCorrect ? 10 : 0,
          feedback: isCorrect
            ? "Correct!"
            : `Incorrect. The correct answer is: ${q.correctAnswer}. ${q.explanation || ''}`,
          technicalAccuracy: isCorrect ? 10 : 0,
          communication: isCorrect ? 10 : 0
        };
      });

      const totalScore = evaluatedQuestions.reduce((sum, q) => sum + q.score, 0);
      const maxScore = evaluatedQuestions.length * 10;

      evaluationResult = {
        evaluatedQuestions,
        overallScore: (totalScore / maxScore) * 100,
        improvementTips: [
          "Review your answers and continue practicing to improve your performance.",
          "Focus on areas where you had difficulty.",
          "Study fundamental concepts in your domain."
        ]
      };
    }

    // Format improvement tips
    const improvementTip = Array.isArray(evaluationResult.improvementTips)
      ? evaluationResult.improvementTips.join(' ')
      : evaluationResult.improvementTips || "Keep practicing to improve your skills!";

    // Ensure the questions array is properly formatted as JSON
    const validatedQuestions = evaluationResult.evaluatedQuestions.map(q => ({
      type: q.type || '',
      difficulty: q.difficulty || 'medium',
      question: q.question || '',
      userAnswer: q.userAnswer || '',
      score: q.score !== null && q.score !== undefined ? q.score : null,
      feedback: q.feedback || '',
      technicalAccuracy: q.technicalAccuracy || 0,
      communication: q.communication || 0,
      options: q.options || [],
      correctAnswer: q.correctAnswer || '',
      explanation: q.explanation || ''
    }));

    // Update assessment with AI-evaluated scores and feedback
    const updatedAssessment = await db.assessment.update({
      where: { id: assessmentId },
      data: {
        quizScore: evaluationResult.overallScore,
        questions: validatedQuestions,
        improvementTip: improvementTip,
      },
    });

    return {
      success: true,
      assessmentId: updatedAssessment.id,
      quizScore: updatedAssessment.quizScore
    };
  } catch (error) {
    console.error("Error evaluating assessment:", error);
    throw error;
  }
}

/**
 * Updates all question answers in an assessment at once
 */
export async function updateAllQuestionAnswers(assessmentId, answers) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  try {

    // Get current assessment
    const currentAssessment = await db.assessment.findUnique({
      where: { id: assessmentId },
    });

    if (!currentAssessment) {
      throw new Error("Assessment not found");
    }

    // Update all questions with the user's answers
    const updatedQuestions = [...currentAssessment.questions];

    answers.forEach(({ questionIndex, userAnswer }) => {
      if (updatedQuestions[questionIndex]) {
        updatedQuestions[questionIndex].userAnswer = userAnswer;

        // For MCQs, calculate score immediately
        if (updatedQuestions[questionIndex].correctAnswer) {
          const isCorrect = userAnswer === updatedQuestions[questionIndex].correctAnswer;
          updatedQuestions[questionIndex].score = isCorrect ? 10 : 0;
          updatedQuestions[questionIndex].feedback = isCorrect
            ? "Correct!"
            : `Incorrect. The correct answer is: ${updatedQuestions[questionIndex].correctAnswer}. ${updatedQuestions[questionIndex].explanation || ''}`;
        }
      }
    });

    // Ensure the questions array is properly formatted as JSON
    const validatedQuestions = updatedQuestions.map(q => ({
      type: q.type || '',
      difficulty: q.difficulty || 'medium',
      question: q.question || '',
      userAnswer: q.userAnswer || '',
      score: q.score || null,
      feedback: q.feedback || '',
      options: q.options || [],
      correctAnswer: q.correctAnswer || '',
      explanation: q.explanation || ''
    }));

    const updatedAssessment = await db.assessment.update({
      where: { id: assessmentId },
      data: { questions: validatedQuestions },
    });

    return { success: true, assessmentId: updatedAssessment.id };
  } catch (error) {
    console.error("Error updating question answers:", error);
    throw error;
  }
}

/**
 * Retrieves an assessment by ID
 */
export async function getAssessmentById(assessmentId) {
  try {
    const assessment = await db.assessment.findUnique({
      where: { id: assessmentId },
      include: {
        user: {
          select: {
            name: true,
            experience: true,
            skills: true,
            industry: true
          }
        }
      }
    });

    // Validate and normalize questions data if assessment exists
    if (assessment && assessment.questions) {
      const validatedQuestions = assessment.questions.map(q => ({
        type: q.type || '',
        difficulty: q.difficulty || 'medium',
        question: q.question || '',
        userAnswer: q.userAnswer || '',
        score: q.score || null,
        feedback: q.feedback || '',
        options: q.options || [],
        correctAnswer: q.correctAnswer || '',
        explanation: q.explanation || ''
      }));

      return {
        id: assessment.id,
        userId: assessment.userId,
        quizScore: assessment.quizScore,
        category: assessment.category,
        improvementTip: assessment.improvementTip,
        interviewType: assessment.interviewType,
        difficulty: assessment.difficulty,
        questions: validatedQuestions,
        userName: assessment.user?.name,
        userExperience: assessment.user?.experience,
        createdAt: assessment.createdAt.toISOString(),
      };
    }

    return assessment ? {
      ...assessment,
      createdAt: assessment.createdAt?.toISOString(),
      updatedAt: assessment.updatedAt?.toISOString(),
    } : null;
  } catch (error) {
    console.error("Error retrieving assessment:", error);
    throw error;
  }
}

/**
 * Retrieves all assessments for a user
 */
export async function getUserAssessments() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return [];


  try {
    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const assessments = await db.assessment.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    return assessments.map(a => ({
      ...a,
      createdAt: a.createdAt?.toISOString(),
      updatedAt: a.updatedAt?.toISOString(),
    }));
  } catch (error) {
    console.error("Error retrieving user assessments:", error);
    throw error;
  }
}

/**
 * Retrieves assessment statistics for a user
 */
export async function getUserAssessmentStats() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return { totalAssessments: 0, completedAssessments: 0, averageScore: 0 };


  try {
    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const assessments = await db.assessment.findMany({
      where: { userId: user.id },
    });

    const completedAssessments = assessments.filter(a => a.quizScore !== null);
    const avgScore = completedAssessments.length > 0
      ? completedAssessments.reduce((sum, a) => sum + (a.quizScore || 0), 0) / completedAssessments.length
      : 0;

    return {
      totalAssessments: assessments.length,
      completedAssessments: completedAssessments.length,
      averageScore: parseFloat(avgScore.toFixed(2)),
    };
  } catch (error) {
    console.error("Error retrieving user assessment stats:", error);
    throw error;
  }
}
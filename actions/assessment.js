"use server";

import { db } from "@/lib/prisma";
import { auth } from "@/auth";
import { generateInterviewQuestions } from "@/lib/ai/generateInterviewQuestions";
import { evaluateAnswers } from "@/lib/ai/evaluateAnswers";
import { mapToInsightCategory } from "@/lib/industry-mapper";

/**
 * Create an assessment for the current authenticated user and persist AI-generated interview questions.
 * @param {Object} assessmentData - Data used to generate and categorize the assessment.
 * @param {string} assessmentData.industry - User's industry for category and AI prompt.
 * @param {string} assessmentData.domain - Domain or role focus for the assessment.
 * @param {string} [assessmentData.specificTopic] - Optional specific topic to include in the category and topics tested.
 * @param {number} [assessmentData.experience] - Years of experience to inform AI question generation.
 * @param {string} [assessmentData.interviewType] - Interview style to request from the AI (e.g., "technical", "behavioral", "mixed").
 * @param {string} [assessmentData.difficulty] - Desired difficulty level for the assessment (e.g., "easy", "medium", "hard").
 * @returns {Object} Result object.
 * @returns {boolean} return.success - `true` on success, `false` on failure.
 * @returns {string} [return.assessmentId] - ID of the created assessment when successful.
 * @returns {number} [return.questionsCount] - Number of questions saved when successful.
 * @returns {string} [return.error] - Error message when `success` is `false`.
 * @throws {Error} "Unauthorized" if there is no authenticated user.
 * @throws {Error} "User not found in database" if the authenticated user cannot be loaded from the database.
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
 * Replace an assessment's stored questions with the provided list after normalizing each question's fields.
 *
 * @param {string} assessmentId - The ID of the assessment to update.
 * @param {Array<Object>} questions - Array of question objects to store. Each object may include:
 *   - {string} type
 *   - {string} difficulty
 *   - {string} question
 *   - {string} userAnswer
 *   - {number|null} score
 *   - {string} feedback
 *   - {Array<any>} options
 *   - {string} correctAnswer
 *   - {string} explanation
 * @returns {{ success: true, assessmentId: string }} Object containing a success flag and the updated assessment ID.
 * @throws {Error} If the caller is not authenticated or if the database update fails.
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
 * Prepare a local payload for updating a single question's user answer without persisting it to the database.
 * @param {string} assessmentId - The ID of the assessment to which the question belongs.
 * @param {number} questionIndex - The zero-based index of the question within the assessment's questions array.
 * @param {string} userAnswer - The user's answer for the specified question.
 * @returns {{success: boolean, assessmentId: string, questionIndex: number, userAnswer: string}} An object echoing the prepared update payload.
 */
export async function updateQuestionAnswerLocally(assessmentId, questionIndex, userAnswer) {
  // This function only validates and prepares data for bulk update
  // Database update happens during submission
  return { success: true, assessmentId, questionIndex, userAnswer };
}

/**
 * Generate AI interview questions for an existing assessment and persist them.
 * @param {string} assessmentId - ID of the assessment to update.
 * @returns {{success: boolean, questions: Array}} Object containing a `success` flag and the array of generated questions.
 * @throws {Error} If the user is unauthorized, the assessment is not found, or question generation/storage fails.
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
 * Evaluate every answer in an assessment, compute per-question scores and overall score, and persist feedback to the database.
 *
 * Attempts an AI-based evaluation with personalized feedback and deterministic MCQ scoring; falls back to a deterministic matching evaluation if the AI call fails. Requires all questions to have user answers and updates the assessment's `questions`, `quizScore`, and `improvementTip`.
 *
 * @param {string} assessmentId - The ID of the assessment to evaluate.
 * @returns {{ success: true, assessmentId: string, quizScore: number }} Result containing the updated assessment ID and computed overall score.
 * @throws {Error} If the caller is unauthorized.
 * @throws {Error} If the assessment is missing or contains no questions.
 * @throws {Error} If any question is missing a user answer.
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
 * Apply a set of user answers to an assessment's questions, compute immediate MCQ scores/feedback, and persist the updated questions.
 *
 * @param {string} assessmentId - The ID of the assessment to update.
 * @param {{questionIndex: number, userAnswer: string}[]} answers - Array of answers specifying the question index and the user's answer.
 * @returns {{success: true, assessmentId: string}} Object containing success status and the updated assessment ID.
 * @throws {Error} "Unauthorized" if the user is not authenticated.
 * @throws {Error} "Assessment not found" if no assessment exists for the given ID.
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
 * Fetches an assessment by ID and returns a sanitized assessment object with normalized questions and ISO timestamps.
 * @param {string} assessmentId - The ID of the assessment to retrieve.
 * @returns {Object|null} The assessment object or `null` if not found.
 *  The returned object includes:
 *   - id: Assessment ID.
 *   - userId: ID of the user who owns the assessment.
 *   - quizScore: Numeric score for the assessment, or `null` if not graded.
 *   - category: Category string assigned to the assessment.
 *   - improvementTip: Textual improvement tip for the user, if available.
 *   - interviewType: Type of interview for which the assessment was generated.
 *   - difficulty: Assessment difficulty.
 *   - questions: Array of sanitized question objects with:
 *       - type: Question type.
 *       - difficulty: Question difficulty.
 *       - question: Question text.
 *       - userAnswer: User's answer.
 *       - score: Numeric score for the question or `null`.
 *       - feedback: Feedback text.
 *       - options: Array of options (for MCQs).
 *       - correctAnswer: Correct answer (if present).
 *       - explanation: Explanation for the correct answer.
 *   - userName: Name of the assessment owner (if available).
 *   - userExperience: Owner's experience value (if available).
 *   - createdAt: ISO string of creation time.
 *   - updatedAt: ISO string of last update time (when returned).
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
 * Fetches all assessments belonging to the authenticated user.
 *
 * @returns {Array<Object>} An array of assessment records; each includes all stored fields with `createdAt` and `updatedAt` serialized as ISO strings. Returns an empty array when there is no authenticated user.
 * @throws {Error} If the user record cannot be found or if the database query fails.
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
 * Compute aggregated assessment statistics for the currently authenticated user.
 *
 * Returns the total number of assessments, the count of completed assessments
 * (those with a non-null `quizScore`), and the average score across completed
 * assessments rounded to two decimal places.
 *
 * @returns {{ totalAssessments: number, completedAssessments: number, averageScore: number }}
 *   An object containing:
 *   - totalAssessments: total number of assessments for the user.
 *   - completedAssessments: number of assessments with a non-null `quizScore`.
 *   - averageScore: average `quizScore` across completed assessments, rounded to two decimals (0 if none).
 *
 * @throws {Error} If the authenticated user cannot be found or a database error occurs.
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
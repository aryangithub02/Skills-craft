"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { getAssessmentById, updateQuestionAnswerLocally, updateAllQuestionAnswers, evaluateAssessment } from "@/actions/assessment";
import { useSession } from "next-auth/react";
import { Loader2, CheckCircle, Clock, ChevronLeft, ChevronRight, Play, RotateCcw } from "lucide-react";

export default function InterviewSessionPage() {
  const { assessmentId } = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const loadingSession = status === "loading";
  
  const [assessment, setAssessment] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [error, setError] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [localAnswers, setLocalAnswers] = useState({}); // Track answers locally before submitting
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Load assessment
  useEffect(() => {
    if (!loadingSession && assessmentId) {
      if (session) {
        loadAssessment();
      } else {
        // Stop loading if not signed in (middleware handles redirect usually)
        setLoading(false);
      }
    }
  }, [session, loadingSession, assessmentId]);

  const loadAssessment = async () => {
    try {
      setLoading(true);
      const data = await getAssessmentById(assessmentId);
      
      if (!data) {
        setError("Assessment not found");
        return;
      }

      if (!data.questions || data.questions.length === 0) {
        setError("No questions found for this assessment. Please restart the interview.");
        return;
      }

      setAssessment(data);
      setIsComplete(data.quizScore !== null); // If quizScore exists, assessment is complete
      
      // Start timer if not already started and not complete
      if (!startTime && data.quizScore === null) {
        setStartTime(Date.now());
      }
    } catch (err) {
      console.error("Error loading assessment:", err);
      setError(err.message || "Failed to load assessment");
    } finally {
      setLoading(false);
    }
  };

  // Timer effect
  useEffect(() => {
    if (!startTime || isComplete) return;
    
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    
    return () => clearInterval(interval);
  }, [startTime, isComplete]);

  const handleAnswerChange = (answer) => {
    if (!assessment) return;
    
    // Update local answers state
    setLocalAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: answer
    }));
    
    // Also update the assessment state for immediate UI feedback
    const updatedQuestions = [...assessment.questions];
    if (updatedQuestions[currentQuestionIndex]) {
      updatedQuestions[currentQuestionIndex] = {
        ...updatedQuestions[currentQuestionIndex],
        userAnswer: answer
      };
    }
    
    setAssessment({
      ...assessment,
      questions: updatedQuestions
    });
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < assessment.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleFinishInterview = async () => {
    setEvaluating(true);
    try {
      // First, save all answers at once
      const answersToSave = Object.entries(localAnswers).map(([questionIndex, userAnswer]) => ({
        questionIndex: parseInt(questionIndex),
        userAnswer
      }));
      
      if (answersToSave.length > 0) {
        await updateAllQuestionAnswers(assessmentId, answersToSave);
      }
      
      console.log("🤖 Evaluating your answers with AI...");
      
      // Calculate time spent
      const timeSpentInSeconds = elapsedTime;
      
      // Then evaluate the assessment (AI evaluation happens here)
      await evaluateAssessment(assessmentId);
      
      console.log("✅ Evaluation complete!");
      
      setIsComplete(true);
      // Reload assessment to show evaluation results
      loadAssessment();
    } catch (err) {
      console.error("Error finishing interview:", err);
      setError(err.message || "Failed to finish interview");
    } finally {
      setEvaluating(false);
    }
  };

  const restartInterview = () => {
    router.push("/interview/setup");
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
        <Card className="max-w-md w-full border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">Error Loading Interview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => router.back()} variant="outline">
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
         <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <p className="text-muted-foreground mb-4">Assessment not found</p>
            <Button onClick={() => router.push("/dashboard")} variant="default">
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate unanswered questions for the progress calculation if needed
  const unansweredQuestionsCount = assessment.questions.filter((q, index) => {
    const hasLocalAnswer = localAnswers.hasOwnProperty(index);
    const hasServerAnswer = q.userAnswer && q.userAnswer.trim() !== '';
    return !hasLocalAnswer && !hasServerAnswer;
  }).length;

  // If assessment is complete, show results
  if (isComplete) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 space-y-10 animate-in fade-in duration-700">
        {/* Overall Score Card */}
        <section className="text-center space-y-6">
            <div className="relative inline-block">
                <div className={`text-7xl font-bold ${
                    assessment.quizScore >= 70 ? 'text-green-500' : 
                    assessment.quizScore >= 40 ? 'text-yellow-500' : 
                    'text-red-500'
                }`}>
                    {Math.round(assessment.quizScore)}
                    <span className="text-2xl text-muted-foreground ml-1">/100</span>
                </div>
                <div className="mt-4 text-lg font-medium text-muted-foreground">
                    {assessment.quizScore >= 70 ? "Strong fundamentals, keep it up!" : 
                     assessment.quizScore >= 40 ? "Good attempt, room to grow." : 
                     "Needs focus on core concepts."}
                </div>
            </div>
        </section>


        {/* Question-wise Feedback Accordion */}
        <div className="space-y-6">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">Detailed Performance</h3>
            <div className="space-y-4">
                {assessment.questions.map((q, index) => (
                    <Card key={index} className="border-muted shadow-sm bg-card overflow-hidden hover:border-primary/20 transition-all">
                        <div className="p-6 cursor-pointer hover:bg-muted/30 transition-colors group">
                            <div className="flex justify-between items-start gap-4">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-bold text-muted-foreground">#0{index + 1}</span>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                                            q.type === 'technical' ? 'bg-primary/10 text-primary' : 'bg-green-500/10 text-green-500'
                                        }`}>
                                            {q.type}
                                        </span>
                                    </div>
                                    <h4 className="font-medium text-foreground leading-relaxed">{q.question}</h4>
                                </div>
                                <div className={`text-lg font-bold ${
                                    q.score >= 7 ? 'text-green-500' : 
                                    q.score >= 4 ? 'text-yellow-500' : 
                                    'text-red-500'
                                }`}>
                                    {q.score}/10
                                </div>
                            </div>
                            
                            <div className="mt-6 space-y-4 pt-6 border-t border-muted/50">
                                <div className="space-y-2">
                                    <p className="text-xs font-semibold text-muted-foreground uppercase">Your Answer</p>
                                    <p className="text-foreground leading-relaxed">{q.userAnswer}</p>
                                </div>
                                <div className="space-y-2 bg-muted/50 p-4 rounded-xl border border-muted/60">
                                    <p className="text-xs font-semibold text-primary uppercase flex items-center gap-2">
                                        <CheckCircle className="h-3 w-3" />
                                        AI Evaluation
                                    </p>
                                    <p className="text-muted-foreground leading-relaxed">{q.feedback}</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>

        {/* Improvement Tips */}
        {assessment.improvementTip && (
            <Card className="bg-muted/50 border-muted p-8 shadow-sm">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-6">Actionable Tips</h3>
                <ul className="space-y-4">
                    {assessment.improvementTip.split('. ').map((tip, i) => (
                        tip.trim() && (
                            <li key={i} className="flex items-start gap-3 text-muted-foreground">
                                <span className="text-primary font-bold mt-0.5">•</span>
                                <span>{tip.trim()}</span>
                            </li>
                        )
                    ))}
                </ul>
            </Card>
        )}

        {/* Final Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Button onClick={restartInterview} size="lg" className="h-14 px-10 text-lg shadow-xl shadow-primary/20">
                Practice Again
            </Button>
            <Button 
                onClick={() => router.push("/interview")} 
                variant="outline" 
                size="lg" 
                className="h-14 px-10 text-lg border-slate-200 text-slate-600 hover:bg-slate-50"
            >
                View History
            </Button>
        </div>
      </div>
    );
  }

  const currentQuestion = assessment.questions[currentQuestionIndex];
  
  // Calculate if the current question has an answer (either saved on server or typed locally)
  const currentAnswer = localAnswers[currentQuestionIndex] || currentQuestion.userAnswer || "";
  const hasAnswer = currentAnswer.trim().length > 0;

  // Active Session View
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-background">
        {/* Top Context Bar */}
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border/60 py-3">
            <div className="max-w-4xl mx-auto px-4 flex justify-between items-center text-sm font-medium text-muted-foreground">
                <div className="flex items-center gap-4">
                    <span>Question {currentQuestionIndex + 1} of {assessment.questions.length}</span>
                    <span className="w-px h-4 bg-border" />
                    <span className="capitalize text-foreground">{currentQuestion.type}</span>
                    <span className="w-px h-4 bg-border" />
                    <span className="capitalize text-muted-foreground font-normal">{currentQuestion.difficulty}</span>
                </div>
                {elapsedTime > 0 && (
                  <div className="flex items-center font-mono opacity-80 text-primary">
                     <Clock className="h-3.5 w-3.5 mr-1.5" />
                     {Math.floor(elapsedTime / 60)}:{(elapsedTime % 60).toString().padStart(2, '0')}
                  </div>
                )}
            </div>
        </div>

        <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-8 flex flex-col gap-6">
            {/* Question Card */}
            <Card className="border-muted shadow-lg bg-card overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-primary/50 to-primary w-full" />
                <CardHeader className="pb-8 pt-8 px-8">
                    <p className="text-muted-foreground text-xs font-semibold mb-3 uppercase tracking-[0.2em]">The Question</p>
                    <h2 className="text-2xl md:text-3xl font-medium leading-relaxed text-foreground">
                        {currentQuestion.question}
                    </h2>
                </CardHeader>
            </Card>

            {/* Answer Area */}
            <div className="flex-1 flex flex-col gap-4">
                <div className="flex items-center justify-between px-2">
                    <Label className="text-foreground font-medium">Select an Option</Label>
                    <span className="text-xs text-muted-foreground italic">"Choose the best answer."</span>
                </div>
                
                <RadioGroup 
                    value={currentAnswer} 
                    onValueChange={handleAnswerChange}
                    className="grid gap-4"
                >
                    {currentQuestion.options && currentQuestion.options.map((option, index) => (
                        <div key={index}>
                            <RadioGroupItem value={option} id={`option-${index}`} className="peer sr-only" />
                            <Label
                                htmlFor={`option-${index}`}
                                className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all hover:bg-muted/50 ${
                                    currentAnswer === option 
                                        ? "border-primary bg-primary/10 text-primary ring-1 ring-primary/20 shadow-md" 
                                        : "border-muted bg-card text-foreground hover:border-primary/20"
                                }`}
                            >
                                <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center flex-shrink-0 transition-colors ${
                                    currentAnswer === option 
                                        ? "border-primary bg-primary" 
                                        : "border-muted-foreground/30"
                                }`}>
                                    {currentAnswer === option && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                                </div>
                                <span className="text-base font-medium">{option}</span>
                            </Label>
                        </div>
                    ))}
                </RadioGroup>
            </div>

            {/* Footer Actions */}
            <div className="flex justify-between items-center py-6">
                <Button
                    variant="ghost"
                    onClick={goToPreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                    className="text-muted-foreground hover:text-foreground hover:bg-muted/50"
                >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                </Button>

                <div className="flex items-center gap-4">
                    {currentQuestionIndex < assessment.questions.length - 1 ? (
                        <Button 
                            onClick={goToNextQuestion} 
                            size="lg"
                            className="px-8 h-12 shadow-md hover:shadow-lg transition-all"
                            disabled={!hasAnswer}
                        >
                            Save & Next
                            <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                    ) : (
                        <Button
                            onClick={handleFinishInterview}
                            disabled={evaluating || !hasAnswer}
                            className="px-8 h-12 bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all"
                            size="lg"
                        >
                            {evaluating ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    Evaluating...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Finish Interview
                                </>
                            )}
                        </Button>
                    )}
                </div>
            </div>
        </main>
    </div>
  );
}
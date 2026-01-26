"use client";

export const runtime = "edge";

import AudioPlayer from "@/components/exam/AudioPlayer";
import QuestionCard from "@/components/exam/QuestionCard";
import QuestionNavigation from "@/components/exam/QuestionNavigation";
import Timer from "@/components/exam/Timer";
import Button from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { useAppContent, useQuestions } from "@/hooks/useRealTime";
import { saveTestResult } from "@/lib/db";
import { Answer, SkillType } from "@/types";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function TestPage() {
  const params = useParams();
  const skill = params.skill as string;
  const id = params.id as string;
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { skills, loading: contentLoading } = useAppContent();
  const { questions, loading: questionsLoading } = useQuestions(id);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

  const skillData = skills[skill as SkillType];

  useEffect(() => {
    if (questions.length > 0 && answers.length === 0) {
      setAnswers(questions.map((q) => ({ questionId: q.id, answer: "" })));
      setTimeRemaining((skillData?.duration || 40) * 60);
    }
  }, [questions, skillData, answers.length]);

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = answers.find(
    (a) => a.questionId === currentQuestion?.id,
  );

  const answeredQuestions = useMemo(() => {
    return new Set(
      answers.map((a, index) => (a.answer ? index : -1)).filter((i) => i >= 0),
    );
  }, [answers]);

  const setAnswer = (answer: string) => {
    setAnswers((prev) =>
      prev.map((a) =>
        a.questionId === currentQuestion?.id ? { ...a, answer } : a,
      ),
    );
  };

  const calculateScore = useCallback(() => {
    let score = 0;
    answers.forEach((ans) => {
      const q = questions.find((question) => question.id === ans.questionId);
      if (q && q.correctAnswer === ans.answer) {
        score++;
      }
    });
    return score;
  }, [answers, questions]);

  const handleSubmit = useCallback(async () => {
    if (!user) return;
    setIsSubmitting(true);

    const score = calculateScore();

    try {
      await saveTestResult({
        userId: user.uid,
        testId: id,
        score: score,
        totalScore: questions.length,
        answers: answers,
        level: "B2", // Should come from test data
        skill: skill as SkillType,
        testTitle: `Practice Test ${id}`,
      });

      router.push(
        `/results?skill=${skill}&score=${score}&total=${questions.length}`,
      );
    } catch (error) {
      console.error("Error submitting test:", error);
      alert("Failed to submit test. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [user, id, questions, answers, skill, router, calculateScore]);

  // Timer countdown
  useEffect(() => {
    if (!isStarted || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isStarted, timeRemaining, handleSubmit]);

  if (authLoading || contentLoading || questionsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!isStarted) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-2xl mx-auto px-4">
          <Link
            href={`/practice/${skill}`}
            className="inline-flex items-center gap-2 text-foreground/40 hover:text-foreground mb-6 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </Link>

          <div className="bg-card border border-card-border rounded-2xl p-8 text-center">
            <div
              className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${skillData?.color} flex items-center justify-center text-4xl shadow-lg mb-6`}
            >
              {skillData?.icon}
            </div>

            <h1 className="text-2xl font-bold text-foreground mb-2">
              {skillData?.name} Practice Test
            </h1>
            <p className="text-foreground/40 mb-8">Test ID: {id}</p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-foreground/5 rounded-xl p-4">
                <div className="text-2xl font-bold text-foreground">
                  {questions.length}
                </div>
                <div className="text-foreground/40 text-sm">Questions</div>
              </div>
              <div className="bg-foreground/5 rounded-xl p-4">
                <div className="text-2xl font-bold text-foreground">
                  {skillData?.duration}
                </div>
                <div className="text-foreground/40 text-sm">Minutes</div>
              </div>
              <div className="bg-foreground/5 rounded-xl p-4">
                <div className="text-2xl font-bold text-foreground">
                  {skillData?.parts.length}
                </div>
                <div className="text-foreground/40 text-sm">Parts</div>
              </div>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-8 text-left">
              <h3 className="font-medium text-amber-500 mb-2">
                ⚠️ Important Notes
              </h3>
              <ul className="text-foreground/60 text-sm space-y-1">
                <li>• The timer will start once you begin the test</li>
                <li>• Make sure you have a stable internet connection</li>
                <li>• You can navigate between questions before submitting</li>
                <li>• The test will auto-submit when time runs out</li>
              </ul>
            </div>

            <Button onClick={() => setIsStarted(true)} size="lg" fullWidth>
              Start Test
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <div className="fixed top-16 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-b border-card-border">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${skillData?.color} flex items-center justify-center text-xl shadow-lg shadow-indigo-500/10`}
            >
              {skillData?.icon}
            </div>
            <div>
              <h1 className="font-semibold text-foreground">
                {skillData?.name} Test
              </h1>
              <p className="text-sm text-foreground/40">
                Question {currentQuestionIndex + 1} of {questions.length}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Timer timeRemaining={timeRemaining} onTimeUp={handleSubmit} />
            <Button
              variant="danger"
              size="sm"
              onClick={() => setShowConfirmSubmit(true)}
            >
              Submit Test
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Question Area */}
            <div className="lg:col-span-3 space-y-6">
              {/* Audio Player for Listening */}
              {skill === "listening" && <AudioPlayer src="/audio/sample.mp3" />}

              {/* Question Card */}
              {currentQuestion && (
                <QuestionCard
                  question={currentQuestion}
                  questionNumber={currentQuestionIndex + 1}
                  totalQuestions={questions.length}
                  answer={currentAnswer}
                  onAnswer={setAnswer}
                />
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-4">
                <Button
                  variant="secondary"
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Previous
                </Button>

                <Button
                  disabled={currentQuestionIndex === questions.length - 1}
                  onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                >
                  Next
                  <svg
                    className="w-5 h-5 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-32">
                <QuestionNavigation
                  totalQuestions={questions.length}
                  currentIndex={currentQuestionIndex}
                  answeredQuestions={answeredQuestions}
                  onNavigate={setCurrentQuestionIndex}
                />

                <div className="mt-4 bg-card border border-card-border rounded-xl p-4 shadow-sm">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-foreground/40">Progress</span>
                    <span className="text-indigo-500 font-medium">
                      {answeredQuestions.size}/{questions.length}
                    </span>
                  </div>
                  <div className="h-2 bg-foreground/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${skillData?.color} transition-all duration-300`}
                      style={{
                        width: `${(answeredQuestions.size / questions.length) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-card-border rounded-2xl p-6 max-w-md mx-4 shadow-2xl">
            <h2 className="text-xl font-bold text-foreground mb-4">
              Submit Test?
            </h2>
            <p className="text-foreground/60 mb-6">
              You have answered {answeredQuestions.size} out of{" "}
              {questions.length} questions.
              {answeredQuestions.size < questions.length && (
                <span className="block mt-2 text-amber-500 font-medium">
                  Warning: {questions.length - answeredQuestions.size} questions
                  are unanswered.
                </span>
              )}
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="secondary"
                onClick={() => setShowConfirmSubmit(false)}
              >
                Go Back
              </Button>
              <Button
                variant="danger"
                loading={isSubmitting}
                onClick={handleSubmit}
              >
                Confirm Submit
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

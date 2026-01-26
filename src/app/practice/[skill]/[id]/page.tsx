"use client";

import AudioPlayer from "@/components/exam/AudioPlayer";
import QuestionCard from "@/components/exam/QuestionCard";
import QuestionNavigation from "@/components/exam/QuestionNavigation";
import Timer from "@/components/exam/Timer";
import Button from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { Answer, Question, SKILLS_DATA, SkillType } from "@/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useMemo, useState } from "react";

// Sample questions - in production, these would come from Firebase
const sampleQuestions: Question[] = [
  {
    id: "q1",
    testId: "l1",
    type: "mcq",
    content: "What is the main purpose of the announcement?",
    options: [
      "To inform about a schedule change",
      "To announce a new policy",
      "To introduce a new employee",
      "To remind about a deadline",
    ],
    correctAnswer: "A",
    order: 1,
    partNumber: 1,
  },
  {
    id: "q2",
    testId: "l1",
    type: "mcq",
    content: "When will the event take place?",
    options: ["Next Monday", "Next Wednesday", "This Friday", "This Saturday"],
    correctAnswer: "C",
    order: 2,
    partNumber: 1,
  },
  {
    id: "q3",
    testId: "l1",
    type: "mcq",
    content: "What does the speaker suggest listeners do?",
    options: [
      "Arrive early",
      "Bring identification",
      "Register online",
      "Contact the office",
    ],
    correctAnswer: "B",
    order: 3,
    partNumber: 1,
  },
  {
    id: "q4",
    testId: "l1",
    type: "mcq",
    content: "According to the conversation, what is the woman's concern?",
    options: [
      "The cost of the project",
      "The timeline for completion",
      "The quality of materials",
      "The availability of staff",
    ],
    correctAnswer: "B",
    order: 4,
    partNumber: 2,
  },
  {
    id: "q5",
    testId: "l1",
    type: "mcq",
    content: "What solution does the man propose?",
    options: [
      "Hiring additional workers",
      "Extending the deadline",
      "Reducing the scope",
      "Increasing the budget",
    ],
    correctAnswer: "A",
    order: 5,
    partNumber: 2,
  },
];

interface PageProps {
  params: Promise<{ skill: string; id: string }>;
}

export default function TestPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const { skill, id } = resolvedParams;
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [questions] = useState<Question[]>(sampleQuestions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

  const skillData = SKILLS_DATA[skill as SkillType];

  useEffect(() => {
    if (questions.length > 0) {
      setAnswers(questions.map((q) => ({ questionId: q.id, answer: "" })));
      setTimeRemaining(skillData?.duration * 60 || 2400);
    }
  }, [questions, skillData?.duration]);

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
  }, [isStarted, timeRemaining]);

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
        a.questionId === currentQuestion.id ? { ...a, answer } : a,
      ),
    );
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Here you would save to Firebase
    // For now, redirect to results
    setTimeout(() => {
      router.push(`/results/demo?skill=${skill}&score=80`);
    }, 1500);
  };

  if (authLoading) {
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
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
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

          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 text-center">
            <div
              className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${skillData?.color} flex items-center justify-center text-4xl shadow-lg mb-6`}
            >
              {skillData?.icon}
            </div>

            <h1 className="text-2xl font-bold text-white mb-2">
              {skillData?.name} Practice Test
            </h1>
            <p className="text-slate-400 mb-8">Test ID: {id}</p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-slate-900/50 rounded-xl p-4">
                <div className="text-2xl font-bold text-white">
                  {questions.length}
                </div>
                <div className="text-slate-400 text-sm">Questions</div>
              </div>
              <div className="bg-slate-900/50 rounded-xl p-4">
                <div className="text-2xl font-bold text-white">
                  {skillData?.duration}
                </div>
                <div className="text-slate-400 text-sm">Minutes</div>
              </div>
              <div className="bg-slate-900/50 rounded-xl p-4">
                <div className="text-2xl font-bold text-white">
                  {skillData?.parts.length}
                </div>
                <div className="text-slate-400 text-sm">Parts</div>
              </div>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-8 text-left">
              <h3 className="font-medium text-amber-400 mb-2">
                ⚠️ Important Notes
              </h3>
              <ul className="text-slate-300 text-sm space-y-1">
                <li>• The timer will start once you begin the test</li>
                <li>• Make sure you have a stable internet connection</li>
                <li>• You can navigate between questions before submitting</li>
                <li>• The test will auto-submit when time runs out</li>
              </ul>
            </div>

            <Button onClick={() => setIsStarted(true)} size="lg">
              Start Test
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Top Bar */}
      <div className="fixed top-16 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${skillData?.color} flex items-center justify-center text-xl`}
            >
              {skillData?.icon}
            </div>
            <div>
              <h1 className="font-semibold text-white">
                {skillData?.name} Test
              </h1>
              <p className="text-sm text-slate-400">
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
              <div className="flex items-center justify-between">
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

                <div className="mt-4 bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400">Progress</span>
                    <span className="text-indigo-400">
                      {answeredQuestions.size}/{questions.length}
                    </span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-md mx-4">
            <h2 className="text-xl font-bold text-white mb-4">Submit Test?</h2>
            <p className="text-slate-400 mb-4">
              You have answered {answeredQuestions.size} out of{" "}
              {questions.length} questions.
              {answeredQuestions.size < questions.length && (
                <span className="block mt-2 text-amber-400">
                  Warning: {questions.length - answeredQuestions.size} questions
                  are unanswered.
                </span>
              )}
            </p>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                fullWidth
                onClick={() => setShowConfirmSubmit(false)}
              >
                Continue Test
              </Button>
              <Button
                variant="danger"
                fullWidth
                loading={isSubmitting}
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

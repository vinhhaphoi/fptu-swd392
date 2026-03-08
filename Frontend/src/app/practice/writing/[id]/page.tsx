"use client";

import WritingEditor from "@/components/writing/WritingEditor";
import FeedbackCard from "@/components/skills/FeedbackCard";
import Button from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { saveTestResult } from "@/lib/db";
import Link from "next/link";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

// Mock prompts
const MOCK_PROMPTS: Record<string, { prompt: string; taskType: "task1" | "task2" }> = {
  "w1-t1": {
    prompt: "You saw an advertisement for a part-time job at a local library. Write a formal letter to the manager applying for this position. Include:\n- Why you are interested in the job\n- Your relevant experience and qualifications\n- When you are available to work",
    taskType: "task1",
  },
  "w2-t1": {
    prompt: "You missed your friend's birthday party. Write an email apologizing and explaining what happened. Make sure to:\n- Apologize sincerely\n- Explain the reason\n- Suggest making it up to them",
    taskType: "task1",
  },
  "w3-t1": {
    prompt: "You recently stayed at a hotel and experienced poor service. Write a formal letter of complaint to the hotel manager. Include:\n- Details of what went wrong\n- How it affected your stay\n- What you expect as compensation",
    taskType: "task1",
  },
  "w1-t2": {
    prompt: "Some people think that technology makes our lives more complicated. Others believe it makes life easier.\n\nWhat is your opinion? Give reasons for your answer and include any relevant examples from your own knowledge or experience.\n\nWrite at least 250 words.",
    taskType: "task2",
  },
  "w2-t2": {
    prompt: "Do you agree or disagree with the following statement: 'Online learning is more effective than traditional classroom learning.'\n\nUse specific reasons and examples to support your answer.\n\nWrite at least 250 words.",
    taskType: "task2",
  },
  "w3-t2": {
    prompt: "Discuss the advantages and disadvantages of renewable energy sources. Give your own opinion.\n\nUse specific reasons and examples to support your answer.\n\nWrite at least 250 words.",
    taskType: "task2",
  },
};

// Mock AI feedback generator (in production, this would call OpenAI API)
const generateAIFeedback = (
  content: string,
  wordCount: number,
  taskType: "task1" | "task2",
): {
  score: number;
  maxScore: number;
  criteria: Array<{
    name: string;
    score: number;
    maxScore: number;
    description: string;
    examples?: string[];
  }>;
  recommendations: string[];
} => {
  const minWords = taskType === "task1" ? 120 : 250;
  const wordScore = wordCount >= minWords ? 2 : wordCount >= minWords * 0.8 ? 1 : 0;
  const contentScore = Math.min(7, Math.floor(content.length / 50));
  const totalScore = Math.min(9, wordScore + contentScore);

  return {
    score: totalScore,
    maxScore: 9,
    criteria: [
      {
        name: "Task Fulfillment",
        score: Math.min(2, Math.floor(totalScore / 4)),
        maxScore: 2,
        description:
          taskType === "task1"
            ? "The letter/email addresses all parts of the task appropriately."
            : "The essay addresses the question and presents a clear position.",
        examples:
          totalScore < 5
            ? [
                "Some parts of the task were not addressed",
                "The purpose of the writing is not entirely clear",
              ]
            : undefined,
      },
      {
        name: "Organization",
        score: Math.min(2, Math.floor(totalScore / 4)),
        maxScore: 2,
        description:
          "The writing is well-organized with clear paragraphs and logical flow.",
        examples:
          totalScore < 5
            ? [
                "Paragraphs could be better structured",
                "Transitions between ideas need improvement",
              ]
            : undefined,
      },
      {
        name: "Vocabulary",
        score: Math.min(2, Math.floor(totalScore / 4)),
        maxScore: 2,
        description:
          "Uses a wide range of vocabulary appropriately and accurately.",
        examples:
          totalScore < 5
            ? [
                "Some vocabulary choices are inappropriate",
                "Repetitive use of certain words",
              ]
            : undefined,
      },
      {
        name: "Grammar",
        score: Math.min(3, Math.floor(totalScore / 3)),
        maxScore: 3,
        description:
          "Uses a wide range of grammatical structures accurately.",
        examples:
          totalScore < 5
            ? [
                "Several grammatical errors affect clarity",
                "Sentence structure could be more varied",
              ]
            : undefined,
      },
    ],
    recommendations: [
      wordCount < minWords
        ? `Aim for at least ${minWords} words. Currently: ${wordCount} words.`
        : "Good word count!",
      totalScore < 5
        ? "Try to address all parts of the task more clearly."
        : "Well-structured response!",
      "Consider using more varied vocabulary and sentence structures.",
      "Proofread your work to check for spelling and grammar errors.",
    ],
  };
};

export default function WritingExercisePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const id = params.id as string;
  const taskType = (searchParams.get("type") || "task1") as "task1" | "task2";

  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);
  const [submittedContent, setSubmittedContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const exerciseData = MOCK_PROMPTS[id] || MOCK_PROMPTS["w1-t1"];
  const timeLimit = taskType === "task1" ? 20 : 40;
  const minWords = taskType === "task1" ? 120 : 250;

  const handleSubmit = async (content: string, wordCount: number) => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    setIsSubmitting(true);
    setSubmittedContent(content);

    // Generate AI feedback
    const aiFeedback = generateAIFeedback(content, wordCount, exerciseData.taskType);
    setFeedback(aiFeedback);
    setShowFeedback(true);

    // Save result to database
    try {
      await saveTestResult({
        userId: user.uid,
        testId: id,
        score: aiFeedback.score,
        totalScore: aiFeedback.maxScore,
        answers: [
          {
            questionId: id,
            answer: content,
          },
        ],
        level: "B2",
        skill: "writing",
        testTitle: `Writing ${taskType === "task1" ? "Task 1" : "Task 2"}`,
      });
    } catch (error) {
      console.error("Error saving result:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = (content: string) => {
    // Save to localStorage
    localStorage.setItem(`writing-draft-${id}`, content);
    alert("Draft saved!");
  };

  useEffect(() => {
    // Load draft if exists
    const draft = localStorage.getItem(`writing-draft-${id}`);
    if (draft && !showFeedback) {
      if (confirm("You have a saved draft. Would you like to continue?")) {
        // Draft will be loaded in WritingEditor component
      }
    }
  }, [id, showFeedback]);

  if (showFeedback && feedback) {
    return (
      <div className="min-h-screen py-12 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/practice/writing"
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
            Back to Writing Practice
          </Link>

          <FeedbackCard
            title={`Writing ${taskType === "task1" ? "Task 1" : "Task 2"} - Feedback`}
            score={feedback.score}
            maxScore={feedback.maxScore}
            criteria={feedback.criteria}
            recommendations={feedback.recommendations}
            onBack={() => router.push("/practice/writing")}
            onRetry={() => {
              setShowFeedback(false);
              setFeedback(null);
              setSubmittedContent("");
            }}
          />

          {/* Submitted Content Preview */}
          <div className="mt-6 bg-card border border-card-border rounded-xl p-6">
            <h3 className="font-semibold text-foreground mb-4">Your Submission</h3>
            <div className="prose prose-invert max-w-none">
              <p className="text-foreground/70 whitespace-pre-wrap">{submittedContent}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/practice/writing"
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
          Back to Writing Practice
        </Link>

        <WritingEditor
          taskType={exerciseData.taskType}
          prompt={exerciseData.prompt}
          timeLimit={timeLimit}
          minWords={minWords}
          onSubmit={handleSubmit}
          onSaveDraft={handleSaveDraft}
          initialContent={localStorage.getItem(`writing-draft-${id}`) || ""}
        />
      </div>
    </div>
  );
}

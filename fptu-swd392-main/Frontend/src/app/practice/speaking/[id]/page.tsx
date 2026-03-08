"use client";

import SpeakingInterface from "@/components/speaking/SpeakingInterface";
import FeedbackCard from "@/components/skills/FeedbackCard";
import { useAuth } from "@/hooks/useAuth";
import { saveTestResult } from "@/lib/db";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

// Mock speaking prompts
const MOCK_SPEAKING_PROMPTS: Record<string, { prompt: string; timeLimit: number }> = {
  s1: {
    prompt: `Please introduce yourself and tell us about:
- Your name and where you're from
- Your educational background
- Your hobbies and interests
- What you hope to achieve in the future

You have 2 minutes to speak.`,
    timeLimit: 120,
  },
  s2: {
    prompt: `Discuss the following problem and propose solutions:

"Many students struggle with time management, especially when balancing studies, work, and personal life."

Please discuss:
- Why this is a common problem
- At least two possible solutions
- Which solution you think is most effective and why

You have 3 minutes to speak.`,
    timeLimit: 180,
  },
  s3: {
    prompt: `Express your opinion on the following topic:

"Some people believe that social media has had a negative impact on society, while others argue it has brought people closer together."

Please:
- State your position clearly
- Provide at least two reasons to support your opinion
- Give examples from your own experience or knowledge
- Address the opposing viewpoint

You have 5 minutes to speak.`,
    timeLimit: 300,
  },
};

// Mock AI evaluation (in production, this would call OpenAI API or speech recognition service)
const generateAIEvaluation = (
  audioBlob: Blob,
  duration: number,
): {
  score: number;
  maxScore: number;
  criteria: Array<{
    name: string;
    score: number;
    maxScore: number;
    description: string;
  }>;
  transcript: string;
  recommendations: string[];
} => {
  // Simulate AI evaluation
  const baseScore = Math.min(9, Math.floor(duration / 30) + Math.floor(Math.random() * 3));
  const transcript = "This is a simulated transcript. In production, this would be generated using speech-to-text API.";

  return {
    score: baseScore,
    maxScore: 9,
    criteria: [
      {
        name: "Pronunciation",
        score: Math.min(3, Math.floor(baseScore / 3)),
        maxScore: 3,
        description: "Clarity and accuracy of pronunciation",
      },
      {
        name: "Fluency",
        score: Math.min(2, Math.floor(baseScore / 4)),
        maxScore: 2,
        description: "Smoothness and natural flow of speech",
      },
      {
        name: "Grammar",
        score: Math.min(2, Math.floor(baseScore / 4)),
        maxScore: 2,
        description: "Accuracy of grammatical structures",
      },
      {
        name: "Content",
        score: Math.min(2, Math.floor(baseScore / 4)),
        maxScore: 2,
        description: "Relevance and development of ideas",
      },
    ],
    transcript,
    recommendations: [
      baseScore < 5
        ? "Practice speaking more slowly and clearly to improve pronunciation"
        : "Good pronunciation! Continue practicing to maintain consistency",
      "Try to reduce pauses and hesitations to improve fluency",
      "Work on using more complex grammatical structures",
      "Practice organizing your ideas before speaking to improve content development",
    ],
  };
};

export default function SpeakingExercisePage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const id = params.id as string;

  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const exerciseData = MOCK_SPEAKING_PROMPTS[id] || MOCK_SPEAKING_PROMPTS.s1;

  const handleSubmit = async (audioBlob: Blob, duration: number) => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    setIsSubmitting(true);

    // Generate AI evaluation
    const evaluation = generateAIEvaluation(audioBlob, duration);

    // In production, upload audioBlob to storage and get URL
    // For now, we'll just save the evaluation

    // Save result
    try {
      await saveTestResult({
        userId: user.uid,
        testId: id,
        score: evaluation.score,
        totalScore: evaluation.maxScore,
        answers: [
          {
            questionId: id,
            answer: evaluation.transcript, // Store transcript as answer
          },
        ],
        level: "B2",
        skill: "speaking",
        testTitle: "Speaking Exercise",
      });

      setResults(evaluation);
      setShowResults(true);
    } catch (error) {
      console.error("Error saving result:", error);
      alert("Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showResults && results) {
    return (
      <div className="min-h-screen py-12 bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/practice/speaking"
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
            Back to Speaking Practice
          </Link>

          <FeedbackCard
            title="Speaking Evaluation - Results"
            score={results.score}
            maxScore={results.maxScore}
            criteria={results.criteria}
            recommendations={results.recommendations}
            onBack={() => router.push("/practice/speaking")}
            onRetry={() => {
              setShowResults(false);
              setResults(null);
            }}
          />

          {/* Transcript */}
          <div className="mt-6 bg-card border border-card-border rounded-xl p-6">
            <h3 className="font-semibold text-foreground mb-4">Transcript</h3>
            <p className="text-sm text-foreground/70 whitespace-pre-wrap">
              {results.transcript}
            </p>
            <p className="text-xs text-foreground/40 mt-4 italic">
              Note: This is a simulated transcript. In production, this would be generated
              using speech-to-text technology.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/practice/speaking"
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
          Back to Speaking Practice
        </Link>

        <SpeakingInterface
          prompt={exerciseData.prompt}
          timeLimit={exerciseData.timeLimit}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}

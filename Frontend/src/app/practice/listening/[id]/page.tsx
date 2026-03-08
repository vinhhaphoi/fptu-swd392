"use client";

import ListeningInterface from "@/components/listening/ListeningInterface";
import FeedbackCard from "@/components/skills/FeedbackCard";
import { useAuth } from "@/hooks/useAuth";
import { saveTestResult } from "@/lib/db";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

// Mock listening data
const MOCK_LISTENING_DATA: Record<
  string,
  {
    audioUrl: string;
    transcript: string;
    questions: Array<{
      id: string;
      content: string;
      options: string[];
      correctAnswer: string;
      order: number;
    }>;
  }
> = {
  l1: {
    audioUrl: "/audio/sample.mp3",
    transcript: `Interviewer: Good morning! Thank you for coming in today. Can you tell me a little bit about yourself?

Candidate: Good morning! Yes, of course. My name is Sarah Johnson, and I'm currently working as a marketing assistant at a small advertising agency. I've been there for about two years now, and I'm looking for new opportunities to grow in my career.

Interviewer: That's great. What attracted you to this position?

Candidate: Well, I've always been interested in digital marketing, and this role seems to offer exactly the kind of challenges I'm looking for. I'm particularly excited about the opportunity to work on social media campaigns, which is something I've been learning about in my spare time.

Interviewer: Excellent. Can you tell me about a time when you had to work under pressure?

Candidate: Sure. Last year, we had a client who needed a complete rebranding campaign in just two weeks. It was a tight deadline, but I organized the team, set up daily check-ins, and we managed to deliver everything on time. The client was very happy with the results.`,
    questions: [
      {
        id: "q1",
        content: "What is Sarah's current job?",
        options: [
          "Marketing manager",
          "Marketing assistant",
          "Social media specialist",
          "Advertising director",
        ],
        correctAnswer: "B",
        order: 1,
      },
      {
        id: "q2",
        content: "How long has Sarah been at her current job?",
        options: ["One year", "Two years", "Three years", "Four years"],
        correctAnswer: "B",
        order: 2,
      },
      {
        id: "q3",
        content: "What aspect of the new position excites Sarah?",
        options: [
          "Higher salary",
          "Working on social media campaigns",
          "Better office location",
          "More vacation time",
        ],
        correctAnswer: "B",
        order: 3,
      },
      {
        id: "q4",
        content: "What challenge did Sarah face last year?",
        options: [
          "A difficult client",
          "A tight deadline for a rebranding campaign",
          "Team conflicts",
          "Budget constraints",
        ],
        correctAnswer: "B",
        order: 4,
      },
      {
        id: "q5",
        content: "How did Sarah handle the pressure?",
        options: [
          "She asked for help",
          "She worked overtime",
          "She organized the team and set up daily check-ins",
          "She delegated everything",
        ],
        correctAnswer: "C",
        order: 5,
      },
    ],
  },
  l2: {
    audioUrl: "/audio/sample.mp3",
    transcript: `Professor: Today we're going to discuss the concept of sustainable development. This is a topic that has gained significant importance in recent decades as we face increasing environmental challenges.

Sustainable development can be defined as development that meets the needs of the present without compromising the ability of future generations to meet their own needs. This concept was first popularized in the 1987 Brundtland Report.

There are three main pillars of sustainable development: economic growth, environmental protection, and social equity. These three elements must be balanced for true sustainability.

Economic growth is important because it provides resources for development. However, this growth must be achieved in a way that doesn't deplete natural resources or cause irreversible environmental damage.

Environmental protection involves preserving biodiversity, reducing pollution, and managing natural resources responsibly. This includes transitioning to renewable energy sources and reducing our carbon footprint.

Social equity ensures that the benefits of development are shared fairly among all members of society. This means addressing issues like poverty, inequality, and access to education and healthcare.

The challenge lies in balancing these three pillars. Often, there are trade-offs between economic growth and environmental protection, or between different social groups.`,
    questions: [
      {
        id: "q1",
        content: "When was the concept of sustainable development first popularized?",
        options: ["1977", "1987", "1997", "2007"],
        correctAnswer: "B",
        order: 1,
      },
      {
        id: "q2",
        content: "What are the three main pillars of sustainable development?",
        options: [
          "Economic growth, technology, and innovation",
          "Economic growth, environmental protection, and social equity",
          "Education, healthcare, and infrastructure",
          "Government, business, and society",
        ],
        correctAnswer: "B",
        order: 2,
      },
      {
        id: "q3",
        content: "What is the main challenge mentioned in the lecture?",
        options: [
          "Lack of funding",
          "Balancing the three pillars",
          "Technological limitations",
          "Public awareness",
        ],
        correctAnswer: "B",
        order: 3,
      },
    ],
  },
  l3: {
    audioUrl: "/audio/sample.mp3",
    transcript: `Reporter: Breaking news from the technology sector. TechCorp, one of the world's leading technology companies, has just announced a major breakthrough in quantum computing. The company claims to have developed a quantum processor that can perform calculations a thousand times faster than current supercomputers.

This development could revolutionize fields such as drug discovery, climate modeling, and artificial intelligence. However, experts warn that we're still years away from practical applications, as quantum computers require extremely cold temperatures and are highly sensitive to environmental interference.

The announcement comes at a time when governments worldwide are investing heavily in quantum research, recognizing its potential strategic importance. Some analysts suggest this could mark the beginning of a new technological arms race.

TechCorp's CEO stated that the company plans to make this technology available to research institutions within the next two years, though commercial applications may take longer. The company has invested over five billion dollars in quantum research over the past decade.

Critics argue that while this is impressive, we should focus more on addressing current technological challenges, such as cybersecurity threats and the digital divide, rather than pursuing futuristic technologies.`,
    questions: [
      {
        id: "q1",
        content: "What has TechCorp announced?",
        options: [
          "A new smartphone",
          "A breakthrough in quantum computing",
          "A new AI assistant",
          "A cloud computing service",
        ],
        correctAnswer: "B",
        order: 1,
      },
      {
        id: "q2",
        content: "What is a challenge with quantum computers?",
        options: [
          "They are too expensive",
          "They require extremely cold temperatures",
          "They are too large",
          "They consume too much energy",
        ],
        correctAnswer: "B",
        order: 2,
      },
      {
        id: "q3",
        content: "How much has TechCorp invested in quantum research?",
        options: [
          "One billion dollars",
          "Three billion dollars",
          "Five billion dollars",
          "Ten billion dollars",
        ],
        correctAnswer: "C",
        order: 3,
      },
    ],
  },
};

export default function ListeningExercisePage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const id = params.id as string;

  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const exerciseData = MOCK_LISTENING_DATA[id] || MOCK_LISTENING_DATA.l1;
  const timeLimit = exerciseData.questions.length * 90; // 90 seconds per question

  const calculateScore = (answers: Record<string, string>) => {
    let correct = 0;
    exerciseData.questions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) {
        correct++;
      }
    });
    return {
      correct,
      total: exerciseData.questions.length,
      percentage: Math.round((correct / exerciseData.questions.length) * 100),
    };
  };

  const generateFeedback = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    let level = "B1";
    if (percentage >= 80) level = "C1";
    else if (percentage >= 60) level = "B2";

    return {
      score,
      maxScore: total,
      criteria: [
        {
          name: "Main Ideas",
          score: Math.min(2, Math.floor(percentage / 50)),
          maxScore: 2,
          description: "Understanding of main ideas and key information",
        },
        {
          name: "Details",
          score: Math.min(2, Math.floor(percentage / 50)),
          maxScore: 2,
          description: "Ability to catch specific details and facts",
        },
        {
          name: "Inference",
          score: Math.min(2, Math.floor(percentage / 50)),
          maxScore: 2,
          description: "Understanding implied meanings and context",
        },
        {
          name: "Overall Score",
          score: Math.min(3, Math.floor(percentage / 33)),
          maxScore: 3,
          description: "Overall listening comprehension performance",
        },
      ],
      recommendations: [
        percentage < 60
          ? "Focus on listening for key words and main ideas rather than trying to understand every word"
          : "Good comprehension! Continue practicing with more complex audio",
        "Practice listening to different accents and speaking speeds",
        "Use the transcript feature to check your understanding after listening",
        "Try listening multiple times and focus on different aspects each time",
      ],
    };
  };

  const handleSubmit = async (answers: Record<string, string>) => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    setIsSubmitting(true);

    const scoreData = calculateScore(answers);
    const feedback = generateFeedback(scoreData.correct, scoreData.total);

    // Save result
    try {
      await saveTestResult({
        userId: user.uid,
        testId: id,
        score: scoreData.correct,
        totalScore: scoreData.total,
        answers: Object.entries(answers).map(([questionId, answer]) => ({
          questionId,
          answer,
          isCorrect: exerciseData.questions.find((q) => q.id === questionId)
            ?.correctAnswer === answer,
        })),
        level: "B2",
        skill: "listening",
        testTitle: "Listening Exercise",
      });

      setResults({
        ...feedback,
        answers,
        correctAnswers: exerciseData.questions.reduce(
          (acc, q) => ({ ...acc, [q.id]: q.correctAnswer }),
          {} as Record<string, string>,
        ),
      });
      setShowResults(true);
    } catch (error) {
      console.error("Error saving result:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showResults && results) {
    return (
      <div className="min-h-screen py-12 bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/practice/listening"
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
            Back to Listening Practice
          </Link>

          <FeedbackCard
            title="Listening Comprehension - Results"
            score={results.score}
            maxScore={results.maxScore}
            criteria={results.criteria}
            recommendations={results.recommendations}
            onBack={() => router.push("/practice/listening")}
            onRetry={() => {
              setShowResults(false);
              setResults(null);
            }}
          />

          {/* Detailed Results */}
          <div className="mt-6 bg-card border border-card-border rounded-xl p-6">
            <h3 className="font-semibold text-foreground mb-4">Question Review</h3>
            <div className="space-y-4">
              {exerciseData.questions.map((q, index) => {
                const userAnswer = results.answers[q.id];
                const isCorrect = userAnswer === q.correctAnswer;
                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-lg border ${
                      isCorrect
                        ? "border-emerald-500/30 bg-emerald-500/5"
                        : "border-red-500/30 bg-red-500/5"
                    }`}
                  >
                    <p className="font-medium text-foreground mb-2">
                      {index + 1}. {q.content}
                    </p>
                    <div className="space-y-1 text-sm">
                      <p className={isCorrect ? "text-emerald-500" : "text-red-500"}>
                        Your answer: {userAnswer} - {q.options[userAnswer.charCodeAt(0) - 65]}
                      </p>
                      {!isCorrect && (
                        <p className="text-emerald-500">
                          Correct answer: {q.correctAnswer} -{" "}
                          {q.options[q.correctAnswer.charCodeAt(0) - 65]}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Transcript */}
          <div className="mt-6 bg-card border border-card-border rounded-xl p-6">
            <h3 className="font-semibold text-foreground mb-4">Audio Transcript</h3>
            <p className="text-sm text-foreground/70 whitespace-pre-wrap">
              {exerciseData.transcript}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/practice/listening"
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
          Back to Listening Practice
        </Link>

        <ListeningInterface
          audioUrl={exerciseData.audioUrl}
          questions={exerciseData.questions}
          timeLimit={timeLimit}
          transcript={exerciseData.transcript}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}

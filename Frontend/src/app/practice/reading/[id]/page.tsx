"use client";

import ReadingInterface from "@/components/reading/ReadingInterface";
import FeedbackCard from "@/components/skills/FeedbackCard";
import { useAuth } from "@/hooks/useAuth";
import { saveTestResult } from "@/lib/db";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

// Mock reading passages and questions
const MOCK_READING_DATA: Record<
  string,
  { passage: string; questions: Array<{ id: string; content: string; options: string[]; correctAnswer: string; order: number }> }
> = {
  r1: {
    passage: `Climate change is one of the most pressing issues facing our planet today. The Earth's climate has been changing throughout history, but the current rate of change is unprecedented. Scientists have observed that global temperatures have risen by approximately 1.1 degrees Celsius since the late 19th century, primarily due to human activities.

The main cause of climate change is the increase in greenhouse gases in the atmosphere, particularly carbon dioxide (CO2). These gases trap heat from the sun, causing the Earth's temperature to rise. Human activities such as burning fossil fuels, deforestation, and industrial processes have significantly increased the concentration of these gases.

The effects of climate change are widespread and severe. Rising temperatures lead to melting ice caps, rising sea levels, and extreme weather events such as hurricanes, droughts, and floods. These changes affect ecosystems, agriculture, water resources, and human health. Many species are struggling to adapt to the rapidly changing conditions, leading to biodiversity loss.

Addressing climate change requires a global effort. Countries around the world need to reduce their greenhouse gas emissions, transition to renewable energy sources, and implement sustainable practices. Individual actions also matter - reducing energy consumption, using public transportation, and supporting environmentally friendly policies can all contribute to the solution.

While the challenge is significant, there is hope. Technological advances in renewable energy, improved energy efficiency, and growing awareness of the issue are positive signs. With concerted effort from governments, businesses, and individuals, we can mitigate the worst effects of climate change and create a more sustainable future.`,
    questions: [
      {
        id: "q1",
        content: "What is the main cause of climate change according to the passage?",
        options: [
          "Natural climate variations",
          "Increase in greenhouse gases",
          "Solar activity",
          "Ocean currents",
        ],
        correctAnswer: "B",
        order: 1,
      },
      {
        id: "q2",
        content: "By how much have global temperatures risen since the late 19th century?",
        options: ["0.5°C", "1.1°C", "2.0°C", "3.5°C"],
        correctAnswer: "B",
        order: 2,
      },
      {
        id: "q3",
        content: "Which of the following is NOT mentioned as an effect of climate change?",
        options: [
          "Rising sea levels",
          "Extreme weather events",
          "Economic recession",
          "Biodiversity loss",
        ],
        correctAnswer: "C",
        order: 3,
      },
      {
        id: "q4",
        content: "What does the passage suggest about addressing climate change?",
        options: [
          "It requires only government action",
          "It is impossible to solve",
          "It requires global effort from multiple sectors",
          "It can be solved by technology alone",
        ],
        correctAnswer: "C",
        order: 4,
      },
      {
        id: "q5",
        content: "What is the tone of the passage regarding climate change?",
        options: [
          "Completely pessimistic",
          "Neutral and informative",
          "Hopeful but realistic",
          "Dismissive",
        ],
        correctAnswer: "C",
        order: 5,
      },
    ],
  },
  r2: {
    passage: `The history of technology is a fascinating journey that spans thousands of years. From the invention of the wheel to the development of artificial intelligence, human innovation has continuously transformed the way we live, work, and interact with the world.

The earliest technological innovations were simple tools made from stone, wood, and bone. These tools helped early humans hunt, build shelters, and create art. The discovery of fire was a crucial milestone, providing warmth, protection, and a way to cook food.

The Agricultural Revolution, which began around 10,000 years ago, marked a significant turning point. Humans learned to cultivate crops and domesticate animals, leading to settled communities and the development of civilizations. This period saw innovations in irrigation, pottery, and metallurgy.

The Industrial Revolution of the 18th and 19th centuries brought about dramatic changes. Steam power, mechanization, and mass production revolutionized manufacturing and transportation. Cities grew rapidly as people moved from rural areas to work in factories.

The 20th century witnessed the rise of electricity, telecommunications, and computing. The invention of the transistor in 1947 paved the way for modern electronics. The development of the internet in the late 20th century connected the world in ways never before imagined.

Today, we are in the midst of the Digital Revolution, characterized by artificial intelligence, robotics, biotechnology, and quantum computing. These technologies are reshaping every aspect of society, from healthcare and education to entertainment and communication.

As we look to the future, technology continues to evolve at an accelerating pace. While this brings opportunities, it also presents challenges such as privacy concerns, job displacement, and ethical questions about the role of technology in our lives.`,
    questions: [
      {
        id: "q1",
        content: "What was a crucial milestone in early human technology?",
        options: [
          "The invention of the wheel",
          "The discovery of fire",
          "The development of writing",
          "The creation of tools",
        ],
        correctAnswer: "B",
        order: 1,
      },
      {
        id: "q2",
        content: "When did the Agricultural Revolution begin?",
        options: [
          "5,000 years ago",
          "10,000 years ago",
          "15,000 years ago",
          "20,000 years ago",
        ],
        correctAnswer: "B",
        order: 2,
      },
      {
        id: "q3",
        content: "What invention paved the way for modern electronics?",
        options: ["The computer", "The transistor", "The telephone", "The radio"],
        correctAnswer: "B",
        order: 3,
      },
      {
        id: "q4",
        content: "What characterizes the current Digital Revolution?",
        options: [
          "Steam power and mechanization",
          "Electricity and telecommunications",
          "Artificial intelligence and biotechnology",
          "Agriculture and domestication",
        ],
        correctAnswer: "C",
        order: 4,
      },
    ],
  },
  r3: {
    passage: `Modern education systems around the world face numerous challenges and opportunities in the 21st century. Traditional models of education, which emphasized rote memorization and standardized testing, are being questioned as educators and policymakers seek more effective approaches to learning.

One significant trend is the shift towards student-centered learning. This approach recognizes that students learn in different ways and at different paces. It emphasizes critical thinking, creativity, and problem-solving skills rather than simply memorizing facts. Project-based learning, collaborative activities, and personalized instruction are key components of this model.

Technology has also transformed education dramatically. Online learning platforms, educational apps, and digital resources have made learning more accessible and flexible. However, the digital divide remains a concern, as not all students have equal access to technology and internet connectivity.

Another important development is the focus on 21st-century skills. These include digital literacy, communication, collaboration, and global awareness. Schools are increasingly recognizing that preparing students for the future requires more than academic knowledge - it requires developing adaptable, resilient individuals who can navigate a rapidly changing world.

Assessment methods are also evolving. While standardized tests still play a role, many educators are exploring alternative forms of assessment such as portfolios, presentations, and peer evaluations. These methods provide a more comprehensive view of student learning and growth.

Despite these innovations, challenges persist. Educational inequality remains a significant issue, with disparities in resources, quality, and outcomes between different regions and socioeconomic groups. Teacher training and support are crucial for implementing new approaches effectively.

The future of education will likely involve a blend of traditional and innovative methods, with technology serving as a tool to enhance rather than replace human interaction and guidance.`,
    questions: [
      {
        id: "q1",
        content: "What does student-centered learning emphasize?",
        options: [
          "Rote memorization",
          "Standardized testing",
          "Critical thinking and creativity",
          "Traditional lectures",
        ],
        correctAnswer: "C",
        order: 1,
      },
      {
        id: "q2",
        content: "What is mentioned as a concern regarding technology in education?",
        options: [
          "Too much technology",
          "The digital divide",
          "Lack of innovation",
          "High costs",
        ],
        correctAnswer: "B",
        order: 2,
      },
      {
        id: "q3",
        content: "What are 21st-century skills according to the passage?",
        options: [
          "Reading and writing",
          "Math and science",
          "Digital literacy and communication",
          "History and geography",
        ],
        correctAnswer: "C",
        order: 3,
      },
    ],
  },
};

export default function ReadingExercisePage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const id = params.id as string;

  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const exerciseData = MOCK_READING_DATA[id] || MOCK_READING_DATA.r1;
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
          name: "Comprehension",
          score: Math.min(2, Math.floor(percentage / 50)),
          maxScore: 2,
          description: "Understanding of main ideas and details",
        },
        {
          name: "Inference",
          score: Math.min(2, Math.floor(percentage / 50)),
          maxScore: 2,
          description: "Ability to draw conclusions from the text",
        },
        {
          name: "Vocabulary",
          score: Math.min(2, Math.floor(percentage / 50)),
          maxScore: 2,
          description: "Understanding of word meanings in context",
        },
        {
          name: "Overall Score",
          score: Math.min(3, Math.floor(percentage / 33)),
          maxScore: 3,
          description: "Overall reading comprehension performance",
        },
      ],
      recommendations: [
        percentage < 60
          ? "Focus on reading the passage more carefully and understanding main ideas"
          : "Good comprehension! Continue practicing with more complex texts",
        "Try to identify key words and phrases that signal important information",
        "Practice inferring meaning from context when you encounter unfamiliar words",
        "Work on time management to ensure you have enough time for all questions",
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
        skill: "reading",
        testTitle: "Reading Exercise",
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
            href="/practice/reading"
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
            Back to Reading Practice
          </Link>

          <FeedbackCard
            title="Reading Comprehension - Results"
            score={results.score}
            maxScore={results.maxScore}
            criteria={results.criteria}
            recommendations={results.recommendations}
            onBack={() => router.push("/practice/reading")}
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
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/practice/reading"
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
          Back to Reading Practice
        </Link>

        <ReadingInterface
          passage={exerciseData.passage}
          questions={exerciseData.questions}
          timeLimit={timeLimit}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}

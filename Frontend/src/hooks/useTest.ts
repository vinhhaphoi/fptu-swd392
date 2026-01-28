"use client";

import { getQuestions, getTest, saveTestResult, updateUserProgress } from "@/lib/firestore";
import { Answer, Question, Test, TestResult } from "@/types";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "./useAuth";

interface UseTestReturn {
    test: Test | null;
    questions: Question[];
    currentQuestionIndex: number;
    answers: Answer[];
    loading: boolean;
    error: string | null;
    timeRemaining: number;
    isSubmitting: boolean;
    setCurrentQuestionIndex: (index: number) => void;
    setAnswer: (questionId: string, answer: string) => void;
    submitTest: () => Promise<string | null>;
    nextQuestion: () => void;
    prevQuestion: () => void;
}

export function useTest(testId: string): UseTestReturn {
    const { user } = useAuth();
    const [test, setTest] = useState<Test | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch test and questions
    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const [testData, questionsData] = await Promise.all([
                    getTest(testId),
                    getQuestions(testId),
                ]);

                if (!testData) {
                    setError("Test not found");
                    return;
                }

                setTest(testData);
                setQuestions(questionsData);
                setTimeRemaining(testData.duration * 60); // Convert to seconds
                setAnswers(
                    questionsData.map((q) => ({ questionId: q.id, answer: "" }))
                );
            } catch (err) {
                setError("Failed to load test");
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        if (testId) {
            fetchData();
        }
    }, [testId]);

    // Timer countdown
    useEffect(() => {
        if (timeRemaining <= 0 || loading) return;

        const timer = setInterval(() => {
            setTimeRemaining((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeRemaining, loading]);

    const setAnswer = useCallback((questionId: string, answer: string) => {
        setAnswers((prev) =>
            prev.map((a) => (a.questionId === questionId ? { ...a, answer } : a))
        );
    }, []);

    const nextQuestion = useCallback(() => {
        setCurrentQuestionIndex((prev) =>
            Math.min(prev + 1, questions.length - 1)
        );
    }, [questions.length]);

    const prevQuestion = useCallback(() => {
        setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0));
    }, []);

    const submitTest = useCallback(async () => {
        if (!user || !test) return null;

        setIsSubmitting(true);
        try {
            // Calculate score
            let correctCount = 0;
            const gradedAnswers = answers.map((answer) => {
                const question = questions.find((q) => q.id === answer.questionId);
                const isCorrect = question?.correctAnswer === answer.answer;
                if (isCorrect) correctCount++;
                return { ...answer, isCorrect };
            });

            const score = Math.round((correctCount / questions.length) * 100);

            const result: Omit<TestResult, "id" | "completedAt"> = {
                userId: user.uid,
                testId: test.id,
                testTitle: test.title,
                score: correctCount,
                totalScore: questions.length,
                answers: gradedAnswers,
                level: test.level,
                skill: test.skill,
                duration: test.duration * 60 - timeRemaining,
            };

            const resultId = await saveTestResult(result);
            await updateUserProgress(user.uid, test.skill, score);

            return resultId;
        } catch (err) {
            console.error("Failed to submit test:", err);
            setError("Failed to submit test");
            return null;
        } finally {
            setIsSubmitting(false);
        }
    }, [user, test, answers, questions, timeRemaining]);

    return {
        test,
        questions,
        currentQuestionIndex,
        answers,
        loading,
        error,
        timeRemaining,
        isSubmitting,
        setCurrentQuestionIndex,
        setAnswer,
        submitTest,
        nextQuestion,
        prevQuestion,
    };
}

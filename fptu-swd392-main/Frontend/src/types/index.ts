// User types
export interface User {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    targetLevel?: "B1" | "B2" | "C1";
    createdAt?: Date;
    lastLogin?: Date;
    longestStreak?: number;
    role?: "admin" | "moderator" | "member";
    status?: "active" | "blocked" | "restricted";
    isBlocked?: boolean;
    blockedUntil?: Date;
}

export interface AppContentItem {
    value?: string;
    label?: string;
    icon?: string;
    title?: string;
    description?: string;
}

// Test types
export interface Test {
    id: string;
    title: string;
    level: "B1" | "B2" | "C1";
    skill: SkillType;
    duration: number;
    totalQuestions: number;
    description?: string;
    createdAt?: Date;
}

export type SkillType = "listening" | "reading" | "writing" | "speaking";

export interface Question {
    id: string;
    testId: string;
    type: "mcq" | "essay" | "recording";
    content: string;
    options?: string[];
    correctAnswer?: string;
    audioUrl?: string;
    imageUrl?: string;
    order: number;
    passage?: string;
    partNumber?: number;
}

export interface TestResult {
    id: string;
    userId: string;
    testId: string;
    testTitle?: string;
    score: number;
    totalScore: number;
    answers: Answer[];
    completedAt: Date;
    level: string;
    skill: SkillType;
    duration?: number;
}

export interface Answer {
    questionId: string;
    answer: string;
    isCorrect?: boolean;
}

export interface UserProgress {
    userId: string;
    skill: SkillType;
    testsCompleted: number;
    averageScore: number;
    lastActivity: Date;
}

// Skill data configuration
export const SKILLS_DATA = {
    listening: {
        name: "Listening",
        icon: "🎧",
        color: "from-blue-500 to-cyan-500",
        duration: 40,
        questions: 35,
        description: "Practice listening comprehension with audio recordings",
        parts: [
            { name: "Part 1: Short Announcements", questions: 8 },
            { name: "Part 2: Conversations", questions: 12 },
            { name: "Part 3: Talks/Lectures", questions: 15 },
        ],
    },
    reading: {
        name: "Reading",
        icon: "📖",
        color: "from-emerald-500 to-green-500",
        duration: 60,
        questions: 40,
        description: "Improve reading skills with diverse passages",
        parts: [
            { name: "4 Passages", questions: 40 },
        ],
    },
    writing: {
        name: "Writing",
        icon: "✍️",
        color: "from-purple-500 to-pink-500",
        duration: 60,
        questions: 2,
        description: "Practice letter/email writing and essay composition",
        parts: [
            { name: "Task 1: Letter/Email (120+ words)", questions: 1 },
            { name: "Task 2: Essay (250-300 words)", questions: 1 },
        ],
    },
    speaking: {
        name: "Speaking",
        icon: "🎤",
        color: "from-orange-500 to-amber-500",
        duration: 15,
        questions: 3,
        description: "Practice speaking with recording and playback",
        parts: [
            { name: "Part 1: Social Interaction", questions: 1 },
            { name: "Part 2: Solution Discussion", questions: 1 },
            { name: "Part 3: Topic Development", questions: 1 },
        ],
    },
};

export const LEVELS = ["B1", "B2", "C1"] as const;
export type Level = typeof LEVELS[number];

"use client"

import { motion } from "framer-motion"
import { HelpCircle, Brain, FileText, Sparkles, CheckCircle, Clock, Users, Trophy } from "lucide-react"

// Basic Quiz Loader
export function QuizLoader() {
    return (
        <div className="flex flex-col items-center justify-center p-8 space-y-4">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                className="relative"
            >
                <HelpCircle className="w-12 h-12 text-purple-500" />
                <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                    className="absolute inset-0"
                >
                    <HelpCircle className="w-12 h-12 text-blue-500 opacity-30" />
                </motion.div>
            </motion.div>
            <motion.p
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                className="text-lg font-medium text-foreground"
            >
                Loading Quiz...
            </motion.p>
        </div>
    )
}

// Question Loading Skeleton
export function QuestionSkeleton() {
    return (
        <div className="space-y-6">
            {[1, 2, 3].map((i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-background border rounded-lg p-6 space-y-4"
                >
                    <div className="flex items-center justify-between">
                        <motion.div
                            animate={{ backgroundColor: ["#f3f4f6", "#e5e7eb", "#f3f4f6"] }}
                            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                            className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"
                        />
                        <motion.div
                            animate={{ backgroundColor: ["#f3f4f6", "#e5e7eb", "#f3f4f6"] }}
                            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: 0.2 }}
                            className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-8"
                        />
                    </div>
                    <motion.div
                        animate={{ backgroundColor: ["#f3f4f6", "#e5e7eb", "#f3f4f6"] }}
                        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: 0.4 }}
                        className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"
                    />
                    <div className="space-y-2">
                        {[1, 2, 3, 4].map((j) => (
                            <motion.div
                                key={j}
                                animate={{ backgroundColor: ["#f3f4f6", "#e5e7eb", "#f3f4f6"] }}
                                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: j * 0.1 }}
                                className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"
                            />
                        ))}
                    </div>
                </motion.div>
            ))}
        </div>
    )
}

// AI Generation Loader
export function AIGenerationLoader() {
    return (
        <div className="flex flex-col items-center justify-center p-8 space-y-6">
            <div className="relative">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="relative"
                >
                    <Brain className="w-16 h-16 text-blue-500" />
                </motion.div>
                <motion.div
                    animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.3, 0.8, 0.3],
                    }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    className="absolute inset-0 flex items-center justify-center"
                >
                    <Sparkles className="w-8 h-8 text-purple-500" />
                </motion.div>
            </div>

            <div className="text-center space-y-2">
                <motion.h3
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                    className="text-xl font-semibold text-foreground"
                >
                    Generating Questions with AI
                </motion.h3>
                <motion.p
                    animate={{ opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
                    className="text-muted-foreground"
                >
                    This may take a few moments...
                </motion.p>
            </div>

            {/* Progress dots */}
            <div className="flex space-x-2">
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        animate={{
                            scale: [1, 1.5, 1],
                            backgroundColor: ["#8b5cf6", "#3b82f6", "#8b5cf6"],
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Number.POSITIVE_INFINITY,
                            delay: i * 0.2,
                        }}
                        className="w-3 h-3 rounded-full bg-purple-500"
                    />
                ))}
            </div>
        </div>
    )
}

// CSV Processing Loader
export function CSVProcessingLoader() {
    return (
        <div className="flex flex-col items-center justify-center p-8 space-y-4">
            <div className="relative">
                <motion.div
                    animate={{ y: [-10, 10, -10] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                >
                    <FileText className="w-12 h-12 text-purple-500" />
                </motion.div>
                <motion.div
                    animate={{
                        scale: [0, 1, 0],
                        rotate: [0, 180, 360],
                    }}
                    transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                    className="absolute -top-2 -right-2"
                >
                    <div className="w-4 h-4 bg-blue-500 rounded-full" />
                </motion.div>
            </div>

            <motion.p
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 1.2, repeat: Number.POSITIVE_INFINITY }}
                className="text-lg font-medium text-foreground"
            >
                Processing CSV File...
            </motion.p>
        </div>
    )
}

// Quiz Submission Loader
export function QuizSubmissionLoader() {
    return (
        <div className="flex flex-col items-center justify-center p-8 space-y-4">
            <div className="relative">
                <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="border-4 border-purple-200 dark:border-purple-800 border-t-purple-500 rounded-full w-12 h-12"
                />
                <motion.div
                    animate={{
                        scale: [0.8, 1.2, 0.8],
                        opacity: [0.5, 1, 0.5],
                    }}
                    transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                    className="absolute inset-0 flex items-center justify-center"
                >
                    <CheckCircle className="w-6 h-6 text-green-500" />
                </motion.div>
            </div>

            <motion.p
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 1.3, repeat: Number.POSITIVE_INFINITY }}
                className="text-lg font-medium text-foreground"
            >
                Submitting Quiz...
            </motion.p>
        </div>
    )
}

// Quiz Timer Loader
export function QuizTimerLoader() {
    return (
        <div className="flex items-center justify-center space-x-3 p-4">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
                <Clock className="w-6 h-6 text-blue-500" />
            </motion.div>
            <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                className="text-sm font-medium text-muted-foreground"
            >
                Loading timer...
            </motion.span>
        </div>
    )
}

// Leaderboard Loader
export function LeaderboardLoader() {
    return (
        <div className="space-y-4 p-6">
            <div className="flex items-center justify-center space-x-2 mb-6">
                <motion.div
                    animate={{
                        rotate: [0, 360],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                    <Trophy className="w-8 h-8 text-yellow-500" />
                </motion.div>
                <motion.h3
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                    className="text-xl font-semibold text-foreground"
                >
                    Loading Leaderboard...
                </motion.h3>
            </div>

            {[1, 2, 3, 4, 5].map((i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center space-x-4 p-3 bg-background border rounded-lg"
                >
                    <motion.div
                        animate={{ backgroundColor: ["#f3f4f6", "#e5e7eb", "#f3f4f6"] }}
                        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: i * 0.1 }}
                        className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"
                    />
                    <div className="flex-1 space-y-2">
                        <motion.div
                            animate={{ backgroundColor: ["#f3f4f6", "#e5e7eb", "#f3f4f6"] }}
                            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: i * 0.15 }}
                            className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"
                        />
                        <motion.div
                            animate={{ backgroundColor: ["#f3f4f6", "#e5e7eb", "#f3f4f6"] }}
                            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: i * 0.2 }}
                            className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"
                        />
                    </div>
                    <motion.div
                        animate={{ backgroundColor: ["#f3f4f6", "#e5e7eb", "#f3f4f6"] }}
                        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: i * 0.25 }}
                        className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-12"
                    />
                </motion.div>
            ))}
        </div>
    )
}

// Participants Loading
export function ParticipantsLoader() {
    return (
        <div className="flex flex-col items-center justify-center p-6 space-y-4">
            <div className="relative">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 180, 360],
                    }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                    <Users className="w-12 h-12 text-blue-500" />
                </motion.div>
                <motion.div
                    animate={{
                        scale: [0, 1, 0],
                        opacity: [0, 1, 0],
                    }}
                    transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full"
                />
            </div>

            <motion.p
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 1.4, repeat: Number.POSITIVE_INFINITY }}
                className="text-lg font-medium text-foreground"
            >
                Loading Participants...
            </motion.p>
        </div>
    )
}

// Compact Inline Loader
export function InlineQuizLoader({ text = "Loading..." }: { text?: string }) {
    return (
        <div className="flex items-center space-x-2">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                className="w-4 h-4 border-2 border-purple-200 dark:border-purple-800 border-t-purple-500 rounded-full"
            />
            <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.2, repeat: Number.POSITIVE_INFINITY }}
                className="text-sm text-muted-foreground"
            >
                {text}
            </motion.span>
        </div>
    )
}

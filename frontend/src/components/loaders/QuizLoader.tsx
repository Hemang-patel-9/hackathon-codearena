'use client'

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Zap, BookOpen, Trophy, Sparkles } from 'lucide-react';

const QuizLoader = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [progress, setProgress] = useState(0);

    const loadingSteps = [
        "Preparing your quiz...",
        "Loading questions...",
        "Setting up challenges...",
        "Almost ready!"
    ];

    const icons = [Brain, BookOpen, Zap, Trophy];

    useEffect(() => {
        const stepInterval = setInterval(() => {
            setCurrentStep((prev) => (prev + 1) % loadingSteps.length);
        }, 1500);

        const progressInterval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) return 0;
                return prev + Math.random() * 15;
            });
        }, 200);

        return () => {
            clearInterval(stepInterval);
            clearInterval(progressInterval);
        };
    }, []);

    const CurrentIcon = icons[currentStep];

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-white/20 rounded-full"
                        initial={{
                            x: Math.random() * window.innerWidth,
                            y: Math.random() * window.innerHeight,
                        }}
                        animate={{
                            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
                        }}
                        transition={{
                            duration: Math.random() * 10 + 10,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    />
                ))}
            </div>

            {/* Main loader container */}
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 text-center"
            >
                {/* Logo/Brand area */}
                <motion.div
                    className="mb-8"
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                >
                    <div className="flex items-center justify-center space-x-3 mb-4">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="w-12 h-12 bg-gradient-to-r from-purple-400 to-blue-400 rounded-xl flex items-center justify-center"
                        >
                            <Brain className="w-6 h-6 text-white" />
                        </motion.div>
                        <h1 className="text-4xl font-bold text-white tracking-tight">
                            X<span className="text-purple-400">Quiz</span>
                        </h1>
                    </div>
                </motion.div>

                {/* Main loading animation */}
                <div className="relative mb-8">
                    {/* Outer ring */}
                    <motion.div
                        className="w-32 h-32 mx-auto relative"
                        initial={{ rotate: 0 }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    >
                        <div className="absolute inset-0 rounded-full border-4 border-purple-400/30"></div>
                        <div className="absolute inset-2 rounded-full border-4 border-blue-400/30"></div>
                    </motion.div>

                    {/* Center icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                            className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-2xl"
                            whileHover={{ scale: 1.1 }}
                            animate={{
                                boxShadow: [
                                    "0 0 20px rgba(147, 51, 234, 0.5)",
                                    "0 0 40px rgba(59, 130, 246, 0.5)",
                                    "0 0 20px rgba(147, 51, 234, 0.5)"
                                ]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentStep}
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    exit={{ scale: 0, rotate: 180 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <CurrentIcon className="w-8 h-8 text-white" />
                                </motion.div>
                            </AnimatePresence>
                        </motion.div>
                    </div>

                    {/* Floating sparkles */}
                    {[...Array(8)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute"
                            style={{
                                left: `${50 + 40 * Math.cos((i * 45) * Math.PI / 180)}%`,
                                top: `${50 + 40 * Math.sin((i * 45) * Math.PI / 180)}%`,
                            }}
                            animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.7, 1, 0.7],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                delay: i * 0.2,
                            }}
                        >
                            <Sparkles className="w-4 h-4 text-purple-300" />
                        </motion.div>
                    ))}
                </div>

                {/* Progress bar */}
                <div className="w-80 mx-auto mb-6">
                    <div className="bg-white/10 rounded-full h-3 overflow-hidden backdrop-blur-sm">
                        <motion.div
                            className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full relative"
                            initial={{ width: "0%" }}
                            animate={{ width: `${Math.min(progress, 100)}%` }}
                            transition={{ duration: 0.3 }}
                        >
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent"
                                animate={{ x: ["-100%", "100%"] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                            />
                        </motion.div>
                    </div>
                    <div className="text-right mt-2">
                        <span className="text-purple-300 text-sm font-medium">
                            {Math.round(Math.min(progress, 100))}%
                        </span>
                    </div>
                </div>

                {/* Loading text */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="text-white text-xl font-medium mb-4"
                    >
                        {loadingSteps[currentStep]}
                    </motion.div>
                </AnimatePresence>

                {/* Animated dots */}
                <div className="flex justify-center space-x-2">
                    {[0, 1, 2].map((dot) => (
                        <motion.div
                            key={dot}
                            className="w-2 h-2 bg-purple-400 rounded-full"
                            animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.5, 1, 0.5],
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                delay: dot * 0.2,
                            }}
                        />
                    ))}
                </div>

                {/* Fun fact or tip */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 0.6 }}
                    className="mt-8 text-purple-200 text-sm max-w-md mx-auto"
                >
                    💡 <span className="font-medium">Pro Tip:</span> Regular quizzing improves memory retention by up to 50%!
                </motion.div>
            </motion.div>

            {/* Background gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
        </div>
    );
};

export default QuizLoader;
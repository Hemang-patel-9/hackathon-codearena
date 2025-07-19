"use client"

import type React from "react"

import { useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Clock, Trophy, Star, Search, Filter, Calendar, TrendingUp, BookOpen, Play } from 'lucide-react'

// Mock data types
interface Quiz {
    id: string
    title: string
    description: string
    category: string
    duration: number
    thumbnail: string
    scheduledDate?: string
    tags: string[]
}

// Mock data
const upcomingQuizzes: Quiz[] = [
    {
        id: "1",
        title: "JavaScript Fundamentals Challenge",
        description: "Test your knowledge of JavaScript basics and ES6 features",
        category: "Programming",
        duration: 30,
        thumbnail: "",
        scheduledDate: "2024-01-20T15:00:00Z",
        tags: ["JavaScript", "ES6", "Programming"]
    },
    {
        id: "2",
        title: "World Geography Master Quiz",
        description: "Explore countries, capitals, and landmarks around the globe",
        category: "Geography",
        duration: 45,
        thumbnail: "",
        scheduledDate: "2024-01-21T18:30:00Z",
        tags: ["Geography", "Countries", "Capitals"]
    },
]

const suggestedQuizzes: Quiz[] = [
    {
        id: "3",
        title: "React Hooks Deep Dive",
        description: "Master useState, useEffect, and custom hooks",
        category: "Programming",
        duration: 25,
        thumbnail: "",
        tags: ["React", "Hooks", "Frontend"]
    },
    {
        id: "4",
        title: "Ancient History Mysteries",
        description: "Discover secrets of ancient civilizations",
        category: "History",
        duration: 20,
        thumbnail: "",
        tags: ["History", "Ancient", "Civilizations"]
    },
    {
        id: "5",
        title: "Machine Learning Basics",
        description: "Introduction to ML concepts and algorithms",
        category: "Technology",
        duration: 40,
        thumbnail: "",
        tags: ["ML", "AI", "Algorithms"]
    },
]

const trendingQuizzes: Quiz[] = [
    {
        id: "6",
        title: "Pop Culture 2024",
        description: "Latest trends, memes, and viral moments",
        category: "Entertainment",
        duration: 15,
        thumbnail: "",
        tags: ["Pop Culture", "2024", "Trends"]
    },
    {
        id: "7",
        title: "Cryptocurrency Fundamentals",
        description: "Bitcoin, Ethereum, and blockchain basics",
        category: "Finance",
        duration: 35,
        thumbnail: "",
        tags: ["Crypto", "Blockchain", "Finance"]
    },
    {
        id: "8",
        title: "Climate Change Facts",
        description: "Understanding our changing planet",
        category: "Science",
        duration: 30,
        thumbnail: "",
        tags: ["Climate", "Environment", "Science"]
    },
]

const categories = ["All", "Programming", "Science", "History", "Geography", "Entertainment", "Technology", "Finance"]

// Animated Background Component
const AnimatedBackground = () => {
    const { scrollYProgress } = useScroll()
    const y1 = useTransform(scrollYProgress, [0, 1], [0, -100])
    const y2 = useTransform(scrollYProgress, [0, 1], [0, 100])
    const rotate = useTransform(scrollYProgress, [0, 1], [0, 360])

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Main Background with CSS Variables */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:via-purple-500/20 dark:to-indigo-500/20" />

            {/* Animated Orbs */}
            <motion.div
                style={{ y: y1, rotate }}
                className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-purple-400/20 dark:from-blue-400/30 dark:to-purple-400/30 rounded-full blur-3xl"
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                    duration: 8,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                }}
            />

            <motion.div
                style={{ y: y2 }}
                className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-purple-400/15 to-blue-400/15 dark:from-purple-400/25 dark:to-blue-400/25 rounded-full blur-3xl"
                animate={{
                    scale: [1.2, 1, 1.2],
                    opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                    duration: 10,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                }}
            />

            {/* Floating Particles */}
            {[...Array(20)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-blue-400/30 dark:bg-blue-300/40 rounded-full"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                        y: [-20, 20, -20],
                        opacity: [0.2, 0.8, 0.2],
                    }}
                    transition={{
                        duration: 3 + Math.random() * 4,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: Math.random() * 2,
                    }}
                />
            ))}

            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(hsl(var(--muted))_1px,transparent_1px),linear-gradient(90deg,hsl(var(--muted))_1px,transparent_1px)] bg-[size:50px_50px] opacity-20" />
        </div>
    )
}

// Animated Section Component
const AnimatedSection = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
    return (
        <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={className}
        >
            {children}
        </motion.section>
    )
}

// Add this function before the QuizCard component
const generateQuizSVG = (title: string, category: string, index: number) => {
    const gradients = [
        "from-blue-500 to-purple-600",
        "from-purple-500 to-pink-600",
        "from-indigo-500 to-blue-600",
        "from-cyan-500 to-blue-600",
        "from-violet-500 to-purple-600",
        "from-blue-600 to-indigo-700",
    ]

    const patterns = [
        // Geometric circles
        <g key="circles">
            <circle cx="20" cy="20" r="15" fill="currentColor" opacity="0.1" />
            <circle cx="280" cy="180" r="25" fill="currentColor" opacity="0.1" />
            <circle cx="250" cy="30" r="20" fill="currentColor" opacity="0.1" />
        </g>,
        // Hexagon pattern
        <g key="hexagons">
            <polygon points="50,20 70,35 70,65 50,80 30,65 30,35" fill="currentColor" opacity="0.1" />
            <polygon points="220,120 240,135 240,165 220,180 200,165 200,135" fill="currentColor" opacity="0.1" />
        </g>,
        // Wave pattern
        <g key="waves">
            <path d="M0,100 Q75,50 150,100 T300,100 V200 H0 Z" fill="currentColor" opacity="0.1" />
        </g>,
        // Grid dots
        <g key="dots">
            {Array.from({ length: 20 }).map((_, i) => (
                <circle
                    key={i}
                    cx={30 + (i % 5) * 60}
                    cy={30 + Math.floor(i / 5) * 40}
                    r="3"
                    fill="currentColor"
                    opacity="0.15"
                />
            ))}
        </g>,
        // Abstract shapes
        <g key="abstract">
            <rect
                x="200"
                y="20"
                width="80"
                height="60"
                rx="10"
                fill="currentColor"
                opacity="0.1"
                transform="rotate(15 240 50)"
            />
            <rect
                x="20"
                y="120"
                width="60"
                height="40"
                rx="8"
                fill="currentColor"
                opacity="0.1"
                transform="rotate(-10 50 140)"
            />
        </g>,
        // Tech circuit
        <g key="circuit">
            <path
                d="M50,50 L100,50 L100,100 L150,100 M75,50 L75,25 M125,100 L125,125"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                opacity="0.2"
            />
            <circle cx="50" cy="50" r="4" fill="currentColor" opacity="0.3" />
            <circle cx="150" cy="100" r="4" fill="currentColor" opacity="0.3" />
        </g>,
    ]

    const gradient = gradients[index % gradients.length]
    const pattern = patterns[index % patterns.length]
    const firstLetter = title.charAt(0).toUpperCase()

    return (
        <div
            className={`w-full h-48 bg-gradient-to-br ${gradient} relative overflow-hidden flex items-center justify-center`}
        >
            {/* Background Pattern */}
            <svg className="absolute inset-0 w-full h-full text-white" viewBox="0 0 300 200">
                {pattern}
            </svg>

            {/* Content */}
            <div className="relative z-10 text-center text-white">
                <div className="text-4xl font-bold mb-2 bg-white/20 backdrop-blur-sm rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                    {firstLetter}
                </div>
                <div className="text-sm font-medium opacity-90 px-4">{category}</div>
            </div>

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
    )
}

export default function QuizExplorer() {
    const [userId] = useState<string | null>("user123")
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("All")

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const QuizCard = ({ quiz, showSchedule = false, index }: { quiz: Quiz; showSchedule?: boolean; index: number }) => (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: "easeOut",
            }}
            whileHover={{
                y: -8,
                transition: { duration: 0.2 },
            }}
        >
            <Card className="group bg-card/80 backdrop-blur-sm border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="relative">
                    {
                        quiz.thumbnail != "" ?
                            <motion.img
                                src={quiz.thumbnail}
                                alt={quiz.title}
                                className="w-full h-48 object-cover"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                            /> : generateQuizSVG(quiz.title, quiz.category, index)

                    }
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    <div className="absolute top-3 right-3 flex gap-2">
                    </div>
                    {showSchedule && quiz.scheduledDate && (
                        <motion.div
                            className="absolute bottom-3 left-3"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
                                <Calendar className="h-3 w-3 mr-1" />
                                {formatDate(quiz.scheduledDate)}
                            </Badge>
                        </motion.div>
                    )}
                </div>
                <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-lg line-clamp-2 truncate group-hover:text-primary transition-colors">
                            {quiz.title}
                        </CardTitle>
                    </div>
                    <CardDescription className="line-clamp-2 truncate">{quiz.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {quiz.duration}min
                        </div>
                    </div>
                    <div className="flex overflow-x-scroll gap-1 mb-4 scrollbar-hide relative fade-mask">
                        {quiz.tags.slice(0, 3).map((tag, tagIndex) => (
                            <motion.div
                                key={tag}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 + tagIndex * 0.1 }}
                            >
                                <Badge variant="outline" className="text-xs">
                                    {tag}
                                </Badge>
                            </motion.div>
                        ))}
                    </div>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all duration-300">
                            <Play className="h-4 w-4 mr-2" />
                            {showSchedule ? "Join Quiz" : "Start Quiz"}
                        </Button>
                    </motion.div>
                </CardContent>
            </Card>
        </motion.div>
    )

    return (
        <div className="min-h-screen bg-background relative">
            <AnimatedBackground />

            {/* Header */}
            <motion.header
                className="bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                                <motion.div
                                    animate={{ rotate: [0, 360] }}
                                    transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                >
                                    <BookOpen className="h-8 w-8 text-primary" />
                                </motion.div>
                                Quiz Explorer
                            </h1>
                            <p className="text-muted-foreground mt-1">Discover, learn, and challenge yourself</p>
                        </motion.div>
                        <motion.div
                            className="flex flex-col sm:flex-row gap-3 lg:w-96"
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search quizzes..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 bg-background/50 backdrop-blur-sm border-border"
                                />
                            </div>
                            <Button variant="outline" className="flex items-center gap-2 bg-background/50 backdrop-blur-sm">
                                <Filter className="h-4 w-4" />
                                Filter
                            </Button>
                        </motion.div>
                    </div>
                </div>
            </motion.header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
                {/* Categories */}
                <AnimatedSection className="mb-8">
                    <div className="flex flex-wrap gap-2">
                        {categories.map((category, index) => (
                            <motion.div
                                key={category}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button
                                    variant={selectedCategory === category ? "default" : "outline"}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`rounded-full transition-all duration-300 ${selectedCategory === category
                                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                                        : "bg-background/50 backdrop-blur-sm hover:bg-accent"
                                        }`}
                                >
                                    {category}
                                </Button>
                            </motion.div>
                        ))}
                    </div>
                </AnimatedSection>

                {/* Upcoming Quizzes */}
                {userId && (
                    <AnimatedSection className="mb-12">
                        <motion.div
                            className="flex items-center gap-3 mb-6"
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <Calendar className="h-6 w-6 text-blue-500" />
                            <h2 className="text-2xl font-bold text-foreground">Upcoming Quizzes</h2>
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                {upcomingQuizzes.length} scheduled
                            </Badge>
                        </motion.div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {upcomingQuizzes.map((quiz, index) => (
                                <QuizCard key={quiz.id} quiz={quiz} showSchedule={true} index={index} />
                            ))}
                        </div>
                    </AnimatedSection>
                )}

                {/* Suggested Quizzes */}
                <AnimatedSection className="mb-12">
                    <motion.div
                        className="flex items-center gap-3 mb-6"
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <Star className="h-6 w-6 text-yellow-500" />
                        <h2 className="text-2xl font-bold text-foreground">Suggested for You</h2>
                        <Badge
                            variant="secondary"
                            className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                        >
                            Personalized
                        </Badge>
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {suggestedQuizzes.map((quiz, index) => (
                            <QuizCard key={quiz.id} quiz={quiz} index={index} />
                        ))}
                    </div>
                </AnimatedSection>

                {/* Trending Quizzes */}
                <AnimatedSection className="mb-12">
                    <motion.div
                        className="flex items-center gap-3 mb-6"
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <TrendingUp className="h-6 w-6 text-green-500" />
                        <h2 className="text-2xl font-bold text-foreground">Trending Now</h2>
                        <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                            <Trophy className="h-3 w-3 mr-1" />
                            Hot
                        </Badge>
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {trendingQuizzes.map((quiz, index) => (
                            <QuizCard key={quiz.id} quiz={quiz} index={index} />
                        ))}
                    </div>
                </AnimatedSection>

                {/* Stats Section */}
                <AnimatedSection>
                    <motion.div
                        className="bg-card/50 backdrop-blur-md rounded-2xl p-8 border border-border/50 shadow-lg"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h3 className="text-xl font-bold text-foreground mb-6 text-center">Platform Statistics</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            {[
                                { value: "12.5K+", label: "Total Quizzes", color: "text-blue-500" },
                                { value: "250K+", label: "Active Users", color: "text-green-500" },
                                { value: "1.2M+", label: "Quizzes Taken", color: "text-purple-500" }
                            ].map((stat, index) => (
                                <motion.div
                                    key={stat.label}
                                    className="text-center"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ scale: 1.1 }}
                                >
                                    <div className={`text-3xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
                                    <div className="text-muted-foreground">{stat.label}</div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </AnimatedSection>
            </main>
        </div>
    )
}

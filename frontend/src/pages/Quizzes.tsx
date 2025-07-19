"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
    Clock,
    Users,
    Trophy,
    Star,
    Search,
    Filter,
    Calendar,
    TrendingUp,
    BookOpen,
    Play,
    Heart,
    Share2,
} from "lucide-react"

// Mock data types
interface Quiz {
    id: string
    title: string
    description: string
    category: string
    difficulty: "Easy" | "Medium" | "Hard"
    duration: number
    participants: number
    rating: number
    thumbnail: string
    scheduledDate?: string
    tags: string[]
    isLiked?: boolean
}

// Mock data
const upcomingQuizzes: Quiz[] = [
    {
        id: "1",
        title: "JavaScript Fundamentals Challenge",
        description: "Test your knowledge of JavaScript basics and ES6 features",
        category: "Programming",
        difficulty: "Medium",
        duration: 30,
        participants: 1250,
        rating: 4.8,
        thumbnail: "/placeholder.svg?height=200&width=300",
        scheduledDate: "2024-01-20T15:00:00Z",
        tags: ["JavaScript", "ES6", "Programming"],
        isLiked: false,
    },
    {
        id: "2",
        title: "World Geography Master Quiz",
        description: "Explore countries, capitals, and landmarks around the globe",
        category: "Geography",
        difficulty: "Hard",
        duration: 45,
        participants: 890,
        rating: 4.6,
        thumbnail: "/placeholder.svg?height=200&width=300",
        scheduledDate: "2024-01-21T18:30:00Z",
        tags: ["Geography", "Countries", "Capitals"],
        isLiked: true,
    },
]

const suggestedQuizzes: Quiz[] = [
    {
        id: "3",
        title: "React Hooks Deep Dive",
        description: "Master useState, useEffect, and custom hooks",
        category: "Programming",
        difficulty: "Medium",
        duration: 25,
        participants: 2100,
        rating: 4.9,
        thumbnail: "/placeholder.svg?height=200&width=300",
        tags: ["React", "Hooks", "Frontend"],
        isLiked: false,
    },
    {
        id: "4",
        title: "Ancient History Mysteries",
        description: "Discover secrets of ancient civilizations",
        category: "History",
        difficulty: "Easy",
        duration: 20,
        participants: 1680,
        rating: 4.7,
        thumbnail: "/placeholder.svg?height=200&width=300",
        tags: ["History", "Ancient", "Civilizations"],
        isLiked: true,
    },
    {
        id: "5",
        title: "Machine Learning Basics",
        description: "Introduction to ML concepts and algorithms",
        category: "Technology",
        difficulty: "Hard",
        duration: 40,
        participants: 950,
        rating: 4.5,
        thumbnail: "/placeholder.svg?height=200&width=300",
        tags: ["ML", "AI", "Algorithms"],
        isLiked: false,
    },
]

const trendingQuizzes: Quiz[] = [
    {
        id: "6",
        title: "Pop Culture 2024",
        description: "Latest trends, memes, and viral moments",
        category: "Entertainment",
        difficulty: "Easy",
        duration: 15,
        participants: 5200,
        rating: 4.8,
        thumbnail: "/placeholder.svg?height=200&width=300",
        tags: ["Pop Culture", "2024", "Trends"],
        isLiked: true,
    },
    {
        id: "7",
        title: "Cryptocurrency Fundamentals",
        description: "Bitcoin, Ethereum, and blockchain basics",
        category: "Finance",
        difficulty: "Medium",
        duration: 35,
        participants: 3400,
        rating: 4.6,
        thumbnail: "/placeholder.svg?height=200&width=300",
        tags: ["Crypto", "Blockchain", "Finance"],
        isLiked: false,
    },
    {
        id: "8",
        title: "Climate Change Facts",
        description: "Understanding our changing planet",
        category: "Science",
        difficulty: "Medium",
        duration: 30,
        participants: 2800,
        rating: 4.7,
        thumbnail: "/placeholder.svg?height=200&width=300",
        tags: ["Climate", "Environment", "Science"],
        isLiked: false,
    },
]

const categories = ["All", "Programming", "Science", "History", "Geography", "Entertainment", "Technology", "Finance"]

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

export default function QuizExplorer() {
    const [userId] = useState<string | null>("user123")
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("All")
    const [likedQuizzes, setLikedQuizzes] = useState<Set<string>>(new Set(["2", "4", "6"]))

    const toggleLike = (quizId: string) => {
        setLikedQuizzes((prev) => {
            const newSet = new Set(prev)
            if (newSet.has(quizId)) {
                newSet.delete(quizId)
            } else {
                newSet.add(quizId)
            }
            return newSet
        })
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case "Easy":
                return "bg-green-100 text-green-800 bg-green-900/30 border-green-700"
            case "Medium":
                return "bg-yellow-100 text-yellow-800 bg-yellow-900/30 border-yellow-700"
            case "Hard":
                return "bg-red-100 text-red-800 bg-red-900/30 border-red-700"
            default:
                return "bg-muted text-muted-foreground border-border"
        }
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
                    <motion.img
                        src={quiz.thumbnail || "/placeholder.svg"}
                        alt={quiz.title}
                        className="w-full h-48 object-cover"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    <div className="absolute top-3 right-3 flex gap-2">
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 bg-background/80 hover:bg-background backdrop-blur-sm"
                                onClick={() => toggleLike(quiz.id)}
                            >
                                <Heart
                                    className={`h-4 w-4 ${likedQuizzes.has(quiz.id) ? "fill-red-500 text-red-500" : "text-muted-foreground"}`}
                                />
                            </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 bg-background/80 hover:bg-background backdrop-blur-sm"
                            >
                                <Share2 className="h-4 w-4 text-muted-foreground" />
                            </Button>
                        </motion.div>
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
                        <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                            {quiz.title}
                        </CardTitle>
                        <Badge className={getDifficultyColor(quiz.difficulty)}>{quiz.difficulty}</Badge>
                    </div>
                    <CardDescription className="line-clamp-2">{quiz.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {quiz.duration}min
                        </div>
                        <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {quiz.participants.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            {quiz.rating}
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-4">
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
        <div className="min-h-screen bg-transparent relative">
            {/* Header */}
            <motion.header
                className="bg-background/20 backdrop-blur-md border-b border-border sticky top-0 z-50"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
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
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800 bg-blue-900/30 ">
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
                            className="bg-yellow-100 text-yellow-800 bg-yellow-900/30"
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
                        <Badge variant="secondary" className="bg-green-100 text-green-800 bg-green-900/30">
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
                        className="bg-background/30 backdrop-blur-md rounded-2xl p-8 border border-border/50 shadow-lg"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h3 className="text-xl font-bold text-foreground mb-6 text-center">Platform Statistics</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {[
                                { value: "12.5K+", label: "Total Quizzes", color: "text-blue-500" },
                                { value: "250K+", label: "Active Users", color: "text-green-500" },
                                { value: "1.2M+", label: "Quizzes Taken", color: "text-purple-500" },
                                { value: "50+", label: "Categories", color: "text-orange-500" },
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

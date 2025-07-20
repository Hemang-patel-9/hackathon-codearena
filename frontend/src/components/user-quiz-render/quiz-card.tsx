"use client"

import type React from "react"
import { useState } from "react"
import type { Quiz } from "@/types/quizComponent"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { motion, AnimatePresence } from "framer-motion"
import { CalendarDays, Timer, ListChecks, Clock, User, Dot, Info, Play, BookOpen } from "lucide-react"

interface QuizCardProps {
    quiz: Quiz
    onJoin?: (quizId: string) => void
}

const QuizCard: React.FC<QuizCardProps> = ({ quiz, onJoin }) => {
    const [isOpen, setIsOpen] = useState(false)

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
        })
    }

    const handleJoin = () => {
        if (onJoin && quiz._id) {
            onJoin(quiz._id)
        }
    }
    const [imageError, setImageError] = useState(false)

    const showImage = quiz.thumbnail && !imageError

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -5 }}
                className="group"
            >
                <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border border-purple-200 dark:border-purple-800 hover:border-purple-400 dark:hover:border-purple-600 transition-all duration-300">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-100/50 to-blue-100/50 dark:from-purple-900/10 dark:to-blue-900/10" />

                    {/* Status Indicator */}
                    <div className="absolute top-3 right-3 z-10">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className={cn(
                                "w-3 h-3 rounded-full",
                                quiz.status === "active"
                                    ? "bg-green-500 shadow-lg shadow-green-500/50"
                                    : "bg-blue-500 shadow-lg shadow-blue-500/50",
                            )}
                        />
                    </div>

                    <CardContent className="relative z-10 p-0">
                        {/* Quiz Image */}
                        {showImage ? (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="w-full h-48 overflow-hidden"
                        >
                            <img
                                src={`${import.meta.env.VITE_APP_API_URL}/${quiz.thumbnail}`}
                                alt={quiz.title}
                                onError={() => setImageError(true)}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                        </motion.div>
                        ) : (
                        <div className="h-48 w-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 relative overflow-hidden">
                            {/* Animated Background Pattern */}
                            <div className="absolute inset-0 opacity-20">
                                <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16 animate-pulse"></div>
                                <div className="absolute top-1/2 right-0 w-24 h-24 bg-white rounded-full translate-x-12 animate-bounce"></div>
                                <div className="absolute bottom-0 left-1/3 w-20 h-20 bg-white rounded-full translate-y-10 animate-pulse delay-300"></div>
                            </div>

                            {/* Floating Animation */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="relative">
                                    <BookOpen className="w-16 h-16 text-white/90 animate-bounce" />
                                    <div className="absolute -inset-4 bg-white/10 rounded-full animate-ping"></div>
                                </div>
                            </div>

                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        </div>
                        )}

                        <div className="p-6">
                            {/* Quiz Title */}
                            <motion.h3
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="text-xl font-bold text-foreground truncate group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors duration-300 line-clamp-2 mb-4"
                            >
                                {quiz.title}
                            </motion.h3>

                            {/* Schedule */}
                            <motion.div
                                className="flex items-center gap-2 text-sm text-muted-foreground mb-6"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                <CalendarDays className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                <span className="font-medium">{formatDate(quiz.schedule)}</span>
                            </motion.div>

                            {/* Action Buttons */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="flex gap-3"
                            >
                                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                                    <DialogTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-all duration-300 bg-transparent"
                                        >
                                            <Info className="w-4 h-4 mr-2" />
                                            Details
                                        </Button>
                                    </DialogTrigger>
                                </Dialog>

                                <Button
                                    onClick={handleJoin}
                                    disabled={!onJoin || !quiz._id}
                                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                                >
                                    <Play className="w-4 h-4 mr-2" />
                                    Start
                                </Button>
                            </motion.div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Details Modal */}
            <AnimatePresence>
                {isOpen && (
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogContent className="max-w-2xl bg-background border border-purple-200 dark:border-purple-800">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-bold text-foreground mb-4">{quiz.title}</DialogTitle>
                            </DialogHeader>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-6"
                            >
                                {/* Description */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="bg-white/50 dark:bg-black/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800"
                                >
                                    <p className="text-foreground leading-relaxed">{quiz.description || "No description available"}</p>
                                </motion.div>

                                {/* Details Grid */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                >
                                    {/* Scheduled Date */}
                                    <div className="bg-white/50 dark:bg-black/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                                                <CalendarDays className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Scheduled</p>
                                                <p className="font-semibold text-foreground">{formatDate(quiz.schedule)}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Duration */}
                                    <div className="bg-white/50 dark:bg-black/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                                                <Timer className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Duration</p>
                                                <p className="font-semibold text-foreground">{quiz.duration} minutes</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Questions */}
                                    <div className="bg-white/50 dark:bg-black/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                                                <ListChecks className="w-5 h-5 text-green-600 dark:text-green-400" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Questions</p>
                                                <p className="font-semibold text-foreground">{quiz.NoOfQuestion}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Time per Question */}
                                    <div className="bg-white/50 dark:bg-black/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-lg">
                                                <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Time / Question</p>
                                                <p className="font-semibold text-foreground">{quiz.timePerQuestion} seconds</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Creator and Status */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="flex justify-between items-center bg-white/50 dark:bg-black/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                            <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Creator</p>
                                            <p className="font-semibold text-foreground">{quiz.creator?.username || "Unknown"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Dot className={cn("w-6 h-6", quiz.status === "active" ? "text-green-500" : "text-blue-500")} />
                                        <span
                                            className={cn(
                                                "font-semibold capitalize",
                                                quiz.status === "active"
                                                    ? "text-green-600 dark:text-green-400"
                                                    : "text-blue-600 dark:text-blue-400",
                                            )}
                                        >
                                            {quiz.status}
                                        </span>
                                    </div>
                                </motion.div>

                                {/* Action Button */}
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                                    <Button
                                        onClick={handleJoin}
                                        disabled={!onJoin || !quiz._id}
                                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 py-3 text-lg font-semibold"
                                    >
                                        <Play className="w-5 h-5 mr-2" />
                                        Join Quiz Now
                                    </Button>
                                </motion.div>
                            </motion.div>
                        </DialogContent>
                    </Dialog>
                )}
            </AnimatePresence>
        </>
    )
}

export default QuizCard

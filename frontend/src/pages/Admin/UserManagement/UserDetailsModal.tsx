"use client"

import { motion, AnimatePresence } from "framer-motion"
import { XCircle, Activity, TrendingUp, Star, CheckCircle, Users, Shield, Award, Calendar } from "lucide-react"
import type { User } from "./types"

interface UserDetailsModalProps {
    user: User | null
    isOpen: boolean
    onClose: () => void
}

const UserDetailsModal = ({ user, isOpen, onClose }: UserDetailsModalProps) => {
    if (!user) return null

    const getRoleColor = (role: string) => {
        switch (role) {
            case "admin":
                return "bg-red-50 text-red-700 border border-red-200"
            case "moderator":
                return "bg-blue-50 text-blue-700 border border-blue-200"
            case "user":
                return "bg-purple-50 text-purple-700 border border-purple-200"
            default:
                return "bg-gray-50 text-gray-700 border border-gray-200"
        }
    }

    const getRoleIcon = (role: string) => {
        switch (role) {
            case "admin":
                return <Shield size={14} className="text-red-600" />
            case "moderator":
                return <Shield size={14} className="text-blue-600" />
            default:
                return <Users size={14} className="text-purple-600" />
        }
    }

    const getActivityIcon = (action: string) => {
        if (action.includes("Quiz")) return <Activity size={14} className="text-blue-500" />
        if (action.includes("Badge")) return <Award size={14} className="text-yellow-500" />
        if (action.includes("Banned")) return <XCircle size={14} className="text-red-500" />
        return <Calendar size={14} className="text-gray-500" />
    }

    const modalVariants = {
        hidden: {
            opacity: 0,
            scale: 0.8,
            y: 50,
        },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                type: "spring",
                damping: 25,
                stiffness: 300,
            },
        },
        exit: {
            opacity: 0,
            scale: 0.8,
            y: 50,
            transition: {
                duration: 0.2,
            },
        },
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 flex items-center justify-center z-50 p-4"
                    onClick={onClose}
                >
                    <motion.div
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={(e) => e.stopPropagation()}
                        className="bg-background rounded-2xl p-6 w-full max-w-5xl max-h-[90vh] overflow-y-auto scrollbar-hide shadow-2xl"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                User Details
                            </h2>
                            <motion.button
                                whileHover={{ scale: 1.1, rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={onClose}
                                className="p-2 text-foreground/40 hover:text-foreground/60 dark:hover:bg-purple-900 hover:bg-purple-200 rounded-full transition-colors"
                            >
                                <XCircle size={24} />
                            </motion.button>
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                            {/* User Info */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="space-y-6"
                            >
                                <div className="flex items-center space-x-4 p-6 bg-background dark:bg-gradient-to-tr from-purple-900/20 to-blue-900/20 dark:border-0 border border-purple-300 rounded-xl">
                                    <motion.img
                                        whileHover={{ scale: 1.1 }}
                                        src={user.avatar || "/placeholder.svg?height=80&width=80"}
                                        alt={user.username}
                                        className="w-20 h-20 rounded-full border-4 border-purple-200"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-xl font-bold text-foreground/60 truncate">{user.username}</h3>
                                        <p className="text-foreground/40 truncate">{user.email}</p>
                                        <div className="flex flex-wrap items-center gap-2 mt-3">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getRoleColor(user.role)}`}
                                            >
                                                {getRoleIcon(user.role)}
                                                <span>{user.role}</span>
                                            </span>
                                            {user.isVerified && (
                                                <span className="px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs font-medium flex items-center space-x-1">
                                                    <CheckCircle size={12} />
                                                    <span>Verified</span>
                                                </span>
                                            )}
                                            {user.isBanned && (
                                                <span className="px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded-full text-xs font-medium">
                                                    Banned
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-background dark:bg-gradient-to-tr from-purple-900/20 to-blue-900/20 dark:border-0 border border-purple-300 p-6 rounded-xl">
                                    <h4 className="font-semibold text-foreground/60 mb-3 flex items-center space-x-2">
                                        <Star className="text-purple-600" size={18} />
                                        <span>Bio</span>
                                    </h4>
                                    <p className="text-foreground/40">{user.bio || "No bio available"}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        className="bg-background dark:bg-gradient-to-tr from-purple-900/20 to-blue-900/20 dark:border-0 border border-purple-300 p-6 rounded-xl text-center"
                                    >
                                        <div className="text-3xl font-bold text-blue-600">{user.totalQuizzes}</div>
                                        <div className="text-sm text-blue-700 font-medium">Total Quizzes</div>
                                    </motion.div>
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        className="bg-background dark:bg-gradient-to-tr from-purple-900/20 to-blue-900/20 dark:border-0 border border-purple-300 p-6 rounded-xl text-center "
                                    >
                                        <div className="text-3xl font-bold text-purple-600">{user.averageScore.toFixed(1)}%</div>
                                        <div className="text-sm text-purple-700 font-medium">Average Score</div>
                                    </motion.div>
                                </div>
                            </motion.div>

                            {/* Recent Activity & Scores */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="grid md:grid-cols-2 gap-4 "
                            >
                                {/* Recent Activity */}
                                <div className="bg-background h-full dark:bg-gradient-to-tr from-purple-900/20 to-blue-900/20 dark:border-0 border border-purple-300 p-6 rounded-xl">
                                    <h4 className="font-semibold text-foreground/60 mb-4 flex items-center space-x-2">
                                        <Activity size={18} className="text-purple-600" />
                                        <span>Recent Activity</span>
                                    </h4>
                                    <div className="space-y-3 max-h-64 overflow-y-auto scrollbar-hide">
                                        {user.recentActivity.map((activity, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="flex items-start space-x-3 p-4 rounded-lg border dark:border-purple-900 border-purple-200"
                                            >
                                                <div className="p-2 bg-purple-100 rounded-full flex-shrink-0">
                                                    {getActivityIcon(activity.action)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm font-medium text-foreground/60">{activity.action}</div>
                                                    <div className="text-xs text-gray-600 mt-1 truncate">{activity.details}</div>
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        {new Date(activity.timestamp).toLocaleString()}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                {/* Recent Scores */}
                                <div className="bg-background h-full dark:bg-gradient-to-tr from-purple-900/20 to-blue-900/20 dark:border-0 border border-purple-300 p-6 rounded-xl">
                                    <h4 className="font-semibold text-foreground/60 mb-4 flex items-center space-x-2">
                                        <TrendingUp size={18} className="text-blue-600" />
                                        <span>Recent Quiz Scores</span>
                                    </h4>
                                    <div className="space-y-3">
                                        {user.recentScores.map((score, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                whileHover={{ scale: 1.02 }}
                                                className="flex items-center justify-between p-4 bg-transparent rounded-lg border dark:border-purple-900 border-purple-200"
                                            >
                                                <div className="min-w-0 flex-1">
                                                    <div className="text-sm font-medium text-foreground/60 truncate">{score.quizTitle}</div>
                                                    <div className="text-xs text-gray-600">
                                                        {new Date(score.completedAt).toLocaleDateString()}
                                                    </div>
                                                </div>
                                                <div className="text-right flex-shrink-0 ml-4">
                                                    <div className="text-lg font-bold text-purple-600">{score.score}%</div>
                                                    <div className="text-xs text-blue-600 font-medium">Rank #{score.rank}</div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default UserDetailsModal

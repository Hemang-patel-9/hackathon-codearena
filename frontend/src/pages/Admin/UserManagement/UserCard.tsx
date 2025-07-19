"use client"

import { motion } from "framer-motion"
import { Eye, Edit, Trash2, CheckCircle, XCircle, Users, Shield, Activity } from "lucide-react"
import type { User } from "@/types/user"

interface UserCardProps {
    user: User
    index: number
    onView: (user: User) => void
    onEdit: (user: User) => void
    onDelete: (user: User) => void
}

const UserCard = ({ user, index, onView, onEdit, onDelete }: UserCardProps) => {
    const getRoleColor = (role: string) => {
        switch (role) {
            case "admin":
                return "bg-red-500/40 text-red-700 dark:text-red-200"
            case "moderator":
                return "bg-blue-500/40 text-blue-700 dark:text-blue-200"
            case "user":
                return "bg-purple-500/40 text-purple-700 dark:text-purple-200"
            default:
                return "bg-gray-500/40 text-gray-700 dark:text-gray-200"
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

    const cardVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.4,
                ease: "easeOut",
            },
        },
        hover: {
            scale: 1.02,
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
            transition: {
                duration: 0.2,
            },
        },
    }

    // Calculate total quizzes and average score from recentQuizzes
    const totalQuizzes = user.recentQuizzes?.length || 0
    const averageScore = user.recentQuizzes && user.recentQuizzes.length > 0
        ? user.recentQuizzes.reduce((sum, quiz) => sum + (quiz.score?.score || 0), 0) / user.recentQuizzes.length
        : 0

    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            transition={{ delay: index * 0.1 }}
            className="dark:bg-gradient-to-tr from-purple-900/20 to-blue-900/20 dark:border-0 border border-purple-300 rounded-xl p-6 relative backdrop-blur-sm"
        >
            {/* User Avatar and Basic Info */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <motion.img
                        whileHover={{ scale: 1.1 }}
                        className="w-12 h-12 rounded-full border-2 border-purple-200"
                        src={`${import.meta.env.VITE_APP_API_URL}${user.avatar}` || "/placeholder.svg?height=48&width=48"}
                        alt={user.username}
                    />
                    <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-foreground/80 truncate">{user.username}</h3>
                        <p className="text-sm text-foreground/40 truncate">{user.email}</p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-1 flex-shrink-0">
                    <motion.button
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onView(user)}
                        className="p-2 text-blue-600 hover:bg-blue-200 dark:hover:bg-blue-900/60 rounded-lg transition-colors"
                        title="View Details"
                    >
                        <Eye size={16} />
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onEdit(user)}
                        className="p-2 text-purple-600 dark:hover:bg-purple-900/60 hover:bg-purple-200 rounded-lg transition-colors"
                        title="Edit User"
                    >
                        <Edit size={16} />
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onDelete(user)}
                        className="p-2 text-red-600 dark:hover:bg-red-900/60 hover:bg-red-200 rounded-lg transition-colors"
                        title="Delete User"
                    >
                        <Trash2 size={16} />
                    </motion.button>
                </div>
            </div>

            {/* Role and Status Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
                <span
                    className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getRoleColor(user.role)}`}
                >
                    {getRoleIcon(user.role)}
                    <span>{user.role}</span>
                </span>
                {user.isVerified ? (
                    <span className="px-3 py-1 bg-green-500/40 dark:text-green-200 text-green-800 rounded-full text-xs font-medium flex items-center space-x-1">
                        <CheckCircle size={12} />
                        <span>Verified</span>
                    </span>
                ) : (
                    <span className="px-3 py-1 bg-gray-500/40 dark:text-gray-200 text-gray-800 rounded-full text-xs font-medium flex items-center space-x-1">
                        <XCircle size={12} />
                        <span>Unverified</span>
                    </span>
                )}
                {user.isBanned && (
                    <span className="px-3 py-1 bg-red-500/40 dark:text-red-200 text-red-800 rounded-full text-xs font-medium">
                        Banned
                    </span>
                )}
            </div>

            {/* Performance Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-background border border-purple-900 rounded-lg p-3 text-center">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                        <Activity size={14} className="text-purple-500" />
                        <span className="text-lg font-bold text-purple-600">{totalQuizzes}</span>
                    </div>
                    <span className="text-xs text-gray-600">Quizzes</span>
                </div>
                <div className="bg-background border border-purple-900 rounded-lg p-3 text-center">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                        <Activity size={14} className="text-blue-500" />
                        <span className="text-lg font-bold text-blue-600">{averageScore.toFixed(1)}%</span>
                    </div>
                    <span className="text-xs text-gray-600">Avg Score</span>
                </div>
            </div>
        </motion.div>
    )
}

export default UserCard
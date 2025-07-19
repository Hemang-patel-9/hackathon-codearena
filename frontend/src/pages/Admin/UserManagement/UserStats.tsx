"use client"

import { motion } from "framer-motion"
import { Users, CheckCircle } from "lucide-react"
import type { User } from "./types"

interface UserStatsProps {
    users: User[]
}

const UserStats = ({ users }: UserStatsProps) => {
    const totalUsers = users.length
    const activeUsers = users.filter((u) => !u.isBanned).length
    const verifiedUsers = users.filter((u) => u.isVerified).length

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-background backdrop-blur-sm rounded-2xl p-6 shadow-lg border dark:border-purple-900 border-purple-200"
        >
            <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    User Management
                </h1>
                <p className="text-gray-600 mt-1">Manage and monitor user accounts</p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center space-x-2 bg-purple-900/30 px-4 py-2 rounded-full"
                >
                    <Users className="text-purple-900" size={16} />
                    <span className="text-sm font-medium text-purple-900">Total: {totalUsers}</span>
                </motion.div>
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center space-x-2 bg-blue-900/30 px-4 py-2 rounded-full"
                >
                    <CheckCircle className="text-blue-900" size={16} />
                    <span className="text-sm font-medium text-blue-900">Active: {activeUsers}</span>
                </motion.div>
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center space-x-2 bg-green-900/30 px-4 py-2 rounded-full"
                >
                    <CheckCircle className="text-green-900" size={16} />
                    <span className="text-sm font-medium text-green-900">Verified: {verifiedUsers}</span>
                </motion.div>
            </div>
        </motion.div>
    )
}

export default UserStats
"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import UserStats from "./UserStats"
import SearchFilter from "./SearchFilter"
import UserGrid from "./UserGrid"
import UserDetailsModal from "./UserDetailsModal"
import EditUserModal from "./EditUserModal"
import DeleteConfirmModal from "./DeleteConfirmModal"
import type { User } from "./types"

const UserManagement = () => {
    const [searchTerm, setSearchTerm] = useState("")
    const [filterRole, setFilterRole] = useState("all")
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [showUserModal, setShowUserModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

    const [users, setUsers] = useState<User[]>([
        {
            _id: "1",
            username: "johndoe",
            email: "john@example.com",
            role: "user",
            isVerified: true,
            isBanned: false,
            bio: "Frontend developer passionate about React and modern web technologies",
            avatar: "/placeholder.svg?height=40&width=40",
            createdAt: "2024-01-10T08:00:00Z",
            achievements: ["badge1", "badge2"],
            lastActive: "2024-01-23T15:30:00Z",
            totalQuizzes: 15,
            averageScore: 87.5,
            socialLinks: {
                github: "https://github.com/johndoe",
                linkedin: "https://linkedin.com/in/johndoe",
                twitter: "https://twitter.com/johndoe",
                website: "https://johndoe.dev",
            },
            recentActivity: [
                {
                    action: "Completed Quiz",
                    timestamp: "2024-01-23T15:30:00Z",
                    details: "JavaScript Fundamentals - Score: 95%",
                },
                { action: "Started Quiz", timestamp: "2024-01-23T14:45:00Z", details: "React Advanced Concepts" },
                { action: "Earned Badge", timestamp: "2024-01-22T10:20:00Z", details: "Perfect Score Achievement" },
            ],
            recentScores: [
                { quizTitle: "JavaScript Fundamentals", score: 95, completedAt: "2024-01-23T15:30:00Z", rank: 1 },
                { quizTitle: "CSS Grid Layout", score: 82, completedAt: "2024-01-22T11:15:00Z", rank: 3 },
                { quizTitle: "Node.js Basics", score: 89, completedAt: "2024-01-21T16:45:00Z", rank: 2 },
            ],
        },
        {
            _id: "2",
            username: "janesmith",
            email: "jane@example.com",
            role: "moderator",
            isVerified: true,
            isBanned: false,
            bio: "Full-stack developer and quiz enthusiast with 5+ years experience",
            avatar: "/placeholder.svg?height=40&width=40",
            createdAt: "2024-01-12T10:00:00Z",
            achievements: ["badge1", "badge3", "badge4"],
            lastActive: "2024-01-23T12:15:00Z",
            totalQuizzes: 23,
            averageScore: 91.2,
            socialLinks: {
                github: "https://github.com/janesmith",
                linkedin: "https://linkedin.com/in/janesmith",
                twitter: "",
                website: "https://janesmith.io",
            },
            recentActivity: [
                {
                    action: "Moderated Quiz",
                    timestamp: "2024-01-23T12:15:00Z",
                    details: "Reviewed flagged question in Python Quiz",
                },
                { action: "Completed Quiz", timestamp: "2024-01-23T09:30:00Z", details: "Advanced Algorithms - Score: 98%" },
                { action: "Updated Profile", timestamp: "2024-01-22T18:20:00Z", details: "Added new bio information" },
            ],
            recentScores: [
                { quizTitle: "Advanced Algorithms", score: 98, completedAt: "2024-01-23T09:30:00Z", rank: 1 },
                { quizTitle: "Database Design", score: 85, completedAt: "2024-01-20T14:20:00Z", rank: 2 },
                { quizTitle: "API Development", score: 92, completedAt: "2024-01-19T13:10:00Z", rank: 1 },
            ],
        },
        {
            _id: "3",
            username: "mikejohnson",
            email: "mike@example.com",
            role: "user",
            isVerified: false,
            isBanned: true,
            bio: "Learning web development and exploring new technologies",
            createdAt: "2024-01-15T14:00:00Z",
            achievements: [],
            lastActive: "2024-01-18T10:30:00Z",
            totalQuizzes: 3,
            averageScore: 45.7,
            socialLinks: {
                github: "",
                linkedin: "",
                twitter: "",
                website: "",
            },
            recentActivity: [
                { action: "Account Banned", timestamp: "2024-01-18T16:00:00Z", details: "Violation of community guidelines" },
                { action: "Failed Quiz", timestamp: "2024-01-18T10:30:00Z", details: "HTML Basics - Score: 35%" },
                { action: "Started Quiz", timestamp: "2024-01-17T15:45:00Z", details: "CSS Fundamentals" },
            ],
            recentScores: [
                { quizTitle: "HTML Basics", score: 35, completedAt: "2024-01-18T10:30:00Z", rank: 15 },
                { quizTitle: "CSS Fundamentals", score: 52, completedAt: "2024-01-17T16:20:00Z", rank: 12 },
                { quizTitle: "Web Basics", score: 50, completedAt: "2024-01-16T11:10:00Z", rank: 8 },
            ],
        },
    ])

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut",
            },
        },
    }

    const handleUpdateUser = (userId: string, updates: Partial<User>) => {
        setUsers(users.map((user) => (user._id === userId ? { ...user, ...updates } : user)))
        setSelectedUser(null)
    }

    const handleDeleteUser = (userId: string) => {
        setUsers(users.filter((user) => user._id !== userId))
        setSelectedUser(null)
    }

    const handleViewUser = (user: User) => {
        setSelectedUser(user)
        setShowUserModal(true)
    }

    const handleEditUser = (user: User) => {
        setSelectedUser(user)
        setShowEditModal(true)
    }

    const handleDeleteClick = (user: User) => {
        setSelectedUser(user)
        setShowDeleteConfirm(true)
    }

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesRole = filterRole === "all" || user.role === filterRole
        return matchesSearch && matchesRole
    })

    return (
        <div className="min-h-screen bg-background p-4 md:p-6">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-7xl mx-auto space-y-6"
            >
                <motion.div variants={itemVariants}>
                    <UserStats users={users} />
                </motion.div>

                <motion.div variants={itemVariants}>
                    <SearchFilter
                        searchTerm={searchTerm}
                        filterRole={filterRole}
                        onSearchChange={setSearchTerm}
                        onFilterChange={setFilterRole}
                    />
                </motion.div>

                <motion.div variants={itemVariants}>
                    <UserGrid
                        users={filteredUsers}
                        onView={handleViewUser}
                        onEdit={handleEditUser}
                        onDelete={handleDeleteClick}
                    />
                </motion.div>

                {/* Modals */}
                <UserDetailsModal user={selectedUser} isOpen={showUserModal} onClose={() => setShowUserModal(false)} />

                <EditUserModal
                    user={selectedUser}
                    isOpen={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    onUpdate={handleUpdateUser}
                />

                <DeleteConfirmModal
                    user={selectedUser}
                    isOpen={showDeleteConfirm}
                    onClose={() => setShowDeleteConfirm(false)}
                    onConfirm={handleDeleteUser}
                />
            </motion.div>
        </div>
    )
}

export default UserManagement

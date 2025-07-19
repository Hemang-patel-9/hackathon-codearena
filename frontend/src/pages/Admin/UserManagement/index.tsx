"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import UserStats from "./UserStats"
import SearchFilter from "./SearchFilter"
import UserGrid from "./UserGrid"
import UserDetailsModal from "./UserDetailsModal"
import EditUserModal from "./EditUserModal"
import DeleteConfirmModal from "./DeleteConfirmModal"
import { fetchAllUsersWithQuizzes, updateUser, deleteUser, getUserDetailsWithQuizzes } from "@/api/admin"
import type { User } from "./types"
import type { Result } from "@/types/response"
import { useAuth } from "@/contexts/authContext"

const UserManagement = () => {
    const [searchTerm, setSearchTerm] = useState("")
    const [filterRole, setFilterRole] = useState("all")
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [showUserModal, setShowUserModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [userData, setUserData] = useState<User[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const { token } = useAuth()

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true)
            setError(null)
            try {
                const response: Result = await fetchAllUsersWithQuizzes(token as string)
                if (response.error) {
                    throw new Error(response.message)
                }
                setUserData(response.data || [])
                console.log("Fetched users with quizzes:", response.data)
            } catch (err: any) {
                setError(err.message || "Failed to fetch users. Please try again later.")
                setUserData([])
            } finally {
                setLoading(false)
            }
        }

        if (token) {
            fetchUsers()
        }
    }, [token])

    const handleUpdateUser = async (userId: string, updates: Partial<User>) => {
        try {
            const result = await updateUser(userId, updates, token as string)
            if (result.error) {
                throw new Error(result.message)
            }
            console.log("Update user response:", result.data)
            if (result.data) {
                // Preserve recentQuizzes from existing user data
                setUserData(userData.map((user) => {
                    if (user._id === userId) {
                        return {
                            ...user,
                            ...result.data,
                            recentQuizzes: user.recentQuizzes, // Retain recentQuizzes
                        }
                    }
                    return user
                }))
            } else {
                console.warn("No user data returned from update")
                setError("Update succeeded, but no user data returned")
            }
            setSelectedUser(null)
            setShowEditModal(false)
        } catch (err: any) {
            setError(err.message || "Failed to update user")
        }
    }

    const handleDeleteUser = async (userId: string) => {
        try {
            const result = await deleteUser(userId, token as string)
            if (result.error) {
                throw new Error(result.message)
            }
            setUserData(userData.filter((user) => user._id !== userId))
            setSelectedUser(null)
            setShowDeleteConfirm(false)
        } catch (err: any) {
            setError(err.message || "Failed to delete user")
        }
    }

    const handleViewUser = async (user: User) => {
        try {
            const result = await getUserDetailsWithQuizzes(user._id, token as string)
            if (result.error) {
                throw new Error(result.message)
            }
            console.log("User details with quizzes:", result.data)
            setSelectedUser(result.data)
            setShowUserModal(true)
        } catch (err: any) {
            setError(err.message || "Failed to fetch user details with quizzes")
        }
    }

    const handleEditUser = (user: User) => {
        console.log("Editing user:", user)
        setSelectedUser(user)
        setShowEditModal(true)
    }

    const handleDeleteClick = (user: User) => {
        setSelectedUser(user)
        setShowDeleteConfirm(true)
    }

    const filteredUsers = userData.filter((user) => {
        const matchesSearch =
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesRole = filterRole === "all" || user.role === filterRole
        return matchesSearch && matchesRole
    })

    if (loading) {
        return (
            <div className="min-h-screen bg-background p-4 md:p-6 flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="text-purple-600"
                >
                    Loading...
                </motion.div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-background p-4 md:p-6 flex items-center justify-center">
                <div className="text-red-600">{error}</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background p-4 md:p-6">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-7xl mx-auto space-y-6"
            >
                <motion.div variants={itemVariants}>
                    <UserStats users={filteredUsers} />
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
                        users={filteredUsers as any}
                        onView={handleViewUser as any}
                        onEdit={handleEditUser as any}
                        onDelete={handleDeleteClick as any}
                    />
                </motion.div>

                <UserDetailsModal
                    user={selectedUser}
                    isOpen={showUserModal}
                    onClose={() => setShowUserModal(false)}
                />

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
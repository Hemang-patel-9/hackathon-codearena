"use client"

import { motion } from "framer-motion"
import { Users } from "lucide-react"
import UserCard from "./UserCard"
import type { User } from "@/types/user"

interface UserGridProps {
    users: User[] | null | undefined
    onView: (user: User) => void
    onEdit: (user: User) => void
    onDelete: (user: User) => void
}

const UserGrid = ({ users, onView, onEdit, onDelete }: UserGridProps) => {
    console.log("in grid ", users)

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    }

    if (!users || users.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16 bg-background backdrop-blur-sm rounded-2xl border border-purple-100"
            >
                <Users className="mx-auto h-16 w-16 text-purple-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No users found</h3>
                <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
            </motion.div>
        )
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="bg-background backdrop-blur-sm rounded-2xl p-6 shadow-lg"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {users.map((user, index) => (
                    <UserCard key={user._id} user={user} index={index} onView={onView} onEdit={onEdit} onDelete={onDelete} />
                ))}
            </div>
        </motion.div>
    )
}

export default UserGrid
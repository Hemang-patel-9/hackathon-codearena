"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Trash2 } from "lucide-react"
import type { User } from "./types"

interface DeleteConfirmModalProps {
    user: User | null
    isOpen: boolean
    onClose: () => void
    onConfirm: (userId: string) => void
}

const DeleteConfirmModal = ({ user, isOpen, onClose, onConfirm }: DeleteConfirmModalProps) => {
    if (!user) return null

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
                        className="bg-background rounded-2xl p-6 w-full max-w-md shadow-2xl border dark:border-red-900 border-red-300"
                    >
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                                <Trash2 className="h-8 w-8 text-red-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-foreground/70 mb-2">Delete User</h2>
                            <p className="text-gray-600 mb-6">
                                Are you sure you want to delete <span className="font-semibold text-red-600">{user.username}</span>?
                                This action cannot be undone.
                            </p>
                        </div>

                        <div className="flex justify-end space-x-4">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={onClose}
                                className="px-6 py-3 text-gray-600 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                            >
                                Cancel
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    onConfirm(user._id)
                                    onClose()
                                }}
                                className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium shadow-lg"
                            >
                                Delete User
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default DeleteConfirmModal

"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { XCircle } from "lucide-react"
import type { User } from "./types"

interface EditUserModalProps {
    user: User | null
    isOpen: boolean
    onClose: () => void
    onUpdate: (userId: string, updates: Partial<User>) => void
}

const EditUserModal = ({ user, isOpen, onClose, onUpdate }: EditUserModalProps) => {
    const [formData, setFormData] = useState({
        username: user?.username || "",
        role: user?.role || "user",
        isVerified: user?.isVerified || false,
        isBanned: user?.isBanned || false,
        bio: user?.bio || "",
        socialLinks: {
            github: user?.socialLinks?.github || "",
            linkedin: user?.socialLinks?.linkedin || "",
            twitter: user?.socialLinks?.twitter || "",
            website: user?.socialLinks?.website || "",
        },
    })

    if (!user) return null

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onUpdate(user._id, formData)
        onClose()
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
                        className="bg-background rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-hide shadow-2xl border border-foreground/30"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                Edit User
                            </h2>
                            <motion.button
                                whileHover={{ scale: 1.1, rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={onClose}
                                className="p-2 text-foreground/40 hover:text-foreground/60 hover:bg-purple-300 dark:hover:bg-purple-900/40 rounded-full transition-colors"
                            >
                                <XCircle size={24} />
                            </motion.button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Username */}
                            <div>
                                <label className="block text-sm font-medium text-foreground/30 mb-2">Username</label>
                                <motion.input
                                    whileFocus={{ scale: 1.02 }}
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    className="w-full px-4 py-3 bg-background border border-purple-900 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-foreground/90"
                                    required
                                />
                            </div>

                            {/* Role */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                                <motion.select
                                    whileFocus={{ scale: 1.02 }}
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value as "user" | "admin" | "moderator" })}
                                    className="w-full px-4 py-3 bg-background border border-purple-900 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-foreground/90"
                                >
                                    <option value="user">User</option>
                                    <option value="moderator">Moderator</option>
                                    <option value="admin">Admin</option>
                                </motion.select>
                            </div>

                            {/* Status Checkboxes */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <motion.label
                                    whileHover={{ scale: 1.02 }}
                                    className="flex items-center p-4 bg-green-900/60 border border-green-900 rounded-xl cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        checked={formData.isVerified}
                                        onChange={(e) => setFormData({ ...formData, isVerified: e.target.checked })}
                                        className="mr-3 w-4 h-4 text-green-600 rounded focus:ring-green-500"
                                    />
                                    <span className="text-sm font-medium text-green-700">Verified</span>
                                </motion.label>
                                <motion.label
                                    whileHover={{ scale: 1.02 }}
                                    className="flex items-center p-4 bg-red-900/60 border border-red-900 rounded-xl cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        checked={formData.isBanned}
                                        onChange={(e) => setFormData({ ...formData, isBanned: e.target.checked })}
                                        className="mr-3 w-4 h-4 text-red-600 rounded focus:ring-red-500"
                                    />
                                    <span className="text-sm font-medium text-red-700">Banned</span>
                                </motion.label>
                            </div>

                            {/* Bio */}
                            <div>
                                <label className="block text-sm font-medium text-foreground/20 mb-2">Bio</label>
                                <motion.textarea
                                    whileFocus={{ scale: 1.02 }}
                                    rows={4}
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    className="w-full px-4 py-3 bg-background border border-purple-900 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-foreground/90 placeholder-gray-500 resize-none"
                                    placeholder="User bio..."
                                    maxLength={300}
                                />
                            </div>

                            {/* Social Links */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-4">Social Links</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs text-gray-600 mb-1">GitHub</label>
                                        <motion.input
                                            whileFocus={{ scale: 1.02 }}
                                            type="url"
                                            value={formData.socialLinks.github}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    socialLinks: { ...formData.socialLinks, github: e.target.value },
                                                })
                                            }
                                            className="w-full px-3 py-2 bg-background border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-foreground/90"
                                            placeholder="https://github.com/username"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-600 mb-1">LinkedIn</label>
                                        <motion.input
                                            whileFocus={{ scale: 1.02 }}
                                            type="url"
                                            value={formData.socialLinks.linkedin}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    socialLinks: { ...formData.socialLinks, linkedin: e.target.value },
                                                })
                                            }
                                            className="w-full px-3 py-2 bg-background border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-foreground/90"
                                            placeholder="https://linkedin.com/in/username"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-600 mb-1">Twitter</label>
                                        <motion.input
                                            whileFocus={{ scale: 1.02 }}
                                            type="url"
                                            value={formData.socialLinks.twitter}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    socialLinks: { ...formData.socialLinks, twitter: e.target.value },
                                                })
                                            }
                                            className="w-full px-3 py-2 bg-background border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-foreground/90"
                                            placeholder="https://twitter.com/username"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-background/60 mb-1">Website</label>
                                        <motion.input
                                            whileFocus={{ scale: 1.02 }}
                                            type="url"
                                            value={formData.socialLinks.website}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    socialLinks: { ...formData.socialLinks, website: e.target.value },
                                                })
                                            }
                                            className="w-full px-3 py-2 bg-background border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-foreground/90"
                                            placeholder="https://yourwebsite.com"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end space-x-4 pt-4">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    type="button"
                                    onClick={onClose}
                                    className="px-6 py-3 text-foreground/20 border-2 border-foreground/30 rounded-xl transition-colors font-medium"
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    type="submit"
                                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-background rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg"
                                >
                                    Update User
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default EditUserModal

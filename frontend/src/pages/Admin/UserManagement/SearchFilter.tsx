"use client"

import { motion } from "framer-motion"
import { Search, Filter } from "lucide-react"

interface SearchFilterProps {
    searchTerm: string
    filterRole: string
    onSearchChange: (value: string) => void
    onFilterChange: (value: string) => void
}

const SearchFilter = ({ searchTerm, filterRole, onSearchChange, onFilterChange }: SearchFilterProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-background backdrop-blur-sm rounded-2xl p-6 shadow-lg"
        >
            <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-800" size={20} />
                    <motion.input
                        whileFocus={{ scale: 1.02 }}
                        type="text"
                        placeholder="Search users by username or email..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-background border border-purple-900 rounded-xl focus:ring-2 focus:ring-purple-500 transition-all duration-200 outline-none text-foreground/80 placeholder-foreground/20"
                    />
                </div>
                <div className="flex items-center space-x-3">
                    <motion.select
                        whileFocus={{ scale: 1.02 }}
                        value={filterRole}
                        onChange={(e) => onFilterChange(e.target.value)}
                        className="px-4 py-3 bg-background border border-blue-900 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-foreground/80 min-w-[140px]"
                    >
                        <option value="all">All Roles</option>
                        <option value="admin">Admin</option>
                        <option value="moderator">Moderator</option>
                        <option value="user">User</option>
                    </motion.select>
                </div>
            </div>
        </motion.div>
    )
}

export default SearchFilter

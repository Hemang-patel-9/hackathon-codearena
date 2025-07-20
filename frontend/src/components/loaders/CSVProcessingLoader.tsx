"use client"

import { motion } from "framer-motion"
import { FileText } from "lucide-react"

export function CSVProcessingLoader() {
    return (
        <div className="flex flex-col items-center justify-center p-8 space-y-4">
            <div className="relative">
                <motion.div
                    animate={{ y: [-10, 10, -10] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                >
                    <FileText className="w-12 h-12 text-purple-500" />
                </motion.div>
                <motion.div
                    animate={{
                        scale: [0, 1, 0],
                        rotate: [0, 180, 360],
                    }}
                    transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                    className="absolute -top-2 -right-2"
                >
                    <div className="w-4 h-4 bg-blue-500 rounded-full" />
                </motion.div>
            </div>
        </div>
    )
}

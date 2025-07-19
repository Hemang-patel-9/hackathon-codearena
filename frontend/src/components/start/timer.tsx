"use client"

import { Clock } from "lucide-react"
import { motion } from "framer-motion"

interface TimerProps {
	timeLeft: number
	totalTime: number
}

export function Timer({ timeLeft, totalTime }: TimerProps) {
	const isLowTime = timeLeft <= 10
	const percentage = (timeLeft / totalTime) * 100

	return (
		<motion.div
			animate={{
				scale: isLowTime ? [1, 1.05, 1] : 1,
			}}
			transition={{ repeat: isLowTime ? Number.POSITIVE_INFINITY : 0, duration: 1 }}
			className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700"
		>
			<Clock className={`w-5 h-5 ${isLowTime ? "text-red-500" : "text-blue-500"}`} />
			<div className="flex flex-col items-center">
				<span
					className={`font-mono text-lg sm:text-xl font-bold ${isLowTime ? "text-red-600 dark:text-red-400" : "text-gray-800 dark:text-gray-200"
						}`}
				>
					{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
				</span>
				<div className="w-16 h-1 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
					<motion.div
						className={`h-full ${isLowTime ? "bg-red-500" : "bg-blue-500"}`}
						initial={{ width: "100%" }}
						animate={{ width: `${percentage}%` }}
						transition={{ duration: 0.5 }}
					/>
				</div>
			</div>
		</motion.div>
	)
}

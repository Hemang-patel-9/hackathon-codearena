"use client"

import { CheckCircle, XCircle } from 'lucide-react'
import { motion } from "framer-motion"

interface AnswerFeedbackProps {
	isCorrect: boolean
	isOpen?: boolean
	autoAdvanceTime?: number
}

export function AnswerFeedback({ isCorrect, isOpen = false, autoAdvanceTime }: AnswerFeedbackProps) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className={`p-4 sm:p-6 rounded-lg border ${isCorrect || isOpen
					? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
					: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
				}`}
		>
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					{isCorrect || isOpen ? (
						<CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 dark:text-green-400" />
					) : (
						<XCircle className="w-6 h-6 sm:w-8 sm:h-8 text-red-600 dark:text-red-400" />
					)}
					<span
						className={`text-lg sm:text-xl font-bold ${isCorrect || isOpen
								? "text-green-800 dark:text-green-200"
								: "text-red-800 dark:text-red-200"
							}`}
					>
						{isOpen ? "Answer Recorded!" : isCorrect ? "Correct!" : "Incorrect"}
					</span>
				</div>

				{autoAdvanceTime && (
					<motion.div
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
					>
						<span>Next in</span>
						<motion.span
							key={autoAdvanceTime}
							initial={{ scale: 1.2 }}
							animate={{ scale: 1 }}
							className="font-mono font-bold text-blue-600 dark:text-blue-400"
						>
							{autoAdvanceTime}s
						</motion.span>
					</motion.div>
				)}
			</div>
		</motion.div>
	)
}

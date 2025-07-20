"use client"

import { Badge } from "@/components/ui/badge"
import { Eye } from 'lucide-react'
import { motion } from "framer-motion"
import { Timer } from "./timer"

interface ExamHeaderProps {
	currentQuestion: number
	totalQuestions: number
	score: number
	timeLeft: number
	totalTime: number
	cheatingAttempts: number
	faceViolations: number
}

export function ExamHeader({
	faceViolations,
	currentQuestion,
	totalQuestions,
	score,
	timeLeft,
	totalTime,
	cheatingAttempts,
}: ExamHeaderProps) {
	// console.log(faceViolations);
	
	return (
		<motion.div
			initial={{ opacity: 0, y: -20 }}
			animate={{ opacity: 1, y: 0 }}
			className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6"
		>
			<div className="flex flex-wrap items-center gap-3">
				<Badge variant="outline" className="text-sm sm:text-base px-3 py-1">
					Question {currentQuestion + 1} of {totalQuestions}
				</Badge>
				<Badge variant="secondary" className="text-sm sm:text-base px-3 py-1">
					Score: {score}
				</Badge>
			</div>

			<div className="flex items-center gap-3">
				{cheatingAttempts > 0 && (
					<motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
						<Badge variant="destructive" className="text-sm px-3 py-1">
							<Eye className="w-4 h-4 mr-1" />
							{cheatingAttempts}
						</Badge>
					</motion.div>
				)}
				<Timer timeLeft={timeLeft} totalTime={totalTime} />
			</div>
		</motion.div>
	)
}

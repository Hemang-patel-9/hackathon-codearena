"use client"

import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"

interface OpenEndedQuestionProps {
	value: string
	onChange: (value: string) => void
	disabled: boolean
}

export function OpenEndedQuestion({ value, onChange, disabled }: OpenEndedQuestionProps) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
			className="space-y-4"
		>
			<Label htmlFor="openAnswer" className="text-base sm:text-lg font-medium">
				Your Answer:
			</Label>
			<Textarea
				id="openAnswer"
				placeholder="Type your answer here..."
				value={value}
				onChange={(e) => onChange(e.target.value)}
				disabled={disabled}
				className="min-h-32 text-sm sm:text-base resize-none"
			/>
			<div className="text-right text-xs sm:text-sm text-gray-500 dark:text-gray-400">{value.length} characters</div>
		</motion.div>
	)
}

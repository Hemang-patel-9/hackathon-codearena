"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { CheckCircle, XCircle } from "lucide-react"
import { motion } from "framer-motion"

interface Option {
	_id: string
	text: string
	isCorrect: boolean
}

interface MultipleChoiceQuestionProps {
	options: Option[]
	selectedAnswers: string[]
	onAnswerChange: (optionId: string, checked: boolean) => void
	showAnswer: boolean
	disabled: boolean
}

export function MultipleChoiceQuestion({
	options,
	selectedAnswers,
	onAnswerChange,
	showAnswer,
	disabled,
}: MultipleChoiceQuestionProps) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
			className="space-y-3"
		>
			{options.map((option, index) => {
				const isSelected = selectedAnswers.includes(option._id)
				const isCorrect = option.isCorrect

				let containerClass =
					"flex items-center space-x-3 p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer "

				if (showAnswer) {
					if (isCorrect) {
						containerClass += "border-green-500 bg-green-50 dark:bg-green-900/20 dark:border-green-600"
					} else if (isSelected && !isCorrect) {
						containerClass += "border-red-500 bg-red-50 dark:bg-red-900/20 dark:border-red-600"
					} else {
						containerClass += "border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-600"
					}
				} else {
					if (isSelected) {
						containerClass += "border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-600"
					} else {
						containerClass +=
							"border-gray-200 hover:border-blue-300 hover:bg-blue-50 dark:border-gray-600 dark:hover:border-blue-600 dark:hover:bg-blue-900/10"
					}
				}

				return (
					<motion.div
						key={option._id}
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.3 + index * 0.1 }}
						whileHover={!showAnswer ? { scale: 1.02 } : {}}
						whileTap={!showAnswer ? { scale: 0.98 } : {}}
						className={containerClass}
					>
						<Checkbox
							id={option._id}
							checked={isSelected}
							onCheckedChange={(checked) => onAnswerChange(option._id, checked as boolean)}
							disabled={disabled}
						/>
						<Label htmlFor={option._id} className="flex-1 cursor-pointer text-sm sm:text-base">
							{option.text}
						</Label>
						{showAnswer && (
							<motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }}>
								{isCorrect ? (
									<CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
								) : isSelected ? (
									<XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 dark:text-red-400" />
								) : null}
							</motion.div>
						)}
					</motion.div>
				)
			})}
		</motion.div>
	)
}

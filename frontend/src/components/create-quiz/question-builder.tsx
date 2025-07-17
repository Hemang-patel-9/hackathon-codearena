"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, HelpCircle } from "lucide-react"
import type { QuizData } from "@/types/quiz"
import type { QuestionData } from "@/types/question"
import { QuestionCard } from "./question-card"
import { QuestionTypeSelector } from "./question-type-selector"

interface QuestionBuilderProps {
	quizData: QuizData
	updateQuizData: (updates: Partial<QuizData>) => void
}

export function QuestionBuilder({ quizData, updateQuizData }: QuestionBuilderProps) {
	const [showTypeSelector, setShowTypeSelector] = useState(false)

	const addQuestion = (type: QuestionData["questionType"]) => {
		const newQuestion: QuestionData = {
			questionText: "",
			questionType: type,
			options:
				type === "true-false"
					? [
						{ text: "True", isCorrect: false },
						{ text: "False", isCorrect: false },
					]
					: type === "open-ended"
						? []
						: [
							{ text: "", isCorrect: false },
							{ text: "", isCorrect: false },
						],
		}
		updateQuizData({ questions: [...quizData.questions, newQuestion] })
		setShowTypeSelector(false)
	}

	const updateQuestion = (index: number, updates: Partial<QuestionData>) => {
		const updatedQuestions = [...quizData.questions]
		updatedQuestions[index] = { ...updatedQuestions[index], ...updates }
		updateQuizData({ questions: updatedQuestions })
	}

	const deleteQuestion = (index: number) => {
		const updatedQuestions = quizData.questions.filter((_, i) => i !== index)
		updateQuizData({ questions: updatedQuestions })
	}

	const duplicateQuestion = (index: number) => {
		const questionToDuplicate = quizData.questions[index]
		if (questionToDuplicate) {
			const duplicatedQuestion: QuestionData = {
				...questionToDuplicate,
				questionText: `${questionToDuplicate.questionText} (Copy)`,
			}
			updateQuizData({ questions: [...quizData.questions, duplicatedQuestion] })
		}
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="space-y-6"
		>
			{/* Header */}
			<Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-white/20 dark:border-gray-700/50">
				<CardHeader>
					<CardTitle className="flex items-center justify-between">
						<div className="flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-white">
							<motion.div
								animate={{ rotate: [0, 15, -15, 0] }}
								transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
							>
								<HelpCircle className="w-6 h-6 text-purple-500" />
							</motion.div>
							Questions ({quizData.questions.length})
						</div>
						<Button
							onClick={() => setShowTypeSelector(true)}
							className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 hover:scale-105 transition-all duration-200"
						>
							<Plus className="w-4 h-4 mr-2" />
							Add Question
						</Button>
					</CardTitle>
				</CardHeader>
			</Card>

			{/* Questions List */}
			<AnimatePresence>
				{quizData.questions.map((question, index) => (
					<motion.div
						key={index}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ duration: 0.3, delay: index * 0.1 }}
					>
						<QuestionCard
							question={question}
							index={index}
							onUpdate={(updates) => updateQuestion(index, updates)}
							onDelete={() => deleteQuestion(index)}
							onDuplicate={() => duplicateQuestion(index)}
						/>
					</motion.div>
				))}
			</AnimatePresence>

			{/* Empty State */}
			{quizData.questions.length === 0 && (
				<motion.div
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					className="text-center py-12"
				>
					<motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}>
						<HelpCircle className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
					</motion.div>
					<h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No questions yet</h3>
					<p className="text-gray-500 dark:text-gray-400 mb-6">
						Start building your quiz by adding your first question
					</p>
					<Button
						onClick={() => setShowTypeSelector(true)}
						className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 hover:scale-105 transition-all duration-200"
					>
						<Plus className="w-4 h-4 mr-2" />
						Add Your First Question
					</Button>
				</motion.div>
			)}

			{/* Question Type Selector Modal */}
			<AnimatePresence>
				{showTypeSelector && <QuestionTypeSelector onSelect={addQuestion} onClose={() => setShowTypeSelector(false)} />}
			</AnimatePresence>
		</motion.div>
	)
}

"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, HelpCircle, FileText, Download, Upload, Sparkles, X, Tags, Hash } from "lucide-react"
import type { QuizData } from "@/types/quiz"
import type { QuestionData } from "@/types/question"
import { QuestionCard } from "./question-card"
import { QuestionTypeSelector } from "./question-type-selector"
import { useAuth } from "@/contexts/authContext"

interface QuestionBuilderProps {
	quizData: QuizData
	updateQuizData: (updates: Partial<QuizData>) => void
}

export function QuestionBuilder({ quizData, updateQuizData }: QuestionBuilderProps) {
	const [showTypeSelector, setShowTypeSelector] = useState(false)
	const [showCsvOptions, setShowCsvOptions] = useState(false)
	const [showAiGenerator, setShowAiGenerator] = useState(false)
	const [aiTags, setAiTags] = useState("")
	const [aiQuestionCount, setAiQuestionCount] = useState("")
	const { token } = useAuth()

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

	const handleCsvDownload = () => {
		const link = document.createElement("a");
		link.href = "cvs_format.csv";
		link.download = "question-template.csv";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		setShowCsvOptions(false);
	};

	function parseCsv(csvText: string): QuestionData[] {
		const lines = csvText.trim().split("\n").filter(line => line.trim() !== "")
		const questions: QuestionData[] = []

		for (let i = 1; i < lines.length; i++) {
			const cols = lines[i].split(",")

			const questionText = cols[0]?.trim()
			const questionType = cols[1]?.trim() as QuestionData["questionType"]

			if (!questionText || !questionType) continue

			let options: QuestionData["options"] = []

			if (questionType === "open-ended") {
				options = []
			} else if (["multiple-choice", "multiple-select", "true-false"].includes(questionType)) {
				for (let j = 2; j < cols.length; j += 2) {
					const text = cols[j]?.trim()
					const isCorrect = cols[j + 1]?.trim().toLowerCase() === "true"
					if (text) options.push({ text, isCorrect })
				}
			}

			questions.push({
				questionText,
				questionType,
				options
			})
		}

		return questions
	}


	const handleCsvUpload = () => {
		const input = document.createElement("input")
		input.type = "file"
		input.accept = ".csv"

		input.onchange = async (event: any) => {
			const file = event.target.files?.[0]
			if (!file) return

			const text = await file.text()
			try {
				const parsedQuestions = parseCsv(text)

				if (parsedQuestions.length === 0) {
					alert("No valid questions found.")
					return
				}

				updateQuizData({
					questions: [...quizData.questions, ...parsedQuestions],
				})
			} catch (error) {
				console.error("Error parsing CSV:", error)
				alert("Invalid CSV format.")
			}
			setShowCsvOptions(false)
		}

		input.click()
	}


	const handleAiGenerate = () => {
		// AI generation logic here
		console.log("Generating questions with AI:", { tags: aiTags, count: aiQuestionCount })
		setShowAiGenerator(false)
		setAiTags("")
		setAiQuestionCount("")
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
						<div className="flex items-center gap-2">
							<Button
								onClick={() => setShowCsvOptions(true)}
								variant="outline"
								className="border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:scale-105 transition-all duration-200"
							>
								<FileText className="w-4 h-4 mr-2" />
								CSV File
							</Button>
							<Button
								onClick={() => setShowAiGenerator(true)}
								variant="outline"
								className="border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:scale-105 transition-all duration-200"
							>
								<Sparkles className="w-4 h-4 mr-2" />
								Generate by AI
							</Button>
							<Button
								onClick={() => setShowTypeSelector(true)}
								className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 hover:scale-105 transition-all duration-200"
							>
								<Plus className="w-4 h-4 mr-2" />
								Add Question
							</Button>
						</div>
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
							token={token as string}
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

			{/* CSV Options Modal */}
			<AnimatePresence>
				{showCsvOptions && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
						onClick={() => setShowCsvOptions(false)}
					>
						<motion.div
							initial={{ scale: 0.9, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.9, opacity: 0 }}
							onClick={(e) => e.stopPropagation()}
							className="bg-background border rounded-lg shadow-xl p-6 w-full max-w-md mx-4"
						>
							<div className="flex items-center justify-between mb-4">
								<h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
									<FileText className="w-5 h-5 text-purple-500" />
									CSV File Options
								</h3>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => setShowCsvOptions(false)}
									className="text-muted-foreground hover:text-foreground"
								>
									<X className="w-4 h-4" />
								</Button>
							</div>
							<div className="space-y-3">
								<Button
									onClick={handleCsvDownload}
									className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
								>
									<Download className="w-4 h-4 mr-2" />
									Download CSV Template
								</Button>
								<Button
									onClick={handleCsvUpload}
									variant="outline"
									className="w-full border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 bg-transparent"
								>
									<Upload className="w-4 h-4 mr-2" />
									Upload CSV File
								</Button>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* AI Generator Modal */}
			<AnimatePresence>
				{showAiGenerator && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
						onClick={() => setShowAiGenerator(false)}
					>
						<motion.div
							initial={{ scale: 0.9, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.9, opacity: 0 }}
							onClick={(e) => e.stopPropagation()}
							className="bg-background border rounded-lg shadow-xl w-full max-w-md mx-4"
						>
							<Card className="border-0 shadow-none">
								<CardHeader className="pb-4">
									<CardTitle className="flex items-center justify-between">
										<div className="flex items-center gap-2 text-lg font-semibold text-foreground">
											<motion.div
												animate={{ rotate: [0, 360] }}
												transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
											>
												<Sparkles className="w-5 h-5 text-blue-500" />
											</motion.div>
											Generate Questions with AI
										</div>
										<Button
											variant="ghost"
											size="sm"
											onClick={() => setShowAiGenerator(false)}
											className="text-muted-foreground hover:text-foreground"
										>
											<X className="w-4 h-4" />
										</Button>
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="space-y-2">
										<Label htmlFor="tags" className="text-sm font-medium text-foreground flex items-center gap-2">
											<Tags className="w-4 h-4 text-blue-500" />
											Tags
										</Label>
										<Input
											id="tags"
											placeholder="e.g., science, history, mathematics"
											value={aiTags}
											onChange={(e) => setAiTags(e.target.value)}
											className="border-blue-200 dark:border-blue-800 focus:border-blue-500 focus:ring-blue-500"
										/>
									</div>
									<div className="space-y-2">
										<Label
											htmlFor="questionCount"
											className="text-sm font-medium text-foreground flex items-center gap-2"
										>
											<Hash className="w-4 h-4 text-blue-500" />
											Number of Questions
										</Label>
										<Input
											id="questionCount"
											type="number"
											placeholder="5"
											min="1"
											max="50"
											value={aiQuestionCount}
											onChange={(e) => setAiQuestionCount(e.target.value)}
											className="border-blue-200 dark:border-blue-800 focus:border-blue-500 focus:ring-blue-500"
										/>
									</div>
									<div className="flex gap-2 pt-2">
										<Button onClick={() => setShowAiGenerator(false)} variant="outline" className="flex-1">
											Cancel
										</Button>
										<Button
											onClick={handleAiGenerate}
											disabled={!aiTags.trim() || !aiQuestionCount.trim()}
											className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
										>
											<Sparkles className="w-4 h-4 mr-2" />
											Generate
										</Button>
									</div>
								</CardContent>
							</Card>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Question Type Selector Modal */}
			<AnimatePresence>
				{showTypeSelector && <QuestionTypeSelector onSelect={addQuestion} onClose={() => setShowTypeSelector(false)} />}
			</AnimatePresence>
		</motion.div>
	)
}

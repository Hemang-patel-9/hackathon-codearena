"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Trash2, Copy, Plus, X, CheckSquare, Square, ToggleLeft, FileText, ImageIcon, Video, Music } from "lucide-react"
import type { QuestionData } from "@/types/question"

interface QuestionCardProps {
	question: QuestionData
	index: number
	onUpdate: (updates: Partial<QuestionData>) => void
	onDelete: () => void
	onDuplicate: () => void
}

export function QuestionCard({ question, index, onUpdate, onDelete, onDuplicate }: QuestionCardProps) {
	const [showMediaUpload, setShowMediaUpload] = useState(false)

	const getQuestionTypeInfo = (type: QuestionData["questionType"]) => {
		switch (type) {
			case "multiple-choice":
				return { icon: CheckSquare, label: "Multiple Choice", color: "bg-blue-500" }
			case "multiple-select":
				return { icon: Square, label: "Multiple Select", color: "bg-green-500" }
			case "true-false":
				return { icon: ToggleLeft, label: "True/False", color: "bg-purple-500" }
			case "open-ended":
				return { icon: FileText, label: "Open Ended", color: "bg-orange-500" }
		}
	}

	const typeInfo = getQuestionTypeInfo(question.questionType)

	const addOption = () => {
		const newOptions = [...question.options, { text: "", isCorrect: false }]
		onUpdate({ options: newOptions })
	}

	const updateOption = (optionIndex: number, updates: Partial<{ text: string; isCorrect: boolean }>) => {
		const newOptions = question.options.map((option, index) =>
			index === optionIndex ? { ...option, ...updates } : option,
		)
		onUpdate({ options: newOptions })
	}

	const removeOption = (optionIndex: number) => {
		const newOptions = question.options.filter((_, index) => index !== optionIndex)
		onUpdate({ options: newOptions })
	}

	const handleCorrectAnswerChange = (optionIndex: number, isCorrect: boolean) => {
		if (question.questionType === "multiple-choice") {
			// For multiple choice, only one answer can be correct
			const newOptions = question.options.map((option, index) => ({
				...option,
				isCorrect: index === optionIndex ? isCorrect : false,
			}))
			onUpdate({ options: newOptions })
		} else {
			// For multiple select, multiple answers can be correct
			updateOption(optionIndex, { isCorrect })
		}
	}

	return (
		<motion.div
			layout
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			whileHover={{ scale: 1.01 }}
			transition={{ duration: 0.2 }}
		>
			<Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-white/20 dark:border-gray-700/50 hover:shadow-lg transition-shadow duration-200">
				<CardHeader className="pb-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<motion.div
								className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold text-sm"
								whileHover={{ scale: 1.1 }}
							>
								{index + 1}
							</motion.div>
							<Badge variant="secondary" className={`${typeInfo.color} text-white`}>
								<typeInfo.icon className="w-3 h-3 mr-1" />
								{typeInfo.label}
							</Badge>
						</div>
						<div className="flex items-center gap-2">
							<Button
								variant="ghost"
								size="sm"
								onClick={onDuplicate}
								className="hover:scale-110 transition-transform duration-200"
							>
								<Copy className="w-4 h-4" />
							</Button>
							<Button
								variant="ghost"
								size="sm"
								onClick={onDelete}
								className="hover:scale-110 transition-transform duration-200 text-red-500 hover:text-red-600"
							>
								<Trash2 className="w-4 h-4" />
							</Button>
						</div>
					</div>
				</CardHeader>

				<CardContent className="space-y-4">
					{/* Question Text */}
					<div>
						<Textarea
							value={question.questionText}
							onChange={(e) => onUpdate({ questionText: e.target.value })}
							placeholder="Enter your question here..."
							className="bg-white/50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 focus:ring-purple-500 focus:border-purple-500 min-h-[80px]"
						/>
					</div>

					{/* Media Upload */}
					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => setShowMediaUpload(!showMediaUpload)}
							className="hover:scale-105 transition-transform duration-200"
						>
							<ImageIcon className="w-4 h-4 mr-2" />
							Add Media
						</Button>
						{question.multimedia && (
							<Badge
								variant="secondary"
								className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
							>
								{question.multimedia.type} attached
							</Badge>
						)}
					</div>

					<AnimatePresence>
						{showMediaUpload && (
							<motion.div
								initial={{ opacity: 0, height: 0 }}
								animate={{ opacity: 1, height: "auto" }}
								exit={{ opacity: 0, height: 0 }}
								className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 space-y-3"
							>
								<div className="flex gap-2">
									{[
										{ type: "image", icon: ImageIcon, label: "Image" },
										{ type: "video", icon: Video, label: "Video" },
										{ type: "audio", icon: Music, label: "Audio" },
									].map((media) => (
										<Button
											key={media.type}
											variant="outline"
											size="sm"
											onClick={() => onUpdate({ multimedia: { type: media.type as any, url: "" } })}
											className="hover:scale-105 transition-transform duration-200"
										>
											<media.icon className="w-4 h-4 mr-2" />
											{media.label}
										</Button>
									))}
								</div>
								{question.multimedia && (
									<Input
										placeholder="Enter media URL..."
										value={question.multimedia.url}
										onChange={(e) =>
											onUpdate({
												multimedia: { ...question.multimedia!, url: e.target.value },
											})
										}
										className="bg-white/50 dark:bg-gray-700/50"
									/>
								)}
							</motion.div>
						)}
					</AnimatePresence>

					{/* Options */}
					{question.questionType !== "open-ended" && (
						<div className="space-y-3">
							<div className="flex items-center justify-between">
								<h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Answer Options</h4>
								{question.questionType !== "true-false" && (
									<Button
										variant="outline"
										size="sm"
										onClick={addOption}
										className="hover:scale-105 transition-transform duration-200 bg-transparent"
									>
										<Plus className="w-4 h-4 mr-1" />
										Add Option
									</Button>
								)}
							</div>

							<AnimatePresence>
								{question.options.map((option, optionIndex) => (
									<motion.div
										key={optionIndex}
										initial={{ opacity: 0, x: -20 }}
										animate={{ opacity: 1, x: 0 }}
										exit={{ opacity: 0, x: 20 }}
										className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
									>
										<Switch
											checked={option.isCorrect}
											onCheckedChange={(checked) => handleCorrectAnswerChange(optionIndex, checked)}
											className="data-[state=checked]:bg-green-500"
										/>
										<Input
											value={option.text}
											onChange={(e) => updateOption(optionIndex, { text: e.target.value })}
											placeholder={`Option ${optionIndex + 1}`}
											className="flex-1 bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-500"
											disabled={question.questionType === "true-false"}
										/>
										{question.questionType !== "true-false" && question.options.length > 2 && (
											<Button
												variant="ghost"
												size="sm"
												onClick={() => removeOption(optionIndex)}
												className="text-red-500 hover:text-red-600 hover:scale-110 transition-all duration-200"
											>
												<X className="w-4 h-4" />
											</Button>
										)}
									</motion.div>
								))}
							</AnimatePresence>
						</div>
					)}

					{/* Open-ended note */}
					{question.questionType === "open-ended" && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
						>
							<p className="text-sm text-blue-700 dark:text-blue-300">
								This is an open-ended question. Participants will provide text-based answers that will need manual
								review.
							</p>
						</motion.div>
					)}
				</CardContent>
			</Card>
		</motion.div>
	)
}

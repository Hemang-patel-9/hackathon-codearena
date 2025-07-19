"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Clock, Users, Target, Eye, Calendar, Tag, ShieldQuestionIcon, Timer } from "lucide-react"
import type { QuizData } from "@/types/quiz"
interface QuizPreviewProps {
	quizData: QuizData
	onClose: () => void
}

export function QuizPreview({ quizData, onClose }: QuizPreviewProps) {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
			onClick={onClose}
		>
			<motion.div
				initial={{ scale: 0.9, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				exit={{ scale: 0.9, opacity: 0 }}
				onClick={(e) => e.stopPropagation()}
				className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
			>
				<Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
					<CardHeader className="border-b border-gray-200 dark:border-gray-700">
						<div className="flex items-center justify-between">
							<CardTitle className="flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white">
								<Eye className="w-6 h-6 text-purple-500" />
								Quiz Preview
							</CardTitle>
							<Button variant="ghost" size="sm" onClick={onClose}>
								<X className="w-4 h-4" />
							</Button>
						</div>
					</CardHeader>

					<CardContent className="p-6 space-y-6">
						{/* Quiz Header */}
						<motion.div
							initial={{ y: 20, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							transition={{ delay: 0.1 }}
							className="text-center space-y-4"
						>
							{quizData.thumbnail && (
								<div className="w-32 h-32 mx-auto rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
									<img
										src={quizData.thumbnail || "/placeholder.svg"}
										alt="Quiz thumbnail"
										className="w-full h-full object-cover"
									/>
								</div>
							)}
							<h1 className="text-3xl font-bold text-gray-900 dark:text-white">{quizData.title || "Untitled Quiz"}</h1>
							{quizData.description && (
								<p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">{quizData.description}</p>
							)}
						</motion.div>

						{/* Quiz Stats */}
						<motion.div
							initial={{ y: 20, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							transition={{ delay: 0.2 }}
							className="grid grid-cols-2 md:grid-cols-4 gap-4"
						>
							<div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
								<div className="flex items-center justify-center w-8 h-8 bg-blue-500 rounded-full mx-auto mb-2">
									<Users className="w-4 h-4 text-white" />
								</div>
								<div className="text-sm text-gray-600 dark:text-gray-400">Total Questions</div>
								<div className="text-xl font-bold text-gray-900 dark:text-white">{quizData.questions.length}</div>
							</div>
							<div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
								<div className="flex items-center justify-center w-8 h-8 bg-amber-900 rounded-full mx-auto mb-2">
									<ShieldQuestionIcon className="w-4 h-4 text-white" />
								</div>
								<div className="text-sm text-gray-600 dark:text-gray-400">Display Questions</div>
								<div className="text-xl font-bold text-gray-900 dark:text-white">{quizData.NoOfQuestion}</div>
							</div>
							<div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
								<div className="flex items-center justify-center w-8 h-8 bg-green-500 rounded-full mx-auto mb-2">
									<Clock className="w-4 h-4 text-white" />
								</div>
								<div className="text-sm text-gray-600 dark:text-gray-400">Time/Question</div>
								<div className="text-xl font-bold text-gray-900 dark:text-white">{quizData.timePerQuestion}s</div>
							</div>
							<div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
								<div className="flex items-center justify-center w-8 h-8 bg-teal-700 rounded-full mx-auto mb-2">
									<Timer className="w-4 h-4 text-white" />
								</div>
								<div className="text-sm text-gray-600 dark:text-gray-400">Total Duration</div>
								<div className="text-xl font-bold text-gray-900 dark:text-white">{quizData.duration} minutes</div>
							</div>
							<div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
								<div className="flex items-center justify-center w-8 h-8 bg-purple-500 rounded-full mx-auto mb-2">
									<Target className="w-4 h-4 text-white" />
								</div>
								<div className="text-sm text-gray-600 dark:text-gray-400">Passing Score</div>
								<div className="text-xl font-bold text-gray-900 dark:text-white">{quizData.passingCriteria}%</div>
							</div>
							<div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
								<div className="flex items-center justify-center w-8 h-8 bg-orange-500 rounded-full mx-auto mb-2">
									<Calendar className="w-4 h-4 text-white" />
								</div>
								<div className="text-sm text-gray-600 dark:text-gray-400">Scheduled</div>
								<div className="text-sm font-bold text-gray-900 dark:text-white">
									{quizData.schedule.toLocaleDateString()}
								</div>
							</div>
						</motion.div>

						{/* Quiz Settings */}
						<motion.div
							initial={{ y: 20, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							transition={{ delay: 0.3 }}
							className="space-y-4"
						>
							<h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quiz Settings</h3>
							<div className="flex flex-wrap gap-2">
								<Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
									{quizData.visibility}
								</Badge>
								<Badge
									variant="secondary"
									className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
								>
									{quizData.questionOrder} order
								</Badge>
								{quizData.tags.map((tag) => (
									<Badge key={tag} variant="outline" className="border-purple-300 text-purple-700 dark:text-purple-300">
										<Tag className="w-3 h-3 mr-1" />
										{tag}
									</Badge>
								))}
							</div>
						</motion.div>

						{/* Questions Preview */}
						<motion.div
							initial={{ y: 20, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							transition={{ delay: 0.4 }}
							className="space-y-4"
						>
							<h3 className="text-lg font-semibold text-gray-900 dark:text-white">Questions Preview</h3>
							{quizData.questions.length === 0 ? (
								<div className="text-center py-8 text-gray-500 dark:text-gray-400">No questions added yet</div>
							) : (
								<div className="space-y-4 max-h-96 overflow-y-auto">
									{quizData.questions.map((question, index) => (
										<motion.div
											key={question.questionText}
											initial={{ x: -20, opacity: 0 }}
											animate={{ x: 0, opacity: 1 }}
											transition={{ delay: index * 0.1 }}
											className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600"
										>
											<div className="flex items-start gap-3">
												<div className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-semibold">
													{index + 1}
												</div>
												<div className="flex-1">
													<div className="flex items-center gap-2 mb-2">
														<Badge variant="secondary" className="text-xs">
															{question.questionType.replace("-", " ")}
														</Badge>
														{question.multimedia && (
															<Badge variant="outline" className="text-xs text-green-600 dark:text-green-400">
																{question.multimedia.type}
															</Badge>
														)}
													</div>
													<p className="text-sm text-gray-900 dark:text-white font-medium mb-2">
														{question.questionText || "No question text"}
													</p>
													{question.options.length > 0 && (
														<div className="space-y-1">
															{question.options.map((option, optionIndex) => (
																<div
																	key={optionIndex}
																	className={`text-xs p-2 rounded ${option.isCorrect
																			? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
																			: "bg-gray-100 dark:bg-gray-600/50 text-gray-600 dark:text-gray-400"
																		}`}
																>
																	{option.isCorrect && "✓ "}
																	{option.text || `Option ${optionIndex + 1}`}
																</div>
															))}
														</div>
													)}
												</div>
											</div>
										</motion.div>
									))}
								</div>
							)}
						</motion.div>
					</CardContent>
				</Card>
			</motion.div>
		</motion.div>
	)
}

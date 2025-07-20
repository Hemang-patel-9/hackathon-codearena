"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Award, XCircle, CheckCircle, ThumbsUp, ThumbsDown, AlertTriangle } from 'lucide-react'
import { motion } from "framer-motion"

interface Answer {
	questionId: string
	selectedOptions: string[]
	openAnswer?: string
	isCorrect: boolean
	timeTaken: number
	questionText: string
	questionType: string
}

interface Question {
	_id: string
	questionText: string
	type: string
	options: Array<{
		text: string
		isCorrect: boolean
		_id: string
	}>
}

interface ExamResultsProps {
	score: number
	answers: Answer[]
	questions: Question[]
	cheatingAttempts: number
	passingCriteria: number
	faceViolations: number
}

export function ExamResults({ faceViolations, score, answers, questions, cheatingAttempts, passingCriteria }: ExamResultsProps) {
	const correctAnswers = answers.filter((a) => a.isCorrect).length
	const totalQuestions = questions.length
	const percentage = Math.round((correctAnswers / totalQuestions) * 100)
	const passed = percentage >= passingCriteria
	console.log(faceViolations);
	

	return (
		<div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-green-900 dark:to-emerald-900 p-4">

			<motion.div
				initial={{ opacity: 0, scale: 0.8 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.6 }}
				className="max-w-4xl mx-auto"
			>
				<Card className="shadow-2xl border-0 overflow-hidden">
					<CardHeader
						className={`text-center space-y-6 p-6 sm:p-8 ${passed
								? "bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-700 dark:to-emerald-700"
								: "bg-gradient-to-r from-red-600 to-rose-600 dark:from-red-700 dark:to-rose-700"
							} text-white`}
					>
						<motion.div
							initial={{ scale: 0, rotate: -180 }}
							animate={{ scale: 1, rotate: 0 }}
							transition={{ duration: 0.8, type: "spring" }}
						>
							{passed ? (
								<Award className="w-20 h-20 sm:w-24 sm:h-24 mx-auto" />
							) : (
								<XCircle className="w-20 h-20 sm:w-24 sm:h-24 mx-auto" />
							)}
						</motion.div>

						<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
							<CardTitle className="text-2xl sm:text-3xl md:text-4xl font-bold">
								{passed ? "Congratulations! 🎉" : "Better Luck Next Time"}
							</CardTitle>
							<div className="flex items-center justify-center gap-2 mt-2">
								{passed ? <ThumbsUp className="w-5 h-5 sm:w-6 sm:h-6" /> : <ThumbsDown className="w-5 h-5 sm:w-6 sm:h-6" />}
								<span className="text-lg sm:text-xl">You {passed ? "PASSED" : "FAILED"} the exam</span>
							</div>
						</motion.div>
					</CardHeader>

					<CardContent className="p-6 sm:p-8 space-y-8">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.5 }}
							className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6"
						>
							<div className="text-center p-4 sm:p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
								<p className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">{score}</p>
								<p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Score</p>
							</div>
							<div className="text-center p-4 sm:p-6 bg-green-50 dark:bg-green-900/20 rounded-xl">
								<p className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400">{percentage}%</p>
								<p className="text-sm font-medium text-gray-600 dark:text-gray-400">Accuracy</p>
							</div>
							<div className="text-center p-4 sm:p-6 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
								<p className="text-2xl sm:text-3xl font-bold text-purple-600 dark:text-purple-400">
									{correctAnswers}/{totalQuestions}
								</p>
								<p className="text-sm font-medium text-gray-600 dark:text-gray-400">Correct Answers</p>
							</div>
						</motion.div>

						<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
							<h3 className="text-xl sm:text-2xl font-bold mb-6 text-center dark:text-white">Question Review</h3>
							<div className="space-y-4 max-h-96 overflow-y-auto">
								{answers.map((answer, index) => (
									<motion.div
										key={index}
										initial={{ opacity: 0, x: -20 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ delay: 0.8 + index * 0.1 }}
										className={`p-4 rounded-lg border-l-4 ${answer.isCorrect
												? "bg-green-50 dark:bg-green-900/20 border-green-500 dark:border-green-400"
												: "bg-red-50 dark:bg-red-900/20 border-red-500 dark:border-red-400"
											}`}
									>
										<div className="flex items-start justify-between">
											<div className="flex-1">
												<h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 text-sm sm:text-base">
													Q{index + 1}: {answer.questionText}
												</h4>
												<div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
													<p>
														<strong>Your Answer:</strong>
													</p>
													{answer.questionType === "open" ? (
														<p className="italic bg-gray-100 dark:bg-gray-700 p-2 rounded mt-1 text-xs sm:text-sm">
															"{answer.openAnswer || "No answer provided"}"
														</p>
													) : (
														<div className="mt-1">
															{questions[index].options
																.filter((opt) => answer.selectedOptions.includes(opt._id))
																.map((opt) => (
																	<Badge key={opt._id} variant="outline" className="mr-1 mb-1 text-xs">
																		{opt.text}
																	</Badge>
																))}
														</div>
													)}
													<p className="mt-2">
														<strong>Time taken:</strong> {answer.timeTaken}s
													</p>
												</div>
											</div>
											<div className="ml-4">
												{answer.isCorrect ? (
													<CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-500 dark:text-green-400" />
												) : (
													<XCircle className="w-6 h-6 sm:w-8 sm:h-8 text-red-500 dark:text-red-400" />
												)}
											</div>
										</div>
									</motion.div>
								))}
							</div>
						</motion.div>

						{cheatingAttempts > 0 && (
							<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}>
								<Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
									<AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 dark:text-red-400" />
									<AlertDescription className="text-red-800 dark:text-red-200 text-sm sm:text-base">
										<strong>Warning:</strong> {cheatingAttempts} suspicious activities were detected during your exam.
									</AlertDescription>
								</Alert>
							</motion.div>
						)}
					</CardContent>
				</Card>
			</motion.div>
		</div>
	)
}

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Trophy, Target, Timer, Shield, Maximize } from "lucide-react"
import { motion } from "framer-motion"

interface ExamIntroProps {
	title: string
	description: string
	totalQuestions: number
	timePerQuestion: number
	thumbnail?: string
	creator?: {
		username: string
	}
	onStartExam: () => void
}

export function ExamIntro({
	title,
	description,
	totalQuestions,
	timePerQuestion,
	thumbnail,
	creator,
	onStartExam,
}: ExamIntroProps) {
	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 flex items-center justify-center p-4">

			<motion.div
				initial={{ opacity: 0, y: 50 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				className="max-w-2xl w-full"
			>
				<Card className="shadow-2xl border-0 overflow-hidden">
					<motion.div initial={{ height: 0 }} animate={{ height: "auto" }} transition={{ delay: 0.3, duration: 0.5 }}>
						<CardHeader className="text-center space-y-6 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 text-white p-6 sm:p-8">
							<motion.div
								initial={{ scale: 0, rotate: -180 }}
								animate={{ scale: 1, rotate: 0 }}
								transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
							>
								<Trophy className="w-16 h-16 sm:w-20 sm:h-20 mx-auto" />
							</motion.div>
							<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
								{thumbnail && (
									<div className="mb-4">
										<img
											src={thumbnail.replace(/\\/g, "/") || "/placeholder.svg"}
											alt="Quiz thumbnail"
											className="w-20 h-20 mx-auto rounded-full object-cover border-4 border-white/20"
											onError={(e) => {
												e.currentTarget.style.display = "none"
											}}
										/>
									</div>
								)}
								<CardTitle className="text-2xl sm:text-3xl md:text-4xl font-bold">{title}</CardTitle>
								<p className="text-blue-100 text-base sm:text-lg mt-2">{description}</p>
								{creator && <p className="text-blue-200 text-sm mt-2">Created by: {creator.username}</p>}
							</motion.div>
						</CardHeader>
					</motion.div>

					<CardContent className="p-6 sm:p-8 space-y-8">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 1 }}
							className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
						>
							<motion.div
								whileHover={{ scale: 1.05 }}
								className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl"
							>
								<Target className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400" />
								<div>
									<p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Questions</p>
									<p className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">{totalQuestions}</p>
								</div>
							</motion.div>

							<motion.div
								whileHover={{ scale: 1.05 }}
								className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl"
							>
								<Timer className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 dark:text-green-400" />
								<div>
									<p className="text-sm font-medium text-gray-600 dark:text-gray-400">Time per Question</p>
									<p className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">{timePerQuestion}s</p>
								</div>
							</motion.div>
						</motion.div>

						<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}>
							<Alert className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20">
								<Shield className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 dark:text-amber-400" />
								<AlertDescription className="text-amber-800 dark:text-amber-200 text-sm sm:text-base">
									<strong>Anti-cheating measures active:</strong> Tab switching, copy/paste, and right-clicking are
									monitored and disabled.
								</AlertDescription>
							</Alert>
						</motion.div>

						<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4 }}>
							<Button
								onClick={onStartExam}
								className="w-full py-4 sm:py-6 text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
							>
								<Maximize className="w-5 h-5 sm:w-6 sm:h-6 mr-3" />
								Start Exam
							</Button>
						</motion.div>
					</CardContent>
				</Card>
			</motion.div>
		</div>
	)
}

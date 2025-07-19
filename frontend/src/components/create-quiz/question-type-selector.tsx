"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, CheckSquare, Square, ToggleLeft, FileText } from 'lucide-react'
import type { QuestionData } from "@/types/quiz"

interface QuestionTypeSelectorProps {
	onSelect: (type: QuestionData["questionType"]) => void
	onClose: () => void
}

export function QuestionTypeSelector({ onSelect, onClose }: QuestionTypeSelectorProps) {
	const questionTypes = [
		{
			type: "multiple-choice" as const,
			title: "Multiple Choice",
			description: "Single correct answer from multiple options",
			icon: CheckSquare,
			color: "from-blue-500 to-cyan-500",
		},
		{
			type: "multiple-select" as const,
			title: "Multiple Select",
			description: "Multiple correct answers from options",
			icon: Square,
			color: "from-green-500 to-emerald-500",
		},
		{
			type: "true-false" as const,
			title: "True/False",
			description: "Simple true or false question",
			icon: ToggleLeft,
			color: "from-purple-500 to-pink-500",
		},
		{
			type: "open-ended" as const,
			title: "Open Ended",
			description: "Text-based answer question",
			icon: FileText,
			color: "from-orange-500 to-red-500",
		},
	]

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 md:p-6"
			onClick={onClose}
		>
			<motion.div
				initial={{ scale: 0.9, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				exit={{ scale: 0.9, opacity: 0 }}
				onClick={(e) => e.stopPropagation()}
				className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-3xl"
			>
				<Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-2xl">
					<CardContent className="p-4 sm:p-5 md:p-6">
						{/* Header */}
						<div className="flex items-center justify-between mb-4 sm:mb-5 md:mb-6">
							<h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white leading-tight">
								Choose Question Type
							</h2>
							<Button
								variant="ghost"
								size="sm"
								onClick={onClose}
								className="shrink-0 h-8 w-8 sm:h-9 sm:w-9 p-0 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
							>
								<X className="w-4 h-4 sm:w-5 sm:h-5" />
							</Button>
						</div>

						{/* Question Types Grid */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
							{questionTypes.map((type, index) => (
								<motion.div
									key={type.type}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: index * 0.1 }}
									className="w-full"
								>
									<Button
										variant="outline"
										onClick={() => onSelect(type.type)}
										className="w-full h-auto p-3 sm:p-4 text-left hover:scale-[1.02] sm:hover:scale-105 transition-all duration-200 group border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md"
									>
										<div className="flex items-start gap-3 sm:gap-4 w-full">
											{/* Icon */}
											<div
												className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-r ${type.color} p-1.5 sm:p-2 md:p-2.5 group-hover:scale-110 transition-transform duration-200 shrink-0`}
											>
												<type.icon className="w-full h-full text-white" />
											</div>

											{/* Content */}
											<div className="flex-1 min-w-0">
												<h3 className="font-semibold text-gray-900 dark:text-white mb-1 sm:mb-1.5 text-sm sm:text-base leading-tight">
													{type.title}
												</h3>
												<p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
													{type.description}
												</p>
											</div>
										</div>
									</Button>
								</motion.div>
							))}
						</div>

						{/* Optional: Add a cancel button for mobile */}
						<div className="mt-4 sm:mt-6 sm:hidden">
							<Button
								variant="outline"
								onClick={onClose}
								className="w-full"
							>
								Cancel
							</Button>
						</div>
					</CardContent>
				</Card>
			</motion.div>
		</motion.div>
	)
}
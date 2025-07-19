"use client"

import { motion } from "framer-motion"
import { Check } from 'lucide-react'

interface ProgressIndicatorProps {
	currentStep: number
	steps: { title: string }[]
}

export function ProgressIndicator({ currentStep, steps }: ProgressIndicatorProps) {
	return (
		<motion.div
			initial={{ y: -20, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			className="flex items-center justify-center"
		>
			<div className="flex items-center space-x-4">
				{steps.map((step, index) => (
					<div key={index} className="flex items-center">
						<motion.div
							className={`relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${index < currentStep
									? "bg-green-500 border-green-500 text-white"
									: index === currentStep
										? "bg-purple-600 border-purple-600 text-white"
										: "bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400"
								}`}
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.95 }}
						>
							{index < currentStep ? (
								<motion.div
									initial={{ scale: 0 }}
									animate={{ scale: 1 }}
									transition={{ delay: 0.2 }}
								>
									<Check className="w-5 h-5" />
								</motion.div>
							) : (
								<span className="text-sm font-semibold">{index + 1}</span>
							)}
						</motion.div>

						<div className="ml-3 text-sm">
							<div
								className={`font-medium transition-colors duration-300 ${index <= currentStep
										? "text-gray-900 dark:text-white"
										: "text-gray-500 dark:text-gray-400"
									}`}
							>
								{step.title}
							</div>
						</div>

						{index < steps.length - 1 && (
							<motion.div
								className={`w-16 h-0.5 mx-4 transition-colors duration-300 ${index < currentStep ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
									}`}
								initial={{ scaleX: 0 }}
								animate={{ scaleX: index < currentStep ? 1 : 0.3 }}
								transition={{ duration: 0.5 }}
							/>
						)}
					</div>
				))}
			</div>
		</motion.div>
	)
}

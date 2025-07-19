"use client"

import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"

interface ProgressBarProps {
	current: number
	total: number
}

export function ProgressBar({ current, total }: ProgressBarProps) {
	const percentage = (current / total) * 100

	return (
		<div className="w-full space-y-2">
			<div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
				<span>Progress</span>
				<span>
					{current} / {total}
				</span>
			</div>
			<motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} className="origin-left">
				<Progress value={percentage} className="h-3" />
			</motion.div>
		</div>
	)
}

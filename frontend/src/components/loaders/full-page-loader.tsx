"use client"

import { motion } from "framer-motion"
import { Loader } from "./loader"
import { cn } from "@/lib/utils"

interface FullPageLoaderProps {
	variant?: "default" | "quiz" | "thinking" | "processing" | "success" | "minimal"
	text?: string
	subText?: string
	className?: string
	overlay?: boolean
}

export function FullPageLoader({
	variant = "quiz",
	text = "Loading...",
	subText,
	className,
	overlay = false,
}: FullPageLoaderProps) {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className={cn(
				"flex flex-col items-center justify-center min-h-screen",
				overlay
					? "fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50"
					: "bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900",
				className,
			)}
		>
			<div className="text-center space-y-4">
				<Loader variant={variant} size="xl" text={text} />

				{subText && (
					<motion.p
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.5 }}
						className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto"
					>
						{subText}
					</motion.p>
				)}

				{/* Animated background elements */}
				<div className="absolute inset-0 overflow-hidden pointer-events-none">
					{[...Array(20)].map((_, i) => (
						<motion.div
							key={i}
							className="absolute w-2 h-2 bg-blue-200/30 dark:bg-blue-800/30 rounded-full"
							style={{
								left: `${Math.random() * 100}%`,
								top: `${Math.random() * 100}%`,
							}}
							animate={{
								y: [0, -100, 0],
								opacity: [0, 1, 0],
							}}
							transition={{
								duration: Math.random() * 3 + 2,
								repeat: Number.POSITIVE_INFINITY,
								delay: Math.random() * 2,
								ease: "easeInOut",
							}}
						/>
					))}
				</div>
			</div>
		</motion.div>
	)
}

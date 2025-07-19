"use client"

import { motion } from "framer-motion"
import { BookOpen, Brain, Target, Users, Trophy, Sparkles, Activity } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoaderProps {
	variant?: "default" | "quiz" | "thinking" | "processing" | "success" | "minimal"
	size?: "sm" | "md" | "lg" | "xl"
	text?: string
	className?: string
	theme?: "light" | "dark" | "auto"
}

export function Loader({ variant = "default", size = "md", text, className, theme = "auto" }: LoaderProps) {
	const sizeClasses = {
		sm: "w-6 h-6",
		md: "w-8 h-8",
		lg: "w-12 h-12",
		xl: "w-16 h-16",
	}

	const containerSizeClasses = {
		sm: "gap-2",
		md: "gap-3",
		lg: "gap-4",
		xl: "gap-6",
	}

	const textSizeClasses = {
		sm: "text-sm",
		md: "text-base",
		lg: "text-lg",
		xl: "text-xl",
	}

	// Default spinning loader
	if (variant === "default") {
		return (
			<div className={cn("flex flex-col items-center justify-center", containerSizeClasses[size], className)}>
				<motion.div
					animate={{ rotate: 360 }}
					transition={{
						duration: 1,
						repeat: Number.POSITIVE_INFINITY,
						ease: "linear",
					}}
					className={cn(
						"border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full",
						sizeClasses[size],
					)}
				/>
				{text && (
					<motion.p
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.2 }}
						className={cn("text-gray-600 dark:text-gray-300 font-medium", textSizeClasses[size])}
					>
						{text}
					</motion.p>
				)}
			</div>
		)
	}

	// Quiz-themed loader with rotating icons
	if (variant === "quiz") {
		const icons = [BookOpen, Brain, Target, Trophy, Users]

		return (
			<div className={cn("flex flex-col items-center justify-center", containerSizeClasses[size], className)}>
				<div className="relative">
					{icons.map((Icon, index) => (
						<motion.div
							key={index}
							className="absolute inset-0 flex items-center justify-center"
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{
								opacity: [0, 1, 1, 0],
								scale: [0.8, 1, 1, 0.8],
								rotate: 360,
							}}
							transition={{
								duration: 2,
								repeat: Number.POSITIVE_INFINITY,
								delay: index * 0.4,
								ease: "easeInOut",
							}}
						>
							<Icon className={cn("text-blue-600 dark:text-blue-400", sizeClasses[size])} />
						</motion.div>
					))}
				</div>
				{text && (
					<motion.p
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3 }}
						className={cn("text-gray-600 dark:text-gray-300 font-medium text-center", textSizeClasses[size])}
					>
						{text}
					</motion.p>
				)}
			</div>
		)
	}

	// Thinking/processing loader with brain animation
	if (variant === "thinking") {
		return (
			<div className={cn("flex flex-col items-center justify-center", containerSizeClasses[size], className)}>
				<div className="relative">
					<motion.div
						animate={{
							scale: [1, 1.1, 1],
							rotate: [0, 5, -5, 0],
						}}
						transition={{
							duration: 2,
							repeat: Number.POSITIVE_INFINITY,
							ease: "easeInOut",
						}}
					>
						<Brain className={cn("text-purple-600 dark:text-purple-400", sizeClasses[size])} />
					</motion.div>

					{/* Thinking dots */}
					<div className="absolute -top-2 -right-2 flex gap-1">
						{[0, 1, 2].map((index) => (
							<motion.div
								key={index}
								className="w-1.5 h-1.5 bg-purple-500 dark:bg-purple-400 rounded-full"
								animate={{
									opacity: [0.3, 1, 0.3],
									y: [0, -4, 0],
								}}
								transition={{
									duration: 1.5,
									repeat: Number.POSITIVE_INFINITY,
									delay: index * 0.2,
									ease: "easeInOut",
								}}
							/>
						))}
					</div>
				</div>

				{text && (
					<motion.p
						initial={{ opacity: 0 }}
						animate={{ opacity: [0.5, 1, 0.5] }}
						transition={{
							duration: 2,
							repeat: Number.POSITIVE_INFINITY,
							ease: "easeInOut",
						}}
						className={cn("text-purple-600 dark:text-purple-400 font-medium text-center", textSizeClasses[size])}
					>
						{text}
					</motion.p>
				)}
			</div>
		)
	}

	// Processing loader with activity waves
	if (variant === "processing") {
		return (
			<div className={cn("flex flex-col items-center justify-center", containerSizeClasses[size], className)}>
				<div className="relative flex items-center justify-center">
					{/* Central icon */}
					<motion.div
						animate={{ rotate: 360 }}
						transition={{
							duration: 3,
							repeat: Number.POSITIVE_INFINITY,
							ease: "linear",
						}}
					>
						<Activity className={cn("text-green-600 dark:text-green-400", sizeClasses[size])} />
					</motion.div>

					{/* Pulsing rings */}
					{[1, 2, 3].map((ring) => (
						<motion.div
							key={ring}
							className="absolute border-2 border-green-300 dark:border-green-600 rounded-full"
							style={{
								width: `${ring * 20 + (size === "sm" ? 20 : size === "md" ? 30 : size === "lg" ? 40 : 50)}px`,
								height: `${ring * 20 + (size === "sm" ? 20 : size === "md" ? 30 : size === "lg" ? 40 : 50)}px`,
							}}
							animate={{
								opacity: [0, 0.6, 0],
								scale: [0.8, 1.2, 1.4],
							}}
							transition={{
								duration: 2,
								repeat: Number.POSITIVE_INFINITY,
								delay: ring * 0.3,
								ease: "easeOut",
							}}
						/>
					))}
				</div>

				{text && (
					<motion.p
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className={cn("text-green-600 dark:text-green-400 font-medium text-center", textSizeClasses[size])}
					>
						{text}
					</motion.p>
				)}
			</div>
		)
	}

	// Success loader with sparkles
	if (variant === "success") {
		return (
			<div className={cn("flex flex-col items-center justify-center", containerSizeClasses[size], className)}>
				<div className="relative">
					<motion.div
						initial={{ scale: 0, rotate: -180 }}
						animate={{ scale: 1, rotate: 0 }}
						transition={{
							type: "spring",
							stiffness: 200,
							damping: 10,
						}}
					>
						<Trophy className={cn("text-yellow-500 dark:text-yellow-400", sizeClasses[size])} />
					</motion.div>

					{/* Sparkles */}
					{[...Array(6)].map((_, index) => (
						<motion.div
							key={index}
							className="absolute"
							style={{
								top: `${Math.sin((index * 60 * Math.PI) / 180) * 30 + 50}%`,
								left: `${Math.cos((index * 60 * Math.PI) / 180) * 30 + 50}%`,
							}}
							initial={{ opacity: 0, scale: 0 }}
							animate={{
								opacity: [0, 1, 0],
								scale: [0, 1, 0],
								rotate: 360,
							}}
							transition={{
								duration: 2,
								repeat: Number.POSITIVE_INFINITY,
								delay: index * 0.2,
								ease: "easeInOut",
							}}
						>
							<Sparkles className="w-3 h-3 text-yellow-400 dark:text-yellow-300" />
						</motion.div>
					))}
				</div>

				{text && (
					<motion.p
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.5 }}
						className={cn("text-yellow-600 dark:text-yellow-400 font-medium text-center", textSizeClasses[size])}
					>
						{text}
					</motion.p>
				)}
			</div>
		)
	}

	// Minimal loader
	if (variant === "minimal") {
		return (
			<div className={cn("flex items-center justify-center gap-1", className)}>
				{[0, 1, 2].map((index) => (
					<motion.div
						key={index}
						className={cn(
							"bg-blue-600 dark:bg-blue-400 rounded-full",
							size === "sm" ? "w-2 h-2" : size === "md" ? "w-3 h-3" : size === "lg" ? "w-4 h-4" : "w-5 h-5",
						)}
						animate={{
							y: [0, -10, 0],
							opacity: [0.5, 1, 0.5],
						}}
						transition={{
							duration: 1,
							repeat: Number.POSITIVE_INFINITY,
							delay: index * 0.2,
							ease: "easeInOut",
						}}
					/>
				))}
				{text && (
					<span className={cn("ml-2 text-gray-600 dark:text-gray-300 font-medium", textSizeClasses[size])}>{text}</span>
				)}
			</div>
		)
	}

	return null
}

// Specialized loaders for specific use cases
export function QuizLoader({
	text = "Loading quiz...",
	size = "lg",
}: { text?: string; size?: "sm" | "md" | "lg" | "xl" }) {
	return <Loader variant="quiz" size={size} text={text} />
}

export function ThinkingLoader({
	text = "Processing...",
	size = "md",
}: { text?: string; size?: "sm" | "md" | "lg" | "xl" }) {
	return <Loader variant="thinking" size={size} text={text} />
}

export function ProcessingLoader({
	text = "Analyzing results...",
	size = "md",
}: { text?: string; size?: "sm" | "md" | "lg" | "xl" }) {
	return <Loader variant="processing" size={size} text={text} />
}

export function SuccessLoader({ text = "Success!", size = "lg" }: { text?: string; size?: "sm" | "md" | "lg" | "xl" }) {
	return <Loader variant="success" size={size} text={text} />
}

export function MinimalLoader({ text, size = "sm" }: { text?: string; size?: "sm" | "md" | "lg" | "xl" }) {
	return <Loader variant="minimal" size={size} text={text} />
}

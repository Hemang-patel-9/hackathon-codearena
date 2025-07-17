"use client"

import { Brain, Users, Trophy, Zap, Target, Gamepad2, Sparkles, Star } from "lucide-react"
import { useEffect, useState } from "react"

export function FloatingIcons() {
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			setMousePosition({ x: e.clientX, y: e.clientY })
		}

		window.addEventListener("mousemove", handleMouseMove)
		return () => window.removeEventListener("mousemove", handleMouseMove)
	}, [])

	const icons = [
		{ Icon: Brain, position: "top-10 left-10", delay: "0s", color: "text-purple-500" },
		{ Icon: Users, position: "top-20 right-20", delay: "0.5s", color: "text-blue-500" },
		{ Icon: Trophy, position: "top-40 left-1/4", delay: "1s", color: "text-yellow-500" },
		{ Icon: Zap, position: "top-32 right-1/3", delay: "1.5s", color: "text-green-500" },
		{ Icon: Target, position: "top-60 left-20", delay: "2s", color: "text-red-500" },
		{ Icon: Gamepad2, position: "top-52 right-10", delay: "2.5s", color: "text-indigo-500" },
		{ Icon: Sparkles, position: "top-16 left-1/3", delay: "3s", color: "text-pink-500" },
		{ Icon: Star, position: "top-44 right-1/4", delay: "3.5s", color: "text-cyan-500" },
	]

	return (
		<div className="absolute inset-0 pointer-events-none overflow-hidden">
			{icons.map(({ Icon, position, delay, color }, index) => (
				<div
					key={index}
					className={`absolute ${position} opacity-30 dark:opacity-20 transition-all duration-300`}
					style={{
						animationDelay: delay,
						transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`,
					}}
				>
					<Icon
						className={`w-8 h-8 ${color} animate-float-complex hover:scale-125 transition-transform duration-300`}
					/>
				</div>
			))}

			{/* Additional animated particles */}
			{Array.from({ length: 15 }).map((_, i) => (
				<div
					key={`particle-${i}`}
					className="absolute w-1 h-1 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full animate-twinkle"
					style={{
						left: `${Math.random() * 100}%`,
						top: `${Math.random() * 100}%`,
						animationDelay: `${Math.random() * 3}s`,
						animationDuration: `${2 + Math.random() * 3}s`,
					}}
				/>
			))}
		</div>
	)
}

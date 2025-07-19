"use client"

import { Button } from "@/components/ui/button"
import { Play, Sparkles, Users, Trophy, Brain, ArrowRight } from "lucide-react"
import { FloatingIcons } from "./floating-icons"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

export function HeroContent() {
	const [isVisible, setIsVisible] = useState(false)

	const nav = useNavigate();

	useEffect(() => {
		setIsVisible(true)
	}, [])

	return (
		<div className="text-center max-w-6xl mx-auto relative">
			<FloatingIcons />

			{/* Badge with enhanced animation */}
			<div
				className={`inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 dark:from-purple-400/20 dark:to-blue-400/20 border border-purple-200 dark:border-purple-700 rounded-full px-4 py-2 mb-8 transition-all duration-1000 ${isVisible ? "animate-bounce-in scale-100 opacity-100" : "scale-0 opacity-0"}`}
			>
				<Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400 animate-spin-slow" />
				<span className="text-sm font-medium text-purple-700 dark:text-purple-300">AI-Powered Quiz Revolution</span>
				<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
			</div>

			{/* Main Heading with typewriter effect */}
			<h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 bg-gradient-to-r from-gray-900 via-purple-800 to-blue-800 dark:from-white dark:via-purple-300 dark:to-blue-300 bg-clip-text text-transparent leading-tight">
				<span
					className={`block transition-all duration-800 ${isVisible ? "animate-slide-up opacity-100" : "translate-y-10 opacity-0"}`}
				>
					Real-Time
				</span>
				<span
					className={`block transition-all duration-800 delay-300 ${isVisible ? "animate-slide-up opacity-100" : "translate-y-10 opacity-0"}`}
				>
					AI Quiz
				</span>
				<span
					className={`block bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text transition-all duration-800 delay-500 ${isVisible ? "animate-slide-up opacity-100" : "translate-y-10 opacity-0"}`}
				>
					Platform
				</span>
			</h1>

			{/* Subtitle with fade-in */}
			<p
				className={`text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed transition-all duration-1000 delay-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
			>
				Create, host, and participate in interactive quizzes powered by AI. Experience real-time multiplayer gameplay
				with live scoreboards and instant feedback.
			</p>

			{/* Enhanced CTA Buttons */}
			<div
				className={`flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 transition-all duration-1000 delay-900 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
			>
				<Button
					size="lg"
					className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-2xl transform hover:scale-110 transition-all duration-300 group relative overflow-hidden"
				>
					<div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
					<Play className="w-5 h-5 mr-2 group-hover:animate-pulse relative z-10" />
					<span className="relative z-10">Start Quiz Now</span>
					<ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300 relative z-10" />
				</Button>

				<Button
					variant="outline"
					size="lg"
					className="border-2 border-purple-300 dark:border-purple-600 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300 hover:scale-110 bg-transparent group relative overflow-hidden"
				>
					<div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
					<Brain className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300 relative z-10" />
					<span className="relative z-10">Generate AI Quiz</span>
				</Button>
			</div>

			{/* Enhanced Quick Features */}
			<div
				className={`flex flex-wrap justify-center gap-6 text-sm text-gray-600 dark:text-gray-400 transition-all duration-1000 delay-1100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
			>
				{[
					{ icon: Users, text: "Multiplayer Support", color: "text-blue-500" },
					{ icon: Trophy, text: "Live Leaderboards", color: "text-yellow-500" },
					{ icon: Sparkles, text: "AI-Generated Questions", color: "text-purple-500" },
				].map((item, index) => (
					<div key={index} className="flex items-center gap-2 group hover:scale-105 transition-transform duration-300">
						<item.icon className={`w-4 h-4 ${item.color} group-hover:animate-bounce`} />
						<span className="group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors duration-300">
							{item.text}
						</span>
					</div>
				))}
			</div>
		</div>
	)
}

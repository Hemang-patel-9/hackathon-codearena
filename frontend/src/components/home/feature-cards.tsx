"use client"

import { Brain, Users, Trophy, Zap, Upload, BarChart3 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useState } from "react"

export function FeatureCards() {
	const [visibleCards, setVisibleCards] = useState<number[]>([])

	const features = [
		{
			icon: Brain,
			title: "AI Quiz Generation",
			description: "Generate quizzes instantly with AI prompts or upload CSV files",
			gradient: "from-purple-500 to-pink-500",
		},
		{
			icon: Users,
			title: "Real-time Multiplayer",
			description: "Compete with friends in synchronized live quiz sessions",
			gradient: "from-blue-500 to-cyan-500",
		},
		{
			icon: Trophy,
			title: "Live Leaderboards",
			description: "Track rankings and scores updated in real-time",
			gradient: "from-yellow-500 to-orange-500",
		},
		{
			icon: Zap,
			title: "Instant Feedback",
			description: "Get immediate answers and AI-powered explanations",
			gradient: "from-green-500 to-emerald-500",
		},
		{
			icon: Upload,
			title: "Easy Quiz Creation",
			description: "Upload questions via CSV or create with our intuitive editor",
			gradient: "from-indigo-500 to-purple-500",
		},
		{
			icon: BarChart3,
			title: "Advanced Analytics",
			description: "Detailed insights on performance and engagement metrics",
			gradient: "from-red-500 to-pink-500",
		},
	]

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const index = Number.parseInt(entry.target.getAttribute("data-index") || "0")
						setVisibleCards((prev) => [...prev, index])
					}
				})
			},
			{ threshold: 0.3 },
		)

		const cards = document.querySelectorAll(".feature-card")
		cards.forEach((card) => observer.observe(card))

		return () => observer.disconnect()
	}, [])

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
			{features.map((feature, index) => (
				<Card
					key={index}
					data-index={index}
					className={`feature-card group hover:scale-105 transition-all duration-500 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-white/20 dark:border-gray-700/50 hover:shadow-2xl hover:bg-white/80 dark:hover:bg-gray-800/80 ${visibleCards.includes(index) ? "animate-slide-up-fade opacity-100" : "opacity-0 translate-y-10"
						}`}
					style={{ animationDelay: `${index * 0.1}s` }}
				>
					<CardContent className="p-6 text-center relative overflow-hidden">
						{/* Hover effect background */}
						<div
							className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
						></div>

						<div
							className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${feature.gradient} p-4 group-hover:animate-pulse group-hover:scale-110 transition-all duration-500 relative z-10`}
						>
							<feature.icon className="w-8 h-8 text-white group-hover:rotate-12 transition-transform duration-300" />
						</div>
						<h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-purple-600 group-hover:to-blue-600 transition-all duration-300">
							{feature.title}
						</h3>
						<p className="text-gray-600 dark:text-gray-400 leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
							{feature.description}
						</p>
					</CardContent>
				</Card>
			))}
		</div>
	)
}

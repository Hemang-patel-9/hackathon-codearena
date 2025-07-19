"use client"

import { TrendingUp, Users, Clock, Award } from "lucide-react"
import { useEffect, useState } from "react"

export function StatsSection({ quizAnalytics, userAnalytics }: any) {
	const [isVisible, setIsVisible] = useState(false)
	// const [counts, setCounts] = useState({ users: 0, quizzes: 0, satisfaction: 0 })


	const stats = [
		{
			icon: Users,
			value: userAnalytics.totalUsers,
			label: "Active Players",
			color: "text-blue-500",
			countKey: "users",
			target: userAnalytics.totalUsers
		},
		{
			icon: TrendingUp,
			value: quizAnalytics.totalQuizzes,
			label: "Quizzes Created",
			color: "text-green-500",
			countKey: "quizzes",
			target: quizAnalytics.totalQuizzes,
		},
		{
			icon: Clock,
			value: quizAnalytics.activeQuizzes,
			label: "Active QUizzes",
			color: "text-purple-500",
			countKey: null,
			target: quizAnalytics.activeQuizzes
		},
		{
			icon: Award,
			value: userAnalytics.verifiedUsers,
			label: "Verifies User",
			color: "text-yellow-500",
			countKey: "satisfaction",
			target: 95,
		},
	]

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setIsVisible(true)
					// Animate counters
					stats.forEach((stat) => {
						if (stat.countKey && stat.target > 0) {
							animateCounter(stat.countKey, stat.target)
						}
					})
				}
			},
			{ threshold: 0.5 },
		)

		const element = document.getElementById("stats-section")
		if (element) observer.observe(element)

		return () => observer.disconnect()
	}, [])

	const animateCounter = (key: string, target: number) => {
		let current = 0
		const increment = target / 100
		const timer = setInterval(() => {
			current += increment
			if (current >= target) {
				current = target
				clearInterval(timer)
			}
			setCounts((prev) => ({ ...prev, [key]: Math.floor(current) }))
		}, 20)
	}

	return (
		<div id="stats-section" className="scroll-animate grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
			{stats.map(({ icon: Icon, value, label, color }, index) => (
				<div
					key={index}
					className={`text-center group hover:scale-110 transition-all duration-500 ${isVisible ? "animate-bounce-in" : "opacity-0 scale-0"}`}
					style={{ animationDelay: `${index * 0.2}s` }}
				>
					<div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-gray-700/50 shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:bg-white/70 dark:group-hover:bg-gray-800/70">
						<Icon
							className={`w-8 h-8 ${color} mx-auto mb-3 group-hover:animate-bounce transition-transform duration-300 group-hover:scale-125`}
						/>
						<div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
							{/* {countKey
								? countKey === "satisfaction"
									? `${counts[countKey]}%`
									: countKey === "users"
										? `${Math.floor(counts[countKey] / 1000)}K+`
										: `${Math.floor(counts[countKey] / 1000)}K+`
								: value} */}
								{value} + 
						</div>
						<div className="text-sm text-gray-600 dark:text-gray-400">{label}</div>
					</div>
				</div>
			))}
		</div>
	)
}

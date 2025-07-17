"use client"

import { useEffect, useState } from "react"

export function AnimatedBackground() {
	const [scrollY, setScrollY] = useState(0)

	useEffect(() => {
		const handleScroll = () => setScrollY(window.scrollY)
		window.addEventListener("scroll", handleScroll)
		return () => window.removeEventListener("scroll", handleScroll)
	}, [])

	return (
		<div className="absolute inset-0 overflow-hidden">
			{/* Enhanced Gradient Orbs with parallax */}
			<div
				className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/30 to-blue-400/30 rounded-full blur-3xl animate-pulse-slow parallax"
				data-speed="0.3"
				style={{ transform: `translateY(${scrollY * 0.3}px)` }}
			></div>
			<div
				className="absolute top-3/4 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-400/30 to-cyan-400/30 rounded-full blur-3xl animate-pulse-slow animation-delay-1000 parallax"
				data-speed="0.5"
				style={{ transform: `translateY(${scrollY * 0.5}px)` }}
			></div>
			<div
				className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse-slow animation-delay-2000 parallax"
				data-speed="0.2"
				style={{ transform: `translate(-50%, -50%) translateY(${scrollY * 0.2}px)` }}
			></div>

			{/* Enhanced Animated Grid */}
			<div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10 animate-grid-move"></div>

			{/* Enhanced Floating Particles */}
			<div className="absolute inset-0">
				{Array.from({ length: 30 }).map((_, i) => (
					<div
						key={i}
						className="absolute bg-gradient-to-r from-purple-400/40 to-blue-400/40 rounded-full animate-float-random"
						style={{
							width: `${2 + Math.random() * 4}px`,
							height: `${2 + Math.random() * 4}px`,
							left: `${Math.random() * 100}%`,
							top: `${Math.random() * 100}%`,
							animationDelay: `${Math.random() * 5}s`,
							animationDuration: `${3 + Math.random() * 4}s`,
						}}
					/>
				))}
			</div>

			{/* Animated waves */}
			<div className="absolute bottom-0 left-0 w-full h-32 opacity-20">
				<svg className="w-full h-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
					<path
						d="M0,60 C300,120 600,0 900,60 C1050,90 1150,30 1200,60 L1200,120 L0,120 Z"
						className="fill-purple-500/30 animate-wave"
					/>
					<path
						d="M0,80 C300,40 600,120 900,80 C1050,50 1150,110 1200,80 L1200,120 L0,120 Z"
						className="fill-blue-500/30 animate-wave-reverse"
					/>
				</svg>
			</div>
		</div>
	)
}

"use client"

import { Brain, Github, Twitter, Linkedin, Mail, Phone, MapPin, ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { useTheme } from "@/contexts/theme-context"

export function Footer() {
	const [isVisible, setIsVisible] = useState(false)
	const { theme } = useTheme();

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setIsVisible(true)
				}
			},
			{ threshold: 0.1 },
		)

		const element = document.getElementById("footer")
		if (element) observer.observe(element)

		return () => observer.disconnect()
	}, [])

	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: "smooth" })
	}

	return (
		<footer
			id="footer"
			className={`relative overflow-hidden transition-all duration-700 ${theme === "dark"
				? "bg-[#020817] text-white"
				: "bg-white text-gray-900"
				}`}
		>
			{/* Animated background elements */}
			<div className="absolute inset-0 overflow-hidden">
				<div className={`absolute top-0 left-1/4 w-64 h-64 rounded-full blur-3xl animate-pulse transition-all duration-700 ${theme === "dark" ? "bg-purple-500/10" : "bg-purple-500/20"
					}`}></div>
				<div className={`absolute bottom-0 right-1/4 w-80 h-80 rounded-full blur-3xl animate-pulse transition-all duration-700 ${theme === "dark" ? "bg-blue-500/10" : "bg-blue-500/20"
					}`} style={{ animationDelay: '1s' }}></div>
			</div>

			<div className="relative z-10 container mx-auto px-4 py-16">
				{/* Main Footer Content */}
				<div
					className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
						}`}
				>
					{/* Brand Section */}
					<div className="space-y-4">
						<div className="flex items-center gap-3 group cursor-pointer">
							<div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl p-2 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg group-hover:shadow-xl">
								<Brain className="w-6 h-6 text-white group-hover:animate-pulse" />
							</div>
							<span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
								XQuizz
							</span>
						</div>
						<p className={`leading-relaxed transition-colors duration-300 ${theme === "dark" ? "text-gray-300" : "text-gray-600"
							}`}>
							Revolutionizing learning through AI-powered real-time quizzes. Create, compete, and learn together.
						</p>
						<div className="flex space-x-4">
							{[
								{ Icon: Github, href: "#", label: "GitHub", color: "hover:bg-gray-600" },
								{ Icon: Twitter, href: "#", label: "Twitter", color: "hover:bg-blue-500" },
								{ Icon: Linkedin, href: "#", label: "LinkedIn", color: "hover:bg-blue-700" },
							].map(({ Icon, href, label, color }, index) => (
								<a
									key={index}
									href={href}
									className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-125 hover:-translate-y-1 group shadow-md hover:shadow-lg ${theme === "dark"
										? `bg-white/10 hover:bg-opacity-90 ${color}`
										: `bg-gray-200/70 hover:bg-opacity-90 ${color} hover:text-white`
										}`}
									aria-label={label}
								>
									<Icon className="w-5 h-5 group-hover:animate-bounce" />
								</a>
							))}
						</div>
					</div>

					{/* Quick Links */}
					<div
						className={`space-y-4 transition-all duration-1000 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
							}`}
					>
						<h3 className={`text-lg font-semibold mb-4 relative group cursor-pointer ${theme === "dark" ? "text-white" : "text-gray-900"
							}`}>
							Quick Links
							<div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300 group-hover:w-full"></div>
						</h3>
						<ul className="space-y-2">
							{["Home", "Create Quiz", "Join Quiz", "Leaderboard", "Analytics"].map((link, index) => (
								<li key={index}>
									<a
										href="#"
										className={`px-2 transition-all duration-300 hover:translate-x-2 inline-block relative group ${theme === "dark"
											? "text-gray-300 hover:text-purple-400"
											: "text-gray-600 hover:text-purple-600"
											}`}
									>
										<span className="relative z-10">{link}</span>
										<div className="absolute inset-0 w-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 transition-all duration-300 group-hover:w-full rounded"></div>
									</a>
								</li>
							))}
						</ul>
					</div>

					{/* Features */}
					<div
						className={`space-y-4 transition-all duration-1000 delay-400 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
							}`}
					>
						<h3 className={`text-lg font-semibold mb-4 relative group cursor-pointer ${theme === "dark" ? "text-white" : "text-gray-900"
							}`}>
							Features
							<div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 group-hover:w-full"></div>
						</h3>
						<ul className="space-y-2">
							{["AI Quiz Generation", "Real-time Multiplayer", "Live Scoring", "CSV Upload", "Mobile Support"].map(
								(feature, index) => (
									<li key={index}>
										<a
											href="#"
											className={`px-2 transition-all duration-300 hover:translate-x-2 inline-block relative group ${theme === "dark"
												? "text-gray-300 hover:text-blue-400"
												: "text-gray-600 hover:text-blue-600"
												}`}
										>
											<span className="relative z-10">{feature}</span>
											<div className="absolute inset-0 w-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 transition-all duration-300 group-hover:w-full rounded"></div>
										</a>
									</li>
								),
							)}
						</ul>
					</div>

					{/* Contact Info */}
					<div
						className={`space-y-4 transition-all duration-1000 delay-600 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
							}`}
					>
						<h3 className={`text-lg font-semibold mb-4 relative group cursor-pointer ${theme === "dark" ? "text-white" : "text-gray-900"
							}`}>
							Contact
							<div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-300 group-hover:w-full"></div>
						</h3>
						<div className="space-y-3">
							<div className={`flex items-center gap-3 transition-all duration-300 group cursor-pointer hover:translate-x-1 ${theme === "dark"
								? "text-gray-300 hover:text-white"
								: "text-gray-600 hover:text-gray-900"
								}`}>
								<Mail className="w-5 h-5 text-purple-400 group-hover:animate-pulse group-hover:scale-110 transition-all duration-300" />
								<span className="group-hover:underline">hello@xquizz.com</span>
							</div>
							<div className={`flex items-center gap-3 transition-all duration-300 group cursor-pointer hover:translate-x-1 ${theme === "dark"
								? "text-gray-300 hover:text-white"
								: "text-gray-600 hover:text-gray-900"
								}`}>
								<Phone className="w-5 h-5 text-blue-400 group-hover:animate-pulse group-hover:scale-110 transition-all duration-300" />
								<span className="group-hover:underline">+1 (555) 123-4567</span>
							</div>
							<div className={`flex items-center gap-3 transition-all duration-300 group cursor-pointer hover:translate-x-1 ${theme === "dark"
								? "text-gray-300 hover:text-white"
								: "text-gray-600 hover:text-gray-900"
								}`}>
								<MapPin className="w-5 h-5 text-green-400 group-hover:animate-pulse group-hover:scale-110 transition-all duration-300" />
								<span className="group-hover:underline">San Francisco, CA</span>
							</div>
						</div>
					</div>
				</div>

				{/* Newsletter Signup */}
				<div
					className={`backdrop-blur-sm rounded-2xl p-6 mb-8 border transition-all duration-1000 delay-800 hover:scale-[1.02] ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
						} ${theme === "dark"
							? "bg-white/5 border-white/10 hover:bg-white/10"
							: "bg-white/70 border-gray-200 hover:bg-white/90 shadow-lg"
						}`}
				>
					<div className="flex flex-col md:flex-row items-center justify-between gap-4">
						<div>
							<h3 className={`text-xl font-semibold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"
								}`}>
								Stay Updated
							</h3>
							<p className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"
								}`}>
								Get the latest updates on new features and quiz competitions.
							</p>
						</div>
						<div className="flex gap-2 w-full md:w-auto">
							<input
								type="email"
								placeholder="Enter your email"
								className={`flex-1 md:w-64 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 hover:scale-105 focus:scale-105 ${theme === "dark"
									? "bg-white/10 border-white/20 text-white placeholder-gray-400"
									: "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
									}`}
							/>
							<Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 px-6 py-2 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg text-white">
								Subscribe
							</Button>
						</div>
					</div>
				</div>

				{/* Bottom Bar */}
				<div
					className={`flex flex-col md:flex-row items-center justify-between pt-8 border-t transition-all duration-1000 delay-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
						} ${theme === "dark" ? "border-white/10" : "border-gray-200"
						}`}
				>
					<p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"
						}`}>
						© 2024 XQuizz. All rights reserved. Built with ❤️ for learners worldwide.
					</p>
					<div className="flex items-center gap-4 mt-4 md:mt-0">
						<a href="#" className={`text-sm transition-all duration-300 hover:underline hover:scale-105 ${theme === "dark"
							? "text-gray-400 hover:text-white"
							: "text-gray-500 hover:text-gray-900"
							}`}>
							Privacy Policy
						</a>
						<a href="#" className={`text-sm transition-all duration-300 hover:underline hover:scale-105 ${theme === "dark"
							? "text-gray-400 hover:text-white"
							: "text-gray-500 hover:text-gray-900"
							}`}>
							Terms of Service
						</a>
						<Button
							onClick={scrollToTop}
							size="sm"
							variant="outline"
							className={`transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:shadow-lg ${theme === "dark"
								? "border-white/20 text-white hover:bg-white/10 bg-transparent"
								: "border-gray-300 text-gray-600 hover:bg-gray-100 bg-white/50"
								}`}
						>
							<ArrowUp className="w-4 h-4" />
						</Button>
					</div>
				</div>
			</div>
		</footer>
	)
}
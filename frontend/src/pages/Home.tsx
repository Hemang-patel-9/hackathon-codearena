"use client"

import { useEffect, useState } from "react"
import { AnimatedBackground } from "@/components/home/animated-background"
import { HeroContent } from "@/components/home/hero-content"
import { FeatureCards } from "@/components/home/feature-cards"
import { StatsSection } from "@/components/home/stats-section"
import { useAuth } from "@/contexts/authContext"
import type { Result } from "@/types/response"
import { getUserAnalytics, getQuizAnalytics } from "@/api/analytics"
import type { QuizAnalyticsData, UserAnalyticsData } from '@/types/analytics';

export function HeroSection() {

	const { token } = useAuth();
	const [quizAnalytics, setQuizAnalytics] = useState<QuizAnalyticsData[]>([]);
	const [userAnalytics, setUserAnalytics] = useState<UserAnalyticsData[]>([]);

	useEffect(() => {
		const fetchQuizzes = async () => {
			try {
				const response: Result = await getQuizAnalytics();
				setQuizAnalytics(response.data || []);
				const responseUser: Result = await getUserAnalytics();
				setUserAnalytics(responseUser.data || []);
			}
			catch (error) {
				console.error(error);
			}
		};

		fetchQuizzes();
	}, [token]);

	useEffect(() => {
		// Initialize scroll animations
		const observerOptions = {
			threshold: 0.1,
			rootMargin: "0px 0px -50px 0px",
		}

		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add("animate-in")
				}
			})
		}, observerOptions)

		// Observe all elements with scroll-animate class
		const animateElements = document.querySelectorAll(".scroll-animate")
		animateElements.forEach((el) => observer.observe(el))

		// Parallax effect on scroll
		const handleScroll = () => {
			const scrolled = window.pageYOffset
			const parallaxElements = document.querySelectorAll(".parallax")

			parallaxElements.forEach((element: any) => {
				const speed = element.getAttribute("data-speed") || "0.5"
				const yPos = -(scrolled * Number.parseFloat(speed))
				element.style.transform = `translateY(${yPos}px)`
			})
		}

		window.addEventListener("scroll", handleScroll)

		return () => {
			observer.disconnect()
			window.removeEventListener("scroll", handleScroll)
		}
	}, [])

	return (
		<section className="relative min-h-screen overflow-hidden">
			<AnimatedBackground />

			{/* Main Hero Content */}
			<div className="relative z-10 container mx-auto px-4 py-20">
				<HeroContent />
				<StatsSection quizAnalytics={quizAnalytics} userAnalytics={userAnalytics} />
				<FeatureCards />
			</div>
		</section>
	)
}

"use client"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
	LayoutDashboard,
	Receipt,
	FileText,
	Users,
	BarChart3,
	CreditCard,
	ChevronLeft,
	ChevronRight,
	Home,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SidebarProps {
	onClose?: () => void
}

const navigationItems = [
	{ name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
	{ name: "Home", href: "/home", icon: Home },
	{ name: "Quizes", href: "/quiz", icon: Receipt },
	{ name: "Create", href: "/quiz-creation", icon: FileText },
	{ name: "Clients", href: "/clients", icon: Users },
	{ name: "Reports", href: "/reports", icon: BarChart3 },
	{ name: "Payments", href: "/payments", icon: CreditCard },
]

export default function Sidebar({ onClose }: SidebarProps) {
	const [isExpanded, setIsExpanded] = useState(true)
	const [hoveredItem, setHoveredItem] = useState<string | null>(null)
	const location = useLocation()

	const toggleExpanded = () => {
		setIsExpanded(!isExpanded)
	}

	return (
		<motion.div
			initial={{ x: -300 }}
			animate={{ x: 0 }}
			transition={{ type: "spring", damping: 30, stiffness: 300 }}
			className={cn(
				"bg-card border-r mt-1 border-border h-screen transition-all duration-300 ease-in-out relative",
				isExpanded ? "w-64" : "w-16",
			)}
		>
			{/* Toggle Button */}
			<Button
				variant="ghost"
				size="icon"
				onClick={toggleExpanded}
				className="absolute -right-3 top-20 z-10 h-6 w-6 rounded-full border border-border bg-background shadow-md hidden lg:flex"
			>
				{isExpanded ? <ChevronLeft className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
			</Button>

			<div className="p-4">
				<AnimatePresence mode="wait">
					{isExpanded ? (
						<motion.h2
							key="expanded"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.2 }}
							className="text-lg font-semibold text-foreground mb-6"
						>
							Navigation
						</motion.h2>
					) : (
						<motion.div
							key="collapsed"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.2 }}
							className="h-6 mb-6"
						/>
					)}
				</AnimatePresence>

				<nav className="space-y-2">
					{navigationItems.map((item) => {
						const isActive = location.pathname.indexOf(item.href) !== -1
						const isHovered = hoveredItem === item.name
						const Icon = item.icon

						return (
							<motion.div
								key={item.name}
								className="relative"
								onMouseEnter={() => setHoveredItem(item.name)}
								onMouseLeave={() => setHoveredItem(null)}
							>
								{/* Curved background effect */}
								<motion.div
									className="absolute inset-0 bg-accent/50 rounded-l-lg"
									initial={{ scaleX: 0, transformOrigin: "left" }}
									animate={{
										scaleX: isHovered ? 1 : 0,
										borderRadius: isHovered ? "0.5rem 2rem 2rem 0.5rem" : "0.5rem"
									}}
									transition={{
										duration: 0.3,
										ease: "easeInOut",
										type: "spring",
										stiffness: 300,
										damping: 30
									}}
								/>

								<Link
									to={item.href}
									onClick={onClose}
									className={cn(
										"relative flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-300 z-10",
										isActive
											? "bg-primary text-primary-foreground shadow-lg"
											: "text-muted-foreground hover:text-foreground",
										!isExpanded && "justify-center",
									)}
								>
									{/* Icon with enhanced hover effect */}
									<motion.div
										className="flex items-center justify-center"
										animate={{
											scale: isHovered ? 1.4 : 1,
											// rotate: isHovered ? 5 : 0,
										}}
										transition={{
											duration: 0.3,
											ease: "easeInOut",
											type: "spring",
											stiffness: 400,
											damping: 25
										}}
									>
										<Icon className="h-5 w-5 flex-shrink-0" />
									</motion.div>

									<AnimatePresence>
										{isExpanded && (
											<motion.span
												initial={{ opacity: 0, width: 0 }}
												animate={{ opacity: 1, width: "auto" }}
												exit={{ opacity: 0, width: 0 }}
												transition={{ duration: 0.2 }}
												className="font-medium whitespace-nowrap overflow-hidden"
											>
												{item.name}
											</motion.span>
										)}
									</AnimatePresence>
								</Link>

								{/* Additional glow effect on hover */}
								<motion.div
									className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/20 to-accent/40 rounded-l-lg pointer-events-none"
									initial={{ opacity: 0, scaleX: 0 }}
									animate={{
										opacity: isHovered ? 1 : 0,
										scaleX: isHovered ? 1 : 0,
										borderRadius: isHovered ? "0.5rem 2rem 2rem 0.5rem" : "0.5rem"
									}}
									transition={{
										duration: 0.3,
										ease: "easeInOut",
										delay: isHovered ? 0.1 : 0
									}}
								/>
							</motion.div>
						)
					})}
				</nav>
			</div>
		</motion.div>
	)
}
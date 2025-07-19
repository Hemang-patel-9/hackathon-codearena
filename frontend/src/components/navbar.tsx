"use client"

import { Bell, LogIn, Menu, Moon, Sun, User, LayoutDashboard, BookOpen, PlusCircle } from "lucide-react"
import { motion } from "framer-motion"
import { useTheme } from "../contexts/theme-context"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/authContext"
import { useNavigate } from "react-router-dom"

interface NavbarProps {
	onMenuClick: () => void
}

export default function Navbar({ onMenuClick }: NavbarProps) {
	const { theme, toggleTheme } = useTheme()
	const { logout, user } = useAuth()
	const navigate = useNavigate()

	const navItems = [
		{ name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
		{ name: "Quiz", path: "/quiz", icon: BookOpen },
		{ name: "Create Quiz", path: "/quiz-creation", icon: PlusCircle },
	]

	return (
		<motion.nav
			initial={{ y: -100 }}
			animate={{ y: 0 }}
			transition={{ type: "spring", damping: 30, stiffness: 300 }}
			className="fixed top-0 left-0 right-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border"
		>
			<div className="flex items-center justify-between px-4 h-16">
				{/* Left Section */}
				<div className="flex items-center space-x-4">
					<Button variant="ghost" size="icon" onClick={onMenuClick} className="lg:hidden">
						<Menu className="h-5 w-5" />
					</Button>
					<motion.div
						whileHover={{ scale: 1.05 }}
						className="flex items-center cursor-pointer space-x-2"
						onClick={() => {
							navigate("/")
						}}
					>
						<div className="w-8 h-8 bg-gradient-to-tr from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
							<span className="text-foreground font-bold text-sm">XQ</span>
						</div>
						<span className="font-bold text-xl hidden sm:block">XQuizz</span>
					</motion.div>
				</div>

				{/* Center Navigation - Hidden on mobile */}
				<div className="hidden lg:flex items-center space-x-1">
					{navItems.map((item, index) => {
						const Icon = item.icon
						return (
							<motion.div
								key={item.name}
								initial={{ opacity: 0, y: -20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: index * 0.1 }}
							>
								<Button
									variant="ghost"
									onClick={() => navigate(item.path)}
									className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-blue-500/10 transition-all duration-200 group"
								>
									<Icon className="h-4 w-4 text-foreground group-hover:text-purple-600 transition-colors" />
									<span className="text-sm font-medium text-foreground group-hover:text-purple-600 transition-colors">
										{item.name}
									</span>
								</Button>
							</motion.div>
						)
					})}
				</div>

				{/* Right Section */}
				<div className="flex items-center space-x-2">
					{/* Notifications */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className="relative hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-blue-500/10 transition-all duration-200"
							>
								<Bell className="h-5 w-5" />
								<motion.span
									initial={{ scale: 0 }}
									animate={{ scale: 1 }}
									className="absolute -top-1 -right-1 h-3 w-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full text-xs flex items-center justify-center text-white"
								>
									3
								</motion.span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-80 bg-background border-border">
							<DropdownMenuItem className="hover:bg-gradient-to-r hover:from-purple-500/5 hover:to-blue-500/5">
								<div className="flex flex-col space-y-1">
									<p className="text-sm font-medium text-foreground">New project assigned</p>
									<p className="text-xs text-muted-foreground">2 minutes ago</p>
								</div>
							</DropdownMenuItem>
							<DropdownMenuItem className="hover:bg-gradient-to-r hover:from-purple-500/5 hover:to-blue-500/5">
								<div className="flex flex-col space-y-1">
									<p className="text-sm font-medium text-foreground">Invoice payment received</p>
									<p className="text-xs text-muted-foreground">1 hour ago</p>
								</div>
							</DropdownMenuItem>
							<DropdownMenuItem className="hover:bg-gradient-to-r hover:from-purple-500/5 hover:to-blue-500/5">
								<div className="flex flex-col space-y-1">
									<p className="text-sm font-medium text-foreground">Client meeting scheduled</p>
									<p className="text-xs text-muted-foreground">3 hours ago</p>
								</div>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>

					{/* Theme Toggle */}
					<Button
						variant="ghost"
						size="icon"
						onClick={toggleTheme}
						className="hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-blue-500/10 transition-all duration-200"
					>
						<motion.div initial={false} animate={{ rotate: theme === "dark" ? 180 : 0 }} transition={{ duration: 0.3 }}>
							{theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
						</motion.div>
					</Button>

					{/* Login/Profile */}
					{user ? (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									className="hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-blue-500/10 transition-all duration-200"
								>
									{user ? (
										<motion.img
											whileHover={{ scale: 1.1 }}
											src={`${import.meta.env.VITE_APP_API_URL}/${user.avatar}`}
											alt={user?.username}
											className="rounded-full h-5 w-5 border border-purple-500/20"
										/>
									) : (
										<User className="h-5 w-5" />
									)}
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="bg-background border-border">
								<div className="px-3 py-2 border-b border-border mb-1">
									<span className="font-semibold text-sm text-foreground">{user?.username}</span>
								</div>
								<DropdownMenuItem
									onClick={() => {
										navigate("/profile")
									}}
									className="hover:bg-gradient-to-r hover:from-purple-500/5 hover:to-blue-500/5"
								>
									Profile
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => {
										logout()
										navigate("/")
									}}
									className="hover:bg-gradient-to-r hover:from-purple-500/5 hover:to-blue-500/5"
								>
									Logout
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					) : (
						<Button
							variant="ghost"
							size="icon"
							onClick={() => (window.location.href = "/login")}
							className="hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-blue-500/10 transition-all duration-200"
						>
							<LogIn className="h-5 w-5" />
						</Button>
					)}
				</div>
			</div>
		</motion.nav>
	)
}

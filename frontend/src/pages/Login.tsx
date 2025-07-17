"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle, Github, Facebook } from 'lucide-react'
import type { Result } from "@/types/response"
import { loginUser } from "@/api/user"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/authContext"
import { useNavigate } from "react-router-dom"
import { useTheme } from "@/contexts/theme-context"

interface LoginFormData {
	email: string
	password: string
}

interface FormErrors {
	[key: string]: string
}

declare global {
	interface Window {
		google: any;
	}
}

export default function LoginPage() {
	const [formData, setFormData] = useState<LoginFormData>({
		email: "",
		password: "",
	})
	const { login, token } = useAuth();
	const { theme } = useTheme();
	const [errors, setErrors] = useState<FormErrors>({})
	const [showPassword, setShowPassword] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [rememberMe, setRememberMe] = useState(false)
	const { toast } = useToast();
	const navigate = useNavigate();
	const validateForm = (): boolean => {
		const newErrors: FormErrors = {}

		// Email validation
		if (!formData.email) {
			newErrors.email = "Email is required"
		} else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
			newErrors.email = "Please enter a valid email address"
		}

		// Password validation
		if (!formData.password) {
			newErrors.password = "Password is required"
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleInputChange = (field: keyof LoginFormData, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }))

		// Clear error when user starts typing
		if (errors[field]) {
			setErrors((prev) => ({ ...prev, [field]: "" }))
		}
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!validateForm()) return

		setIsLoading(true)

		const result: Result = await loginUser(formData);
		console.log(result);
		if (result.error == null) {
			toast({
				title: "Login Successful!",
				description: result.message,
				variant: "success"
			});
			login(result.data.user, result.data.token);
			navigate("/dashboard");
		}
		else {
			toast({
				title: "Login Failed!",
				description: result.error,
				variant: "destructive"
			});
		}
		setIsLoading(false)
	}

	const handleSocialLogin = async (provider: string) => {
		try {
			console.log(`Login with ${provider}`)
			if (provider === "github") {
				// window.location.href = "http://localhost:8000/user/auth/github";
				const clientID = import.meta.env.VITE_APP_GITHUB_CLIENT_ID;
				const redirectURI = `${import.meta.env.VITE_APP_API_URL}/user/auth/github/callback`;
				window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientID}&redirect_uri=${redirectURI}`;
			}
			else if (provider == "facebook") {
				const redirectURI = `${import.meta.env.VITE_APP_API_URL}/user/auth/facebook`;
				window.location.href = redirectURI;
			}
		} catch (error) {
			console.error(`${provider} login error:`, error)
		}
	}

	const containerVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.6, ease: "easeOut" },
		},
	}

	const formVariants = {
		hidden: { opacity: 0, x: 20 },
		visible: {
			opacity: 1,
			x: 0,
			transition: { duration: 0.4, ease: "easeOut", delay: 0.2 },
		},
	}

	const socialButtonVariants = {
		hidden: { opacity: 0, y: 10 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.3, ease: "easeOut" },
		},
		hover: {
			scale: 1.02,
			transition: { duration: 0.2 },
		},
	}

	const handleCredentialResponse = async (response: any) => {
		setIsLoading(true);
		try {
			const res = await fetch(`${import.meta.env.VITE_APP_API_URL}/user/auth/google`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ credential: response.credential }),
			});

			const result: Result = await res.json();

			if (result.error == null) {
				toast({
					title: "Login Successful!",
					description: result.message,
					variant: "success"
				});
				login(result.data.user, result.data.token);
				navigate("/profile");
			}
			else {
				toast({
					title: "Login Failed!",
					description: result.error,
					variant: "destructive"
				});
			}
		} catch (error) {
			toast({
				title: "Login Failed!",
				description: "Please try manual login!",
				variant: "destructive"
			});
			console.error('Login failed', error);
		}
		finally {
			setIsLoading(true);
		}
	};

	useEffect(() => {
		if (token) {
			toast({
				title: "Login Alert!",
				description: "You are already logged In.",
				variant: "default"
			})
			navigate("/dashboard");
		}
		window.google.accounts.id.initialize({
			client_id: import.meta.env.VITE_APP_GOOGLE_CLIENT_ID,
			callback: handleCredentialResponse,
		});

		window.google.accounts.id.renderButton(
			document.getElementById('google-signin'),
			{
				theme: theme === 'dark' ? 'filled_black' : 'outline',
				size: 'large',
				width: '100%',
				text: 'signin_with',
				shape: 'rectangular',
				logo_alignment: 'left',
			}
		);
	}, []);

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
			<motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full max-w-md">
				<Card className="shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
					<CardHeader className="text-center space-y-4">
						<motion.div
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
							className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center"
						>
							<LogIn className="w-8 h-8 text-white" />
						</motion.div>
						<CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
							Welcome Back
						</CardTitle>
						<CardDescription className="text-lg">Sign in to your account to continue</CardDescription>
					</CardHeader>

					<CardContent className="space-y-6">
						{/* Social Login Buttons */}
						<div className="space-y-3 w-full">
							<motion.div
								variants={socialButtonVariants}
								initial="hidden"
								animate="visible"
								className="w-full"
							>
								<div
									id="google-signin"
									className="w-full"
									style={{ minHeight: '44px' }}
								></div>
							</motion.div>
							<motion.div
								variants={socialButtonVariants}
								initial="hidden"
								animate="visible"
								transition={{ delay: 0.1 }}
								className="w-full"
							>
								<Button
									type="button"
									variant="outline"
									onClick={() => handleSocialLogin('github')}
									className="w-full flex items-center justify-center py-3 border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
								>
									<Github className="w-5 h-5 mr-2" />
									Continue with GitHub
								</Button>
							</motion.div>

							<motion.div
								variants={socialButtonVariants}
								initial="hidden"
								animate="visible"
								transition={{ delay: 0.1 }}
								className="w-full"
							>
								<Button
									type="button"
									variant="outline"
									onClick={() => handleSocialLogin('facebook')}
									className="w-full flex items-center justify-center py-3 border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
								>
									<Facebook className="w-5 h-5 mr-2" />
									Continue with Facebook
								</Button>
							</motion.div>
						</div>

						<div className="relative">
							<Separator />
							<div className="absolute inset-0 flex items-center justify-center">
								<span className="bg-white dark:bg-gray-800 px-4 text-sm text-gray-500 dark:text-gray-400">
									Or continue with email
								</span>
							</div>
						</div>

						{/* Login Form */}
						<motion.form
							onSubmit={handleSubmit}
							variants={formVariants}
							initial="hidden"
							animate="visible"
							className="space-y-6"
						>
							{/* General Error */}
							{errors.general && (
								<motion.div
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
								>
									<div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
										<AlertCircle className="w-5 h-5" />
										<span className="text-sm font-medium">{errors.general}</span>
									</div>
								</motion.div>
							)}

							{/* Email */}
							<div className="space-y-2">
								<Label htmlFor="email" className="flex items-center space-x-2">
									<Mail className="w-4 h-4" />
									<span>Email</span>
								</Label>
								<Input
									id="email"
									type="email"
									placeholder="john@example.com"
									value={formData.email}
									onChange={(e) => handleInputChange("email", e.target.value)}
									className={`transition-all duration-200 ${errors.email ? "border-red-500 focus:border-red-500" : "focus:border-blue-500"
										}`}
									required
									autoComplete="email"
								/>
								{errors.email && (
									<motion.p
										initial={{ opacity: 0, y: -10 }}
										animate={{ opacity: 1, y: 0 }}
										className="text-sm text-red-500 flex items-center space-x-1"
									>
										<AlertCircle className="w-4 h-4" />
										<span>{errors.email}</span>
									</motion.p>
								)}
							</div>

							{/* Password */}
							<div className="space-y-2">
								<Label htmlFor="password" className="flex items-center space-x-2">
									<Lock className="w-4 h-4" />
									<span>Password</span>
								</Label>
								<div className="relative">
									<Input
										id="password"
										type={showPassword ? "text" : "password"}
										placeholder="Enter your password"
										value={formData.password}
										onChange={(e) => handleInputChange("password", e.target.value)}
										className={`pr-10 transition-all duration-200 ${errors.password ? "border-red-500 focus:border-red-500" : "focus:border-blue-500"
											}`}
										required
										autoComplete="current-password"
									/>
									<button
										type="button"
										onClick={() => setShowPassword(!showPassword)}
										className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
									>
										{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
									</button>
								</div>
								{errors.password && (
									<motion.p
										initial={{ opacity: 0, y: -10 }}
										animate={{ opacity: 1, y: 0 }}
										className="text-sm text-red-500 flex items-center space-x-1"
									>
										<AlertCircle className="w-4 h-4" />
										<span>{errors.password}</span>
									</motion.p>
								)}
							</div>

							{/* Remember Me & Forgot Password */}
							<div className="flex items-center justify-between">
								<div className="flex items-center space-x-2">
									<input
										id="remember-me"
										type="checkbox"
										checked={rememberMe}
										onChange={(e) => setRememberMe(e.target.checked)}
										className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
									/>
									<Label htmlFor="remember-me" className="text-sm text-gray-600 dark:text-gray-400">
										Remember me
									</Label>
								</div>
								<a
									href="/forgot-password"
									className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
								>
									Forgot password?
								</a>
							</div>

							{/* Submit Button */}
							<Button
								type="submit"
								disabled={isLoading}
								className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:opacity-50"
							>
								{isLoading ? (
									<motion.div
										animate={{ rotate: 360 }}
										transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
										className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
									/>
								) : (
									<>
										<LogIn className="w-5 h-5 mr-2" />
										Sign In
									</>
								)}
							</Button>
						</motion.form>

						{/* Sign Up Link */}
						<div className="text-center">
							<p className="text-sm text-gray-600 dark:text-gray-400">
								Don't have an account?{" "}
								<a
									href="/signup"
									className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
								>
									Sign up
								</a>
							</p>
						</div>

						{/* Additional Links */}
						<div className="text-center space-y-2">
							<div className="flex justify-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
								<a href="/privacy" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
									Privacy Policy
								</a>
								<span>•</span>
								<a href="/terms" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
									Terms of Service
								</a>
								<span>•</span>
								<a href="/support" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
									Support
								</a>
							</div>
						</div>
					</CardContent>
				</Card>
			</motion.div>
		</div>
	)
}
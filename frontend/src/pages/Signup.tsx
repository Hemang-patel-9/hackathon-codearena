import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
	User,
	Mail,
	Lock,
	Eye,
	EyeOff,
	Github,
	Linkedin,
	Twitter,
	Globe,
	ImageIcon,
	UserPlus,
	CheckCircle,
	AlertCircle,
	X,
} from "lucide-react"
import { registerUser } from "@/api/user"
import type { Result } from "@/types/response"
import { useNavigate } from "react-router-dom"

interface FormData {
	username: string
	email: string
	password: string
	confirmPassword: string
	avatar: string
	bio: string
	socialLinks: {
		github: string
		linkedin: string
		twitter: string
		website: string
	}
}

interface FormErrors {
	[key: string]: string
}

export default function SignupPage() {
	const [formData, setFormData] = useState<FormData>({
		username: "",
		email: "",
		password: "",
		confirmPassword: "",
		avatar: "",
		bio: "",
		socialLinks: {
			github: "",
			linkedin: "",
			twitter: "",
			website: "",
		},
	})
	const navigate = useNavigate();
	const [errors, setErrors] = useState<FormErrors>({})
	const [showPassword, setShowPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [currentStep, setCurrentStep] = useState(1)
	const [avatarFile, setAvatarFile] = useState<File | null>(null)
	const [avatarPreview, setAvatarPreview] = useState<string>("")

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
		} else if (formData.password.length < 6) {
			newErrors.password = "Password must be at least 6 characters long"
		}

		// Confirm password validation
		if (formData.password !== formData.confirmPassword) {
			newErrors.confirmPassword = "Passwords do not match"
		}

		// Username validation (optional but if provided, must be valid)
		if (formData.username && formData.username.length > 50) {
			newErrors.username = "Username must be 50 characters or less"
		}

		// Bio validation
		if (formData.bio.length > 300) {
			newErrors.bio = "Bio must be 300 characters or less"
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleInputChange = (field: string, value: string) => {
		if (field.includes(".")) {
			const [parent, child] = field.split(".")
			setFormData((prev: any) => ({
				...prev,
				[parent]: {
					...prev[parent as keyof FormData],
					[child]: value,
				},
			}))
		} else {
			setFormData((prev) => ({ ...prev, [field]: value }))
		}

		// Clear error when user starts typing
		if (errors[field]) {
			setErrors((prev) => ({ ...prev, [field]: "" }))
		}
	}

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) {
			setAvatarFile(file)
			// Create preview URL
			const reader = new FileReader()
			reader.onloadend = () => {
				setAvatarPreview(reader.result as string)
			}
			reader.readAsDataURL(file)
		} else {
			setAvatarFile(null)
			setAvatarPreview("")
		}
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!validateForm()) return
		setIsLoading(true)

		try {
			const form = new FormData()
			form.append("username", formData.username)
			form.append("email", formData.email)
			form.append("password", formData.password)

			// Handle avatar file
			if (avatarFile) {
				form.append("avatar", avatarFile)
			}

			form.append("bio", formData.bio)

			// Flatten and append each social link individually
			form.append("socialLinks[github]", formData.socialLinks.github)
			form.append("socialLinks[linkedin]", formData.socialLinks.linkedin)
			form.append("socialLinks[twitter]", formData.socialLinks.twitter)
			form.append("socialLinks[website]", formData.socialLinks.website)

			const result: Result = await registerUser(form);
			if (result.error == null) {
				navigate("/login");
			}
		} catch (error) {
			console.error("Signup error:", error)
		} finally {
			setIsLoading(false)
		}
	}

	const nextStep = () => {
		if (currentStep === 1) {
			// Validate required fields before moving to step 2
			const requiredErrors: FormErrors = {}
			if (!formData.email) requiredErrors.email = "Email is required"
			if (!formData.password) requiredErrors.password = "Password is required"
			if (formData.password !== formData.confirmPassword) {
				requiredErrors.confirmPassword = "Passwords do not match"
			}

			if (Object.keys(requiredErrors).length > 0) {
				setErrors(requiredErrors)
				return
			}
		}
		setCurrentStep(2)
	}

	const prevStep = () => setCurrentStep(1)

	const containerVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.6, ease: "easeOut" },
		},
	}

	const stepVariants = {
		hidden: { opacity: 0, x: 20 },
		visible: {
			opacity: 1,
			x: 0,
			transition: { duration: 0.4, ease: "easeOut" },
		},
		exit: {
			opacity: 0,
			x: -20,
			transition: { duration: 0.3, ease: "easeIn" },
		},
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
			<motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full max-w-2xl">
				<Card className="shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
					<CardHeader className="text-center space-y-4">
						<motion.div
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
							className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center"
						>
							<UserPlus className="w-8 h-8 text-white" />
						</motion.div>
						<CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
							Create Account
						</CardTitle>
						<CardDescription className="text-lg">Join our community and start your journey</CardDescription>

						{/* Progress indicator */}
						<div className="flex items-center justify-center space-x-4 mt-6">
							<div
								className={`flex items-center space-x-2 ${currentStep >= 1 ? "text-blue-600 dark:text-blue-400" : "text-gray-400"}`}
							>
								<div
									className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-600"}`}
								>
									{currentStep > 1 ? <CheckCircle className="w-5 h-5" /> : "1"}
								</div>
								<span className="text-sm font-medium">Basic Info</span>
							</div>
							<div className={`w-12 h-0.5 ${currentStep > 1 ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-600"}`} />
							<div
								className={`flex items-center space-x-2 ${currentStep >= 2 ? "text-blue-600 dark:text-blue-400" : "text-gray-400"}`}
							>
								<div
									className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-600"}`}
								>
									2
								</div>
								<span className="text-sm font-medium">Profile</span>
							</div>
						</div>
					</CardHeader>

					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-6">
							{currentStep === 1 && (
								<motion.div
									key="step1"
									variants={stepVariants}
									initial="hidden"
									animate="visible"
									exit="exit"
									className="space-y-6"
								>
									{/* Username */}
									<div className="space-y-2">
										<Label htmlFor="username" className="flex items-center space-x-2">
											<User className="w-4 h-4" />
											<span>Username (optional)</span>
										</Label>
										<Input
											id="username"
											type="text"
											placeholder="johndoe"
											value={formData.username}
											onChange={(e) => handleInputChange("username", e.target.value)}
											className={`transition-all duration-200 ${errors.username ? "border-red-500 focus:border-red-500" : "focus:border-blue-500"}`}
											maxLength={50}
										/>
										{errors.username && (
											<motion.p
												initial={{ opacity: 0, y: -10 }}
												animate={{ opacity: 1, y: 0 }}
												className="text-sm text-red-500 flex items-center space-x-1"
											>
												<AlertCircle className="w-4 h-4" />
												<span>{errors.username}</span>
											</motion.p>
										)}
									</div>

									{/* Email */}
									<div className="space-y-2">
										<Label htmlFor="email" className="flex items-center space-x-2">
											<Mail className="w-4 h-4" />
											<span>Email *</span>
										</Label>
										<Input
											id="email"
											type="email"
											placeholder="john@example.com"
											value={formData.email}
											onChange={(e) => handleInputChange("email", e.target.value)}
											className={`transition-all duration-200 ${errors.email ? "border-red-500 focus:border-red-500" : "focus:border-blue-500"}`}
											required
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
											<span>Password *</span>
										</Label>
										<div className="relative">
											<Input
												id="password"
												type={showPassword ? "text" : "password"}
												placeholder="Enter your password"
												value={formData.password}
												onChange={(e) => handleInputChange("password", e.target.value)}
												className={`pr-10 transition-all duration-200 ${errors.password ? "border-red-500 focus:border-red-500" : "focus:border-blue-500"}`}
												required
												minLength={6}
											/>
											<button
												type="button"
												onClick={() => setShowPassword(!showPassword)}
												className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
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

									{/* Confirm Password */}
									<div className="space-y-2">
										<Label htmlFor="confirmPassword" className="flex items-center space-x-2">
											<Lock className="w-4 h-4" />
											<span>Confirm Password *</span>
										</Label>
										<div className="relative">
											<Input
												id="confirmPassword"
												type={showConfirmPassword ? "text" : "password"}
												placeholder="Confirm your password"
												value={formData.confirmPassword}
												onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
												className={`pr-10 transition-all duration-200 ${errors.confirmPassword ? "border-red-500 focus:border-red-500" : "focus:border-blue-500"}`}
												required
											/>
											<button
												type="button"
												onClick={() => setShowConfirmPassword(!showConfirmPassword)}
												className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
											>
												{showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
											</button>
										</div>
										{errors.confirmPassword && (
											<motion.p
												initial={{ opacity: 0, y: -10 }}
												animate={{ opacity: 1, y: 0 }}
												className="text-sm text-red-500 flex items-center space-x-1"
											>
												<AlertCircle className="w-4 h-4" />
												<span>{errors.confirmPassword}</span>
											</motion.p>
										)}
									</div>

									<Button
										type="button"
										onClick={nextStep}
										className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-105"
									>
										Continue to Profile
									</Button>
								</motion.div>
							)}

							{currentStep === 2 && (
								<motion.div
									key="step2"
									variants={stepVariants}
									initial="hidden"
									animate="visible"
									exit="exit"
									className="space-y-6"
								>
									{/* Avatar */}
									<div className="space-y-2">
										<Label htmlFor="avatar" className="flex items-center space-x-2">
											<ImageIcon className="w-4 h-4" />
											<span>Avatar (optional)</span>
										</Label>

										{/* Avatar Preview */}
										{avatarPreview && (
											<motion.div
												initial={{ opacity: 0, scale: 0.8 }}
												animate={{ opacity: 1, scale: 1 }}
												className="flex justify-center mb-4"
											>
												<div className="relative">
													<img
														src={avatarPreview || "/placeholder.svg"}
														alt="Avatar preview"
														className="w-24 h-24 rounded-full object-cover border-4 border-blue-200 dark:border-blue-800"
													/>
													<button
														type="button"
														onClick={() => {
															setAvatarFile(null)
															setAvatarPreview("")
															const input = document.getElementById("avatar") as HTMLInputElement
															if (input) input.value = ""
														}}
														className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
													>
														<X className="w-4 h-4" />
													</button>
												</div>
											</motion.div>
										)}

										<Input
											id="avatar"
											type="file"
											accept="image/*"
											onChange={handleFileChange}
											className="focus:border-blue-500 transition-all duration-200"
										/>
										<p className="text-xs text-gray-500 dark:text-gray-400">Upload an image file (JPG, PNG, GIF)</p>
									</div>

									{/* Bio */}
									<div className="space-y-2">
										<Label htmlFor="bio" className="flex items-center space-x-2">
											<User className="w-4 h-4" />
											<span>Bio (optional)</span>
											<span className="text-sm text-gray-500">({formData.bio.length}/300)</span>
										</Label>
										<Textarea
											id="bio"
											placeholder="Tell us about yourself..."
											value={formData.bio}
											onChange={(e) => handleInputChange("bio", e.target.value)}
											className={`resize-none transition-all duration-200 ${errors.bio ? "border-red-500 focus:border-red-500" : "focus:border-blue-500"}`}
											rows={4}
											maxLength={300}
										/>
										{errors.bio && (
											<motion.p
												initial={{ opacity: 0, y: -10 }}
												animate={{ opacity: 1, y: 0 }}
												className="text-sm text-red-500 flex items-center space-x-1"
											>
												<AlertCircle className="w-4 h-4" />
												<span>{errors.bio}</span>
											</motion.p>
										)}
									</div>

									<Separator />

									{/* Social Links */}
									<div className="space-y-4">
										<h3 className="text-lg font-semibold">Social Links (optional)</h3>

										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<div className="space-y-2">
												<Label htmlFor="github" className="flex items-center space-x-2">
													<Github className="w-4 h-4" />
													<span>GitHub</span>
												</Label>
												<Input
													id="github"
													type="url"
													placeholder="https://github.com/username"
													value={formData.socialLinks.github}
													onChange={(e) => handleInputChange("socialLinks.github", e.target.value)}
													className="focus:border-blue-500 transition-all duration-200"
												/>
											</div>

											<div className="space-y-2">
												<Label htmlFor="linkedin" className="flex items-center space-x-2">
													<Linkedin className="w-4 h-4" />
													<span>LinkedIn</span>
												</Label>
												<Input
													id="linkedin"
													type="url"
													placeholder="https://linkedin.com/in/username"
													value={formData.socialLinks.linkedin}
													onChange={(e) => handleInputChange("socialLinks.linkedin", e.target.value)}
													className="focus:border-blue-500 transition-all duration-200"
												/>
											</div>

											<div className="space-y-2">
												<Label htmlFor="twitter" className="flex items-center space-x-2">
													<Twitter className="w-4 h-4" />
													<span>Twitter</span>
												</Label>
												<Input
													id="twitter"
													type="url"
													placeholder="https://twitter.com/username"
													value={formData.socialLinks.twitter}
													onChange={(e) => handleInputChange("socialLinks.twitter", e.target.value)}
													className="focus:border-blue-500 transition-all duration-200"
												/>
											</div>

											<div className="space-y-2">
												<Label htmlFor="website" className="flex items-center space-x-2">
													<Globe className="w-4 h-4" />
													<span>Website</span>
												</Label>
												<Input
													id="website"
													type="url"
													placeholder="https://yourwebsite.com"
													value={formData.socialLinks.website}
													onChange={(e) => handleInputChange("socialLinks.website", e.target.value)}
													className="focus:border-blue-500 transition-all duration-200"
												/>
											</div>
										</div>
									</div>

									<div className="flex space-x-4">
										<Button type="button" onClick={prevStep} variant="outline" className="flex-1 py-3 bg-transparent">
											Back
										</Button>
										<Button
											type="submit"
											disabled={isLoading}
											className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:opacity-50"
										>
											{isLoading ? (
												<motion.div
													animate={{ rotate: 360 }}
													transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
													className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
												/>
											) : (
												"Create Account"
											)}
										</Button>
									</div>
								</motion.div>
							)}
						</form>

						<div className="mt-6 text-center">
							<p className="text-sm text-gray-600 dark:text-gray-400">
								Already have an account?{" "}
								<a
									href="/login"
									className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
								>
									Sign in
								</a>
							</p>
						</div>
					</CardContent>
				</Card>
			</motion.div>
		</div>
	)
}

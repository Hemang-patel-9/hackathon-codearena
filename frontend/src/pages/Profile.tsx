"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
	User,
	Mail,
	Github,
	Linkedin,
	Twitter,
	Globe,
	ImageIcon,
	AlertCircle,
	X,
	Save,
	Shield
} from "lucide-react"
import { getUserById, updatePassword, updateProfile } from "@/api/user"
import type { Result } from "@/types/response"
import { useAuth } from "@/contexts/authContext"
import PasswordTab from "@/components/profile/PasswordTab"
import type { PasswordFormData, ProfileFormData, User as UserProfile } from "@/types/user"
import ProfileSaveSuccess from "@/components/profile/ProfileSaveSuccess"
import PasswordSaveSuccess from "@/components/profile/PasswordSaveSuccess"
import ProfileHeader from "@/components/profile/ProfileHeader"
import { useToast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom"

interface FormErrors {
	[key: string]: string
}

export default function ProfilePage() {
	const [profileData, setProfileData] = useState<ProfileFormData>({
		username: "",
		bio: "",
		socialLinks: {
			github: "",
			linkedin: "",
			twitter: "",
			website: "",
		},
	})

	const [passwordData, setPasswordData] = useState<PasswordFormData>({
		currentPassword: "",
		newPassword: "",
		confirmNewPassword: "",
	})

	const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
	const [profileErrors, setProfileErrors] = useState<FormErrors>({})
	const [passwordErrors, setPasswordErrors] = useState<FormErrors>({})
	const [showCurrentPassword, setShowCurrentPassword] = useState(false)
	const [showNewPassword, setShowNewPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [isProfileSaving, setIsProfileSaving] = useState(false)
	const [isPasswordSaving, setIsPasswordSaving] = useState(false)
	const [avatarFile, setAvatarFile] = useState<File | null>(null)
	const [avatarPreview, setAvatarPreview] = useState<string>("")
	const [activeTab, setActiveTab] = useState<"profile" | "security">("profile")
	const [profileSaveSuccess, setProfileSaveSuccess] = useState(false)
	const [passwordSaveSuccess, setPasswordSaveSuccess] = useState(false)

	const { user, token } = useAuth()
	const { toast } = useToast();
	const navigate = useNavigate();
	// Load user profile on component mount
	useEffect(() => {
		if (!token) {
			navigate("/");
		}

		loadUserProfile();
	}, [])

	const loadUserProfile = async () => {
		setIsLoading(true)
		try {
			const result: Result = await getUserById(user?._id as string, token as string)
			console.log(result)
			setUserProfile(result.data)
			setProfileData({
				username: result.data.username || "",
				bio: result.data.bio,
				socialLinks: result.data.socialLinks,
			})
		} catch (error) {
			console.error("Failed to load profile:", error)
		} finally {
			setIsLoading(false)
		}
	}

	const validateProfileForm = (): boolean => {
		const newErrors: FormErrors = {}

		// Username validation (optional but if provided, must be valid)
		if (profileData.username && profileData.username.length > 50) {
			newErrors.username = "Username must be 50 characters or less"
		}

		// Bio validation
		if (profileData.bio.length > 300) {
			newErrors.bio = "Bio must be 300 characters or less"
		}

		setProfileErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const validatePasswordForm = (): boolean => {
		const newErrors: FormErrors = {}

		if (!passwordData.currentPassword) {
			newErrors.currentPassword = "Current password is required"
		}

		if (!passwordData.newPassword) {
			newErrors.newPassword = "New password is required"
		} else if (passwordData.newPassword.length < 6) {
			newErrors.newPassword = "New password must be at least 6 characters long"
		}

		if (passwordData.newPassword !== passwordData.confirmNewPassword) {
			newErrors.confirmNewPassword = "New passwords do not match"
		}

		setPasswordErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleProfileInputChange = (field: string, value: string) => {
		if (field.includes(".")) {
			const [parent, child] = field.split(".")
			setProfileData((prev: any) => ({
				...prev,
				[parent]: {
					...prev[parent as keyof ProfileFormData],
					[child]: value,
				},
			}))
		} else {
			setProfileData((prev) => ({ ...prev, [field]: value }))
		}

		// Clear error when user starts typing
		if (profileErrors[field]) {
			setProfileErrors((prev) => ({ ...prev, [field]: "" }))
		}
	}

	const handlePasswordInputChange = (field: string, value: string) => {
		setPasswordData((prev) => ({ ...prev, [field]: value }))

		if (passwordErrors[field]) {
			setPasswordErrors((prev) => ({ ...prev, [field]: "" }))
		}
	}

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) {
			setAvatarFile(file)
			const reader = new FileReader()
			reader.onloadend = () => {
				setAvatarPreview(reader.result as string)
			}
			reader.readAsDataURL(file)
		} else {
			setAvatarFile(null)
			setAvatarPreview(userProfile?.avatar || "")
		}
	}

	const handleProfileSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!validateProfileForm()) return

		setIsProfileSaving(true)
		setProfileErrors({})

		try {
			const formData = new FormData()

			// Add profile data
			formData.append("username", profileData.username)
			formData.append("bio", profileData.bio)

			// Handle avatar file
			if (avatarFile) {
				formData.append("avatar", avatarFile)
			}

			// Add social links
			formData.append("socialLinks[github]", profileData.socialLinks.github)
			formData.append("socialLinks[linkedin]", profileData.socialLinks.linkedin)
			formData.append("socialLinks[twitter]", profileData.socialLinks.twitter)
			formData.append("socialLinks[website]", profileData.socialLinks.website)

			// Simulate API call
			const result: Result = await updateProfile(userProfile?._id as string, token as string, formData);
			if (result.error) {
				toast({
					title: result.message,
					description: result.error,
					variant: "destructive"
				});
			}
			else {
				toast({
					title: "Profile Update",
					description: result.message,
					variant: "success"
				});
				setProfileSaveSuccess(true);
				loadUserProfile();
				setTimeout(() => setProfileSaveSuccess(false), 3000)
				setAvatarFile(null)
			}

		} catch (error: any) {
			console.error("Profile update error:", error)
			setProfileErrors({ general: error.message || "Failed to update profile. Please try again." })
		} finally {
			setIsProfileSaving(false)
		}
	}

	const handlePasswordSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!validatePasswordForm()) return

		setIsPasswordSaving(true)
		setPasswordErrors({})

		try {
			console.log(passwordData);

			const result: Result = await updatePassword(userProfile?._id as string, token as string, passwordData)
			if (result.error != null) {
				toast({
					title: result.message,
					description: result.error,
					variant: "destructive"
				});
			} else {
				toast({
					title: "Password Updated Successfully",
					description: result.message,
					variant: "success"
				});
				setPasswordSaveSuccess(true)
				loadUserProfile();
				setTimeout(() => setPasswordSaveSuccess(false), 3000)
				setPasswordData({
					currentPassword: "",
					newPassword: "",
					confirmNewPassword: "",
				})
			}

		} catch (error: any) {
			console.error("Password update error:", error)
			setPasswordErrors({ general: error.message || "Failed to update password. Please try again." })
		} finally {
			setIsPasswordSaving(false)
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

	const tabVariants = {
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

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
				<motion.div
					animate={{ rotate: 360 }}
					transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
					className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full"
				/>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-transparent p-4">
			<motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-4xl mx-auto">
				{/* Header */}
				<ProfileHeader
					avatarPreview={avatarPreview}
					userProfile={userProfile}
					setAvatarPreview={setAvatarPreview}
				/>

				{/* Success Messages */}
				<ProfileSaveSuccess profileSaveSuccess={profileSaveSuccess} />

				<PasswordSaveSuccess passwordSaveSuccess={passwordSaveSuccess} />

				{/* Tabs */}
				<div className="flex space-x-1 mb-6 bg-transparent rounded-lg p-1">
					<button
						onClick={() => setActiveTab("profile")}
						className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${activeTab === "profile"
							? "bg-gradient-to-tr dark:from-purple-950/30 dark:to-blue-950/30 from-purple-100 to-blue-100 text-blue-600 dark:text-blue-400 shadow-sm"
							: "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200  hover:bg-gradient-to-tr hover:dark:from-purple-950/15 hover:dark:to-blue-950/15 hover:from-purple-50 hover:to-blue-50"
							}`}
					>
						<User className="w-4 h-4 inline mr-2" />
						Profile Information
					</button>
					<button
						onClick={() => setActiveTab("security")}
						className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${activeTab === "security"
							? "bg-gradient-to-tr dark:from-purple-950/30 dark:to-blue-950/30 from-purple-100 to-blue-100 text-blue-600 dark:text-blue-400 shadow-sm"
							: "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gradient-to-tr hover:dark:from-purple-950/15 hover:dark:to-blue-950/15 hover:from-purple-50 hover:to-blue-50"
							}`}
					>
						<Shield className="w-4 h-4 inline mr-2" />
						Security Settings
					</button>
				</div>

				{/* Profile Form */}
				{activeTab === "profile" && (
					<Card className="border-0 shadow-lg shadow-foreground/10  backdrop-blur-sm">
						<CardContent className="p-6">
							<form onSubmit={handleProfileSubmit} className="space-y-6">
								<motion.div
									key="profile"
									variants={tabVariants}
									initial="hidden"
									animate="visible"
									exit="exit"
									className="space-y-6"
								>
									{/* General Error */}
									{profileErrors.general && (
										<motion.div
											initial={{ opacity: 0, y: -10 }}
											animate={{ opacity: 1, y: 0 }}
											className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
										>
											<div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
												<AlertCircle className="w-5 h-5" />
												<span className="text-sm font-medium">{profileErrors.general}</span>
											</div>
										</motion.div>
									)}

									{/* Avatar */}
									<div className="space-y-2">
										<Label htmlFor="avatar" className="flex items-center space-x-2">
											<ImageIcon className="w-4 h-4" />
											<span>Profile Picture</span>
										</Label>
										<div className="flex items-center space-x-4">
											<div className="relative">
												<img
													src={
														avatarPreview ||
														`${import.meta.env.VITE_APP_API_URL}/${userProfile?.avatar}` ||
														"/placeholder.svg?height=96&width=96"
													}
													onError={() => {
														setAvatarPreview("demo-image.png");
													}}
													alt="Avatar preview"
													className="w-24 h-24 rounded-full object-cover border-4 border-blue-200 dark:border-blue-800"
												/>
												{avatarPreview && (
													<button
														type="button"
														onClick={() => {
															setAvatarFile(null)
															setAvatarPreview(userProfile?.avatar || "")
															const input = document.getElementById("avatar") as HTMLInputElement
															if (input) input.value = ""
														}}
														className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
													>
														<X className="w-4 h-4" />
													</button>
												)}
											</div>
											<div className="flex-1">
												<Input
													id="avatar"
													type="file"
													accept="image/*"
													onChange={handleFileChange}
													className="focus:border-blue-500 transition-all duration-200"
												/>
												<p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
													Upload an image file (JPG, PNG, GIF). Max size: 5MB
												</p>
											</div>
										</div>
									</div>

									{/* Username */}
									<div className="space-y-2">
										<Label htmlFor="username" className="flex items-center space-x-2">
											<User className="w-4 h-4" />
											<span>Username</span>
										</Label>
										<Input
											id="username"
											type="text"
											placeholder="johndoe"
											value={profileData.username}
											onChange={(e) => handleProfileInputChange("username", e.target.value)}
											className={`transition-all duration-200 ${profileErrors.username ? "border-red-500 focus:border-red-500" : "focus:border-blue-500"
												}`}
											maxLength={50}
										/>
										{profileErrors.username && (
											<motion.p
												initial={{ opacity: 0, y: -10 }}
												animate={{ opacity: 1, y: 0 }}
												className="text-sm text-red-500 flex items-center space-x-1"
											>
												<AlertCircle className="w-4 h-4" />
												<span>{profileErrors.username}</span>
											</motion.p>
										)}
									</div>

									{/* Email (Read-only) */}
									<div className="space-y-2">
										<Label htmlFor="email" className="flex items-center space-x-2">
											<Mail className="w-4 h-4" />
											<span>Email</span>
										</Label>
										<Input
											id="email"
											type="email"
											value={userProfile?.email || ""}
											disabled
											className="bg-gray-50 dark:bg-gray-700 cursor-not-allowed"
										/>
										<p className="text-xs text-gray-500 dark:text-gray-400">Email cannot be changed from this form</p>
									</div>

									{/* Bio */}
									<div className="space-y-2">
										<Label htmlFor="bio" className="flex items-center space-x-2">
											<User className="w-4 h-4" />
											<span>Bio</span>
											<span className="text-sm text-gray-500">({profileData.bio.length}/300)</span>
										</Label>
										<Textarea
											id="bio"
											placeholder="Tell us about yourself..."
											value={profileData.bio}
											onChange={(e) => handleProfileInputChange("bio", e.target.value)}
											className={`resize-none transition-all duration-200 ${profileErrors.bio ? "border-red-500 focus:border-red-500" : "focus:border-blue-500"
												}`}
											rows={4}
											maxLength={300}
										/>
										{profileErrors.bio && (
											<motion.p
												initial={{ opacity: 0, y: -10 }}
												animate={{ opacity: 1, y: 0 }}
												className="text-sm text-red-500 flex items-center space-x-1"
											>
												<AlertCircle className="w-4 h-4" />
												<span>{profileErrors.bio}</span>
											</motion.p>
										)}
									</div>

									<Separator />

									{/* Social Links */}
									<div className="space-y-4">
										<h3 className="text-lg font-semibold">Social Links</h3>
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
													value={profileData.socialLinks.github}
													onChange={(e) => handleProfileInputChange("socialLinks.github", e.target.value)}
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
													value={profileData.socialLinks.linkedin}
													onChange={(e) => handleProfileInputChange("socialLinks.linkedin", e.target.value)}
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
													value={profileData.socialLinks.twitter}
													onChange={(e) => handleProfileInputChange("socialLinks.twitter", e.target.value)}
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
													value={profileData.socialLinks.website}
													onChange={(e) => handleProfileInputChange("socialLinks.website", e.target.value)}
													className="focus:border-blue-500 transition-all duration-200"
												/>
											</div>
										</div>
									</div>
								</motion.div>

								{/* Submit Button */}
								<div className="flex justify-end pt-6">
									<Button
										type="submit"
										disabled={isProfileSaving}
										className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:opacity-50"
									>
										{isProfileSaving ? (
											<motion.div
												animate={{ rotate: 360 }}
												transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
												className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
											/>
										) : (
											<Save className="w-5 h-5 mr-2" />
										)}
										{isProfileSaving ? "Updating Profile..." : "Update Profile"}
									</Button>
								</div>
							</form>
						</CardContent>
					</Card>
				)}

				{/* Password Form */}
				{activeTab === "security" && (
					<PasswordTab
						handlePasswordInputChange={handlePasswordInputChange}
						handlePasswordSubmit={handlePasswordSubmit}
						isPasswordSaving={isPasswordSaving}
						passwordData={passwordData}
						passwordErrors={passwordErrors}
						setShowConfirmPassword={setShowConfirmPassword}
						setShowCurrentPassword={setShowCurrentPassword}
						setShowNewPassword={setShowNewPassword}
						showConfirmPassword={showConfirmPassword}
						showCurrentPassword={showCurrentPassword}
						showNewPassword={showNewPassword}
						tabVariants={tabVariants}
					/>
				)}
			</motion.div>
		</div>
	)
}
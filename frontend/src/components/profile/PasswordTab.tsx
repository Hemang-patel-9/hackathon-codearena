import { Card, CardContent } from '../ui/card'
import { motion } from 'framer-motion';
import { AlertCircle, Eye, EyeOff, Lock, Shield } from 'lucide-react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

const PasswordTab = ({
	tabVariants,
	handlePasswordSubmit,
	passwordErrors,
	showCurrentPassword,
	passwordData,
	showNewPassword,
	handlePasswordInputChange,
	setShowCurrentPassword,
	setShowNewPassword,
	showConfirmPassword,
	setShowConfirmPassword,
	isPasswordSaving

}: {
	tabVariants: any,
	handlePasswordSubmit: any,
	passwordErrors: any,
	showCurrentPassword: any,
	passwordData: any,
	showNewPassword: any,
	handlePasswordInputChange: any,
	setShowCurrentPassword: any,
	setShowNewPassword: any,
	showConfirmPassword: any,
	setShowConfirmPassword: any,
	isPasswordSaving: any
}) => {
	return (
		<Card className="shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
			<CardContent className="p-6">
				<form onSubmit={handlePasswordSubmit} className="space-y-6">
					<motion.div
						key="security"
						variants={tabVariants}
						initial="hidden"
						animate="visible"
						exit="exit"
						className="space-y-6"
					>
						{/* General Error */}
						{passwordErrors.general && (
							<motion.div
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
							>
								<div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
									<AlertCircle className="w-5 h-5" />
									<span className="text-sm font-medium">{passwordErrors.general}</span>
								</div>
							</motion.div>
						)}

						<div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
							<div className="flex items-center space-x-2 text-yellow-600 dark:text-yellow-400">
								<Shield className="w-5 h-5" />
								<span className="font-medium">Change Password</span>
							</div>
							<p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
								Enter your current password and choose a new secure password.
							</p>
						</div>

						{/* Current Password */}
						<div className="space-y-2">
							<Label htmlFor="currentPassword" className="flex items-center space-x-2">
								<Lock className="w-4 h-4" />
								<span>Current Password</span>
							</Label>
							<div className="relative">
								<Input
									id="currentPassword"
									type={showCurrentPassword ? "text" : "password"}
									placeholder="Enter your current password"
									value={passwordData.currentPassword}
									onChange={(e) => handlePasswordInputChange("currentPassword", e.target.value)}
									className={`pr-10 transition-all duration-200 ${passwordErrors.currentPassword
										? "border-red-500 focus:border-red-500"
										: "focus:border-blue-500"
										}`}
									required
								/>
								<button
									type="button"
									onClick={() => setShowCurrentPassword(!showCurrentPassword)}
									className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
								>
									{showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
								</button>
							</div>
							{passwordErrors.currentPassword && (
								<motion.p
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									className="text-sm text-red-500 flex items-center space-x-1"
								>
									<AlertCircle className="w-4 h-4" />
									<span>{passwordErrors.currentPassword}</span>
								</motion.p>
							)}
						</div>

						{/* New Password */}
						<div className="space-y-2">
							<Label htmlFor="newPassword" className="flex items-center space-x-2">
								<Lock className="w-4 h-4" />
								<span>New Password</span>
							</Label>
							<div className="relative">
								<Input
									id="newPassword"
									type={showNewPassword ? "text" : "password"}
									placeholder="Enter your new password"
									value={passwordData.newPassword}
									onChange={(e) => handlePasswordInputChange("newPassword", e.target.value)}
									className={`pr-10 transition-all duration-200 ${passwordErrors.newPassword ? "border-red-500 focus:border-red-500" : "focus:border-blue-500"
										}`}
									minLength={6}
									required
								/>
								<button
									type="button"
									onClick={() => setShowNewPassword(!showNewPassword)}
									className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
								>
									{showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
								</button>
							</div>
							{passwordErrors.newPassword && (
								<motion.p
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									className="text-sm text-red-500 flex items-center space-x-1"
								>
									<AlertCircle className="w-4 h-4" />
									<span>{passwordErrors.newPassword}</span>
								</motion.p>
							)}
						</div>

						{/* Confirm New Password */}
						<div className="space-y-2">
							<Label htmlFor="confirmNewPassword" className="flex items-center space-x-2">
								<Lock className="w-4 h-4" />
								<span>Confirm New Password</span>
							</Label>
							<div className="relative">
								<Input
									id="confirmNewPassword"
									type={showConfirmPassword ? "text" : "password"}
									placeholder="Confirm your new password"
									value={passwordData.confirmNewPassword}
									onChange={(e) => handlePasswordInputChange("confirmNewPassword", e.target.value)}
									className={`pr-10 transition-all duration-200 ${passwordErrors.confirmNewPassword
										? "border-red-500 focus:border-red-500"
										: "focus:border-blue-500"
										}`}
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
							{passwordErrors.confirmNewPassword && (
								<motion.p
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									className="text-sm text-red-500 flex items-center space-x-1"
								>
									<AlertCircle className="w-4 h-4" />
									<span>{passwordErrors.confirmNewPassword}</span>
								</motion.p>
							)}
						</div>
					</motion.div>

					{/* Submit Button */}
					<div className="flex justify-end pt-6">
						<Button
							type="submit"
							disabled={isPasswordSaving}
							className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:opacity-50"
						>
							{isPasswordSaving ? (
								<motion.div
									animate={{ rotate: 360 }}
									transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
									className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
								/>
							) : (
								<Shield className="w-5 h-5 mr-2" />
							)}
							{isPasswordSaving ? "Updating Password..." : "Update Password"}
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	)
}

export default PasswordTab
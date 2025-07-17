"\"use client"
import type React from "react"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Shield, ArrowLeft, RefreshCw, CheckCircle, AlertCircle, Mail, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useNavigate } from "react-router-dom"

interface OTPVerificationProps {
	email?: string
	onVerify?: (otp: string) => Promise<boolean>
	onResend?: () => Promise<boolean>
	onBack?: () => void
}

export default function OTPVerification({
	email = "user@example.com",
	onVerify,
	onResend,
	onBack,
}: OTPVerificationProps) {
	const [otp, setOtp] = useState<string[]>(new Array(6).fill(""))
	const [isLoading, setIsLoading] = useState(false)
	const [isResending, setIsResending] = useState(false)
	const [error, setError] = useState("")
	const [success, setSuccess] = useState(false)
	const [timer, setTimer] = useState(60)
	const [canResend, setCanResend] = useState(false)

	const inputRefs = useRef<(HTMLInputElement | null)[]>([])
	const router = useNavigate();
	// Timer countdown effect
	useEffect(() => {
		let interval: NodeJS.Timeout
		if (timer > 0 && !canResend) {
			interval = setInterval(() => {
				setTimer((prev) => prev - 1)
			}, 1000)
		} else if (timer === 0) {
			setCanResend(true)
		}
		return () => clearInterval(interval)
	}, [timer, canResend])

	// Auto-verify when all digits are filled
	useEffect(() => {
		const otpString = otp.join("")
		if (otpString.length === 6 && !isLoading) {
			handleVerify(otpString)
		}
	}, [otp, isLoading])

	const handleInputChange = (index: number, value: string) => {
		// Only allow digits
		if (!/^\d*$/.test(value)) return

		const newOtp = [...otp]
		newOtp[index] = value.slice(-1) // Take only the last digit

		setOtp(newOtp)
		setError("")

		// Move to next input if current input is filled
		if (value && index < 5) {
			inputRefs.current[index + 1]?.focus()
		}
	}

	const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
		if (e.key === "Backspace") {
			if (!otp[index] && index > 0) {
				// Move to previous input if current is empty
				inputRefs.current[index - 1]?.focus()
			} else {
				// Clear current input
				const newOtp = [...otp]
				newOtp[index] = ""
				setOtp(newOtp)
			}
		} else if (e.key === "ArrowLeft" && index > 0) {
			inputRefs.current[index - 1]?.focus()
		} else if (e.key === "ArrowRight" && index < 5) {
			inputRefs.current[index + 1]?.focus()
		}
	}

	const handlePaste = (e: React.ClipboardEvent) => {
		e.preventDefault()
		const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
		const newOtp = [...otp]

		for (let i = 0; i < pastedData.length; i++) {
			newOtp[i] = pastedData[i]
		}

		setOtp(newOtp)

		// Focus the next empty input or the last input
		const nextIndex = Math.min(pastedData.length, 5)
		inputRefs.current[nextIndex]?.focus()
	}

	const handleVerify = async (otpString: string) => {
		setIsLoading(true)
		setError("")

		try {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1500))

			const isValid = onVerify ? await onVerify(otpString) : Math.random() > 0.3

			if (isValid) {
				setSuccess(true)
				router("/profile");
			} else {
				setError("Invalid OTP. Please try again.")
				setOtp(new Array(6).fill(""))
				inputRefs.current[0]?.focus()
			}
		} catch (err) {
			setError("Verification failed. Please try again.")
			setOtp(new Array(6).fill(""))
			inputRefs.current[0]?.focus()
		} finally {
			setIsLoading(false)
		}
	}

	const handleResend = async () => {
		setIsResending(true)
		setError("")

		try {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1000))

			const success = onResend ? await onResend() : true

			if (success) {
				setTimer(60)
				setCanResend(false)
				setOtp(new Array(6).fill(""))
				inputRefs.current[0]?.focus()
			} else {
				setError("Failed to resend OTP. Please try again.")
			}
		} catch (err) {
			setError("Failed to resend OTP. Please try again.")
		} finally {
			setIsResending(false)
		}
	}

	const containerVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.6,
				ease: "easeOut",
				staggerChildren: 0.1,
			},
		},
	}

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.4, ease: "easeOut" },
		},
	}

	const inputVariants = {
		hidden: { scale: 0.8, opacity: 0 },
		visible: {
			scale: 1,
			opacity: 1,
			transition: { duration: 0.3, ease: "easeOut" },
		},
		focus: {
			scale: 1.05,
			transition: { duration: 0.2 },
		},
	}

	if (success) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-green-900 flex items-center justify-center p-4">
				<motion.div
					initial={{ scale: 0 }}
					animate={{ scale: 1 }}
					transition={{ type: "spring", stiffness: 200, damping: 20 }}
					className="text-center"
				>
					<motion.div
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
						className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
					>
						<CheckCircle className="w-10 h-10 text-white" />
					</motion.div>
					<motion.h2
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.4 }}
						className="text-2xl font-bold text-gray-900 dark:text-white mb-2"
					>
						Verification Successful!
					</motion.h2>
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.6 }}
						className="text-gray-600 dark:text-gray-400"
					>
						Your account has been verified successfully.
					</motion.p>
				</motion.div>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
			<motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full max-w-md">
				<Card className="shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
					<CardContent className="p-8">
						{/* Header */}
						<motion.div variants={itemVariants} className="text-center mb-8">
							<motion.div
								initial={{ scale: 0 }}
								animate={{ scale: 1 }}
								transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
								className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4"
							>
								<Shield className="w-8 h-8 text-white" />
							</motion.div>
							<h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Verify Your Email</h1>
							<p className="text-gray-600 dark:text-gray-400 text-sm">We've sent a 6-digit verification code to</p>
							<div className="flex items-center justify-center mt-2 text-blue-600 dark:text-blue-400">
								<Mail className="w-4 h-4 mr-2" />
								<span className="font-medium">{email}</span>
							</div>
						</motion.div>

						{/* Back Button */}
						{onBack && (
							<motion.div variants={itemVariants} className="mb-6">
								<Button
									variant="ghost"
									onClick={onBack}
									className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white p-0 h-auto"
								>
									<ArrowLeft className="w-4 h-4 mr-2" />
									Back
								</Button>
							</motion.div>
						)}

						{/* OTP Input */}
						<motion.div variants={itemVariants} className="mb-6">
							<div className="flex justify-center space-x-3 mb-4">
								{otp.map((digit, index) => (
									<motion.input
										key={index}
										ref={(el: any) => (inputRefs.current[index] = el)}
										variants={inputVariants}
										whileFocus="focus"
										type="text"
										inputMode="numeric"
										maxLength={1}
										value={digit}
										onChange={(e) => handleInputChange(index, e.target.value)}
										onKeyDown={(e) => handleKeyDown(index, e)}
										onPaste={handlePaste}
										disabled={isLoading}
										className={`w-12 h-12 text-center text-xl font-bold border-2 rounded-lg transition-all duration-200 ${digit
											? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
											: "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
											} ${error ? "border-red-500 bg-red-50 dark:bg-red-900/20" : ""
											} focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 dark:text-white`}
									/>
								))}
							</div>

							{/* Loading State */}
							<AnimatePresence>
								{isLoading && (
									<motion.div
										initial={{ opacity: 0, y: -10 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -10 }}
										className="flex items-center justify-center text-blue-600 dark:text-blue-400"
									>
										<motion.div
											animate={{ rotate: 360 }}
											transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
											className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full mr-2"
										/>
										<span className="text-sm">Verifying...</span>
									</motion.div>
								)}
							</AnimatePresence>

							{/* Error Message */}
							<AnimatePresence>
								{error && (
									<motion.div
										initial={{ opacity: 0, y: -10 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -10 }}
										className="flex items-center justify-center text-red-500 dark:text-red-400 mt-2"
									>
										<AlertCircle className="w-4 h-4 mr-2" />
										<span className="text-sm">{error}</span>
									</motion.div>
								)}
							</AnimatePresence>
						</motion.div>

						{/* Resend Section */}
						<motion.div variants={itemVariants} className="text-center">
							<p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{"Didn't receive the code?"}</p>

							{canResend ? (
								<Button
									onClick={handleResend}
									disabled={isResending}
									variant="outline"
									className="border-blue-500 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20 bg-transparent"
								>
									{isResending ? (
										<>
											<motion.div
												animate={{ rotate: 360 }}
												transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
												className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full mr-2"
											/>
											Sending...
										</>
									) : (
										<>
											<RefreshCw className="w-4 h-4 mr-2" />
											Resend Code
										</>
									)}
								</Button>
							) : (
								<div className="flex items-center justify-center text-gray-500 dark:text-gray-400">
									<Clock className="w-4 h-4 mr-2" />
									<span className="text-sm">Resend in {timer}s</span>
								</div>
							)}
						</motion.div>

						{/* Help Text */}
						<motion.div variants={itemVariants} className="mt-6 text-center">
							<p className="text-xs text-gray-500 dark:text-gray-400">
								Enter the 6-digit code sent to your email address.
								<br />
								The code will expire in 10 minutes.
							</p>
						</motion.div>
					</CardContent>
				</Card>
			</motion.div>
		</div>
	)
}

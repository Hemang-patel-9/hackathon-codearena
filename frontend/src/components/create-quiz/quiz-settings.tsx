"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Clock, Shield, Shuffle, Target, Lock, Users, Search, X, UserPlus, AlertCircle } from "lucide-react"
import type { QuizData } from "@/types/quiz"
import type { Result } from "@/types/response"
import { useAuth } from "@/contexts/authContext"
import { searchUsersByQuery } from "@/api/user"

interface User {
	_id: string
	username: string
	email: string
	avatar: string
}

interface QuizSettingsProps {
	quizData: QuizData
	updateQuizData: (updates: Partial<QuizData>) => void
}

export function QuizSettings({ quizData, updateQuizData }: QuizSettingsProps) {
	const [isParticipantModalOpen, setIsParticipantModalOpen] = useState(false)
	const [searchQuery, setSearchQuery] = useState("")
	const [searchResults, setSearchResults] = useState<User[]>([])
	const [isSearching, setIsSearching] = useState(false)
	const { token } = useAuth();
	const [participantsUsernames, setParticipantsUsernames] = useState<string[]>([])

	// Mock search function - replace with actual API call
	const searchUsers = async (query: string) => {
		if (!query.trim()) {
			setSearchResults([])
			return
		}

		setIsSearching(true)

		// Simulate API call
		const users: Result = await searchUsersByQuery(query, token as string);
		setIsSearching(false)
		setSearchResults(users.data || []);
		//in user i will get [{_id,email,username,avatar}]
	}

	const addParticipant = (userId: string, username: string) => {
		if (!quizData.participants.includes(userId)) {
			updateQuizData({
				participants: [...quizData.participants, userId],
			});
			setParticipantsUsernames((prev) => [...prev, username]);
		}
		setSearchQuery("")
		setSearchResults([])
	}

	const removeParticipant = (userId: string) => {
		updateQuizData({
			participants: quizData.participants.filter((id) => id !== userId),
		})
		// setParticipantsUsernames((prev) => prev.filter((name) => name !== getUserName(userId)));
	}

	// Validation function
	const isRequiredFieldsFilled = () => {
		return quizData.title && quizData.NoOfQuestion > 0 && quizData.duration > 0
	}

	const getFieldError = (field: string) => {
		switch (field) {
			case "title":
				return !quizData.title ? "Title is required" : ""
			case "NoOfQuestion":
				return quizData.NoOfQuestion <= 0 ? "Number of questions must be greater than 0" : ""
			case "duration":
				return quizData.duration <= 0 ? "Duration must be greater than 0" : ""
			default:
				return ""
		}
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="space-y-6"
		>
			{/* Validation Alert */}
			<AnimatePresence>
				{!isRequiredFieldsFilled() && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4"
					>
						<div className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
							<AlertCircle className="w-5 h-5" />
							<span className="font-medium">Please fill all required fields to continue</span>
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Basic Settings */}
			<Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-white/20 dark:border-gray-700/50">
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-white">
						<motion.div
							animate={{ rotate: [0, 360] }}
							transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
						>
							<Target className="w-6 h-6 text-blue-500" />
						</motion.div>
						Basic Settings
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
						<Label htmlFor="title" className="text-sm font-medium text-gray-700 dark:text-gray-300">
							Quiz Title <span className="text-red-500">*</span>
						</Label>
						<Input
							id="title"
							type="text"
							value={quizData.title}
							onChange={(e) => updateQuizData({ title: e.target.value })}
							placeholder="Enter quiz title..."
							className={`mt-1 bg-white/50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 focus:ring-purple-500 focus:border-purple-500 ${getFieldError("title") ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
								}`}
						/>
						{getFieldError("title") && (
							<motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-sm mt-1">
								{getFieldError("title")}
							</motion.p>
						)}
					</motion.div>

					<motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
						<Label htmlFor="NoOfQuestion" className="text-sm font-medium text-gray-700 dark:text-gray-300">
							Number of Questions (will display to students) <span className="text-red-500">*</span>
						</Label>
						<Input
							id="NoOfQuestion"
							type="number"
							value={quizData.NoOfQuestion}
							onChange={(e) => updateQuizData({ NoOfQuestion: Number(e.target.value) })}
							className={`mt-1 bg-white/50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 focus:ring-purple-500 focus:border-purple-500 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-inner-spin-button]:m-0 ${getFieldError("NoOfQuestion") ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
								}`}
							style={{ MozAppearance: "textfield" }}
							min="1"
						/>
						{getFieldError("NoOfQuestion") && (
							<motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-sm mt-1">
								{getFieldError("NoOfQuestion")}
							</motion.p>
						)}
					</motion.div>

					<motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
						<Label htmlFor="duration" className="text-sm font-medium text-gray-700 dark:text-gray-300">
							Total Duration (minutes) <span className="text-red-500">*</span>
						</Label>
						<Input
							id="duration"
							type="number"
							value={quizData.duration}
							onChange={(e) => updateQuizData({ duration: Number(e.target.value) })}
							className={`mt-1 bg-white/50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 focus:ring-purple-500 focus:border-purple-500 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-inner-spin-button]:m-0 ${getFieldError("duration") ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
								}`}
							style={{ MozAppearance: "textfield" }}
							min="1"
						/>
						{getFieldError("duration") && (
							<motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-sm mt-1">
								{getFieldError("duration")}
							</motion.p>
						)}
					</motion.div>
				</CardContent>
			</Card>

			{/* Timing Settings */}
			<Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-white/20 dark:border-gray-700/50">
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-white">
						<motion.div
							animate={{ rotate: [0, 360] }}
							transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
						>
							<Clock className="w-6 h-6 text-blue-500" />
						</motion.div>
						Timing Settings
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
						<Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Time per Question (seconds)</Label>
						<div className="mt-2 space-y-3">
							<Slider
								value={[quizData.timePerQuestion]}
								onValueChange={(value) => updateQuizData({ timePerQuestion: value[0] })}
								max={300}
								min={10}
								step={5}
								className="w-full"
								disabled={!isRequiredFieldsFilled()}
							/>
							<div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
								<span>10s</span>
								<span className="font-medium text-purple-600 dark:text-purple-400">{quizData.timePerQuestion}s</span>
								<span>300s</span>
							</div>
						</div>
					</motion.div>

					<motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
						<Label htmlFor="schedule" className="text-sm font-medium text-gray-700 dark:text-gray-300">
							Schedule Quiz
						</Label>
						<Input
							id="schedule"
							type="datetime-local"
							value={quizData.schedule.toISOString().slice(0, 16)}
							onChange={(e) => updateQuizData({ schedule: new Date(e.target.value) })}
							className="mt-1 bg-white/50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 focus:ring-purple-500 focus:border-purple-500"
							disabled={!isRequiredFieldsFilled()}
						/>
					</motion.div>
				</CardContent>
			</Card>

			{/* Quiz Behavior */}
			<Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-white/20 dark:border-gray-700/50">
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-white">
						<motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}>
							<Target className="w-6 h-6 text-green-500" />
						</motion.div>
						Quiz Behavior
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
						<Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Passing Criteria (%)</Label>
						<div className="mt-2 space-y-3">
							<Slider
								value={[quizData.passingCriteria]}
								onValueChange={(value) => updateQuizData({ passingCriteria: value[0] })}
								max={100}
								min={0}
								step={5}
								className="w-full"
								disabled={!isRequiredFieldsFilled()}
							/>
							<div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
								<span>0%</span>
								<span className="font-medium text-green-600 dark:text-green-400">{quizData.passingCriteria}%</span>
								<span>100%</span>
							</div>
						</div>
					</motion.div>

					<motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
						<Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Question Order</Label>
						<Select
							value={quizData.questionOrder}
							onValueChange={(value: "random" | "fixed") => updateQuizData({ questionOrder: value })}
							disabled={!isRequiredFieldsFilled()}
						>
							<SelectTrigger className="mt-1 bg-white/50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="random">
									<div className="flex items-center gap-2">
										<Shuffle className="w-4 h-4" />
										Random Order
									</div>
								</SelectItem>
								<SelectItem value="fixed">
									<div className="flex items-center gap-2">
										<Target className="w-4 h-4" />
										Fixed Order
									</div>
								</SelectItem>
							</SelectContent>
						</Select>
					</motion.div>
				</CardContent>
			</Card>

			{/* Privacy Settings */}
			<Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-white/20 dark:border-gray-700/50">
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-white">
						<motion.div
							animate={{ rotate: [0, -10, 10, 0] }}
							transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
						>
							<Shield className="w-6 h-6 text-purple-500" />
						</motion.div>
						Privacy Settings
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
						<Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Visibility</Label>
						<Select
							value={quizData.visibility}
							onValueChange={(value: "public" | "private" | "password-protected") =>
								updateQuizData({ visibility: value })
							}
							disabled={!isRequiredFieldsFilled()}
						>
							<SelectTrigger className="mt-1 bg-white/50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="public">
									<div className="flex items-center gap-2">
										<div className="w-2 h-2 bg-green-500 rounded-full"></div>
										Public - Anyone can join
									</div>
								</SelectItem>
								<SelectItem value="private">
									<div className="flex items-center gap-2">
										<div className="w-2 h-2 bg-red-500 rounded-full"></div>
										Private - Invite only
									</div>
								</SelectItem>
								<SelectItem value="password-protected">
									<div className="flex items-center gap-2">
										<Lock className="w-4 h-4" />
										Password Protected
									</div>
								</SelectItem>
							</SelectContent>
						</Select>
					</motion.div>

					{quizData.visibility === "password-protected" && (
						<motion.div
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: "auto" }}
							exit={{ opacity: 0, height: 0 }}
							transition={{ duration: 0.3 }}
						>
							<Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
								Quiz Password
							</Label>
							<Input
								id="password"
								type="password"
								value={quizData.password}
								onChange={(e) => updateQuizData({ password: e.target.value })}
								placeholder="Enter quiz password..."
								className="mt-1 bg-white/50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 focus:ring-purple-500 focus:border-purple-500"
							/>
						</motion.div>
					)}

					{(quizData.visibility === "private") && (
						<motion.div
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: "auto" }}
							exit={{ opacity: 0, height: 0 }}
							transition={{ duration: 0.3 }}
							className="space-y-4"
						>
							<div className="flex items-center justify-between">
								<Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
									Participants ({quizData.participants.length})
								</Label>
								<Dialog open={isParticipantModalOpen} onOpenChange={setIsParticipantModalOpen}>
									<DialogTrigger asChild>
										<Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
											<UserPlus className="w-4 h-4" />
											Add Participants
										</Button>
									</DialogTrigger>
									<DialogContent className="sm:max-w-md">
										<DialogHeader>
											<DialogTitle className="flex items-center gap-2">
												<Users className="w-5 h-5" />
												Add Participants
											</DialogTitle>
										</DialogHeader>
										<div className="space-y-4">
											<div className="relative">
												<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
												<Input
													placeholder="Search by name or email..."
													value={searchQuery}
													onChange={(e) => {
														setSearchQuery(e.target.value)
														searchUsers(e.target.value)
													}}
													className="pl-10"
												/>
											</div>

											<AnimatePresence>
												{isSearching && (
													<motion.div
														initial={{ opacity: 0 }}
														animate={{ opacity: 1 }}
														exit={{ opacity: 0 }}
														className="text-center py-4 text-gray-500"
													>
														Searching...
													</motion.div>
												)}
											</AnimatePresence>

											<div className="max-h-60 overflow-y-auto space-y-2">
												<AnimatePresence>
													{searchResults.map((user) => (
														<motion.div
															key={user._id}
															initial={{ opacity: 0, y: 10 }}
															animate={{ opacity: 1, y: 0 }}
															exit={{ opacity: 0, y: -10 }}
															className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
															onClick={() => addParticipant(user._id, user.username)}
														>
															<div className="flex items-center gap-3">
																<img
																	src={`${import.meta.env.VITE_APP_API_URL}/${user.avatar}`}
																	alt={user.username}
																	className="w-8 h-8 rounded-full object-cover border border-gray-300 dark:border-gray-700"
																/>
																<div>
																	<p className="font-medium text-gray-900 dark:text-white">{user.username}</p>
																	<p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
																</div>
															</div>
															{quizData.participants.includes(user._id) && <Badge variant="secondary">Added</Badge>}
														</motion.div>
													))}
												</AnimatePresence>
											</div>

											{searchQuery && !isSearching && searchResults.length === 0 && (
												<motion.div
													initial={{ opacity: 0 }}
													animate={{ opacity: 1 }}
													className="text-center py-4 text-gray-500"
												>
													No users found
												</motion.div>
											)}
										</div>
									</DialogContent>
								</Dialog>
							</div>

							{quizData.participants.length > 0 && (
								<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap gap-2">
									{participantsUsernames.map((username, idx) => (
										<motion.div
											key={quizData.participants[idx]}
											initial={{ scale: 0 }}
											animate={{ scale: 1 }}
											exit={{ scale: 0 }}
											className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 px-3 py-1 rounded-full text-sm"
										>
											<span>{username}</span>
											<button
												onClick={() => {
													removeParticipant(quizData.participants[idx]);
													setParticipantsUsernames((prev) => prev.filter((_, i) => i !== idx));
												}}
												className="hover:bg-purple-200 dark:hover:bg-purple-800 rounded-full p-1 transition-colors"
											>
												<X className="w-3 h-3" />
											</button>
										</motion.div>
									))}
								</motion.div>
							)}
						</motion.div>
					)}
				</CardContent>
			</Card>
		</motion.div>
	)
}

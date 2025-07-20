"use client"

import { useSocket } from "@/hooks/use-socket"
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Trophy, User, Target, AlertTriangle, Trash2, Video, Users, Activity, Crown, Medal, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const MonitoringPage = () => {
	const params = useParams()
	const socket = useSocket()
	const [isLoading, setIsLoading] = useState(true)

	type LeaderboardUser = {
		userId: string
		username: string
		score: number
		correctAnswersCount: number
		rank: number
		violations?: number
		avatar?: string
	}

	const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([])

	useEffect(() => {
		if (!socket || !params.quizId) return

		const handleLeaderboard = (data: LeaderboardUser[]) => {
			console.log("Received leaderboard data:", data)
			setLeaderboard(data)
			setIsLoading(false)
		}

		socket.on("quiz:leaderboard", handleLeaderboard)
		socket.emit("creator:get-live-data", { quizId: params.quizId })

		// Simulate loading for demo
		setTimeout(() => setIsLoading(false), 1000)

		return () => {
			socket.off("quiz:leaderboard", handleLeaderboard)
		}
	}, [socket, params.quizId])

	const getRankIcon = (rank: number) => {
		switch (rank) {
			case 1:
				return <Crown className="w-5 h-5 text-yellow-500" />
			case 2:
				return <Medal className="w-5 h-5 text-gray-400" />
			case 3:
				return <Award className="w-5 h-5 text-amber-600" />
			default:
				return (
					<span className="w-5 h-5 flex items-center justify-center text-sm font-semibold text-gray-600">#{rank}</span>
				)
		}
	}

	const handleEndExam = () => {
		socket?.emit("creator:end-quiz", { quizId: params.quizId })
	}

	const getViolationBadge = (violations = 0) => {
		if (violations === 0) {
			return (
				<Badge variant="secondary" className="bg-green-100 text-green-800">
					Clean
				</Badge>
			)
		} else if (violations <= 2) {
			return (
				<Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
					{violations} Warning{violations > 1 ? "s" : ""}
				</Badge>
			)
		} else {
			return <Badge variant="destructive">{violations} Violations</Badge>
		}
	}

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
				<div className="max-w-7xl mx-auto">
					<div className="flex items-center justify-center h-64">
						<motion.div
							animate={{ rotate: 360 }}
							transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
							className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"
						/>
						<span className="ml-3 text-lg text-gray-600">Loading quiz data...</span>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-transparent p-6">
			<div className="max-w-7xl mx-auto space-y-6">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					className="flex items-center justify-between"
				>
					<div className="flex items-center space-x-4">
						<div className="p-3 bg-blue-500 rounded-lg">
							<Activity className="w-6 h-6 text-white" />
						</div>
						<div>
							<h1 className="text-3xl font-bold bg-gradient-to-tr from-purple-700 to-blue-700 text-transparent bg-clip-text">Live Quiz Monitoring</h1>
							<p className="text-foreground/50">
								Quiz ID: <span className="font-mono font-semibold">{params.quizId}</span>
							</p>
						</div>
					</div>
					<div className="flex items-center space-x-4">
						<div className="flex items-center  text-blue-500 space-x-2 bg-blue-700/30 px-4 py-2 rounded-lg shadow-sm">
							<Users className="w-4 h-4" />
							<span className="text-sm  font-medium">{leaderboard.length} Participants</span>
						</div>
						<Button
							variant="destructive"
							size="sm"
							onClick={() => handleEndExam()}
							className="ml-2"
						>
							End Exam
						</Button>
						<div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
						<span className="text-sm text-gray-600">Live</span>
					</div>
				</motion.div>

				{/* Stats Cards */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1 }}
					className="grid grid-cols-1 md:grid-cols-4 gap-4"
				>
					<Card>
						<CardContent className="p-4">
							<div className="flex items-center space-x-3">
								<div className="p-2 bg-blue-100 rounded-lg">
									<Users className="w-5 h-5 text-blue-600" />
								</div>
								<div>
									<p className="text-sm text-gray-600">Total Players</p>
									<p className="text-2xl font-bold text-gray-900">{leaderboard.length}</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="p-4">
							<div className="flex items-center space-x-3">
								<div className="p-2 bg-green-100 rounded-lg">
									<Trophy className="w-5 h-5 text-green-600" />
								</div>
								<div>
									<p className="text-sm text-gray-600">Top Score</p>
									<p className="text-2xl font-bold text-gray-900">
										{leaderboard.length > 0 ? Math.max(...leaderboard.map((u) => u.score)) : 0}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="p-4">
							<div className="flex items-center space-x-3">
								<div className="p-2 bg-yellow-100 rounded-lg">
									<AlertTriangle className="w-5 h-5 text-yellow-600" />
								</div>
								<div>
									<p className="text-sm text-gray-600">Violations</p>
									<p className="text-2xl font-bold text-gray-900">
										{leaderboard.reduce((sum, user) => sum + (user.violations || 0), 0)}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="p-4">
							<div className="flex items-center space-x-3">
								<div className="p-2 bg-purple-100 rounded-lg">
									<Target className="w-5 h-5 text-purple-600" />
								</div>
								<div>
									<p className="text-sm text-gray-600">Avg. Accuracy</p>
									<p className="text-2xl font-bold text-gray-900">
										{leaderboard.length > 0
											? Math.round(
												(leaderboard.reduce((sum, user) => sum + user.correctAnswersCount, 0) / leaderboard.length) *
												100,
											) / 100
											: 0}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</motion.div>

				{/* Leaderboard */}
				<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center space-x-2">
								<Trophy className="w-5 h-5 text-yellow-500" />
								<span>Live Leaderboard</span>
							</CardTitle>
						</CardHeader>
						<CardContent className="p-0">
							{leaderboard.length === 0 ? (
								<div className="flex flex-col items-center justify-center py-12 text-gray-500">
									<Users className="w-12 h-12 mb-4 text-gray-300" />
									<p className="text-lg font-medium">No participants yet</p>
									<p className="text-sm">Waiting for players to join...</p>
								</div>
							) : (
								<div className="overflow-x-auto">
									<table className="w-full">
										<thead className="bg-gray-50 border-b">
											<tr>
												<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
													Rank
												</th>
												<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
													Player
												</th>
												<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
													Score
												</th>
												<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
													Correct
												</th>
												<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
													Status
												</th>
												<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
													Actions
												</th>
											</tr>
										</thead>
										<tbody className="bg-white divide-y divide-gray-200">
											<AnimatePresence>
												{leaderboard.map((user, index) => (
													<motion.tr
														key={user.userId}
														initial={{ opacity: 0, x: -20 }}
														animate={{ opacity: 1, x: 0 }}
														exit={{ opacity: 0, x: 20 }}
														transition={{ delay: index * 0.05 }}
														className="hover:bg-gray-50 transition-colors"
													>
														<td className="px-6 py-4 whitespace-nowrap">
															<div className="flex items-center">{getRankIcon(user.rank)}</div>
														</td>
														<td className="px-6 py-4 whitespace-nowrap">
															<div className="flex items-center space-x-3">
																<div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-r from-blue-400 to-purple-500 overflow-hidden">
																	{user.avatar ? (
																		<img
																			src={`${import.meta.env.VITE_APP_API_URL}/${user.avatar}`}
																			alt={user.username}
																			className="w-8 h-8 object-cover rounded-full"
																		/>
																	) : (
																		<User className="w-4 h-4 text-white" />
																	)}
																</div>
																<div>
																	<p className="text-sm font-medium text-gray-900">{user.username}</p>
																	<p className="text-xs text-gray-500">ID: {user.userId.slice(-8)}</p>
																</div>
															</div>
														</td>
														<td className="px-6 py-4 whitespace-nowrap">
															<div className="flex items-center space-x-2">
																<Trophy className="w-4 h-4 text-yellow-500" />
																<span className="text-lg font-bold text-gray-900">{user.score}</span>
															</div>
														</td>
														<td className="px-6 py-4 whitespace-nowrap">
															<div className="flex items-center space-x-2">
																<Target className="w-4 h-4 text-green-500" />
																<span className="text-sm font-medium text-gray-900">{user.correctAnswersCount}</span>
															</div>
														</td>
														<td className="px-6 py-4 whitespace-nowrap">{getViolationBadge(user.violations)}</td>
														<td className="px-6 py-4 whitespace-nowrap">
															<div className="flex items-center space-x-2">
																<Button
																	variant="outline"
																	size="sm"
																	className="hover:bg-blue-50 hover:border-blue-300 bg-transparent"
																>
																	<Video className="w-4 h-4 mr-1" />
																	View
																</Button>
																<Button
																	variant="outline"
																	size="sm"
																	className="hover:bg-red-50 hover:border-red-300 text-red-600 hover:text-red-700 bg-transparent"
																>
																	<Trash2 className="w-4 h-4 mr-1" />
																	Remove
																</Button>
															</div>
														</td>
													</motion.tr>
												))}
											</AnimatePresence>
										</tbody>
									</table>
								</div>
							)}
						</CardContent>
					</Card>
				</motion.div>
			</div>
		</div>
	)
}

export default MonitoringPage

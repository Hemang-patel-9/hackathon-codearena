"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Trophy, Medal, Award, Crown, Target, AlertTriangle, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getLeaderBoardByQuizId } from "@/api/scoreboard"
import { useParams } from "react-router-dom"
import { useAuth } from "@/contexts/authContext"

interface ParticipantScore {
	userId: string
	username: string
	score: number
	correctAnswersCount: number
	rank: number
	violations: number
	avatar: string
	_id: string
}

const getRankIcon = (rank: number) => {
	switch (rank) {
		case 1:
			return <Crown className="w-6 h-6 text-yellow-500" />
		case 2:
			return <Medal className="w-6 h-6 text-gray-400" />
		case 3:
			return <Award className="w-6 h-6 text-amber-600" />
		default:
			return <Trophy className="w-5 h-5 text-gray-500" />
	}
}

const getRankColor = (rank: number) => {
	switch (rank) {
		case 1:
			return "from-yellow-400 to-yellow-600"
		case 2:
			return "from-gray-300 to-gray-500"
		case 3:
			return "from-amber-400 to-amber-600"
		default:
			return "from-gray-100 to-gray-200"
	}
}

const PodiumCard = ({ participant, height }: { participant: ParticipantScore; height: string }) => (
	<motion.div
		initial={{ y: 100, opacity: 0 }}
		animate={{ y: 0, opacity: 1 }}
		transition={{ delay: participant.rank * 0.2, duration: 0.6, type: "spring" }}
		className="flex flex-col items-center"
	>
		<motion.div whileHover={{ scale: 1.05 }} className="relative mb-4">
			<Avatar className="w-16 h-16 border-4 border-white shadow-lg">
				<AvatarImage src={`/placeholder.svg?height=64&width=64&text=${participant.username[0].toUpperCase()}`} />
				{/* <AvatarFallback className="text-lg font-bold">{participant.username[0].toUpperCase()}</AvatarFallback> */}
				<AvatarFallback className="text-lg font-bold">
					<img
						src={`${import.meta.env.VITE_APP_API_URL}/${participant.avatar}` || "demo-image.png"}
					/>
				</AvatarFallback>
			</Avatar>
			<div className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-lg">
				{getRankIcon(participant.rank)}
			</div>
		</motion.div>

		<div className="text-center mb-4">
			<h3 className="font-bold text-gray-800 text-sm">{participant.username}</h3>
			<p className="text-2xl font-bold text-gray-900">{participant.score}</p>
			<p className="text-xs text-gray-600">{participant.correctAnswersCount} correct</p>
		</div>

		<motion.div
			initial={{ height: 0 }}
			animate={{ height: height }}
			transition={{ delay: participant.rank * 0.3, duration: 0.8, ease: "easeOut" }}
			className={`w-24 bg-gradient-to-t ${getRankColor(participant.rank)} rounded-t-lg border-2 border-white shadow-lg flex items-end justify-center pb-4`}
		>
			<span className="text-white font-bold text-lg">#{participant.rank}</span>
		</motion.div>
	</motion.div>
)

const LeaderboardRow = ({ participant, index }: { participant: ParticipantScore; index: number }) => (
	<motion.div
		initial={{ x: -100, opacity: 0 }}
		animate={{ x: 0, opacity: 1 }}
		transition={{ delay: index * 0.1, duration: 0.5 }}
		whileHover={{ scale: 1.02, backgroundColor: "rgba(59, 130, 246, 0.05)" }}
		className="transition-colors duration-200"
	>
		<Card className="mb-3 hover:shadow-md transition-shadow duration-200">
			<CardContent className="p-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-4">
						<div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100">
							<span className="font-bold text-gray-700">#{participant.rank}</span>
						</div>

						<Avatar className="w-10 h-10">
							<AvatarImage src={`/placeholder.svg?height=40&width=40&text=${participant.username[0].toUpperCase()}`} />
							<AvatarFallback>
								<User className="w-5 h-5" />
							</AvatarFallback>
						</Avatar>

						<div>
							<h4 className="font-semibold text-gray-800">{participant.username}</h4>
							<div className="flex items-center space-x-2 text-sm text-gray-600">
								<Target className="w-4 h-4" />
								<span>{participant.correctAnswersCount} correct</span>
								{participant.violations > 0 && (
									<>
										<AlertTriangle className="w-4 h-4 text-red-500" />
										<span className="text-red-500">{participant.violations} violations</span>
									</>
								)}
							</div>
						</div>
					</div>

					<div className="text-right">
						<div className="text-2xl font-bold text-gray-900">{participant.score}</div>
						<Badge variant="secondary" className="text-xs">
							Score
						</Badge>
					</div>
				</div>
			</CardContent>
		</Card>
	</motion.div>
)

export default function LeaderBoard() {
	const [scoreBoard, setScoreBoard] = useState<ParticipantScore[]>([])
	const [loading, setLoading] = useState(true)
	const params = useParams();
	const { token } = useAuth();
	useEffect(() => {
		// Simulate API call
		const fetchData = async () => {
			setLoading(true)
			const result: any = await getLeaderBoardByQuizId(params?.quizId as string, token as string);

			setScoreBoard(result.participantScores)
			setLoading(false)
		}

		fetchData()
	}, [])

	if (loading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
				<motion.div
					animate={{ rotate: 360 }}
					transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
					className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
				/>
			</div>
		)
	}

	const topThree = scoreBoard.slice(0, 3)
	const remaining = scoreBoard.slice(3)

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
			<div className="max-w-6xl mx-auto">
				{/* Header */}
				<motion.div
					initial={{ y: -50, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ duration: 0.6 }}
					className="text-center mb-12"
				>
					<h1 className="text-4xl font-bold text-gray-800 mb-2">🏆 Leaderboard</h1>
					<p className="text-gray-600">Quiz Champions Hall of Fame</p>
				</motion.div>

				{/* Podium for Top 3 */}
				{topThree.length > 0 && (
					<div className="mb-12">
						<motion.h2
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.3 }}
							className="text-2xl font-bold text-center text-gray-800 mb-8"
						>
							🥇 Top Performers
						</motion.h2>

						<div className="flex justify-center items-end space-x-8 mb-8">
							{/* Second Place */}
							{topThree[1] && <PodiumCard participant={topThree[1]} height="120px" />}

							{/* First Place */}
							{topThree[0] && <PodiumCard participant={topThree[0]} height="160px" />}

							{/* Third Place */}
							{topThree[2] && <PodiumCard participant={topThree[2]} height="100px" />}
						</div>
					</div>
				)}

				{/* Remaining Participants */}
				{remaining.length > 0 && (
					<div className="max-w-2xl mx-auto">
						<motion.h2
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.5 }}
							className="text-xl font-bold text-gray-800 mb-6"
						>
							📊 All Rankings
						</motion.h2>

						<div>
							{remaining.map((participant, index) => (
								<LeaderboardRow key={participant._id} participant={participant} index={index} />
							))}
						</div>
					</div>
				)}

				{scoreBoard.length === 0 && !loading && (
					<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
						<Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
						<h3 className="text-xl font-semibold text-gray-600 mb-2">No Results Yet</h3>
						<p className="text-gray-500">Be the first to complete the quiz!</p>
					</motion.div>
				)}
			</div>
		</div>
	)
}

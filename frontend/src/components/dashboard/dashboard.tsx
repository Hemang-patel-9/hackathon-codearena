"use client"

import { useEffect, useState } from "react"
import ProfileHeader from "../profile/ProfileHeader"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/authContext"
import type { ProfileFormData, User as UserProfile } from "@/types/user"
import { getUserById } from "@/api/user"
import type { Result } from "@/types/response"
import { Card, CardContent, CardTitle, CardDescription } from "./dashboard-card"
import { Badge } from "./dashboard-badge"
import { Avatar, AvatarImage, AvatarFallback } from "./dashboard-avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./dashboard-tabs"
import { format } from "date-fns"
import { Clock, Users, Trophy, Calendar, BookOpen, Target, Eye, Play, Edit } from "lucide-react"
import type { Quiz, ParticipatedQuiz, UserQuizData } from "../../types/dashboard"
import { useSocket } from "@/hooks/use-socket"

const API_BASE_URL = import.meta.env.VITE_APP_API_URL

export function Dashboard() {
    const [avatarPreview, setAvatarPreview] = useState<string>("")
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [quizData, setQuizData] = useState<UserQuizData | null>(null)
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

    const socket = useSocket()
    const navigate = useNavigate()
    const { user, token } = useAuth()

    // Load user profile on component mount
    useEffect(() => {
        if (!token) {
            navigate("/")
        }
        loadUserProfile()
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

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                setIsLoading(true)
                console.log(API_BASE_URL)
                const response = await fetch(`${API_BASE_URL}/quiz/allQuiz/${user?._id}`)
                const data = await response.json()
                console.log(data)
                if (data.success) {
                    setQuizData(data.data)
                }
            } catch (error) {
                console.error("Error fetching quizzes:", error)
            } finally {
                setIsLoading(false)
            }
        }

        if (user?._id) {
            fetchQuizzes()
        }
    }, [user?._id])

    const handleFirstButtonClick = (quizId: string, isCreated: boolean) => {
        if (isCreated) {
            navigate(`/quiz/monitoring/${quizId}`)
            if (socket) {
                socket.emit("creator:start-quiz", { quizId })
            }
        } else {
            navigate(`/quiz/${quizId}/review`)
        }
    }

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "active":
                return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
            case "completed":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
            case "upcoming":
                return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100"
            case "draft":
                return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100"
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100"
        }
    }

    const getRankColor = (rank: number, total: number) => {
        const percentage = (rank / total) * 100
        if (percentage <= 10) return "text-yellow-600 dark:text-yellow-400"
        if (percentage <= 25) return "text-green-600 dark:text-green-400"
        if (percentage <= 50) return "text-blue-600 dark:text-blue-400"
        return "text-gray-600 dark:text-gray-400"
    }

    const QuizCard = ({
        quiz,
        isCreated = false,
        scoreDetails = null,
        participatedAt = null,
    }: {
        quiz: Quiz
        isCreated?: boolean
        scoreDetails?: ParticipatedQuiz["scoreDetails"] | null
        participatedAt?: Date | null
    }) => (
        <Card className="group relative overflow-hidden hover:shadow-xl transition-all duration-500 hover:scale-[1.02] bg-transparent backdrop-blur-sm dark:border-purple-900/50 border-purple-200/50 h-[430px] flex flex-col">
            {/* Header Section with Thumbnail - Fixed Height */}
            <div className="relative h-48 overflow-hidden flex-shrink-0">
                {quiz.thumbnail ? (
                    <div className="relative h-full w-full">
                        <img
                            src={`${import.meta.env.VITE_APP_API_URL}/${quiz.thumbnail}` || "demo-image.png"}
                            alt={quiz.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    </div>
                ) : (
                    <div className="h-full w-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 relative overflow-hidden">
                        {/* Animated Background Pattern */}
                        <div className="absolute inset-0 opacity-20">
                            <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16 animate-pulse"></div>
                            <div className="absolute top-1/2 right-0 w-24 h-24 bg-white rounded-full translate-x-12 animate-bounce"></div>
                            <div className="absolute bottom-0 left-1/3 w-20 h-20 bg-white rounded-full translate-y-10 animate-pulse delay-300"></div>
                        </div>

                        {/* Floating Animation */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="relative">
                                <BookOpen className="w-16 h-16 text-white/90 animate-bounce" />
                                <div className="absolute -inset-4 bg-white/10 rounded-full animate-ping"></div>
                            </div>
                        </div>

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-3 right-3 z-10">
                    <Badge
                        className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(quiz.status)} shadow-lg backdrop-blur-sm`}
                    >
                        {quiz.status}
                    </Badge>
                </div>

                {/* Hover Overlay with Edit Button Only */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                    <button className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-200 transform hover:scale-110">
                        <Edit className="w-5 h-5 text-white" />
                    </button>
                </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 p-4 flex flex-col relative">
                {/* Basic Content (always visible) */}
                {/* Removed flex-shrink-0 to allow it to fill available space */}
                <div className="flex-1">
                    {/* Title and Description */}
                    <div className="mb-3">
                        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1 mb-1">
                            {quiz.title}
                        </CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 h-10">
                            {quiz.description}
                        </CardDescription>
                    </div>

                    {/* Basic Info */}
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300 mb-3">
                        <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-blue-500" />
                            <span>{quiz.duration}m</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Users className="w-4 h-4 text-green-500" />
                            <span>{quiz.participants.length}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4 text-purple-500" />
                            <span>{format(new Date(quiz.schedule), "MMM dd")}</span>
                        </div>
                    </div>

                    {/* Basic Tags */}
                    <div className="flex overflow-x-auto scrollbar-hide items-center gap-2 mb-3">
                        <div className="flex flex-nowrap items-center gap-2">
                            {quiz.tags.map((tag, index) => (
                                <Badge
                                    key={index}
                                    variant="outline"
                                    className="whitespace-nowrap text-xs text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 px-2 py-1"
                                >
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Detailed Information Panel - Slides in from right on hover */}
                <div className="absolute inset-x-0 top-0 bottom-[70px] bg-background backdrop-blur-md rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg transform translate-x-full opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 ease-out overflow-y-auto">
                    <div className="p-4 space-y-3">
                        {/* All Tags */}
                        <div>
                            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">All Tags</h4>
                            <div className="flex items-center gap-2 flex-wrap">
                                {quiz.tags.map((tag, index) => (
                                    <Badge
                                        key={index}
                                        variant="outline"
                                        className="text-xs text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 px-2 py-1"
                                    >
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        {/* Score Details for Participated Quizzes */}
                        {!isCreated && scoreDetails && (
                            <div>
                                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Your Performance</h4>
                                <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                    <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                                        <div className="flex items-center gap-2">
                                            <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                            <span className="text-gray-600 dark:text-gray-300">Score:</span>
                                            <span className="font-bold text-blue-600 dark:text-blue-400">{scoreDetails.score}%</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Trophy
                                                className={`w-4 h-4 ${getRankColor(scoreDetails.rank, scoreDetails.totalParticipants)}`}
                                            />
                                            <span className="text-gray-600 dark:text-gray-300">Rank:</span>
                                            <span className={`font-bold ${getRankColor(scoreDetails.rank, scoreDetails.totalParticipants)}`}>
                                                #{scoreDetails.rank}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 bg-white/50 dark:bg-gray-800/50 p-2 rounded">
                                        <div className="flex items-center justify-between">
                                            <span>{scoreDetails.correctAnswersCount} correct answers</span>
                                            <span>{scoreDetails.averageResponseTime.toFixed(1)}s avg time</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Participants for Created Quizzes */}
                        {isCreated && quiz.participants.length > 0 && (
                            <div>
                                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                                    Participants ({quiz.participants.length})
                                </h4>
                                <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        {quiz.participants.slice(0, 8).map((participant, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center gap-2 bg-white dark:bg-gray-600 rounded-full px-2 py-1"
                                            >
                                                <Avatar className="w-5 h-5 border border-gray-300 dark:border-gray-500">
                                                    <AvatarImage src={participant.avatar || "/placeholder.svg"} alt={participant.username} />
                                                    <AvatarFallback className="text-xs bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                                                        {participant.username.charAt(0).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="text-xs text-gray-700 dark:text-gray-200">{participant.username}</span>
                                            </div>
                                        ))}
                                        {quiz.participants.length > 8 && (
                                            <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-600 rounded-full px-2 py-1">
                                                +{quiz.participants.length - 8} more
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Additional Quiz Details */}
                        <div>
                            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Quiz Details</h4>
                            <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <span>Scheduled:</span>
                                        <span className="font-medium">{format(new Date(quiz.schedule), "MMM dd, yyyy HH:mm")}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span>Duration:</span>
                                        <span className="font-medium">{quiz.duration} minutes</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span>Status:</span>
                                        <Badge className={`text-xs ${getStatusColor(quiz.status)}`}>{quiz.status}</Badge>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Start/Review Button - Always Visible at the very bottom */}
                <div className="mt-auto pt-3 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
                    <button
                        className="w-full px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-95 shadow-md hover:shadow-lg text-sm flex items-center justify-center gap-2"
                        onClick={() => handleFirstButtonClick(quiz._id, isCreated)}
                    >
                        {isCreated ? (
                            <>
                                <Play className="w-4 h-4" />
                                Start Quiz
                            </>
                        ) : (
                            <>
                                <Eye className="w-4 h-4" />
                                Review Quiz
                            </>
                        )}
                    </button>
                </div>
            </div>
        </Card>
    )

    const SummaryCard = ({
        title,
        value,
        icon: Icon,
        color,
    }: {
        title: string
        value: string | number
        icon: any
        color: string
    }) => (
        <Card className="hover:shadow-md transition-shadow duration-300 dark:border-purple-900 border-purple-200">
            <CardContent className="p-6">
                <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-full ${color}`}>
                        <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{title}</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 transition-colors duration-500">
                <ProfileHeader avatarPreview={avatarPreview} userProfile={userProfile} setAvatarPreview={setAvatarPreview} />
                <div className="container mx-auto px-4 py-8">
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-transparent transition-colors duration-500">
            <div className="container mx-auto px-4 py-8">
                <style>{`
                .line-clamp-1 {
                    display: -webkit-box;
                    -webkit-line-clamp: 1;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>

                <ProfileHeader avatarPreview={avatarPreview} userProfile={userProfile} setAvatarPreview={setAvatarPreview} />

                {/* Summary Cards */}
                {quizData && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <SummaryCard
                            title="Created Quizzes"
                            value={quizData.summary.totalCreated}
                            icon={BookOpen}
                            color="bg-blue-500"
                        />
                        <SummaryCard
                            title="Participated Quizzes"
                            value={quizData.summary.totalParticipated}
                            icon={Users}
                            color="bg-green-500"
                        />
                        <SummaryCard
                            title="Average Score"
                            value={`${quizData.summary.averageScore}%`}
                            icon={Trophy}
                            color="bg-purple-500"
                        />
                    </div>
                )}

                {/* Quiz Tabs */}
                <Tabs defaultValue="created" className="w-full">
                    <TabsList className="grid gap-5 w-full grid-cols-2 mb-8 bg-transparent">
                        <TabsTrigger value="created" className="bg-gradient-to-tr transition-all duration-300">
                            <BookOpen className="w-4 h-4 mr-2" />
                            Created Quizzes ({quizData?.summary.totalCreated || 0})
                        </TabsTrigger>
                        <TabsTrigger value="participated" className="bg-gradient-to-tr  transition-all duration-300">
                            <Users className="w-4 h-4 mr-2" />
                            Participated Quizzes ({quizData?.summary.totalParticipated || 0})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="created" className="mt-6">
                        <div className="space-y-4">
                            {quizData?.createdQuizzes && quizData.createdQuizzes.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {quizData.createdQuizzes.map((quiz, index) => (
                                        <div
                                            key={quiz._id}
                                            className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                                            style={{ animationDelay: `${index * 100}ms` }}
                                        >
                                            <QuizCard quiz={quiz} isCreated={true} />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <Card className="bg-transparent dark:border-purple-950 border-purple-200">
                                    <CardContent className="p-12 text-center">
                                        <BookOpen className="w-16 h-16 mx-auto dark:text-blue-900 text-blue-400 mb-4" />
                                        <h3 className="text-xl font-semibold bg-gradient-to-tr dark:from-purple-900 dark:to-blue-900 from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
                                            No Created Quizzes Yet
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300">
                                            Start creating your first quiz to engage with your audience!
                                        </p>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="participated" className="mt-6">
                        <div className="space-y-4">
                            {quizData?.participatedQuizzes && quizData.participatedQuizzes.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {quizData.participatedQuizzes.map((participatedQuiz, index) => (
                                        <div
                                            key={participatedQuiz.quiz._id}
                                            className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                                            style={{ animationDelay: `${index * 100}ms` }}
                                        >
                                            <QuizCard
                                                quiz={participatedQuiz.quiz}
                                                isCreated={false}
                                                scoreDetails={participatedQuiz.scoreDetails}
                                                participatedAt={participatedQuiz.participatedAt}
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <Card className="bg-transparent  dark:border-purple-950 border-purple-200">
                                    <CardContent className="p-12 text-center flex flex-col justify-center items-center">
                                        <Users className="w-16 h-16 mx-auto mb-4  dark:text-purple-900 text-purple-400" />
                                        <h3 className="text-xl font-semibold w-fit bg-gradient-to-tr dark:from-purple-900 dark:to-blue-900 from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
                                            No Participated Quizzes Yet
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300">
                                            Join some quizzes to test your knowledge and compete with others!
                                        </p>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

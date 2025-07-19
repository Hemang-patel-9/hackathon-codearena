import { useEffect, useState } from "react";
import ProfileHeader from "../profile/ProfileHeader";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/authContext";
import type { ProfileFormData, User as UserProfile } from "@/types/user"
import { getUserById } from "@/api/user";
import type { Result } from "@/types/response"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './dashboard-card'
import { Badge } from "./dashboard-badge";
import { Avatar, AvatarImage, AvatarFallback } from './dashboard-avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './dashboard-tabs'
import { format } from 'date-fns';
import { Clock, Users, Trophy, Calendar, BookOpen, Target } from 'lucide-react';
import type { Quiz, ParticipatedQuiz, UserQuizData } from '../../types/dashboard'
import type {QuizData} from '@/types/quiz'
import { useSocket } from "@/hooks/use-socket";
import EditQuizModal from "../user-quiz-render/edit-quiz-modal";
import {updateQuiz} from "@/api/quiz"

const API_BASE_URL = import.meta.env.VITE_APP_API_URL;

export function Dashboard() {

    const [avatarPreview, setAvatarPreview] = useState<string>("")
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [quizData, setQuizData] = useState<UserQuizData | null>(null);
    const [profileData, setProfileData] = useState<ProfileFormData>({
        username: "",
        bio: "",
        socialLinks: {
            github: "",
            linkedin: "",
            twitter: "",
            website: "",
        },
    });
    const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null)
    const [showEditModal, setShowEditModal] = useState(false)

    const socket = useSocket();

    const navigate = useNavigate();
    const { user, token } = useAuth();

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

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                setIsLoading(true);
                console.log(API_BASE_URL);

                const response = await fetch(`${API_BASE_URL}/quiz/allQuiz/${user?._id}`);
                const data = await response.json();
                console.log(data);

                if (data.success) {
                    setQuizData(data.data);
                }
            } catch (error) {
                console.error('Error fetching quizzes:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (user?._id) {
            fetchQuizzes();
        }
    }, [user?._id]);

    const handleEditQuiz = (quiz: QuizData) => {
        console.log("Editing quiz:", quiz)
        setSelectedQuiz(quiz)
        setShowEditModal(true)
    }

    const handleUpdateQuiz = async (quizId: string, updates: Partial<Quiz>) => {
        try {
            const result = await updateQuiz(quizId, updates, token as string)      
            console.log("Update quiz response:", result.data)
            setQuizData((prev) => {
                if (!prev) return prev
                return {
                    ...prev,
                    createdQuizzes: prev.createdQuizzes.map((q) =>
                        q._id === quizId ? { ...q, ...result.data } : q
                    ),
                }
            })
            setSelectedQuiz(null)
            setShowEditModal(false)
        } catch (error) {
            console.error("Failed to update quiz:", error)
        }
    }

    const handleFirstButtonClick = (quizId: string, isCreated: boolean) => {
        if (isCreated) {
            navigate(`/quiz/monitoring/${quizId}`);
            if (socket) {
                socket.emit("creator:start-quiz", { quizId });
            }
        } else {
            navigate(`/quiz/${quizId}/review`);
        }
    };
    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
            case 'completed':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
            case 'upcoming':
                return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100';
            case 'draft':
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100';
        }
    };

    const getRankColor = (rank: number, total: number) => {
        const percentage = (rank / total) * 100;
        if (percentage <= 10) return 'text-yellow-600 dark:text-yellow-400';
        if (percentage <= 25) return 'text-green-600 dark:text-green-400';
        if (percentage <= 50) return 'text-blue-600 dark:text-blue-400';
        return 'text-gray-600 dark:text-gray-400';
    };

    const QuizCard = ({ quiz, isCreated = false, scoreDetails = null, participatedAt = null }: {
        quiz: Quiz;
        isCreated?: boolean;
        scoreDetails?: ParticipatedQuiz['scoreDetails'] | null;
        participatedAt?: Date | null;
    }) => (
        <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 h-full flex flex-col">
            {/* Header Section with Thumbnail */}
            <div className="relative">
                {quiz.thumbnail ? (
                    <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                        <img
                            src={`${import.meta.env.VITE_APP_API_URL}/${quiz.thumbnail}` || "demo-image.png"}
                            alt={quiz.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute top-3 right-3">
                            <Badge className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(quiz.status)} shadow-lg`}>
                                {quiz.status}
                            </Badge>
                        </div>
                    </div>
                ) : (
                    <div className="h-48 w-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-t-lg flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-black/10" />
                        <BookOpen className="w-16 h-16 text-white/80" />
                        <div className="absolute top-3 right-3">
                            <Badge className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(quiz.status)} shadow-lg`}>
                                {quiz.status}
                            </Badge>
                        </div>
                    </div>
                )}
            </div>

            {/* Content Section */}
            <CardHeader className="pb-3 flex-1">
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                    {quiz.title}
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300 mt-1 line-clamp-2 min-h-[2.5rem]">
                    {quiz.description}
                </CardDescription>
            </CardHeader>

            <CardContent className="pt-0 flex-1 flex flex-col">
                <div className="space-y-4 flex-1">
                    {/* Tags */}
                    <div className="flex items-center gap-2 flex-wrap min-h-[2rem]">
                        {quiz.tags.slice(0, 2).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600">
                                {tag}
                            </Badge>
                        ))}
                        {quiz.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs text-gray-500 dark:text-gray-400">
                                +{quiz.tags.length - 2}
                            </Badge>
                        )}
                    </div>

                    {/* Quiz Info Grid */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <Clock className="w-4 h-4 text-blue-500" />
                            <span className="font-medium">{quiz.duration} min</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <Users className="w-4 h-4 text-green-500" />
                            <span className="font-medium">{quiz.participants.length}</span>
                        </div>
                        <div className="col-span-2 flex items-center gap-2 text-gray-600 dark:text-gray-300 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <Calendar className="w-4 h-4 text-purple-500" />
                            <span className="font-medium">{format(new Date(quiz.schedule), 'MMM dd, yyyy')}</span>
                        </div>
                    </div>

                    {/* Score Details for Participated Quizzes */}
                    {!isCreated && scoreDetails && (
                        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div className="flex items-center gap-2">
                                    <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                    <span className="text-gray-600 dark:text-gray-300">Score:</span>
                                    <span className="font-bold text-blue-600 dark:text-blue-400">
                                        {scoreDetails.score}%
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Trophy className={`w-4 h-4 ${getRankColor(scoreDetails.rank, scoreDetails.totalParticipants)}`} />
                                    <span className="text-gray-600 dark:text-gray-300">Rank:</span>
                                    <span className={`font-bold ${getRankColor(scoreDetails.rank, scoreDetails.totalParticipants)}`}>
                                        #{scoreDetails.rank}
                                    </span>
                                </div>
                                <div className="col-span-2 text-xs text-gray-500 dark:text-gray-400 bg-white/50 dark:bg-gray-800/50 p-2 rounded">
                                    <div className="flex items-center justify-between">
                                        <span>{scoreDetails.correctAnswersCount} correct answers</span>
                                        <span>{scoreDetails.averageResponseTime.toFixed(1)}s avg</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Participants for Created Quizzes */}
                    {isCreated && quiz.participants.length > 0 && (
                        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                        Participants
                                    </span>
                                </div>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {quiz.participants.length} joined
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                {quiz.participants.slice(0, 4).map((participant, index) => (
                                    <Avatar key={index} size="sm" className="border-2 border-white dark:border-gray-600 shadow-sm">
                                        <AvatarImage src={participant.avatar} alt={participant.username} />
                                        <AvatarFallback className="text-xs bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                                            {participant.username.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                ))}
                                {quiz.participants.length > 4 && (
                                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-xs text-gray-600 dark:text-gray-300 border-2 border-white dark:border-gray-600 shadow-sm font-medium">
                                        +{quiz.participants.length - 4}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Action Button */}
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg" onClick={() => { handleFirstButtonClick(quiz._id, isCreated) }}>
                        {isCreated ? 'Start Quiz' : 'Review Quiz'}
                    </button>
                    <button className="w-full px-4 mt-3 py-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg" onClick={() => handleEditQuiz(quiz)}>
                        {"Edit Quiz"}
                    </button>
                </div>
            </CardContent>
        </Card>
    );

    const SummaryCard = ({ title, value, icon: Icon, color }: {
        title: string;
        value: string | number;
        icon: any;
        color: string;
    }) => (
        <Card className="hover:shadow-md transition-shadow duration-300 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
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
    );

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 transition-colors duration-500">
                <ProfileHeader
                    avatarPreview={avatarPreview}
                    userProfile={userProfile}
                    setAvatarPreview={setAvatarPreview}
                />
                <div className="container mx-auto px-4 py-8">
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 transition-colors duration-500">
            <style>{`
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
            <ProfileHeader
                avatarPreview={avatarPreview}
                userProfile={userProfile}
                setAvatarPreview={setAvatarPreview}
            />

            <div className="container mx-auto px-4 py-8">
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
                    <TabsList className="grid w-full grid-cols-2 mb-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                        <TabsTrigger
                            value="created"
                            className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-900 dark:data-[state=active]:text-blue-100 transition-all duration-300"
                        >
                            <BookOpen className="w-4 h-4 mr-2" />
                            Created Quizzes ({quizData?.summary.totalCreated || 0})
                        </TabsTrigger>
                        <TabsTrigger
                            value="participated"
                            className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700 dark:data-[state=active]:bg-green-900 dark:data-[state=active]:text-green-100 transition-all duration-300"
                        >
                            <Users className="w-4 h-4 mr-2" />
                            Participated Quizzes ({quizData?.summary.totalParticipated || 0})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="created" className="mt-6">
                        <div className="space-y-4">
                            {quizData?.createdQuizzes && quizData.createdQuizzes.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                    <CardContent className="p-12 text-center">
                                        <BookOpen className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
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
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                    <CardContent className="p-12 text-center">
                                        <Users className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
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
                <EditQuizModal
                    quiz={selectedQuiz}
                    isOpen={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    onUpdate={handleUpdateQuiz}
                />
            </div>
        </div>
    );
}
export interface UserActivity {
    action: string
    timestamp: string
    details: string
}

export interface UserScore {
    quizTitle: string
    score: number
    completedAt: string
    rank: number
}

export interface User {
    _id: string
    username: string
    email: string
    role: "user" | "admin" | "moderator"
    isVerified: boolean
    isBanned: boolean
    bio: string
    avatar?: string
    createdAt: string
    achievements: string[]
    lastActive: string
    totalQuizzes: number
    averageScore: number
    recentActivity: UserActivity[]
    recentScores: UserScore[]
    socialLinks: {
        github: string
        linkedin: string
        twitter: string
        website: string
    }
}

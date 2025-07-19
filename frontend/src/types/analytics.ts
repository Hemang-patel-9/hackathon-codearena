// Interface for Quiz Analytics response data
export interface QuizAnalyticsData {
    totalQuizzes: number;
    activeQuizzes: number;
    inactiveQuizzes: number;
    visibilityCounts: { [key: string]: number };
    questionOrderCounts: { [key: string]: number };
    averageQuestionsPerQuiz: string;
    averageTimePerQuestion: string;
    averagePassingCriteria: string;
    scheduledCount: number;
    todayScheduled: number;
    upcomingScheduled: number;
    tagFrequency: { [key: string]: number };
    creatorWiseQuizCount: { [key: string]: number };
}

// Interface for User Analytics response data
export interface UserAnalyticsData {
    totalUsers: number;
    verifiedUsers: number;
    unverifiedUsers: number;
    bannedUsers: number;
    notBannedUsers: number;
    roleDistribution: { [key: string]: number };
    recentRegistrations: { username: string; email: string; createdAt: string }[];
}
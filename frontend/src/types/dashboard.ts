export interface Quiz {
    _id: string;
    title: string;
    description: string;
    status: string;
    duration: number;
    schedule: Date;
    participants: Array<{
        username: string;
        email: string;
        avatar: string;
    }>;
    thumbnail: string;
    tags: string[];
    createdAt: Date;
}

export interface ParticipatedQuiz {
    quiz: Quiz;
    scoreDetails: {
        score: number;
        correctAnswersCount: number;
        averageResponseTime: number;
        rank: number;
        totalParticipants: number;
    };
    participatedAt: Date;
}

export interface UserQuizData {
    summary: {
        totalCreated: number;
        totalParticipated: number;
        averageScore: number;
    };
    createdQuizzes: Quiz[];
    participatedQuizzes: ParticipatedQuiz[];
}
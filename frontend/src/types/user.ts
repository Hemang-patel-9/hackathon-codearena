export interface UserForm {
	username: string
	email: string
	password: string
	confirmPassword: string
	avatar: string
	bio: string
	socialLinks: {
		github: string
		linkedin: string
		twitter: string
		website: string
	}
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
	updatedAt: string
	socialLinks: {
		github?: string
		linkedin?: string
		twitter?: string
		website?: string
	}
	achievements: string[]
	recentQuizzes?: {
		quizId: string
		title: string
		description: string
		schedule: string
		status: string
		score: {
			score: number
			correctAnswersCount: number
			averageResponseTime: number
			rank: number
		} | null
	}[]
}

export interface PasswordFormData {
	currentPassword: string
	newPassword: string
	confirmNewPassword: string
}

export interface ProfileFormData {
	username: string
	bio: string
	socialLinks: {
		github: string
		linkedin: string
		twitter: string
		website: string
	}
}
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
	avatar?: string
	role: "user" | "admin" | "moderator"
	isVerified: boolean
	isBanned: boolean
	bio: string
	socialLinks: {
		github: string
		linkedin: string
		twitter: string
		website: string
	}
	createdAt: string
	updatedAt: string
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
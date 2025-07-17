import type { Result } from "@/types/response";
import type { PasswordFormData } from "@/types/user";

const API_BASE_URL = import.meta.env.VITE_APP_API_URL;

export async function registerUser(formData: FormData): Promise<Result> {
	try {
		const response = await fetch(`${API_BASE_URL}/user/register`, {
			method: "POST",
			body: formData, // FormData automatically sets the correct Content-Type
		})

		if (!response.ok) {
			const errorData = await response.json()
			throw new Error(errorData.message || "Registration failed")
		}

		const data: Result = await response.json()
		return data
	} catch (error) {
		console.error("Registration API error:", error)
		throw error
	}
}

export async function loginUser(formData: { email: string, password: string }): Promise<Result> {
	try {
		const response = await fetch(`${API_BASE_URL}/user/login`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ email: formData.email, password: formData.password }),
		})

		const data: Result = await response.json()
		return data
	} catch (error) {
		console.error("Login API error:", error)
		throw error
	}
}

export async function getUserById(userId: string, token: string): Promise<Result> {
	try {
		console.log(userId, "--", token)
		const response = await fetch(`${API_BASE_URL}/user/${userId}`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
		})

		const data: Result = await response.json()
		return data;
	} catch (error) {
		console.error("Get profile API error:", error)
		throw error
	}
}

export async function updatePassword(
	userId: string,
	token: string,
	data: PasswordFormData
): Promise<Result> {
	try {
		const response = await fetch(`${API_BASE_URL}/user/update-password/${userId}`, {
			method: "PATCH",
			body: JSON.stringify(data),
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
		});

		const result: Result = await response.json();
		return result;

	} catch (error) {
		console.error("Update password API error:", error);
		throw error;
	}
}

export async function updateProfile(
	userId: string,
	token: string,
	formData: FormData
): Promise<Result> {
	try {
		const response = await fetch(`${API_BASE_URL}/user/update-profile/${userId}`, {
			method: "PATCH",
			body: formData,
			headers: {
				Authorization: `Bearer ${token}`
			},
		});

		const result: Result = await response.json();
		return result;

	} catch (error) {
		console.error("Update profile API error:", error);
		throw error;
	}
}

export async function handleSendOtp(
	email: string,
	token: string
): Promise<Result> {
	try {
		const response = await fetch(`${API_BASE_URL}/user/send-otp`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ email }),
		});

		const result: Result = await response.json();
		return result;

	} catch (error) {
		console.error("Send OTP error:", error);
		throw error;
	}
}

export async function verifyOtp(
	email: string,
	otp: string,
	token: string
): Promise<Result> {
	try {
		const response = await fetch(`${API_BASE_URL}/user/verify-otp`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ email, otp }),
		});

		const result: Result = await response.json();
		return result;
	} catch (error) {
		console.error("OTP verification failed:", error);
		throw error;
	}
}

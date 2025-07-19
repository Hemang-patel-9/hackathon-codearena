import type { QuizData } from "@/types/quiz";
import type { Result } from "@/types/response";

const API_BASE_URL = import.meta.env.VITE_APP_API_URL;

export async function createQuiz(formData: QuizData, token: string): Promise<Result> {
	try {
		const response = await fetch(`${API_BASE_URL}/quiz`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${token}`,
			},
			body: JSON.stringify(formData),
		});

		return response.json() as Promise<Result>;
	} catch (error) {
		console.error("Failed to create quiz:", error);
		throw error;
	}
}

export const fetchPrivateQuizzes = async (token: string, userId: string): Promise<Result> => {
	const response = await fetch(`${API_BASE_URL}/quiz/upcoming/${userId}`, {
		method: 'GET',
		headers: {
			'Authorization': `Bearer ${token}`,
			'Content-Type': 'application/json',
		},
	});

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	const data: Result = await response.json();
	return data;
};

export const fetchPublicQuizzes = async (): Promise<Result> => {
	const response = await fetch(`${API_BASE_URL}/quiz/publicQuiz/all`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
	});

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	const data: Result = await response.json();
	return data;
};
export async function getQuizById(quizId: string, token: string): Promise<Result> {
	try {
		const response = await fetch(`${API_BASE_URL}/quiz/${quizId}`, {
			headers: {
				"Authorization": `Bearer ${token}`,
			},
		});

		return response.json() as Promise<Result>;
	} catch (error) {
		console.error("Failed to fetch quiz:", error);
		throw {
			message: "Failed to fetch quiz data",
			error: "Network error",
			data: null
		};
	}
}

export const updateQuiz = async (quizId: string, updates: Partial<QuizData>, token: string): Promise<Result> => {
	try {
		const response = await fetch(`${API_BASE_URL}/quiz/${quizId}`, {
			method: 'PUT',
			headers: {
				'Authorization': `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(updates),
		})

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`)
		}

		const data: Result = await response.json()
		return data
	} catch (error) {
		console.error("Failed to update quiz:", error)
		return {
			message: "Failed to fetch quiz data",
			error: "Network error",
			data: null
		}
	}
}
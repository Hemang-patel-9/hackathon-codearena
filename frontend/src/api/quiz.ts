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
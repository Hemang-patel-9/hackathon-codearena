import type { Result } from "@/types/response";

const API_BASE_URL = import.meta.env.VITE_APP_API_URL;

export async function getLeaderBoardByQuizId(quizId: string, token?: string) {
	try {
		const response = await fetch(`${API_BASE_URL}/quiz/scoreboard/${quizId}`, {
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
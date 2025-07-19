import type { Result } from "@/types/response";

const API_BASE_URL = import.meta.env.VITE_APP_API_URL;



// Fetch Quiz Analytics
export async function getQuizAnalytics(): Promise<Result> {
    try {
        const response = await fetch(`${API_BASE_URL}/analytics/quizanalysis`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json() as Promise<Result>;
    } catch (error) {
        console.error("Failed to fetch quiz analytics:", error);
        throw error;
    }
}

// Fetch User Analytics
export async function getUserAnalytics(): Promise<Result> {
    try {
        const response = await fetch(`${API_BASE_URL}/analytics/useranalysis`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json() as Promise<Result>;
    } catch (error) {
        console.error("Failed to fetch user analytics:", error);
        throw error;
    }
}
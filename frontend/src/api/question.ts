import type { QuestionData } from "@/types/question"
import type { Result } from "@/types/response"

const API_BASE_URL = import.meta.env.VITE_APP_API_URL;

export const fetchQuestionById = async (questionId: string): Promise<Result> => {
    try {
        const response = await fetch(`${API_BASE_URL}/question/${questionId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data: Result = await response.json()
        return data
    } catch (error) {
        console.error("Failed to fetch question:", error)
        return {
            error: "Failed to fetch question",
            message: error instanceof Error ? error.message : "Network error",
            data: null,
        }
    }
}

export const createQuestion = async (question: Partial<QuestionData>): Promise<Result> => {
    try {
        const response = await fetch(`${API_BASE_URL}/question`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(question),
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data: Result = await response.json()
        return data
    } catch (error) {
        console.error("Failed to create question:", error)
        return {
            error: "Failed to create question",
            message: error instanceof Error ? error.message : "Network error",
            data: undefined,
        }
    }
}

export const updateQuestion = async (questionId: string, updates: Partial<QuestionData>): Promise<Result> => {
    try {
        const response = await fetch(`${API_BASE_URL}/question/${questionId}`, {
            method: 'PUT',
            headers: {
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
        console.error("Failed to update question:", error)
        return {
            error: "Failed to update question",
            message: "Failed to update quiz",
            data: undefined,
        }
    }
}

export const deleteQuestion = async (questionId: string): Promise<Result> => {
    try {
        const response = await fetch(`${API_BASE_URL}/question/${questionId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data: Result = await response.json()
        return data
    } catch (error) {
        console.error("Failed to delete question:", error)
        return {
            error: "Failed to delete question",
            message: error instanceof Error ? error.message : "Network error",
            data: undefined,
        }
    }
}
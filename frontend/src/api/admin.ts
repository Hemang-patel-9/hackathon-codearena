import type { Result } from "@/types/response";
import type { User } from "@/types/user";

const API_BASE_URL = import.meta.env.VITE_APP_API_URL;

export const fetchAllUsersWithQuizzes = async (token: string): Promise<Result> => {
    try {
        const response = await fetch(`${API_BASE_URL}/user/userdata/quiz`, {
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
    } catch (error) {
        console.error("Failed to fetch users with quizzes:", error);
        throw {
            message: "Failed to fetch users with quizzes",
            error: error instanceof Error ? error.message : "Network error",
            data: null,
        };
    }
};

export async function fetchAllUser(token: string): Promise<Result> {
    try {
        const response = await fetch(`${API_BASE_URL}/user/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        return response.json() as Promise<Result>;
    } catch (error) {
        console.error("Failed to create quiz:", error);
        throw error;
    }
}

export const fetchUserById = async (userId: string, token: string): Promise<Result> => {
    try {
        const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
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
    } catch (error) {
        console.error("Failed to fetch user:", error);
        throw {
            message: "Failed to fetch user data",
            error: error instanceof Error ? error.message : "Network error",
            data: null,
        };
    }
};

// Update user
export const updateUser = async (userId: string, updates: Partial<User>, token: string): Promise<Result> => {
    try {
        const response = await fetch(`${API_BASE_URL}/user/${userId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updates),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: Result = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to update user:", error);
        throw {
            message: "Failed to update user",
            error: error instanceof Error ? error.message : "Network error",
            data: null,
        };
    }
};

// Delete user
export const deleteUser = async (userId: string, token: string): Promise<Result> => {
    try {
        const response = await fetch(`${API_BASE_URL}/user/${userId}`, {
            method: 'DELETE',
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
    } catch (error) {
        console.error("Failed to delete user:", error);
        throw {
            message: "Failed to delete user",
            error: error instanceof Error ? error.message : "Network error",
            data: null,
        };
    }
};

// Fetch user details with recent quizzes
export const getUserDetailsWithQuizzes = async (userId: string, token: string): Promise<Result> => {
    try {
        const response = await fetch(`${API_BASE_URL}/user/userdata/quiz/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data: Result = await response.json()
        return data
    } catch (error) {
        console.error("Failed to fetch user details with quizzes:", error)
        throw {
            message: "Failed to fetch user details with quizzes",
            error: error instanceof Error ? error.message : "Network error",
            data: null,
        }
    }
}
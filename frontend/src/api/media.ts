import type { Result } from "@/types/response";

const API_BASE_URL = import.meta.env.VITE_APP_API_URL;

//upload a media file and return the URL
export async function uploadMedia(file: File, token: string): Promise<Result> {
	try {
		const formData = new FormData();
		formData.append("file", file);

		const response = await fetch(`${API_BASE_URL}/media/upload`, {
			method: "POST",
			headers: {
				"Authorization": `Bearer ${token}`,
			},
			body: formData,
		});

		if (!response.ok) {
			throw new Error("Failed to upload media");
		}

		return response.json() as Promise<Result>;
	}
	catch (error) {
		console.error("Error uploading media:", error);
		return {
			error: "Failed to upload media",
			message: "",
			data: null,
		};
	}
}

export async function deleteMedia(mediaId: string, token: string): Promise<Result> {
	try {
		const response = await fetch(`${API_BASE_URL}/media/delete/${mediaId}`, {
			method: "DELETE",
			headers: {
				"Authorization": `Bearer ${token}`,
			},
		});
		if (!response.ok) {
			throw new Error("Failed to delete media");
		}
		return response.json() as Promise<Result>;
	}
	catch (error) {
		console.error("Error deleting media:", error);
		return {
			error: "Failed to delete media",
			message: "",
			data: null,
		};
	}
}
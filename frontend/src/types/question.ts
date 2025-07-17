export interface QuestionData {
	questionText: string
	questionType: "multiple-choice" | "multiple-select" | "true-false" | "open-ended"
	options: { text: string; isCorrect: boolean }[]
	multimedia?: { type: "image" | "audio" | "video"; url: string }
}
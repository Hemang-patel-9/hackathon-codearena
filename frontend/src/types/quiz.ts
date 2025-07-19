import type { QuestionData } from "./question"

export interface QuizData {
	creator: string
	title: string
	description: string
	NoOfQuestion: number
	thumbnail: string
	duration: number
	participants: string[]
	passingCriteria: number
	tags: string[]
	timePerQuestion: number
	questionOrder: "random" | "fixed"
	visibility: "public" | "private" | "password-protected"
	password: string
	schedule: Date
	questions: QuestionData[]
}
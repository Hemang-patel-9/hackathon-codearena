"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { SingleChoiceQuestion } from "./single-choice-question"
import { MultipleChoiceQuestion } from "./multiple-choice-question"
import { OpenEndedQuestion } from "./open-ended-question"
import { AnswerFeedback } from "./answer-feedback"
import { MultimediaContent } from "./multimedia-content"

interface Question {
	_id: string
	questionText: string
	type: "single" | "multiple" | "open"
	options: Array<{
		text: string
		isCorrect: boolean
		_id: string
	}>
	multimedia?: {
		type: string
		url: string
	}
}

interface QuestionCardProps {
	question: Question
	selectedAnswers: string[]
	openAnswer: string
	showAnswer: boolean
	isAnswerCorrect: boolean
	autoAdvanceTime?: number
	onRadioChange: (value: string) => void
	onCheckboxChange: (optionId: string, checked: boolean) => void
	onOpenAnswerChange: (value: string) => void
	onSubmit: () => void
	onNext: () => void
	isLastQuestion: boolean
}

export function QuestionCard({
	question,
	selectedAnswers,
	openAnswer,
	showAnswer,
	isAnswerCorrect,
	autoAdvanceTime,
	onRadioChange,
	onCheckboxChange,
	onOpenAnswerChange,
	onSubmit,
	onNext,
	isLastQuestion,
}: QuestionCardProps) {
	const hasAnswer = question.type === "open" ? openAnswer.trim().length > 0 : selectedAnswers.length > 0

	const getQuestionTypeLabel = () => {
		switch (question.type) {
			case "single":
				return "Single Choice"
			case "multiple":
				return "Multiple Choice"
			case "open":
				return "Open Ended"
			default:
				return ""
		}
	}

	return (
		<motion.div
			initial={{ opacity: 0, x: 100 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: -100 }}
			transition={{ duration: 0.4, type: "spring" }}
			className="w-full max-w-4xl mx-auto"
		>
			<Card className="shadow-2xl border-0 overflow-hidden">
				<CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 text-white p-4 sm:p-6">
					<CardTitle className="text-lg sm:text-xl md:text-2xl leading-relaxed">{question.questionText}</CardTitle>
					<div className="flex gap-2 mt-3">
						<Badge variant="secondary" className="bg-white/20 text-white text-xs sm:text-sm">
							{getQuestionTypeLabel()}
						</Badge>
					</div>
				</CardHeader>

				<CardContent className="p-4 sm:p-6 md:p-8 space-y-6">
					{question.multimedia && question.multimedia.url && <MultimediaContent multimedia={question.multimedia} />}

					{question.type === "single" && (
						<SingleChoiceQuestion
							options={question.options}
							selectedAnswer={selectedAnswers[0] || ""}
							onAnswerChange={onRadioChange}
							showAnswer={showAnswer}
							disabled={showAnswer}
						/>
					)}

					{question.type === "multiple" && (
						<MultipleChoiceQuestion
							options={question.options}
							selectedAnswers={selectedAnswers}
							onAnswerChange={onCheckboxChange}
							showAnswer={showAnswer}
							disabled={showAnswer}
						/>
					)}

					{question.type === "open" && (
						<OpenEndedQuestion value={openAnswer} onChange={onOpenAnswerChange} disabled={showAnswer} />
					)}

					{showAnswer && (
						<AnswerFeedback
							isCorrect={isAnswerCorrect}
							isOpen={question.type === "open"}
							autoAdvanceTime={autoAdvanceTime}
						/>
					)}

					<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-6">
						<div className="text-sm text-gray-600 dark:text-gray-400">
							{!showAnswer && hasAnswer && (
								<span>
									{question.type === "open" ? `${openAnswer.length} characters` : `${selectedAnswers.length} selected`}
								</span>
							)}
						</div>

						<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
							<Button
								onClick={showAnswer ? onNext : onSubmit}
								disabled={!hasAnswer && !showAnswer}
								className="w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base font-semibold"
							>
								{showAnswer ? (isLastQuestion ? "View Results" : "Next Question") : "Submit Answer"}
							</Button>
						</motion.div>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	)
}

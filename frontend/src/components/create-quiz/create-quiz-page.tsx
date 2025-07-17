"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { QuizBasicInfo } from "./quiz-basic-info"
import { QuizSettings } from "./quiz-settings"
import { QuestionBuilder } from "./question-builder"
import { QuizPreview } from "./quiz-preview"
import { ProgressIndicator } from "./progress-indicator"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Save, Eye } from 'lucide-react'
import type { QuizData } from "@/types/quiz"
import { createQuiz } from "@/api/quiz"
import { useAuth } from "@/contexts/authContext"
import type { Result } from "@/types/response"
import { toast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom"
import { uploadMedia, deleteMedia } from "@/api/media";

//uploadMedia takes file:File and token:string and returns a Promise<Result>
//deleteMedia takes mediaId:string(file-name only) and token:string and returns a Promise<Result>

export function CreateQuizPage() {
	const { user, token } = useAuth();
	const initialQuizData: QuizData = {
		creator: user?._id as string,
		title: "",
		description: "",
		duration: 60,
		NoOfQuestion: 10,
		participants: [],
		thumbnail: "",
		tags: [],
		timePerQuestion: 30,
		passingCriteria: 70,
		questionOrder: "random",
		visibility: "public",
		password: "",
		schedule: new Date(),
		questions: [],
	}
	const [currentStep, setCurrentStep] = useState(0)
	const [showPreview, setShowPreview] = useState(false)
	const [quizData, setQuizData] = useState<QuizData>(initialQuizData)
	const navigate = useNavigate();


	const steps = [
		{ title: "Basic Info", component: QuizBasicInfo },
		{ title: "Settings", component: QuizSettings },
		{ title: "Questions", component: QuestionBuilder },
	]

	const updateQuizData = (updates: Partial<QuizData>) => {
		setQuizData((prev) => ({ ...prev, ...updates }))
	}

	const nextStep = () => {
		if (currentStep < steps.length - 1) {
			setCurrentStep(currentStep + 1)
		}
	}

	const prevStep = () => {
		if (currentStep > 0) {
			setCurrentStep(currentStep - 1)
		}
	}

	const handleSave = async () => {
		// Here you would typically send the data to your API
		if (!token || !user) {
			toast({
				title: "Authentication Error",
				description: "You need to be logged in to create a quiz.",
				variant: "destructive",
			});
			return
		}
		const result: Result = await createQuiz(quizData, token as string)

		if (result.error) {
			toast({
				title: "Error",
				description: result.error,
				variant: "destructive",
			});
			return
		}
		else {
			toast({
				title: "Success",
				description: "Quiz created successfully!",
				variant: "default",
			});
			// navigate("/dashboard");
		}
	}

	const CurrentStepComponent = steps[currentStep].component

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 transition-colors duration-500">
			{/* Header */}
			<motion.header
				initial={{ y: -100, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700"
			>
				<div className="container mx-auto px-4 py-4 flex items-center justify-between">
					<div className="flex items-center gap-4">
						<Button variant="ghost" size="sm" className="hover:scale-105 transition-transform duration-200">
							<ArrowLeft className="w-4 h-4 mr-2" />
							Back to Dashboard
						</Button>
						<h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
							Create New Quiz
						</h1>
					</div>
					<div className="flex items-center gap-4">
						<Button
							variant="outline"
							onClick={() => setShowPreview(true)}
							className="hover:scale-105 transition-transform duration-200"
						>
							<Eye className="w-4 h-4 mr-2" />
							Preview
						</Button>
						<Button
							onClick={handleSave}
							className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 hover:scale-105 transition-all duration-200"
						>
							<Save className="w-4 h-4 mr-2" />
							Save Quiz
						</Button>
					</div>
				</div>
			</motion.header>

			<div className="container mx-auto px-4 py-8">
				{/* Progress Indicator */}
				<ProgressIndicator currentStep={currentStep} steps={steps} />

				{/* Main Content */}
				<motion.div
					layout
					className="max-w-4xl mx-auto mt-8"
				>
					<AnimatePresence mode="wait">
						<motion.div
							key={currentStep}
							initial={{ x: 300, opacity: 0 }}
							animate={{ x: 0, opacity: 1 }}
							exit={{ x: -300, opacity: 0 }}
							transition={{ duration: 0.3, ease: "easeInOut" }}
						>
							<CurrentStepComponent quizData={quizData} updateQuizData={updateQuizData} />
						</motion.div>
					</AnimatePresence>

					{/* Navigation */}
					<motion.div
						initial={{ y: 50, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ delay: 0.2 }}
						className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-700"
					>
						<Button
							variant="outline"
							onClick={prevStep}
							disabled={currentStep === 0}
							className="hover:scale-105 transition-transform duration-200"
						>
							<ArrowLeft className="w-4 h-4 mr-2" />
							Previous
						</Button>

						<div className="text-sm text-gray-500 dark:text-gray-400">
							Step {currentStep + 1} of {steps.length}
						</div>

						<Button
							onClick={nextStep}
							disabled={currentStep === steps.length - 1 || !quizData.title.trim()}
							className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 hover:scale-105 transition-all duration-200"
						>
							Next
							<ArrowRight className="w-4 h-4 ml-2" />
						</Button>
					</motion.div>
				</motion.div>
			</div>

			{/* Preview Modal */}
			<AnimatePresence>
				{showPreview && (
					<QuizPreview quizData={quizData} onClose={() => setShowPreview(false)} />
				)}
			</AnimatePresence>
		</div>
	)
}

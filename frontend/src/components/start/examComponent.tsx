"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AlertTriangle, Camera } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ExamIntro } from "@/components/start/exam-intro"
import { ExamHeader } from "@/components/start/exam-header"
import { ProgressBar } from "@/components/start/progress-bar"
import { QuestionCard } from "@/components/start/question-card"
import { ExamResults } from "@/components/start/exam-results"
import { FullscreenWarning } from "@/components/start/fullscreen-warning"
import FaceDetectionComponent from "@/components/start/face-detection"
import { useAuth } from "@/contexts/authContext"
import { useSocket } from "@/hooks/use-socket"
import { useVideo } from "@/contexts/videoContext"

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

interface ExamState {
	currentQuestion: number
	selectedAnswers: string[]
	openAnswer: string
	timeLeft: number
	score: number
	isFullscreen: boolean
	examStarted: boolean
	examCompleted: boolean
	answers: Array<{
		questionId: string
		selectedOptions: string[]
		openAnswer?: string
		isCorrect: boolean
		timeTaken: number
		questionText: string
		questionType: string
	}>
	cheatingAttempts: number
	tabSwitches: number
	faceViolations: number
}

export default function ExamComponent({ examData }: { examData: { _id: string, title: string, description: string, questions: Question[], timePerQuestion: number, passingCriteria: number, thumbnail?: string, creator: { username: string } } }) {
	const [examState, setExamState] = useState<ExamState>({
		currentQuestion: 0,
		selectedAnswers: [],
		openAnswer: "",
		timeLeft: examData.timePerQuestion,
		score: 0,
		isFullscreen: false,
		examStarted: false,
		examCompleted: false,
		answers: [],
		cheatingAttempts: 0,
		tabSwitches: 0,
		faceViolations: 0,
	})
	const { videoRef } = useVideo();
	const [showAnswer, setShowAnswer] = useState(false)
	const [isAnswerCorrect, setIsAnswerCorrect] = useState(false)
	const [warningVisible, setWarningVisible] = useState(false)
	const [showFullscreenWarning, setShowFullscreenWarning] = useState(false)
	const [autoAdvanceTime, setAutoAdvanceTime] = useState<number | undefined>(undefined)
	const [webcamPermission, setWebcamPermission] = useState<"granted" | "denied" | "prompt" | null>(null)
	const { user } = useAuth()
	const socket = useSocket()
	const timerRef = useRef<NodeJS.Timeout | null>(null)
	const autoAdvanceRef = useRef<NodeJS.Timeout | null>(null)
	const questionStartTime = useRef<number>(Date.now())
	const examContainerRef = useRef<HTMLDivElement>(null)
	const currentQuestion = examData.questions[examState.currentQuestion]

	// Check webcam permission on mount
	// useEffect(() => {
	// 	const checkWebcamPermission = async () => {
	// 		try {
	// 			const permissionStatus = await navigator.permissions.query({ name: "camera" as PermissionName })
	// 			setWebcamPermission(permissionStatus.state)
	// 			permissionStatus.onchange = () => {
	// 				setWebcamPermission(permissionStatus.state)
	// 			}
	// 		} catch (error) {
	// 			console.error("Error checking webcam permission:", error)
	// 			setWebcamPermission("denied")
	// 		}
	// 	}
	// 	checkWebcamPermission()
	// }, [])

	// Handle face violation detection
	const handleFaceViolation = useCallback(() => {
		setExamState((prev) => ({
			...prev,
			faceViolations: prev.faceViolations + 1,
			cheatingAttempts: prev.cheatingAttempts + 1,
		}))

		if (socket) {
			socket.emit("student:face-violation", {
				quizId: examData._id,
				userId: user?._id,
				violationType: "face_not_detected",
				timestamp: new Date().toISOString(),
				totalViolations: examState.faceViolations + 1,
				avatar: user?.avatar,
			})
		}

		setWarningVisible(true)
		setTimeout(() => setWarningVisible(false), 3000)
	}, [socket, examData._id, user?._id, user?.avatar, examState.faceViolations])

	// Fullscreen detection
	useEffect(() => {
		const handleFullscreenChange = () => {
			const isCurrentlyFullscreen = !!document.fullscreenElement
			setExamState((prev) => ({ ...prev, isFullscreen: isCurrentlyFullscreen }))

			if (examState.examCompleted && videoRef.current?.srcObject) {
				(videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
			}

		}

		document.addEventListener("fullscreenchange", handleFullscreenChange)
		return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
	}, [examState.examStarted, examState.examCompleted])

	// Anti-cheating measures
	useEffect(() => {
		const handleVisibilityChange = () => {
			if (document.hidden && examState.examStarted && !examState.examCompleted) {
				setExamState((prev) => ({
					...prev,
					tabSwitches: prev.tabSwitches + 1,
					cheatingAttempts: prev.cheatingAttempts + 1,
				}))

				if (socket) {
					socket.emit("student:tab-switch", {
						quizId: examData._id,
						userId: user?._id,
						violationType: "tab_switch",
						timestamp: new Date().toISOString(),
						totalViolations: examState.cheatingAttempts + 1,
						avatar: user?.avatar,
					})
				}

				setWarningVisible(true)
				setTimeout(() => setWarningVisible(false), 3000)
			}
		}

		const handleContextMenu = (e: MouseEvent) => {
			if (examState.examStarted && !examState.examCompleted) {
				e.preventDefault()
				setExamState((prev) => ({
					...prev,
					cheatingAttempts: prev.cheatingAttempts + 1,
				}))

				if (socket) {
					socket.emit("student:right-click-violation", {
						quizId: examData._id,
						userId: user?._id,
						violationType: "right_click",
						timestamp: new Date().toISOString(),
						totalViolations: examState.cheatingAttempts + 1,
						avatar: user?.avatar,
					})
				}
			}
		}

		const handleKeyDown = (e: KeyboardEvent) => {
			if (examState.examStarted && !examState.examCompleted) {
				if (
					e.key === "F12" ||
					(e.ctrlKey && e.shiftKey && e.key === "I") ||
					(e.ctrlKey && e.key === "u") ||
					(e.ctrlKey && e.shiftKey && e.key === "C") ||
					(e.ctrlKey && e.key === "c") ||
					(e.ctrlKey && e.key === "v") ||
					(e.ctrlKey && e.key === "x")
				) {
					e.preventDefault()
					setExamState((prev) => ({
						...prev,
						cheatingAttempts: prev.cheatingAttempts + 1,
					}))

					if (socket) {
						socket.emit("student:keyboard-violation", {
							quizId: examData._id,
							userId: user?._id,
							violationType: "suspicious_keypress",
							key: e.key,
							timestamp: new Date().toISOString(),
							totalViolations: examState.cheatingAttempts + 1,
							avatar: user?.avatar,
						})
					}
				}
			}
		}

		const handleCopy = (e: ClipboardEvent) => {
			if (examState.examStarted && !examState.examCompleted) {
				e.preventDefault()
				setExamState((prev) => ({
					...prev,
					cheatingAttempts: prev.cheatingAttempts + 1,
				}))

				if (socket) {
					socket.emit("student:copy-violation", {
						quizId: examData._id,
						userId: user?._id,
						violationType: "copy_attempt",
						timestamp: new Date().toISOString(),
						totalViolations: examState.cheatingAttempts + 1,
						avatar: user?.avatar,
					})
				}
			}
		}

		const handlePaste = (e: ClipboardEvent) => {
			if (examState.examStarted && !examState.examCompleted) {
				e.preventDefault()
				setExamState((prev) => ({
					...prev,
					cheatingAttempts: prev.cheatingAttempts + 1,
				}))

				if (socket) {
					socket.emit("student:paste-violation", {
						quizId: examData._id,
						userId: user?._id,
						violationType: "paste_attempt",
						timestamp: new Date().toISOString(),
						totalViolations: examState.cheatingAttempts + 1,
						avatar: user?.avatar,
					})
				}
			}
		}

		document.addEventListener("visibilitychange", handleVisibilityChange)
		document.addEventListener("contextmenu", handleContextMenu)
		document.addEventListener("keydown", handleKeyDown)
		document.addEventListener("copy", handleCopy)
		document.addEventListener("paste", handlePaste)

		return () => {
			document.removeEventListener("visibilitychange", handleVisibilityChange)
			document.removeEventListener("contextmenu", handleContextMenu)
			document.removeEventListener("keydown", handleKeyDown)
			document.removeEventListener("copy", handleCopy)
			document.removeEventListener("paste", handlePaste)
		}
	}, [examState.examStarted, examState.examCompleted, examState.cheatingAttempts, socket, examData._id, user?._id, user?.avatar])

	// Timer functionality
	useEffect(() => {
		if (examState.examStarted && !examState.examCompleted && examState.timeLeft > 0 && examState.isFullscreen) {
			timerRef.current = setTimeout(() => {
				setExamState((prev) => ({ ...prev, timeLeft: prev.timeLeft - 1 }))
			}, 1000)
		} else if (examState.timeLeft === 0 && examState.examStarted) {
			handleNextQuestion()
		}

		return () => {
			if (timerRef.current) clearTimeout(timerRef.current)
		}
	}, [examState.timeLeft, examState.examStarted, examState.examCompleted, examState.isFullscreen])

	// Auto advance countdown
	useEffect(() => {
		if (autoAdvanceTime && autoAdvanceTime > 0) {
			const countdown = setTimeout(() => {
				setAutoAdvanceTime(autoAdvanceTime - 1)
			}, 1000)
			return () => clearTimeout(countdown)
		} else if (autoAdvanceTime === 0) {
			handleNextQuestion()
		}
	}, [autoAdvanceTime])

	// const requestWebcamPermission = async () => {
	// 	try {
	// 		console.log("exam started, req webcam");

	// 		const stream = await navigator.mediaDevices.getUserMedia({ video: true })
	// 		if (videoRef.current) {
	// 			videoRef.current.srcObject = stream
	// 			console.log('Webcam stream assigned')
	// 			setWebcamPermission("granted")
	// 		}
	// 		return true
	// 	} catch (error: any) {
	// 		console.error("Webcam permission denied or error:", error)
	// 		if (error.name === 'NotAllowedError') {
	// 			setWebcamPermission("denied")
	// 			setWarningVisible(true)
	// 			setTimeout(() => setWarningVisible(false), 5000)
	// 		} else {
	// 			setWebcamPermission("denied")
	// 		}
	// 		return false
	// 	}
	// }

	const enterFullscreen = async () => {
		try {
			if (examContainerRef.current) {
				await examContainerRef.current.requestFullscreen()
			}
		} catch (error) {
			console.error("Failed to enter fullscreen:", error)
		}
	}

	const startExam = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ video: true });
			if (videoRef.current) {
				videoRef.current.srcObject = stream;
			}
		} catch (error) {
			console.error("Webcam permission denied:", error);
			setWarningVisible(true);
			return;
		}

		await new Promise(resolve => setTimeout(resolve, 500));
		await enterFullscreen();

		setExamState((prev) => ({
			...prev,
			examStarted: true,
			timeLeft: examData.timePerQuestion,
		}));

		questionStartTime.current = Date.now();

		if (socket) {
			socket.emit("student:exam-started", {
				quizId: examData._id,
				userId: user?._id,
				timestamp: new Date().toISOString(),
				avatar: user?.avatar,
			});
		}
	};


	const handleRadioChange = (value: string) => {
		if (showAnswer) return
		setExamState((prev) => ({ ...prev, selectedAnswers: [value] }))
	}

	const handleCheckboxChange = (optionId: string, checked: boolean) => {
		if (showAnswer) return
		setExamState((prev) => {
			const newAnswers = checked
				? [...prev.selectedAnswers, optionId]
				: prev.selectedAnswers.filter((id) => id !== optionId)
			return { ...prev, selectedAnswers: newAnswers }
		})
	}

	const handleOpenAnswerChange = (value: string) => {
		if (showAnswer) return
		setExamState((prev) => ({ ...prev, openAnswer: value }))
	}

	const calculateScore = (isCorrect: boolean, timeTaken: number, questionType: string) => {
		let points = 0
		if (questionType === "open") {
			points = 50
		} else if (isCorrect) {
			points = 100
			const timeBonus = Math.max(0, (examData.timePerQuestion - timeTaken) * 2)
			points += timeBonus
		}
		return points
	}

	const checkAnswer = async () => {
		let isCorrect = false

		if (currentQuestion.type === "open") {
			const response = await fetch("http://localhost:5678/webhook-test/score", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					question: currentQuestion,
					answer: examState.openAnswer.trim()
				}),
			})

			const result = await response.json()
			isCorrect = result[0].output >= 7
		} else {
			const correctOptions = currentQuestion.options.filter((opt) => opt.isCorrect).map((opt) => opt._id)
			const selectedOptions = examState.selectedAnswers

			if (currentQuestion.type === "multiple") {
				isCorrect =
					correctOptions.length === selectedOptions.length && correctOptions.every((id) => selectedOptions.includes(id))
			} else {
				isCorrect = selectedOptions.length === 1 && correctOptions.includes(selectedOptions[0])
			}
		}

		const timeTaken = Math.floor((Date.now() - questionStartTime.current) / 1000)
		const questionScore = calculateScore(isCorrect, timeTaken, currentQuestion.type)

		if (socket) {
			socket.emit("student:submit-answer", {
				quizId: examData._id,
				userId: user?._id,
				isCorrect: isCorrect,
				score: questionScore,
				violations: examState.cheatingAttempts,
				faceViolations: examState.faceViolations,
				avatar: user?.avatar,
			})
		}

		setIsAnswerCorrect(isCorrect)
		setShowAnswer(true)
		setAutoAdvanceTime(2)

		setExamState((prev) => ({
			...prev,
			score: prev.score + questionScore,
			answers: [
				...prev.answers,
				{
					questionId: currentQuestion._id,
					selectedOptions: prev.selectedAnswers,
					openAnswer: prev.openAnswer,
					isCorrect,
					timeTaken,
					questionText: currentQuestion.questionText,
					questionType: currentQuestion.type,
				},
			],
		}))
	}

	const handleNextQuestion = useCallback(() => {
		if (autoAdvanceRef.current) {
			clearTimeout(autoAdvanceRef.current)
		}
		setAutoAdvanceTime(undefined)

		const hasAnswer =
			currentQuestion.type === "open" ? examState.openAnswer.trim().length > 0 : examState.selectedAnswers.length > 0

		if (!showAnswer && hasAnswer) {
			checkAnswer()
			return
		}

		if (examState.currentQuestion < examData.questions.length - 1) {
			setExamState((prev) => ({
				...prev,
				currentQuestion: prev.currentQuestion + 1,
				selectedAnswers: [],
				openAnswer: "",
				timeLeft: examData.timePerQuestion,
			}))
			setShowAnswer(false)
			questionStartTime.current = Date.now()
		} else {
			setExamState((prev) => ({ ...prev, examCompleted: true }))

			if (socket) {
				socket.emit("student:exam-completed", {
					quizId: examData._id,
					userId: user?._id,
					finalScore: examState.score,
					totalViolations: examState.cheatingAttempts,
					faceViolations: examState.faceViolations,
					timestamp: new Date().toISOString(),
					avatar: user?.avatar,
				})
			}

			if (document.exitFullscreen) {
				document.exitFullscreen()
			}
		}
	}, [
		showAnswer,
		examState.selectedAnswers.length,
		examState.openAnswer,
		examState.currentQuestion,
		currentQuestion.type,
		examState.score,
		examState.cheatingAttempts,
		examState.faceViolations,
		socket,
		examData._id,
		user?._id,
		user?.avatar,
	])

	if (showFullscreenWarning && examState.examStarted && !examState.examCompleted) {
		return <FullscreenWarning />
	}

	if (!examState.examStarted) {
		return (
			<div ref={examContainerRef}>
				<AnimatePresence>
					{warningVisible && (
						<motion.div
							initial={{ opacity: 0, y: -50 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -50 }}
							className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
						>
							<Alert className="bg-red-100 dark:bg-red-900/20 border-red-300 dark:border-red-800 shadow-lg">
								<Camera className="h-4 w-4 text-red-600 dark:text-red-400" />
								<AlertDescription className="text-red-800 dark:text-red-200 font-medium">
									Webcam access is required to start the exam. Please grant camera permission and try again.
								</AlertDescription>
							</Alert>
						</motion.div>
					)}
				</AnimatePresence>
				<ExamIntro
					title={examData.title}
					description={examData.description}
					totalQuestions={examData.questions.length}
					timePerQuestion={examData.timePerQuestion}
					thumbnail={examData.thumbnail}
					creator={examData.creator}
					onStartExam={startExam}
				/>
			</div>
		)
	}

	if (examState.examCompleted) {
		return (
			<ExamResults
				score={examState.score}
				answers={examState.answers}
				questions={examData.questions}
				cheatingAttempts={examState.cheatingAttempts}
				faceViolations={examState.faceViolations}
				passingCriteria={examData.passingCriteria}
			/>
		)
	}

	return (
		<div
			ref={examContainerRef}
			className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900"
		>
			<FaceDetectionComponent
				onViolationDetected={handleFaceViolation}
				examStarted={examState.examStarted}
				examCompleted={examState.examCompleted}
				isFullscreen={examState.isFullscreen}
			/>

			<AnimatePresence>
				{warningVisible && (
					<motion.div
						initial={{ opacity: 0, y: -50 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -50 }}
						className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
					>
						<Alert className="bg-red-100 dark:bg-red-900/20 border-red-300 dark:border-red-800 shadow-lg">
							<AlertTriangle className="h-4 w-4" />
							<AlertDescription className="text-red-800 dark:text-red-200 font-medium">
								Suspicious activity detected! This has been recorded.
							</AlertDescription>
						</Alert>
					</motion.div>
				)}
			</AnimatePresence>

			<div className="p-4 sm:p-6">
				<ExamHeader
					currentQuestion={examState.currentQuestion}
					totalQuestions={examData.questions.length}
					score={examState.score}
					timeLeft={examState.timeLeft}
					totalTime={examData.timePerQuestion}
					cheatingAttempts={examState.cheatingAttempts}
					faceViolations={examState.faceViolations}
				/>

				<div className="mb-6 sm:mb-8">
					<ProgressBar current={examState.currentQuestion} total={examData.questions.length} />
				</div>

				<QuestionCard
					question={currentQuestion}
					selectedAnswers={examState.selectedAnswers}
					openAnswer={examState.openAnswer}
					showAnswer={showAnswer}
					isAnswerCorrect={isAnswerCorrect}
					autoAdvanceTime={autoAdvanceTime}
					onRadioChange={handleRadioChange}
					onCheckboxChange={handleCheckboxChange}
					onOpenAnswerChange={handleOpenAnswerChange}
					onSubmit={checkAnswer}
					onNext={handleNextQuestion}
					isLastQuestion={examState.currentQuestion === examData.questions.length - 1}
				/>
			</div>
		</div>
	)
}
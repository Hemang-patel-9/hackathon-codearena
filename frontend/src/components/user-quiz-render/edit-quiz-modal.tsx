"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { XCircle, PlusCircle, Trash2, Edit3 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../dashboard/dashboard-tabs"
import type { QuizData } from "@/types/quiz"
import { createQuestion, updateQuestion, deleteQuestion, fetchQuestionById } from "@/api/question"
import type { QuestionData } from "@/types/question"
import { useAuth } from "@/contexts/authContext"
import mongoose from "mongoose"

interface EditQuizModalProps {
    quiz: QuizData | null
    isOpen: boolean
    onClose: () => void
    onUpdate: (quizId: string, updates: Partial<QuizData>) => void
}

const EditQuizModal = ({ quiz, isOpen, onClose, onUpdate }: EditQuizModalProps) => {
    const { user, token } = useAuth()
    const [activeTab, setActiveTab] = useState("quiz")
    const [formData, setFormData] = useState({
        creator: user._id,
        title: "",
        description: "",
        questions: [] as string[],
        NoOfQuestion: 0,
        timePerQuestion: 0,
        passingCriteria: 0,
        questionOrder: "fixed" as "fixed" | "random",
        visibility: "public" as "public" | "private" | "password-protected",
        password: "",
        status: "draft" as "draft" | "active" | "completed" | "upcoming",
        duration: 0,
        participants: [] as string[],
        thumbnail: "",
        tags: [] as string[],
        schedule: "",
    })
    const [formErrors, setFormErrors] = useState({
        creator: "",
        title: "",
        visibility: "",
        password: "",
        timePerQuestion: "",
        passingCriteria: "",
        duration: "",
        schedule: "",
    })
    const [questionsData, setQuestionsData] = useState<QuestionData[]>([])
    const [questionForm, setQuestionForm] = useState({
        questionText: "",
        questionType: "multiple-choice" as "multiple-choice" | "multiple-select" | "true-false" | "open-ended",
        options: [
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
        ],
        multimedia: { type: "image" as "image" | "audio" | "video", url: "" },
    })
    const [questionErrors, setQuestionErrors] = useState({
        questionText: "",
        options: "",
        correctAnswer: "",
        multimedia: "",
    })
    const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null)

    // Sync formData with quiz prop
    useEffect(() => {
        if (quiz) {
            setFormData({
                creator: user._id,
                title: quiz.title || "",
                description: quiz.description || "",
                questions: quiz.questions || [],
                NoOfQuestion: quiz.questions?.length || 0,
                timePerQuestion: quiz.timePerQuestion || 0,
                passingCriteria: quiz.passingCriteria || 0,
                questionOrder: quiz.questionOrder || "fixed",
                visibility: quiz.visibility || "public",
                password: quiz.password || "",
                status: quiz.status || "draft",
                duration: quiz.duration || 0,
                participants: quiz.participants || [],
                thumbnail: quiz.thumbnail || "",
                tags: quiz.tags || [],
                schedule: quiz.schedule ? new Date(quiz.schedule).toISOString().slice(0, 16) : "",
            })
            setFormErrors({
                creator: "",
                title: "",
                visibility: "",
                password: "",
                timePerQuestion: "",
                passingCriteria: "",
                duration: "",
                schedule: "",
            })
            fetchQuestions(quiz.questions)
        }
    }, [quiz])

    // Fetch questions data
    const fetchQuestions = async (questionIds: string[]) => {
        try {
            const questions = await Promise.all(
                questionIds.map(async (id) => {
                    const response = await fetchQuestionById(id)
                    return !response.error ? response.data : null
                }),
            )
            setQuestionsData(questions.filter((q) => q))
        } catch (error) {
            console.error("Failed to fetch questions:", error)
        }
    }

    const validateQuizForm = () => {
        let isValid = true
        const errors = {
            creator: "",
            title: "",
            visibility: "",
            password: "",
            timePerQuestion: "",
            passingCriteria: "",
            duration: "",
            schedule: "",
        }

        if (!formData.title.trim()) {
            errors.title = "Title is required"
            isValid = false
        }

        if (!["public", "private", "password-protected"].includes(formData.visibility)) {
            errors.visibility = "Invalid visibility selected"
            isValid = false
        }

        if (formData.visibility === "password-protected" && !formData.password.trim()) {
            errors.password = "Password is required for password-protected quizzes"
            isValid = false
        }

        if (formData.timePerQuestion <= 0) {
            errors.timePerQuestion = "Time per question must be greater than 0"
            isValid = false
        }

        if (formData.passingCriteria < 0 || formData.passingCriteria > 100) {
            errors.passingCriteria = "Passing criteria must be between 0 and 100"
            isValid = false
        }

        if (formData.duration <= 0) {
            errors.duration = "Duration must be greater than 0"
            isValid = false
        }

        if (!formData.schedule) {
            errors.schedule = "Schedule date is required"
            isValid = false
        }

        setFormErrors(errors)
        return isValid
    }

    const validateQuestionForm = () => {
        let isValid = true
        const errors = { questionText: "", options: "", correctAnswer: "", multimedia: "" }

        if (!questionForm.questionText.trim()) {
            errors.questionText = "Question text is required"
            isValid = false
        }

        if (questionForm.questionType !== "open-ended") {
            if (questionForm.options.length < 2 || questionForm.options.some((opt) => !opt.text.trim())) {
                errors.options = "At least two non-empty options are required"
                isValid = false
            }

            if (
                questionForm.questionType === "multiple-choice" &&
                questionForm.options.filter((opt) => opt.isCorrect).length !== 1
            ) {
                errors.correctAnswer = "Exactly one option must be correct"
                isValid = false
            } else if (
                questionForm.questionType === "multiple-select" &&
                questionForm.options.filter((opt) => opt.isCorrect).length < 1
            ) {
                errors.correctAnswer = "At least one option must be correct"
                isValid = false
            } else if (
                questionForm.questionType === "true-false" &&
                (questionForm.options.length !== 2 || questionForm.options.filter((opt) => opt.isCorrect).length !== 1)
            ) {
                errors.options = "True/False questions must have exactly two options with one correct"
                isValid = false
            }
        }

        if (questionForm.multimedia.url && !["image", "audio", "video"].includes(questionForm.multimedia.type)) {
            errors.multimedia = "Invalid multimedia type"
            isValid = false
        }

        setQuestionErrors(errors)
        return isValid
    }

    const handleQuizSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validateQuizForm()) return

        const updates: Partial<QuizData> = {
            creator: formData.creator,
            title: formData.title,
            description: formData.description,
            questions: formData.questions,
            NoOfQuestion: formData.questions.length,
            timePerQuestion: formData.timePerQuestion,
            passingCriteria: formData.passingCriteria,
            questionOrder: formData.questionOrder,
            visibility: formData.visibility,
            password: formData.visibility === "password-protected" ? formData.password : undefined,
            status: formData.status,
            duration: formData.duration,
            participants: formData.participants,
            thumbnail: formData.thumbnail || undefined,
            tags: formData.tags,
            schedule: formData.schedule,
        }

        try {
            await onUpdate(quiz!._id, updates)
            onClose()
        } catch (error) {
            console.error("Failed to update quiz:", error)
        }
    }

    const handleQuestionSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validateQuestionForm()) return

        try {
            if (editingQuestionId) {
                const response = await updateQuestion(editingQuestionId, {
                    questionText: questionForm.questionText,
                    questionType: questionForm.questionType,
                    options: questionForm.questionType === "open-ended" ? [] : questionForm.options,
                    multimedia: questionForm.multimedia.url ? questionForm.multimedia : undefined,
                })
                if (!response.error) {
                    setQuestionsData(questionsData.map((q) => (q._id === editingQuestionId ? response.data : q)))
                }
            } else {
                const response = await createQuestion({
                    questionText: questionForm.questionText,
                    questionType: questionForm.questionType,
                    options: questionForm.questionType === "open-ended" ? [] : questionForm.options,
                    multimedia: questionForm.multimedia.url ? questionForm.multimedia : undefined,
                })
                if (!response.error) {
                    setFormData({
                        ...formData,
                        questions: [...formData.questions, response.data._id],
                        NoOfQuestion: formData.questions.length + 1,
                    })
                    setQuestionsData([...questionsData, response.data])
                }
            }

            setQuestionForm({
                questionText: "",
                questionType: "multiple-choice",
                options: [
                    { text: "", isCorrect: false },
                    { text: "", isCorrect: false },
                    { text: "", isCorrect: false },
                    { text: "", isCorrect: false },
                ],
                multimedia: { type: "image", url: "" },
            })
            setEditingQuestionId(null)
            setQuestionErrors({ questionText: "", options: "", correctAnswer: "", multimedia: "" })
        } catch (error) {
            console.error("Failed to save question:", error)
        }
    }

    const handleEditQuestion = (question: QuestionData) => {
        setQuestionForm({
            questionText: question.questionText,
            questionType: question.questionType,
            options: question.options.length
                ? question.options
                : [
                    { text: "", isCorrect: false },
                    { text: "", isCorrect: false },
                ],
            multimedia: question.multimedia || { type: "image", url: "" },
        })
        setEditingQuestionId(question._id)
    }

    const handleDeleteQuestion = async (questionId: string) => {
        try {
            const response = await deleteQuestion(questionId)
            if (!response.error) {
                setFormData({
                    ...formData,
                    questions: formData.questions.filter((id) => id !== questionId),
                    NoOfQuestion: formData.questions.length - 1,
                })
                setQuestionsData(questionsData.filter((q) => q._id !== questionId))
            }
        } catch (error) {
            console.error("Failed to delete question:", error)
        }
    }

    const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const tags = e.target.value
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag !== "")
        setFormData({ ...formData, tags })
    }

    const handleParticipantsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const participants = e.target.value
            .split(",")
            .map((id) => id.trim())
            .filter((id) => id !== "" && mongoose.Types.ObjectId.isValid(id))
        setFormData({ ...formData, participants })
    }

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.8, y: 50 },
        visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", damping: 25, stiffness: 300 } },
        exit: { opacity: 0, scale: 0.8, y: 50, transition: { duration: 0.2 } },
    }

    const tabVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    }

    return (
        <AnimatePresence>
            {isOpen && quiz && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/50 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={(e) => e.stopPropagation()}
                        className="bg-card rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl border border-border"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Edit Quiz
                            </h2>
                            <motion.button
                                whileHover={{ scale: 1.1, rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={onClose}
                                className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-full transition-colors"
                            >
                                <XCircle size={24} />
                            </motion.button>
                        </div>

                        <Tabs defaultValue="quiz" className="w-full" onValueChange={setActiveTab}>
                            <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted border border-border rounded-xl p-1">
                                <TabsTrigger
                                    value="quiz"
                                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/10 data-[state=active]:to-purple-500/10 data-[state=active]:text-blue-700 data-[state=active]:border data-[state=active]:border-blue-200 transition-all duration-300 rounded-lg"
                                >
                                    Quiz Details
                                </TabsTrigger>
                                <TabsTrigger
                                    value="questions"
                                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/10 data-[state=active]:to-blue-500/10 data-[state=active]:text-purple-700 data-[state=active]:border data-[state=active]:border-purple-200 transition-all duration-300 rounded-lg"
                                >
                                    Questions ({questionsData.length})
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="quiz">
                                <motion.form
                                    variants={tabVariants}
                                    initial="hidden"
                                    animate="visible"
                                    onSubmit={handleQuizSubmit}
                                    className="space-y-6"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Creator */}
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-2">Creator ID</label>
                                            <motion.input
                                                whileFocus={{ scale: 1.02 }}
                                                type="text"
                                                value={formData.creator}
                                                onChange={(e) => setFormData({ ...formData, creator: e.target.value })}
                                                className={`w-full px-4 py-3 bg-input border ${formErrors.creator ? "border-destructive" : "border-border"
                                                    } rounded-xl focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200 text-foreground placeholder:text-muted-foreground`}
                                                placeholder="Creator ObjectId"
                                                required
                                            />
                                            {formErrors.creator && <p className="text-destructive text-xs mt-1">{formErrors.creator}</p>}
                                        </div>

                                        {/* Title */}
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-2">Title</label>
                                            <motion.input
                                                whileFocus={{ scale: 1.02 }}
                                                type="text"
                                                value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                className={`w-full px-4 py-3 bg-input border ${formErrors.title ? "border-destructive" : "border-border"
                                                    } rounded-xl focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200 text-foreground placeholder:text-muted-foreground`}
                                                placeholder="Quiz title"
                                                required
                                            />
                                            {formErrors.title && <p className="text-destructive text-xs mt-1">{formErrors.title}</p>}
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                                        <motion.textarea
                                            whileFocus={{ scale: 1.02 }}
                                            rows={4}
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full px-4 py-3 bg-input border border-border rounded-xl focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200 text-foreground placeholder:text-muted-foreground resize-none"
                                            placeholder="Quiz description"
                                            maxLength={500}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {/* Time Per Question */}
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-2">
                                                Time Per Question (seconds)
                                            </label>
                                            <motion.input
                                                whileFocus={{ scale: 1.02 }}
                                                type="number"
                                                value={formData.timePerQuestion}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, timePerQuestion: Number.parseInt(e.target.value) || 0 })
                                                }
                                                className={`w-full px-4 py-3 bg-input border ${formErrors.timePerQuestion ? "border-destructive" : "border-border"
                                                    } rounded-xl focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200 text-foreground placeholder:text-muted-foreground`}
                                                placeholder="30"
                                                min="1"
                                                required
                                            />
                                            {formErrors.timePerQuestion && (
                                                <p className="text-destructive text-xs mt-1">{formErrors.timePerQuestion}</p>
                                            )}
                                        </div>

                                        {/* Passing Criteria */}
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-2">Passing Criteria (%)</label>
                                            <motion.input
                                                whileFocus={{ scale: 1.02 }}
                                                type="number"
                                                value={formData.passingCriteria}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, passingCriteria: Number.parseInt(e.target.value) || 0 })
                                                }
                                                className={`w-full px-4 py-3 bg-input border ${formErrors.passingCriteria ? "border-destructive" : "border-border"
                                                    } rounded-xl focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200 text-foreground placeholder:text-muted-foreground`}
                                                placeholder="70"
                                                min="0"
                                                max="100"
                                                required
                                            />
                                            {formErrors.passingCriteria && (
                                                <p className="text-destructive text-xs mt-1">{formErrors.passingCriteria}</p>
                                            )}
                                        </div>

                                        {/* Duration */}
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-2">Duration (minutes)</label>
                                            <motion.input
                                                whileFocus={{ scale: 1.02 }}
                                                type="number"
                                                value={formData.duration}
                                                onChange={(e) => setFormData({ ...formData, duration: Number.parseInt(e.target.value) || 0 })}
                                                className={`w-full px-4 py-3 bg-input border ${formErrors.duration ? "border-destructive" : "border-border"
                                                    } rounded-xl focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200 text-foreground placeholder:text-muted-foreground`}
                                                placeholder="60"
                                                min="1"
                                                required
                                            />
                                            {formErrors.duration && <p className="text-destructive text-xs mt-1">{formErrors.duration}</p>}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Question Order */}
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-2">Question Order</label>
                                            <motion.select
                                                whileFocus={{ scale: 1.02 }}
                                                value={formData.questionOrder}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, questionOrder: e.target.value as "fixed" | "random" })
                                                }
                                                className="w-full px-4 py-3 bg-input border border-border rounded-xl focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200 text-foreground"
                                            >
                                                <option value="fixed">Fixed</option>
                                                <option value="random">Random</option>
                                            </motion.select>
                                        </div>

                                        {/* Visibility */}
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-2">Visibility</label>
                                            <motion.select
                                                whileFocus={{ scale: 1.02 }}
                                                value={formData.visibility}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        visibility: e.target.value as "public" | "private" | "password-protected",
                                                    })
                                                }
                                                className={`w-full px-4 py-3 bg-input border ${formErrors.visibility ? "border-destructive" : "border-border"
                                                    } rounded-xl focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200 text-foreground`}
                                            >
                                                <option value="public">Public</option>
                                                <option value="private">Private</option>
                                                <option value="password-protected">Password-Protected</option>
                                            </motion.select>
                                            {formErrors.visibility && (
                                                <p className="text-destructive text-xs mt-1">{formErrors.visibility}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Password */}
                                    {formData.visibility === "password-protected" && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                        >
                                            <label className="block text-sm font-medium text-foreground mb-2">Password</label>
                                            <motion.input
                                                whileFocus={{ scale: 1.02 }}
                                                type="text"
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                className={`w-full px-4 py-3 bg-input border ${formErrors.password ? "border-destructive" : "border-border"
                                                    } rounded-xl focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200 text-foreground placeholder:text-muted-foreground`}
                                                placeholder="Enter quiz password"
                                            />
                                            {formErrors.password && <p className="text-destructive text-xs mt-1">{formErrors.password}</p>}
                                        </motion.div>
                                    )}

                                    {/* Status */}
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">Status</label>
                                        <motion.select
                                            whileFocus={{ scale: 1.02 }}
                                            value={formData.status}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    status: e.target.value as "draft" | "active" | "completed" | "upcoming",
                                                })
                                            }
                                            className="w-full px-4 py-3 bg-input border border-border rounded-xl focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200 text-foreground"
                                        >
                                            <option value="draft">Draft</option>
                                            <option value="active">Active</option>
                                            <option value="completed">Completed</option>
                                            <option value="upcoming">Upcoming</option>
                                        </motion.select>
                                    </div>

                                    {/* Participants */}
                                    {formData.visibility === "private" && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                        >
                                            <label className="block text-sm font-medium text-foreground mb-2">
                                                Participants (comma-separated user IDs)
                                            </label>
                                            <motion.input
                                                whileFocus={{ scale: 1.02 }}
                                                type="text"
                                                value={formData.participants.join(", ")}
                                                onChange={handleParticipantsChange}
                                                className="w-full px-4 py-3 bg-input border border-border rounded-xl focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200 text-foreground placeholder:text-muted-foreground"
                                                placeholder="User ID 1, User ID 2"
                                            />
                                        </motion.div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Thumbnail */}
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-2">Thumbnail URL</label>
                                            <motion.input
                                                whileFocus={{ scale: 1.02 }}
                                                type="url"
                                                value={formData.thumbnail}
                                                onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                                                className="w-full px-4 py-3 bg-input border border-border rounded-xl focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200 text-foreground placeholder:text-muted-foreground"
                                                placeholder="https://example.com/thumbnail.jpg"
                                            />
                                        </div>

                                        {/* Tags */}
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-2">Tags (comma-separated)</label>
                                            <motion.input
                                                whileFocus={{ scale: 1.02 }}
                                                type="text"
                                                value={formData.tags.join(", ")}
                                                onChange={handleTagsChange}
                                                className="w-full px-4 py-3 bg-input border border-border rounded-xl focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200 text-foreground placeholder:text-muted-foreground"
                                                placeholder="math, science, trivia"
                                            />
                                        </div>
                                    </div>

                                    {/* Schedule */}
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">Schedule</label>
                                        <motion.input
                                            whileFocus={{ scale: 1.02 }}
                                            type="datetime-local"
                                            value={formData.schedule}
                                            onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                                            className={`w-full px-4 py-3 bg-input border ${formErrors.schedule ? "border-destructive" : "border-border"
                                                } rounded-xl focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200 text-foreground`}
                                            required
                                        />
                                        {formErrors.schedule && <p className="text-destructive text-xs mt-1">{formErrors.schedule}</p>}
                                    </div>

                                    <div className="flex justify-end space-x-4 pt-6 border-t border-border">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            type="button"
                                            onClick={onClose}
                                            className="px-6 py-3 text-muted-foreground border-2 border-border rounded-xl transition-colors font-medium hover:bg-accent hover:text-foreground"
                                        >
                                            Cancel
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            type="submit"
                                            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                                        >
                                            Update Quiz
                                        </motion.button>
                                    </div>
                                </motion.form>
                            </TabsContent>

                            <TabsContent value="questions">
                                <motion.div variants={tabVariants} initial="hidden" animate="visible" className="space-y-6">
                                    {/* Question Form */}
                                    <div className="p-6 bg-muted/50 rounded-xl border border-border">
                                        <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                                            {editingQuestionId ? (
                                                <>
                                                    <Edit3 className="w-5 h-5 text-purple-600" />
                                                    Edit Question
                                                </>
                                            ) : (
                                                <>
                                                    <PlusCircle className="w-5 h-5 text-blue-600" />
                                                    Add New Question
                                                </>
                                            )}
                                        </h3>

                                        <form onSubmit={handleQuestionSubmit} className="space-y-4">
                                            {/* Question Text */}
                                            <div>
                                                <label className="block text-sm font-medium text-foreground mb-2">Question Text</label>
                                                <motion.input
                                                    whileFocus={{ scale: 1.02 }}
                                                    type="text"
                                                    value={questionForm.questionText}
                                                    onChange={(e) => setQuestionForm({ ...questionForm, questionText: e.target.value })}
                                                    className={`w-full px-4 py-3 bg-input border ${questionErrors.questionText ? "border-destructive" : "border-border"
                                                        } rounded-xl focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200 text-foreground placeholder:text-muted-foreground`}
                                                    placeholder="Enter question text"
                                                    required
                                                />
                                                {questionErrors.questionText && (
                                                    <p className="text-destructive text-xs mt-1">{questionErrors.questionText}</p>
                                                )}
                                            </div>

                                            {/* Question Type */}
                                            <div>
                                                <label className="block text-sm font-medium text-foreground mb-2">Question Type</label>
                                                <motion.select
                                                    whileFocus={{ scale: 1.02 }}
                                                    value={questionForm.questionType}
                                                    onChange={(e) => {
                                                        const newType = e.target.value as QuestionData["questionType"]
                                                        const newOptions =
                                                            newType === "true-false"
                                                                ? [
                                                                    { text: "True", isCorrect: false },
                                                                    { text: "False", isCorrect: false },
                                                                ]
                                                                : questionForm.options
                                                        setQuestionForm({ ...questionForm, questionType: newType, options: newOptions })
                                                    }}
                                                    className="w-full px-4 py-3 bg-input border border-border rounded-xl focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200 text-foreground"
                                                >
                                                    <option value="multiple-choice">Multiple Choice</option>
                                                    <option value="multiple-select">Multiple Select</option>
                                                    <option value="true-false">True/False</option>
                                                    <option value="open-ended">Open-Ended</option>
                                                </motion.select>
                                            </div>

                                            {/* Options */}
                                            {questionForm.questionType !== "open-ended" && (
                                                <div>
                                                    <label className="block text-sm font-medium text-foreground mb-2">Options</label>
                                                    <div className="space-y-3">
                                                        {questionForm.options.map((option, index) => (
                                                            <motion.div
                                                                key={index}
                                                                initial={{ opacity: 0, y: 10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg"
                                                            >
                                                                <span className="text-sm font-medium text-muted-foreground min-w-[20px]">
                                                                    {index + 1}.
                                                                </span>
                                                                <motion.input
                                                                    whileFocus={{ scale: 1.02 }}
                                                                    type="text"
                                                                    value={option.text}
                                                                    onChange={(e) => {
                                                                        const newOptions = [...questionForm.options]
                                                                        newOptions[index] = { ...newOptions[index], text: e.target.value }
                                                                        setQuestionForm({ ...questionForm, options: newOptions })
                                                                    }}
                                                                    className={`flex-1 px-3 py-2 bg-input border ${questionErrors.options ? "border-destructive" : "border-border"
                                                                        } rounded-lg focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200 text-foreground placeholder:text-muted-foreground`}
                                                                    placeholder={`Option ${index + 1}`}
                                                                    disabled={questionForm.questionType === "true-false"}
                                                                />
                                                                {(questionForm.questionType === "multiple-choice" ||
                                                                    questionForm.questionType === "multiple-select" ||
                                                                    questionForm.questionType === "true-false") && (
                                                                        <div className="flex items-center">
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={option.isCorrect}
                                                                                onChange={(e) => {
                                                                                    const newOptions = [...questionForm.options]
                                                                                    newOptions[index] = { ...newOptions[index], isCorrect: e.target.checked }
                                                                                    if (
                                                                                        questionForm.questionType === "multiple-choice" ||
                                                                                        questionForm.questionType === "true-false"
                                                                                    ) {
                                                                                        newOptions.forEach((opt, i) => {
                                                                                            if (i !== index) opt.isCorrect = false
                                                                                        })
                                                                                    }
                                                                                    setQuestionForm({ ...questionForm, options: newOptions })
                                                                                }}
                                                                                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-border rounded"
                                                                            />
                                                                            <label className="ml-2 text-xs text-muted-foreground">Correct</label>
                                                                        </div>
                                                                    )}
                                                                {questionForm.options.length > 2 && questionForm.questionType !== "true-false" && (
                                                                    <motion.button
                                                                        whileHover={{ scale: 1.1 }}
                                                                        whileTap={{ scale: 0.9 }}
                                                                        type="button"
                                                                        onClick={() => {
                                                                            const newOptions = questionForm.options.filter((_, i) => i !== index)
                                                                            setQuestionForm({ ...questionForm, options: newOptions })
                                                                        }}
                                                                        className="p-2 text-destructive hover:bg-destructive/10 rounded-full transition-colors"
                                                                    >
                                                                        <Trash2 size={16} />
                                                                    </motion.button>
                                                                )}
                                                            </motion.div>
                                                        ))}
                                                    </div>
                                                    {questionErrors.options && (
                                                        <p className="text-destructive text-xs mt-1">{questionErrors.options}</p>
                                                    )}
                                                    {questionErrors.correctAnswer && (
                                                        <p className="text-destructive text-xs mt-1">{questionErrors.correctAnswer}</p>
                                                    )}
                                                    {questionForm.questionType !== "true-false" && (
                                                        <motion.button
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            type="button"
                                                            onClick={() =>
                                                                setQuestionForm({
                                                                    ...questionForm,
                                                                    options: [...questionForm.options, { text: "", isCorrect: false }],
                                                                })
                                                            }
                                                            className="mt-3 flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
                                                        >
                                                            <PlusCircle size={16} />
                                                            Add Option
                                                        </motion.button>
                                                    )}
                                                </div>
                                            )}

                                            {/* Multimedia */}
                                            <div>
                                                <label className="block text-sm font-medium text-foreground mb-2">Multimedia (Optional)</label>
                                                <div className="flex gap-4">
                                                    <motion.select
                                                        whileFocus={{ scale: 1.02 }}
                                                        value={questionForm.multimedia.type}
                                                        onChange={(e) =>
                                                            setQuestionForm({
                                                                ...questionForm,
                                                                multimedia: {
                                                                    ...questionForm.multimedia,
                                                                    type: e.target.value as "image" | "audio" | "video",
                                                                },
                                                            })
                                                        }
                                                        className="w-1/3 px-4 py-3 bg-input border border-border rounded-xl focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200 text-foreground"
                                                    >
                                                        <option value="image">Image</option>
                                                        <option value="audio">Audio</option>
                                                        <option value="video">Video</option>
                                                    </motion.select>
                                                    <motion.input
                                                        whileFocus={{ scale: 1.02 }}
                                                        type="url"
                                                        value={questionForm.multimedia.url}
                                                        onChange={(e) =>
                                                            setQuestionForm({
                                                                ...questionForm,
                                                                multimedia: { ...questionForm.multimedia, url: e.target.value },
                                                            })
                                                        }
                                                        className={`w-2/3 px-4 py-3 bg-input border ${questionErrors.multimedia ? "border-destructive" : "border-border"
                                                            } rounded-xl focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200 text-foreground placeholder:text-muted-foreground`}
                                                        placeholder="https://example.com/media"
                                                    />
                                                </div>
                                                {questionErrors.multimedia && (
                                                    <p className="text-destructive text-xs mt-1">{questionErrors.multimedia}</p>
                                                )}
                                            </div>

                                            <div className="flex justify-end space-x-4 pt-4 border-t border-border">
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    type="button"
                                                    onClick={() => {
                                                        setQuestionForm({
                                                            questionText: "",
                                                            questionType: "multiple-choice",
                                                            options: [
                                                                { text: "", isCorrect: false },
                                                                { text: "", isCorrect: false },
                                                                { text: "", isCorrect: false },
                                                                { text: "", isCorrect: false },
                                                            ],
                                                            multimedia: { type: "image", url: "" },
                                                        })
                                                        setEditingQuestionId(null)
                                                        setQuestionErrors({ questionText: "", options: "", correctAnswer: "", multimedia: "" })
                                                    }}
                                                    className="px-4 py-2 text-muted-foreground border-2 border-border rounded-xl transition-colors font-medium hover:bg-accent hover:text-foreground"
                                                >
                                                    Clear
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    type="submit"
                                                    className="px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                                                >
                                                    {editingQuestionId ? "Update Question" : "Add Question"}
                                                </motion.button>
                                            </div>
                                        </form>
                                    </div>

                                    {/* Questions List */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-foreground">Questions ({questionsData.length})</h3>
                                        {questionsData.length > 0 ? (
                                            <div className="grid gap-4">
                                                {questionsData.map((question, index) => (
                                                    <motion.div
                                                        key={question._id}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: index * 0.1 }}
                                                        className="p-4 bg-card border border-border rounded-xl hover:shadow-md transition-shadow"
                                                    >
                                                        <div className="flex justify-between items-start">
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">
                                                                        Q{index + 1}
                                                                    </span>
                                                                    <span className="text-xs font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                                                                        {question.questionType.replace("-", " ")}
                                                                    </span>
                                                                </div>
                                                                <p className="text-sm font-medium text-foreground mb-2">{question.questionText}</p>
                                                                {question.options.length > 0 && (
                                                                    <div className="text-xs text-muted-foreground">
                                                                        {question.options.length} options •{" "}
                                                                        {question.options.filter((opt) => opt.isCorrect).length} correct
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="flex gap-2 ml-4">
                                                                <motion.button
                                                                    whileHover={{ scale: 1.05 }}
                                                                    whileTap={{ scale: 0.95 }}
                                                                    onClick={() => handleEditQuestion(question)}
                                                                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
                                                                >
                                                                    <Edit3 size={16} />
                                                                </motion.button>
                                                                <motion.button
                                                                    whileHover={{ scale: 1.05 }}
                                                                    whileTap={{ scale: 0.95 }}
                                                                    onClick={() => handleDeleteQuestion(question._id)}
                                                                    className="p-2 text-destructive hover:bg-destructive/10 rounded-full transition-colors"
                                                                >
                                                                    <Trash2 size={16} />
                                                                </motion.button>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-12">
                                                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                                                    <PlusCircle className="w-8 h-8 text-muted-foreground" />
                                                </div>
                                                <p className="text-muted-foreground">No questions added yet.</p>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    Add your first question using the form above.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            </TabsContent>
                        </Tabs>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default EditQuizModal

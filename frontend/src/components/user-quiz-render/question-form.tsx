"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { PlusCircle, Trash2 } from "lucide-react"
import type { QuestionData } from "@/types/question"
import { createQuestion, updateQuestion, deleteQuestion, fetchQuestionById } from "@/api/question"

interface QuestionFormProps {
    quizId: string
    questions: string[]
    setFormData: React.Dispatch<React.SetStateAction<{
        questions: string[]
        NoOfQuestion: number
        [key: string]: any
    }>>
    token: string | null
    setMessage: React.Dispatch<React.SetStateAction<{ type: 'success' | 'error', text: string } | null>>
}

const QuestionForm = ({ questions, setFormData, token, setMessage }: QuestionFormProps) => {
    const [questionsData, setQuestionsData] = useState<QuestionData[]>([])
    const [questionForm, setQuestionForm] = useState({
        questionText: "",
        questionType: "multiple-choice" as "multiple-choice" | "multiple-select" | "true-false" | "open-ended",
        options: [{ text: "", isCorrect: false }, { text: "", isCorrect: false }, { text: "", isCorrect: false }, { text: "", isCorrect: false }],
        multimedia: { type: "image" as "image" | "audio" | "video", url: "" },
    })
    const [questionErrors, setQuestionErrors] = useState({
        questionText: "",
        options: "",
        correctAnswer: "",
        multimedia: "",
    })
    const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null)

    useEffect(() => {
        fetchQuestions(questions)
    }, [questions])

    const fetchQuestions = async (questionIds: string[]) => {
        try {
            const questions = await Promise.all(
                questionIds.map(async id => {
                    const response = await fetchQuestionById(id)
                    return !response.error ? response.data : null
                })
            )
            setQuestionsData(questions.filter(q => q) as QuestionData[])
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to fetch questions' })
        }
    }

    const validateQuestionForm = () => {
        let isValid = true
        const errors = { questionText: "", options: "", correctAnswer: "", multimedia: "" }

        if (!questionForm.questionText.trim()) {
            errors.questionText = "Question text required"
            isValid = false
        }
        if (questionForm.questionType !== "open-ended") {
            if (questionForm.options.length < 2 || questionForm.options.some(opt => !opt.text.trim())) {
                errors.options = "At least two non-empty options required"
                isValid = false
            }
            if (questionForm.questionType === "multiple-choice" && questionForm.options.filter(opt => opt.isCorrect).length !== 1) {
                errors.correctAnswer = "Exactly one correct option required"
                isValid = false
            } else if (questionForm.questionType === "multiple-select" && questionForm.options.filter(opt => opt.isCorrect).length < 1) {
                errors.correctAnswer = "At least one correct option required"
                isValid = false
            } else if (questionForm.questionType === "true-false" && questionForm.options.filter(opt => opt.isCorrect).length !== 1) {
                errors.correctAnswer = "Exactly one correct option required"
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

    const handleQuestionSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validateQuestionForm()) return

        try {
            if (!token) {
                setMessage({ type: 'error', text: 'Authentication token missing' })
                return
            }
            if (editingQuestionId) {
                const response = await updateQuestion(editingQuestionId, {
                    questionText: questionForm.questionText,
                    questionType: questionForm.questionType,
                    options: questionForm.questionType === "open-ended" ? [] : questionForm.options,
                    multimedia: questionForm.multimedia.url ? questionForm.multimedia : undefined,
                })
                if (!response.error && response.data) {
                    setQuestionsData(questionsData.map(q => q._id === editingQuestionId ? response.data : q))
                    setMessage({ type: 'success', text: 'Question updated' })
                } else {
                    setMessage({ type: 'error', text: response.message || 'Failed to update question' })
                }
            } else {
                const response = await createQuestion({
                    questionText: questionForm.questionText,
                    questionType: questionForm.questionType,
                    options: questionForm.questionType === "open-ended" ? [] : questionForm.options,
                    multimedia: questionForm.multimedia.url ? questionForm.multimedia : undefined,
                },)
                if (!response.error && response.data) {
                    setFormData(prev => ({
                        ...prev,
                        questions: [...prev.questions, response.data._id],
                        NoOfQuestion: prev.questions.length + 1,
                    }))
                    setQuestionsData([...questionsData, response.data])
                    setMessage({ type: 'success', text: 'Question added' })
                } else {
                    setMessage({ type: 'error', text: response.message || 'Failed to add question' })
                }
            }
            setQuestionForm({
                questionText: "",
                questionType: "multiple-choice",
                options: [{ text: "", isCorrect: false }, { text: "", isCorrect: false }, { text: "", isCorrect: false }, { text: "", isCorrect: false }],
                multimedia: { type: "image", url: "" },
            })
            setEditingQuestionId(null)
            setQuestionErrors({ questionText: "", options: "", correctAnswer: "", multimedia: "" })
            setTimeout(() => setMessage(null), 3000)
        } catch (error) {
            setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Network error' })
        }
    }

    const handleEditQuestion = (question: QuestionData) => {
        setQuestionForm({
            questionText: question.questionText,
            questionType: question.questionType,
            options: question.options.length ? question.options : [
                { text: "True", isCorrect: false },
                { text: "False", isCorrect: false }
            ],
            multimedia: question.multimedia || { type: "image", url: "" },
        })
        setEditingQuestionId(question?._id as string)
        setMessage(null)
    }

    const handleDeleteQuestion = async (questionId: string) => {
        try {
            if (!token) {
                setMessage({ type: 'error', text: 'Authentication token missing' })
                return
            }
            const response = await deleteQuestion(questionId);
            if (!response.error) {
                setFormData(prev => ({
                    ...prev,
                    questions: prev.questions.filter(id => id !== questionId),
                    NoOfQuestion: prev.questions.length - 1,
                }))
                setQuestionsData(questionsData.filter(q => q._id !== questionId))
                setMessage({ type: 'success', text: 'Question deleted' })
                setTimeout(() => setMessage(null), 3000)
            } else {
                setMessage({ type: 'error', text: response.message || 'Failed to delete question' })
            }
        } catch (error) {
            setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Network error' })
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4 sm:space-y-6"
        >
            <form onSubmit={handleQuestionSubmit} className="space-y-4 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                    {editingQuestionId ? "Edit Question" : "Add Question"}
                </h3>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Question Text</label>
                    <motion.input
                        whileFocus={{ scale: 1.02 }}
                        type="text"
                        value={questionForm.questionText}
                        onChange={e => setQuestionForm({ ...questionForm, questionText: e.target.value })}
                        className={`w-full px-4 py-2 sm:py-3 bg-white dark:bg-gray-900 border ${questionErrors.questionText ? "border-red-500" : "border-gray-300 dark:border-gray-600"} rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 dark:text-white text-sm sm:text-base`}
                        placeholder="Enter question text"
                        required
                    />
                    {questionErrors.questionText && <p className="text-red-500 text-xs mt-1">{questionErrors.questionText}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Question Type</label>
                    <motion.select
                        whileFocus={{ scale: 1.02 }}
                        value={questionForm.questionType}
                        onChange={e => {
                            const newType = e.target.value as QuestionData['questionType']
                            const newOptions = newType === "true-false"
                                ? [{ text: "True", isCorrect: false }, { text: "False", isCorrect: false }]
                                : questionForm.options
                            setQuestionForm({ ...questionForm, questionType: newType, options: newOptions })
                        }}
                        className="w-full px-4 py-2 sm:py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 dark:text-white text-sm sm:text-base"
                    >
                        <option value="multiple-choice">Multiple Choice</option>
                        <option value="multiple-select">Multiple Select</option>
                        <option value="true-false">True/False</option>
                        <option value="open-ended">Open-Ended</option>
                    </motion.select>
                </div>
                {questionForm.questionType !== "open-ended" && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Options</label>
                        {questionForm.options.map((option, index) => (
                            <div key={index} className="flex items-center gap-2 mt-2 flex-col sm:flex-row">
                                <motion.input
                                    whileFocus={{ scale: 1.02 }}
                                    type="text"
                                    value={option.text}
                                    onChange={e => {
                                        const newOptions = [...questionForm.options]
                                        newOptions[index] = { ...newOptions[index], text: e.target.value }
                                        setQuestionForm({ ...questionForm, options: newOptions })
                                    }}
                                    className={`flex-1 px-4 py-2 bg-white dark:bg-gray-900 border ${questionErrors.options ? "border-red-500" : "border-gray-300 dark:border-gray-600"} rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 dark:text-white text-sm sm:text-base`}
                                    placeholder={`Option ${index + 1}`}
                                    disabled={questionForm.questionType === "true-false"}
                                />
                                <input
                                    type="checkbox"
                                    checked={option.isCorrect}
                                    onChange={e => {
                                        const newOptions = [...questionForm.options]
                                        newOptions[index] = { ...newOptions[index], isCorrect: e.target.checked }
                                        if (questionForm.questionType === "multiple-choice" || questionForm.questionType === "true-false") {
                                            newOptions.forEach((opt, i) => { if (i !== index) opt.isCorrect = false })
                                        }
                                        setQuestionForm({ ...questionForm, options: newOptions })
                                    }}
                                    className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                                />
                                {questionForm.options.length > 2 && questionForm.questionType !== "true-false" && (
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        type="button"
                                        onClick={() => setQuestionForm({ ...questionForm, options: questionForm.options.filter((_, i) => i !== index) })}
                                        className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-full"
                                    >
                                        <Trash2 size={16} />
                                    </motion.button>
                                )}
                            </div>
                        ))}
                        {questionErrors.options && <p className="text-red-500 text-xs mt-1">{questionErrors.options}</p>}
                        {questionErrors.correctAnswer && <p className="text-red-500 text-xs mt-1">{questionErrors.correctAnswer}</p>}
                        {questionForm.questionType !== "true-false" && (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="button"
                                onClick={() => setQuestionForm({ ...questionForm, options: [...questionForm.options, { text: "", isCorrect: false }] })}
                                className="mt-2 flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
                            >
                                <PlusCircle size={16} /> Add Option
                            </motion.button>
                        )}
                    </div>
                )}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Multimedia</label>
                    <div className="flex gap-2 sm:gap-4 flex-col sm:flex-row">
                        <motion.select
                            whileFocus={{ scale: 1.02 }}
                            value={questionForm.multimedia.type}
                            onChange={e => setQuestionForm({ ...questionForm, multimedia: { ...questionForm.multimedia, type: e.target.value as "image" | "audio" | "video" } })}
                            className="w-full sm:w-1/3 px-4 py-2 sm:py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 dark:text-white text-sm sm:text-base"
                        >
                            <option value="image">Image</option>
                            <option value="audio">Audio</option>
                            <option value="video">Video</option>
                        </motion.select>
                        <motion.input
                            whileFocus={{ scale: 1.02 }}
                            type="url"
                            value={questionForm.multimedia.url}
                            onChange={e => setQuestionForm({ ...questionForm, multimedia: { ...questionForm.multimedia, url: e.target.value } })}
                            className={`w-full sm:w-2/3 px-4 py-2 sm:py-3 bg-white dark:bg-gray-900 border ${questionErrors.multimedia ? "border-red-500" : "border-gray-300 dark:border-gray-600"} rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 dark:text-white text-sm sm:text-base`}
                            placeholder="https://example.com/media"
                        />
                    </div>
                    {questionErrors.multimedia && <p className="text-red-500 text-xs mt-1">{questionErrors.multimedia}</p>}
                </div>
                <div className="flex justify-end space-x-3 sm:space-x-4">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={() => {
                            setQuestionForm({
                                questionText: "",
                                questionType: "multiple-choice",
                                options: [{ text: "", isCorrect: false }, { text: "", isCorrect: false }, { text: "", isCorrect: false }, { text: "", isCorrect: false }],
                                multimedia: { type: "image", url: "" },
                            })
                            setEditingQuestionId(null)
                            setQuestionErrors({ questionText: "", options: "", correctAnswer: "", multimedia: "" })
                            setMessage(null)
                        }}
                        className="px-4 py-2 text-gray-600 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-sm sm:text-base"
                    >
                        Clear
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:from-purple-600 hover:to-blue-600 text-sm sm:text-base"
                    >
                        {editingQuestionId ? "Update Question" : "Add Question"}
                    </motion.button>
                </div>
            </form>
            <div className="space-y-4">
                {questionsData.length > 0 ? (
                    questionsData.map((question, index) => (
                        <motion.div
                            key={question._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-3 sm:p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl"
                        >
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{question.questionText}</p>
                                    <p className="text-xs text-gray-600 dark:text-gray-300">{question.questionType}</p>
                                </div>
                                <div className="flex gap-2">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleEditQuestion(question)}
                                        className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-full"
                                    >
                                        <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 20.036H3.5v-3.5L16.732 3.232z" />
                                        </svg>
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleDeleteQuestion(question?._id as string)}
                                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-full"
                                    >
                                        <Trash2 size={16} />
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <p className="text-center text-gray-600 dark:text-gray-300 text-sm sm:text-base">No questions added yet.</p>
                )}
            </div>
        </motion.div>
    )
}

export default QuestionForm
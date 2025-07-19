"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Trash2, Copy, Plus, X, CheckSquare, Square, ToggleLeft, FileText, ImageIcon, Video, Music, ChevronDown, ChevronUp, Upload, Loader2 } from "lucide-react"
import { deleteMedia, uploadMedia } from "@/api/media"
import type { QuestionData } from "@/types/question"
import { toast } from "@/hooks/use-toast"

interface QuestionCardProps {
	question: QuestionData
	index: number
	onUpdate: (updates: Partial<QuestionData>) => void
	onDelete: () => void
	onDuplicate: () => void
	token: string
}

export function QuestionCard({ question, index, onUpdate, onDelete, onDuplicate, token }: QuestionCardProps) {
	const [showMediaUpload, setShowMediaUpload] = useState(false)
	const [isExpanded, setIsExpanded] = useState(true)
	const [isUploading, setIsUploading] = useState(false)
	const [isDeleting, setIsDeleting] = useState(false)
	const [uploadError, setUploadError] = useState<string | null>(null)

	const getQuestionTypeInfo = (type: QuestionData["questionType"]) => {
		switch (type) {
			case "multiple-choice":
				return { icon: CheckSquare, label: "Multiple Choice", color: "bg-blue-500" }
			case "multiple-select":
				return { icon: Square, label: "Multiple Select", color: "bg-green-500" }
			case "true-false":
				return { icon: ToggleLeft, label: "True/False", color: "bg-purple-500" }
			case "open-ended":
				return { icon: FileText, label: "Open Ended", color: "bg-orange-500" }
		}
	}

	const typeInfo = getQuestionTypeInfo(question.questionType)

	const addOption = () => {
		const newOptions = [...question.options, { text: "", isCorrect: false }]
		onUpdate({ options: newOptions })
	}

	const updateOption = (optionIndex: number, updates: Partial<{ text: string; isCorrect: boolean }>) => {
		const newOptions = question.options.map((option, index) =>
			index === optionIndex ? { ...option, ...updates } : option,
		)
		onUpdate({ options: newOptions })
	}

	const removeOption = (optionIndex: number) => {
		const newOptions = question.options.filter((_, index) => index !== optionIndex)
		onUpdate({ options: newOptions })
	}

	const handleCorrectAnswerChange = (optionIndex: number, isCorrect: boolean) => {
		if (question.questionType === "multiple-choice") {
			// For multiple choice, only one answer can be correct
			const newOptions = question.options.map((option, index) => ({
				...option,
				isCorrect: index === optionIndex ? isCorrect : false,
			}))
			onUpdate({ options: newOptions })
		} else {
			// For multiple select, multiple answers can be correct
			updateOption(optionIndex, { isCorrect })
		}
	}

	const handleFileUpload = async (file: File, mediaType: "image" | "video" | "audio") => {
		setIsUploading(true)
		setUploadError(null)

		try {
			const result = await uploadMedia(file, token)

			if (result.error) {
				setUploadError(result.error)
				return
			}

			// Assuming the API returns the media URL in result.data.url
			// Adjust this based on your actual API response structure
			const mediaUrl = result.data as { filename: string; url: string }

			onUpdate({
				multimedia: {
					type: mediaType,
					url: mediaUrl.filename,
				}
			})

			setShowMediaUpload(false)
		} catch (error) {
			console.error("Upload failed:", error)
			setUploadError("Failed to upload media. Please try again.")
		} finally {
			setIsUploading(false)
		}
	}

	const handleMediaDelete = async () => {

		setIsDeleting(true)
		if (!token) {
			toast({
				title: "Authentication Error",
				description: "You need to be logged in to delete files.",
				variant: "destructive",
			});
			return;
		}
		if (!question.multimedia?.url) {
			console.warn("No multimedia URL to delete");
			setIsDeleting(false);
			return;
		}
		const cleanedThumbnailId = question.multimedia.url.replace(/^media[\\/]/, "");
		try {
			const result = await deleteMedia(cleanedThumbnailId, token)

			if (result.error) {
				console.error("Delete failed:", result.error)
				return
			}

			// Clear the multimedia from question data
			onUpdate({ multimedia: undefined })
		} catch (error) {
			console.error("Delete failed:", error)
		} finally {
			setIsDeleting(false)
		}
	}

	const handleFileSelect = (mediaType: "image" | "video" | "audio") => {
		const input = document.createElement("input")
		input.type = "file"

		// Set file type restrictions based on media type
		switch (mediaType) {
			case "image":
				input.accept = "image/*"
				break
			case "video":
				input.accept = "video/*"
				break
			case "audio":
				input.accept = "audio/*"
				break
		}

		input.onchange = (e) => {
			const file = (e.target as HTMLInputElement).files?.[0]
			if (file) {
				handleFileUpload(file, mediaType)
			}
		}

		input.click()
	}

	const handleUrlUpload = (url: string) => {
		if (!question.multimedia) return

		onUpdate({
			multimedia: {
				...question.multimedia,
				url: url
			}
		})
	}

	return (
		<motion.div
			layout
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			whileHover={{ scale: 1.01 }}
			transition={{ duration: 0.2 }}
		>
			<Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-white/20 dark:border-gray-700/50 hover:shadow-lg transition-shadow duration-200">
				<CardHeader className="pb-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<motion.div
								className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold text-sm"
								whileHover={{ scale: 1.1 }}
							>
								{index + 1}
							</motion.div>
							<Badge variant="secondary" className={`${typeInfo.color} text-white`}>
								<typeInfo.icon className="w-3 h-3 mr-1" />
								{typeInfo.label}
							</Badge>
							{/* Question preview when collapsed */}
							{!isExpanded && (
								<div className="flex-1 ml-2">
									<p className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-md">
										{question.questionText || "Empty question..."}
									</p>
								</div>
							)}
						</div>
						<div className="flex items-center gap-2">
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setIsExpanded(!isExpanded)}
								className="hover:scale-110 transition-transform duration-200"
							>
								{isExpanded ? (
									<ChevronUp className="w-4 h-4" />
								) : (
									<ChevronDown className="w-4 h-4" />
								)}
							</Button>
							<Button
								variant="ghost"
								size="sm"
								onClick={onDuplicate}
								className="hover:scale-110 transition-transform duration-200"
							>
								<Copy className="w-4 h-4" />
							</Button>
							<Button
								variant="ghost"
								size="sm"
								onClick={onDelete}
								className="hover:scale-110 transition-transform duration-200 text-red-500 hover:text-red-600"
							>
								<Trash2 className="w-4 h-4" />
							</Button>
						</div>
					</div>
				</CardHeader>

				<AnimatePresence>
					{isExpanded && (
						<motion.div
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: "auto" }}
							exit={{ opacity: 0, height: 0 }}
							transition={{ duration: 0.2 }}
						>
							<CardContent className="space-y-4">
								{/* Question Text */}
								<div>
									<Textarea
										value={question.questionText}
										onChange={(e) => onUpdate({ questionText: e.target.value })}
										placeholder="Enter your question here..."
										className="bg-white/50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 focus:ring-purple-500 focus:border-purple-500 min-h-[80px]"
									/>
								</div>

								{/* Media Upload */}
								<div className="flex items-center gap-2">
									<Button
										variant="outline"
										size="sm"
										onClick={() => setShowMediaUpload(!showMediaUpload)}
										className="hover:scale-105 transition-transform duration-200"
										disabled={isUploading}
									>
										{isUploading ? (
											<Loader2 className="w-4 h-4 mr-2 animate-spin" />
										) : (
											<ImageIcon className="w-4 h-4 mr-2" />
										)}
										{isUploading ? "Uploading..." : "Add Media"}
									</Button>
									{question.multimedia && (
										<div className="flex items-center gap-2">
											<Badge
												variant="secondary"
												className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
											>
												{question.multimedia.type} attached
											</Badge>
											<Button
												variant="ghost"
												size="sm"
												onClick={handleMediaDelete}
												disabled={isDeleting}
												className="text-red-500 hover:text-red-600 hover:scale-110 transition-all duration-200"
											>
												{isDeleting ? (
													<Loader2 className="w-4 h-4 animate-spin" />
												) : (
													<Trash2 className="w-4 h-4" />
												)}
											</Button>
										</div>
									)}
								</div>

								{/* Upload Error */}
								{uploadError && (
									<div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
										<p className="text-sm text-red-700 dark:text-red-300">{uploadError}</p>
									</div>
								)}

								<AnimatePresence>
									{showMediaUpload && (
										<motion.div
											initial={{ opacity: 0, height: 0 }}
											animate={{ opacity: 1, height: "auto" }}
											exit={{ opacity: 0, height: 0 }}
											className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 space-y-3"
										>
											<div className="space-y-3">

												<div className="flex gap-2">
													{[
														{ type: "image", icon: ImageIcon, label: "Image" },
														{ type: "video", icon: Video, label: "Video" },
														{ type: "audio", icon: Music, label: "Audio" },
													].map((media) => (
														<Button
															key={`url-${media.type}`}
															variant="outline"
															size="sm"
															onClick={() => onUpdate({ multimedia: { type: media.type as any, url: "" } })}
															className="hover:scale-105 transition-transform duration-200"
														>
															<media.icon className="w-4 h-4 mr-2" />
															{media.label} URL
														</Button>
													))}
												</div>

												{/* <div className="text-center text-sm text-gray-500 dark:text-gray-400">
													or
												</div> */}

												<div className="flex gap-2">
													{question.multimedia?.type && [
														{ type: "image", icon: ImageIcon, label: "Image" },
														{ type: "video", icon: Video, label: "Video" },
														{ type: "audio", icon: Music, label: "Audio" },
													]
														.filter(
															media =>
																!question.multimedia?.type ||
																question.multimedia.type === media.type
														)
														.map(media => (
															<Button
																key={media.type}
																variant="outline"
																size="sm"
																onClick={() =>
																	handleFileSelect(media.type as "image" | "video" | "audio")
																}
																disabled={isUploading}
																className="hover:scale-105 transition-transform duration-200"
															>
																<Upload className="w-4 h-4 mr-2" />
																Upload {media.label}
															</Button>
														))}
												</div>
											</div>

											{question.multimedia && (
												<Input
													placeholder="Enter media URL..."
													value={question.multimedia.url}
													onChange={(e) => handleUrlUpload(e.target.value)}
													className="bg-white/50 dark:bg-gray-700/50"
												/>
											)}
										</motion.div>
									)}
								</AnimatePresence>

								{/* Media Preview */}
								{question.multimedia && question.multimedia.url && (
									<motion.div
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										className="border border-gray-200 dark:border-gray-600 rounded-lg p-4"
									>
										<div className="flex items-center justify-between mb-2">
											<h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">Media Preview</h5>
											<Badge variant="outline">{question.multimedia.type}</Badge>
										</div>
										{question.multimedia.type === "image" && (
											<img
												src={question.multimedia.url}
												alt="Question media"
												className="max-w-full h-auto max-h-48 object-contain rounded"
												onError={(e) => {
													e.currentTarget.style.display = "none"
												}}
											/>
										)}
										{question.multimedia.type === "video" && (
											<video
												src={question.multimedia.url}
												controls
												className="max-w-full h-auto max-h-48 rounded"
											/>
										)}
										{question.multimedia.type === "audio" && (
											<audio
												src={question.multimedia.url}
												controls
												className="w-full"
											/>
										)}
									</motion.div>
								)}

								{/* Options */}
								{question.questionType !== "open-ended" && (
									<div className="space-y-3">
										<div className="flex items-center justify-between">
											<h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Answer Options</h4>
											{question.questionType !== "true-false" && (
												<Button
													variant="outline"
													size="sm"
													onClick={addOption}
													className="hover:scale-105 transition-transform duration-200 bg-transparent"
												>
													<Plus className="w-4 h-4 mr-1" />
													Add Option
												</Button>
											)}
										</div>

										<AnimatePresence>
											{question.options.map((option, optionIndex) => (
												<motion.div
													key={optionIndex}
													initial={{ opacity: 0, x: -20 }}
													animate={{ opacity: 1, x: 0 }}
													exit={{ opacity: 0, x: 20 }}
													className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
												>
													<Switch
														checked={option.isCorrect}
														onCheckedChange={(checked) => handleCorrectAnswerChange(optionIndex, checked)}
														className="data-[state=checked]:bg-green-500"
													/>
													<Input
														value={option.text}
														onChange={(e) => updateOption(optionIndex, { text: e.target.value })}
														placeholder={`Option ${optionIndex + 1}`}
														className="flex-1 bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-500"
														disabled={question.questionType === "true-false"}
													/>
													{question.questionType !== "true-false" && question.options.length > 2 && (
														<Button
															variant="ghost"
															size="sm"
															onClick={() => removeOption(optionIndex)}
															className="text-red-500 hover:text-red-600 hover:scale-110 transition-all duration-200"
														>
															<X className="w-4 h-4" />
														</Button>
													)}
												</motion.div>
											))}
										</AnimatePresence>
									</div>
								)}

								{/* Open-ended note */}
								{question.questionType === "open-ended" && (
									<motion.div
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
									>
										<p className="text-sm text-blue-700 dark:text-blue-300">
											This is an open-ended question. Participants will provide text-based answers that will need manual
											review.
										</p>
									</motion.div>
								)}
							</CardContent>
						</motion.div>
					)}
				</AnimatePresence>
			</Card>
		</motion.div>
	)
}
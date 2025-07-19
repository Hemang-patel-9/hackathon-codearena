"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Tag } from 'lucide-react'
import type { QuizData } from "@/types/quiz"
import { useState } from "react"
import { useAuth } from "@/contexts/authContext"
import { toast } from "@/hooks/use-toast"
import type { Result } from "@/types/response"
import { deleteMedia, uploadMedia } from "@/api/media"
import ThumbnailUpload from "./Thumbnail"

interface QuizBasicInfoProps {
	quizData: QuizData
	updateQuizData: (updates: Partial<QuizData>) => void
}

export function QuizBasicInfo({ quizData, updateQuizData }: QuizBasicInfoProps) {
	const [newTag, setNewTag] = useState("")
	const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
	const { token } = useAuth();

	const addTag = () => {
		if (newTag.trim() && !quizData.tags.includes(newTag.trim())) {
			updateQuizData({ tags: [...quizData.tags, newTag.trim()] })
			setNewTag("")
		}
	}

	const removeTag = (tagToRemove: string) => {
		updateQuizData({ tags: quizData.tags.filter((tag) => tag !== tagToRemove) })
	}

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			e.preventDefault()
			addTag()
		}
	}

	const handleThumbnailUpload = async (file: File) => {
		if (!token) {
			toast({
				title: "Authentication Error",
				description: "You need to be logged in to upload files.",
				variant: "destructive",
			});
			return;
		}

		setIsUploadingThumbnail(true);

		try {
			console.log('Uploading thumbnail file:', file);
			const result: Result = await uploadMedia(file, token);
			console.log('Upload result:', result);

			if (result.error) {
				toast({
					title: "Upload Failed",
					description: result.error,
					variant: "destructive",
				});
			} else {
				// Assuming the result contains the file URL or filename
				const thumbnailUrl = result.data?.url || result.data?.filename || result.data;
				console.log('Thumbnail URL:', thumbnailUrl);

				updateQuizData({ thumbnail: thumbnailUrl });

				toast({
					title: "Upload Successful",
					description: "Thumbnail uploaded successfully!",
					variant: "default",
				});
			}
		} catch (error) {
			console.error('Upload error:', error);
			toast({
				title: "Upload Failed",
				description: "Failed to upload thumbnail. Please try again.",
				variant: "destructive",
			});
		} finally {
			setIsUploadingThumbnail(false);
		}
	};

	// Thumbnail Delete Handler
	const handleThumbnailDelete = async (thumbnailId: string) => {
		if (!token) {
			toast({
				title: "Authentication Error",
				description: "You need to be logged in to delete files.",
				variant: "destructive",
			});
			return;
		}

		try {
			console.log('Deleting thumbnail:', thumbnailId);
			const cleanedThumbnailId = thumbnailId.replace(/^media[\\/]/, "");
			const result: Result = await deleteMedia(cleanedThumbnailId, token);
			console.log('Delete result:', result);

			if (result.error) {
				toast({
					title: "Delete Failed",
					description: result.error,
					variant: "destructive",
				});
			} else {
				updateQuizData({ thumbnail: "" });

				toast({
					title: "Delete Successful",
					description: "Thumbnail deleted successfully!",
					variant: "default",
				});
			}
		} catch (error) {
			console.error('Delete error:', error);
			toast({
				title: "Delete Failed",
				description: "Failed to delete thumbnail. Please try again.",
				variant: "destructive",
			});
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="space-y-6"
		>
			<Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-white/20 dark:border-gray-700/50">
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-white">
						<motion.div
							animate={{ rotate: 360 }}
							transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
							className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
						/>
						Basic Information
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					{/* Title */}
					<motion.div
						initial={{ x: -20, opacity: 0 }}
						animate={{ x: 0, opacity: 1 }}
						transition={{ delay: 0.1 }}
					>
						<Label htmlFor="title" className="text-sm font-medium text-gray-700 dark:text-gray-300">
							Quiz Title *
						</Label>
						<Input
							id="title"
							value={quizData.title}
							onChange={(e) => updateQuizData({ title: e.target.value })}
							placeholder="Enter an engaging quiz title..."
							className="mt-1 bg-white/50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 focus:ring-purple-500 focus:border-purple-500"
							maxLength={100}
						/>
						<div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
							{quizData.title.length}/100 characters
						</div>
					</motion.div>

					{/* Description */}
					<motion.div
						initial={{ x: -20, opacity: 0 }}
						animate={{ x: 0, opacity: 1 }}
						transition={{ delay: 0.2 }}
					>
						<Label htmlFor="description" className="text-sm font-medium text-gray-700 dark:text-gray-300">
							Description
						</Label>
						<Textarea
							id="description"
							value={quizData.description}
							onChange={(e) => updateQuizData({ description: e.target.value })}
							placeholder="Describe what this quiz is about..."
							className="mt-1 resize-none bg-white/50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 focus:ring-purple-500 focus:border-purple-500 min-h-[100px]"
							maxLength={500}
						/>
						<div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
							{quizData.description.length}/500 characters
						</div>
					</motion.div>

					{/* Thumbnail Upload */}
					<ThumbnailUpload
						onDelete={handleThumbnailDelete}
						onThumbnailChange={handleThumbnailUpload as any}
						currentThumbnail={quizData.thumbnail}
						onUpload={handleThumbnailUpload}
						isUploading={isUploadingThumbnail}
					/>

					{/* Tags */}
					<motion.div
						initial={{ x: -20, opacity: 0 }}
						animate={{ x: 0, opacity: 1 }}
						transition={{ delay: 0.4 }}
					>
						<Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tags</Label>
						<div className="mt-1 space-y-3">
							<div className="flex gap-2">
								<Input
									value={newTag}
									onChange={(e) => setNewTag(e.target.value)}
									onKeyPress={handleKeyPress}
									placeholder="Add a tag..."
									className="flex-1 bg-white/50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 focus:ring-purple-500 focus:border-purple-500"
								/>
								<Button
									type="button"
									onClick={addTag}
									size="sm"
									className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 hover:scale-105 transition-all duration-200"
								>
									<Tag className="w-4 h-4" />
								</Button>
							</div>
							{quizData.tags.length > 0 && (
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									className="flex flex-wrap gap-2"
								>
									{quizData.tags.map((tag, index) => (
										<motion.div
											key={tag}
											initial={{ scale: 0 }}
											animate={{ scale: 1 }}
											transition={{ delay: index * 0.1 }}
										>
											<Badge
												variant="secondary"
												className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors duration-200 group"
											>
												{tag}
												<button
													onClick={() => removeTag(tag)}
													className="ml-2 hover:text-red-500 transition-colors duration-200"
												>
													<X className="w-3 h-3" />
												</button>
											</Badge>
										</motion.div>
									))}
								</motion.div>
							)}
						</div>
					</motion.div>
				</CardContent>
			</Card>
		</motion.div>
	)
}

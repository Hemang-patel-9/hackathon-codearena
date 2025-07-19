"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Play, Pause, Volume2, VolumeX, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MultimediaContentProps {
	multimedia: {
		type: string
		url: string
	}
}

export function MultimediaContent({ multimedia }: MultimediaContentProps) {
	const [isPlaying, setIsPlaying] = useState(false)
	const [isMuted, setIsMuted] = useState(false)
	const [imageError, setImageError] = useState(false)

	if (!multimedia.url) return null

	// Clean up the URL - handle backslashes and construct full URL

	const handleImageError = () => {
		setImageError(true)
	}

	const fullUrl = `${import.meta.env.VITE_APP_API_URL}/${multimedia.url}`

	const renderContent = () => {
		switch (multimedia.type.toLowerCase()) {
			case "image":
				return (
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.3 }}
						className="relative group"
					>
						{!imageError ? (
							<img
								src={`${import.meta.env.VITE_APP_API_URL}/${multimedia.url}`}
								alt="Question multimedia"
								onError={handleImageError}
								className="w-full max-w-2xl h-auto rounded-lg shadow-lg object-cover max-h-96"
								crossOrigin="anonymous"
							/>
						) : (
							<div className="w-full max-w-2xl h-48 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg flex items-center justify-center">
								<div className="text-center text-gray-500 dark:text-gray-400">
									<ImageIcon className="w-12 h-12 mx-auto mb-2" />
									<p className="text-sm">Image not available</p>
										<p className="text-xs text-gray-400 mt-1">{multimedia.url}</p>
								</div>
							</div>
						)}
					</motion.div>
				)

			case "video":
				return (
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.3 }}
						className="relative group"
					>
						<video
							controls
							className="w-full max-w-2xl h-auto rounded-lg shadow-lg max-h-96"
							onPlay={() => setIsPlaying(true)}
							onPause={() => setIsPlaying(false)}
							muted={isMuted}
						>
							<source src={`${import.meta.env.VITE_APP_API_URL}/${multimedia.url}`} type="video/mp4" />
							<source src={`${import.meta.env.VITE_APP_API_URL}/${multimedia.url}`} type="video/webm" />
							<source src={`${import.meta.env.VITE_APP_API_URL}/${multimedia.url}`} type="video/ogg" />
							Your browser does not support the video tag.
						</video>

						<div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
							<Button
								size="sm"
								variant="secondary"
								onClick={() => setIsMuted(!isMuted)}
								className="bg-black/50 hover:bg-black/70 text-white"
							>
								{isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
							</Button>
						</div>
					</motion.div>
				)

			case "audio":
				return (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.3 }}
						className="w-full max-w-2xl"
					>
						<div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-lg shadow-lg border">
							<div className="flex items-center gap-4 mb-4">
								<div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
									{isPlaying ? <Pause className="w-6 h-6 text-white" /> : <Play className="w-6 h-6 text-white" />}
								</div>
								<div>
									<h4 className="font-semibold text-gray-800 dark:text-gray-200">Audio Content</h4>
									<p className="text-sm text-gray-600 dark:text-gray-400">Click to play audio</p>
								</div>
							</div>

							<audio controls className="w-full" onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)}>
								<source src={fullUrl} type="audio/mpeg" />
								<source src={fullUrl} type="audio/wav" />
								<source src={fullUrl} type="audio/ogg" />
								Your browser does not support the audio element.
							</audio>
						</div>
					</motion.div>
				)

			default:
				return (
					<div className="w-full max-w-2xl p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
						<p className="text-sm text-gray-600 dark:text-gray-400">Unsupported media type: {multimedia.type}</p>
					</div>
				)
		}
	}

	return <div className="w-full flex justify-center mb-6">{renderContent()}</div>
}

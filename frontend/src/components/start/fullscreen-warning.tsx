"use client"

import { Maximize2, Maximize } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"


export function FullscreenWarning() {
	const navigate = useNavigate();
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
		>
			<motion.div
				initial={{ scale: 0.8, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-2xl text-center max-w-md w-full"
			>
				<motion.div
					animate={{ scale: [1, 1.1, 1] }}
					transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
					className="mb-6"
				>
					<Maximize2 className="w-16 h-16 text-red-500 mx-auto" />
				</motion.div>
				<h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Fullscreen Required</h2>
				<p className="text-gray-600 dark:text-gray-400 mb-6 text-sm sm:text-base">
					You must remain in fullscreen mode during the exam. Please click the button below to continue.
				</p>
				<Button onClick={() => {
					navigate("/dashboard");
				}} className="w-full py-3 bg-red-600 hover:bg-red-700 text-sm sm:text-base">
					<Maximize className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
					Return to Fullscreen
				</Button>
			</motion.div>
		</motion.div>
	)
}

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Image, Trash2, Eye, Camera } from 'lucide-react';

const ThumbnailUpload = ({
	currentThumbnail,
	onThumbnailChange,
	onUpload,
	onDelete,
	isUploading = false
}:{
	currentThumbnail?: string;
	onThumbnailChange: (thumbnail: string) => void;
	onUpload: (file: File) => void;
	onDelete: (mediaId: string) => void;
	isUploading?: boolean;
}) => {
	const [previewUrl, setPreviewUrl] = useState(currentThumbnail || '');
	const [dragActive, setDragActive] = useState(false);
	const [showPreview, setShowPreview] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleDragEvents = (e:any) => {
		e.preventDefault();
		e.stopPropagation();
	};

	const handleDragEnter = (e:any) => {
		handleDragEvents(e);
		setDragActive(true);
	};

	const handleDragLeave = (e:any) => {
		handleDragEvents(e);
		setDragActive(false);
	};

	const handleDrop = (e:any) => {
		handleDragEvents(e);
		setDragActive(false);

		const files = e.dataTransfer.files;
		if (files && files[0]) {
			handleFile(files[0]);
		}
	};

	const handleFileSelect = (e:any	) => {
		const file = e.target.files[0];
		if (file) {
			handleFile(file);
		}
	};

	const handleFile = (file:any) => {
		// Validate file type
		if (!file.type.startsWith('image/')) {
			alert('Please select an image file');
			return;
		}

		// Validate file size (5MB limit)
		if (file.size > 5 * 1024 * 1024) {
			alert('File size must be less than 5MB');
			return;
		}

		// Create preview
		const reader = new FileReader();
		reader.onload = (e:any) => {
			setPreviewUrl(e.target.result);
		};
		reader.readAsDataURL(file);

		// Upload file
		onUpload(file);
	};

	const handleDelete = () => {
		if (currentThumbnail) {
			onDelete(currentThumbnail);
		}	
		setPreviewUrl('');
		onThumbnailChange('');
	};

	const triggerFileInput = () => {
		fileInputRef.current?.click();
	};

	return (
		<div className="space-y-4">
			{/* Main Upload Area */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.3 }}
				className="relative"
			>
				<div
					className={`relative border-2 border-dashed rounded-lg transition-all duration-300 ${dragActive
							? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
							: 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
						} ${previewUrl ? 'p-0' : 'p-8'}`}
					onDragEnter={handleDragEnter}
					onDragLeave={handleDragLeave}
					onDragOver={handleDragEvents}
					onDrop={handleDrop}
				>
					{previewUrl ? (
						// Preview Mode
						<motion.div
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.3 }}
							className="relative group"
						>
							<div className="relative overflow-hidden rounded-lg">
								<img
									src={previewUrl}
									alt="Thumbnail preview"
									className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
								/>

								{/* Overlay */}
								<div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
									<div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
										<motion.button
											whileHover={{ scale: 1.1 }}
											whileTap={{ scale: 0.9 }}
											onClick={() => setShowPreview(true)}
											className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
										>
											<Eye className="w-4 h-4 text-gray-700 dark:text-gray-300" />
										</motion.button>
										<motion.button
											whileHover={{ scale: 1.1 }}
											whileTap={{ scale: 0.9 }}
											onClick={triggerFileInput}
											className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
										>
											<Camera className="w-4 h-4 text-gray-700 dark:text-gray-300" />
										</motion.button>
										<motion.button
											whileHover={{ scale: 1.1 }}
											whileTap={{ scale: 0.9 }}
											onClick={handleDelete}
											className="p-2 bg-red-500 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
										>
											<Trash2 className="w-4 h-4 text-white" />
										</motion.button>
									</div>
								</div>

								{/* Upload Progress Overlay */}
								<AnimatePresence>
									{isUploading && (
										<motion.div
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											exit={{ opacity: 0 }}
											className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"
										>
											<div className="text-white text-center">
												<motion.div
													animate={{ rotate: 360 }}
													transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
													className="w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-2"
												/>
												<p className="text-sm">Uploading...</p>
											</div>
										</motion.div>
									)}
								</AnimatePresence>
							</div>
						</motion.div>
					) : (
						// Upload Mode
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.3 }}
							className="text-center cursor-pointer"
							onClick={triggerFileInput}
						>
							<motion.div
								animate={dragActive ? { scale: 1.1 } : { scale: 1 }}
								transition={{ duration: 0.2 }}
								className="mx-auto mb-4"
							>
								<div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
									<Upload className="w-8 h-8 text-white" />
								</div>
							</motion.div>

							<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
								Upload Quiz Thumbnail
							</h3>
							<p className="text-gray-600 dark:text-gray-400 mb-4">
								Drag and drop an image here, or click to select
							</p>
							<div className="flex items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
								<div className="flex items-center gap-1">
									<Image className="w-4 h-4" />
									<span>PNG, JPG, GIF</span>
								</div>
								<div>Max 5MB</div>
							</div>
						</motion.div>
					)}

					{/* Drag Active Overlay */}
					<AnimatePresence>
						{dragActive && (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								className="absolute inset-0 bg-blue-500 bg-opacity-10 border-2 border-blue-500 rounded-lg flex items-center justify-center"
							>
								<div className="text-blue-600 dark:text-blue-400 text-center">
									<Upload className="w-8 h-8 mx-auto mb-2" />
									<p className="font-semibold">Drop image here</p>
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</div>

				{/* Hidden File Input */}
				<input
					ref={fileInputRef}
					type="file"
					accept="image/*"
					onChange={handleFileSelect}
					className="hidden"
				/>
			</motion.div>

			{/* Full Preview Modal */}
			<AnimatePresence>
				{showPreview && previewUrl && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
						onClick={() => setShowPreview(false)}
					>
						<motion.div
							initial={{ scale: 0.8, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.8, opacity: 0 }}
							transition={{ duration: 0.3 }}
							className="relative max-w-4xl max-h-[80vh] bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-2xl"
							onClick={(e) => e.stopPropagation()}
						>
							<div className="absolute top-4 right-4 z-10">
								<motion.button
									whileHover={{ scale: 1.1 }}
									whileTap={{ scale: 0.9 }}
									onClick={() => setShowPreview(false)}
									className="p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-all duration-200"
								>
									<X className="w-6 h-6" />
								</motion.button>
							</div>
							<img
								src={previewUrl}
								alt="Full preview"
								className="w-full h-full object-contain"
							/>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default ThumbnailUpload;
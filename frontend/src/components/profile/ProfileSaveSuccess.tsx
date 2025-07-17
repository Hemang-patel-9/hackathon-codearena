import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
const ProfileSaveSuccess = ({ profileSaveSuccess }: { profileSaveSuccess: boolean }) => {
	return (
		<>
			{profileSaveSuccess && (
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -20 }}
					className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
				>
					<div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
						<CheckCircle className="w-5 h-5" />
						<span className="font-medium">Profile updated successfully!</span>
					</div>
				</motion.div>
			)}
		</>
	)
}

export default ProfileSaveSuccess
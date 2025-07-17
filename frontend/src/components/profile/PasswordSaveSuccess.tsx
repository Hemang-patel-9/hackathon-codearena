import { CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion';

const PasswordSaveSuccess = ({ passwordSaveSuccess }: { passwordSaveSuccess: boolean }) => {
	return (
		<>
			{passwordSaveSuccess && (
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -20 }}
					className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
				>
					<div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
						<CheckCircle className="w-5 h-5" />
						<span className="font-medium">Password updated successfully!</span>
					</div>
				</motion.div>
			)}
		</>
	)
}

export default PasswordSaveSuccess
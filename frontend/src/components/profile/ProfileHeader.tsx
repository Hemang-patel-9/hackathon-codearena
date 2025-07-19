import { motion } from 'framer-motion';
import { AlertCircle, Calendar, Camera, CheckCircle, Settings } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import type { User } from '@/types/user';
import { useNavigate } from 'react-router-dom';

const ProfileHeader = ({
	userProfile,
	avatarPreview,
	setAvatarPreview
}: {
	userProfile: User | null,
	avatarPreview: string,
	setAvatarPreview: any
}) => {
	const navigate = useNavigate();
	return (
		<div className="mb-6 sm:mb-8">
			{/* User Info Card */}
			<Card className="shadow-lg border-0 bg-gradient-to-tr dark:from-purple-950/30 dark:to-blue-950/30 from-purple-100 to-blue-100 backdrop-blur-sm">
				<CardContent className="p-4 sm:p-6">
					<div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
						{/* Avatar Section */}
						<div className="flex justify-center sm:justify-start">
							<div className="relative flex-shrink-0">
								<img
									src={
										`${import.meta.env.VITE_APP_API_URL}/${userProfile?.avatar}` ||
										avatarPreview ||
										"demo-image.png"
									}
									onError={() => {
										console.log("--")
										setAvatarPreview("demo-image.png");
									}}
									alt="Profile"
									className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-blue-200 dark:border-blue-800"
								/>
								<div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full p-1.5 sm:p-2">
									<Camera className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
								</div>
							</div>
						</div>

						{/* User Info Section */}
						<div className="flex-1 min-w-0 text-center sm:text-left">
							{/* Name and Badges */}
							<div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 mb-2">
								<h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white truncate">
									{userProfile?.username || "User"}
								</h2>
								<div className="flex items-center justify-center sm:justify-start space-x-2">
									{userProfile?.isVerified ? (
										<Badge
											variant="secondary"
											className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs"
										>
											<CheckCircle className="w-3 h-3 mr-1" />
											Verified
										</Badge>
									) : <Badge
										variant="secondary"
										onClick={() => {
											navigate("/otp");
										}}
										className="bg-green-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 text-xs hover:cursor-pointer"
									>
										<AlertCircle className="w-3 h-3 mr-1" />
										Get Verified
									</Badge>}
									<Badge variant="outline" className="capitalize text-xs">
										{userProfile?.role}
									</Badge>
								</div>
							</div>

							{/* Email */}
							<p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-2 sm:mb-3 truncate">
								{userProfile?.email}
							</p>

							{/* Join Date */}
							<div className="flex items-center justify-center sm:justify-start space-x-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
								<Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
								<span className="truncate">
									Joined {new Date(userProfile?.createdAt || "").toLocaleDateString()}
								</span>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}

export default ProfileHeader
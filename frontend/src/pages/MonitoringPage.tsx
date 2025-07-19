import { useSocket } from '@/hooks/use-socket';
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react';

const MonitoringPage = () => {
	const params = useParams();
	const socket = useSocket();
	type LeaderboardUser = {
		userId: string;
		username: string;
		score: number;
		correctAnswersCount: number;
		rank: number;
	};

	const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);

	useEffect(() => {
		if (!socket || !params.quizId) return;

		const handleLeaderboard = (data: LeaderboardUser[]) => {
			setLeaderboard(data);
		};

		socket.on('quiz:leaderboard', handleLeaderboard);

		// Optionally, request initial leaderboard data
		socket.emit('creator:get-live-data', { quizId: params.quizId });

		return () => {
			socket.off('quiz:leaderboard', handleLeaderboard);
		};
	}, [socket, params.quizId]);
	console.log("MonitoringPage params:", params);
	return (
		<div>
			<h2>MonitoringPage {params.quizId}</h2>
			<table>
				<thead>
					<tr>
						<th>Rank</th>
						<th>Username</th>
						<th>Score</th>
						<th>Correct Answers</th>
					</tr>
				</thead>
				<tbody>
					{leaderboard.map(user => (
						<tr key={user.userId}>
							<td>{user.rank}</td>
							<td>{user.username}</td>
							<td>{user.score}</td>
							<td>{user.correctAnswersCount}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}

export default MonitoringPage
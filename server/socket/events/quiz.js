const Scoreboard = require("../../models/score.model");

function calculateLeaderboard(scoreMap) {
	const scores = Array.from(scoreMap.entries()).map(([userId, data]) => ({
		userId,
		username: data.username,
		score: data.score,
		correctAnswersCount: data.correctAnswersCount,
		averageResponseTime: data.responseTimes.length
			? data.responseTimes.reduce((a, b) => a + b, 0) / data.responseTimes.length
			: 0,
	}));
	scores.sort((a, b) => b.score - a.score || a.averageResponseTime - b.averageResponseTime);
	scores.forEach((entry, index) => (entry.rank = index + 1));
	return scores;
}

const handleQuizEvents = (io, socket, activeScores) => {
	socket.on("join-quiz", ({ quizId, user }) => {
		socket.join(quizId);
		console.log(`${user.username} joined quiz ${quizId}`);

		if (!activeScores.has(quizId)) {
			activeScores.set(quizId, new Map());
		}
		const scoreMap = activeScores.get(quizId);
		scoreMap.set(user._id, {
			username: user.username,
			score: 0,
			correctAnswersCount: 0,
			responseTimes: [],
		});

		io.to(quizId).emit("user-joined", { user });
	});

	socket.on("submit-answer", ({ quizId, userId, isCorrect, responseTime }) => {
		const scoreMap = activeScores.get(quizId);
		if (!scoreMap || !scoreMap.has(userId)) return;

		const data = scoreMap.get(userId);
		if (isCorrect) {
			data.score += 10;
			data.correctAnswersCount += 1;
		}
		data.responseTimes.push(responseTime);
		scoreMap.set(userId, data);

		const leaderboard = calculateLeaderboard(scoreMap);
		io.to(quizId).emit("leaderboard-update", leaderboard);
	});

	socket.on("end-quiz", async ({ quizId }) => {
		const scoreMap = activeScores.get(quizId);
		if (!scoreMap) return;

		const leaderboard = calculateLeaderboard(scoreMap);
		const participants = leaderboard.map((entry) => ({
			userId: entry.userId,
			username: entry.username,
			score: entry.score,
			correctAnswersCount: entry.correctAnswersCount,
			averageResponseTime: entry.averageResponseTime,
			rank: entry.rank,
		}));

		await Scoreboard.create({ quizId, participantScores: participants });

		io.to(quizId).emit("quiz-ended", { leaderboard: participants });
		activeScores.delete(quizId); // clean up
	});
};

module.exports = { handleQuizEvents };

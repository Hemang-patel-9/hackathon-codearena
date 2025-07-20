const { Server } = require("socket.io");
const { createScoreBoard } = require("../controllers/score.controller");
let io = null;
const Scoreboard = require('../models/score.model');
let online = 0;

// 🧠 Main in-memory quiz room structure
const room = {}; // { [quizId]: { creatorId, participants: { [userId]: { username, score, ... } } } }

const initializeSocket = (server) => {
	io = new Server(server, {
		cors: {
			origin: "*",
			methods: ["GET", "POST"],
		},
	});

	io.on("connection", (socket) => {
		online++;
		console.log(`✅ Socket connected: ${socket.id}`);
		io.emit("active-users", online);

		// 🔸 Creator starts quiz
		socket.on("creator:start-quiz", ({ quizId }) => {
			console.log(room, " current room state");
			console.log(`📝 Quiz creation request: ${quizId}`);
			room[quizId] = {
				creatorId: socket.id,
				participants: {}
			};
			socket.join(quizId);
		});

		// 🔸 Student joins quiz
		socket.on("student:join-quiz", ({ quizId, userId, username, avatar }) => {
			if (!room[quizId]) return socket.emit("quiz:not-ready");

			room[quizId].participants[userId] = {
				userId,
				username,
				avatar,
				score: 0,
				correctAnswersCount: 0,
				rank: 0
			};
			socket.join(quizId);
			socket.emit("quiz:joined", { quizId });
			console.log(`👤 ${username} joined quiz ${quizId}`);
		});

		// 🔸 Student submits answer
		socket.on("student:submit-answer", ({ quizId, userId, isCorrect, score, violations }) => {
			const quiz = room[quizId];
			if (!quiz || !quiz.participants[userId]) return;

			const player = quiz.participants[userId];
			console.log(player, "11");

			// Update score and violations
			if (typeof score === "number") {
				player.score += score;
			}
			if (typeof violations === "number") {
				player.violations = violations;
			}

			if (isCorrect) {
				player.correctAnswersCount += 1;
			}

			player.userId = userId;

			// 🏁 Rank calculation
			const sorted = Object.entries(quiz.participants)
				.sort(([, a], [, b]) => b.score - a.score);

			sorted.forEach(([uid, data], index) => {
				quiz.participants[uid].rank = index + 1;
			});

			// ✉️ Emit updated data to student
			socket.emit("quiz:update-self", {
				userId: player.userId,
				username: player.username,
				avatar: player.avatar,
				score: player.score,
				correctAnswersCount: player.correctAnswersCount,
				rank: player.rank,
				violations: player.violations
			});

			// ✉️ Emit full leaderboard to everyone in room
			const leaderboard = sorted.map(([uid, data]) => ({
				userId: uid,
				...data
			}));
			io.to(quizId).emit("quiz:leaderboard", leaderboard);
		});

		// 🔸 Creator fetches live leaderboard
		socket.on("creator:get-live-data", ({ quizId }) => {
			const quiz = room[quizId];
			if (!quiz || quiz.creatorId !== socket.id) return;

			const leaderboard = Object.entries(quiz.participants)
				.sort(([, a], [, b]) => b.score - a.score)
				.map(([userId, data]) => ({
					userId,
					...data
				}));

			socket.emit("creator:live-data", leaderboard);
		});

		socket.on("creator:end-quiz", async ({ quizId }) => {
			const quiz = room[quizId];
			if (!quiz) return;
			const participantScores = Object.values(quiz.participants);
			socket.emit("quiz:endbycreator", {
				data: quizId,
				message: "Exam is Ended By user",
				error: null
			});
			await Scoreboard.create({ quizId: quizId, participantScores: participantScores })
		});

		// 🔸 Handle disconnect
		socket.on("disconnect", () => {
			online = Math.max(0, online - 1);
			console.log(`❌ Socket disconnected: ${socket.id}`);
			io.emit("active-users", online);
		});
	});
};

module.exports = {
	initializeSocket,
	room
};

const mongoose = require("mongoose");

const scoreboardSchema = new mongoose.Schema({
	quizId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Quiz',
		required: true,
	},
	participantScores: [
		{
			userId: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
				required: true,
			},
			username: {
				type: String,
				required: true,
			},
			score: {
				type: Number,
				required: true,
			},
			correctAnswersCount: {
				type: Number,
				default: 0,
			},
			averageResponseTime: {
				type: Number,
				default: 0,
			},
			rank: {
				type: Number,
				default: 0,
				required: true
			},
		},
	],
}, {
	timestamps: true,
});

module.exports = mongoose.model("Scoreboard", scoreboardSchema);
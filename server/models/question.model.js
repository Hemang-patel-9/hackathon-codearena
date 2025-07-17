// Question Schema
const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
	questionText: {
		type: String,
		required: true,
		trim: true,
	},
	questionType: {
		type: String,
		enum: ['multiple-choice', 'multiple-select', 'true-false', 'open-ended'],
		required: true,
	},
	options: [
		{
			text: {
				type: String,
				trim: true,
			},
			isCorrect: {
				type: Boolean,
				default: false,
			},
		},
	],
	multimedia: {
		type: {
			type: String,
			enum: ['image', 'audio', 'video'],
		},
		url: {
			type: String,
		},
	}
}, {
	timestamps: true,
});

module.exports = mongoose.model("Question", questionSchema);
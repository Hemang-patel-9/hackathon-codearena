const mongoose = require('mongoose');

// Quiz Schema
const quizSchema = new mongoose.Schema({
	creator: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	title: {
		type: String,
		required: true,
		trim: true,
		maxlength: 100,
	},
	description: {
		type: String,
		trim: true,
		maxlength: 500,
	},
	questions: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Question',
		},
	],
	NoOfQuestion: {
		type: Number,
		default: 1,
		required: true
	},
	timePerQuestion: {
		type: Number,
		default: 30,
	},
	passingCriteria: {
		type: Number,
		default: 70,
	},
	questionOrder: {
		type: String,
		enum: ['random', 'fixed'],
		default: 'random',
	},
	visibility: {
		type: String,
		enum: ['public', 'private', 'password-protected'],
		default: 'public',
	},
	password: {
		type: String,
		select: false,
		require: () => { this.visibility == "password-protected" ? true : false }
	},
	status: {
		type: String,
		enum: ['upcoming', 'active', 'completed', 'cancelled'],
		default: 'upcoming',
	},
	duration: {
		type: Number,
		default: null
	},
	participants: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		}
	],
	thumbnail: {
		type: String,
		default: '',
	},
	tags: [{
		type: String,
		trim: true,
	}],
	schedule: {
		type: Date,
		default: Date.now,
	}
}, {
	timestamps: true,
});

module.exports = mongoose.model("Quiz", quizSchema);
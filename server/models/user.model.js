const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		unique: true,
		sparse: true,
		trim: true,
		lowercase: true,
		maxlength: 50,
	},
	email: {
		type: String,
		unique: true,
		required: true,
		lowercase: true,
		trim: true,
		match: /^\S+@\S+\.\S+$/,
	},
	password: {
		type: String,
		required: true,
		minlength: 6,
		select: false,
	},
	avatar: {
		type: String,
	},
	role: {
		type: String,
		enum: ['user', 'admin', 'moderator'],
		default: 'user',
	},
	isVerified: {
		type: Boolean,
		default: false,
	},
	isBanned: {
		type: Boolean,
		default: false,
	},
	bio: {
		type: String,
		maxlength: 300,
		default: '',
	},
	socialLinks: {
		github: { type: String, default: "" },
		linkedin: { type: String, default: "" },
		twitter: { type: String, default: "" },
		website: { type: String, default: "" },
	},
	achievements: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Badge",
	}]
}, {
	timestamps: true,
});


module.exports = mongoose.model("User", userSchema);
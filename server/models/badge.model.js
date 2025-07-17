const mongoose = require("mongoose");

const BadgeSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	icon: {
		type: String,
		required: true
	},
}, { timestamps : true
 });

module.exports = mongoose.model("Badge", BadgeSchema);
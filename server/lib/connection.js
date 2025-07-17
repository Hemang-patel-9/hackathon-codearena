const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = () => {
	const mongoURI = process.env.MONGODB_URI;

	// Try to connect to the MongoDB server
	mongoose
		.connect(mongoURI)
		.then(() => console.log("MongoDB connected successfully"))
		.catch((error) => {
			console.error("MongoDB connection error:", error.message);
			process.exit(1); // Exit process on failure to connect
		});

	// Handle MongoDB connection events
	mongoose.connection.on("disconnected", () => {
		console.warn("MongoDB disconnected");
	});

	mongoose.connection.on("error", (err) => {
		console.error("MongoDB connection error:", err.message || err);
	});

	// Graceful shutdown: Disconnect MongoDB on process termination
	process.on("SIGINT", async () => {
		await mongoose.connection.close();
		console.log("MongoDB connection closed due to application termination");
		process.exit(0);
	});
};

module.exports = connectDB;

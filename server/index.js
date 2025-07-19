require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

// Import routes
const badgeRoutes = require('./routes/badge.router');
const questionRoutes = require('./routes/question.router');
const scoreRoutes = require('./routes/score.router');
const quizRoutes = require('./routes/quiz.router')
const quizGenerationRoutes = require('./routes/generator.router');
const analyticsRoutes = require('./routes/analytics.router');

require("./lib/connection")();
const app = express();

// Middlewares
app.use("/media", express.static('media'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Auto-load routes
const routesPath = path.join(__dirname, "routes");
fs.readdirSync(routesPath).forEach((file) => {
	if (file.endsWith(".router.js")) {
		const route = require(path.join(routesPath, file));
		const routePath = "/" + file.replace(".router.js", "");
		app.use(routePath, route);
	}
});

app.use('/api/badges', badgeRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/quizzes',quizRoutes);
app.use('/api/scoreboards', scoreRoutes);
app.use('/api/generate', quizGenerationRoutes);
app.use('/api/analytics',analyticsRoutes);

// Root route
app.get("/", (req, res) => {
	res.send("Welcome to the Nodexor 😊");
});

// Global Error Handler
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({ error: true, data: null, message: "Internal Server Error" });
});

// Server
const PORT = process.env.PORT;
app.listen(PORT, () => {
	console.log(`🚀 Server is running at http://localhost:${PORT}`);
});

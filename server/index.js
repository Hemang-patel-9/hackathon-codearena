require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const { initializeSocket } = require("./socket/socket");
const app = express();
const server = http.createServer(app);

// MongoDB connection
require("./lib/connection")();

// Initialize Socket.IO
initializeSocket(server);

// Middleware
app.use("/media", express.static("media"));
app.use(cors({
	origin:"*"
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Auto-load all routes ending with `.router.js`
const routesPath = path.join(__dirname, "routes");
fs.readdirSync(routesPath).forEach((file) => {
	if (file.endsWith(".router.js")) {
		const route = require(path.join(routesPath, file));
		const routePath = "/" + file.replace(".router.js", "");
		app.use(routePath, route);
	}
});

// Root route
app.get("/", (req, res) => {
	res.send("✅ Real-time Quiz Server is up!");
});

// Error handling
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({ error: true, message: "Internal Server Error" });
});

// Start server
const PORT = process.env.PORT || 9705;
server.listen(PORT, () => {
	console.log(`🚀 Server running at http://localhost:${PORT}`);
});

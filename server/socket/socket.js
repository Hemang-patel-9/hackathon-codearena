const { Server } = require("socket.io");

let io = null;
let online = 0;

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
		console.log(`👥 Online users: ${online}`);

		// Emit updated count to all clients
		io.emit("active-users", online);

		socket.on("disconnect", () => {
			online = Math.max(0, online - 1);
			console.log(`❌ Socket disconnected: ${socket.id}`);
			console.log(`👥 Online users: ${online}`);

			io.emit("active-users", online);
		});
	});
};

module.exports = {
	initializeSocket,
};

const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
	const token = req.headers["authorization"] && req.headers["authorization"].split(" ")[1];

	if (!token) {
		return res.status(401).json({
			error: true,
			data: null,
			message: "No token provided"
		});
	}

	jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
		if (err) {
			return res.status(401).json({
				error: true,
				data: null,
				message: "Invalid or expired token"
			});
		}

		req.user = decoded;

		next();
	});
};

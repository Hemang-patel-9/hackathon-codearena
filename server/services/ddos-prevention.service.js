// DDoS Prevention Service using express-rate-limit
const rateLimit = require('express-rate-limit');

const ddosLimiter = rateLimit({
	windowMs: parseInt(15 * 60 * 1000),
	max: parseInt(100),
	message: '⚠️ Too many requests, please try again later.',
	standardHeaders: true,
	legacyHeaders: false,
});

module.exports = ddosLimiter;

const nodemailer = require('nodemailer');
require('dotenv').config();

/**
 * Creates a nodemailer transporter using environment variables
 */
const transporter = nodemailer.createTransport({
	host: process.env.SMTP_HOST,
	port: parseInt(process.env.SMTP_PORT) || 587,
	service: "gmail",
	secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
	auth: {
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_PASS
	}
});

/**
 * Generate numeric OTP
 * @param {number} length - OTP length
 * @returns {string}
 */
function generateOtp(length = 6) {
	return Array.from({ length }, () => Math.floor(Math.random() * 10)).join('');
}

/**
 * Send OTP via email using nodemailer
 * @param {string} to - Recipient email
 * @param {Object} options - Optional configurations
 * @param {number} [options.otpLength=6] - Length of OTP
 * @param {string} [options.from] - From email
 * @param {string} [options.subject] - Email subject
 * @param {string} [options.text] - Text version of email
 * @param {string} [options.html] - HTML version of email
 * @param {Array} [options.attachments] - Attachments array
 * @returns {Promise<{ info: Object, otp: string }>}
 */
async function sendOtpEmail(to, options = {}) {
	if (!to || typeof to !== 'string') {
		throw new Error('Recipient email address (to) is required and must be a string.');
	}

	const otp = generateOtp(options.otpLength);

	const mailOptions = {
		from: options.from || process.env.FROM_EMAIL,
		to,
		subject: options.subject || 'Your OTP Code',
		text: options.text || `Your OTP is ${otp}`,
		html: options.html || `<h2>Your OTP is <strong>${otp}</strong></h2>`,
		attachments: Array.isArray(options.attachments) ? options.attachments : []
	};

	try {
		const info = await transporter.sendMail(mailOptions);
		console.log(`✅ Email sent to ${to} (Message ID: ${info.messageId})`);
		return { info, otp };
	} catch (err) {
		console.error(`❌ Failed to send OTP email: ${err.message}`);
		throw new Error('Failed to send OTP email. Please check SMTP configuration and input.');
	}
}

module.exports = { sendOtpEmail };

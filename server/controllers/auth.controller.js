const jwt = require("jsonwebtoken");
const User = require("../models/user.model"); // adjust the path as needed
const { sendOtpEmail } = require("../services/otp.service");
const { OAuth2Client } = require('google-auth-library');
const otpStore = {}
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
//get user data by token value
const getUserFromToken = async (req, res) => {
	try {
		const authHeader = req.headers.authorization;

		// Check if header exists and starts with Bearer
		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			return res.status(401).json({ message: "Unauthorized: No token provided" });
		}
		const token = authHeader.split(" ")[1];
		console.log(token, "token");
		// Verify token
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const user = await User.findById(decoded.id).select("-password");

		if (!user) {
			return res.status(404).json({ error: "User not found", message: "User not found", data: null });
		}

		return res.status(200).json({ error: null, message: "User not found", data: user });
	} catch (error) {
		console.error("Auth error:", error);
		return res.status(401).json({ error: "Expired Token", data: null, message: "Invalid or expired token" });
	}
};

// Send OTP
const sendOtp = async (req, res) => {
	try {
		const { email } = req.body;

		if (!email) {
			return res.status(400).json({
				error: "Email is required",
				message: "OTP sending failed",
				data: null,
			});
		}

		// Generate and send OTP
		const otpData = await sendOtpEmail(email, {
			otpLength: 6,
		});

		// Store OTP + expiration (e.g., 5 min)
		otpStore[email] = {
			otp: otpData.otp,
			expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
		};

		res.status(200).json({
			error: null,
			message: "OTP sent successfully",
			data: null, // Don't return OTP to client
		});
	} catch (err) {
		console.error("OTP send error:", err);
		res.status(500).json({
			error: err.message,
			message: "OTP sending failed",
			data: null,
		});
	}
};

//Verify OTP
const verifyOtp = async (req, res) => {
	try {
		const { email, otp } = req.body;

		if (!email || !otp) {
			return res.status(400).json({
				error: "Email and OTP are required",
				message: "OTP verification failed",
				data: null,
			});
		}

		const stored = otpStore[email];
		if (!stored) {
			return res.status(400).json({
				error: "No OTP found for this email",
				message: "OTP verification failed",
				data: null,
			});
		}

		if (Date.now() > stored.expiresAt) {
			delete otpStore[email];
			return res.status(400).json({
				error: "OTP has expired",
				message: "OTP verification failed",
				data: null,
			});
		}

		if (stored.otp !== otp) {
			return res.status(401).json({
				error: "Invalid OTP",
				message: "OTP verification failed",
				data: null,
			});
		}

		const user = await User.findOne({ email });
		if (!user) {
			return res.status(404).json({
				error: "User not found",
				message: "OTP verification failed",
				data: null,
			});
		}

		user.isVerified = true;
		await user.save();

		delete otpStore[email];

		return res.json({
			error: null,
			message: "OTP verified successfully",
			data: null,
		});

	} catch (err) {
		console.error("OTP verification error:", err);
		res.status(500).json({
			error: err.message,
			message: "OTP verification failed",
			data: null,
		});
	}
};

const googleSignIn = async (req, res) => {
	const { credential } = req.body;

	try {
		const ticket = await client.verifyIdToken({
			idToken: credential,
			audience: process.env.GOOGLE_CLIENT_ID,
		});

		const payload = ticket.getPayload();

		if (!payload) return res.status(401).json({ error: 'Invalid token' });

		const user = await User.findOne({ email: payload.email }).select('+password +avatar +username');
		if (!user)
			return res.status(404).json({
				error: 'User not found',
				message: 'Login failed',
				data: null,
			});

		const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
			expiresIn: '7d',
		});

		const { password: _, ...userWithoutPassword } = user.toObject();

		res.json({
			error: null,
			message: 'Login successful',
			data: { token, user: userWithoutPassword },
		});

	} catch (error) {
		console.error(error);
		res.status(401).json({ error: 'Token verification failed' });
	}
};

const GithubRedirectUrl = async (req, res) => {
	const githubUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${process.env.GITHUB_CALLBACK_URL}&scope=user`;
	res.redirect(githubUrl);
};

const GithubCallBack = async (req, res) => {
	const code = req.query.code;
	if (!code) return res.status(400).send("No code provided");

	try {
		// Exchange code for access token
		const tokenRes = await fetch(`https://github.com/login/oauth/access_token`, {
			method: "POST",
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				client_id: process.env.GITHUB_CLIENT_ID,
				client_secret: process.env.GITHUB_CLIENT_SECRET,
				code
			})
		});

		const tokenData = await tokenRes.json();
		const accessToken = tokenData.access_token;

		if (!accessToken) {
			console.error("Access token not received:", tokenData);
			return res.status(400).send("Failed to get access token");
		}

		// Fetch GitHub user profile
		const userRes = await fetch("https://api.github.com/user", {
			headers: {
				Authorization: `Bearer ${accessToken}`,
				Accept: "application/json",
			}
		});
		const user = await userRes.json();

		console.log(user);

		// Redirect with user info
		res.redirect(`http://localhost:5173/github-success?name=${encodeURIComponent(user.name)}&avatar=${encodeURIComponent(user.avatar_url)}`);
	} catch (error) {
		console.error("GitHub OAuth Error:", error);
		res.status(500).send("Authentication failed");
	}
};

const FaceBookRedirectUrl = (req, res) => {
	const fbAuthUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${process.env.FACEBOOK_CLIENT_ID}&redirect_uri=${process.env.FACEBOOK_CALLBACK_URL}&scope=email,public_profile`;
	res.redirect(fbAuthUrl);
};

const FacebookCallback = async (req, res) => {
	const code = req.query.code;
	if (!code) return res.status(400).send("No code provided");

	try {
		// Step 3: Exchange code for access token
		const tokenRes = await fetch("https://graph.facebook.com/v19.0/oauth/access_token", {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
			// Pass query parameters directly in the URL
			params: {
				client_id: process.env.FACEBOOK_CLIENT_ID,
				client_secret: process.env.FACEBOOK_CLIENT_SECRET,
				redirect_uri: process.env.FACEBOOK_CALLBACK_URL,
				code,
			},
		});
		const tokenData = await tokenRes.json();

		if (!tokenData.access_token) {
			return res.status(400).send("Failed to get access token");
		}

		const accessToken = tokenData.access_token;

		// Step 4: Fetch user info
		const userRes = await fetch(`https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`, {
			method: 'GET',
		});
		const userData = await userRes.json();

		if (userData.error) {
			return res.status(500).send("Failed to fetch user data");
		}

		const user = userData;
		console.log(user, " userFacebook");
		// Step 5: Redirect to frontend with user info
		// res.redirect(`http://localhost:5173/facebook-success?name=${encodeURIComponent(user.name)}&email=${encodeURIComponent(user.email)}&avatar=${encodeURIComponent(user.picture?.data?.url || "")}`);
	} catch (error) {
		console.error("Facebook OAuth Error:", error);
		res.status(500).send("Authentication failed");
	}
};
module.exports = {
	getUserFromToken,
	sendOtp,
	verifyOtp,
	googleSignIn,
	GithubRedirectUrl,
	GithubCallBack,
	FaceBookRedirectUrl,
	FacebookCallback
};

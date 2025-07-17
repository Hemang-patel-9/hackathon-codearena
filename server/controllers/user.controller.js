const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

// REGISTER
const register = async (req, res) => {
	try {
		const {
			name,
			email,
			password,
			username,
			role,
			bio,
			socialLinks,
		} = req.body;

		const existing = await User.findOne({ email });
		if (existing)
			return res.status(400).json({
				error: 'Email already registered',
				message: 'Registration failed',
				data: null,
			});

		const hashed = await bcrypt.hash(password, 10);
		const avatar = req.file ? req.file.path : undefined;
		const user = new User({
			name,
			email,
			username,
			password: hashed,
			role,
			bio,
			socialLinks,
			avatar,
		});

		await user.save();

		res.status(201).json({
			error: null,
			message: 'User registered successfully',
			data: null,
		});
	} catch (err) {
		console.error('Registration error:', err);
		res.status(500).json({
			error: err.message,
			message: 'Registration failed',
			data: null,
		});
	}
};

// LOGIN
const login = async (req, res) => {
	try {
		const { email, password } = req.body;

		const user = await User.findOne({ email }).select('+password +avatar +username');
		if (!user)
			return res.status(404).json({
				error: 'User not found',
				message: 'Login failed',
				data: null,
			});

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch)
			return res.status(401).json({
				error: 'Invalid credentials',
				message: 'Login failed',
				data: null,
			});

		const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
			expiresIn: '7d',
		});

		const { password: _, ...userWithoutPassword } = user.toObject();

		res.json({
			error: null,
			message: 'Login successful',
			data: { token, user: userWithoutPassword },
		});
	} catch (err) {
		res.status(500).json({
			error: err.message,
			message: 'Login failed',
			data: null,
		});
	}
};

// GET ALL USERS
const getAllUsers = async (req, res) => {
	try {
		const users = await User.find().select('-password');
		res.json({
			error: null,
			message: 'Users fetched successfully',
			data: users,
		});
	} catch (err) {
		res.status(500).json({
			error: err.message,
			message: 'Fetching users failed',
			data: null,
		});
	}
};

// GET USER BY ID
const getUserById = async (req, res) => {
	try {
		const user = await User.findById(req.params.id).select('-password');
		if (!user)
			return res.status(404).json({
				error: 'User not found',
				message: 'Fetch failed',
				data: null,
			});

		res.json({
			error: null,
			message: 'User fetched successfully',
			data: user,
		});
	} catch (err) {
		res.status(500).json({
			error: err.message,
			message: 'Fetching user failed',
			data: null,
		});
	}
};

// UPDATE USER
const updateUser = async (req, res) => {
	try {
		const updates = req.body;

		if (updates.password) {
			updates.password = await bcrypt.hash(updates.password, 10);
		}

		const user = await User.findByIdAndUpdate(req.params.id, updates, {
			new: true,
		}).select('-password');

		if (!user)
			return res.status(404).json({
				error: 'User not found',
				message: 'Update failed',
				data: null,
			});

		res.json({
			error: null,
			message: 'User updated successfully',
			data: user,
		});
	} catch (err) {
		res.status(500).json({
			error: err.message,
			message: 'Update failed',
			data: null,
		});
	}
};

// DELETE USER
const deleteUser = async (req, res) => {
	try {
		const user = await User.findByIdAndDelete(req.params.id);
		if (!user)
			return res.status(404).json({
				error: 'User not found',
				message: 'Delete failed',
				data: null,
			});

		res.json({
			error: null,
			message: 'User deleted successfully',
			data: null,
		});
	} catch (err) {
		res.status(500).json({
			error: err.message,
			message: 'Delete failed',
			data: null,
		});
	}
};

const updatePassword = async (req, res) => {
	try {
		const { currentPassword, newPassword, confirmNewPassword } = req.body;
		const userId = req.params.id;

		// Check if all fields are present
		if (!currentPassword || !newPassword || !confirmNewPassword) {
			return res.status(400).json({
				error: 'All password fields are required',
				message: 'Password update failed',
				data: null,
			});
		}

		// Check new password match
		if (newPassword !== confirmNewPassword) {
			return res.status(400).json({
				error: 'New passwords do not match',
				message: 'Password update failed',
				data: null,
			});
		}

		// Find user and select password
		const user = await User.findById(userId).select('+password');
		if (!user) {
			return res.status(404).json({
				error: 'User not found',
				message: 'Password update failed',
				data: null,
			});
		}

		// Compare current password
		const isMatch = await bcrypt.compare(currentPassword, user.password);
		if (!isMatch) {
			return res.status(401).json({
				error: 'Current password is incorrect',
				message: 'Password update failed',
				data: null,
			});
		}

		// Hash new password and update
		const hashed = await bcrypt.hash(newPassword, 10);
		user.password = hashed;
		await user.save();

		return res.status(200).json({
			error: null,
			message: 'Password updated successfully',
			data: null,
		});
	} catch (err) {
		res.status(500).json({
			error: err.message,
			message: 'Password update failed',
			data: null,
		});
	}
};

const updateProfile = async (req, res) => {
	try {
		const userId = req.params.id;
		const { username, bio, socialLinks } = req.body;

		const updates = {
			username,
			bio,
			socialLinks: socialLinks
		};

		if (req.file) {
			updates.avatar = req.file.path;
		}

		const user = await User.findByIdAndUpdate(userId, updates, {
			new: true,
		}).select('-password');

		if (!user) {
			return res.status(404).json({
				error: 'User not found',
				message: 'Profile update failed',
				data: null,
			});
		}

		res.json({
			error: null,
			message: 'Profile updated successfully',
			data: user,
		});
	} catch (err) {
		res.status(500).json({
			error: err.message,
			message: 'Profile update failed',
			data: null,
		});
	}
};

// @route   GET /api/users/search?q=<query_text>
const searchUsers = async (req, res) => {
    try {
        const queryText = req.query.q;

        if (!queryText || queryText.trim() === '') {
            return res.status(400).json({ success: false, message: 'Search query parameter "q" is required.' });
        }

        const searchRegex = new RegExp(queryText, 'i');

        const users = await User.find({
            $or: [
                { username: { $regex: searchRegex } },
                { email: { $regex: searchRegex } }
            ]
        }).select('username _id email avatar');

        if (users.length === 0) {
            return res.status(404).json({ success: true, message: 'No users found matching your query.', data: [] });
        }

        res.status(200).json({ success: true, count: users.length, data: users });

    } catch (error) {
        console.error('Error searching users:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};


module.exports = {
	register,
	login,
	getAllUsers,
	getUserById,
	updateUser,
	deleteUser,
	updatePassword,
	updateProfile,
	searchUsers
}
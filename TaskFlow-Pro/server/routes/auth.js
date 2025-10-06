const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
	return jwt.sign({ userId }, process.env.JWT_SECRET || "fallback-secret", {
		expiresIn: process.env.JWT_EXPIRES_IN || "7d",
	});
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post("/register", async (req, res) => {
	try {
		const { name, email, password } = req.body;

		// Validation
		if (!name || !email || !password) {
			return res.status(400).json({
				error: "Please provide name, email, and password",
			});
		}

		if (password.length < 6) {
			return res.status(400).json({
				error: "Password must be at least 6 characters long",
			});
		}

		// Check if user already exists
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({
				error: "User with this email already exists",
			});
		}

		// Create new user
		const user = new User({
			name,
			email,
			password,
		});

		await user.save();

		// Generate token
		const token = generateToken(user._id);

		res.status(201).json({
			message: "User registered successfully",
			token,
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
				preferences: user.preferences,
				stats: user.stats,
			},
		});
	} catch (error) {
		console.error("Registration error:", error);
		res.status(500).json({
			error: "Registration failed",
			message: error.message,
		});
	}
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body;

		// Validation
		if (!email || !password) {
			return res.status(400).json({
				error: "Please provide email and password",
			});
		}

		// Find user and include password
		const user = await User.findOne({ email }).select("+password");
		if (!user) {
			return res.status(401).json({
				error: "Invalid credentials",
			});
		}

		// Check if user is active
		if (!user.isActive) {
			return res.status(401).json({
				error: "Account is deactivated. Please contact support.",
			});
		}

		// Check password
		const isPasswordValid = await user.comparePassword(password);
		if (!isPasswordValid) {
			return res.status(401).json({
				error: "Invalid credentials",
			});
		}

		// Update last login
		await user.updateLastLogin();

		// Generate token
		const token = generateToken(user._id);

		res.json({
			message: "Login successful",
			token,
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
				preferences: user.preferences,
				stats: user.stats,
				lastLogin: user.lastLogin,
			},
		});
	} catch (error) {
		console.error("Login error:", error);
		res.status(500).json({
			error: "Login failed",
			message: error.message,
		});
	}
});

// @route   GET /api/auth/me
// @desc    Get current user info
// @access  Private
router.get("/me", auth, async (req, res) => {
	try {
		const user = await User.findById(req.user.userId);

		if (!user) {
			return res.status(404).json({
				error: "User not found",
			});
		}

		res.json({
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				avatar: user.avatar,
				role: user.role,
				preferences: user.preferences,
				stats: user.stats,
				completionPercentage: user.completionPercentage,
				lastLogin: user.lastLogin,
				createdAt: user.createdAt,
			},
		});
	} catch (error) {
		console.error("Get user error:", error);
		res.status(500).json({
			error: "Failed to get user information",
			message: error.message,
		});
	}
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put("/profile", auth, async (req, res) => {
	try {
		const { name, avatar, preferences } = req.body;

		const user = await User.findById(req.user.userId);
		if (!user) {
			return res.status(404).json({
				error: "User not found",
			});
		}

		// Update fields
		if (name) user.name = name;
		if (avatar) user.avatar = avatar;
		if (preferences) {
			user.preferences = { ...user.preferences, ...preferences };
		}

		await user.save();

		res.json({
			message: "Profile updated successfully",
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				avatar: user.avatar,
				role: user.role,
				preferences: user.preferences,
				stats: user.stats,
			},
		});
	} catch (error) {
		console.error("Profile update error:", error);
		res.status(500).json({
			error: "Failed to update profile",
			message: error.message,
		});
	}
});

// @route   POST /api/auth/change-password
// @desc    Change user password
// @access  Private
router.post("/change-password", auth, async (req, res) => {
	try {
		const { currentPassword, newPassword } = req.body;

		// Validation
		if (!currentPassword || !newPassword) {
			return res.status(400).json({
				error: "Please provide current and new password",
			});
		}

		if (newPassword.length < 6) {
			return res.status(400).json({
				error: "New password must be at least 6 characters long",
			});
		}

		// Find user with password
		const user = await User.findById(req.user.userId).select("+password");
		if (!user) {
			return res.status(404).json({
				error: "User not found",
			});
		}

		// Verify current password
		const isCurrentPasswordValid = await user.comparePassword(currentPassword);
		if (!isCurrentPasswordValid) {
			return res.status(401).json({
				error: "Current password is incorrect",
			});
		}

		// Update password
		user.password = newPassword;
		await user.save();

		res.json({
			message: "Password changed successfully",
		});
	} catch (error) {
		console.error("Change password error:", error);
		res.status(500).json({
			error: "Failed to change password",
			message: error.message,
		});
	}
});

module.exports = router;

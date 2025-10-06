const express = require("express");
const User = require("../models/User");
const Task = require("../models/Task");
const auth = require("../middleware/auth");

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get current user profile
// @access  Private
router.get("/profile", auth, async (req, res) => {
	try {
		const user = await User.findById(req.user.userId)
			.select("-password")
			.lean();

		if (!user) {
			return res.status(404).json({
				error: "User not found",
			});
		}

		res.json({ user });
	} catch (error) {
		console.error("Get profile error:", error);
		res.status(500).json({
			error: "Failed to fetch profile",
			message: error.message,
		});
	}
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put("/profile", auth, async (req, res) => {
	try {
		const { name, email, bio, avatar, preferences, timezone } = req.body;

		const user = await User.findById(req.user.userId);

		if (!user) {
			return res.status(404).json({
				error: "User not found",
			});
		}

		// Check if email is being changed and if it's already taken
		if (email && email !== user.email) {
			const existingUser = await User.findOne({ email });
			if (existingUser) {
				return res.status(400).json({
					error: "Email already registered",
				});
			}
			user.email = email;
		}

		// Update fields
		if (name) user.name = name;
		if (bio !== undefined) user.bio = bio;
		if (avatar) user.avatar = avatar;
		if (timezone) user.timezone = timezone;
		if (preferences) {
			user.preferences = { ...user.preferences, ...preferences };
		}

		await user.save();

		// Return user without password
		const updatedUser = await User.findById(user._id)
			.select("-password")
			.lean();

		res.json({
			message: "Profile updated successfully",
			user: updatedUser,
		});
	} catch (error) {
		console.error("Update profile error:", error);
		res.status(500).json({
			error: "Failed to update profile",
			message: error.message,
		});
	}
});

// @route   PUT /api/users/preferences
// @desc    Update user preferences
// @access  Private
router.put("/preferences", auth, async (req, res) => {
	try {
		const { theme, notifications, taskView, defaultCategory, defaultPriority } =
			req.body;

		const user = await User.findById(req.user.userId);

		if (!user) {
			return res.status(404).json({
				error: "User not found",
			});
		}

		// Update preferences
		const updatedPreferences = { ...user.preferences };

		if (theme) updatedPreferences.theme = theme;
		if (notifications !== undefined) {
			updatedPreferences.notifications = {
				...updatedPreferences.notifications,
				...notifications,
			};
		}
		if (taskView) updatedPreferences.taskView = taskView;
		if (defaultCategory) updatedPreferences.defaultCategory = defaultCategory;
		if (defaultPriority) updatedPreferences.defaultPriority = defaultPriority;

		user.preferences = updatedPreferences;
		await user.save();

		res.json({
			message: "Preferences updated successfully",
			preferences: updatedPreferences,
		});
	} catch (error) {
		console.error("Update preferences error:", error);
		res.status(500).json({
			error: "Failed to update preferences",
			message: error.message,
		});
	}
});

// @route   GET /api/users/stats
// @desc    Get user statistics
// @access  Private
router.get("/stats", auth, async (req, res) => {
	try {
		const user = await User.findById(req.user.userId)
			.select("stats joinedAt")
			.lean();

		if (!user) {
			return res.status(404).json({
				error: "User not found",
			});
		}

		// Calculate additional stats
		const daysSinceJoined = Math.floor(
			(new Date() - user.joinedAt) / (1000 * 60 * 60 * 24)
		);

		const averageTasksPerDay =
			daysSinceJoined > 0
				? (user.stats.totalTasks / daysSinceJoined).toFixed(2)
				: 0;

		const completionRate =
			user.stats.totalTasks > 0
				? ((user.stats.completedTasks / user.stats.totalTasks) * 100).toFixed(2)
				: 0;

		res.json({
			stats: {
				...user.stats,
				daysSinceJoined,
				averageTasksPerDay: parseFloat(averageTasksPerDay),
				completionRate: parseFloat(completionRate),
			},
		});
	} catch (error) {
		console.error("Get user stats error:", error);
		res.status(500).json({
			error: "Failed to fetch user statistics",
			message: error.message,
		});
	}
});

// @route   DELETE /api/users/account
// @desc    Delete user account
// @access  Private
router.delete("/account", auth, async (req, res) => {
	try {
		const { confirmPassword } = req.body;

		if (!confirmPassword) {
			return res.status(400).json({
				error: "Password confirmation required",
			});
		}

		const user = await User.findById(req.user.userId);

		if (!user) {
			return res.status(404).json({
				error: "User not found",
			});
		}

		// Verify password
		const isPasswordValid = await user.comparePassword(confirmPassword);
		if (!isPasswordValid) {
			return res.status(400).json({
				error: "Invalid password",
			});
		}

		// Delete all user's tasks first
		await Task.deleteMany({ assignedTo: req.user.userId });

		// Delete user account
		await User.findByIdAndDelete(req.user.userId);

		res.json({
			message: "Account deleted successfully",
		});
	} catch (error) {
		console.error("Delete account error:", error);
		res.status(500).json({
			error: "Failed to delete account",
			message: error.message,
		});
	}
});

// @route   PUT /api/users/change-password
// @desc    Change user password
// @access  Private
router.put("/change-password", auth, async (req, res) => {
	try {
		const { currentPassword, newPassword } = req.body;

		if (!currentPassword || !newPassword) {
			return res.status(400).json({
				error: "Current password and new password are required",
			});
		}

		if (newPassword.length < 6) {
			return res.status(400).json({
				error: "New password must be at least 6 characters long",
			});
		}

		const user = await User.findById(req.user.userId);

		if (!user) {
			return res.status(404).json({
				error: "User not found",
			});
		}

		// Verify current password
		const isCurrentPasswordValid = await user.comparePassword(currentPassword);
		if (!isCurrentPasswordValid) {
			return res.status(400).json({
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

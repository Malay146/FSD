const express = require("express");
const mongoose = require("mongoose");
const Task = require("../models/Task");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

// All routes are protected
router.use(auth);

// @route   GET /api/tasks
// @desc    Get all tasks for the authenticated user
// @access  Private
router.get("/", async (req, res) => {
	try {
		const {
			status,
			priority,
			category,
			search,
			sortBy = "createdAt",
			sortOrder = "desc",
			page = 1,
			limit = 10,
		} = req.query;

		// Build filter object
		const filter = { assignedTo: req.user.userId };

		if (status) filter.status = status;
		if (priority) filter.priority = priority;
		if (category) filter.category = category;
		if (search) {
			filter.$or = [
				{ title: { $regex: search, $options: "i" } },
				{ description: { $regex: search, $options: "i" } },
			];
		}

		// Pagination
		const skip = (parseInt(page) - 1) * parseInt(limit);

		// Sort object
		const sort = {};
		sort[sortBy] = sortOrder === "desc" ? -1 : 1;

		// Get tasks with pagination
		const tasks = await Task.find(filter)
			.sort(sort)
			.skip(skip)
			.limit(parseInt(limit))
			.populate("assignedTo", "name email avatar");

		// Get total count for pagination
		const totalTasks = await Task.countDocuments(filter);
		const totalPages = Math.ceil(totalTasks / parseInt(limit));

		// Get user statistics
		const stats = await Task.getUserStats(req.user.userId);

		res.json({
			tasks,
			pagination: {
				currentPage: parseInt(page),
				totalPages,
				totalTasks,
				hasNext: parseInt(page) < totalPages,
				hasPrev: parseInt(page) > 1,
			},
			stats,
		});
	} catch (error) {
		console.error("Get tasks error:", error);
		res.status(500).json({
			error: "Failed to fetch tasks",
			message: error.message,
		});
	}
});

// @route   GET /api/tasks/:id
// @desc    Get a specific task
// @access  Private
router.get("/:id", async (req, res) => {
	try {
		const task = await Task.findOne({
			_id: req.params.id,
			assignedTo: req.user.userId,
		}).populate("assignedTo", "name email avatar");

		if (!task) {
			return res.status(404).json({
				error: "Task not found",
			});
		}

		res.json({ task });
	} catch (error) {
		console.error("Get task error:", error);
		res.status(500).json({
			error: "Failed to fetch task",
			message: error.message,
		});
	}
});

// @route   POST /api/tasks
// @desc    Create a new task
// @access  Private
router.post("/", async (req, res) => {
	try {
		const {
			title,
			description,
			priority,
			category,
			dueDate,
			estimatedTime,
			tags,
			subtasks,
		} = req.body;

		// Validation
		if (!title) {
			return res.status(400).json({
				error: "Task title is required",
			});
		}

		// Create task
		const task = new Task({
			title,
			description,
			priority,
			category,
			dueDate: dueDate ? new Date(dueDate) : null,
			estimatedTime,
			tags: tags || [],
			subtasks: subtasks || [],
			assignedTo: req.user.userId,
		});

		await task.save();

		// Update user stats
		await User.findByIdAndUpdate(req.user.userId, {
			$inc: { "stats.totalTasks": 1 },
		});

		// Populate the response
		await task.populate("assignedTo", "name email avatar");

		res.status(201).json({
			message: "Task created successfully",
			task,
		});
	} catch (error) {
		console.error("Create task error:", error);
		res.status(500).json({
			error: "Failed to create task",
			message: error.message,
		});
	}
});

// @route   PUT /api/tasks/:id
// @desc    Update a task
// @access  Private
router.put("/:id", async (req, res) => {
	try {
		const task = await Task.findOne({
			_id: req.params.id,
			assignedTo: req.user.userId,
		});

		if (!task) {
			return res.status(404).json({
				error: "Task not found",
			});
		}

		const {
			title,
			description,
			status,
			priority,
			category,
			dueDate,
			estimatedTime,
			actualTime,
			tags,
			subtasks,
		} = req.body;

		// Check if status is changing to completed
		const wasCompleted = task.status === "completed";
		const isNowCompleted = status === "completed";

		// Update fields
		if (title !== undefined) task.title = title;
		if (description !== undefined) task.description = description;
		if (status !== undefined) task.status = status;
		if (priority !== undefined) task.priority = priority;
		if (category !== undefined) task.category = category;
		if (dueDate !== undefined)
			task.dueDate = dueDate ? new Date(dueDate) : null;
		if (estimatedTime !== undefined) task.estimatedTime = estimatedTime;
		if (actualTime !== undefined) task.actualTime = actualTime;
		if (tags !== undefined) task.tags = tags;
		if (subtasks !== undefined) task.subtasks = subtasks;

		await task.save();

		// Update user stats if completion status changed
		if (!wasCompleted && isNowCompleted) {
			await User.findByIdAndUpdate(req.user.userId, {
				$inc: { "stats.completedTasks": 1 },
			});
		} else if (wasCompleted && !isNowCompleted) {
			await User.findByIdAndUpdate(req.user.userId, {
				$inc: { "stats.completedTasks": -1 },
			});
		}

		// Populate the response
		await task.populate("assignedTo", "name email avatar");

		res.json({
			message: "Task updated successfully",
			task,
		});
	} catch (error) {
		console.error("Update task error:", error);
		res.status(500).json({
			error: "Failed to update task",
			message: error.message,
		});
	}
});

// @route   DELETE /api/tasks/:id
// @desc    Delete a task
// @access  Private
router.delete("/:id", async (req, res) => {
	try {
		const task = await Task.findOne({
			_id: req.params.id,
			assignedTo: req.user.userId,
		});

		if (!task) {
			return res.status(404).json({
				error: "Task not found",
			});
		}

		const wasCompleted = task.status === "completed";

		await Task.findByIdAndDelete(req.params.id);

		// Update user stats
		const statsUpdate = { "stats.totalTasks": -1 };
		if (wasCompleted) {
			statsUpdate["stats.completedTasks"] = -1;
		}

		await User.findByIdAndUpdate(req.user.userId, {
			$inc: statsUpdate,
		});

		res.json({
			message: "Task deleted successfully",
		});
	} catch (error) {
		console.error("Delete task error:", error);
		res.status(500).json({
			error: "Failed to delete task",
			message: error.message,
		});
	}
});

// @route   GET /api/tasks/stats/dashboard
// @desc    Get dashboard statistics
// @access  Private
router.get("/stats/dashboard", async (req, res) => {
	try {
		const userId = req.user.userId;

		// Get basic stats
		const stats = await Task.getUserStats(userId);

		// Get tasks by category
		const tasksByCategory = await Task.aggregate([
			{ $match: { assignedTo: mongoose.Types.ObjectId(userId) } },
			{
				$group: {
					_id: "$category",
					count: { $sum: 1 },
					completed: {
						$sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
					},
				},
			},
		]);

		// Get recent activity (last 7 days)
		const sevenDaysAgo = new Date();
		sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

		const recentActivity = await Task.find({
			assignedTo: userId,
			$or: [
				{ createdAt: { $gte: sevenDaysAgo } },
				{ completedAt: { $gte: sevenDaysAgo } },
			],
		})
			.sort({ createdAt: -1 })
			.limit(10);

		// Calculate productivity score
		const completionRate =
			stats.totalTasks > 0
				? (stats.completedTasks / stats.totalTasks) * 100
				: 0;

		res.json({
			stats: {
				...stats,
				completionRate: Math.round(completionRate),
				productivityScore: Math.min(
					100,
					Math.round(completionRate + stats.completedTasks * 2)
				),
			},
			tasksByCategory,
			recentActivity,
		});
	} catch (error) {
		console.error("Dashboard stats error:", error);
		res.status(500).json({
			error: "Failed to fetch dashboard statistics",
			message: error.message,
		});
	}
});

module.exports = router;

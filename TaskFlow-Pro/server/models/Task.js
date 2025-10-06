const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: [true, "Task title is required"],
			trim: true,
			maxlength: [100, "Title cannot exceed 100 characters"],
		},
		description: {
			type: String,
			trim: true,
			maxlength: [500, "Description cannot exceed 500 characters"],
		},
		status: {
			type: String,
			enum: ["pending", "in-progress", "completed", "cancelled"],
			default: "pending",
		},
		priority: {
			type: String,
			enum: ["low", "medium", "high", "urgent"],
			default: "medium",
		},
		category: {
			type: String,
			enum: ["work", "personal", "shopping", "health", "education", "other"],
			default: "other",
		},
		tags: [
			{
				type: String,
				trim: true,
				lowercase: true,
			},
		],
		dueDate: {
			type: Date,
			validate: {
				validator: function (date) {
					return !date || date >= new Date();
				},
				message: "Due date cannot be in the past",
			},
		},
		estimatedTime: {
			type: Number, // in minutes
			min: [1, "Estimated time must be at least 1 minute"],
			max: [1440, "Estimated time cannot exceed 24 hours"],
		},
		actualTime: {
			type: Number, // in minutes
			default: 0,
		},
		assignedTo: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		project: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Project",
			default: null,
		},
		subtasks: [
			{
				title: {
					type: String,
					required: true,
					trim: true,
				},
				completed: {
					type: Boolean,
					default: false,
				},
				createdAt: {
					type: Date,
					default: Date.now,
				},
			},
		],
		attachments: [
			{
				name: String,
				url: String,
				type: String,
				size: Number,
				uploadedAt: {
					type: Date,
					default: Date.now,
				},
			},
		],
		reminders: [
			{
				type: Date,
			},
		],
		completedAt: {
			type: Date,
			default: null,
		},
		isArchived: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

// Virtual for progress percentage
taskSchema.virtual("progress").get(function () {
	if (this.subtasks.length === 0) {
		return this.status === "completed" ? 100 : 0;
	}

	const completedSubtasks = this.subtasks.filter(
		(subtask) => subtask.completed
	).length;
	return Math.round((completedSubtasks / this.subtasks.length) * 100);
});

// Virtual for overdue status
taskSchema.virtual("isOverdue").get(function () {
	return (
		this.dueDate && new Date() > this.dueDate && this.status !== "completed"
	);
});

// Virtual for days until due
taskSchema.virtual("daysUntilDue").get(function () {
	if (!this.dueDate) return null;

	const today = new Date();
	const due = new Date(this.dueDate);
	const diffTime = due - today;
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

	return diffDays;
});

// Index for better query performance
taskSchema.index({ assignedTo: 1, status: 1 });
taskSchema.index({ dueDate: 1 });
taskSchema.index({ priority: 1 });
taskSchema.index({ createdAt: -1 });

// Middleware to update completedAt when status changes to completed
taskSchema.pre("save", function (next) {
	if (this.isModified("status")) {
		if (this.status === "completed" && !this.completedAt) {
			this.completedAt = new Date();
		} else if (this.status !== "completed") {
			this.completedAt = null;
		}
	}
	next();
});

// Static method to get user statistics
taskSchema.statics.getUserStats = async function (userId) {
	const stats = await this.aggregate([
		{ $match: { assignedTo: mongoose.Types.ObjectId(userId) } },
		{
			$group: {
				_id: null,
				totalTasks: { $sum: 1 },
				completedTasks: {
					$sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
				},
				pendingTasks: {
					$sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
				},
				inProgressTasks: {
					$sum: { $cond: [{ $eq: ["$status", "in-progress"] }, 1, 0] },
				},
				overdueTasks: {
					$sum: {
						$cond: [
							{
								$and: [
									{ $lt: ["$dueDate", new Date()] },
									{ $ne: ["$status", "completed"] },
									{ $ne: ["$dueDate", null] },
								],
							},
							1,
							0,
						],
					},
				},
			},
		},
	]);

	return (
		stats[0] || {
			totalTasks: 0,
			completedTasks: 0,
			pendingTasks: 0,
			inProgressTasks: 0,
			overdueTasks: 0,
		}
	);
};

module.exports = mongoose.model("Task", taskSchema);

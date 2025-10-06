const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

// Import routes
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");
const userRoutes = require("./routes/users");

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(
	cors({
		origin: process.env.CLIENT_URL || "http://localhost:3000",
		credentials: true,
	})
);

// Rate limiting
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // limit each IP to 100 requests per windowMs
	message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// Middleware
app.use(morgan("combined"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose
	.connect(
		process.env.MONGODB_URI || "mongodb://localhost:27017/taskflow-pro",
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
		}
	)
	.then(() => {
		console.log("✅ Connected to MongoDB successfully");
	})
	.catch((error) => {
		console.error("❌ MongoDB connection error:", error);
		process.exit(1);
	});

// Health check endpoint
app.get("/api/health", (req, res) => {
	res.json({
		status: "OK",
		message: "TaskFlow Pro API is running",
		timestamp: new Date().toISOString(),
		version: "1.0.0",
	});
});

// API routes
// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/tasks", require("./routes/tasks"));
app.use("/api/users", require("./routes/users"));
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);

// Welcome route
app.get("/", (req, res) => {
	res.json({
		message: "🚀 Welcome to TaskFlow Pro API",
		description: "A modern MERN stack task management application",
		author: "Krishil Agrawal",
		version: "1.0.0",
		endpoints: {
			health: "/api/health",
			auth: "/api/auth",
			tasks: "/api/tasks",
			users: "/api/users",
		},
	});
});

// 404 handler - catch all unmatched routes
app.use((req, res) => {
	res.status(404).json({
		error: "Route not found",
		message: `The requested endpoint ${req.originalUrl} does not exist`,
		availableEndpoints: [
			"/api/health",
			"/api/auth",
			"/api/tasks",
			"/api/users",
		],
	});
});

// Global error handler
app.use((error, req, res, next) => {
	console.error("❌ Error:", error);

	res.status(error.status || 500).json({
		error: error.message || "Internal Server Error",
		...(process.env.NODE_ENV === "development" && { stack: error.stack }),
	});
});

// Graceful shutdown
process.on("SIGTERM", () => {
	console.log("SIGTERM received. Shutting down gracefully...");
	mongoose.connection.close(() => {
		console.log("MongoDB connection closed.");
		process.exit(0);
	});
});

app.listen(PORT, () => {
	console.log(`🚀 TaskFlow Pro server running on port ${PORT}`);
	console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`);
	console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;

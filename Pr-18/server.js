const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3007;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static("public"));

// MongoDB Connection
const MONGODB_URI =
	process.env.MONGODB_URI ||
	"mongodb+srv://ajyadodiya2003_db_user:BmyzQqH4IkL0KoBC@cluster0.9buuyst.mongodb.net/notes_app?retryWrites=true&w=majority&appName=Cluster0";

mongoose
	.connect(MONGODB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log("✅ Connected to MongoDB Atlas successfully!");
		console.log("📱 Notes API is ready for mobile app integration");
	})
	.catch((error) => {
		console.error("❌ MongoDB connection error:", error);
	});

// Note Schema
const noteSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: [true, "Title is required"],
			trim: true,
			maxlength: [100, "Title cannot be more than 100 characters"],
		},
		content: {
			type: String,
			required: [true, "Content is required"],
			trim: true,
			maxlength: [5000, "Content cannot be more than 5000 characters"],
		},
		timestamp: {
			type: Date,
			default: Date.now,
		},
		updatedAt: {
			type: Date,
			default: Date.now,
		},
	},
	{
		timestamps: true, // This will automatically manage createdAt and updatedAt fields
	}
);

const Note = mongoose.model("Note", noteSchema);

// API Routes

// GET / - Serve HTML UI
app.get("/", (req, res) => {
	res.sendFile(__dirname + "/public/index.html");
});

// GET /api - API Documentation (JSON)
app.get("/api", (req, res) => {
	res.json({
		message: "📱 Notes Taking API",
		version: "1.0.0",
		description: "RESTful API for mobile notes app",
		endpoints: {
			"GET /": "Web UI for testing API",
			"GET /api": "API documentation (JSON)",
			"GET /api/notes": "Get all notes",
			"GET /api/notes/:id": "Get note by ID",
			"POST /api/notes": "Create new note",
			"PUT /api/notes/:id": "Update note",
			"DELETE /api/notes/:id": "Delete note",
		},
		sampleNote: {
			title: "Sample Note",
			content: "This is a sample note content",
		},
		testUrl: `http://localhost:${PORT}/api/notes`,
		mongoStatus:
			mongoose.connection.readyState === 1
				? "🟢 Connected"
				: "🟡 Connecting...",
	});
});

// GET /api/notes - Get all notes
app.get("/api/notes", async (req, res) => {
	try {
		const notes = await Note.find().sort({ updatedAt: -1 });
		res.json({
			success: true,
			count: notes.length,
			data: notes,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			error: "Server Error",
			message: error.message,
		});
	}
});

// GET /api/notes/:id - Get single note by ID
app.get("/api/notes/:id", async (req, res) => {
	try {
		const note = await Note.findById(req.params.id);

		if (!note) {
			return res.status(404).json({
				success: false,
				error: "Note not found",
			});
		}

		res.json({
			success: true,
			data: note,
		});
	} catch (error) {
		if (error.name === "CastError") {
			return res.status(400).json({
				success: false,
				error: "Invalid note ID",
			});
		}

		res.status(500).json({
			success: false,
			error: "Server Error",
			message: error.message,
		});
	}
});

// POST /api/notes - Create new note
app.post("/api/notes", async (req, res) => {
	try {
		const { title, content } = req.body;

		// Validation
		if (!title || !content) {
			return res.status(400).json({
				success: false,
				error: "Please provide both title and content",
			});
		}

		const note = new Note({
			title,
			content,
		});

		const savedNote = await note.save();

		res.status(201).json({
			success: true,
			message: "Note created successfully",
			data: savedNote,
		});
	} catch (error) {
		if (error.name === "ValidationError") {
			const errors = Object.values(error.errors).map((err) => err.message);
			return res.status(400).json({
				success: false,
				error: "Validation Error",
				messages: errors,
			});
		}

		res.status(500).json({
			success: false,
			error: "Server Error",
			message: error.message,
		});
	}
});

// PUT /api/notes/:id - Update note
app.put("/api/notes/:id", async (req, res) => {
	try {
		const { title, content } = req.body;

		// Validation
		if (!title || !content) {
			return res.status(400).json({
				success: false,
				error: "Please provide both title and content",
			});
		}

		const note = await Note.findByIdAndUpdate(
			req.params.id,
			{
				title,
				content,
				updatedAt: Date.now(),
			},
			{
				new: true, // Return updated document
				runValidators: true, // Run schema validators
			}
		);

		if (!note) {
			return res.status(404).json({
				success: false,
				error: "Note not found",
			});
		}

		res.json({
			success: true,
			message: "Note updated successfully",
			data: note,
		});
	} catch (error) {
		if (error.name === "CastError") {
			return res.status(400).json({
				success: false,
				error: "Invalid note ID",
			});
		}

		if (error.name === "ValidationError") {
			const errors = Object.values(error.errors).map((err) => err.message);
			return res.status(400).json({
				success: false,
				error: "Validation Error",
				messages: errors,
			});
		}

		res.status(500).json({
			success: false,
			error: "Server Error",
			message: error.message,
		});
	}
});

// DELETE /api/notes/:id - Delete note
app.delete("/api/notes/:id", async (req, res) => {
	try {
		const note = await Note.findByIdAndDelete(req.params.id);

		if (!note) {
			return res.status(404).json({
				success: false,
				error: "Note not found",
			});
		}

		res.json({
			success: true,
			message: "Note deleted successfully",
			data: note,
		});
	} catch (error) {
		if (error.name === "CastError") {
			return res.status(400).json({
				success: false,
				error: "Invalid note ID",
			});
		}

		res.status(500).json({
			success: false,
			error: "Server Error",
			message: error.message,
		});
	}
});

// 404 Handler
app.use("*", (req, res) => {
	res.status(404).json({
		success: false,
		error: "Route not found",
		message: `The route ${req.originalUrl} does not exist`,
	});
});

// Global Error Handler
app.use((error, req, res, next) => {
	console.error("Global error handler:", error);
	res.status(500).json({
		success: false,
		error: "Internal Server Error",
		message: error.message,
	});
});

// Start Server
app.listen(PORT, () => {
	console.log(`🚀 Notes API Server running at http://localhost:${PORT}`);
	console.log(`📖 API Documentation: http://localhost:${PORT}/`);
	console.log(`🔧 Test endpoints: http://localhost:${PORT}/api/notes`);
	console.log("📱 Ready for mobile app integration!");
});

module.exports = app;

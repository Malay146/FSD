const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const PORT = process.env.PORT || 3003;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));

// MongoDB Configuration - Change this to your MongoDB connection
const MONGODB_URI =
	process.env.MONGODB_URI || "mongodb://localhost:27017/tuition_db";
// For MongoDB Atlas, replace with: "mongodb+srv://username:password@cluster.mongodb.net/tuition_db"

// Fallback in-memory storage
let students = [
	{ _id: "1", name: "John Doe", rollNo: "001", className: "Class 10" },
	{ _id: "2", name: "Jane Smith", rollNo: "002", className: "Class 9" },
	{ _id: "3", name: "Mike Johnson", rollNo: "003", className: "Class 11" },
];
let nextId = 4;
let usingMongoDB = false;

// Student Schema for MongoDB
const studentSchema = new mongoose.Schema({
	name: { type: String, required: true },
	rollNo: { type: String, required: true },
	className: { type: String, required: true },
});

const Student = mongoose.model("Student", studentSchema);

// Try to connect to MongoDB
mongoose
	.connect(MONGODB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log("✅ Connected to MongoDB successfully!");
		usingMongoDB = true;
	})
	.catch((err) => {
		console.log("❌ MongoDB connection failed. Using in-memory storage.");
		console.log("   Error:", err.message);
		console.log("   💡 To use MongoDB:");
		console.log("   1. Install MongoDB locally, OR");
		console.log("   2. Use MongoDB Atlas (cloud)");
		console.log("   3. Update MONGODB_URI in this file");
		usingMongoDB = false;
	});

// Helper functions for in-memory storage
const inMemoryOps = {
	findAll: () => Promise.resolve(students),
	create: (data) => {
		const newStudent = { _id: nextId.toString(), ...data };
		students.push(newStudent);
		nextId++;
		return Promise.resolve(newStudent);
	},
	findById: (id) => Promise.resolve(students.find((s) => s._id === id)),
	updateById: (id, data) => {
		const index = students.findIndex((s) => s._id === id);
		if (index !== -1) {
			students[index] = { ...students[index], ...data };
			return Promise.resolve(students[index]);
		}
		return Promise.resolve(null);
	},
	deleteById: (id) => {
		students = students.filter((s) => s._id !== id);
		return Promise.resolve();
	},
};

// Unified operations that work with both MongoDB and in-memory
const dbOps = {
	findAll: async () => {
		return usingMongoDB ? await Student.find() : await inMemoryOps.findAll();
	},
	create: async (data) => {
		return usingMongoDB
			? await Student.create(data)
			: await inMemoryOps.create(data);
	},
	findById: async (id) => {
		return usingMongoDB
			? await Student.findById(id)
			: await inMemoryOps.findById(id);
	},
	updateById: async (id, data) => {
		return usingMongoDB
			? await Student.findByIdAndUpdate(id, data, { new: true })
			: await inMemoryOps.updateById(id, data);
	},
	deleteById: async (id) => {
		return usingMongoDB
			? await Student.findByIdAndDelete(id)
			: await inMemoryOps.deleteById(id);
	},
};

// Routes using unified operations
app.get("/", async (req, res) => {
	try {
		const students = await dbOps.findAll();
		res.render("index", {
			students,
			dbType: usingMongoDB ? "MongoDB" : "In-Memory",
			dbStatus: usingMongoDB ? "🟢 Connected" : "🟡 Fallback Mode",
		});
	} catch (error) {
		console.error("Error fetching students:", error);
		res.status(500).send("Error fetching students");
	}
});

app.post("/add", async (req, res) => {
	try {
		const { name, rollNo, className } = req.body;
		await dbOps.create({ name, rollNo, className });
		res.redirect("/");
	} catch (error) {
		console.error("Error adding student:", error);
		res.status(500).send("Error adding student");
	}
});

app.get("/edit/:id", async (req, res) => {
	try {
		const student = await dbOps.findById(req.params.id);
		if (!student) {
			return res.status(404).send("Student not found");
		}
		res.render("edit", { student });
	} catch (error) {
		console.error("Error fetching student:", error);
		res.status(500).send("Error fetching student");
	}
});

app.post("/edit/:id", async (req, res) => {
	try {
		const { name, rollNo, className } = req.body;
		await dbOps.updateById(req.params.id, { name, rollNo, className });
		res.redirect("/");
	} catch (error) {
		console.error("Error updating student:", error);
		res.status(500).send("Error updating student");
	}
});

app.post("/delete/:id", async (req, res) => {
	try {
		await dbOps.deleteById(req.params.id);
		res.redirect("/");
	} catch (error) {
		console.error("Error deleting student:", error);
		res.status(500).send("Error deleting student");
	}
});

app.listen(PORT, () => {
	console.log(`🚀 Admin panel running at http://localhost:${PORT}`);
	console.log(`📊 Database: ${usingMongoDB ? "MongoDB" : "In-Memory Storage"}`);
	if (!usingMongoDB) {
		console.log(`💡 To enable MongoDB: Update MONGODB_URI and restart server`);
	}
});

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const PORT = process.env.PORT || 3003;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));

// MongoDB Configuration - Update this with your MongoDB connection
const MONGODB_URI =
	process.env.MONGODB_URI ||
	"mongodb+srv://ajyadodiya2003_db_user:BmyzQqH4IkL0KoBC@cluster0.9buuyst.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// For MongoDB Atlas: "mongodb+srv://username:password@cluster.mongodb.net/tuition_db"

// Fallback in-memory storage
let students = [
	{ _id: "1", name: "John Doe", rollNo: "001", className: "Class 10" },
	{ _id: "2", name: "Jane Smith", rollNo: "002", className: "Class 9" },
	{ _id: "3", name: "Mike Johnson", rollNo: "003", className: "Class 11" },
];
let nextId = 4;
let usingMongoDB = false;

// Student Schema
const studentSchema = new mongoose.Schema({
	name: { type: String, required: true },
	rollNo: { type: String, required: true },
	className: { type: String, required: true },
});

const Student = mongoose.model("Student", studentSchema);

// Try MongoDB connection with fallback
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
		console.log("   💡 To use MongoDB: Install locally or use MongoDB Atlas");
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
	findAll: async () =>
		usingMongoDB ? await Student.find() : await inMemoryOps.findAll(),
	create: async (data) =>
		usingMongoDB ? await Student.create(data) : await inMemoryOps.create(data),
	findById: async (id) =>
		usingMongoDB ? await Student.findById(id) : await inMemoryOps.findById(id),
	updateById: async (id, data) =>
		usingMongoDB
			? await Student.findByIdAndUpdate(id, data, { new: true })
			: await inMemoryOps.updateById(id, data),
	deleteById: async (id) =>
		usingMongoDB
			? await Student.findByIdAndDelete(id)
			: await inMemoryOps.deleteById(id),
};

// Home - List students
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

// Add student
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

// Edit student form
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

// Update student
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

// Delete student
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
		console.log(`💡 To enable MongoDB: Install locally or use MongoDB Atlas`);
	}
});

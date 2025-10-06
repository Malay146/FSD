// MongoDB Atlas Connection Example for Practical_17

// Replace the connection string in server.js with MongoDB Atlas

// Current connection (local):
// mongoose.connect("mongodb://localhost:27017/tuition_db", {

// Replace with Atlas connection:
mongoose
	.connect(
		"mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/tuition_db",
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
		}
	)
	.then(() => {
		console.log("Connected to MongoDB Atlas successfully!");
	})
	.catch((err) => {
		console.error("MongoDB Atlas connection error:", err);
		process.exit(1);
	});

// Steps to get Atlas connection string:
// 1. Go to https://www.mongodb.com/atlas
// 2. Sign up for free account
// 3. Create a new cluster (free tier)
// 4. Click "Connect" -> "Connect your application"
// 5. Copy the connection string
// 6. Replace <password> with your actual password
// 7. Replace <dbname> with "tuition_db"

const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
	try {
		// Get token from header
		const token = req.header("Authorization")?.replace("Bearer ", "");

		if (!token) {
			return res.status(401).json({
				error: "Access denied. No token provided.",
			});
		}

		// Verify token
		const decoded = jwt.verify(
			token,
			process.env.JWT_SECRET || "fallback-secret"
		);

		// Find user
		const user = await User.findById(decoded.userId);
		if (!user) {
			return res.status(401).json({
				error: "Invalid token. User not found.",
			});
		}

		if (!user.isActive) {
			return res.status(401).json({
				error: "Account is deactivated.",
			});
		}

		// Add user to request
		req.user = decoded;
		req.userDoc = user;

		next();
	} catch (error) {
		console.error("Auth middleware error:", error);

		if (error.name === "JsonWebTokenError") {
			return res.status(401).json({
				error: "Invalid token.",
			});
		}

		if (error.name === "TokenExpiredError") {
			return res.status(401).json({
				error: "Token expired.",
			});
		}

		res.status(500).json({
			error: "Authentication failed.",
			message: error.message,
		});
	}
};

module.exports = auth;

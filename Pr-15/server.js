const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const app = express();
const PORT = process.env.PORT || 3002;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
	session({
		secret: "library_secret_key",
		resave: false,
		saveUninitialized: true,
		cookie: { maxAge: 60 * 60 * 1000 }, // 1 hour
	})
);

// Show login page
app.get("/", (req, res) => {
	res.render("login", { error: null });
});

// Handle login
app.post("/login", (req, res) => {
	const { username } = req.body;
	if (!username || username.trim().length === 0) {
		return res.render("login", { error: "Please enter your name!" });
	}
	req.session.username = username.trim();
	req.session.loginTime = new Date().toLocaleString();
	res.redirect("/profile");
});

// Show profile page with session info
app.get("/profile", (req, res) => {
	if (!req.session.username) {
		return res.redirect("/");
	}
	res.render("profile", {
		username: req.session.username,
		loginTime: req.session.loginTime,
	});
});

// Handle logout
app.post("/logout", (req, res) => {
	req.session.destroy(() => {
		res.redirect("/");
	});
});

app.listen(PORT, () => {
	console.log(`Library Portal running at http://localhost:${PORT}`);
});

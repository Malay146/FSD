const express = require("express");
const nodemailer = require("nodemailer");
const path = require("path");
const app = express();
const PORT = 3008;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure your email credentials here
const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: "krishilagrawal026@gmail.com", // Replace with your email
		pass: "lhgz unyx uycz rymk", // Replace with your app password
	},
});

function validateForm({ name, email, message }) {
	const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
	if (!name || name.length < 2) return "Name is required.";
	if (!email || !emailRegex.test(email)) return "Valid email is required.";
	if (!message || message.length < 10)
		return "Message must be at least 10 characters.";
	return null;
}

app.post("/contact", async (req, res) => {
	const { name, email, message } = req.body;
	const error = validateForm({ name, email, message });
	if (error) {
		return res.status(400).json({ success: false, message: error });
	}
	try {
		const mailOptions = {
			from: "krishilagrawal026@gmail.com", // Your Gmail address
			replyTo: email, // User's email for replies
			to: "krishilagrawal026@gmail.com", // Where you want to receive messages
			subject: `Portfolio Contact from ${name}`,
			html: `
        <h3>New Contact Form Message</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
			text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
		};

		const info = await transporter.sendMail(mailOptions);
		console.log("Email sent successfully:", info.messageId);
		res.json({ success: true, message: "Message sent successfully!" });
	} catch (err) {
		console.error("Email sending error:", err);
		res
			.status(500)
			.json({
				success: false,
				message: "Failed to send message. Please try again.",
			});
	}
});

app.listen(PORT, () => {
	console.log(`Portfolio server running on http://localhost:${PORT}`);
});

const express = require('express');
const homeRoute = require('./routes/home');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware (ready for future use)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/home', homeRoute);

// Default root route
app.get('/', (req, res) => {
  res.send('<h1>Welcome! Go to <a href="/home">/home</a> for your dashboard.</h1>');
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

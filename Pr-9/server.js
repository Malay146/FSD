const express = require('express');
const homeRoute = require('./routes/home');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for JSON parsing (for future use)
app.use(express.json());

// Routes
app.use('/', homeRoute);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});

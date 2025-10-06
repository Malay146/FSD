const express = require('express');
const router = express.Router();

// GET / - Home Route
router.get('/', (req, res) => {
  res.send('Welcome to our site');
});

module.exports = router;

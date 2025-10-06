const express = require('express');
const router = express.Router();

// GET /home
router.get('/', (req, res) => {
  res.send('<h1>Hello, welcome to your dashboard!</h1>');
});

module.exports = router;
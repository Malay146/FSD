const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Route to display logs
app.get('/logs', (req, res) => {
  const logFilePath = path.join(__dirname, 'logs', 'errors.txt');

  fs.readFile(logFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading log file:', err.message);
      return res.status(500).send(`
        <h1>Error Loading Logs</h1>
        <p>Could not access the log file. It may be missing or locked.</p>
      `);
    }

    res.send(`
      <h1>Server Error Logs</h1>
      <pre>${data}</pre>
    `);
  });
});

// Home route
app.get('/', (req, res) => {
  res.send('<h1>Welcome to Log Viewer</h1><p>Go to <a href="/logs">/logs</a> to see logs.</p>');
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Log Viewer running at http://localhost:${PORT}`);
});

const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/') // Files will be stored in uploads directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

// File filter to check file type and size
const fileFilter = (req, file, cb) => {
  // Check file type
  if (file.mimetype !== 'application/pdf') {
    return cb(new Error('Only PDF files are allowed!'), false);
  }
  
  // Check file size (2MB = 2 * 1024 * 1024 bytes)
  if (file.size > 2 * 1024 * 1024) {
    return cb(new Error('File size cannot exceed 2MB!'), false);
  }
  
  cb(null, true);
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB in bytes
  }
});

// Serve HTML form
app.get('/', (req, res) => {
  res.send(`
    <form action="/upload" method="post" enctype="multipart/form-data">
      <input type="file" name="resume" accept=".pdf">
      <button type="submit">Upload Resume</button>
    </form>
  `);
});

// Handle file upload
app.post('/upload', (req, res) => {
  upload.single('resume')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File size cannot exceed 2MB' });
      }
      return res.status(400).json({ error: err.message });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }
    
    res.json({ message: 'File uploaded successfully!' });
  });
});

// Create uploads directory if it doesn't exist
const fs = require('fs');
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
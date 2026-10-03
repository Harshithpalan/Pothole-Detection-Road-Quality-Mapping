const express = require('express');
const cors = require('cors');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const { initializeDatabase, addPotholeReport, getPotholeReports, deletePotholeReport } = require('./database');
const { detectPothole } = require('./detector');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Initialize database
initializeDatabase();

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Get all pothole reports
app.get('/api/potholes', async (req, res) => {
  try {
    const reports = await getPotholeReports();
    res.json(reports);
  } catch (error) {
    console.error('Error fetching pothole reports:', error);
    res.status(500).json({ error: 'Failed to fetch pothole reports' });
  }
});

// Upload image and detect pothole
app.post('/api/detect', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    const { latitude, longitude, severity } = req.body;

    // Detect pothole using AI/ML model
    const detectionResult = await detectPothole(req.file.path);

    // Save to database if pothole detected or manually reported
    const reportId = await addPotholeReport({
      imagePath: req.file.filename,
      latitude: parseFloat(latitude) || detectionResult.latitude || 0,
      longitude: parseFloat(longitude) || detectionResult.longitude || 0,
      severity: severity || detectionResult.severity || 'medium',
      confidence: detectionResult.confidence || 0,
      isDetected: detectionResult.detected || false,
      timestamp: new Date().toISOString()
    });

    res.json({
      success: true,
      reportId,
      detection: detectionResult,
      imageUrl: `/uploads/${req.file.filename}`
    });
  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).json({ error: 'Failed to process image' });
  }
});

// Delete pothole report
app.delete('/api/potholes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await deletePotholeReport(id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting pothole report:', error);
    res.status(500).json({ error: 'Failed to delete pothole report' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});

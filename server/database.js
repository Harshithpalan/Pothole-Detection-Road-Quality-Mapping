const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'potholes.db');
let db;

// Initialize database
function initializeDatabase() {
  db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('Error opening database:', err);
    } else {
      console.log('Connected to SQLite database');
      createTables();
    }
  });
}

// Create tables
function createTables() {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS pothole_reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      image_path TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      severity TEXT NOT NULL,
      confidence REAL DEFAULT 0,
      is_detected BOOLEAN DEFAULT 0,
      timestamp TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  db.run(createTableSQL, (err) => {
    if (err) {
      console.error('Error creating table:', err);
    } else {
      console.log('Database table ready');
    }
  });
}

// Add pothole report
function addPotholeReport(report) {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO pothole_reports (image_path, latitude, longitude, severity, confidence, is_detected, timestamp)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    db.run(sql, [
      report.imagePath,
      report.latitude,
      report.longitude,
      report.severity,
      report.confidence,
      report.isDetected ? 1 : 0,
      report.timestamp
    ], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.lastID);
      }
    });
  });
}

// Get all pothole reports
function getPotholeReports() {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM pothole_reports ORDER BY created_at DESC';
    
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

// Delete pothole report
function deletePotholeReport(id) {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM pothole_reports WHERE id = ?';
    
    db.run(sql, [id], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

module.exports = {
  initializeDatabase,
  addPotholeReport,
  getPotholeReports,
  deletePotholeReport
};

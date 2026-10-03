# Pothole Detection & Road Quality Mapping

A web application for detecting potholes in road images using AI/ML and visualizing them on an interactive map.

## Features

- 🤖 **AI-Powered Detection**: Upload road images to detect potholes using machine learning
- 🗺️ **Interactive Map**: View all reported potholes on a Leaflet map with OpenStreetMap
- 📍 **GPS Integration**: Automatically get your current location for reporting
- 📊 **Severity Levels**: Classify potholes by severity (low, medium, high)
- 💾 **Data Persistence**: Store reports in SQLite database
- 🎨 **Modern UI**: Clean, responsive React interface

## Tech Stack

### Frontend
- React with Vite
- Leaflet (mapping)
- React-Leaflet
- Axios

### Backend
- Node.js
- Express
- SQLite
- Multer (file uploads)
- Sharp (image processing)

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd "Pothole Detection + Road Quality Mapping"
```

2. Install dependencies:
```bash
npm run install-all
```

Or install separately:
```bash
npm install
cd server && npm install
cd ../client && npm install
```

## Running the Application

### Development Mode

Run both frontend and backend simultaneously:
```bash
npm run dev
```

Or run separately:

Backend (port 5000):
```bash
cd server
npm run dev
```

Frontend (port 5173):
```bash
cd client
npm run dev
```

### Production Mode

Build the frontend:
```bash
cd client
npm run build
```

Start the backend:
```bash
cd server
npm start
```

Serve the built frontend with your preferred web server (nginx, Apache, etc.)

## Usage

1. Open the application in your browser (http://localhost:5173 in development)
2. Click "📍 Get My Location" to automatically get your GPS coordinates
3. Upload a road image
4. Select severity level (optional)
5. Click "🔍 Detect Pothole" to analyze the image
6. View detected potholes on the map
7. Click on markers to see details and images

## API Endpoints

### GET /api/health
Health check endpoint

### GET /api/potholes
Get all pothole reports

### POST /api/detect
Upload image and detect pothole
- Body: FormData with `image`, `latitude`, `longitude`, `severity`

### DELETE /api/potholes/:id
Delete a pothole report

## AI/ML Detection

The current implementation uses a placeholder detection algorithm. For production use, you should:

1. Train a custom model using TensorFlow.js, PyTorch, or OpenCV
2. Replace the placeholder logic in `server/detector.js` with actual model inference
3. Consider using pre-trained models like:
   - YOLO (You Only Look Once)
   - SSD (Single Shot Detector)
   - Custom CNN trained on pothole dataset

## Project Structure

```
pothole-detection-app/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── MapView.jsx
│   │   │   └── UploadForm.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.css
│   └── package.json
├── server/                # Node.js backend
│   ├── server.js         # Express server
│   ├── database.js       # SQLite database operations
│   ├── detector.js       # AI/ML detection logic
│   ├── uploads/          # Uploaded images
│   └── package.json
├── package.json          # Root package.json
└── README.md
```

## Customization

### Change Default Map Location
Edit `client/src/components/MapView.jsx`:
```javascript
const defaultCenter = [40.7128, -74.0060]; // Change to your desired location
```

### Database Schema
The SQLite database schema is defined in `server/database.js`. Modify the `createTables` function to add more fields.

### Detection Algorithm
Replace the placeholder in `server/detector.js` with your trained ML model.

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

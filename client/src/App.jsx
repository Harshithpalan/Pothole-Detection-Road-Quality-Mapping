import { useState, useEffect } from 'react';
import MapView from './components/MapView';
import UploadForm from './components/UploadForm';
import './App.css';

function App() {
  const [potholes, setPotholes] = useState([]);
  const [selectedPothole, setSelectedPothole] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_URL = 'http://localhost:5000/api';

  // Fetch all pothole reports on load
  useEffect(() => {
    fetchPotholes();
  }, []);

  const fetchPotholes = async () => {
    try {
      const response = await fetch(`${API_URL}/potholes`);
      const data = await response.json();
      setPotholes(data);
    } catch (error) {
      console.error('Error fetching potholes:', error);
    }
  };

  const handleUpload = async (formData) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/detect`, {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Refresh potholes list
        await fetchPotholes();
        alert(`Pothole detection complete! Confidence: ${result.detection.confidence * 100}%`);
      } else {
        alert('Failed to process image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this report?')) {
      return;
    }

    try {
      await fetch(`${API_URL}/potholes/${id}`, {
        method: 'DELETE',
      });
      
      setPotholes(potholes.filter(p => p.id !== id));
      setSelectedPothole(null);
    } catch (error) {
      console.error('Error deleting pothole:', error);
      alert('Failed to delete pothole report');
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🛣️ Pothole Detection & Road Quality Mapping</h1>
        <p>Upload road images to detect potholes using AI and report them on the map</p>
      </header>

      <div className="app-content">
        <div className="sidebar">
          <UploadForm onUpload={handleUpload} loading={loading} />
          
          <div className="stats">
            <h3>Statistics</h3>
            <div className="stat-item">
              <span className="stat-label">Total Reports:</span>
              <span className="stat-value">{potholes.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">AI Detected:</span>
              <span className="stat-value">{potholes.filter(p => p.is_detected).length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">High Severity:</span>
              <span className="stat-value">{potholes.filter(p => p.severity === 'high').length}</span>
            </div>
          </div>

          {selectedPothole && (
            <div className="selected-pothole">
              <h3>Selected Report</h3>
              <img 
                src={`http://localhost:5000/uploads/${selectedPothole.image_path}`} 
                alt="Pothole" 
                className="pothole-image"
              />
              <div className="pothole-details">
                <p><strong>Severity:</strong> {selectedPothole.severity}</p>
                <p><strong>Confidence:</strong> {(selectedPothole.confidence * 100).toFixed(1)}%</p>
                <p><strong>Detected by AI:</strong> {selectedPothole.is_detected ? 'Yes' : 'No'}</p>
                <p><strong>Coordinates:</strong> {selectedPothole.latitude.toFixed(6)}, {selectedPothole.longitude.toFixed(6)}</p>
                <p><strong>Date:</strong> {new Date(selectedPothole.timestamp).toLocaleString()}</p>
                <button 
                  className="delete-btn"
                  onClick={() => handleDelete(selectedPothole.id)}
                >
                  Delete Report
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="map-container">
          <MapView 
            potholes={potholes} 
            onPotholeSelect={setSelectedPothole}
            selectedPothole={selectedPothole}
          />
        </div>
      </div>
    </div>
  );
}

export default App;

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';

// Fix for default marker icon in Leaflet with React
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons for different severity levels
const getSeverityIcon = (severity) => {
  const colors = {
    low: '#4CAF50',
    medium: '#FF9800',
    high: '#F44336'
  };
  
  return new Icon({
    iconUrl: `data:image/svg+xml;charset=UTF-8,%3csvg width='30' height='30' viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3ccircle cx='15' cy='15' r='12' fill='${encodeURIComponent(colors[severity])}' stroke='white' stroke-width='2'/%3e%3c/svg%3e`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15],
  });
};

// Component to update map view when pothole is selected
function MapUpdater({ selectedPothole }) {
  const map = useMap();

  useEffect(() => {
    if (selectedPothole) {
      map.setView([selectedPothole.latitude, selectedPothole.longitude], 16);
    }
  }, [selectedPothole, map]);

  return null;
}

function MapView({ potholes, onPotholeSelect, selectedPothole }) {
  // Default center (can be changed to user's location)
  const defaultCenter = [40.7128, -74.0060]; // New York City

  return (
    <div className="map-wrapper">
      <MapContainer 
        center={defaultCenter} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapUpdater selectedPothole={selectedPothole} />
        
        {potholes.map((pothole) => (
          <Marker
            key={pothole.id}
            position={[pothole.latitude, pothole.longitude]}
            icon={getSeverityIcon(pothole.severity)}
            eventHandlers={{
              click: () => onPotholeSelect(pothole),
            }}
          >
            <Popup>
              <div className="popup-content">
                <strong>Severity: {pothole.severity}</strong>
                <br />
                Confidence: {(pothole.confidence * 100).toFixed(1)}%
                <br />
                {pothole.is_detected ? '🤖 AI Detected' : '👤 Manual Report'}
                <br />
                <img 
                  src={`http://localhost:5000/uploads/${pothole.image_path}`}
                  alt="Pothole"
                  style={{ width: '150px', height: 'auto', marginTop: '5px' }}
                />
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default MapView;

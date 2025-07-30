import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { RefreshCw, MapPin, Thermometer, Droplets, Clock, Zap } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface CityData {
  name: string;
  lat: number;
  lng: number;
  aqi: number;
  quality: string;
  pm25: number;
  pm10: number;
  o3: number;
  no2: number;
  so2: number;
  co: number;
  temperature: number;
  humidity: number;
  lastUpdated: string;
  source: string;
}

interface LeafletMapProps {
  selectedCity: string;
  onCitySelect: (city: string) => void;
}

const LeafletMap: React.FC<LeafletMapProps> = ({ selectedCity, onCitySelect }) => {
  const [cities, setCities] = useState<CityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return '#22C55E';
    if (aqi <= 100) return '#EAB308';
    if (aqi <= 150) return '#F97316';
    if (aqi <= 200) return '#EF4444';
    return '#8B5CF6';
  };

  const createCustomIcon = (aqi: number, isSelected: boolean, isHovered: boolean) => {
    const color = getAQIColor(aqi);
    const size = isSelected ? 45 : isHovered ? 35 : 30;
    
    return L.divIcon({
      className: 'custom-aqi-marker',
      html: `
        <div style="
          width: ${size}px;
          height: ${size}px;
          background: ${color};
          border: 3px solid white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          color: white;
          font-size: ${isSelected ? '14px' : isHovered ? '12px' : '10px'};
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          transition: all 0.3s ease;
          ${isSelected ? 'animation: pulse 2s infinite;' : ''}
          ${isHovered ? 'transform: scale(1.1);' : ''}
        ">${aqi}</div>
        <style>
          @keyframes pulse {
            0% { box-shadow: 0 0 0 0 ${color}60; }
            70% { box-shadow: 0 0 0 15px ${color}00; }
            100% { box-shadow: 0 0 0 0 ${color}00; }
          }
        </style>
      `,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    });
  };

  const fetchCitiesData = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/cities');
      const data = await response.json();
      setCities(data);
      setLastUpdated(new Date());
      console.log('✅ Fetched real-time data for', data.length, 'cities');
    } catch (error) {
      console.error('Failed to fetch cities data:', error);
      // Fallback to mock data if API is not available
      setCities([
        { name: 'Delhi', lat: 28.6139, lng: 77.2090, aqi: 168, quality: 'Unhealthy', pm25: 101, pm10: 134, o3: 67, no2: 50, so2: 34, co: 17, temperature: 32, humidity: 65, lastUpdated: new Date().toISOString(), source: 'Mock Data' },
        { name: 'Mumbai', lat: 19.0760, lng: 72.8777, aqi: 95, quality: 'Moderate', pm25: 57, pm10: 76, o3: 38, no2: 29, so2: 19, co: 10, temperature: 28, humidity: 78, lastUpdated: new Date().toISOString(), source: 'Mock Data' },
        { name: 'Hyderabad', lat: 17.3850, lng: 78.4867, aqi: 92, quality: 'Moderate', pm25: 55, pm10: 74, o3: 37, no2: 28, so2: 18, co: 9, temperature: 30, humidity: 62, lastUpdated: new Date().toISOString(), source: 'Mock Data' },
        { name: 'Chennai', lat: 13.0827, lng: 80.2707, aqi: 78, quality: 'Moderate', pm25: 47, pm10: 62, o3: 31, no2: 23, so2: 16, co: 8, temperature: 35, humidity: 68, lastUpdated: new Date().toISOString(), source: 'Mock Data' },
        { name: 'Bengaluru', lat: 12.9716, lng: 77.5946, aqi: 85, quality: 'Moderate', pm25: 51, pm10: 68, o3: 34, no2: 26, so2: 17, co: 9, temperature: 26, humidity: 55, lastUpdated: new Date().toISOString(), source: 'Mock Data' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCitiesData();
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchCitiesData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const MapUpdater = () => {
    const map = useMap();
    
    useEffect(() => {
      const selectedCityData = cities.find(city => city.name === selectedCity);
      if (selectedCityData) {
        map.setView([selectedCityData.lat, selectedCityData.lng], 8, { animate: true });
      }
    }, [selectedCity, cities, map]);
    
    return null;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Loading Real-time Map</h3>
            <p className="text-gray-600">Fetching live AQI data from 20 Indian cities...</p>
            <div className="flex items-center justify-center gap-2 mt-3">
              <Zap className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-blue-600">Powered by Ambee API</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 relative z-10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <MapPin className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-800">Live India Air Quality Map</h3>
          <div className="flex items-center gap-2 px-3 py-1 bg-green-100 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-700">Real-time Data</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 rounded-full">
            <Zap className="w-3 h-3 text-blue-600" />
            <span className="text-xs font-medium text-blue-700">Ambee API</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">
            Updated: {lastUpdated.toLocaleTimeString()}
          </span>
          <button
            onClick={fetchCitiesData}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 text-blue-600 ${loading ? 'animate-spin' : ''}`} />
            <span className="text-sm font-medium text-blue-700">Refresh</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm mb-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-gray-600">Good (≤50)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <span className="text-gray-600">Moderate (51-100)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
          <span className="text-gray-600">Unhealthy (101-150)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span className="text-gray-600">Very Unhealthy (150)</span>
        </div>
      </div>
      
      <div className="h-96 rounded-xl overflow-hidden border border-gray-200">
        <MapContainer
          center={[20.5937, 78.9629]} // Center of India
          zoom={5}
          style={{ height: '100%', width: '100%' }}
          className="rounded-xl"
          zoomControl={true}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <MapUpdater />
          
          {cities.map((city) => (
            <Marker
              key={city.name}
              position={[city.lat, city.lng]}
              icon={createCustomIcon(city.aqi, selectedCity === city.name, hoveredCity === city.name)}
              eventHandlers={{
                click: () => onCitySelect(city.name),
                mouseover: () => setHoveredCity(city.name),
                mouseout: () => setHoveredCity(null),
              }}
            >
              <Popup className="custom-popup">
                <div className="p-4 min-w-72">
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-6 h-6 rounded-full shadow-lg"
                      style={{ backgroundColor: getAQIColor(city.aqi) }}
                    ></div>
                    <div>
                      <h4 className="font-bold text-gray-800 text-lg">{city.name}</h4>
                      <p className="text-sm text-gray-500">{city.quality}</p>
                    </div>
                    <div className="ml-auto">
                      <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 rounded-full">
                        <Zap className="w-3 h-3 text-blue-600" />
                        <span className="text-xs text-blue-700">{city.source}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Coordinates Display */}
                  <div className="bg-blue-50 p-3 rounded-lg mb-4 border border-blue-100">
                    <h5 className="font-semibold text-blue-800 mb-2">📍 Coordinates</h5>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-blue-600">Latitude:</span>
                        <p className="font-mono font-semibold text-blue-800">{city.lat.toFixed(4)}°</p>
                      </div>
                      <div>
                        <span className="text-blue-600">Longitude:</span>
                        <p className="font-mono font-semibold text-blue-800">{city.lng.toFixed(4)}°</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">AQI:</span>
                        <span className="font-semibold text-gray-800">{city.aqi}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">PM2.5:</span>
                        <span className="font-semibold text-gray-800">{city.pm25}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">PM10:</span>
                        <span className="font-semibold text-gray-800">{city.pm10}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">O₃:</span>
                        <span className="font-semibold text-gray-800">{city.o3}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">NO₂:</span>
                        <span className="font-semibold text-gray-800">{city.no2}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">SO₂:</span>
                        <span className="font-semibold text-gray-800">{city.so2}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                      <Thermometer className="w-4 h-4 text-orange-500" />
                      <span className="text-sm font-medium">{city.temperature}°C</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Droplets className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-medium">{city.humidity}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-xs text-gray-500">
                        {new Date(city.lastUpdated).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          🌍 Real-time data from Ambee API • {cities.length} cities monitored • Click markers for details • Hover to see coordinates
        </p>
      </div>
    </div>
  );
};

export default LeafletMap;
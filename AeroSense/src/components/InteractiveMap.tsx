import React, { useState, useEffect } from 'react';
import { MapPin, Loader2, RefreshCw, Zap } from 'lucide-react';

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
}

interface InteractiveMapProps {
  selectedCity: string;
  onCitySelect: (city: string) => void;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ selectedCity, onCitySelect }) => {
  const [cities, setCities] = useState<CityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Mock API data - In production, this would be real API calls
  const fetchCityData = async (): Promise<CityData[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return [
      { name: 'Delhi', lat: 28.6139, lng: 77.2090, aqi: 4, quality: 'Unhealthy', pm25: 101, pm10: 134, o3: 67, no2: 50, so2: 34, co: 17 },
      { name: 'Mumbai', lat: 19.0760, lng: 72.8777, aqi: 95, quality: 'Moderate', pm25: 57, pm10: 76, o3: 38, no2: 29, so2: 19, co: 10 },
      { name: 'Kolkata', lat: 22.5726, lng: 88.3639, aqi: 142, quality: 'Unhealthy for Sensitive Groups', pm25: 85, pm10: 114, o3: 57, no2: 43, so2: 28, co: 14 },
      { name: 'Chennai', lat: 13.0827, lng: 80.2707, aqi: 78, quality: 'Moderate', pm25: 47, pm10: 62, o3: 31, no2: 23, so2: 16, co: 8 },
      { name: 'Bangalore', lat: 12.9716, lng: 77.5946, aqi: 85, quality: 'Moderate', pm25: 51, pm10: 68, o3: 34, no2: 26, so2: 17, co: 9 },
      { name: 'Hyderabad', lat: 17.3850, lng: 78.4867, aqi: 92, quality: 'Moderate', pm25: 55, pm10: 74, o3: 37, no2: 28, so2: 18, co: 9 },
      { name: 'Pune', lat: 18.5204, lng: 73.8567, aqi: 88, quality: 'Moderate', pm25: 53, pm10: 70, o3: 35, no2: 26, so2: 18, co: 9 },
      { name: 'Ahmedabad', lat: 23.0225, lng: 72.5714, aqi: 125, quality: 'Unhealthy for Sensitive Groups', pm25: 75, pm10: 100, o3: 50, no2: 38, so2: 25, co: 13 },
      { name: 'Jaipur', lat: 26.9124, lng: 75.7873, aqi: 135, quality: 'Unhealthy for Sensitive Groups', pm25: 81, pm10: 108, o3: 54, no2: 41, so2: 27, co: 14 },
      { name: 'Lucknow', lat: 26.8467, lng: 80.9462, aqi: 158, quality: 'Unhealthy', pm25: 95, pm10: 126, o3: 63, no2: 47, so2: 32, co: 16 },
      { name: 'Kanpur', lat: 26.4499, lng: 80.3319, aqi: 172, quality: 'Unhealthy', pm25: 103, pm10: 138, o3: 69, no2: 52, so2: 34, co: 17 },
      { name: 'Nagpur', lat: 21.1458, lng: 79.0882, aqi: 98, quality: 'Moderate', pm25: 59, pm10: 78, o3: 39, no2: 29, so2: 20, co: 10 },
      { name: 'Indore', lat: 22.7196, lng: 75.8577, aqi: 105, quality: 'Unhealthy for Sensitive Groups', pm25: 63, pm10: 84, o3: 42, no2: 32, so2: 21, co: 11 },
      { name: 'Bhopal', lat: 23.2599, lng: 77.4126, aqi: 112, quality: 'Unhealthy for Sensitive Groups', pm25: 67, pm10: 90, o3: 45, no2: 34, so2: 22, co: 11 },
      { name: 'Visakhapatnam', lat: 17.6868, lng: 83.2185, aqi: 82, quality: 'Moderate', pm25: 49, pm10: 66, o3: 33, no2: 25, so2: 16, co: 8 },
    ];
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await fetchCityData();
        setCities(data);
        setLastUpdated(new Date());
      } catch (error) {
        console.error('Failed to fetch city data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const refreshData = async () => {
    setLoading(true);
    try {
      const data = await fetchCityData();
      setCities(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to refresh city data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return '#22C55E';
    if (aqi <= 100) return '#EAB308';
    if (aqi <= 150) return '#F97316';
    if (aqi <= 200) return '#EF4444';
    return '#8B5CF6';
  };

  const convertToMapCoordinates = (lat: number, lng: number) => {
    // Convert lat/lng to SVG coordinates (simplified projection)
    const x = ((lng - 68) / (97 - 68)) * 600 + 100;
    const y = ((37 - lat) / (37 - 6)) * 400 + 100;
    return { x, y };
  };

  const handleMouseEnter = (city: CityData, event: React.MouseEvent) => {
    setHoveredCity(city.name);
    setShowTooltip(true);
    setTooltipPosition({ x: event.clientX, y: event.clientY });
  };

  const handleMouseLeave = () => {
    setHoveredCity(null);
    setShowTooltip(false);
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (showTooltip) {
      setTooltipPosition({ x: event.clientX, y: event.clientY });
    }
  };

  const hoveredCityData = hoveredCity ? cities.find(c => c.name === hoveredCity) : null;

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="relative w-20 h-20 mx-auto mb-6">
              {/* Spinning globe effect */}
              <div className="absolute inset-0 border-4 border-blue-200 rounded-full animate-spin"></div>
              <div className="absolute inset-2 border-4 border-purple-200 rounded-full animate-spin animate-reverse"></div>
              <div className="absolute inset-4 border-4 border-green-200 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <MapPin className="w-8 h-8 text-blue-600 animate-pulse" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Loading Interactive Map</h3>
            <p className="text-gray-600 mb-4">Fetching real-time air quality data...</p>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 relative">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <MapPin className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-800">Live India Air Quality Map</h3>
          <div className="flex items-center gap-2 px-3 py-1 bg-green-100 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-700">Live Data</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">
            Updated: {lastUpdated.toLocaleTimeString()}
          </span>
          <button
            onClick={refreshData}
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
          <span className="text-gray-600">Very Unhealthy (&gt;150)</span>
        </div>
      </div>
      
      <div className="relative bg-gradient-to-br from-blue-50 to-green-50 rounded-xl p-4 overflow-hidden">
        <svg
          viewBox="0 0 800 600"
          className="w-full h-96"
          onMouseMove={handleMouseMove}
        >
          {/* India Map Outline */}
          <defs>
            <pattern id="mapGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="0.5"/>
            </pattern>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          <rect width="800" height="600" fill="url(#mapGrid)"/>
          
          {/* India outline */}
          <path
            d="M200 150 Q250 120 300 110 Q350 100 400 95 Q450 90 500 85 Q550 90 600 100 Q650 120 680 150 Q700 180 720 220 Q730 260 735 300 Q730 340 720 380 Q700 420 680 450 Q650 480 600 500 Q550 510 500 515 Q450 520 400 525 Q350 530 300 535 Q250 530 200 520 Q150 500 120 470 Q100 430 90 390 Q85 350 90 310 Q100 270 120 230 Q150 190 200 150 Z"
            fill="rgba(34, 197, 94, 0.1)"
            stroke="rgba(34, 197, 94, 0.4)"
            strokeWidth="2"
            className="drop-shadow-sm"
          />
          
          {/* State boundaries */}
          <g stroke="rgba(59, 130, 246, 0.3)" strokeWidth="1" fill="none">
            <path d="M200 150 L350 140 L380 200 L350 250 L280 240 L200 220 Z" />
            <path d="M280 240 L450 250 L480 350 L400 380 L320 370 L280 320 Z" />
            <path d="M320 370 L480 380 L500 450 L420 480 L350 470 L320 420 Z" />
            <path d="M420 480 L500 490 L520 550 L450 570 L400 560 L420 520 Z" />
            <path d="M450 380 L550 390 L570 450 L500 470 L450 450 Z" />
            <path d="M500 250 L580 260 L590 320 L550 350 L500 340 Z" />
            <path d="M550 200 L620 210 L630 280 L580 290 L550 270 Z" />
            <path d="M350 140 L500 130 L520 200 L450 220 L380 210 Z" />
            <path d="M350 210 L500 200 L520 280 L450 300 L380 290 Z" />
            <path d="M200 220 L350 210 L380 290 L320 320 L250 310 L200 280 Z" />
          </g>
          
          {/* City Markers */}
          {cities.map((city) => {
            const coords = convertToMapCoordinates(city.lat, city.lng);
            const isSelected = selectedCity === city.name;
            const isHovered = hoveredCity === city.name;
            const color = getAQIColor(city.aqi);
            
            return (
              <g key={city.name}>
                {/* Pulse animation for selected city */}
                {isSelected && (
                  <circle
                    cx={coords.x}
                    cy={coords.y}
                    r="25"
                    fill={color}
                    opacity="0.3"
                    className="animate-ping"
                  />
                )}
                
                {/* City marker with glow effect */}
                <circle
                  cx={coords.x}
                  cy={coords.y}
                  r={isSelected ? "14" : isHovered ? "12" : "10"}
                  fill={color}
                  stroke="white"
                  strokeWidth="3"
                  className="cursor-pointer transition-all duration-200 hover:stroke-4"
                  filter="url(#glow)"
                  onMouseEnter={(e) => handleMouseEnter(city, e)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => onCitySelect(city.name)}
                />
                
                {/* AQI value */}
                <text
                  x={coords.x}
                  y={coords.y + 1}
                  textAnchor="middle"
                  className="text-xs font-bold fill-white pointer-events-none select-none"
                  style={{ fontSize: isSelected ? '11px' : '9px' }}
                >
                  {city.aqi}
                </text>
                
                {/* City name with background */}
                <rect
                  x={coords.x - 30}
                  y={coords.y + (isSelected ? 20 : 16)}
                  width="60"
                  height="18"
                  fill="rgba(255, 255, 255, 0.95)"
                  rx="9"
                  className="pointer-events-none drop-shadow-sm"
                />
                <text
                  x={coords.x}
                  y={coords.y + (isSelected ? 32 : 28)}
                  textAnchor="middle"
                  className="text-xs font-medium fill-gray-700 pointer-events-none select-none"
                  style={{ fontSize: isSelected ? '11px' : '9px' }}
                >
                  {city.name}
                </text>
              </g>
            );
          })}
        </svg>
        
        {/* Enhanced Tooltip */}
        {showTooltip && hoveredCityData && (
          <div
            className="fixed z-50 bg-white rounded-xl shadow-2xl border border-gray-200 p-6 pointer-events-none max-w-sm"
            style={{
              left: tooltipPosition.x + 15,
              top: tooltipPosition.y - 10,
              transform: 'translateY(-100%)'
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-6 h-6 rounded-full shadow-lg"
                style={{ backgroundColor: getAQIColor(hoveredCityData.aqi) }}
              ></div>
              <div>
                <h4 className="font-bold text-gray-800 text-lg">{hoveredCityData.name}</h4>
                <p className="text-sm text-gray-500">{hoveredCityData.quality}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">AQI:</span>
                  <span className="font-semibold text-gray-800">{hoveredCityData.aqi}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">PM2.5:</span>
                  <span className="font-semibold text-gray-800">{hoveredCityData.pm25}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">PM10:</span>
                  <span className="font-semibold text-gray-800">{hoveredCityData.pm10}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">O₃:</span>
                  <span className="font-semibold text-gray-800">{hoveredCityData.o3}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">NO₂:</span>
                  <span className="font-semibold text-gray-800">{hoveredCityData.no2}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">SO₂:</span>
                  <span className="font-semibold text-gray-800">{hoveredCityData.so2}</span>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-3 space-y-1 text-xs text-gray-500">
              <div className="flex justify-between">
                <span>Latitude:</span>
                <span className="font-mono">{hoveredCityData.lat.toFixed(4)}°</span>
              </div>
              <div className="flex justify-between">
                <span>Longitude:</span>
                <span className="font-mono">{hoveredCityData.lng.toFixed(4)}°</span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Click on any city marker to view detailed air quality information • Data updates every 5 minutes
        </p>
      </div>
    </div>
  );
};

export default InteractiveMap;
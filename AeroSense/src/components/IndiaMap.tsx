import React, { useState } from 'react';
import { MapPin, Info } from 'lucide-react';
import { topCities } from '../data/mockData';

interface IndiaMapProps {
  selectedCity: string;
  onCitySelect: (city: string) => void;
}

const IndiaMap: React.FC<IndiaMapProps> = ({ selectedCity, onCitySelect }) => {
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // Coordinates for Indian cities (approximate positions on SVG map)
  const cityCoordinates: { [key: string]: { x: number; y: number; lat: number; lng: number } } = {
    'Delhi': { x: 420, y: 180, lat: 28.6139, lng: 77.2090 },
    'Mumbai': { x: 350, y: 320, lat: 19.0760, lng: 72.8777 },
    'Kolkata': { x: 550, y: 250, lat: 22.5726, lng: 88.3639 },
    'Chennai': { x: 450, y: 450, lat: 13.0827, lng: 80.2707 },
    'Bangalore': { x: 420, y: 420, lat: 12.9716, lng: 77.5946 },
    'Hyderabad': { x: 450, y: 380, lat: 17.3850, lng: 78.4867 },
    'Pune': { x: 380, y: 340, lat: 18.5204, lng: 73.8567 },
    'Ahmedabad': { x: 320, y: 260, lat: 23.0225, lng: 72.5714 },
    'Jaipur': { x: 380, y: 220, lat: 26.9124, lng: 75.7873 },
    'Lucknow': { x: 460, y: 220, lat: 26.8467, lng: 80.9462 },
    'Kanpur': { x: 450, y: 230, lat: 26.4499, lng: 80.3319 },
    'Nagpur': { x: 450, y: 300, lat: 21.1458, lng: 79.0882 },
    'Indore': { x: 400, y: 280, lat: 22.7196, lng: 75.8577 },
    'Bhopal': { x: 420, y: 270, lat: 23.2599, lng: 77.4126 },
    'Visakhapatnam': { x: 500, y: 380, lat: 17.6868, lng: 83.2185 },
  };

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return '#22C55E'; // Green
    if (aqi <= 100) return '#EAB308'; // Yellow
    if (aqi <= 150) return '#F97316'; // Orange
    if (aqi <= 200) return '#EF4444'; // Red
    return '#8B5CF6'; // Purple
  };

  const handleMouseEnter = (city: string, event: React.MouseEvent) => {
    setHoveredCity(city);
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

  const hoveredCityData = hoveredCity ? topCities.find(c => c.name === hoveredCity) : null;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 relative">
      <div className="flex items-center gap-3 mb-4">
        <MapPin className="w-6 h-6 text-blue-600" />
        <h3 className="text-xl font-bold text-gray-800">India Air Quality Map</h3>
        <div className="ml-auto flex items-center gap-4 text-sm">
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
      </div>
      
      <div className="relative bg-gradient-to-br from-blue-50 to-green-50 rounded-xl p-4 overflow-hidden">
        {/* OpenStreetMap-style India Map */}
        <div 
          className="w-full h-96 bg-cover bg-center rounded-xl relative"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'%3E%3Cdefs%3E%3Cpattern id='grid' width='20' height='20' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 20 0 L 0 0 0 20' fill='none' stroke='%23e5e7eb' stroke-width='0.5'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='800' height='600' fill='%23f8fafc'/%3E%3Crect width='800' height='600' fill='url(%23grid)'/%3E%3C/svg%3E")`,
          }}
          onMouseMove={handleMouseMove}
        >
          {/* India outline with detailed borders */}
          <svg
            viewBox="0 0 800 600"
            className="absolute inset-0 w-full h-full"
          >
            {/* Main India outline */}
            <path
              d="M200 150 Q250 120 300 110 Q350 100 400 95 Q450 90 500 85 Q550 90 600 100 Q650 120 680 150 Q700 180 720 220 Q730 260 735 300 Q730 340 720 380 Q700 420 680 450 Q650 480 600 500 Q550 510 500 515 Q450 520 400 525 Q350 530 300 535 Q250 530 200 520 Q150 500 120 470 Q100 430 90 390 Q85 350 90 310 Q100 270 120 230 Q150 190 200 150 Z"
              fill="rgba(34, 197, 94, 0.1)"
              stroke="rgba(34, 197, 94, 0.4)"
              strokeWidth="2"
              className="drop-shadow-sm"
            />
            
            {/* State boundaries */}
            <g stroke="rgba(59, 130, 246, 0.3)" strokeWidth="1" fill="none">
              {/* Rajasthan */}
              <path d="M200 150 L350 140 L380 200 L350 250 L280 240 L200 220 Z" />
              {/* Maharashtra */}
              <path d="M280 240 L450 250 L480 350 L400 380 L320 370 L280 320 Z" />
              {/* Karnataka */}
              <path d="M320 370 L480 380 L500 450 L420 480 L350 470 L320 420 Z" />
              {/* Tamil Nadu */}
              <path d="M420 480 L500 490 L520 550 L450 570 L400 560 L420 520 Z" />
              {/* Andhra Pradesh */}
              <path d="M450 380 L550 390 L570 450 L500 470 L450 450 Z" />
              {/* Odisha */}
              <path d="M500 250 L580 260 L590 320 L550 350 L500 340 Z" />
              {/* West Bengal */}
              <path d="M550 200 L620 210 L630 280 L580 290 L550 270 Z" />
              {/* Uttar Pradesh */}
              <path d="M350 140 L500 130 L520 200 L450 220 L380 210 Z" />
              {/* Madhya Pradesh */}
              <path d="M350 210 L500 200 L520 280 L450 300 L380 290 Z" />
              {/* Gujarat */}
              <path d="M200 220 L350 210 L380 290 L320 320 L250 310 L200 280 Z" />
            </g>
            
            {/* City Markers */}
            {topCities.map((city) => {
              const coords = cityCoordinates[city.name];
              if (!coords) return null;
              
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
                      r="20"
                      fill={color}
                      opacity="0.3"
                      className="animate-ping"
                    />
                  )}
                  
                  {/* City marker with shadow */}
                  <circle
                    cx={coords.x}
                    cy={coords.y}
                    r={isSelected ? "14" : isHovered ? "12" : "10"}
                    fill={color}
                    stroke="white"
                    strokeWidth="3"
                    className="cursor-pointer transition-all duration-200 hover:stroke-4 drop-shadow-lg"
                    onMouseEnter={(e) => handleMouseEnter(city.name, e)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => onCitySelect(city.name)}
                    filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
                  />
                  
                  {/* AQI value inside marker */}
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
                    x={coords.x - 25}
                    y={coords.y + (isSelected ? 20 : 16)}
                    width="50"
                    height="16"
                    fill="rgba(255, 255, 255, 0.9)"
                    rx="8"
                    className="pointer-events-none"
                  />
                  <text
                    x={coords.x}
                    y={coords.y + (isSelected ? 30 : 26)}
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
        </div>
        
        {/* Tooltip */}
        {showTooltip && hoveredCityData && (
          <div
            className="fixed z-50 bg-white rounded-xl shadow-xl border border-gray-200 p-4 pointer-events-none"
            style={{
              left: tooltipPosition.x + 10,
              top: tooltipPosition.y - 10,
              transform: 'translateY(-100%)'
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: getAQIColor(hoveredCityData.aqi) }}
              ></div>
              <h4 className="font-bold text-gray-800">{hoveredCityData.name}</h4>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-gray-600">AQI:</span>
                <span className="font-semibold text-gray-800">{hoveredCityData.aqi}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-600">Status:</span>
                <span className="font-semibold text-gray-800">{hoveredCityData.quality}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-600">Latitude:</span>
                <span className="font-mono text-gray-800">{cityCoordinates[hoveredCityData.name]?.lat.toFixed(4)}°</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-600">Longitude:</span>
                <span className="font-mono text-gray-800">{cityCoordinates[hoveredCityData.name]?.lng.toFixed(4)}°</span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Click on any city marker to view detailed air quality information
        </p>
      </div>
    </div>
  );
};

export default IndiaMap;
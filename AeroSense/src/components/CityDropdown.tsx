import React, { useState } from 'react';
import { ChevronDown, MapPin } from 'lucide-react';
import { topCities } from '../data/mockData';

interface CityDropdownProps {
  selectedCity: string;
  onCityChange: (city: string) => void;
}

const CityDropdown: React.FC<CityDropdownProps> = ({ selectedCity, onCityChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'Good':
        return 'bg-green-500';
      case 'Moderate':
        return 'bg-yellow-500';
      case 'Unhealthy for Sensitive Groups':
        return 'bg-orange-500';
      case 'Unhealthy':
        return 'bg-red-500';
      case 'Very Unhealthy':
        return 'bg-purple-500';
      case 'Hazardous':
        return 'bg-red-800';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="relative z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2 bg-white rounded-xl shadow-md border border-gray-200 hover:border-blue-300 transition-all duration-200 min-w-48"
      >
        <MapPin className="w-5 h-5 text-blue-600" />
        <span className="font-medium text-gray-700">{selectedCity}</span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50">
          <div className="p-2 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-600 px-3 py-1">Top Cities</p>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {topCities.map((city) => (
              <button
                key={city.name}
                onClick={() => {
                  onCityChange(city.name);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors duration-150 ${
                  selectedCity === city.name ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                }`}
              >
                <div className={`w-3 h-3 rounded-full ${getQualityColor(city.quality)}`}></div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-gray-800">{city.name}</p>
                  <p className="text-sm text-gray-500">AQI: {city.aqi} - {city.quality}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CityDropdown;
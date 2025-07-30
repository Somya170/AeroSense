import React, { useState } from 'react';
import { User } from '../types';
import { MapPin, User as UserIcon, Wind, ChevronDown } from 'lucide-react';
import { topCities } from '../data/mockData';

interface InitialFormProps {
  onSubmit: (user: User) => void;
}

const InitialForm: React.FC<InitialFormProps> = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !city.trim()) return;

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    onSubmit({
  name: name.trim(),
  city,
  age: parseInt(age),
  phone: phone.trim()
});

  };

  const getAQIColorDot = (aqi: number) => {
    if (aqi <= 50) return 'bg-green-500';
    if (aqi <= 100) return 'bg-yellow-500';
    if (aqi <= 150) return 'bg-orange-500';
    if (aqi <= 200) return 'bg-red-500';
    return 'bg-purple-500';
  };

  const selectedCityData = topCities.find(c => c.name === city);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-blue-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-100/30 via-blue-50/40 to-white/50"></div>
      
      {/* Floating elements for visual appeal */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-purple-200 to-blue-200 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-24 h-24 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-10 w-16 h-16 bg-gradient-to-r from-purple-300 to-blue-300 rounded-full opacity-15 animate-bounce"></div>
      
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/30">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full mb-6 shadow-lg">
              <Wind className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-3">
              AQI Monitor
            </h1>
            <p className="text-gray-600 text-lg">Track air quality in Indian cities</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-purple-500" />
                Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-4 bg-white/70 border-2 border-purple-100 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm transition-all duration-200 hover:border-purple-200"
                placeholder="Enter your name"
                required
              />
            </div>




            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-500" />
                Select City
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full px-4 py-4 bg-white/70 border-2 border-blue-100 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm transition-all duration-200 hover:border-blue-200 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    {selectedCityData ? (
                      <>
                        <div className={`w-3 h-3 rounded-full ${getAQIColorDot(selectedCityData.aqi)} animate-pulse`}></div>
                        <div className="text-left">
                          <span className="font-medium">{selectedCityData.name}</span>
                          <div className="text-sm text-gray-500">AQI: {selectedCityData.aqi} - {selectedCityData.quality}</div>
                        </div>
                      </>
                    ) : (
                      <span className="text-gray-500">Select an Indian city</span>
                    )}
                  </div>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute bottom-full left-0 right-0 mb-2 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/30 overflow-hidden z-50 max-h-80 overflow-y-auto">
                    {topCities.map((cityOption) => (
                      <button
                        key={cityOption.name}
                        type="button"
                        onClick={() => {
                          setCity(cityOption.name);
                          setIsDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-purple-50/50 transition-colors duration-150 text-left"
                      >
                        <div className={`w-4 h-4 rounded-full ${getAQIColorDot(cityOption.aqi)} shadow-lg`}></div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{cityOption.name}</p>
                          <p className="text-sm text-gray-500">AQI: {cityOption.aqi} - {cityOption.quality}</p>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-semibold text-white ${
                          cityOption.aqi <= 50 ? 'bg-green-500' :
                          cityOption.aqi <= 100 ? 'bg-yellow-500' :
                          cityOption.aqi <= 150 ? 'bg-orange-500' :
                          cityOption.aqi <= 200 ? 'bg-red-500' : 'bg-purple-500'
                        }`}>
                          {cityOption.aqi}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={!name.trim() || !city.trim() || isSubmitting}
              className="w-full py-4 px-6 bg-gradient-to-r from-purple-500 to-blue-600 text-white font-bold rounded-xl shadow-xl hover:from-purple-600 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-purple-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Processing...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Wind className="w-5 h-5" />
                  Check Air Quality
                </div>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Real-time air quality data for major Indian cities
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InitialForm;
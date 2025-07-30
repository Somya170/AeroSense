import React from 'react';
import { Cloud, Sun, CloudRain, Wind, Droplets, Eye, Gauge, Thermometer, Umbrella, Shirt, Car, Glasses as Sunglasses } from 'lucide-react';

interface WeatherDashboardProps {
  city: string;
}

const WeatherDashboard: React.FC<WeatherDashboardProps> = ({ city }) => {
  const weatherData = {
    current: {
      temp: 37,
      condition: 'Sunny',
      humidity: 31,
      windSpeed: 9,
      windDirection: '132° SE',
      gustSpeed: 4,
      visibility: 6,
      cloudCover: 25,
      pressure: 1001,
      uvIndex: 0,
      precipitation: 0,
      sunrise: '05:36 AM',
      sunset: '07:08 PM'
    },
    forecast: [
      { day: 'Today', icon: Sun, temp: 37, condition: 'Sunny', humidity: 31 },
      { day: 'Saturday', icon: CloudRain, temp: 34, condition: 'Rainy', humidity: 40 },
      { day: 'Sunday', icon: CloudRain, temp: 31, condition: 'Rainy', humidity: 52 },
      { day: 'Monday', icon: CloudRain, temp: 31, condition: 'Rainy', humidity: 54 },
      { day: 'Tuesday', icon: CloudRain, temp: 27, condition: 'Rainy', humidity: 76 },
      { day: 'Wednesday', icon: CloudRain, temp: 29, condition: 'Rainy', humidity: 68 }
    ],
    monthly: {
      sunny: 9,
      cloudy: 1,
      rainy: 20,
      snowy: 0
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">{city} Weather Forecast</h2>
        <p className="text-blue-100">Real-time weather conditions and 10-day forecast</p>
      </div>

      {/* Current Weather & Forecast */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Weather */}
        <div className="lg:col-span-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Today</h3>
              <p className="text-sm text-blue-100">13 Jun</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">41°C / 32°C</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 mb-6">
            <Sun className="w-16 h-16 text-yellow-300" />
            <div>
              <h4 className="text-xl font-semibold">{weatherData.current.condition}</h4>
              <p className="text-blue-100">Clear Sky with temperature at {weatherData.current.temp}°C and humidity will be at {weatherData.current.humidity}% with 20.5 km/h winds.</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <Droplets className="w-5 h-5 mx-auto mb-1 text-blue-200" />
              <p className="text-sm text-blue-100">Humi.</p>
              <p className="font-semibold">{weatherData.current.humidity}%</p>
            </div>
            <div>
              <CloudRain className="w-5 h-5 mx-auto mb-1 text-blue-200" />
              <p className="text-sm text-blue-100">Prec.</p>
              <p className="font-semibold">{weatherData.current.precipitation.toFixed(2)} mm</p>
            </div>
            <div className="flex flex-col items-center">
              <Sun className="w-5 h-5 mb-1 text-yellow-300" />
              <p className="text-sm text-blue-100">Sunrise</p>
              <p className="font-semibold text-xs">{weatherData.current.sunrise}</p>
              <p className="text-xs text-blue-200">13hrs 32min</p>
            </div>
          </div>
        </div>

        {/* Weather Overview */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">June Weather Overview</h3>
          
          {/* Weather Chart */}
          <div className="relative w-32 h-32 mx-auto mb-4">
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              {/* Sunny - 9 days (30%) */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#f97316"
                strokeWidth="8"
                strokeDasharray="75.4 251.3"
                strokeDashoffset="0"
              />
              {/* Rainy - 20 days (66.7%) */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="8"
                strokeDasharray="167.6 251.3"
                strokeDashoffset="-75.4"
              />
              {/* Cloudy - 1 day (3.3%) */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="8"
                strokeDasharray="8.3 251.3"
                strokeDashoffset="-243"
              />
            </svg>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-gray-600">Sunny</span>
              </div>
              <span className="bg-orange-500 text-white px-2 py-1 rounded text-xs font-semibold">{weatherData.monthly.sunny}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cloud className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Cloudy</span>
              </div>
              <span className="bg-purple-500 text-white px-2 py-1 rounded text-xs font-semibold">{weatherData.monthly.cloudy}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CloudRain className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-gray-600">Rainy</span>
              </div>
              <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-semibold">{weatherData.monthly.rainy}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 10-Day Forecast */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">10-Days Weather Forecast</h3>
          <button className="text-blue-600 hover:text-blue-700 font-medium">See Monthly →</button>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-2">
          {weatherData.forecast.map((day, index) => {
            const Icon = day.icon;
            return (
              <div key={index} className={`flex-shrink-0 p-4 rounded-xl border-2 transition-all duration-200 ${
                index === 0 ? 'bg-blue-500 text-white border-blue-500' : 'bg-gray-50 border-gray-200 hover:border-blue-300'
              }`}>
                <p className={`text-sm font-medium mb-2 ${index === 0 ? 'text-blue-100' : 'text-gray-600'}`}>{day.day}</p>
                <Icon className={`w-8 h-8 mx-auto mb-2 ${index === 0 ? 'text-yellow-300' : 'text-blue-500'}`} />
                <p className={`text-lg font-bold text-center ${index === 0 ? 'text-white' : 'text-gray-800'}`}>{day.temp}°C</p>
                <p className={`text-xs text-center ${index === 0 ? 'text-blue-100' : 'text-gray-500'}`}>{day.humidity}%</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Weather Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Wind Speed */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <Wind className="w-8 h-8" />
            <div>
              <h4 className="font-semibold">Wind Speed</h4>
              <p className="text-blue-100 text-sm">Light Breeze</p>
            </div>
          </div>
          <p className="text-3xl font-bold mb-2">{weatherData.current.windSpeed} km/h</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-blue-200">Gust Speed</p>
              <p className="font-semibold">{weatherData.current.gustSpeed} m/s</p>
            </div>
            <div>
              <p className="text-blue-200">Direction</p>
              <p className="font-semibold">{weatherData.current.windDirection}</p>
            </div>
          </div>
        </div>

        {/* Cloud Cover & Visibility */}
        <div className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <Cloud className="w-8 h-8" />
            <div>
              <h4 className="font-semibold">Cloud Cover</h4>
              <p className="text-gray-200 text-sm">Visibility</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-3xl font-bold">{weatherData.current.cloudCover}%</p>
            </div>
            <div>
              <p className="text-3xl font-bold">{weatherData.current.visibility} km</p>
            </div>
          </div>
          <p className="text-gray-200 text-sm mt-2">Recent visibility is {weatherData.current.visibility}km with {weatherData.current.cloudCover}% cloud coverage, so plan accordingly!</p>
        </div>

        {/* Pressure */}
        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <Gauge className="w-8 h-8" />
            <h4 className="font-semibold">Pressure</h4>
          </div>
          <p className="text-3xl font-bold mb-2">{weatherData.current.pressure} mb</p>
          <div className="bg-orange-600 px-3 py-1 rounded-full text-sm font-semibold inline-block mb-2">Low</div>
          <p className="text-orange-100 text-sm">Current pressure level is a {weatherData.current.pressure} mb.</p>
        </div>

        {/* UV Index */}
        <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <Sun className="w-8 h-8" />
            <h4 className="font-semibold">UV Index</h4>
          </div>
          <p className="text-3xl font-bold mb-2">{weatherData.current.uvIndex}</p>
          <div className="bg-green-500 px-3 py-1 rounded-full text-sm font-semibold inline-block mb-2">Low</div>
          <p className="text-yellow-100 text-sm">The present UV index is {weatherData.current.uvIndex}, consider suggestions for the same!</p>
        </div>
      </div>

      {/* Suggestions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Suggestions for {city}</h3>
          <p className="text-sm text-blue-600 mb-4">Today 12 Jun</p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-red-50 rounded-xl border border-red-100">
              <Thermometer className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-800">Heat Stroke</h4>
              <p className="text-sm text-red-600">• Avoid Outdoor</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-100">
              <Shirt className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-800">Clothing</h4>
              <p className="text-sm text-blue-600">• Breathable</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-xl border border-green-100">
              <Car className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-800">Driving</h4>
              <p className="text-sm text-green-600">• Enjoy Driving</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-xl border border-yellow-100">
              <Sunglasses className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-800">Sunscreen</h4>
              <p className="text-sm text-yellow-600">• Not required</p>
            </div>
          </div>
        </div>

        {/* Precipitation */}
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <Umbrella className="w-8 h-8" />
            <h4 className="font-semibold text-lg">Precipitation</h4>
          </div>
          <p className="text-4xl font-bold mb-4">{weatherData.current.precipitation} mm</p>
          <p className="text-blue-100">Current precipitation chances sit at {weatherData.current.precipitation}mm</p>
        </div>
      </div>
    </div>
  );
};

export default WeatherDashboard;
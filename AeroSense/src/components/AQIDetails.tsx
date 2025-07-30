import React from 'react';
import { AQIData } from '../types';
import { Wind, Thermometer, Droplets, Clock, AlertTriangle, CheckCircle, MapPin, TrendingUp, BarChart3 } from 'lucide-react';

interface AQIDetailsProps {
  data: AQIData;
  onNavigateToAnalytics?: () => void;
}

const AQIDetails: React.FC<AQIDetailsProps> = ({ data, onNavigateToAnalytics }) => {
  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return 'from-green-400 to-green-600';
    if (aqi <= 100) return 'from-yellow-400 to-yellow-600';
    if (aqi <= 150) return 'from-orange-400 to-orange-600';
    if (aqi <= 200) return 'from-red-400 to-red-600';
    if (aqi <= 300) return 'from-purple-400 to-purple-600';
    return 'from-red-600 to-red-800';
  };

  const getQualityIcon = (quality: string) => {
    if (quality === 'Good') return <CheckCircle className="w-6 h-6" />;
    return <AlertTriangle className="w-6 h-6" />;
  };

  const pollutantData = [
    { name: 'PM2.5', value: data.pollutants.pm25, unit: 'μg/m³', color: 'bg-blue-500', description: 'Fine particles' },
    { name: 'PM10', value: data.pollutants.pm10, unit: 'μg/m³', color: 'bg-purple-500', description: 'Coarse particles' },
    { name: 'O₃', value: data.pollutants.o3, unit: 'ppb', color: 'bg-green-500', description: 'Ground-level ozone' },
    { name: 'NO₂', value: data.pollutants.no2, unit: 'ppb', color: 'bg-yellow-500', description: 'Nitrogen dioxide' },
    { name: 'SO₂', value: data.pollutants.so2, unit: 'ppb', color: 'bg-red-500', description: 'Sulfur dioxide' },
    { name: 'CO', value: data.pollutants.co, unit: 'ppm', color: 'bg-indigo-500', description: 'Carbon monoxide' },
  ];

  return (
    <div className="space-y-6">
      {/* Main AQI Card */}
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 overflow-hidden relative">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-100 to-purple-100 rounded-full translate-y-12 -translate-x-12 opacity-30"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <MapPin className="w-6 h-6 text-purple-600" />
                <h2 className="text-3xl font-bold text-gray-800">{data.city}</h2>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Last updated: {data.lastUpdated}</span>
              </div>
            </div>
            <div className="text-right">
              <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r ${getAQIColor(data.aqi)} text-white shadow-lg`}>
                {getQualityIcon(data.quality)}
                <span className="font-semibold text-lg">{data.quality}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="text-center">
              <div className={`inline-flex items-center justify-center w-40 h-40 rounded-full bg-gradient-to-r ${getAQIColor(data.aqi)} mb-6 shadow-xl relative`}>
                <span className="text-5xl font-bold text-white">{data.aqi}</span>
                <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <p className="text-xl font-semibold text-gray-700 mb-2">Air Quality Index</p>
              <p className="text-sm text-gray-500 mb-4">Current AQI Level</p>
              
              {/* Analysis Button */}
              {onNavigateToAnalytics && (
                <button
                  onClick={onNavigateToAnalytics}
                  className="bg-gradient-to-r from-purple-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-blue-700 transition-all duration-200 flex items-center gap-2 mx-auto shadow-lg"
                >
                  <BarChart3 className="w-5 h-5" />
                  View Analysis
                </button>
              )}
            </div>

            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Wind className="w-5 h-5 text-blue-600" />
                  Health Recommendation
                </h4>
                <p className="text-gray-700 leading-relaxed">{data.recommendation}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-xl border border-orange-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Thermometer className="w-4 h-4 text-orange-500" />
                    <span className="text-sm font-medium text-gray-600">Temperature</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-800">
                    {data.forecast[0]?.temperature || 28}°C
                  </p>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Droplets className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium text-gray-600">Humidity</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-800">
                    {data.forecast[0]?.humidity || 65}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pollutants Grid */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Wind className="w-6 h-6 text-purple-600" />
          Detailed Pollutant Analysis
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pollutantData.map((pollutant) => (
            <div key={pollutant.name} className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl hover:shadow-md transition-all duration-200 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${pollutant.color} rounded-xl flex items-center justify-center shadow-lg`}>
                  <span className="text-white font-bold text-sm">{pollutant.name}</span>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-800">{pollutant.value}</p>
                  <p className="text-xs text-gray-500">{pollutant.unit}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">{pollutant.description}</p>
              <div className="mt-3 bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${pollutant.color}`}
                  style={{ width: `${Math.min((pollutant.value / 100) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AQIDetails;
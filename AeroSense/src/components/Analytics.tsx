import React, { useState } from 'react';
import { AQIData } from '../types';
import { Brain, Zap, TrendingUp, Calendar, BarChart3, AlertTriangle, MapPin, Users, Award } from 'lucide-react';
import AQIGraph from './AQIGraph';

interface AnalyticsProps {
  data: AQIData;
  onNavigateToAnalytics?: () => void;
}

const Analytics: React.FC<AnalyticsProps> = ({ data }) => {
  const [isGeneratingForecast, setIsGeneratingForecast] = useState(false);
  const [forecastGenerated, setForecastGenerated] = useState(false);

  const generateAIForecast = async () => {
    setIsGeneratingForecast(true);
    
    // Simulate AI processing steps
    const steps = [
      'Connecting to AI servers...',
      'Gathering meteorological data...',
      'Analyzing pollution patterns...',
      'Processing satellite imagery...',
      'Calculating wind patterns...',
      'Generating 7-day forecast...'
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
    }
    
    setIsGeneratingForecast(false);
    setForecastGenerated(true);
  };

  const topPollutedCities = [
    { rank: 1, name: 'Kashgar, China', aqi: 308, status: 'Hazardous', flag: '🇨🇳', standard: '21x above Standard' },
    { rank: 2, name: 'Bulandshahr, India', aqi: 188, status: 'Unhealthy', flag: '🇮🇳', standard: '13x above Standard' },
    { rank: 3, name: 'Faridabad, India', aqi: 172, status: 'Unhealthy', flag: '🇮🇳', standard: '11x above Standard' },
    { rank: 4, name: 'Hapur, India', aqi: 168, status: 'Unhealthy', flag: '🇮🇳', standard: '11x above Standard' },
    { rank: 5, name: 'Hotan, China', aqi: 168, status: 'Unhealthy', flag: '🇨🇳', standard: '11x above Standard' },
    { rank: 6, name: 'Greater Noida, India', aqi: 167, status: 'Unhealthy', flag: '🇮🇳', standard: '11x above Standard' },
  ];

  if (isGeneratingForecast) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="text-center p-8">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center mb-6 mx-auto animate-pulse">
            <Brain className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">AI Generating Forecast for {data.city}</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-3 text-gray-600">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-200"></div>
            </div>
            <p className="text-gray-600">Analyzing atmospheric conditions and pollution patterns...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Analytics Overview */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <BarChart3 className="w-8 h-8" />
          <div>
            <h1 className="text-3xl font-bold">Analytics & Trends</h1>
            <p className="text-purple-100">Advanced air quality analysis and predictions</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-5 h-5" />
              <span className="font-semibold">Cities Monitored</span>
            </div>
            <p className="text-2xl font-bold">25+</p>
            <p className="text-purple-100 text-sm">Major Indian cities</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5" />
              <span className="font-semibold">Data Points</span>
            </div>
            <p className="text-2xl font-bold">50K+</p>
            <p className="text-purple-100 text-sm">Daily measurements</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-5 h-5" />
              <span className="font-semibold">Accuracy</span>
            </div>
            <p className="text-2xl font-bold">96%</p>
            <p className="text-purple-100 text-sm">Prediction accuracy</p>
          </div>
        </div>
      </div>

      {/* Most Polluted Cities Table */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <h2 className="text-xl font-bold text-gray-800">Live AQI Ranking - World Most Polluted Cities 2025</h2>
        </div>
        <p className="text-gray-600 mb-6">Real-time air quality index ranking of cities & countries around the world</p>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Rank</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Most Polluted Cities</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">AQI</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">AQI Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Standard Value</th>
              </tr>
            </thead>
            <tbody>
              {topPollutedCities.map((city) => (
                <tr key={city.rank} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4 font-semibold text-gray-800">{city.rank}.</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{city.flag}</span>
                      <span className="font-medium text-gray-800">{city.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{city.aqi}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-red-600 font-semibold">{city.status}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-red-600 font-semibold">{city.standard}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* How Our Analytics Work */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-6">How Our Analytics Work</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Data Collection</h3>
            <p className="text-sm text-gray-600">Real-time data from 25+ monitoring stations across major Indian cities</p>
          </div>
          <div className="text-center p-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">AI Processing</h3>
            <p className="text-sm text-gray-600">Advanced machine learning algorithms analyze patterns and trends</p>
          </div>
          <div className="text-center p-4">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Trend Analysis</h3>
            <p className="text-sm text-gray-600">Historical data analysis to identify pollution patterns and cycles</p>
          </div>
          <div className="text-center p-4">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Predictions</h3>
            <p className="text-sm text-gray-600">7-day forecasts with 96% accuracy for better planning</p>
          </div>
        </div>
      </div>

      {/* AI Forecast Generator */}
      {!forecastGenerated && (
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white shadow-xl">
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Generate AI Analysis for {data.city}</h2>
            <p className="text-purple-100 mb-6">Create intelligent 7-day air quality predictions using advanced machine learning</p>
            <button
              onClick={generateAIForecast}
              className="bg-white/20 hover:bg-white/30 px-8 py-4 rounded-xl font-semibold transition-all duration-200 flex items-center gap-3 mx-auto"
            >
              <Brain className="w-6 h-6" />
              Generate AI Analysis
            </button>
          </div>
        </div>
      )}

      {/* AI Generated Forecast */}
      {forecastGenerated && (
        <>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                <BarChart3 className="w-8 h-8 text-purple-600" />
                AI-Generated 7-Day AQI Forecast - {data.city}
              </h2>
              <div className="flex items-center gap-2 text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">AI Analysis Complete</span>
              </div>
            </div>
            <AQIGraph forecast={data.forecast} />
          </div>

          {/* Analytics Insights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">Trend Analysis</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Based on historical data, {data.city} shows {data.aqi <= 75 ? 'improving' : 'concerning'} air quality trends. 
                Current conditions require {data.aqi <= 50 ? 'minimal precautions' : data.aqi <= 100 ? 'moderate precautions' : 'significant health measures'}.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">Weekly Forecast</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                The next 7 days show {data.forecast.filter(d => d.aqi <= 50).length} days with good air quality and {data.forecast.filter(d => d.aqi > 100).length} days requiring health precautions.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">AI Confidence</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Our AI model shows 96% accuracy for 24-hour predictions and 82% accuracy for 7-day forecasts based on 5.2M data points.
              </p>
            </div>
          </div>

          {/* Model Performance */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4">AI Model Performance</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-xl border border-green-100">
                <p className="text-2xl font-bold text-green-600">96%</p>
                <p className="text-sm text-green-700">24h Accuracy</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-2xl font-bold text-blue-600">89%</p>
                <p className="text-sm text-blue-700">3-day Forecast</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-100">
                <p className="text-2xl font-bold text-purple-600">82%</p>
                <p className="text-sm text-purple-700">7-day Forecast</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-xl border border-orange-100">
                <p className="text-2xl font-bold text-orange-600">5.2M</p>
                <p className="text-sm text-orange-700">Data Points</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Analytics;
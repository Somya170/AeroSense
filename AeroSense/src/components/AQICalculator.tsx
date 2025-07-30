import React, { useState } from 'react';
import { Calculator, Zap, AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface PollutantInputs {
  pm25: string;
  pm10: string;
  o3: string;
  no2: string;
  so2: string;
  co: string;
}

interface CalculationResult {
  aqi: number;
  quality: string;
  pollutants: {
    pm25: number;
    pm10: number;
    o3: number;
    no2: number;
    so2: number;
    co: number;
  };
  calculation_time: string;
}

const AQICalculator: React.FC = () => {
  const [inputs, setInputs] = useState<PollutantInputs>({
    pm25: '',
    pm10: '',
    o3: '',
    no2: '',
    so2: '',
    co: ''
  });
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pollutantInfo = [
    { key: 'pm25', label: 'PM2.5', unit: 'μg/m³', description: 'Fine particulate matter', color: 'bg-red-500' },
    { key: 'pm10', label: 'PM10', unit: 'μg/m³', description: 'Coarse particulate matter', color: 'bg-orange-500' },
    { key: 'o3', label: 'O₃', unit: 'ppb', description: 'Ground-level ozone', color: 'bg-blue-500' },
    { key: 'no2', label: 'NO₂', unit: 'ppb', description: 'Nitrogen dioxide', color: 'bg-yellow-500' },
    { key: 'so2', label: 'SO₂', unit: 'ppb', description: 'Sulfur dioxide', color: 'bg-purple-500' },
    { key: 'co', label: 'CO', unit: 'ppm', description: 'Carbon monoxide', color: 'bg-green-500' }
  ];

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return 'from-green-400 to-green-600';
    if (aqi <= 100) return 'from-yellow-400 to-yellow-600';
    if (aqi <= 150) return 'from-orange-400 to-orange-600';
    if (aqi <= 200) return 'from-red-400 to-red-600';
    if (aqi <= 300) return 'from-purple-400 to-purple-600';
    return 'from-red-600 to-red-800';
  };

  const getQualityIcon = (quality: string) => {
    if (quality === 'Good') return <CheckCircle className="w-6 h-6 text-green-500" />;
    return <AlertTriangle className="w-6 h-6 text-red-500" />;
  };

  const handleInputChange = (key: keyof PollutantInputs, value: string) => {
    setInputs(prev => ({ ...prev, [key]: value }));
    setError(null);
  };

  const calculateAQI = async () => {
    setLoading(true);
    setError(null);

    try {
      const pollutantData = {
        pm25: parseFloat(inputs.pm25) || 0,
        pm10: parseFloat(inputs.pm10) || 0,
        o3: parseFloat(inputs.o3) || 0,
        no2: parseFloat(inputs.no2) || 0,
        so2: parseFloat(inputs.so2) || 0,
        co: parseFloat(inputs.co) || 0
      };

      const response = await fetch('http://localhost:5000/api/calculate-aqi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pollutantData)
      });

      if (!response.ok) {
        throw new Error('Failed to calculate AQI');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError('Failed to calculate AQI. Please check your inputs and try again.');
      console.error('AQI calculation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetCalculator = () => {
    setInputs({
      pm25: '',
      pm10: '',
      o3: '',
      no2: '',
      so2: '',
      co: ''
    });
    setResult(null);
    setError(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <Calculator className="w-8 h-8" />
          <div>
            <h2 className="text-2xl font-bold">AQI Calculator</h2>
            <p className="text-purple-100">Calculate Air Quality Index from pollutant concentrations</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Enter Pollutant Concentrations</h3>
          
          <div className="space-y-4">
            {pollutantInfo.map((pollutant) => (
              <div key={pollutant.key} className="space-y-2">
                <label className="flex items-center gap-3 text-sm font-semibold text-gray-700">
                  <div className={`w-4 h-4 ${pollutant.color} rounded-full`}></div>
                  {pollutant.label} ({pollutant.unit})
                </label>
                <input
                  type="number"
                  value={inputs[pollutant.key as keyof PollutantInputs]}
                  onChange={(e) => handleInputChange(pollutant.key as keyof PollutantInputs, e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder={`Enter ${pollutant.label} concentration`}
                  min="0"
                  step="0.1"
                />
                <p className="text-xs text-gray-500">{pollutant.description}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={calculateAQI}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-purple-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-purple-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Calculating...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Calculate AQI
                </>
              )}
            </button>
            
            <button
              onClick={resetCalculator}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200"
            >
              Reset
            </button>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <p className="text-red-700 font-medium">Error</p>
              </div>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="space-y-6">
          {result ? (
            <>
              {/* AQI Result */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Calculation Result</h3>
                
                <div className="text-center mb-6">
                  <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-r ${getAQIColor(result.aqi)} mb-4 shadow-xl`}>
                    <span className="text-4xl font-bold text-white">{Math.round(result.aqi)}</span>
                  </div>
                  
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {getQualityIcon(result.quality)}
                    <h4 className="text-2xl font-bold text-gray-800">{result.quality}</h4>
                  </div>
                  
                  <p className="text-gray-600">Air Quality Index</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <h5 className="font-semibold text-gray-800 mb-3">Input Values Used:</h5>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {pollutantInfo.map((pollutant) => (
                      <div key={pollutant.key} className="flex justify-between">
                        <span className="text-gray-600">{pollutant.label}:</span>
                        <span className="font-medium text-gray-800">
                          {result.pollutants[pollutant.key as keyof typeof result.pollutants]} {pollutant.unit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 text-xs text-gray-500 text-center">
                  Calculated at: {new Date(result.calculation_time).toLocaleString()}
                </div>
              </div>

              {/* Health Recommendations */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Health Recommendations</h3>
                
                <div className="space-y-3">
                  {result.aqi <= 50 && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                      <p className="text-green-800 font-medium">✅ Excellent air quality!</p>
                      <p className="text-green-700 text-sm">Perfect for all outdoor activities.</p>
                    </div>
                  )}
                  
                  {result.aqi > 50 && result.aqi <= 100 && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                      <p className="text-yellow-800 font-medium">⚠️ Moderate air quality</p>
                      <p className="text-yellow-700 text-sm">Sensitive individuals should limit prolonged outdoor exposure.</p>
                    </div>
                  )}
                  
                  {result.aqi > 100 && result.aqi <= 150 && (
                    <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl">
                      <p className="text-orange-800 font-medium">🚨 Unhealthy for sensitive groups</p>
                      <p className="text-orange-700 text-sm">Consider wearing N95 masks outdoors. Limit outdoor activities.</p>
                    </div>
                  )}
                  
                  {result.aqi > 150 && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                      <p className="text-red-800 font-medium">🚨 Unhealthy air quality</p>
                      <p className="text-red-700 text-sm">Avoid outdoor activities. Use air purifiers indoors. Wear masks when going outside.</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            /* Information Panel */
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <Info className="w-6 h-6 text-blue-500" />
                <h3 className="text-lg font-bold text-gray-800">How AQI is Calculated</h3>
              </div>
              
              <div className="space-y-4 text-sm text-gray-600">
                <p>
                  The Air Quality Index (AQI) is calculated using the highest individual pollutant concentration 
                  converted to its respective AQI value using EPA breakpoints.
                </p>
                
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">AQI Categories:</h4>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span>0-50: Good</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span>51-100: Moderate</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <span>101-150: Unhealthy for Sensitive Groups</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span>151-200: Unhealthy</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span>201-300: Very Unhealthy</span>
                    </div>
                  </div>
                </div>
                
                <p>
                  Enter the pollutant concentrations in their respective units and click "Calculate AQI" 
                  to get the overall air quality assessment.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AQICalculator;
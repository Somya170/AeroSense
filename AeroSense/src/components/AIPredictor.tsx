import React, { useState, useEffect } from 'react';
import { Brain, Shield, Wind, Heart, AlertTriangle, CheckCircle, Info, RefreshCw } from 'lucide-react';
import { AQIData, HealthMeasure } from '../types';
import { getAIInsight, getHealthMeasures } from '../data/mockData';

interface AIPredictorProps {
  data: AQIData;
}

const AIPredictor: React.FC<AIPredictorProps> = ({ data }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [insight, setInsight] = useState(getAIInsight(data.forecast));
  const [isLoadingHealthMeasures, setIsLoadingHealthMeasures] = useState(false);
  const [healthMeasures, setHealthMeasures] = useState(getHealthMeasures(data.aqi));

  const generateNewInsight = async () => {
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setInsight(getAIInsight(data.forecast));
    setIsGenerating(false);
  };

  const refreshHealthMeasures = async () => {
    setIsLoadingHealthMeasures(true);
    
    // Simulate backend API calls with loading messages
    const loadingSteps = [
      'Connecting to health database...',
      'Analyzing current AQI levels...',
      'Fetching mask recommendations...',
      'Loading air purifier data...',
      'Calculating health measures...',
      'Finalizing recommendations...'
    ];

    for (let i = 0; i < loadingSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Refresh the health measures data
    setHealthMeasures(getHealthMeasures(data.aqi));
    setIsLoadingHealthMeasures(false);
  };

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return 'from-green-400 to-green-600';
    if (aqi <= 100) return 'from-yellow-400 to-yellow-600';
    if (aqi <= 150) return 'from-orange-400 to-orange-600';
    if (aqi <= 200) return 'from-red-400 to-red-600';
    return 'from-purple-400 to-purple-600';
  };

  return (
    <div className="space-y-6">
      {/* AI Health Assistant */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">AI Health Assistant</h2>
            <p className="text-indigo-100">Personalized health recommendations for {data.city}</p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className={`w-10 h-10 bg-gradient-to-r ${getAQIColor(data.aqi)} rounded-full flex items-center justify-center flex-shrink-0 mt-1`}>
              {data.aqi <= 50 ? <CheckCircle className="w-5 h-5 text-white" /> : <AlertTriangle className="w-5 h-5 text-white" />}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2">Current Air Quality Assessment</h3>
              {isGenerating ? (
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span className="text-white/80">Analyzing health impacts...</span>
                </div>
              ) : (
                <p className="text-white/90 leading-relaxed">{insight}</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={generateNewInsight}
            disabled={isGenerating}
            className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Brain className="w-5 h-5" />
            {isGenerating ? 'Analyzing...' : 'New Analysis'}
          </button>
          
          <button
            onClick={refreshHealthMeasures}
            disabled={isLoadingHealthMeasures}
            className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <RefreshCw className={`w-5 h-5 ${isLoadingHealthMeasures ? 'animate-spin' : ''}`} />
            {isLoadingHealthMeasures ? 'Refreshing...' : 'Refresh Health Measures'}
          </button>
        </div>
      </div>

      {/* Health Measures Loading State */}
      {isLoadingHealthMeasures ? (
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Fetching Health Measures</h3>
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-center gap-3 text-gray-600">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-200"></div>
              </div>
              <p className="text-gray-600">Analyzing AQI levels and fetching personalized recommendations...</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="space-y-2">
                {[
                  'Connecting to health database...',
                  'Analyzing current AQI levels...',
                  'Fetching mask recommendations...',
                  'Loading air purifier data...',
                  'Calculating health measures...',
                  'Finalizing recommendations...'
                ].map((step, index) => (
                  <div key={index} className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-purple-500 rounded-full animate-spin"></div>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Health Measures Section - Always Displayed */
        <div className="space-y-6">
          {/* How Health Measures Work */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Info className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">How Our Health Measures Work</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center p-4">
                <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">AQI Assessment</h4>
                <p className="text-sm text-gray-600">Our AI analyzes current AQI levels and determines health risk categories based on WHO standards</p>
              </div>
              <div className="text-center p-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Protection Matching</h4>
                <p className="text-sm text-gray-600">We recommend specific masks and air purifiers based on pollutant types and concentration levels</p>
              </div>
              <div className="text-center p-4">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Health Guidance</h4>
                <p className="text-sm text-gray-600">Personalized recommendations for outdoor activities, exercise, and daily routines</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
              <h4 className="font-semibold text-gray-800 mb-3">Protection Effectiveness Scale</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Cloth Masks</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-gray-200 rounded-full">
                      <div className="w-1/4 h-2 bg-yellow-500 rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium">25%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Surgical Masks</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-gray-200 rounded-full">
                      <div className="w-3/5 h-2 bg-orange-500 rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium">60%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">N95/KN95 Masks</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-gray-200 rounded-full">
                      <div className="w-19/20 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium">95%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">N99/P3 Respirators</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-gray-200 rounded-full">
                      <div className="w-full h-2 bg-blue-500 rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium">99%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Masks */}
          {healthMeasures.masks.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Shield className="w-6 h-6 text-blue-500" />
                Recommended Masks for AQI {data.aqi}
              </h3>
              <p className="text-gray-600 mb-6">Based on current pollution levels in {data.city}, these masks provide optimal protection:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {healthMeasures.masks.map((mask, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                    <h4 className="font-semibold text-gray-800 mb-2">{mask.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{mask.effectiveness}</p>
                    <p className="text-lg font-bold text-purple-600 mb-3">{mask.price}</p>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-xs text-blue-700">
                        {mask.name.includes('N95') || mask.name.includes('KN95') 
                          ? 'Filters 95% of airborne particles including PM2.5 and PM10'
                          : mask.name.includes('N99') || mask.name.includes('P3')
                          ? 'Medical-grade protection filtering 99% of particles'
                          : 'Basic protection for light pollution days'
                        }
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Air Purifiers */}
          {healthMeasures.purifiers.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Wind className="w-6 h-6 text-green-500" />
                Recommended Air Purifiers for Indoor Protection
              </h3>
              <p className="text-gray-600 mb-6">Create a clean air sanctuary in your home with these HEPA-certified air purifiers:</p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {healthMeasures.purifiers.map((purifier, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                    <h4 className="font-semibold text-gray-800 mb-2">{purifier.name}</h4>
                    <div className="flex items-center gap-4 mb-3">
                      <span className="text-sm text-gray-600">{purifier.roomSize}</span>
                      <span className="text-xl font-bold text-green-600">{purifier.price}</span>
                    </div>
                    <div className="space-y-2 mb-4">
                      {purifier.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-gray-600">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-xs text-green-700">
                        HEPA filtration removes 99.97% of particles ≥0.3 microns, including PM2.5, allergens, and bacteria
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* General Health Tips */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Heart className="w-6 h-6 text-red-500" />
              General Health Tips for AQI {data.aqi}
            </h3>
            <p className="text-gray-600 mb-6">Follow these evidence-based recommendations to protect your health:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {healthMeasures.general.map((tip, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{tip}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-6 bg-gradient-to-r from-red-50 to-orange-50 p-4 rounded-xl border border-red-100">
              <h4 className="font-semibold text-red-800 mb-2">⚠️ Important Health Notice</h4>
              <p className="text-sm text-red-700">
                {data.aqi <= 50 
                  ? 'Air quality is good. Enjoy outdoor activities with confidence.'
                  : data.aqi <= 100
                  ? 'Sensitive individuals should monitor symptoms and limit prolonged outdoor exposure.'
                  : data.aqi <= 150
                  ? 'Everyone should reduce outdoor activities. Children and elderly should stay indoors.'
                  : 'Health emergency conditions. Avoid all outdoor activities and use air purifiers indoors.'
                }
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIPredictor;
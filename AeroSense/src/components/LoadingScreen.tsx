import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { CheckCircle, MapPin, Brain, BarChart3, Cloud, Info, Calculator, Wind } from 'lucide-react';

interface LoadingScreenProps {
  user: User;
  targetView: string;
  onComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ user, targetView, onComplete }) => {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const getViewConfig = (view: string) => {
    switch (view) {
      case 'ai-predictor':
        return {
          title: 'AI Health Assistant',
          icon: Brain,
          color: 'from-purple-500 to-pink-600',
          steps: [
            'Initializing AI models...',
            'Loading health algorithms...',
            'Preparing recommendations...',
          ]
        };
      case 'analytics':
        return {
          title: 'Analytics & Trends',
          icon: BarChart3,
          color: 'from-blue-500 to-purple-600',
          steps: [
            'Loading analytics engine...',
            'Processing statistics...',
            'Preparing charts...',
          ]
        };
      case 'weather':
        return {
          title: 'Weather Dashboard',
          icon: Cloud,
          color: 'from-blue-400 to-cyan-500',
          steps: [
            'Connecting to weather services...',
            'Fetching meteorological data...',
            'Loading forecasts...',
          ]
        };
      case 'calculator':
        return {
          title: 'AQI Calculator',
          icon: Calculator,
          color: 'from-green-500 to-blue-500',
          steps: [
            'Loading calculation engine...',
            'Preparing EPA standards...',
            'Setting up calculator...',
          ]
        };
      case 'about':
        return {
          title: 'About Section',
          icon: Info,
          color: 'from-green-500 to-blue-500',
          steps: [
            'Loading team information...',
            'Fetching project details...',
            'Preparing content...',
          ]
        };
      default:
        return {
          title: 'Dashboard',
          icon: MapPin,
          color: 'from-purple-500 to-blue-600',
          steps: [
            `Locating ${user.city}...`,
            'Fetching air quality data...',
            'Preparing dashboard...',
          ]
        };
    }
  };

  const config = getViewConfig(targetView);
  const { title, icon: ViewIcon, color, steps } = config;

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 300);
          return 100;
        }
        return prev + 3;
      });
    }, 60);

    return () => clearInterval(timer);
  }, [onComplete]);

  useEffect(() => {
    const stepTimer = setInterval(() => {
      setStep((prev) => Math.min(prev + 1, steps.length - 1));
    }, 800);

    return () => clearInterval(stepTimer);
  }, [steps.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md mx-auto">
        <div className="mb-8">
          {/* Main loading icon */}
          <div className={`w-20 h-20 bg-gradient-to-r ${color} rounded-full flex items-center justify-center shadow-lg mx-auto mb-6`}>
            <ViewIcon className="w-10 h-10 text-white" />
          </div>
          
          <h2 className={`text-2xl font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent mb-2`}>
            Loading {title}
          </h2>
          
          <p className="text-gray-600 mb-6">
            {steps[step] || 'Loading...'}
          </p>
          
          {/* Progress bar */}
          <div className="w-64 bg-gray-200 rounded-full h-2 mb-4 mx-auto">
            <div 
              className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-300`}
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <p className="text-gray-500 text-sm">{Math.round(progress)}%</p>
        </div>

        {/* Step indicators */}
        <div className="space-y-2">
          {steps.map((stepItem, index) => (
            <div
              key={index}
              className={`flex items-center justify-center gap-2 text-sm transition-all duration-300 ${
                index <= step ? 'text-green-600' : 'text-gray-400'
              }`}
            >
              {index <= step ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <div className="w-4 h-4 border border-gray-300 rounded-full"></div>
              )}
              <span>{stepItem}</span>
            </div>
          ))}
        </div>

        {/* Loading animation */}
        <div className="mt-6 flex items-center justify-center gap-1">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-100"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-200"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
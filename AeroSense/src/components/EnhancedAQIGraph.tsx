import React, { useEffect, useRef, useState } from 'react';
import { DailyForecast } from '../types';
import { ChevronDown, BarChart3, TrendingUp } from 'lucide-react';

interface EnhancedAQIGraphProps {
  forecast: DailyForecast[];
  title: string;
  isLiveData?: boolean;
  showTimeRange?: boolean;
}

const EnhancedAQIGraph: React.FC<EnhancedAQIGraphProps> = ({ 
  forecast, 
  title, 
  isLiveData = false, 
  showTimeRange = true 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedPollutant, setSelectedPollutant] = useState('aqi');
  const [selectedTimeRange, setSelectedTimeRange] = useState('7days');
  const [selectedGraphType, setSelectedGraphType] = useState('line');
  const [showPollutantDropdown, setShowPollutantDropdown] = useState(false);
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [showGraphTypeDropdown, setShowGraphTypeDropdown] = useState(false);

  const pollutantOptions = [
    { value: 'aqi', label: 'AQI', unit: '' },
    { value: 'pm25', label: 'PM2.5', unit: 'μg/m³' },
    { value: 'pm10', label: 'PM10', unit: 'μg/m³' },
    { value: 'co2', label: 'CO₂', unit: 'ppm' },
    { value: 'o3', label: 'O₃', unit: 'ppb' },
    { value: 'no2', label: 'NO₂', unit: 'ppb' },
    { value: 'so2', label: 'SO₂', unit: 'ppb' }
  ];

  const timeRangeOptions = [
    { value: '24hour', label: '24 Hours' },
    { value: '7days', label: '7 Days' },
    { value: '30days', label: '30 Days' }
  ];

  const graphTypeOptions = [
    { value: 'line', label: 'Line Chart', icon: TrendingUp },
    { value: 'bar', label: 'Bar Chart', icon: BarChart3 }
  ];

  // Generate mock data based on selected pollutant
  const generatePollutantData = (pollutant: string) => {
    return forecast.map(day => {
      switch (pollutant) {
        case 'pm25':
          return { ...day, value: Math.floor(day.aqi * 0.6) };
        case 'pm10':
          return { ...day, value: Math.floor(day.aqi * 0.8) };
        case 'co2':
          return { ...day, value: Math.floor(day.aqi * 0.3 + 400) };
        case 'o3':
          return { ...day, value: Math.floor(day.aqi * 0.4) };
        case 'no2':
          return { ...day, value: Math.floor(day.aqi * 0.3) };
        case 'so2':
          return { ...day, value: Math.floor(day.aqi * 0.2) };
        default:
          return { ...day, value: day.aqi };
      }
    });
  };

  const data = generatePollutantData(selectedPollutant);
  const selectedPollutantInfo = pollutantOptions.find(p => p.value === selectedPollutant);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    const padding = 50;
    const graphWidth = width - padding * 2;
    const graphHeight = height - padding * 2;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    if (isLiveData) {
      gradient.addColorStop(0, 'rgba(34, 197, 94, 0.1)');
      gradient.addColorStop(1, 'rgba(59, 130, 246, 0.1)');
    } else {
      gradient.addColorStop(0, 'rgba(147, 51, 234, 0.1)');
      gradient.addColorStop(1, 'rgba(59, 130, 246, 0.1)');
    }
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Get min and max values
    const values = data.map(d => d.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const range = maxValue - minValue || 1;

    // Calculate points
    const points = data.map((item, index) => ({
      x: padding + (index * graphWidth) / (data.length - 1),
      y: padding + graphHeight - ((item.value - minValue) / range) * graphHeight,
      value: item.value,
      date: item.date,
    }));

    // Draw grid lines
    ctx.strokeStyle = 'rgba(156, 163, 175, 0.3)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding + (i * graphHeight) / 4;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    if (selectedGraphType === 'bar') {
      // Draw bar chart
      const barWidth = graphWidth / data.length * 0.6;
      points.forEach((point, index) => {
        const barHeight = ((point.value - minValue) / range) * graphHeight;
        const barX = point.x - barWidth / 2;
        const barY = height - padding - barHeight;

        // Bar gradient
        const barGradient = ctx.createLinearGradient(0, barY, 0, barY + barHeight);
        if (isLiveData) {
          barGradient.addColorStop(0, '#22C55E');
          barGradient.addColorStop(1, '#3B82F6');
        } else {
          barGradient.addColorStop(0, '#8B5CF6');
          barGradient.addColorStop(1, '#3B82F6');
        }

        ctx.fillStyle = barGradient;
        ctx.fillRect(barX, barY, barWidth, barHeight);

        // Bar border
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 2;
        ctx.strokeRect(barX, barY, barWidth, barHeight);
      });
    } else {
      // Draw area under curve
      const areaGradient = ctx.createLinearGradient(0, padding, 0, height - padding);
      if (isLiveData) {
        areaGradient.addColorStop(0, 'rgba(34, 197, 94, 0.3)');
        areaGradient.addColorStop(0.5, 'rgba(59, 130, 246, 0.2)');
        areaGradient.addColorStop(1, 'rgba(147, 51, 234, 0.1)');
      } else {
        areaGradient.addColorStop(0, 'rgba(147, 51, 234, 0.3)');
        areaGradient.addColorStop(0.5, 'rgba(99, 102, 241, 0.2)');
        areaGradient.addColorStop(1, 'rgba(59, 130, 246, 0.1)');
      }

      ctx.fillStyle = areaGradient;
      ctx.beginPath();
      ctx.moveTo(points[0].x, height - padding);
      points.forEach((point, index) => {
        if (index === 0) {
          ctx.lineTo(point.x, point.y);
        } else {
          const prevPoint = points[index - 1];
          const cpx = (prevPoint.x + point.x) / 2;
          ctx.bezierCurveTo(cpx, prevPoint.y, cpx, point.y, point.x, point.y);
        }
      });
      ctx.lineTo(points[points.length - 1].x, height - padding);
      ctx.closePath();
      ctx.fill();

      // Draw line
      ctx.strokeStyle = isLiveData ? '#22C55E' : '#8B5CF6';
      ctx.lineWidth = 3;
      ctx.beginPath();
      points.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          const prevPoint = points[index - 1];
          const cpx = (prevPoint.x + point.x) / 2;
          ctx.bezierCurveTo(cpx, prevPoint.y, cpx, point.y, point.x, point.y);
        }
      });
      ctx.stroke();

      // Draw points
      points.forEach((point) => {
        // Outer circle
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(point.x, point.y, 6, 0, 2 * Math.PI);
        ctx.fill();

        // Inner circle
        ctx.fillStyle = isLiveData ? '#22C55E' : '#8B5CF6';
        ctx.beginPath();
        ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI);
        ctx.fill();
      });
    }

    // Draw labels
    ctx.fillStyle = '#6B7280';
    ctx.font = '12px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'center';
    
    points.forEach((point) => {
      // Date labels
      ctx.fillText(point.date.split(' ')[0], point.x, height - 10);
      
      // Values
      ctx.fillStyle = '#1F2937';
      ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText(point.value.toString(), point.x, point.y - 15);
      ctx.fillStyle = '#6B7280';
      ctx.font = '12px -apple-system, BlinkMacSystemFont, sans-serif';
    });

  }, [data, selectedGraphType, isLiveData]);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
          {isLiveData && (
            <div className="flex items-center gap-2 px-3 py-1 bg-green-100 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-700">Live Data</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          {/* Pollutant Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowPollutantDropdown(!showPollutantDropdown)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
            >
              <span className="font-medium text-gray-700">{selectedPollutantInfo?.label}</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>
            
            {showPollutantDropdown && (
              <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50 min-w-32">
                {pollutantOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSelectedPollutant(option.value);
                      setShowPollutantDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
                      selectedPollutant === option.value ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                    }`}
                  >
                    <div className="font-medium">{option.label}</div>
                    {option.unit && <div className="text-xs text-gray-500">{option.unit}</div>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Time Range Dropdown - Only show if showTimeRange is true */}
          {showTimeRange && (
            <div className="relative">
              <button
                onClick={() => setShowTimeDropdown(!showTimeDropdown)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
              >
                <span className="font-medium text-gray-700">
                  {timeRangeOptions.find(t => t.value === selectedTimeRange)?.label}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>
              
              {showTimeDropdown && (
                <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50 min-w-32">
                  {timeRangeOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSelectedTimeRange(option.value);
                        setShowTimeDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
                        selectedTimeRange === option.value ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Graph Type Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowGraphTypeDropdown(!showGraphTypeDropdown)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
            >
              {React.createElement(graphTypeOptions.find(g => g.value === selectedGraphType)?.icon || TrendingUp, {
                className: "w-4 h-4 text-gray-500"
              })}
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>
            
            {showGraphTypeDropdown && (
              <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50 min-w-40">
                {graphTypeOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSelectedGraphType(option.value);
                        setShowGraphTypeDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3 ${
                        selectedGraphType === option.value ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {option.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="w-full h-80 rounded-xl"
          style={{ width: '100%', height: '320px' }}
        />
      </div>
      
      <div className="mt-4 grid grid-cols-7 gap-2">
        {data.map((day, index) => (
          <div key={index} className="text-center p-2 rounded-lg bg-gray-50">
            <p className="text-xs text-gray-500 mb-1">{day.date}</p>
            <p className="font-semibold text-sm text-gray-800">
              {day.value}{selectedPollutantInfo?.unit}
            </p>
            <p className="text-xs text-gray-600">{day.quality}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnhancedAQIGraph;
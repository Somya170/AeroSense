import React, { useEffect, useRef, useState } from 'react';
import { HistoricalData } from '../types';
import { TrendingUp, ChevronDown, BarChart3 } from 'lucide-react';

interface HistoricalGraphProps {
  historical: HistoricalData[];
  city: string;
}

const HistoricalGraph: React.FC<HistoricalGraphProps> = ({ historical, city }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedPollutant, setSelectedPollutant] = useState('aqi');
  const [selectedTimeRange, setSelectedTimeRange] = useState('30days');
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
    { value: '7days', label: '7 Days' },
    { value: '30days', label: '30 Days' },
    { value: '90days', label: '90 Days' }
  ];

  const graphTypeOptions = [
    { value: 'line', label: 'Line Chart', icon: TrendingUp },
    { value: 'bar', label: 'Bar Chart', icon: BarChart3 }
  ];

  // Generate mock data based on selected pollutant
  const generatePollutantData = (pollutant: string) => {
    return historical.map(day => {
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
    const padding = 40;
    const graphWidth = width - padding * 2;
    const graphHeight = height - padding * 2;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(147, 51, 234, 0.1)');
    gradient.addColorStop(1, 'rgba(59, 130, 246, 0.1)');
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
        barGradient.addColorStop(0, '#8B5CF6');
        barGradient.addColorStop(1, '#3B82F6');

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
      areaGradient.addColorStop(0, 'rgba(147, 51, 234, 0.3)');
      areaGradient.addColorStop(0.5, 'rgba(99, 102, 241, 0.2)');
      areaGradient.addColorStop(1, 'rgba(59, 130, 246, 0.1)');

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
      ctx.strokeStyle = '#8B5CF6';
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
      points.forEach((point, index) => {
        if (index % 3 === 0) { // Show every 3rd point to avoid clutter
          // Outer circle
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
          ctx.fill();

          // Inner circle
          ctx.fillStyle = point.value <= 50 ? '#22C55E' : point.value <= 100 ? '#EAB308' : '#EF4444';
          ctx.beginPath();
          ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
          ctx.fill();
        }
      });
    }

    // Draw labels for every 5th point
    ctx.fillStyle = '#6B7280';
    ctx.font = '11px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'center';
    
    points.forEach((point, index) => {
      if (index % 5 === 0) {
        ctx.fillText(point.date, point.x, height - 10);
      }
    });

  }, [data, selectedGraphType]);

  const avgValue = data.reduce((sum, day) => sum + day.value, 0) / data.length;
  const trend = data[data.length - 1].value - data[0].value;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-purple-600" />
            Historical {selectedTimeRange === '7days' ? '7-Day' : selectedTimeRange === '30days' ? '30-Day' : '90-Day'} {selectedPollutantInfo?.label} Data
          </h3>
          <p className="text-sm text-gray-600 mt-1">{city} - Historical Analysis</p>
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

          {/* Time Range Dropdown */}
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

      <div className="flex items-center justify-end mb-4">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{Math.round(avgValue)}</p>
            <p className="text-xs text-gray-500">Avg {selectedPollutantInfo?.label}</p>
          </div>
          <div className="text-center">
            <p className={`text-2xl font-bold ${trend > 0 ? 'text-red-500' : 'text-green-500'}`}>
              {trend > 0 ? '+' : ''}{Math.round(trend)}
            </p>
            <p className="text-xs text-gray-500">{selectedTimeRange === '7days' ? '7d' : selectedTimeRange === '30days' ? '30d' : '90d'} Change</p>
          </div>
        </div>
      </div>
      
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="w-full h-64 rounded-xl"
          style={{ width: '100%', height: '256px' }}
        />
      </div>
      
      <div className="mt-4 flex items-center justify-center gap-6 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span>Good (≤50)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <span>Moderate (51-100)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span>Unhealthy (&gt; 100)</span>
        </div>
      </div>
    </div>
  );
};

export default HistoricalGraph;
import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, BarChart3, TrendingUp, Loader2, Zap, RefreshCw } from 'lucide-react';

interface DataPoint {
  date: string;
  value: number;
  quality: string;
}

interface InteractiveGraphProps {
  data: DataPoint[];
  title: string;
  city: string;
  showTimeRange?: boolean;
  showPollutantSelector?: boolean;
}

const InteractiveGraph: React.FC<InteractiveGraphProps> = ({ 
  data, 
  title, 
  city, 
  showTimeRange = true, 
  showPollutantSelector = true 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedPollutant, setSelectedPollutant] = useState('aqi');
  const [selectedTimeRange, setSelectedTimeRange] = useState('7days');
  const [selectedGraphType, setSelectedGraphType] = useState('line');
  const [showPollutantDropdown, setShowPollutantDropdown] = useState(false);
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [showGraphTypeDropdown, setShowGraphTypeDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; data: DataPoint } | null>(null);

  const pollutantOptions = [
    { value: 'aqi', label: 'AQI', unit: '', color: '#8B5CF6' },
    { value: 'pm25', label: 'PM2.5', unit: 'μg/m³', color: '#EF4444' },
    { value: 'pm10', label: 'PM10', unit: 'μg/m³', color: '#F97316' },
    { value: 'co2', label: 'CO₂', unit: 'ppm', color: '#10B981' },
    { value: 'o3', label: 'O₃', unit: 'ppb', color: '#3B82F6' },
    { value: 'no2', label: 'NO₂', unit: 'ppb', color: '#8B5CF6' },
    { value: 'so2', label: 'SO₂', unit: 'ppb', color: '#F59E0B' }
  ];

  const timeRangeOptions = [
    { value: '24hour', label: '24 Hours' },
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
    return data.map(day => {
      // Use day.aqi or day.value as the base value, with fallback to 0
      const baseValue = (day as any).aqi || day.value || 0;
      
      switch (pollutant) {
        case 'pm25':
          return { ...day, value: Math.floor(baseValue * 0.6) };
        case 'pm10':
          return { ...day, value: Math.floor(baseValue * 0.8) };
        case 'co2':
          return { ...day, value: Math.floor(baseValue * 0.3 + 400) };
        case 'o3':
          return { ...day, value: Math.floor(baseValue * 0.4) };
        case 'no2':
          return { ...day, value: Math.floor(baseValue * 0.3) };
        case 'so2':
          return { ...day, value: Math.floor(baseValue * 0.2) };
        default:
          return { ...day, value: baseValue };
      }
    });
  };

  const processedData = generatePollutantData(selectedPollutant);
  const selectedPollutantInfo = pollutantOptions.find(p => p.value === selectedPollutant);

  const refreshData = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRefreshing(false);
  };

  const handlePollutantChange = async (pollutant: string) => {
    setIsLoading(true);
    setSelectedPollutant(pollutant);
    setShowPollutantDropdown(false);
    
    // Simulate data loading
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsLoading(false);
  };

  const handleTimeRangeChange = async (timeRange: string) => {
    setIsLoading(true);
    setSelectedTimeRange(timeRange);
    setShowTimeDropdown(false);
    
    // Simulate data loading
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsLoading(false);
  };

  const handleCanvasMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || isLoading) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Calculate if mouse is near any data point
    const padding = 50;
    const graphWidth = canvas.offsetWidth - padding * 2;
    const values = processedData.map(d => d.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const range = maxValue - minValue || 1;

    const points = processedData.map((item, index) => ({
      x: padding + (index * graphWidth) / (processedData.length - 1),
      y: padding + (canvas.offsetHeight - padding * 2) - ((item.value - minValue) / range) * (canvas.offsetHeight - padding * 2),
      data: item
    }));

    // Find closest point
    const closestPoint = points.find(point => {
      const distance = Math.sqrt(Math.pow(point.x - x, 2) + Math.pow(point.y - y, 2));
      return distance < 15; // 15px radius
    });

    setHoveredPoint(closestPoint || null);
  };

  const handleCanvasMouseLeave = () => {
    setHoveredPoint(null);
  };

  useEffect(() => {
    if (isLoading) return;

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
    gradient.addColorStop(0, `${selectedPollutantInfo?.color}20`);
    gradient.addColorStop(1, `${selectedPollutantInfo?.color}05`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Get min and max values
    const values = processedData.map(d => d.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const range = maxValue - minValue || 1;

    // Calculate points
    const points = processedData.map((item, index) => ({
      x: padding + (index * graphWidth) / (processedData.length - 1),
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
      const barWidth = graphWidth / processedData.length * 0.6;
      points.forEach((point, index) => {
        const barHeight = ((point.value - minValue) / range) * graphHeight;
        const barX = point.x - barWidth / 2;
        const barY = height - padding - barHeight;

        // Bar gradient
        const barGradient = ctx.createLinearGradient(0, barY, 0, barY + barHeight);
        barGradient.addColorStop(0, selectedPollutantInfo?.color || '#8B5CF6');
        barGradient.addColorStop(1, `${selectedPollutantInfo?.color}80` || '#8B5CF680');

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
      areaGradient.addColorStop(0, `${selectedPollutantInfo?.color}40`);
      areaGradient.addColorStop(0.5, `${selectedPollutantInfo?.color}20`);
      areaGradient.addColorStop(1, `${selectedPollutantInfo?.color}05`);

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
      ctx.strokeStyle = selectedPollutantInfo?.color || '#8B5CF6';
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
        ctx.fillStyle = selectedPollutantInfo?.color || '#8B5CF6';
        ctx.beginPath();
        ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI);
        ctx.fill();
      });
    }

    // Draw labels
    ctx.fillStyle = '#6B7280';
    ctx.font = '12px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'center';
    
    points.forEach((point, index) => {
      if (index % Math.ceil(points.length / 6) === 0) {
        ctx.fillText(point.date.split(' ')[0], point.x, height - 10);
        
        // Values - ensure point.value is defined and is a number
        ctx.fillStyle = '#1F2937';
        ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, sans-serif';
        const valueText = (point.value || 0).toString();
        ctx.fillText(valueText, point.x, point.y - 15);
        ctx.fillStyle = '#6B7280';
        ctx.font = '12px -apple-system, BlinkMacSystemFont, sans-serif';
      }
    });

  }, [processedData, selectedGraphType, selectedPollutantInfo, isLoading]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-center h-80">
          <div className="text-center">
            <div className="relative w-16 h-16 mx-auto mb-4">
              {/* Animated chart loading */}
              <div className="absolute inset-0">
                <div className="w-full h-full border-4 border-purple-200 rounded-full animate-spin"></div>
                <div className="absolute inset-2 border-4 border-blue-200 rounded-full animate-spin animate-reverse"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-purple-600 animate-pulse" />
                </div>
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Loading Graph Data</h3>
            <p className="text-gray-600 mb-4">Fetching {selectedPollutantInfo?.label} data for {city}...</p>
            <div className="flex items-center justify-center gap-1">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
          <div className="flex items-center gap-2 px-3 py-1 bg-green-100 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-700">Live</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={refreshData}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 text-gray-600 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="text-sm font-medium text-gray-700">
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </span>
          </button>

          {/* Pollutant Dropdown */}
          {showPollutantSelector && (
            <div className="relative">
              <button
                onClick={() => setShowPollutantDropdown(!showPollutantDropdown)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
              >
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: selectedPollutantInfo?.color }}
                ></div>
                <span className="font-medium text-gray-700">{selectedPollutantInfo?.label}</span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>
              
              {showPollutantDropdown && (
                <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50 min-w-40">
                  {pollutantOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handlePollutantChange(option.value)}
                      className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3 ${
                        selectedPollutant === option.value ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                      }`}
                    >
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: option.color }}
                      ></div>
                      <div>
                        <div className="font-medium">{option.label}</div>
                        {option.unit && <div className="text-xs text-gray-500">{option.unit}</div>}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Time Range Dropdown */}
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
                      onClick={() => handleTimeRangeChange(option.value)}
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
          className="w-full h-80 rounded-xl cursor-crosshair"
          style={{ width: '100%', height: '320px' }}
          onMouseMove={handleCanvasMouseMove}
          onMouseLeave={handleCanvasMouseLeave}
        />
        
        {/* Hover Tooltip */}
        {hoveredPoint && (
          <div
            className="absolute bg-gray-900 text-white px-3 py-2 rounded-lg text-sm pointer-events-none z-10 shadow-lg"
            style={{
              left: hoveredPoint.x + 10,
              top: hoveredPoint.y - 10,
              transform: 'translateY(-100%)'
            }}
          >
            <div className="font-semibold">{hoveredPoint.data.date}</div>
            <div className="flex items-center gap-2">
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: selectedPollutantInfo?.color }}
              ></div>
              <span>{selectedPollutantInfo?.label}: {hoveredPoint.data.value}{selectedPollutantInfo?.unit}</span>
            </div>
            <div className="text-xs text-gray-300">{hoveredPoint.data.quality}</div>
          </div>
        )}
        
        {isRefreshing && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
              <p className="text-sm text-gray-600">Refreshing data...</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-4 grid grid-cols-7 gap-2">
        {processedData.slice(0, 7).map((day, index) => (
          <div key={index} className="text-center p-2 rounded-lg bg-gray-50">
            <p className="text-xs text-gray-500 mb-1">{day.date}</p>
            <p className="font-semibold text-sm text-gray-800">
              {day.value || 0}{selectedPollutantInfo?.unit}
            </p>
            <p className="text-xs text-gray-600">{day.quality}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InteractiveGraph;
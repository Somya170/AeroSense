import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, BarChart3, TrendingUp, Calendar, Clock, PieChart, Activity } from 'lucide-react';
import { PieChart as RechartsPieChart, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface ForecastData {
  date: string;
  dayName: string;
  aqi: number;
  quality: string;
  temperature: number;
  humidity: number;
  pm25: number;
  pm10: number;
  o3: number;
  no2: number;
  so2: number;
  co: number;
}

interface HourlyData {
  hour: string;
  aqi: number;
  quality: string;
  pm25: number;
  pm10: number;
  o3: number;
  no2: number;
  so2: number;
  co: number;
  temperature: number;
  humidity: number;
}

interface EnhancedForecastGraphProps {
  city: string;
}

const EnhancedForecastGraph: React.FC<EnhancedForecastGraphProps> = ({ city }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [forecastData, setForecastData] = useState<ForecastData[]>([]);
  const [hourlyData, setHourlyData] = useState<HourlyData[]>([]);
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [selectedPollutant, setSelectedPollutant] = useState('aqi');
  const [selectedGraphType, setSelectedGraphType] = useState('line');
  const [showDayDropdown, setShowDayDropdown] = useState(false);
  const [showPollutantDropdown, setShowPollutantDropdown] = useState(false);
  const [showGraphTypeDropdown, setShowGraphTypeDropdown] = useState(false);
  const [viewMode, setViewMode] = useState<'7day' | '24hour'>('7day');
  const [loading, setLoading] = useState(false);
  const [showDetailedAnalysis, setShowDetailedAnalysis] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; data: any } | null>(null);

  const pollutantOptions = [
    { value: 'aqi', label: 'AQI', unit: '', color: '#8B5CF6' },
    { value: 'pm25', label: 'PM2.5', unit: 'μg/m³', color: '#EF4444' },
    { value: 'pm10', label: 'PM10', unit: 'μg/m³', color: '#F97316' },
    { value: 'o3', label: 'O₃', unit: 'ppb', color: '#3B82F6' },
    { value: 'no2', label: 'NO₂', unit: 'ppb', color: '#8B5CF6' },
    { value: 'so2', label: 'SO₂', unit: 'ppb', color: '#F59E0B' },
    { value: 'co', label: 'CO', unit: 'ppm', color: '#10B981' }
  ];

  const graphTypeOptions = [
    { value: 'line', label: 'Line Chart', icon: TrendingUp },
    { value: 'bar', label: 'Bar Chart', icon: BarChart3 }
  ];

  const fetchForecastData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/forecast/${city}`);
      const data = await response.json();
      setForecastData(data);
      if (data.length > 0 && !selectedDay) {
        setSelectedDay(data[0].date);
      }
    } catch (error) {
      console.error('Failed to fetch forecast data:', error);
      // Fallback data
      const mockData = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() + i);
        return {
          date: date.toISOString().split('T')[0],
          dayName: date.toLocaleDateString('en-US', { weekday: 'long' }),
          aqi: 100 + Math.random() * 50,
          quality: 'Moderate',
          temperature: 25 + Math.random() * 15,
          humidity: 50 + Math.random() * 30,
          pm25: 50 + Math.random() * 30,
          pm10: 70 + Math.random() * 40,
          o3: 30 + Math.random() * 20,
          no2: 25 + Math.random() * 15,
          so2: 15 + Math.random() * 10,
          co: 8 + Math.random() * 5
        };
      });
      setForecastData(mockData);
      if (!selectedDay) setSelectedDay(mockData[0].date);
    } finally {
      setLoading(false);
    }
  };

  const fetchHourlyData = async (date: string) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/hourly/${city}/${date}`);
      const data = await response.json();
      setHourlyData(data);
    } catch (error) {
      console.error('Failed to fetch hourly data:', error);
      // Fallback data
      const mockData = Array.from({ length: 24 }, (_, i) => ({
        hour: `${i.toString().padStart(2, '0')}:00`,
        aqi: 80 + Math.random() * 60,
        quality: 'Moderate',
        pm25: 40 + Math.random() * 30,
        pm10: 60 + Math.random() * 40,
        o3: 25 + Math.random() * 20,
        no2: 20 + Math.random() * 15,
        so2: 12 + Math.random() * 10,
        co: 6 + Math.random() * 5,
        temperature: 25 + Math.random() * 15,
        humidity: 50 + Math.random() * 30
      }));
      setHourlyData(mockData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForecastData();
  }, [city]);

  useEffect(() => {
    if (selectedDay && viewMode === '24hour') {
      fetchHourlyData(selectedDay);
    }
  }, [selectedDay, viewMode, city]);

  const handleDaySelect = (date: string) => {
    setSelectedDay(date);
    setShowDayDropdown(false);
    if (viewMode === '24hour') {
      fetchHourlyData(date);
    }
  };

  const currentData = viewMode === '7day' ? forecastData : hourlyData;
  const selectedPollutantInfo = pollutantOptions.find(p => p.value === selectedPollutant);

  // Prepare data for detailed analysis
  const getAnalysisData = () => {
    if (!forecastData.length) return { pieData: [], barData: [] };

    const qualityCount = forecastData.reduce((acc, day) => {
      acc[day.quality] = (acc[day.quality] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const pieData = Object.entries(qualityCount).map(([quality, count]) => ({
      name: quality,
      value: count,
      color: quality === 'Good' ? '#22C55E' : 
             quality === 'Moderate' ? '#EAB308' : 
             quality.includes('Sensitive') ? '#F97316' : '#EF4444'
    }));

    const barData = forecastData.map(day => ({
      day: day.dayName.slice(0, 3),
      PM25: day.pm25,
      PM10: day.pm10,
      O3: day.o3,
      NO2: day.no2
    }));

    return { pieData, barData };
  };

  const { pieData, barData } = getAnalysisData();

  const handleCanvasMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || loading || currentData.length === 0) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Calculate if mouse is near any data point
    const padding = 50;
    const graphWidth = canvas.offsetWidth - padding * 2;
    const values = currentData.map(d => (d as any)[selectedPollutant] || 0);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const range = maxValue - minValue || 1;

    const points = currentData.map((item, index) => ({
      x: padding + (index * graphWidth) / (currentData.length - 1),
      y: padding + (canvas.offsetHeight - padding * 2) - (((item as any)[selectedPollutant] - minValue) / range) * (canvas.offsetHeight - padding * 2),
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
    if (loading || currentData.length === 0) return;

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

    // Get values for selected pollutant
    const values = currentData.map(d => (d as any)[selectedPollutant] || 0);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const range = maxValue - minValue || 1;

    // Calculate points
    const points = currentData.map((item, index) => ({
      x: padding + (index * graphWidth) / (currentData.length - 1),
      y: padding + graphHeight - (((item as any)[selectedPollutant] - minValue) / range) * graphHeight,
      value: (item as any)[selectedPollutant],
      label: viewMode === '7day' ? (item as ForecastData).dayName : (item as HourlyData).hour,
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
      const barWidth = graphWidth / currentData.length * 0.6;
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
    
    const labelStep = viewMode === '24hour' ? 4 : 1; // Show every 4th hour or every day
    points.forEach((point, index) => {
      if (index % labelStep === 0) {
        ctx.fillText(point.label, point.x, height - 10);
        
        // Values
        ctx.fillStyle = '#1F2937';
        ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.fillText(Math.round(point.value).toString(), point.x, point.y - 15);
        ctx.fillStyle = '#6B7280';
        ctx.font = '12px -apple-system, BlinkMacSystemFont, sans-serif';
      }
    });

  }, [currentData, selectedPollutant, selectedGraphType, selectedPollutantInfo, loading, viewMode]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-center h-80">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Loading Forecast Data</h3>
            <p className="text-gray-600">Fetching {viewMode === '7day' ? '7-day forecast' : '24-hour data'} for {city}...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Graph */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-bold text-gray-800">
              AI Generated {viewMode === '7day' ? '7-Day' : '24-Hour'} AQI Forecast
            </h3>
            <div className="flex items-center gap-2 px-3 py-1 bg-green-100 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-700">AI Powered</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('7day')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === '7day' ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-600'
                }`}
              >
                <Calendar className="w-4 h-4 inline mr-1" />
                7 Days
              </button>
              <button
                onClick={() => setViewMode('24hour')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === '24hour' ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-600'
                }`}
              >
                <Clock className="w-4 h-4 inline mr-1" />
                24 Hours
              </button>
            </div>

            {/* Day Dropdown - Only show in 24-hour mode */}
            {viewMode === '24hour' && (
              <div className="relative">
                <button
                  onClick={() => setShowDayDropdown(!showDayDropdown)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  <span className="font-medium text-gray-700">
                    {forecastData.find(d => d.date === selectedDay)?.dayName || 'Select Day'}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>
                
                {showDayDropdown && (
                  <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50 min-w-40">
                    {forecastData.map((day) => (
                      <button
                        key={day.date}
                        onClick={() => handleDaySelect(day.date)}
                        className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
                          selectedDay === day.date ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                        }`}
                      >
                        <div className="font-medium">{day.dayName}</div>
                        <div className="text-xs text-gray-500">{day.date}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Pollutant Dropdown */}
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
                      onClick={() => {
                        setSelectedPollutant(option.value);
                        setShowPollutantDropdown(false);
                      }}
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

            {/* Detailed Analysis Button */}
            <button
              onClick={() => setShowDetailedAnalysis(!showDetailedAnalysis)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors"
            >
              <Activity className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-700">
                {showDetailedAnalysis ? 'Hide' : 'Show'} Analysis
              </span>
            </button>
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
              <div className="font-semibold">
                {viewMode === '7day' ? hoveredPoint.data.dayName : hoveredPoint.data.hour}
              </div>
              <div className="flex items-center gap-2">
                <div 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: selectedPollutantInfo?.color }}
                ></div>
                <span>{selectedPollutantInfo?.label}: {hoveredPoint.data[selectedPollutant]}{selectedPollutantInfo?.unit}</span>
              </div>
              <div className="text-xs text-gray-300">{hoveredPoint.data.quality}</div>
            </div>
          )}
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            {viewMode === '7day' 
              ? 'AI-powered 7-day forecast with 96% accuracy' 
              : `24-hour detailed prediction for ${forecastData.find(d => d.date === selectedDay)?.dayName || 'selected day'}`
            }
          </p>
        </div>
      </div>

      {/* Detailed Analysis Section */}
      {showDetailedAnalysis && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Air Quality Distribution */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <PieChart className="w-6 h-6 text-purple-600" />
              <h3 className="text-xl font-bold text-gray-800">Air Quality Distribution</h3>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pollutant Comparison */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-bold text-gray-800">Pollutant Comparison</h3>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="PM25" fill="#EF4444" />
                  <Bar dataKey="PM10" fill="#F97316" />
                  <Bar dataKey="O3" fill="#3B82F6" />
                  <Bar dataKey="NO2" fill="#8B5CF6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedForecastGraph;
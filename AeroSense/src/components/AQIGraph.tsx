import React, { useEffect, useRef } from 'react';
import { DailyForecast } from '../types';

interface AQIGraphProps {
  forecast: DailyForecast[];
}

const AQIGraph: React.FC<AQIGraphProps> = ({ forecast }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.1)');
    gradient.addColorStop(1, 'rgba(147, 51, 234, 0.1)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Get min and max AQI values
    const aqiValues = forecast.map(d => d.aqi);
    const minAqi = Math.min(...aqiValues);
    const maxAqi = Math.max(...aqiValues);
    const range = maxAqi - minAqi || 1;

    // Calculate points
    const points = forecast.map((data, index) => ({
      x: padding + (index * graphWidth) / (forecast.length - 1),
      y: padding + graphHeight - ((data.aqi - minAqi) / range) * graphHeight,
      aqi: data.aqi,
      date: data.date,
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

    // Draw area under curve
    const areaGradient = ctx.createLinearGradient(0, padding, 0, height - padding);
    areaGradient.addColorStop(0, 'rgba(34, 197, 94, 0.3)');
    areaGradient.addColorStop(0.5, 'rgba(59, 130, 246, 0.2)');
    areaGradient.addColorStop(1, 'rgba(147, 51, 234, 0.1)');

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
    ctx.strokeStyle = '#3B82F6';
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
      ctx.fillStyle = point.aqi <= 50 ? '#22C55E' : point.aqi <= 100 ? '#EAB308' : '#EF4444';
      ctx.beginPath();
      ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Draw labels
    ctx.fillStyle = '#6B7280';
    ctx.font = '12px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'center';
    
    points.forEach((point) => {
      // Date labels
      ctx.fillText(point.date.split(' ')[0], point.x, height - 10);
      
      // AQI values
      ctx.fillStyle = '#1F2937';
      ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText(point.aqi.toString(), point.x, point.y - 15);
      ctx.fillStyle = '#6B7280';
      ctx.font = '12px -apple-system, BlinkMacSystemFont, sans-serif';
    });

  }, [forecast]);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800">Previous 7-Day AQI Forecast</h3>
        <div className="flex items-center gap-4 text-sm text-gray-600">
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
            <span>Unhealthy ({'>'} 100)</span>
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
        {forecast.map((day, index) => (
          <div key={index} className="text-center p-2 rounded-lg bg-gray-50">
            <p className="text-xs text-gray-500 mb-1">{day.date}</p>
            <p className="font-semibold text-sm text-gray-800">{day.aqi}</p>
            <p className="text-xs text-gray-600">{day.quality}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AQIGraph;
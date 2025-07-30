import { AQIData, City } from '../types';

export const topCities: City[] = [
  { name: 'Delhi', aqi: 168, quality: 'Unhealthy' },
  { name: 'Mumbai', aqi: 95, quality: 'Moderate' },
  { name: 'Hyderabad', aqi: 92, quality: 'Moderate' },
  { name: 'Bhopal', aqi: 112, quality: 'Unhealthy for Sensitive Groups' },
  { name: 'Indore', aqi: 105, quality: 'Unhealthy for Sensitive Groups' },
  { name: 'Ahmedabad', aqi: 125, quality: 'Unhealthy for Sensitive Groups' },
  { name: 'Chennai', aqi: 78, quality: 'Moderate' },
  { name: 'Gwalior', aqi: 145, quality: 'Unhealthy for Sensitive Groups' },
  { name: 'Jaipur', aqi: 135, quality: 'Unhealthy for Sensitive Groups' },
  { name: 'Varanasi', aqi: 152, quality: 'Unhealthy' },
  { name: 'Nagpur', aqi: 98, quality: 'Moderate' },
  { name: 'Pune', aqi: 88, quality: 'Moderate' },
  { name: 'Lucknow', aqi: 158, quality: 'Unhealthy' },
  { name: 'Kanpur', aqi: 172, quality: 'Unhealthy' },
  { name: 'Patna', aqi: 165, quality: 'Unhealthy' },
  { name: 'Raipur', aqi: 118, quality: 'Unhealthy for Sensitive Groups' },
  { name: 'Ranchi', aqi: 102, quality: 'Unhealthy for Sensitive Groups' },
  { name: 'Bengaluru', aqi: 85, quality: 'Moderate' },
  { name: 'Kolkata', aqi: 142, quality: 'Unhealthy for Sensitive Groups' },
  { name: 'Surat', aqi: 108, quality: 'Unhealthy for Sensitive Groups' },
];

export const getAQIData = (city: string): AQIData => {
  const cityData = topCities.find(c => c.name.toLowerCase() === city.toLowerCase()) || topCities[0];
  
  return {
    city: cityData.name,
    aqi: cityData.aqi,
    quality: cityData.quality,
    pollutants: {
      pm25: Math.floor(cityData.aqi * 0.6),
      pm10: Math.floor(cityData.aqi * 0.8),
      o3: Math.floor(cityData.aqi * 0.4),
      no2: Math.floor(cityData.aqi * 0.3),
      so2: Math.floor(cityData.aqi * 0.2),
      co: Math.floor(cityData.aqi * 0.1),
    },
    recommendation: getRecommendation(cityData.quality),
    lastUpdated: new Date().toLocaleString(),
    forecast: generateForecast(cityData.aqi),
    historical: generateHistoricalData(cityData.aqi),
  };
};

const getRecommendation = (quality: string): string => {
  switch (quality) {
    case 'Good':
      return 'Great day for outdoor activities! Air quality is excellent.';
    case 'Moderate':
      return 'Air quality is acceptable. Sensitive individuals should consider limiting prolonged outdoor exertion.';
    case 'Unhealthy for Sensitive Groups':
      return 'Members of sensitive groups may experience health effects. Consider wearing N95 masks outdoors.';
    case 'Unhealthy':
      return 'Everyone may begin to experience health effects. Use air purifiers indoors and wear masks outdoors.';
    case 'Very Unhealthy':
      return 'Health warnings of emergency conditions. Stay indoors and use high-quality air purifiers.';
    case 'Hazardous':
      return 'Health alert: everyone may experience serious health effects. Avoid outdoor activities completely.';
    default:
      return 'Air quality information is currently unavailable.';
  }
};

const generateForecast = (baseAqi: number) => {
  const forecast = [];
  const today = new Date();
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    const variation = Math.floor(Math.random() * 30) - 15;
    const dayAqi = Math.max(20, Math.min(200, baseAqi + variation));
    
    forecast.push({
      date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      aqi: dayAqi,
      quality: getQualityFromAqi(dayAqi),
      temperature: Math.floor(Math.random() * 15) + 25,
      humidity: Math.floor(Math.random() * 40) + 40,
    });
  }
  
  return forecast;
};

const generateHistoricalData = (baseAqi: number) => {
  const historical = [];
  const today = new Date();
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    const variation = Math.floor(Math.random() * 40) - 20;
    const dayAqi = Math.max(15, Math.min(250, baseAqi + variation));
    
    historical.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      aqi: dayAqi,
      quality: getQualityFromAqi(dayAqi),
    });
  }
  
  return historical;
};

const getQualityFromAqi = (aqi: number): string => {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very Unhealthy';
  return 'Hazardous';
};

export const getAIInsight = (forecast: any[]): string => {
  const avgAqi = forecast.reduce((sum, day) => sum + day.aqi, 0) / forecast.length;
  
  const insights = [
    "🌱 Based on meteorological patterns and pollution trends, the next 7 days show promising air quality improvements. Perfect time for morning walks and outdoor yoga!",
    "⚠️ Air quality analysis indicates moderate pollution levels ahead. Consider indoor workouts and keep windows closed during peak traffic hours.",
    "🚨 Pollution forecasting models predict concerning air quality. Stock up on N95 masks and consider investing in a HEPA air purifier for your home.",
    "✨ Weather patterns suggest cleaner air is coming! Light winds and expected rainfall will help clear pollutants. Great week for outdoor activities.",
    "🌿 AI models show stable, moderate air quality. Sensitive individuals should monitor conditions and limit prolonged outdoor exposure during midday hours.",
    "💨 Atmospheric analysis indicates fluctuating pollution levels. Morning hours will be cleaner - perfect for jogging and outdoor exercise routines.",
  ];
  
  if (avgAqi <= 50) {
    return insights[0];
  } else if (avgAqi <= 75) {
    return insights[3];
  } else if (avgAqi <= 100) {
    return insights[4];
  } else if (avgAqi <= 130) {
    return insights[1];
  } else {
    return insights[2];
  }
};

export const getHealthMeasures = (aqi: number) => {
  if (aqi <= 50) {
    return {
      masks: [],
      purifiers: [],
      general: ['Enjoy outdoor activities', 'Perfect for morning jogs', 'Great day for cycling']
    };
  } else if (aqi <= 100) {
    return {
      masks: [
        { name: 'Cloth Mask', effectiveness: 'Basic protection', price: '₹50-100' },
        { name: 'Surgical Mask', effectiveness: 'Moderate protection', price: '₹5-15 per piece' }
      ],
      purifiers: [
        { name: 'Xiaomi Air Purifier 3H', roomSize: 'Up to 484 sq ft', price: '₹12,999', features: ['HEPA filter', 'App control'] },
        { name: 'Honeywell Air Touch A5', roomSize: 'Up to 500 sq ft', price: '₹15,999', features: ['Pre-filter + HEPA', 'Touch panel'] }
      ],
      general: ['Limit prolonged outdoor activities', 'Close windows during peak hours', 'Use air purifier in bedroom']
    };
  } else if (aqi <= 150) {
    return {
      masks: [
        { name: 'N95 Mask', effectiveness: 'High protection (95%)', price: '₹25-50 per piece' },
        { name: 'KN95 Mask', effectiveness: 'High protection (95%)', price: '₹20-40 per piece' },
        { name: 'P2 Respirator', effectiveness: 'Very high protection', price: '₹100-200' }
      ],
      purifiers: [
        { name: 'Dyson Pure Cool TP04', roomSize: 'Up to 800 sq ft', price: '₹45,900', features: ['HEPA + Carbon filter', 'Air multiplier', 'App control'] },
        { name: 'Blueair Blue Pure 211+', roomSize: 'Up to 540 sq ft', price: '₹25,999', features: ['3-stage filtration', 'Energy efficient'] },
        { name: 'Coway Airmega 150', roomSize: 'Up to 214 sq ft', price: '₹18,999', features: ['4-stage filtration', 'Smart mode'] }
      ],
      general: ['Wear masks outdoors', 'Avoid outdoor exercise', 'Keep air purifiers running', 'Stay hydrated']
    };
  } else {
    return {
      masks: [
        { name: 'N99 Mask', effectiveness: 'Maximum protection (99%)', price: '₹150-300 per piece' },
        { name: 'P3 Respirator', effectiveness: 'Professional grade', price: '₹500-1000' },
        { name: 'Full Face Respirator', effectiveness: 'Complete protection', price: '₹2000-5000' }
      ],
      purifiers: [
        { name: 'IQAir HealthPro Plus', roomSize: 'Up to 1125 sq ft', price: '₹89,999', features: ['Medical grade HEPA', 'V5-Cell gas filter'] },
        { name: 'Austin Air HealthMate Plus', roomSize: 'Up to 1500 sq ft', price: '₹65,999', features: ['4-stage filtration', '5-year warranty'] },
        { name: 'Rabbit Air MinusA2', roomSize: 'Up to 815 sq ft', price: '₹55,999', features: ['6-stage filtration', 'Wall mountable'] }
      ],
      general: ['Stay indoors', 'Seal windows and doors', 'Use multiple air purifiers', 'Avoid all outdoor activities', 'Consult doctor if breathing issues']
    };
  }
};
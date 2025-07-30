export interface User {
  name: string;
  city: string;
  age: number;
  phone: string;
}


export interface AQIData {
  city: string;
  aqi: number;
  quality: 'Good' | 'Moderate' | 'Unhealthy for Sensitive Groups' | 'Unhealthy' | 'Very Unhealthy' | 'Hazardous';
  pollutants: {
    pm25: number;
    pm10: number;
    o3: number;
    no2: number;
    so2: number;
    co: number;
  };
  recommendation: string;
  lastUpdated: string;
  forecast: DailyForecast[];
  historical: HistoricalData[];
}

export interface DailyForecast {
  date: string;
  aqi: number;
  quality: string;
  temperature: number;
  humidity: number;
}

export interface HistoricalData {
  date: string;
  aqi: number;
  quality: string;
}

export interface City {
  name: string;
  aqi: number;
  quality: 'Good' | 'Moderate' | 'Unhealthy for Sensitive Groups' | 'Unhealthy' | 'Very Unhealthy' | 'Hazardous';
}

export interface HealthMeasure {
  masks: Array<{
    name: string;
    effectiveness: string;
    price: string;
  }>;
  purifiers: Array<{
    name: string;
    roomSize: string;
    price: string;
    features: string[];
  }>;
  general: string[];
}
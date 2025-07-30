import React, { useState, useEffect } from 'react';
import { User, AQIData } from '../types';
import Sidebar from './Sidebar';
import CityDropdown from './CityDropdown';
import AQIDetails from './AQIDetails';
import EnhancedForecastGraph from './EnhancedForecastGraph';
import AIPredictor from './AIPredictor';
import HistoricalGraph from './HistoricalGraph';
import AboutPage from './AboutPage';
import WeatherDashboard from './WeatherDashboard';
import Analytics from './Analytics';
import LeafletMap from './LeafletMap';
import InteractiveGraph from './InteractiveGraph';
import AQICalculator from './AQICalculator';
import LoadingScreen from './LoadingScreen';
import Chatbot from './Chatbot';
import { getAQIData, topCities } from '../data/mockData';
import { Search, User as UserIcon, Wind, Zap, Sparkles } from 'lucide-react';

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedCity, setSelectedCity] = useState(user.city);
  const [aqiData, setAqiData] = useState<AQIData>(getAQIData(user.city));
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [targetView, setTargetView] = useState('dashboard');

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    setAqiData(getAQIData(city));
    setSearchQuery('');
    setShowSearchResults(false);
  };

  const handleViewChange = async (view: string) => {
    if (view !== activeView) {
      setTargetView(view);
      setIsLoading(true);
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLoadingComplete = () => {
    setActiveView(targetView);
    setIsLoading(false);
  };

  const filteredCities = topCities.filter(city =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getAQIColorDot = (aqi: number) => {
    if (aqi <= 50) return 'bg-green-500';
    if (aqi <= 100) return 'bg-yellow-500';
    if (aqi <= 150) return 'bg-orange-500';
    if (aqi <= 200) return 'bg-red-500';
    return 'bg-purple-500';
  };

  // Show loading screen when switching views
  if (isLoading) {
    return <LoadingScreen user={user} targetView={targetView} onComplete={handleLoadingComplete} />;
  }

  const renderContent = () => {
    switch (activeView) {
      case 'ai-predictor':
        return <AIPredictor data={aqiData} />;
      case 'analytics':
        return <Analytics data={aqiData} />;
      case 'weather':
        return <WeatherDashboard city={selectedCity} />;
      case 'calculator':
        return <AQICalculator />;
      case 'about':
        return <AboutPage />;
      default:
        return (
          <div className="space-y-6">
            {/* Leaflet Map */}
            <LeafletMap selectedCity={selectedCity} onCitySelect={handleCityChange} />
            
            {/* AQI Details */}
            <AQIDetails data={aqiData} onNavigateToAnalytics={() => handleViewChange('analytics')} />
            
            {/* Enhanced Forecast Graph */}
            <EnhancedForecastGraph city={selectedCity} />
            
            {/* Historical Graph */}
            <InteractiveGraph 
              data={aqiData.historical} 
              title="Historical AQI Data"
              city={aqiData.city}
              showTimeRange={true}
              showPollutantSelector={true}
            />
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar activeView={activeView} onViewChange={handleViewChange} />
      
      <div className="flex-1 overflow-hidden">
        {/* Header */}
        <header className="bg-white/90 backdrop-blur-sm shadow-sm border-b border-gray-200 px-8 py-4 relative z-40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                {activeView === 'dashboard' && 'Dashboard'}
                {activeView === 'ai-predictor' && 'AI Health Assistant'}
                {activeView === 'analytics' && 'Analytics & Trends'}
                {activeView === 'weather' && 'Weather Dashboard'}
                {activeView === 'calculator' && 'AQI Calculator'}
                {activeView === 'about' && 'About'}
              </h1>
              {activeView !== 'about' && activeView !== 'calculator' && (
                <CityDropdown selectedCity={selectedCity} onCityChange={handleCityChange} />
              )}
            </div>
            
            <div className="flex items-center gap-4">
              {activeView !== 'about' && activeView !== 'calculator' && (
                <div className="relative">
                  <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search Indian cities..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSearchResults(e.target.value.length > 0);
                    }}
                    onFocus={() => setShowSearchResults(searchQuery.length > 0)}
                    className="pl-10 pr-4 py-2 bg-white/70 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm w-64"
                  />
                  
                  {/* Search Results Dropdown */}
                  {showSearchResults && filteredCities.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50 max-h-80 overflow-y-auto">
                      {filteredCities.map((city) => (
                        <button
                          key={city.name}
                          onClick={() => handleCityChange(city.name)}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors duration-150 text-left"
                        >
                          <div className={`w-3 h-3 rounded-full ${getAQIColorDot(city.aqi)}`}></div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-800">{city.name}</p>
                            <p className="text-sm text-gray-500">AQI: {city.aqi} - {city.quality}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              <div className="flex items-center gap-3 px-4 py-2 bg-white/70 rounded-xl border border-gray-200 backdrop-blur-sm">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                  <UserIcon className="w-4 h-4 text-white" />
                </div>
                <span className="font-medium text-gray-700">{user.name}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-8 overflow-y-auto h-[calc(100vh-80px)] bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30">
          {renderContent()}
        </main>
      </div>

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
};

export default Dashboard;
import React from 'react';
import { BarChart3, Brain, Home, Info, MapPin, Cloud, Calculator } from 'lucide-react';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange }) => {
  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'ai-predictor', icon: Brain, label: 'AI Health Assistant' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics & Trends' },
    { id: 'weather', icon: Cloud, label: 'Weather' },
    { id: 'calculator', icon: Calculator, label: 'AQI Calculator' },
    { id: 'about', icon: Info, label: 'About' },
  ];

  return (
    <div className="w-64 bg-white shadow-xl h-screen flex flex-col border-r border-gray-100">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <MapPin className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">AQI Monitor</h1>
            <p className="text-sm text-gray-500">Indian Cities Dashboard</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-purple-50 to-blue-50 text-purple-700 shadow-md border border-purple-100'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-purple-600' : 'text-gray-500'}`} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-700">Live Data</span>
          </div>
          <p className="text-xs text-green-600">Real-time monitoring from Indian cities</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
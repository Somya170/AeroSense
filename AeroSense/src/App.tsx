import React, { useState } from 'react';
import InitialForm from './components/InitialForm';
import LoadingScreen from './components/LoadingScreen';
import Dashboard from './components/Dashboard';
import { User } from './types';

interface AQIResult {
  name: string;
  city: string;
  aqi: number;
  quality: string;
  advice: string;
  timestamp: string;
}


function App() {
  const [currentView, setCurrentView] = useState<'form' | 'loading' | 'dashboard'>('form');
  const [user, setUser] = useState<User | null>(null);
  const [result, setResult] = useState<AQIResult | null>(null);


  const handleSubmit = async (user: User) => {
    const res = await fetch("http://localhost:5000/api/predict-aqi", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(user)
    });

    const data = await res.json();
    setResult(data);
    setResult(data); // Save the result to display below

  };

  const handleFormSubmit = async (userData: User) => {
    setUser(userData);
    setCurrentView('loading');
    await handleSubmit(userData); // 👈 Call the prediction API
  };

  const handleLoadingComplete = () => {
    setCurrentView('dashboard');
  };

  if (currentView === 'form') {
    return <InitialForm onSubmit={handleFormSubmit} />;
  }

  if (currentView === 'loading' && user) {
    return <LoadingScreen user={user} onComplete={handleLoadingComplete} />;
  }

  if (currentView === 'dashboard' && user) {
    return <Dashboard user={user} />;
  
  }
  {result && (
  <div className="mt-8 bg-white shadow-xl rounded-2xl p-6 max-w-md mx-auto border border-purple-100">
    <h2 className="text-xl font-bold text-purple-700 mb-2">Hello, {result.name} 👋</h2>
    <p className="text-gray-600 text-sm mb-2">
      📍 <strong>{result.city}</strong> | AQI: <strong>{result.aqi}</strong> ({result.quality})
    </p>
    <p className="text-gray-700 mt-4">
      🫁 <strong>Health Advice:</strong><br />{result.advice}
    </p>
    <p className="text-xs text-gray-400 mt-4">Updated at: {new Date(result.timestamp).toLocaleString()}</p>
  </div>
)}

  

  return null;
}

export default App;

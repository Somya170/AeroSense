# AQI Monitor - Air Quality Index Monitoring System

A comprehensive air quality monitoring system for Indian cities with real-time data, AI-powered predictions, and health recommendations.

## Features

### 🗺️ Interactive Map
- **Leaflet.js integration** with OpenStreetMap
- Real-time city markers with AQI values
- Detailed popups with pollutant information
- Live data updates every 5 minutes

### 📊 Enhanced Graphs
- **AI-Generated 7-Day Forecast** with 24-hour drill-down
- Multiple pollutant selection (PM2.5, PM10, O₃, NO₂, SO₂, CO)
- Interactive hover details
- Line and bar chart options
- Historical data analysis

### 🧮 AQI Calculator
- Calculate AQI from individual pollutant concentrations
- Real-time health recommendations
- EPA standard compliance
- Professional-grade accuracy

### 🤖 AI Health Assistant
- Personalized health recommendations
- Mask and air purifier suggestions
- Real-time health risk assessment
- Weather-based activity suggestions

### 🌤️ Weather Dashboard
- Comprehensive weather information
- 10-day forecasts
- Health suggestions based on weather
- Temperature, humidity, and pressure data

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Leaflet.js** for interactive maps
- **Lucide React** for icons
- **Vite** for development and building

### Backend
- **Flask** (Python web framework)
- **Flask-CORS** for cross-origin requests
- **RESTful API** design
- Real-time data processing

### Development Tools
- **ESLint** for code linting
- **TypeScript** for type safety
- **PostCSS** and **Autoprefixer**

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- Python (v3.8 or higher)
- npm or yarn

### Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Backend Setup
```bash
# Install Python dependencies
pip install -r requirements.txt

# Start Flask server
python app.py
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## API Endpoints

### Cities Data
- `GET /api/cities` - Get all cities with current AQI data
- `GET /api/city/<city_name>` - Get specific city details

### Forecasting
- `GET /api/forecast/<city_name>` - Get 7-day forecast
- `GET /api/hourly/<city_name>/<date>` - Get 24-hour data for specific date

### AQI Calculator
- `POST /api/calculate-aqi` - Calculate AQI from pollutant concentrations

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── LeafletMap.tsx          # Interactive map with Leaflet
│   │   ├── EnhancedForecastGraph.tsx # AI forecast with 24h drill-down
│   │   ├── AQICalculator.tsx       # AQI calculation tool
│   │   ├── LoadingScreen.tsx       # Dynamic loading screens
│   │   ├── Dashboard.tsx           # Main dashboard
│   │   ├── AboutPage.tsx           # Team and project info
│   │   └── ...
│   ├── data/
│   │   └── mockData.ts             # Mock data and utilities
│   ├── types/
│   │   └── index.ts                # TypeScript type definitions
│   └── ...
├── app.py                          # Flask backend server
├── requirements.txt                # Python dependencies
└── package.json                    # Node.js dependencies
```

## Team

### 👥 Development Team (4 Members)

1. **Arjun Sharma** - Full Stack Developer & Team Lead
   - React, Node.js, Python, Machine Learning, Flask

2. **Priya Patel** - AI/ML Engineer
   - TensorFlow, Python, Data Science, Deep Learning, Scikit-learn

3. **Rohit Kumar** - Frontend Developer
   - React, TypeScript, Tailwind CSS, UI/UX Design, Leaflet.js

4. **Sneha Gupta** - Backend Developer & Data Engineer
   - Flask, PostgreSQL, Redis, Docker, AWS, Data Engineering

## Features in Detail

### 🗺️ Interactive Map Features
- **Real-time data fetching** from Flask API
- **Custom AQI markers** with color-coded values
- **Detailed tooltips** showing all pollutant data
- **Smooth animations** and hover effects
- **Auto-refresh** functionality

### 📊 Enhanced Graph Features
- **Dual-mode display**: 7-day overview + 24-hour drill-down
- **Multiple pollutants**: AQI, PM2.5, PM10, O₃, NO₂, SO₂, CO
- **Interactive controls**: Time range, graph type, pollutant selection
- **Hover tooltips** with detailed information
- **Loading animations** with progress indicators

### 🧮 AQI Calculator Features
- **EPA-compliant calculations** using official breakpoints
- **Real-time health recommendations** based on calculated AQI
- **Input validation** and error handling
- **Professional accuracy** for research and monitoring

### 🎨 Enhanced UI/UX
- **Dynamic loading screens** that adapt to the target view
- **Smooth transitions** between different sections
- **Responsive design** for all screen sizes
- **Clean, modern interface** with consistent styling

## Development

### Running in Development Mode
```bash
# Terminal 1: Start Flask backend
python app.py

# Terminal 2: Start React frontend
npm run dev
```

### Building for Production
```bash
# Build frontend
npm run build

# Preview production build
npm run preview
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

- **Team Email**: team@aqimonitor.com
- **GitHub**: https://github.com/aqimonitor
- **Project Website**: https://aqimonitor.com

---

Built with ❤️ for cleaner air in Indian cities.
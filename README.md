# Jalrakshak - Water-Borne Disease Early Warning System

A comprehensive government health dashboard for monitoring and preventing water-borne disease outbreaks in rural India, specifically designed for the District Health Department of Assam.

## 🌟 Overview

Jalrakshak is an interactive web-based dashboard that provides real-time monitoring and early warning capabilities for water-borne disease outbreaks. The system helps health officials track symptom reports, monitor water sources, and coordinate public health responses across rural villages.

## 🚀 Features

### 📊 Real-time Dashboard
- **Live Statistics**: Track total reports, active alerts, high-risk villages, and new cases
- **Interactive Maps**: Visualize disease clusters and water source locations using Leaflet maps
- **Data Visualization**: Charts and graphs showing symptom trends and timeline data
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

### 🗺️ Interactive Mapping
- **Symptom Clustering**: Identify outbreak hotspots with geographic clustering
- **Water Source Monitoring**: Track contamination status of wells, boreholes, rivers, and tanks
- **Village-level Data**: Detailed information for each affected village
- **Real-time Updates**: Live updates as new reports come in

### 🚨 Alert System
- **Multi-level Alerts**: High, medium, and low priority alerts
- **Smart Triggers**: Automatic alerts based on symptom clusters and environmental factors
- **Status Tracking**: Monitor alert investigation and resolution progress
- **Timeline View**: Historical alert data and response times

### 📈 Data Analytics
- **Symptom Analysis**: Breakdown of reported symptoms and severity levels
- **Trend Analysis**: Time-series data showing outbreak progression
- **Demographic Insights**: Age and gender distribution of affected individuals
- **Environmental Correlation**: Rainfall and water source contamination data

### 🔐 User Management
- **Secure Login**: Role-based access control for health officials
- **Session Management**: Secure authentication and logout functionality
- **User-friendly Interface**: Intuitive design for non-technical users

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **UI Framework**: shadcn/ui components with Tailwind CSS
- **Maps**: Leaflet with React-Leaflet
- **Charts**: Recharts for data visualization
- **Routing**: React Router DOM
- **State Management**: React Query for server state
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   ├── Dashboard.tsx   # Main dashboard component
│   ├── InteractiveMap.tsx # Map visualization
│   ├── DataVisualization.tsx # Charts and graphs
│   ├── AlertPanel.tsx  # Alert management
│   └── LoginPage.tsx   # Authentication
├── data/               # Sample data and data utilities
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── pages/              # Page components
├── types/              # TypeScript type definitions
└── main.tsx           # Application entry point
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd jal-spotter-dash-main
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```
   > Note: Use `--legacy-peer-deps` to resolve React version conflicts with react-leaflet

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:8080`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📊 Data Structure

### Symptom Reports
```typescript
interface SymptomReport {
  id: string;
  village: string;
  coordinates: [number, number];
  symptoms: string[];
  severity: 'mild' | 'moderate' | 'severe';
  reportedAt: Date;
  waterSource?: string;
  reporterAge?: number;
  reporterGender?: 'male' | 'female' | 'other';
}
```

### Water Sources
```typescript
interface WaterSource {
  id: string;
  name: string;
  type: 'well' | 'borehole' | 'river' | 'pond' | 'tank';
  coordinates: [number, number];
  status: 'safe' | 'caution' | 'contaminated';
  lastTested?: Date;
  reports: string[];
}
```

### Alerts
```typescript
interface Alert {
  id: string;
  village: string;
  level: 'high' | 'medium' | 'low';
  trigger: string;
  description: string;
  timestamp: Date;
  status: 'active' | 'investigating' | 'resolved';
  reportCount: number;
}
```

## 🎯 Use Cases

### For Health Officials
- **Outbreak Detection**: Identify disease clusters early through symptom mapping
- **Resource Allocation**: Prioritize response efforts based on alert levels
- **Water Source Management**: Track and manage contaminated water sources
- **Public Communication**: Coordinate messaging and response strategies

### For Field Workers
- **Mobile Access**: Use the responsive dashboard on tablets and phones
- **Real-time Updates**: Get instant notifications of new cases and alerts
- **Location-based Data**: Access village-specific information in the field

### For Administrators
- **Data Analytics**: Generate reports and analyze trends
- **System Monitoring**: Track dashboard usage and performance
- **User Management**: Manage access for different health department roles

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:
```env
VITE_API_URL=your_api_endpoint
VITE_MAP_TILE_URL=your_map_tile_provider
```

### Customization
- **Map Configuration**: Modify map settings in `InteractiveMap.tsx`
- **Alert Thresholds**: Adjust alert triggers in the data processing logic
- **Styling**: Customize the design system in `tailwind.config.ts`
- **Data Sources**: Replace sample data with real API endpoints

## 📱 Mobile Support

The dashboard is fully responsive and optimized for:
- **Desktop**: Full-featured dashboard with all components
- **Tablet**: Optimized layout for touch interaction
- **Mobile**: Streamlined interface for field use

## 🔒 Security Features

- **Authentication**: Secure login system for authorized users
- **Data Validation**: Input validation and sanitization
- **HTTPS Ready**: Configured for secure deployment
- **Session Management**: Proper logout and session handling

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Deployment Options
- **Static Hosting**: Deploy to Netlify, Vercel, or similar platforms
- **Docker**: Containerize the application for cloud deployment
- **CDN**: Serve static assets through a content delivery network

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is developed for the District Health Department, Government of Assam. All rights reserved.

## 📞 Support

For technical support or questions about the Jalrakshak system, please contact the District Health Department IT team.

---

**Built with ❤️ for public health in rural India**

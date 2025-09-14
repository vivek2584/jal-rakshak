import { useState } from 'react';
import { DashboardHeader } from './DashboardHeader';
import { StatsCards } from './StatsCards';
import { InteractiveMap } from './InteractiveMap';
import { AlertPanel } from './AlertPanel';
import { DataVisualization } from './DataVisualization';
import { ActionHistory } from './AdvancedComponents/ActionHistory';
import { AIPathogenAssistant } from './AdvancedComponents/AIPathogenAssistant';
import { ExportTools } from './AdvancedComponents/ExportTools';
import { PublicSmsAlert } from './AdvancedComponents/PublicSmsAlert';
import { ResourceMonitor } from './AdvancedComponents/ResourceMonitor';
import { useDashboardData } from '../hooks/useDashboardData';

interface DashboardProps {
  onLogout: () => void;
}

export function Dashboard({ onLogout }: DashboardProps) {
  const [dateRange, setDateRange] = useState('7days');
  const { dashboardStats, symptomReports, symptomReportsMap, waterSources, waterSourcesMap, alerts, chartData, isLoading, error, setCenterCoordinates } = useDashboardData();

  if (isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-red-500">Error loading dashboard data: {error.message}</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader 
        onLogout={onLogout} 
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />
      
      <main className="mx-auto px-4 py-6 space-y-6 max-w-[120rem]">
        {/* Summary Statistics */}
        <StatsCards stats={dashboardStats} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-6 gap-6">
          {/* Left 3 columns: Map and Data Visualization */}
          <div className="xl:col-span-3 space-y-6">
            <InteractiveMap 
              reports={symptomReportsMap || []} 
              waterSources={waterSources || []} 
              onClusterClick={setCenterCoordinates}
            />
            <DataVisualization data={chartData} />
          </div>

          {/* Third Column: Alert Panel, Action History, and Public SMS Alert */}
          <div className="xl:col-span-2 flex flex-col space-y-4 h-full">
            <div className="flex-auto"><AlertPanel alerts={alerts || []} /></div>
            <div className="flex-auto"><ActionHistory /></div>
            <div className="flex-auto"><PublicSmsAlert /></div>
          </div>

          {/* Fourth & Fifth Column: Resource Monitor, AI Pathogen Assistant, and Export Tools */}
          <div className="xl:col-span-1 flex flex-col space-y-4 h-full">
            <div className="flex-auto"><ResourceMonitor /></div>
            <div className="flex-auto"><AIPathogenAssistant /></div>
            <div className="flex-auto"><ExportTools /></div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-sm text-muted-foreground py-4 border-t">
          <p>Jalrakshak - Water-Borne Disease Early Warning System</p>
          <p>© 2024 District Health Department, Government of Assam</p>
        </footer>
      </main>
    </div>
  );
}
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, AlertTriangle, MapPin, FileText } from 'lucide-react';
import { DashboardStats } from '../types/dashboard';

interface StatsCardsProps {
  stats: DashboardStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <Card className="border-l-4 border-l-health-primary">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Reports Today</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-health-primary">{stats.totalReportsToday}</div>
          <p className="text-xs text-muted-foreground">
            +{stats.newReports24h} from yesterday
          </p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-alert-high">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Cluster Alerts</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold">{stats.activeAlerts}</div>
            <Badge variant="destructive" className="bg-alert-high">
              Critical
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Requires immediate attention
          </p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-alert-medium">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">High-Risk Villages</CardTitle>
          <MapPin className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold">{stats.highRiskVillages}</div>
            <Badge 
              variant="secondary" 
              className="bg-alert-medium text-white"
            >
              Monitoring
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Under enhanced surveillance
          </p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-success">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Trend Analysis</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-success">+127%</div>
          <p className="text-xs text-muted-foreground">
            Increase since rainfall event
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
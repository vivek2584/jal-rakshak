import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Clock, MapPin, Activity } from 'lucide-react';
import { Alert } from '../types/dashboard';

interface AlertPanelProps {
  alerts: Alert[];
}

export function AlertPanel({ alerts }: AlertPanelProps) {
  const getAlertIcon = (level: string) => {
    return <AlertTriangle className={`w-4 h-4 ${
      level === 'high' ? 'text-alert-high' :
      level === 'medium' ? 'text-alert-medium' :
      'text-alert-low'
    }`} />;
  };

  const getAlertBadge = (level: string) => {
    const variants = {
      high: 'bg-alert-high text-white',
      medium: 'bg-alert-medium text-white',
      low: 'bg-alert-low text-black'
    };
    
    return (
      <Badge className={variants[level as keyof typeof variants]}>
        {level.toUpperCase()}
      </Badge>
    );
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (diffHours > 0) {
      return `${diffHours}h ago`;
    } else {
      return `${diffMinutes}m ago`;
    }
  };

  const handleAlertAction = (alertItem: Alert) => {
    if (alertItem.level === 'high') {
      window.alert('🚨 EMERGENCY PROTOCOL ACTIVATED\n\nVillage: ' + alertItem.village + 
            '\n\nImmediate Actions:\n• Medical team dispatched\n• Water testing initiated\n• Community isolation measures\n• Supply chain activated\n\nStatus: Response team en route');
    } else {
      window.alert('📋 MONITORING PROTOCOL INITIATED\n\nVillage: ' + alertItem.village + 
            '\n\nActions:\n• Enhanced surveillance activated\n• Local health workers notified\n• Water source inspection scheduled\n\nStatus: Under investigation');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-alert-high" />
          Active Alerts ({alerts.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-lg border-l-4 ${
                alert.level === 'high' ? 'border-l-alert-high bg-red-50/50' :
                alert.level === 'medium' ? 'border-l-alert-medium bg-orange-50/50' :
                'border-l-alert-low bg-yellow-50/50'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getAlertIcon(alert.level)}
                  <h4 className="font-semibold">{alert.village}</h4>
                  {getAlertBadge(alert.level)}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {formatTimeAgo(alert.timestamp)}
                </div>
              </div>

              <div className="space-y-2 mb-3">
                <div className="flex items-center gap-2 text-sm">
                  <Activity className="w-3 h-3 text-muted-foreground" />
                  <span className="font-medium">Trigger:</span>
                  <span>{alert.trigger}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-3 h-3 text-muted-foreground" />
                  <span className="font-medium">Reports:</span>
                  <span>{alert.reportCount} cases</span>
                </div>

                <p className="text-sm text-muted-foreground pl-5">
                  {alert.description}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    alert.status === 'active' ? 'bg-alert-high' :
                    alert.status === 'investigating' ? 'bg-alert-medium' :
                    'bg-success'
                  }`} />
                  <span className="text-xs font-medium capitalize">{alert.status}</span>
                </div>

                <Button
                  size="sm"
                  variant={alert.level === 'high' ? 'destructive' : 'outline'}
                  onClick={() => handleAlertAction(alert)}
                  className={alert.level === 'high' ? 'bg-alert-high hover:bg-alert-high/90' : ''}
                >
                  {alert.level === 'high' ? 'Emergency Response' : 'View Details'}
                </Button>
              </div>
            </div>
          ))}

          {alerts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No active alerts</p>
              <p className="text-sm">All districts are currently stable</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
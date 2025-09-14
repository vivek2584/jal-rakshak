import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Activity, Clock, User, MapPin } from 'lucide-react';
import { mockActionLogs } from '../../data/mockData';
import { useAuth } from '../../contexts/AuthContext';
import { translations } from '../../data/translations';
import { formatDistanceToNow } from 'date-fns';

export function ActionHistory() {
  const { language } = useAuth();
  const t = translations[language];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-500">Completed</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-health-primary" />
          {t.recentActions}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <div className="space-y-4">
            {mockActionLogs.map((log) => (
              <div 
                key={log.id} 
                className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="mt-1">
                  <Activity className="w-4 h-4 text-health-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {log.action}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDistanceToNow(log.timestamp, { addSuffix: true })}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {log.officer}
                    </div>
                    {log.village && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {log.village}
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-0.5">
                  {getStatusBadge(log.status)}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
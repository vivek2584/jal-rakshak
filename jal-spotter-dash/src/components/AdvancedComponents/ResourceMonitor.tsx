import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Package, AlertTriangle, Clock } from 'lucide-react';
import { mockResources, roiData } from '../../data/mockData';
import { useAuth } from '../../contexts/AuthContext';
import { translations } from '../../data/translations';

export function ResourceMonitor() {
  const { language } = useAuth();
  const t = translations[language];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-500';
      case 'low': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      good: 'default',
      low: 'secondary',
      critical: 'destructive'
    } as const;
    
    return variants[status as keyof typeof variants] || 'outline';
  };

  return (
    <div className="space-y-4">
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-health-primary" />
            {t.resourceStatus}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {mockResources.map((resource, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">{resource.name}</span>
                <Badge variant={getStatusBadge(resource.status)}>
                  {resource.current}/{resource.total}
                </Badge>
              </div>
              <Progress 
                value={(resource.current / resource.total) * 100} 
                className="h-2"
              />
              {resource.locations && (
                <p className="text-xs text-muted-foreground">
                  Locations: {resource.locations.join(', ')}
                </p>
              )}
            </div>
          ))}
          
          {/* Predictive Demand */}
          <div className="mt-6 p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-orange-600" />
              <span className="font-medium text-sm text-orange-800 dark:text-orange-200">
                Predicted 72h Need
              </span>
            </div>
            <p className="text-sm text-orange-700 dark:text-orange-300">
              200+ ORS kits, 5 beds for Youliwadi outbreak
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ROI Impact Calculator */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-green-600" />
            System Impact
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {roiData.casesPreventedThisMonth}
              </div>
              <div className="text-sm text-muted-foreground">Cases Prevented</div>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                ₹{(roiData.estimatedCostSavings / 100000).toFixed(1)}L
              </div>
              <div className="text-sm text-muted-foreground">Cost Savings</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4 text-center">
            <div className="p-2 bg-purple-50 dark:bg-purple-950/20 rounded">
              <div className="font-bold text-purple-600">{roiData.responseTime}</div>
              <div className="text-xs text-muted-foreground">Avg Response</div>
            </div>
            <div className="p-2 bg-teal-50 dark:bg-teal-950/20 rounded">
              <div className="font-bold text-teal-600">{roiData.alertAccuracy}%</div>
              <div className="text-xs text-muted-foreground">Alert Accuracy</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
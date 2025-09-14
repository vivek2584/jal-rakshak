import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart } from 'recharts';
import { TrendingUp, BarChart3, CloudRain } from 'lucide-react';
import { ChartData } from '../types/dashboard';

interface DataVisualizationProps {
  data: ChartData;
}

export function DataVisualization({ data }: DataVisualizationProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Symptoms Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Top Reported Symptoms (Last 7 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.symptoms}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="name" 
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
              />
              <Bar 
                dataKey="count" 
                fill="hsl(var(--health-primary))"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Timeline Chart with Rainfall */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Reports Timeline vs Rainfall
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={data.timeline}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="date" 
                fontSize={12}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return `${date.getMonth() + 1}/${date.getDate()}`;
                }}
              />
              <YAxis yAxisId="reports" fontSize={12} />
              <YAxis yAxisId="rainfall" orientation="right" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
                labelFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString();
                }}
              />
              
              {/* Rainfall bars */}
              <Bar 
                yAxisId="rainfall"
                dataKey="rainfall" 
                fill="hsl(var(--health-secondary))"
                opacity={0.6}
                name="Rainfall (mm)"
              />
              
              {/* Reports line */}
              <Line
                yAxisId="reports"
                type="monotone"
                dataKey="reports"
                stroke="hsl(var(--alert-high))"
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--alert-high))', strokeWidth: 2, r: 4 }}
                name="Symptom Reports"
              />
            </ComposedChart>
          </ResponsiveContainer>
          
          <div className="mt-4 flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-alert-high rounded-full" />
              <span>Symptom Reports</span>
            </div>
            <div className="flex items-center gap-2">
              <CloudRain className="w-4 h-4 text-health-secondary" />
              <span>Rainfall (mm)</span>
            </div>
          </div>

          <div className="mt-4 p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Analysis:</strong> Clear correlation between heavy rainfall event (Jan 28) 
              and subsequent spike in symptom reports. Peak occurred 24-48 hours post-rainfall, 
              indicating water contamination pathway.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
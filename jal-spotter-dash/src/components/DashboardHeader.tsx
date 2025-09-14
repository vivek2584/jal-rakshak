import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LogOut, Droplets, Shield, Calendar } from 'lucide-react';

interface DashboardHeaderProps {
  onLogout: () => void;
  dateRange: string;
  onDateRangeChange: (value: string) => void;
}

export function DashboardHeader({ onLogout, dateRange, onDateRangeChange }: DashboardHeaderProps) {
  return (
    <header className="bg-card border-b-2 border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Droplets className="w-8 h-8 text-health-primary" />
            <Shield className="w-5 h-5 text-health-secondary absolute -top-1 -right-1" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Jalrakshak Dashboard</h1>
            <p className="text-sm text-muted-foreground">District Health Monitoring System</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <Select value={dateRange} onValueChange={onDateRangeChange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="7days">Last 7 Days</SelectItem>
                <SelectItem value="30days">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="h-6 w-px bg-border" />

          <div className="text-right">
            <p className="text-sm font-medium">Dr. Sharma</p>
            <p className="text-xs text-muted-foreground">District Medical Officer</p>
          </div>

          <Button 
            variant="outline" 
            size="sm" 
            onClick={onLogout}
            className="gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
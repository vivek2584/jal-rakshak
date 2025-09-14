import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Droplets, Users, Building } from 'lucide-react';

interface LoginSelectionProps {
  onUserTypeSelect: (type: 'public' | 'government') => void;
}

export function LoginSelection({ onUserTypeSelect }: LoginSelectionProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-health-primary/10 via-background to-health-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="relative">
              <Droplets className="w-12 h-12 text-health-primary" />
              <Shield className="w-8 h-8 text-health-secondary absolute -top-2 -right-2" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">Jalrakshak</h1>
          </div>
          <p className="text-xl text-muted-foreground mb-2">Water-Borne Disease Early Warning System</p>
          <p className="text-muted-foreground">Choose your access type to continue</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Public User Login */}
          <Card className="border-2 hover:border-health-primary/50 transition-all duration-300 hover:shadow-lg cursor-pointer group" onClick={() => onUserTypeSelect('public')}>
            <CardHeader className="text-center pb-6">
              <div className="mx-auto mb-4 p-4 bg-health-primary/10 rounded-full group-hover:bg-health-primary/20 transition-colors">
                <Users className="w-12 h-12 text-health-primary" />
              </div>
              <CardTitle className="text-2xl">Public User</CardTitle>
              <CardDescription className="text-base">
                Access community health information and report symptoms
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-health-primary rounded-full"></div>
                  <span>View local water quality status</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-health-primary rounded-full"></div>
                  <span>Report water-borne disease symptoms</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-health-primary rounded-full"></div>
                  <span>Receive health alerts and advisories</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-health-primary rounded-full"></div>
                  <span>Access preventive care information</span>
                </div>
              </div>
              
              <Button 
                className="w-full bg-health-primary hover:bg-health-primary/90"
                size="lg"
              >
                <Users className="w-4 h-4 mr-2" />
                Continue as Public User
              </Button>
            </CardContent>
          </Card>

          {/* Government Worker Login */}
          <Card className="border-2 hover:border-health-secondary/50 transition-all duration-300 hover:shadow-lg cursor-pointer group" onClick={() => onUserTypeSelect('government')}>
            <CardHeader className="text-center pb-6">
              <div className="mx-auto mb-4 p-4 bg-health-secondary/10 rounded-full group-hover:bg-health-secondary/20 transition-colors">
                <Building className="w-12 h-12 text-health-secondary" />
              </div>
              <CardTitle className="text-2xl">Government Worker</CardTitle>
              <CardDescription className="text-base">
                Professional dashboard for health officials and administrators
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-health-secondary rounded-full"></div>
                  <span>Monitor district-wide health data</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-health-secondary rounded-full"></div>
                  <span>Manage emergency response protocols</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-health-secondary rounded-full"></div>
                  <span>Generate official reports and analytics</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-health-secondary rounded-full"></div>
                  <span>Coordinate with field teams</span>
                </div>
              </div>
              
              <Button 
                className="w-full bg-health-secondary hover:bg-health-secondary/90"
                size="lg"
              >
                <Shield className="w-4 h-4 mr-2" />
                Continue as Government Worker
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            Secure access powered by Government of Assam Health Department
          </p>
        </div>
      </div>
    </div>
  );
}
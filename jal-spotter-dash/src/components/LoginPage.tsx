import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Droplets, User, Lock, AlertCircle, Globe, ArrowLeft, Building } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { translations } from '../data/translations';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface LoginPageProps {
  onLogin: () => void;
  onBack: () => void;
}

export function LoginPage({ onLogin, onBack }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login, language, setLanguage } = useAuth();
  const { toast } = useToast();
  const t = translations[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const success = await login(username, password);
      if (success) {
        toast({
          title: "Login Successful",
          description: "Welcome to Jalrakshak Dashboard",
        });
        onLogin();
      } else {
        setError(t.loginError);
        toast({
          title: "Login Failed",
          description: t.loginError,
          variant: "destructive",
        });
      }
    } catch (err) {
      setError(t.loginError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-health-primary/10 via-background to-health-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="absolute top-4 left-4 gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <Droplets className="w-10 h-10 text-health-primary" />
              <Building className="w-6 h-6 text-health-secondary absolute -top-1 -right-1" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Jalrakshak</h1>
          </div>
          <p className="text-muted-foreground">Government Health Portal</p>
        </div>

        <Card className="border-2 animate-scale-in">
          <CardHeader className="text-center">
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1" />
              <div>
                <CardTitle className="text-2xl">Government Access</CardTitle>
                <CardDescription>
                  Professional dashboard for health officials
                </CardDescription>
              </div>
              <div className="flex-1 flex justify-end">
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-14"> {/* Changed width from w-12 to w-14 */}
                    <Globe className="w-4 h-4" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">EN</SelectItem>
                    <SelectItem value="as">অস</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20 animate-fade-in">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="username" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {t.username}
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder={t.username}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  {t.password}
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={t.password}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-health-primary hover:bg-health-primary/90 hover-scale"
                size="lg"
                disabled={isLoading}
              >
                <Shield className="w-4 h-4 mr-2" />
                {isLoading ? 'Logging in...' : t.loginButton}
              </Button>
              
              <div className="text-center">
                <button 
                  type="button" 
                  className="text-sm text-health-primary hover:underline story-link"
                  onClick={() => navigate('/forgot-password')} // Assuming a forgot password route
                >
                  {t.forgotPassword}
                </button>
              </div>
            </form>
            
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h4 className="font-medium text-sm mb-2">Demo Accounts:</h4>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p><strong>dr.sharma</strong> / health123 - District Medical Officer</p>
                <p><strong>coordinator.devi</strong> / asha456 - ASHA Coordinator</p>
                <p><strong>inspector.das</strong> / inspect789 - Health Inspector</p>
                <p><strong>analyst.goswami</strong> / data123 - Data Analyst</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

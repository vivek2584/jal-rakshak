import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Droplets, User, Lock, AlertCircle, Globe, ArrowLeft, Phone } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { translations } from '../data/translations';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PublicLoginPageProps {
  onLogin: () => void;
  onBack: () => void;
}

export function PublicLoginPage({ onLogin, onBack }: PublicLoginPageProps) {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { loginPublicUser, language, setLanguage } = useAuth();
  const { toast } = useToast();
  const t = translations[language];

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Simulate OTP sending
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsOtpSent(true);
      toast({
        title: "OTP Sent",
        description: `Verification code sent to ${phone}`,
      });
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Simulate OTP verification and login
      if (otp === '123456' || otp === '1234') {
        const success = await loginPublicUser(phone, otp);
        if (success) {
          toast({
            title: "Login Successful",
            description: "Welcome to Jalrakshak Community Portal",
          });
          onLogin();
        } else {
          setError('Invalid OTP. Please try again.');
        }
      } else {
        setError('Invalid OTP. Please enter 123456 or 1234 for demo.');
      }
    } catch (err) {
      setError('Verification failed. Please try again.');
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
              <User className="w-6 h-6 text-health-secondary absolute -top-1 -right-1" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Jalrakshak</h1>
          </div>
          <p className="text-muted-foreground">Community Health Portal</p>
        </div>

        <Card className="border-2 animate-scale-in">
          <CardHeader className="text-center">
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1" />
              <div>
                <CardTitle className="text-2xl">Public Access</CardTitle>
                <CardDescription>
                  Report symptoms and access health information
                </CardDescription>
              </div>
              <div className="flex-1 flex justify-end">
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-20">
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
            {!isOtpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                {error && (
                  <div className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20 animate-fade-in">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Mobile Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    We'll send you a verification code via SMS
                  </p>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-health-primary hover:bg-health-primary/90"
                  size="lg"
                  disabled={isLoading}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  {isLoading ? 'Sending OTP...' : 'Send Verification Code'}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                {error && (
                  <div className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20 animate-fade-in">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="otp" className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Verification Code
                  </Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    disabled={isLoading}
                    maxLength={6}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Code sent to {phone}
                  </p>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-health-primary hover:bg-health-primary/90"
                  size="lg"
                  disabled={isLoading}
                >
                  <Shield className="w-4 h-4 mr-2" />
                  {isLoading ? 'Verifying...' : 'Verify & Login'}
                </Button>
                
                <Button 
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => {
                    setIsOtpSent(false);
                    setOtp('');
                    setError('');
                  }}
                >
                  Use different number
                </Button>
              </form>
            )}
            
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h4 className="font-medium text-sm mb-2">Demo Access:</h4>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p><strong>Any phone number</strong> - Use OTP: <strong>123456</strong> or <strong>1234</strong></p>
                <p>Full access to community health features</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
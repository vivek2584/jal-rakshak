import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Droplets, 
  AlertTriangle, 
  Shield, 
  MapPin, 
  Users, 
  FileText, 
  Bell,
  CheckCircle,
  XCircle,
  Clock,
  Phone,
  User,
  Calendar,
  Thermometer,
  Globe,
  PhoneCall,
  AlertCircle,
  Book,
  Navigation,
  Star,
  Award,
  Play,
  Volume2,
  Download,
  Wifi,
  WifiOff
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { translations } from '../data/translations';
import { useToast } from '@/hooks/use-toast';
import { useDashboardData } from '../hooks/useDashboardData'; // Import the hook
import { formatDistanceToNow } from 'date-fns';

interface PublicDashboardProps {
  onLogout: () => void;
}

export function PublicDashboard({ onLogout }: PublicDashboardProps) {
  const [reportForm, setReportForm] = useState({
    symptoms: [] as string[],
    severity: '',
    duration: '',
    location: '',
    additionalInfo: ''
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isOffline, setIsOffline] = useState(false);
  const { user, language, setLanguage } = useAuth();
  const { toast } = useToast();
  const t = translations[language];

  // Fetch dashboard data from backend
  const { dashboardStats, alerts, waterSources, isLoading, error } = useDashboardData();

  if (isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading public dashboard data...</div>;
  }

  if (error) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-red-500">Error loading public dashboard data: {error.message}</div>;
  }

  // Derive overall water quality status (simplified for public view)
  const overallWaterQuality = alerts && alerts.some(alert => alert.level === 'high') ? 'high' : 
                            (alerts && alerts.some(alert => alert.level === 'medium') ? 'caution' : 'safe');

  const handleSymptomChange = (symptom: string, checked: boolean) => {
    setReportForm(prev => ({
      ...prev,
      symptoms: checked 
        ? [...prev.symptoms, symptom]
        : prev.symptoms.filter(s => s !== symptom)
    }));
  };

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Report Submitted",
      description: "Your symptom report has been recorded. Health officials will review it shortly.",
    });
    
    // Reset form
    setReportForm({
      symptoms: [],
      severity: '',
      duration: '',
      location: '',
      additionalInfo: ''
    });
  };

  const handleEmergencyReport = () => {
    toast({
      title: "Emergency Report Initiated",
      description: "You'll be connected to our emergency hotline. Stay on the line.",
    });
  };

  const playVoiceAlert = (message: string) => {
    toast({
      title: "Voice Alert Playing",
      description: message,
    });
  };

  // Using backend data for community status
  const communityStatus = {
    currentAlerts: dashboardStats?.activeAlerts || 0,
    waterQuality: overallWaterQuality,
    recentCases: dashboardStats?.newReports24h || 0, // Assuming newReports24h represents recent cases
    lastUpdate: dashboardStats?.lastUpdate ? formatDistanceToNow(new Date(dashboardStats.lastUpdate), { addSuffix: true }) : 'N/A',
    communityScore: 87, // Keep as mock data for now
    reportsSubmitted: 143, // Keep as mock data for now
    actionsCompleted: 12 // Keep as mock data for now
  };

  const symptoms = [
    'Diarrhea', 'Vomiting', 'Fever', 'Abdominal Pain', 
    'Nausea', 'Dehydration', 'Fatigue', 'Loss of Appetite'
  ];

  // waterSources is now fetched from useDashboardData
  
  // Using backend data for health alerts
  const healthAlerts = alerts?.map(alert => ({
    id: alert.id,
    title: alert.trigger,
    message: alert.description,
    level: alert.level,
    timestamp: formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true }),
    voiceMessage: 'Local language warning', // Mock voice message for now
    hasVoice: true,
  })) || [];

  const firstAidGuides = [
    { id: 1, title: 'How to Make ORS at Home', icon: '🧂', downloadSize: '2MB' },
    { id: 2, title: 'Water Purification Methods', icon: '💧', downloadSize: '1.5MB' },
    { id: 3, title: 'When to Seek Medical Help', icon: '🏥', downloadSize: '1MB' },
    { id: 4, title: 'Emergency Contacts', icon: '📞', downloadSize: '0.5MB' }
  ];

  const healthCenters = [
    { name: 'Primary Health Center', distance: '2.3 km', phone: '+91-9876543210', status: 'Open' },
    { name: 'Community Health Center', distance: '5.7 km', phone: '+91-9876543211', status: 'Open 24/7' },
    { name: 'District Hospital', distance: '12.4 km', phone: '+91-9876543212', status: 'Emergency' }
  ];

  const communityActions = [
    { date: '2 hours ago', action: 'Water testing team visited your area', status: 'completed' },
    { date: '1 day ago', action: 'Medical camp setup at Village Center', status: 'completed' },
    { date: '3 days ago', action: '25 symptom reports processed', status: 'completed' },
    { date: '1 week ago', action: 'ORS distribution drive completed', status: 'completed' }
  ];

  const safetyZones = [
    { name: 'Your Area (Youliwadi)', status: 'safe', alerts: 0, advice: 'Continue normal water use' },
    { name: 'Nearby Villages', status: 'caution', alerts: 2, advice: 'Boil water before drinking' },
    { name: 'Downstream Areas', status: 'high-alert', alerts: 5, advice: 'Use only bottled/treated water' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Droplets className="w-8 h-8 text-health-primary" />
                <User className="w-5 h-5 text-health-secondary absolute -top-1 -right-1" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Jalrakshak</h1>
                <p className="text-sm text-muted-foreground">Community Health Portal</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-20">
                  <Globe className="w-4 h-4" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">EN</SelectItem>
                  <SelectItem value="as">অস</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="text-right">
                <p className="text-sm font-medium">{user?.fullName || 'Community User'}</p>
                <p className="text-xs text-muted-foreground">Mobile: {user?.phone}</p>
              </div>
              
              <Button variant="outline" onClick={onLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="emergency">Emergency</TabsTrigger>
            <TabsTrigger value="safety-map">Safety Map</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Community Status Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-l-4 border-l-alert-high">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Active Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-alert-high">{communityStatus.currentAlerts}</div>
                  <p className="text-xs text-muted-foreground">Requires attention</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-alert-medium">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Droplets className="w-4 h-4" />
                    Water Quality
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge 
                    variant="secondary" 
                    className={`${
                      communityStatus.waterQuality === 'safe' ? 'bg-success' :
                      communityStatus.waterQuality === 'caution' ? 'bg-alert-medium' :
                      'bg-alert-high'
                    } text-white`}
                  >
                    {communityStatus.waterQuality.toUpperCase()}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">Overall status</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-health-primary">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Recent Cases
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-health-primary">{communityStatus.recentCases}</div>
                  <p className="text-xs text-muted-foreground">Last 7 days</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-success">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Last Update
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm font-bold text-success">{communityStatus.lastUpdate}</div>
                  <p className="text-xs text-muted-foreground">Data synced</p>
                </CardContent>
              </Card>
            </div>

            {/* Community Score & Gamification */}
            <Card className="bg-gradient-to-r from-health-primary/10 to-success/10 border-health-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-health-primary" />
                  Community Safety Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-3xl font-bold text-health-primary">{communityStatus.communityScore}/100</div>
                    <p className="text-sm text-muted-foreground">Village Safety Rating</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold">{communityStatus.reportsSubmitted}</div>
                    <p className="text-xs text-muted-foreground">Community Reports</p>
                  </div>
                </div>
                <Progress value={communityStatus.communityScore} className="mb-2" />
                <p className="text-sm text-center text-muted-foreground">
                  "Together we keep our community safe! Thank you for your participation."
                </p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Symptom Reporting */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-health-primary" />
                    Report Symptoms
                  </CardTitle>
                  <CardDescription>
                    Help us monitor community health by reporting any water-borne disease symptoms
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitReport} className="space-y-4">
                    <div>
                      <Label className="text-base font-medium">Symptoms (Select all that apply)</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {symptoms.map(symptom => (
                          <div key={symptom} className="flex items-center space-x-2">
                            <Checkbox
                              id={symptom}
                              checked={reportForm.symptoms.includes(symptom)}
                              onCheckedChange={(checked) => handleSymptomChange(symptom, !!checked)}
                            />
                            <Label htmlFor={symptom} className="text-sm">{symptom}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="severity">Severity Level</Label>
                        <Select value={reportForm.severity} onValueChange={(value) => setReportForm(prev => ({ ...prev, severity: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select severity" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mild">Mild</SelectItem>
                            <SelectItem value="moderate">Moderate</SelectItem>
                            <SelectItem value="severe">Severe</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="duration">Duration</Label>
                        <Select value={reportForm.duration} onValueChange={(value) => setReportForm(prev => ({ ...prev, duration: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="How long?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="few-hours">Few hours</SelectItem>
                            <SelectItem value="1-day">1 day</SelectItem>
                            <SelectItem value="2-3-days">2-3 days</SelectItem>
                            <SelectItem value="week">More than a week</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="location">Your Location/Village</Label>
                      <Input
                        id="location"
                        value={reportForm.location}
                        onChange={(e) => setReportForm(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="Enter your village/area name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="additionalInfo">Additional Information (Optional)</Label>
                      <Textarea
                        id="additionalInfo"
                        value={reportForm.additionalInfo}
                        onChange={(e) => setReportForm(prev => ({ ...prev, additionalInfo: e.target.value }))}
                        placeholder="Any additional details about your symptoms or possible causes"
                        rows={3}
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-health-primary hover:bg-health-primary/90"
                      disabled={reportForm.symptoms.length === 0}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Submit Report
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Health Alerts & Water Status */}
              <div className="space-y-6">
                {/* Health Alerts */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="w-5 h-5 text-alert-high" />
                      Health Alerts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {healthAlerts.map(alert => (
                      <div 
                        key={alert.id}
                        className={`p-3 rounded-lg border-l-4 ${
                          alert.level === 'high' ? 'border-l-alert-high bg-alert-high/10' :
                          alert.level === 'medium' ? 'border-l-alert-medium bg-alert-medium/10' :
                          'border-l-success bg-success/10'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm">{alert.title}</h4>
                          {alert.hasVoice && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => playVoiceAlert(alert.voiceMessage)}
                              className="h-6 w-6 p-0"
                            >
                              <Volume2 className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{alert.message}</p>
                        <p className="text-xs text-muted-foreground mt-2">{alert.timestamp}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Water Source Status */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Droplets className="w-5 h-5 text-health-primary" />
                      Water Source Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {waterSources?.map((source, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded border">
                        <div>
                          <p className="font-medium text-sm">{source.name}</p>
                          <p className="text-xs text-muted-foreground">Distance: {source.distance?.toFixed(1)} km</p>
                          <p className="text-xs text-muted-foreground">Tested: {source.lastTested ? new Date(source.lastTested).toLocaleDateString() : 'N/A'}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {source.status === 'safe' ? (
                            <CheckCircle className="w-5 h-5 text-success" />
                          ) : source.status === 'caution' ? (
                            <AlertTriangle className="w-5 h-5 text-alert-medium" />
                          ) : (
                            <XCircle className="w-5 h-5 text-alert-high" />
                          )}
                          <Badge 
                            variant={source.status === 'safe' ? 'default' : 'destructive'}
                            className={`${
                              source.status === 'safe' ? 'bg-success text-white' :
                              source.status === 'caution' ? 'bg-alert-medium text-white' :
                              'bg-alert-high text-white'
                            } text-xs font-medium`}
                          >
                            {source.status === 'safe' ? 'SAFE TO DRINK' :
                             source.status === 'caution' ? 'USE WITH CAUTION' :
                             'UNSAFE - BOIL WATER'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Trust & Transparency Log */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-success" />
                  Actions Taken
                </CardTitle>
                <CardDescription>Government responses to community reports</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {communityActions.map((action, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 rounded border-l-4 border-l-success bg-success/5">
                    <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{action.action}</p>
                      <p className="text-xs text-muted-foreground">{action.date}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Emergency Tab */}
          <TabsContent value="emergency" className="space-y-6">
            {/* Emergency Hotline */}
            <Card className="border-alert-high/50 bg-alert-high/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-alert-high">
                  <PhoneCall className="w-6 h-6" />
                  Emergency Reporting
                </CardTitle>
                <CardDescription>Report symptoms or water contamination immediately</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-6 bg-alert-high/10 rounded-lg border-2 border-alert-high/20">
                  <PhoneCall className="w-12 h-12 text-alert-high mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">CALL TOLL-FREE</h3>
                  <div className="text-3xl font-bold text-alert-high mb-2">1800-108-108</div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Works on any phone • No app needed • Available 24/7
                  </p>
                  <Button
                    size="lg"
                    className="bg-alert-high hover:bg-alert-high/90 text-white"
                    onClick={() => window.open('tel:1800108108')}
                  >
                    <PhoneCall className="w-4 h-4 mr-2" />
                    Call Now
                  </Button>
                </div>

                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-4">Or use our emergency button for smartphone users:</p>
                  <Button
                    size="lg"
                    variant="destructive"
                    onClick={handleEmergencyReport}
                    className="w-full bg-alert-high hover:bg-alert-high/90"
                  >
                    <AlertCircle className="w-5 h-5 mr-2" />
                    Report Emergency
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Visual Symptom Reporting */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Symptom Check</CardTitle>
                <CardDescription>Tap on pictures that match your symptoms (no typing required)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { name: 'Diarrhea', emoji: '🚽', color: 'border-alert-high' },
                    { name: 'Vomiting', emoji: '🤢', color: 'border-alert-medium' },
                    { name: 'Fever', emoji: '🌡️', color: 'border-alert-high' },
                    { name: 'Stomach Pain', emoji: '😖', color: 'border-alert-medium' }
                  ].map((symptom, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className={`h-20 flex flex-col gap-2 ${symptom.color} hover:bg-alert-high/10`}
                      onClick={() => handleSymptomChange(symptom.name, true)}
                    >
                      <span className="text-2xl">{symptom.emoji}</span>
                      <span className="text-xs">{symptom.name}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Health Centers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-health-primary" />
                  Nearest Health Centers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {healthCenters.map((center, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded border">
                    <div>
                      <p className="font-medium text-sm">{center.name}</p>
                      <p className="text-xs text-muted-foreground">{center.distance} away</p>
                      <p className="text-xs text-success">{center.status}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => window.open(`tel:${center.phone}`)}>
                        <Phone className="w-3 h-3 mr-1" />
                        Call
                      </Button>
                      <Button size="sm" variant="outline">
                        <Navigation className="w-3 h-3 mr-1" />
                        Directions
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Safety Map Tab */}
          <TabsContent value="safety-map" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-health-primary" />
                  Community Safety Map
                </CardTitle>
                <CardDescription>
                  This map helps us keep our community safe. Thank you for your reports!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {safetyZones.map((zone, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border-l-4 ${
                        zone.status === 'safe' ? 'border-l-success bg-success/10' :
                        zone.status === 'caution' ? 'border-l-alert-medium bg-alert-medium/10' :
                        'border-l-alert-high bg-alert-high/10'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{zone.name}</h3>
                        <Badge
                          className={`${
                            zone.status === 'safe' ? 'bg-success' :
                            zone.status === 'caution' ? 'bg-alert-medium' :
                            'bg-alert-high'
                          } text-white`}
                        >
                          {zone.status === 'safe' ? 'No Active Alerts' :
                           zone.status === 'caution' ? 'Be Cautious' :
                           'High Alert - Boil Water Advisory Active'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Active Alerts: {zone.alerts}
                      </p>
                      <p className="text-sm font-medium">Advice: {zone.advice}</p>
                      {zone.status !== 'safe' && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Government Action: Water testing underway • Nearest Medical Camp: Village Center
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-6">
            {/* Offline Status */}
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                {isOffline ? (
                  <>
                    <WifiOff className="w-4 h-4 text-alert-medium" />
                    <span className="text-sm">Offline Mode - Critical guides available</span>
                  </>
                ) : (
                  <>
                    <Wifi className="w-4 h-4 text-success" />
                    <span className="text-sm">Online - All features available</span>
                  </>
                )}
              </div>
              <Badge variant="outline" className="text-xs">
                App Size: &lt;10MB
              </Badge>
            </div>

            {/* First Aid Library */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Book className="w-5 h-5 text-health-primary" />
                  Offline First-Aid Library
                </CardTitle>
                <CardDescription>Critical guides that work without internet</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {firstAidGuides.map((guide) => (
                    <div key={guide.id} className="flex items-center justify-between p-3 rounded border">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{guide.icon}</span>
                        <div>
                          <p className="font-medium text-sm">{guide.title}</p>
                          <p className="text-xs text-muted-foreground">{guide.downloadSize}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Download className="w-3 h-3 mr-1" />
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Voice Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Volume2 className="w-5 h-5 text-health-primary" />
                  Voice & Video Alerts
                </CardTitle>
                <CardDescription>Multilingual health alerts in your local language</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">Latest Health Advisory</p>
                      <p className="text-xs text-muted-foreground">Available in Assamese & English</p>
                    </div>
                    <Button size="sm" onClick={() => playVoiceAlert('Playing Assamese health advisory...')}>
                      <Play className="w-3 h-3 mr-1" />
                      Play
                    </Button>
                  </div>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">Water Boiling Instructions</p>
                      <p className="text-xs text-muted-foreground">Simple animated video guide</p>
                    </div>
                    <Button size="sm">
                      <Play className="w-3 h-3 mr-1" />
                      Watch
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Emergency Contact - Outside tabs, always visible */}
        <Card className="bg-health-primary/5 border-health-primary/20 mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-health-primary">
              <Phone className="w-5 h-5" />
              Emergency Health Contacts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white rounded-lg border">
                <h4 className="font-medium">District Hospital</h4>
                <p className="text-health-primary font-bold text-lg">108</p>
                <p className="text-xs text-muted-foreground">24/7 Emergency</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border">
                <h4 className="font-medium">Health Helpline</h4>
                <p className="text-health-primary font-bold text-lg">104</p>
                <p className="text-xs text-muted-foreground">Medical Advice</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border">
                <h4 className="font-medium">Local Health Center</h4>
                <p className="text-health-primary font-bold text-lg">+91-xxx-xxx-xxxx</p>
                <p className="text-xs text-muted-foreground">Non-emergency</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
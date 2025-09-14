import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FileDown, Send, FileText, Users } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { translations } from '../../data/translations';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

export function ExportTools() {
  const { language, user } = useAuth();
  const t = translations[language];
  const { toast } = useToast();
  const [smsText, setSmsText] = useState("BOIL WATER ADVISORY for Youliwadi. Medical camp setup at District Hospital. Avoid drinking untreated water. Contact ASHA worker for ORS supplies.");
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [isSendingSMS, setIsSendingSMS] = useState(false);

  const handleGenerateNHMReport = async () => {
    setIsGeneratingReport(true);
    
    // Simulate report generation
    setTimeout(() => {
      toast({
        title: "Report Generated",
        description: "NHM outbreak report downloaded successfully",
      });
      setIsGeneratingReport(false);
    }, 2000);
  };

  const handleExportPDF = () => {
    toast({
      title: "Export Started",
      description: "Dashboard data is being exported to PDF",
    });
  };

  const handleSendSMS = async () => {
    setIsSendingSMS(true);
    
    // Simulate SMS sending
    setTimeout(() => {
      toast({
        title: "SMS Alert Sent",
        description: "Emergency alert sent to 2,500 residents",
      });
      setIsSendingSMS(false);
    }, 1500);
  };

  return (
    <div className="space-y-4">
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileDown className="w-5 h-5 text-health-primary" />
            Export & Communication Tools
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            onClick={handleGenerateNHMReport} 
            className="w-full justify-start bg-health-primary hover:bg-health-primary/90"
            disabled={isGeneratingReport}
          >
            <FileText className="w-4 h-4 mr-2" />
            {isGeneratingReport ? 'Generating...' : t.generateReport}
          </Button>
          
          <Button 
            onClick={handleExportPDF} 
            variant="outline" 
            className="w-full justify-start"
          >
            <FileDown className="w-4 h-4 mr-2" />
            {t.exportPDF}
          </Button>
          
          <Button 
            onClick={handleExportPDF} 
            variant="outline" 
            className="w-full justify-start"
          >
            <FileDown className="w-4 h-4 mr-2" />
            {t.exportNHM}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
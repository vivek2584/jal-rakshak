import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Send, Users } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { translations } from '../../data/translations';
import { useToast } from '@/hooks/use-toast';

export function PublicSmsAlert() {
  const { language } = useAuth();
  const t = translations[language];
  const { toast } = useToast();
  const [smsText, setSmsText] = useState("BOIL WATER ADVISORY for Youliwadi. Medical camp setup at District Hospital. Avoid drinking untreated water. Contact ASHA worker for ORS supplies.");
  const [isSendingSMS, setIsSendingSMS] = useState(false);

  const handleSendSMS = async () => {
    setIsSendingSMS(true);
    
    try {
      const response = await fetch('http://127.0.0.1:5000/api/send-alert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: smsText
        })
      });
      
      const result = await response.json();
      console.log('Alert response:', result);
      
      if (response.ok && result.success) {
        toast({
          title: "Alert Sent Successfully",
          description: result.message,
        });
      } else {
        // Show detailed error information
        const errorMessage = result.error || result.message || "Unknown error occurred";
        console.error('Alert failed:', result);
        toast({
          title: "Failed to Send Alert",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error sending alert:', error);
      toast({
        title: "Failed to Send Alert",
        description: "Could not connect to alert service. Please check if backend is running.",
        variant: "destructive",
      });
    } finally {
      setIsSendingSMS(false);
    }
  };

  return (
    <Card className="animate-fade-in h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="w-5 h-5 text-orange-600" />
          Public SMS Alert
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              <Users className="w-4 h-4 mr-2" />
              Send Alert to Residents
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Send Public SMS Alert</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Recipients: 1 contact</label>
              </div>
              <Textarea
                value={smsText}
                onChange={(e) => setSmsText(e.target.value)}
                placeholder="Enter alert message..."
                className="min-h-[100px]"
              />
              <div className="text-xs text-muted-foreground">
                Character count: {smsText.length}/160
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={handleSendSMS} 
                  className="flex-1 bg-orange-600 hover:bg-orange-700"
                  disabled={isSendingSMS || !smsText.trim()}
                >
                  <Send className="w-4 h-4 mr-2" />
                  {isSendingSMS ? 'Sending...' : 'Send Alert'}
                </Button>
                <Button variant="outline" className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

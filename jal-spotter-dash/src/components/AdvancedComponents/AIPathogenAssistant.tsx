import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, TrendingUp, Zap, FileText } from 'lucide-react';
import { aiInsights } from '../../data/mockData';
import { useAuth } from '../../contexts/AuthContext';
import { translations } from '../../data/translations';
import { useState } from 'react';

interface AIPathogenAssistantProps {
  selectedAlertId?: string;
}

export function AIPathogenAssistant({ selectedAlertId }: AIPathogenAssistantProps) {
  const { language } = useAuth();
  const t = translations[language];
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const insight = selectedAlertId ? aiInsights[selectedAlertId as keyof typeof aiInsights] : null;

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => setIsAnalyzing(false), 2000);
  };

  if (!insight && !selectedAlertId) {
    return (
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            {t.aiAnalysis}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            Select an alert to get AI-powered pathogen analysis
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="animate-fade-in border-purple-200 dark:border-purple-800">
      <CardHeader className="bg-purple-50 dark:bg-purple-950/20">
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-600" />
          {t.aiAnalysis}
          {insight && (
            <Badge variant="secondary" className="ml-auto">
              {t.confidence}: {insight.confidence}%
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        {isAnalyzing ? (
          <div className="text-center py-4">
            <div className="animate-pulse">
              <Brain className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Analyzing symptoms...</p>
            </div>
          </div>
        ) : insight ? (
          <>
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-sm flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  {t.likelyPathogen}
                </h4>
                <p className="text-lg font-bold text-purple-700 dark:text-purple-300">
                  {insight.pathogen}
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-sm mb-2">Reported Symptoms:</h4>
                <div className="flex flex-wrap gap-1">
                  {insight.symptoms.map((symptom, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {symptom}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-sm mb-2">{t.recommend}:</h4>
                <p className="text-sm text-muted-foreground">
                  {insight.recommendation}
                </p>
              </div>
              
              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground">
                  <strong>Protocol:</strong> {insight.treatmentProtocol}
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="flex-1">
                <FileText className="w-4 h-4 mr-1" />
                View Protocol
              </Button>
              <Button size="sm" variant="outline" onClick={handleAnalyze}>
                <TrendingUp className="w-4 h-4 mr-1" />
                Re-analyze
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground mb-3">
              No analysis available for this alert
            </p>
            <Button onClick={handleAnalyze} disabled={isAnalyzing}>
              <Brain className="w-4 h-4 mr-2" />
              Run Analysis
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
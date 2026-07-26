import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useResume } from '@/context/ResumeContext';
import { generateSuggestions, optimizeForATS } from '@/services/aiSuggestions';
import type { AISuggestion } from '@/types/resume';
import { Sparkles, AlertCircle, Lightbulb, CheckCircle, RefreshCw, FileCheck } from 'lucide-react';
import { toast } from 'sonner';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export function AISuggestionsPanel() {
  const { resume } = useResume();
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [atsTips, setAtsTips] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeResume = () => {
    setIsAnalyzing(true);
    // Simulate AI analysis delay
    setTimeout(() => {
      const newSuggestions = generateSuggestions(resume);
      const newAtsTips = optimizeForATS(resume);
      setSuggestions(newSuggestions);
      setAtsTips(newAtsTips);
      setIsAnalyzing(false);
      toast.success('Resume analysis complete!');
    }, 1500);
  };

  useEffect(() => {
    analyzeResume();
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'improvement':
        return <Lightbulb className="h-4 w-4" />;
      case 'keyword':
        return <Sparkles className="h-4 w-4" />;
      case 'format':
        return <AlertCircle className="h-4 w-4" />;
      case 'content':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Sparkles className="h-4 w-4" />;
    }
  };

  const suggestionsBySection = suggestions.reduce((acc, suggestion) => {
    if (!acc[suggestion.section]) {
      acc[suggestion.section] = [];
    }
    acc[suggestion.section].push(suggestion);
    return acc;
  }, {} as Record<string, AISuggestion[]>);

  const highPriorityCount = suggestions.filter(s => s.priority === 'high').length;
  const mediumPriorityCount = suggestions.filter(s => s.priority === 'medium').length;

  const score = Math.max(0, 100 - highPriorityCount * 10 - mediumPriorityCount * 5);
  const getScoreColorClass = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50 divider-green-600/70 border-green-200';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50 divider-yellow-600/70 border-yellow-200';
    return 'text-red-600 bg-red-50 divider-red-600/70 border-red-200';
  };
  const scoreColors = getScoreColorClass(score).split(' ');

  return (
    <div className="space-y-4">
      {/* Analysis Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-lg">
            <span className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              AI Analysis
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={analyzeResume}
              disabled={isAnalyzing}
              className="flex items-center gap-1"
            >
              <RefreshCw className={`h-3 w-3 ${isAnalyzing ? 'animate-spin' : ''}`} />
              {isAnalyzing ? 'Analyzing...' : 'Reanalyze'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="text-2xl font-bold text-red-600">{highPriorityCount}</div>
              <div className="text-xs text-red-600/70">High Priority</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="text-2xl font-bold text-yellow-600">{mediumPriorityCount}</div>
              <div className="text-xs text-yellow-600/70">Medium Priority</div>
            </div>
            <div className={`text-center p-3 rounded-lg border ${scoreColors[1]} ${scoreColors[3]}`}>
              <div className={`text-2xl font-bold ${scoreColors[0]}`}>
                {score}
              </div>
              <div className={`text-xs ${scoreColors[0].replace('text-', 'text-opacity-70 text-')}`}>Score</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ATS Optimization */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileCheck className="h-5 w-5 text-primary" />
            ATS Optimization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                View ATS Tips
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>ATS Optimization Tips</DialogTitle>
                <DialogDescription>
                  Make your resume more compatible with Applicant Tracking Systems
                </DialogDescription>
              </DialogHeader>
              <ul className="space-y-3 mt-4">
                {atsTips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Suggestions by Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Suggestions</CardTitle>
        </CardHeader>
        <CardContent>
          {suggestions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {isAnalyzing ? (
                <div className="flex flex-col items-center gap-2">
                  <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                  <p>Analyzing your resume...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                  <p>Your resume looks great! No suggestions at this time.</p>
                </div>
              )}
            </div>
          ) : (
            <Accordion type="multiple" className="w-full">
              {Object.entries(suggestionsBySection).map(([section, sectionSuggestions]) => (
                <AccordionItem key={section} value={section}>
                  <AccordionTrigger className="text-sm font-medium">
                    <span className="flex items-center gap-2">
                      {section}
                      <Badge variant="secondary" className="text-xs">
                        {sectionSuggestions.length}
                      </Badge>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {sectionSuggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-lg border ${getPriorityColor(suggestion.priority)}`}
                        >
                          <div className="flex items-start gap-2">
                            {getTypeIcon(suggestion.type)}
                            <p className="text-sm">{suggestion.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

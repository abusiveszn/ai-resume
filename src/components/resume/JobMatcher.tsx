import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useResume } from '@/context/ResumeContext';
import { analyzeJobMatch } from '@/services/aiSuggestions';
import type { MatchScore, JobDescription } from '@/types/resume';
import { Target, Building, Briefcase, CheckCircle, XCircle, Sparkles, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

export function JobMatcher() {
  const { resume } = useResume();
  const [jobDescription, setJobDescription] = useState<JobDescription>({
    title: '',
    company: '',
    description: '',
    requirements: [],
  });
  const [matchScore, setMatchScore] = useState<MatchScore | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = () => {
    if (!jobDescription.description.trim()) {
      toast.error('Please enter a job description');
      return;
    }

    setIsAnalyzing(true);
    // Simulate AI analysis
    setTimeout(() => {
      const score = analyzeJobMatch(resume, jobDescription);
      setMatchScore(score);
      setIsAnalyzing(false);
      toast.success('Analysis complete!');
    }, 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };



  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Job Description Matcher
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Job Title
              </Label>
              <Input
                value={jobDescription.title}
                onChange={(e) => setJobDescription(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Senior Software Engineer"
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                Company
              </Label>
              <Input
                value={jobDescription.company}
                onChange={(e) => setJobDescription(prev => ({ ...prev, company: e.target.value }))}
                placeholder="e.g., Google"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Job Description</Label>
            <Textarea
              value={jobDescription.description}
              onChange={(e) => setJobDescription(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Paste the job description here..."
              rows={6}
            />
          </div>
          <Button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Analyze Match
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {matchScore && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Match Results</span>
              <span className={`text-3xl font-bold ${getScoreColor(matchScore.overall)}`}>
                {matchScore.overall}%
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Overall Score */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Overall Match</span>
                <span className={getScoreColor(matchScore.overall)}>{matchScore.overall}%</span>
              </div>
              <Progress value={matchScore.overall} className="h-3" />
            </div>

            {/* Category Scores */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className={`text-xl font-bold ${getScoreColor(matchScore.skills)}`}>
                  {matchScore.skills}%
                </div>
                <div className="text-xs text-muted-foreground">Skills</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className={`text-xl font-bold ${getScoreColor(matchScore.experience)}`}>
                  {matchScore.experience}%
                </div>
                <div className="text-xs text-muted-foreground">Experience</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className={`text-xl font-bold ${getScoreColor(matchScore.education)}`}>
                  {matchScore.education}%
                </div>
                <div className="text-xs text-muted-foreground">Education</div>
              </div>
            </div>

            {/* Keywords */}
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Matching Keywords ({matchScore.keywords.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {matchScore.keywords.map((keyword, index) => (
                    <Badge key={index} variant="secondary" className="bg-green-100 text-green-800">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>

              {matchScore.missingKeywords.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-500" />
                    Missing Keywords ({matchScore.missingKeywords.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {matchScore.missingKeywords.map((keyword, index) => (
                      <Badge key={index} variant="secondary" className="bg-red-100 text-red-800">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Recommendations */}
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="text-sm font-medium mb-2">AI Recommendations</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {matchScore.overall < 60 && (
                  <li>• Consider adding more relevant skills to your resume</li>
                )}
                {matchScore.skills < 70 && (
                  <li>• Review the job requirements and add missing technical skills</li>
                )}
                {matchScore.experience < 70 && (
                  <li>• Highlight more relevant experience in your work history</li>
                )}
                {matchScore.missingKeywords.length > 5 && (
                  <li>• Incorporate more keywords from the job description</li>
                )}
                {matchScore.overall >= 80 && (
                  <li>• Great match! Your resume aligns well with this position.</li>
                )}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

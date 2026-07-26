import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Wand2, Briefcase, FileText, Loader2, Copy, Check } from 'lucide-react';
import { enhanceResume } from '@/services/openai';
import { toast } from 'sonner';

export function ResumeEnhancer() {
  const [formData, setFormData] = useState({
    role: '',
    description: '',
    skills: '',
    jobDescription: ''
  });
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.role.trim() || !formData.description.trim()) {
      toast.error('Role and rough description are required.');
      return;
    }

    setIsEnhancing(true);
    setResult('');
    
    try {
      const generatedResult = await enhanceResume(formData);
      setResult(generatedResult);
      toast.success('Resume successfully enhanced!');
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong.');
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Copied to clipboard');
  };

  // Convert basic markdown to styled HTML tags
  const renderMarkdownText = (text: string) => {
    let formattedText = text
      .replace(/### (.*?)(?:\n|$)/g, '<h3 class="text-lg font-bold mt-5 mb-2 text-primary">$1</h3>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-foreground">$1</strong>')
      .replace(/- (.*)(?:\n|$)/g, '<li class="ml-4 mb-1 list-disc">$1</li>');
      
    // Remove extra empty bullet points or weird trailing lists caused by replacing.
    return formattedText;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-[200px])]">
      {/* Input Side */}
      <Card className="h-full border flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Wand2 className="h-5 w-5 text-primary" />
            AI Resume Enhancer
          </CardTitle>
          <CardDescription>
            Input rough details and let the AI generate an ATS-optimized, high-impact resume section.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="role" className="font-semibold">Role / Job Title</Label>
              <Input 
                id="role" 
                placeholder="e.g. Frontend Developer" 
                value={formData.role}
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description" className="font-semibold">Rough Description (What did you do?)</Label>
              <Textarea 
                id="description" 
                placeholder="e.g. Built websites using HTML and CSS and talked to clients"
                className="min-h-[100px] resize-none"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills" className="font-semibold">Key Skills (Optional)</Label>
              <Input 
                id="skills" 
                placeholder="e.g. React, Node.js, TailwindCSS" 
                value={formData.skills}
                onChange={(e) => setFormData(prev => ({ ...prev, skills: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="jobDescription" className="font-semibold">Target Job Description (Optional but powerful)</Label>
              <Textarea 
                id="jobDescription" 
                placeholder="Paste the job requirements to match keywords directly..."
                className="min-h-[120px] resize-none"
                value={formData.jobDescription}
                onChange={(e) => setFormData(prev => ({ ...prev, jobDescription: e.target.value }))}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full text-base font-medium" 
              size="lg"
              disabled={isEnhancing}
            >
              {isEnhancing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating Magic...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-5 w-5" />
                  Enhance Content
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Output Side */}
      <Card className="h-full border flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between border-b pb-4 mb-4">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-xl">
              <FileText className="h-5 w-5 text-primary" />
              Enhanced Result
            </CardTitle>
            <CardDescription>
              Your professional, ATS-optimized content will appear here.
            </CardDescription>
          </div>
          {result && (
            <Button variant="outline" size="sm" onClick={handleCopy} className="hidden sm:flex">
              {copied ? (
                <><Check className="h-4 w-4 mr-2 text-green-500" /> Copied</>
              ) : (
                <><Copy className="h-4 w-4 mr-2" /> Copy to Clipboard</>
              )}
            </Button>
          )}
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto">
          {result ? (
            <div className="bg-muted/50 p-6 rounded-lg h-full overflow-y-auto border">
              <div 
                className="text-sm leading-relaxed whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: renderMarkdownText(result) }}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground bg-muted/20 border-2 border-dashed rounded-xl p-8 text-center min-h-[300px]">
              <div className="bg-muted p-4 rounded-full mb-4">
                <Briefcase className="h-8 w-8 text-primary/60" />
              </div>
              <h3 className="font-semibold text-lg text-foreground mb-1">Ready for Optimization</h3>
              <p className="text-sm px-4">
                Fill out your details on the left, add the target job description, and hit enhance to increase your ATS match rate.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

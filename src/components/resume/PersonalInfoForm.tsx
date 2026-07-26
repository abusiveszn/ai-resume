import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useResume } from '@/context/ResumeContext';
import { User, Mail, Phone, MapPin, Linkedin, Globe, Sparkles } from 'lucide-react';
import { suggestImprovements } from '@/services/aiSuggestions';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export function PersonalInfoForm() {
  const { resume, updatePersonalInfo } = useResume();
  const { personalInfo } = resume;
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleGetSuggestions = () => {
    const tips = suggestImprovements(resume, 'summary');
    setSuggestions(tips);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={personalInfo.fullName}
              onChange={(e) => updatePersonalInfo({ fullName: e.target.value })}
              placeholder="John Doe"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={personalInfo.email}
                onChange={(e) => updatePersonalInfo({ email: e.target.value })}
                placeholder="john@example.com"
                className="pl-10"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                value={personalInfo.phone}
                onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
                placeholder="+1 (555) 123-4567"
                className="pl-10"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="location"
                value={personalInfo.location}
                onChange={(e) => updatePersonalInfo({ location: e.target.value })}
                placeholder="New York, NY"
                className="pl-10"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="linkedin">LinkedIn</Label>
            <div className="relative">
              <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="linkedin"
                value={personalInfo.linkedin}
                onChange={(e) => updatePersonalInfo({ linkedin: e.target.value })}
                placeholder="linkedin.com/in/johndoe"
                className="pl-10"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="website">Website/Portfolio</Label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="website"
                value={personalInfo.website}
                onChange={(e) => updatePersonalInfo({ website: e.target.value })}
                placeholder="johndoe.com"
                className="pl-10"
              />
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="summary">Professional Summary</Label>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGetSuggestions}
                  className="flex items-center gap-1"
                >
                  <Sparkles className="h-3 w-3" />
                  AI Tips
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>AI Suggestions for Summary</DialogTitle>
                  <DialogDescription>
                    Tips to improve your professional summary
                  </DialogDescription>
                </DialogHeader>
                <ul className="list-disc pl-5 space-y-2 mt-4">
                  {suggestions.map((tip, index) => (
                    <li key={index} className="text-sm text-muted-foreground">
                      {tip}
                    </li>
                  ))}
                </ul>
              </DialogContent>
            </Dialog>
          </div>
          <Textarea
            id="summary"
            value={personalInfo.summary}
            onChange={(e) => updatePersonalInfo({ summary: e.target.value })}
            placeholder="Write a brief summary of your professional background, key skills, and career goals..."
            rows={4}
          />
        </div>
      </CardContent>
    </Card>
  );
}

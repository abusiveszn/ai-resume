import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useResume } from '@/context/ResumeContext';
import { Briefcase, Plus, Trash2, Sparkles, X, PlusCircle } from 'lucide-react';
import { suggestImprovements } from '@/services/aiSuggestions';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { Experience } from '@/types/resume';

export function ExperienceForm() {
  const { resume, addExperience, updateExperience, removeExperience } = useResume();
  const { experience } = resume;
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const [formData, setFormData] = useState<Partial<Experience>>({
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
    achievements: [],
  });

  const [newAchievement, setNewAchievement] = useState('');

  const handleSubmit = () => {
    if (!formData.company || !formData.position) return;

    if (editingId) {
      updateExperience(editingId, formData);
      setEditingId(null);
    } else {
      addExperience({
        ...formData,
        id: Date.now().toString(),
        achievements: formData.achievements || [],
      } as Experience);
    }

    setFormData({
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      achievements: [],
    });
    setIsAdding(false);
  };

  const handleEdit = (exp: Experience) => {
    setFormData(exp);
    setEditingId(exp.id);
    setIsAdding(true);
  };

  const handleAddAchievement = () => {
    if (!newAchievement.trim()) return;
    setFormData(prev => ({
      ...prev,
      achievements: [...(prev.achievements || []), newAchievement.trim()],
    }));
    setNewAchievement('');
  };

  const handleRemoveAchievement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      achievements: prev.achievements?.filter((_, i) => i !== index) || [],
    }));
  };

  const handleGetSuggestions = () => {
    const tips = suggestImprovements(resume, 'experience');
    setSuggestions(tips);
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          Work Experience
        </CardTitle>
        <div className="flex gap-2">
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
                <DialogTitle>AI Suggestions for Experience</DialogTitle>
                <DialogDescription>
                  Tips to improve your work experience section
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
          <Button
            size="sm"
            onClick={() => {
              setIsAdding(true);
              setEditingId(null);
              setFormData({
                company: '',
                position: '',
                startDate: '',
                endDate: '',
                current: false,
                description: '',
                achievements: [],
              });
            }}
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {experience.length === 0 && !isAdding && (
          <div className="text-center py-8 text-muted-foreground">
            No work experience added yet. Click "Add" to get started.
          </div>
        )}

        {experience.map((exp) => (
          <div
            key={exp.id}
            className="border rounded-lg p-4 mb-4 hover:border-primary/50 transition-colors cursor-pointer"
            onClick={() => handleEdit(exp)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{exp.position}</h3>
                <p className="text-sm text-muted-foreground">{exp.company}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  removeExperience(exp.id);
                }}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
        ))}

        {isAdding && (
          <div className="border rounded-lg p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Company</Label>
                <Input
                  value={formData.company}
                  onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                  placeholder="Company Name"
                />
              </div>
              <div className="space-y-2">
                <Label>Position</Label>
                <Input
                  value={formData.position}
                  onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                  placeholder="Job Title"
                />
              </div>
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="month"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  type="month"
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  disabled={formData.current}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="current"
                checked={formData.current}
                onCheckedChange={(checked) =>
                  setFormData(prev => ({ ...prev, current: checked as boolean }))
                }
              />
              <Label htmlFor="current" className="text-sm">I currently work here</Label>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your responsibilities and achievements..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Key Achievements</Label>
              <div className="flex gap-2">
                <Input
                  value={newAchievement}
                  onChange={(e) => setNewAchievement(e.target.value)}
                  placeholder="Add a quantifiable achievement..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddAchievement();
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleAddAchievement}
                >
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.achievements?.map((achievement, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-sm rounded-full"
                  >
                    {achievement}
                    <button
                      onClick={() => handleRemoveAchievement(index)}
                      className="hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSubmit} className="flex-1">
                {editingId ? 'Update' : 'Add'} Experience
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAdding(false);
                  setEditingId(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

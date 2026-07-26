import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useResume } from '@/context/ResumeContext';
import { GraduationCap, Plus, Trash2, Sparkles } from 'lucide-react';
import { suggestImprovements } from '@/services/aiSuggestions';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { Education } from '@/types/resume';

export function EducationForm() {
  const { resume, addEducation, updateEducation, removeEducation } = useResume();
  const { education } = resume;
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const [formData, setFormData] = useState<Partial<Education>>({
    institution: '',
    degree: '',
    field: '',
    startDate: '',
    endDate: '',
    gpa: '',
  });

  const handleSubmit = () => {
    if (!formData.institution || !formData.degree) return;

    if (editingId) {
      updateEducation(editingId, formData);
      setEditingId(null);
    } else {
      addEducation({
        ...formData,
        id: Date.now().toString(),
      } as Education);
    }

    setFormData({
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      gpa: '',
    });
    setIsAdding(false);
  };

  const handleEdit = (edu: Education) => {
    setFormData(edu);
    setEditingId(edu.id);
    setIsAdding(true);
  };

  const handleGetSuggestions = () => {
    const tips = suggestImprovements(resume, 'education');
    setSuggestions(tips);
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5" />
          Education
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
                <DialogTitle>AI Suggestions for Education</DialogTitle>
                <DialogDescription>
                  Tips to improve your education section
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
                institution: '',
                degree: '',
                field: '',
                startDate: '',
                endDate: '',
                gpa: '',
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
        {education.length === 0 && !isAdding && (
          <div className="text-center py-8 text-muted-foreground">
            No education added yet. Click "Add" to get started.
          </div>
        )}

        {education.map((edu) => (
          <div
            key={edu.id}
            className="border rounded-lg p-4 mb-4 hover:border-primary/50 transition-colors cursor-pointer"
            onClick={() => handleEdit(edu)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{edu.institution}</h3>
                <p className="text-sm text-muted-foreground">
                  {edu.degree} in {edu.field}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {edu.startDate} - {edu.endDate}
                </p>
                {edu.gpa && (
                  <p className="text-xs text-muted-foreground mt-1">
                    GPA: {edu.gpa}
                  </p>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  removeEducation(edu.id);
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
                <Label>Institution</Label>
                <Input
                  value={formData.institution}
                  onChange={(e) => setFormData(prev => ({ ...prev, institution: e.target.value }))}
                  placeholder="University Name"
                />
              </div>
              <div className="space-y-2">
                <Label>Degree</Label>
                <Input
                  value={formData.degree}
                  onChange={(e) => setFormData(prev => ({ ...prev, degree: e.target.value }))}
                  placeholder="Bachelor of Science"
                />
              </div>
              <div className="space-y-2">
                <Label>Field of Study</Label>
                <Input
                  value={formData.field}
                  onChange={(e) => setFormData(prev => ({ ...prev, field: e.target.value }))}
                  placeholder="Computer Science"
                />
              </div>
              <div className="space-y-2">
                <Label>GPA (Optional)</Label>
                <Input
                  value={formData.gpa}
                  onChange={(e) => setFormData(prev => ({ ...prev, gpa: e.target.value }))}
                  placeholder="3.8/4.0"
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
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSubmit} className="flex-1">
                {editingId ? 'Update' : 'Add'} Education
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

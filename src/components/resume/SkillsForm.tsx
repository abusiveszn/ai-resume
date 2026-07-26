import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useResume } from '@/context/ResumeContext';
import { Wrench, Plus, Sparkles, X } from 'lucide-react';
import { suggestImprovements } from '@/services/aiSuggestions';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Skill } from '@/types/resume';

const skillCategories = [
  'Technical',
  'Soft Skills',
  'Languages',
  'Tools',
  'Frameworks',
  'Databases',
  'Cloud',
  'Other',
];

const skillLevels = [
  { value: 'Beginner', label: 'Beginner' },
  { value: 'Intermediate', label: 'Intermediate' },
  { value: 'Advanced', label: 'Advanced' },
  { value: 'Expert', label: 'Expert' },
];

export function SkillsForm() {
  const { resume, addSkill, removeSkill } = useResume();
  const { skills } = resume;
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const [newSkill, setNewSkill] = useState('');
  const [newLevel, setNewLevel] = useState<Skill['level']>('Intermediate');
  const [newCategory, setNewCategory] = useState('Technical');

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;

    addSkill({
      id: Date.now().toString(),
      name: newSkill.trim(),
      level: newLevel,
      category: newCategory,
    });

    setNewSkill('');
    setNewLevel('Intermediate');
    setNewCategory('Technical');
  };

  const handleGetSuggestions = () => {
    const tips = suggestImprovements(resume, 'skills');
    setSuggestions(tips);
  };

  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-yellow-100 text-yellow-800';
      case 'Intermediate':
        return 'bg-blue-100 text-blue-800';
      case 'Advanced':
        return 'bg-purple-100 text-purple-800';
      case 'Expert':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Wrench className="h-5 w-5" />
          Skills
        </CardTitle>
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
              <DialogTitle>AI Suggestions for Skills</DialogTitle>
              <DialogDescription>
                Tips to improve your skills section
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
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Skill Name</Label>
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="e.g., JavaScript"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
              />
            </div>
            <div className="space-y-2">
              <Label>Level</Label>
              <Select value={newLevel} onValueChange={(v) => setNewLevel(v as Skill['level'])}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {skillLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={newCategory} onValueChange={setNewCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {skillCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            onClick={handleAddSkill}
            className="w-full"
            disabled={!newSkill.trim()}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Skill
          </Button>
        </div>

        {skills.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No skills added yet. Add your first skill above.
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
              <div key={category}>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">
                  {category}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {categorySkills.map((skill) => (
                    <span
                      key={skill.id}
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${getLevelColor(skill.level)}`}
                    >
                      {skill.name}
                      <span className="text-xs opacity-70">({skill.level})</span>
                      <button
                        onClick={() => removeSkill(skill.id)}
                        className="ml-1 hover:opacity-70"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

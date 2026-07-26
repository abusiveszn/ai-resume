import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useResume } from '@/context/ResumeContext';
import { FolderGit, Plus, Trash2, X, PlusCircle } from 'lucide-react';
import type { Project } from '@/types/resume';

export function ProjectsForm() {
  const { resume, addProject, updateProject, removeProject } = useResume();
  const { projects } = resume;
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<Project>>({
    name: '',
    description: '',
    technologies: [],
    link: '',
  });

  const [newTech, setNewTech] = useState('');

  const handleSubmit = () => {
    if (!formData.name || !formData.description) return;

    if (editingId) {
      updateProject(editingId, formData);
      setEditingId(null);
    } else {
      addProject({
        ...formData,
        id: Date.now().toString(),
        technologies: formData.technologies || [],
      } as Project);
    }

    setFormData({
      name: '',
      description: '',
      technologies: [],
      link: '',
    });
    setIsAdding(false);
  };

  const handleEdit = (proj: Project) => {
    setFormData(proj);
    setEditingId(proj.id);
    setIsAdding(true);
  };

  const handleAddTech = () => {
    if (!newTech.trim()) return;
    setFormData(prev => ({
      ...prev,
      technologies: [...(prev.technologies || []), newTech.trim()],
    }));
    setNewTech('');
  };

  const handleRemoveTech = (index: number) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies?.filter((_, i) => i !== index) || [],
    }));
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <FolderGit className="h-5 w-5" />
          Projects
        </CardTitle>
        <Button
          size="sm"
          onClick={() => {
            setIsAdding(true);
            setEditingId(null);
            setFormData({
              name: '',
              description: '',
              technologies: [],
              link: '',
            });
          }}
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          Add
        </Button>
      </CardHeader>
      <CardContent>
        {projects.length === 0 && !isAdding && (
          <div className="text-center py-8 text-muted-foreground">
            No projects added yet. Click "Add" to showcase your work.
          </div>
        )}

        {projects.map((proj) => (
          <div
            key={proj.id}
            className="border rounded-lg p-4 mb-4 hover:border-primary/50 transition-colors cursor-pointer"
            onClick={() => handleEdit(proj)}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold">{proj.name}</h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {proj.description}
                </p>
                {proj.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {proj.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-secondary text-secondary-foreground text-xs rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
                {proj.link && (
                  <a
                    href={proj.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline mt-2 inline-block"
                    onClick={(e) => e.stopPropagation()}
                  >
                    View Project →
                  </a>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  removeProject(proj.id);
                }}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
        ))}

        {isAdding && (
          <div className="border rounded-lg p-4 space-y-4">
            <div className="space-y-2">
              <Label>Project Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Project Name"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your project, its purpose, and your role..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Technologies Used</Label>
              <div className="flex gap-2">
                <Input
                  value={newTech}
                  onChange={(e) => setNewTech(e.target.value)}
                  placeholder="Add a technology..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTech();
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleAddTech}
                >
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.technologies?.map((tech, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-secondary text-secondary-foreground text-sm rounded-full"
                  >
                    {tech}
                    <button
                      onClick={() => handleRemoveTech(index)}
                      className="hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Project Link (Optional)</Label>
              <Input
                value={formData.link}
                onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                placeholder="https://github.com/username/project"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSubmit} className="flex-1">
                {editingId ? 'Update' : 'Add'} Project
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

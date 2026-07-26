import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useResume } from '@/context/ResumeContext';
import { Award, Plus, Trash2 } from 'lucide-react';
import type { Certification } from '@/types/resume';

export function CertificationsForm() {
  const { resume, addCertification, updateCertification, removeCertification } = useResume();
  const { certifications } = resume;
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<Certification>>({
    name: '',
    issuer: '',
    date: '',
    link: '',
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.issuer) return;

    if (editingId) {
      updateCertification(editingId, formData);
      setEditingId(null);
    } else {
      addCertification({
        ...formData,
        id: Date.now().toString(),
      } as Certification);
    }

    setFormData({
      name: '',
      issuer: '',
      date: '',
      link: '',
    });
    setIsAdding(false);
  };

  const handleEdit = (cert: Certification) => {
    setFormData(cert);
    setEditingId(cert.id);
    setIsAdding(true);
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          Certifications
        </CardTitle>
        <Button
          size="sm"
          onClick={() => {
            setIsAdding(true);
            setEditingId(null);
            setFormData({
              name: '',
              issuer: '',
              date: '',
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
        {certifications.length === 0 && !isAdding && (
          <div className="text-center py-8 text-muted-foreground">
            No certifications added yet. Click "Add" to showcase your credentials.
          </div>
        )}

        {certifications.map((cert) => (
          <div
            key={cert.id}
            className="border rounded-lg p-4 mb-4 hover:border-primary/50 transition-colors cursor-pointer"
            onClick={() => handleEdit(cert)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{cert.name}</h3>
                <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {cert.date}
                </p>
                {cert.link && (
                  <a
                    href={cert.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline mt-2 inline-block"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Verify →
                  </a>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  removeCertification(cert.id);
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
              <Label>Certification Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., AWS Certified Solutions Architect"
              />
            </div>
            <div className="space-y-2">
              <Label>Issuing Organization</Label>
              <Input
                value={formData.issuer}
                onChange={(e) => setFormData(prev => ({ ...prev, issuer: e.target.value }))}
                placeholder="e.g., Amazon Web Services"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date Obtained</Label>
                <Input
                  type="month"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Verification Link (Optional)</Label>
                <Input
                  value={formData.link}
                  onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                  placeholder="https://..."
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSubmit} className="flex-1">
                {editingId ? 'Update' : 'Add'} Certification
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

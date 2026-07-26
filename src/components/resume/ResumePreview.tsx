import { useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useResume } from '@/context/ResumeContext';
import { exportToPDF, generateResumeHTML } from '@/services/pdfExport';
import { Download, Eye, FileText, Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

const templates = [
  { value: 'modern', label: 'Modern', description: 'Clean and contemporary design' },
  { value: 'classic', label: 'Classic', description: 'Traditional and professional' },
  { value: 'minimal', label: 'Minimal', description: 'Simple and elegant' },
  { value: 'professional', label: 'Professional', description: 'Two-column layout' },
];

export function ResumePreview() {
  const { resume } = useResume();
  const previewRef = useRef<HTMLDivElement>(null);
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [isExporting, setIsExporting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleExportPDF = async () => {
    if (!previewRef.current) return;
    
    setIsExporting(true);
    try {
      await exportToPDF('resume-preview', `${resume.personalInfo.fullName || 'Resume'}_${selectedTemplate}`);
      toast.success('Resume exported successfully!');
    } catch (error) {
      toast.error('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const previewHTML = generateResumeHTML(resume, selectedTemplate);

  return (
    <Card className="w-full h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Resume Preview
        </CardTitle>
        <div className="flex items-center gap-2">
          <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {templates.map((template) => (
                <SelectItem key={template.value} value={template.value}>
                  {template.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowPreview(true)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="flex items-center gap-1"
          >
            {isExporting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            Export PDF
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative">
          {/* Scaled Preview */}
          <div className="overflow-auto max-h-[600px] bg-gray-100 p-4">
            <div
              className="transform origin-top scale-[0.6] md:scale-[0.7] lg:scale-[0.8] mx-auto"
              style={{ width: 'fit-content' }}
            >
              <div
                id="resume-preview"
                ref={previewRef}
                className="bg-white shadow-lg"
                style={{ minWidth: '210mm' }}
                dangerouslySetInnerHTML={{ __html: previewHTML }}
              />
            </div>
          </div>
        </div>
      </CardContent>

      {/* Full Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Resume Preview - {templates.find(t => t.value === selectedTemplate)?.label} Template</DialogTitle>
          </DialogHeader>
          <div
            className="bg-white"
            dangerouslySetInnerHTML={{ __html: previewHTML }}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
}

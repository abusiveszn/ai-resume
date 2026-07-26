import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Eye } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const templates = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean and contemporary design with blue accents. Perfect for tech and creative roles.',
    features: ['Clean layout', 'Blue accent colors', 'Professional typography'],
    popular: true,
    preview: (
      <div className="bg-white p-4 h-full">
        <div className="border-b-2 border-blue-500 pb-2 mb-3">
          <div className="h-4 bg-blue-900 rounded w-2/3 mb-1" />
          <div className="h-2 bg-gray-300 rounded w-1/2" />
        </div>
        <div className="space-y-2">
          <div className="h-2 bg-gray-200 rounded w-full" />
          <div className="h-2 bg-gray-200 rounded w-4/5" />
        </div>
        <div className="mt-3 pt-2 border-t">
          <div className="h-3 bg-blue-100 rounded w-1/4 mb-2" />
          <div className="h-2 bg-gray-200 rounded w-full" />
        </div>
      </div>
    ),
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional and professional serif typography. Ideal for conservative industries.',
    features: ['Serif fonts', 'Traditional layout', 'Timeless design'],
    popular: false,
    preview: (
      <div className="bg-white p-4 h-full font-serif">
        <div className="text-center border-b border-gray-800 pb-2 mb-3">
          <div className="h-4 bg-gray-900 rounded w-1/2 mx-auto mb-1" />
          <div className="h-2 bg-gray-400 rounded w-2/3 mx-auto" />
        </div>
        <div className="space-y-2">
          <div className="h-2 bg-gray-200 rounded w-full" />
          <div className="h-2 bg-gray-200 rounded w-3/4" />
        </div>
        <div className="mt-3 pt-2 border-t border-gray-800">
          <div className="h-3 bg-gray-800 rounded w-1/4 mb-2" />
          <div className="h-2 bg-gray-200 rounded w-full" />
        </div>
      </div>
    ),
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Simple and elegant design that lets your content shine. Great for any industry.',
    features: ['Minimalist design', 'Elegant spacing', 'Focus on content'],
    popular: false,
    preview: (
      <div className="bg-white p-4 h-full">
        <div className="mb-3">
          <div className="h-5 bg-gray-900 rounded w-1/2 mb-1" />
          <div className="h-2 bg-gray-400 rounded w-1/3" />
        </div>
        <div className="space-y-2">
          <div className="h-2 bg-gray-200 rounded w-full" />
          <div className="h-2 bg-gray-200 rounded w-5/6" />
        </div>
        <div className="mt-4">
          <div className="h-3 text-gray-500 text-xs uppercase tracking-wider mb-2">Experience</div>
          <div className="h-2 bg-gray-200 rounded w-full" />
        </div>
      </div>
    ),
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Two-column layout with gradient header. Perfect for experienced professionals.',
    features: ['Two-column layout', 'Gradient header', 'Skills sidebar'],
    popular: true,
    preview: (
      <div className="bg-white h-full">
        <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-3">
          <div className="h-4 bg-white/90 rounded w-2/3 mb-1" />
          <div className="h-2 bg-white/70 rounded w-1/2" />
        </div>
        <div className="p-3 flex gap-3">
          <div className="flex-1 space-y-2">
            <div className="h-2 bg-gray-200 rounded w-full" />
            <div className="h-2 bg-gray-200 rounded w-4/5" />
          </div>
          <div className="w-16 space-y-1">
            <div className="h-2 bg-purple-100 rounded w-full" />
            <div className="h-2 bg-purple-100 rounded w-3/4" />
          </div>
        </div>
      </div>
    ),
  },
];

interface TemplatesSectionProps {
  onGetStarted: () => void;
}

export function TemplatesSection({ onGetStarted }: TemplatesSectionProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  return (
    <section id="templates" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Templates
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Choose Your Perfect{' '}
            <span className="text-primary">Template</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            All templates are ATS-friendly and professionally designed to help you make a great first impression.
          </p>
        </motion.div>

        {/* Templates Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {templates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                {/* Preview */}
                <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
                  <div className="absolute inset-0 transform scale-90 origin-top">
                    {template.preview}
                  </div>
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setSelectedTemplate(template.id)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                  </div>
                  {/* Popular Badge */}
                  {template.popular && (
                    <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                      Popular
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-semibold text-lg mb-1">{template.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3 flex-1">
                    {template.description}
                  </p>
                  <ul className="space-y-1 mb-4">
                    {template.features.map((feature, i) => (
                      <li key={i} className="text-xs text-muted-foreground flex items-center gap-1">
                        <Check className="h-3 w-3 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={onGetStarted}
                  >
                    Use Template
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Preview Dialog */}
        <Dialog open={!!selectedTemplate} onOpenChange={() => setSelectedTemplate(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {templates.find(t => t.id === selectedTemplate)?.name} Template Preview
              </DialogTitle>
            </DialogHeader>
            <div className="aspect-[3/4] max-h-[60vh] overflow-auto bg-gray-100 rounded-lg">
              {selectedTemplate && templates.find(t => t.id === selectedTemplate)?.preview}
            </div>
            <Button onClick={onGetStarted} className="w-full">
              Use This Template
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}

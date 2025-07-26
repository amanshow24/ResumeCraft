import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const templates = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean, minimalist design with subtle accents',
    preview: '/templates/modern-preview.png',
    features: ['Single column', 'Minimalist', 'Professional']
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional two-column layout',
    preview: '/templates/classic-preview.png',
    features: ['Two columns', 'Traditional', 'Structured']
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Eye-catching design with color accents',
    preview: '/templates/creative-preview.png',
    features: ['Colorful', 'Creative', 'Stand out']
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Premium design for senior positions',
    preview: '/templates/executive-preview.png',
    features: ['Premium', 'Executive', 'Sophisticated']
  }
];

interface TemplateSelectorProps {
  selectedTemplate: string;
  onTemplateChange: (template: string) => void;
}

export function TemplateSelector({ selectedTemplate, onTemplateChange }: TemplateSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {templates.map((template) => (
        <Card 
          key={template.id}
          className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
            selectedTemplate === template.id 
              ? 'ring-2 ring-primary shadow-lg' 
              : 'hover:ring-1 hover:ring-primary/50'
          }`}
          onClick={() => onTemplateChange(template.id)}
        >
          <CardContent className="p-4">
            <div className="relative">
              {/* Template Preview */}
              <div className="aspect-[3/4] bg-gradient-to-br from-muted to-muted/50 rounded-lg mb-3 flex items-center justify-center border">
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-2">{template.name}</div>
                  <div className="space-y-1">
                    <div className="h-2 bg-primary/20 rounded w-16 mx-auto"></div>
                    <div className="h-1 bg-muted-foreground/20 rounded w-12 mx-auto"></div>
                    <div className="h-1 bg-muted-foreground/20 rounded w-14 mx-auto"></div>
                    <div className="h-1 bg-muted-foreground/20 rounded w-10 mx-auto"></div>
                  </div>
                </div>
              </div>
              
              {/* Selected Indicator */}
              {selectedTemplate === template.id && (
                <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full p-1">
                  <Check className="h-3 w-3" />
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <h3 className="font-semibold text-sm">{template.name}</h3>
              <p className="text-xs text-muted-foreground">{template.description}</p>
              
              <div className="flex flex-wrap gap-1">
                {template.features.map((feature) => (
                  <span 
                    key={feature}
                    className="inline-block px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
            
            <Button
              variant={selectedTemplate === template.id ? "default" : "outline"}
              size="sm"
              className="w-full mt-3"
              onClick={(e) => {
                e.stopPropagation();
                onTemplateChange(template.id);
              }}
            >
              {selectedTemplate === template.id ? 'Selected' : 'Select'}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
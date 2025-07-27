// Simplified form component
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { CustomSection } from '@/types/resume';

interface CustomSectionsFormProps {
  data: CustomSection[];
  onChange: (data: CustomSection[]) => void;
}

export function CustomSectionsForm({ data, onChange }: CustomSectionsFormProps) {
  const addSection = () => {
    const newSection: CustomSection = {
      id: crypto.randomUUID(),
      title: '',
      content: '',
      type: 'text',
      items: []
    };
    onChange([...data, newSection]);
  };

  const updateSection = (index: number, field: keyof CustomSection, value: any) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeSection = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Custom Sections</h3>
          <p className="text-sm text-muted-foreground">Add additional sections like certifications or projects</p>
        </div>
        <Button onClick={addSection} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Section
        </Button>
      </div>

      {data.map((section, index) => (
        <Card key={section.id}>
          <CardHeader>
            <CardTitle className="flex justify-between">
              Custom Section {index + 1}
              <Button variant="ghost" size="sm" onClick={() => removeSection(index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Section Title</Label>
              <Input 
                value={section.title} 
                onChange={(e) => updateSection(index, 'title', e.target.value)}
                placeholder="Certifications"
              />
            </div>
            <div>
              <Label>Content</Label>
              <Textarea 
                value={section.content} 
                onChange={(e) => updateSection(index, 'content', e.target.value)}
                placeholder="Describe this section..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
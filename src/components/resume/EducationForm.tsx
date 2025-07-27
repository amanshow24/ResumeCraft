// Simplified form components with proper typing
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { Education } from '@/types/resume';

interface EducationFormProps {
  data: Education[];
  onChange: (data: Education[]) => void;
}

export function EducationForm({ data, onChange }: EducationFormProps) {
  const addEducation = () => {
    const newEducation: Education = {
      id: crypto.randomUUID(),
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      gpa: '',
      achievements: []
    };
    onChange([...data, newEducation]);
  };

  const updateEducation = (index: number, field: keyof Education, value: any) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeEducation = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Education</h3>
          <p className="text-sm text-muted-foreground">Add your educational background</p>
        </div>
        <Button onClick={addEducation} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Education
        </Button>
      </div>

      {data.map((edu, index) => (
        <Card key={edu.id}>
          <CardHeader>
            <CardTitle className="flex justify-between">
              Education {index + 1}
              <Button variant="ghost" size="sm" onClick={() => removeEducation(index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Institution</Label>
                <Input 
                  value={edu.institution} 
                  onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                  placeholder="Harvard University"
                />
              </div>
              <div>
                <Label>Degree</Label>
                <Input 
                  value={edu.degree} 
                  onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                  placeholder="Bachelor of Science"
                />
              </div>
            </div>
            <div>
              <Label>Field of Study</Label>
              <Input 
                value={edu.field} 
                onChange={(e) => updateEducation(index, 'field', e.target.value)}
                placeholder="Computer Science"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Start Date</Label>
                <Input 
                  type="date"
                  value={edu.startDate} 
                  onChange={(e) => updateEducation(index, 'startDate', e.target.value)}
                />
              </div>
              <div>
                <Label>End Date</Label>
                <Input 
                  type="date"
                  value={edu.endDate} 
                  onChange={(e) => updateEducation(index, 'endDate', e.target.value)}
                />
              </div>
              <div>
                <Label>GPA</Label>
                <Input 
                  value={edu.gpa || ''} 
                  onChange={(e) => updateEducation(index, 'gpa', e.target.value)}
                  placeholder="3.8"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
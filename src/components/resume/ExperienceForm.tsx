// Simplified form component
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { Experience } from '@/types/resume';

interface ExperienceFormProps {
  data: Experience[];
  onChange: (data: Experience[]) => void;
}

export function ExperienceForm({ data, onChange }: ExperienceFormProps) {
  const addExperience = () => {
    const newExperience: Experience = {
      id: crypto.randomUUID(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      achievements: []
    };
    onChange([...data, newExperience]);
  };

  const updateExperience = (index: number, field: keyof Experience, value: any) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeExperience = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Work Experience</h3>
          <p className="text-sm text-muted-foreground">Add your professional experience</p>
        </div>
        <Button onClick={addExperience} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Experience
        </Button>
      </div>

      {data.map((exp, index) => (
        <Card key={exp.id}>
          <CardHeader>
            <CardTitle className="flex justify-between">
              Experience {index + 1}
              <Button variant="ghost" size="sm" onClick={() => removeExperience(index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Company</Label>
                <Input 
                  value={exp.company} 
                  onChange={(e) => updateExperience(index, 'company', e.target.value)}
                  placeholder="Google Inc."
                />
              </div>
              <div>
                <Label>Position</Label>
                <Input 
                  value={exp.position} 
                  onChange={(e) => updateExperience(index, 'position', e.target.value)}
                  placeholder="Software Engineer"
                />
              </div>
            </div>
            <div>
              <Label>Location</Label>
              <Input 
                value={exp.location} 
                onChange={(e) => updateExperience(index, 'location', e.target.value)}
                placeholder="San Francisco, CA"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Date</Label>
                <Input 
                  type="date"
                  value={exp.startDate} 
                  onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                />
              </div>
              <div>
                <Label>End Date</Label>
                <Input 
                  type="date"
                  value={exp.endDate} 
                  onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                  disabled={exp.current}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
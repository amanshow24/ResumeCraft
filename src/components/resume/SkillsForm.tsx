// Simplified form component  
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import { Skill } from '@/types/resume';

interface SkillsFormProps {
  data: Skill[];
  onChange: (data: Skill[]) => void;
}

export function SkillsForm({ data, onChange }: SkillsFormProps) {
  const addSkill = () => {
    const newSkill: Skill = {
      id: crypto.randomUUID(),
      name: '',
      category: 'technical',
      level: 3
    };
    onChange([...data, newSkill]);
  };

  const updateSkill = (index: number, field: keyof Skill, value: any) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeSkill = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Skills</h3>
          <p className="text-sm text-muted-foreground">Add your technical and soft skills</p>
        </div>
        <Button onClick={addSkill} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Skill
        </Button>
      </div>

      {data.map((skill, index) => (
        <Card key={skill.id}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="grid grid-cols-4 gap-4 flex-1">
                <div>
                  <Label>Skill Name</Label>
                  <Input 
                    value={skill.name} 
                    onChange={(e) => updateSkill(index, 'name', e.target.value)}
                    placeholder="JavaScript"
                  />
                </div>
                <div>
                  <Label>Category</Label>
                  <Select value={skill.category} onValueChange={(value) => updateSkill(index, 'category', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technical">Technical</SelectItem>
                      <SelectItem value="soft">Soft Skills</SelectItem>
                      <SelectItem value="language">Language</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Level</Label>
                  <Select value={skill.level.toString()} onValueChange={(value) => updateSkill(index, 'level', parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 - Beginner</SelectItem>
                      <SelectItem value="2">2 - Novice</SelectItem>
                      <SelectItem value="3">3 - Intermediate</SelectItem>
                      <SelectItem value="4">4 - Advanced</SelectItem>
                      <SelectItem value="5">5 - Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button variant="ghost" size="sm" onClick={() => removeSkill(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
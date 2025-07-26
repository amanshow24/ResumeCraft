import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skill } from '@/types/resume';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from '@/components/ui/sortable-item';

const skillsSchema = z.object({
  skills: z.array(z.object({
    id: z.string(),
    name: z.string().min(1, 'Skill name is required'),
    category: z.enum(['technical', 'soft', 'language', 'other']),
    level: z.number().min(1).max(5)
  }))
});

interface SkillsFormProps {
  data: Skill[];
  onChange: (data: Skill[]) => void;
}

export function SkillsForm({ data, onChange }: SkillsFormProps) {
  const form = useForm({
    resolver: zodResolver(skillsSchema),
    defaultValues: { skills: data.length > 0 ? data : [createNewSkill()] },
    mode: 'onChange'
  });

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: 'skills'
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  React.useEffect(() => {
    const subscription = form.watch((values) => {
      onChange(values.skills || []);
    });
    return () => subscription.unsubscribe();
  }, [form, onChange]);

  function createNewSkill(): Skill {
    return {
      id: Date.now().toString(),
      name: '',
      category: 'technical',
      level: 3
    };
  }

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = fields.findIndex(field => field.id === active.id);
      const newIndex = fields.findIndex(field => field.id === over.id);
      
      move(oldIndex, newIndex);
    }
  };

  const getLevelText = (level: number) => {
    switch (level) {
      case 1: return 'Beginner';
      case 2: return 'Basic';
      case 3: return 'Intermediate';
      case 4: return 'Advanced';
      case 5: return 'Expert';
      default: return 'Intermediate';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Skills</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append(createNewSkill())}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Skill
        </Button>
      </div>

      <Form {...form}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={fields} strategy={verticalListSortingStrategy}>
            <div className="space-y-4">
              {fields.map((field, index) => (
                <SortableItem key={field.id} id={field.id}>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <div className="flex items-center gap-2">
                        <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                        <CardTitle className="text-base">
                          Skill {index + 1}
                        </CardTitle>
                      </div>
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => remove(index)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name={`skills.${index}.name`}
                          render={({ field: formField }) => (
                            <FormItem>
                              <FormLabel>Skill Name *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g., JavaScript, Leadership, Spanish"
                                  {...formField}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name={`skills.${index}.category`}
                          render={({ field: formField }) => (
                            <FormItem>
                              <FormLabel>Category</FormLabel>
                              <Select onValueChange={formField.onChange} defaultValue={formField.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="technical">Technical</SelectItem>
                                  <SelectItem value="soft">Soft Skills</SelectItem>
                                  <SelectItem value="language">Language</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`skills.${index}.level`}
                          render={({ field: formField }) => (
                            <FormItem>
                              <FormLabel>Level</FormLabel>
                              <Select 
                                onValueChange={(value) => formField.onChange(parseInt(value))} 
                                defaultValue={formField.value?.toString()}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select level" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="1">1 - Beginner</SelectItem>
                                  <SelectItem value="2">2 - Basic</SelectItem>
                                  <SelectItem value="3">3 - Intermediate</SelectItem>
                                  <SelectItem value="4">4 - Advanced</SelectItem>
                                  <SelectItem value="5">5 - Expert</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </SortableItem>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </Form>
    </div>
  );
}
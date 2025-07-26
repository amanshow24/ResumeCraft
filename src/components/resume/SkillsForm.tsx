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
    category: z.string().min(1, 'Category is required'),
    items: z.array(z.object({
      name: z.string().min(1, 'Skill name is required'),
      level: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert']).optional()
    })).min(1, 'At least one skill is required')
  }))
});

interface SkillsFormProps {
  data: Skill[];
  onChange: (data: Skill[]) => void;
}

export function SkillsForm({ data, onChange }: SkillsFormProps) {
  const form = useForm({
    resolver: zodResolver(skillsSchema),
    defaultValues: { skills: data.length > 0 ? data : [createNewSkillCategory()] },
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

  function createNewSkillCategory(): Skill {
    return {
      id: Date.now().toString(),
      category: '',
      items: [{ name: '', level: 'Intermediate' }]
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

  const addSkillItem = (categoryIndex: number) => {
    const items = form.getValues(`skills.${categoryIndex}.items`) || [];
    form.setValue(`skills.${categoryIndex}.items`, [...items, { name: '', level: 'Intermediate' }]);
  };

  const removeSkillItem = (categoryIndex: number, itemIndex: number) => {
    const items = form.getValues(`skills.${categoryIndex}.items`) || [];
    if (items.length > 1) {
      const updated = items.filter((_, i) => i !== itemIndex);
      form.setValue(`skills.${categoryIndex}.items`, updated);
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
          onClick={() => append(createNewSkillCategory())}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Category
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
              {fields.map((field, categoryIndex) => (
                <SortableItem key={field.id} id={field.id}>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <div className="flex items-center gap-2">
                        <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                        <CardTitle className="text-base">
                          Skill Category {categoryIndex + 1}
                        </CardTitle>
                      </div>
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => remove(categoryIndex)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name={`skills.${categoryIndex}.category`}
                        render={({ field: formField }) => (
                          <FormItem>
                            <FormLabel>Category Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Programming Languages, Frameworks, Tools" {...formField} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <FormLabel>Skills</FormLabel>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addSkillItem(categoryIndex)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        {form.watch(`skills.${categoryIndex}.items`)?.map((_, itemIndex) => (
                          <div key={itemIndex} className="flex gap-2">
                            <FormField
                              control={form.control}
                              name={`skills.${categoryIndex}.items.${itemIndex}.name`}
                              render={({ field: formField }) => (
                                <FormItem className="flex-1">
                                  <FormControl>
                                    <Input
                                      placeholder="e.g., JavaScript, React, Node.js"
                                      {...formField}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name={`skills.${categoryIndex}.items.${itemIndex}.level`}
                              render={({ field: formField }) => (
                                <FormItem className="w-32">
                                  <Select onValueChange={formField.onChange} defaultValue={formField.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Level" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="Beginner">Beginner</SelectItem>
                                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                                      <SelectItem value="Advanced">Advanced</SelectItem>
                                      <SelectItem value="Expert">Expert</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            {form.watch(`skills.${categoryIndex}.items`)?.length > 1 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removeSkillItem(categoryIndex, itemIndex)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
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
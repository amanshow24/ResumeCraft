import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Education } from '@/types/resume';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from '@/components/ui/sortable-item';

const educationSchema = z.object({
  education: z.array(z.object({
    id: z.string(),
    institution: z.string().min(1, 'Institution is required'),
    degree: z.string().min(1, 'Degree is required'),
    fieldOfStudy: z.string().min(1, 'Field of study is required'),
    location: z.string().min(1, 'Location is required'),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().optional(),
    gpa: z.string().optional(),
    achievements: z.array(z.string()).default([]),
    description: z.string().optional()
  }))
});

interface EducationFormProps {
  data: Education[];
  onChange: (data: Education[]) => void;
}

export function EducationForm({ data, onChange }: EducationFormProps) {
  const form = useForm({
    resolver: zodResolver(educationSchema),
    defaultValues: { education: data.length > 0 ? data : [createNewEducation()] },
    mode: 'onChange'
  });

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: 'education'
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  React.useEffect(() => {
    const subscription = form.watch((values) => {
      onChange(values.education || []);
    });
    return () => subscription.unsubscribe();
  }, [form, onChange]);

  function createNewEducation(): Education {
    return {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      fieldOfStudy: '',
      location: '',
      startDate: '',
      endDate: '',
      gpa: '',
      achievements: [],
      description: ''
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

  const addAchievement = (educationIndex: number) => {
    const achievements = form.getValues(`education.${educationIndex}.achievements`) || [];
    form.setValue(`education.${educationIndex}.achievements`, [...achievements, '']);
  };

  const removeAchievement = (educationIndex: number, achievementIndex: number) => {
    const achievements = form.getValues(`education.${educationIndex}.achievements`) || [];
    const updated = achievements.filter((_, i) => i !== achievementIndex);
    form.setValue(`education.${educationIndex}.achievements`, updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Education</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append(createNewEducation())}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Education
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
                          Education {index + 1}
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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`education.${index}.institution`}
                          render={({ field: formField }) => (
                            <FormItem>
                              <FormLabel>Institution *</FormLabel>
                              <FormControl>
                                <Input placeholder="University of California" {...formField} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`education.${index}.degree`}
                          render={({ field: formField }) => (
                            <FormItem>
                              <FormLabel>Degree *</FormLabel>
                              <FormControl>
                                <Input placeholder="Bachelor of Science" {...formField} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`education.${index}.fieldOfStudy`}
                          render={({ field: formField }) => (
                            <FormItem>
                              <FormLabel>Field of Study *</FormLabel>
                              <FormControl>
                                <Input placeholder="Computer Science" {...formField} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`education.${index}.location`}
                          render={({ field: formField }) => (
                            <FormItem>
                              <FormLabel>Location *</FormLabel>
                              <FormControl>
                                <Input placeholder="Berkeley, CA" {...formField} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`education.${index}.startDate`}
                          render={({ field: formField }) => (
                            <FormItem>
                              <FormLabel>Start Date *</FormLabel>
                              <FormControl>
                                <Input type="month" {...formField} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`education.${index}.endDate`}
                          render={({ field: formField }) => (
                            <FormItem>
                              <FormLabel>End Date</FormLabel>
                              <FormControl>
                                <Input type="month" {...formField} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`education.${index}.gpa`}
                          render={({ field: formField }) => (
                            <FormItem className="md:col-span-2">
                              <FormLabel>GPA (Optional)</FormLabel>
                              <FormControl>
                                <Input placeholder="3.8/4.0" {...formField} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name={`education.${index}.description`}
                        render={({ field: formField }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Relevant coursework, thesis, or additional details..."
                                {...formField}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <FormLabel>Achievements & Honors</FormLabel>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addAchievement(index)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        {form.watch(`education.${index}.achievements`)?.map((_, achievementIndex) => (
                          <div key={achievementIndex} className="flex gap-2">
                            <FormField
                              control={form.control}
                              name={`education.${index}.achievements.${achievementIndex}`}
                              render={({ field: formField }) => (
                                <FormItem className="flex-1">
                                  <FormControl>
                                    <Input
                                      placeholder="• Dean's List, Summa Cum Laude, etc."
                                      {...formField}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeAchievement(index, achievementIndex)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
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
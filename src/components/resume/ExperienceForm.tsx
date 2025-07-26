import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Experience } from '@/types/resume';
import { Plus, Trash2, Sparkles, GripVertical } from 'lucide-react';
import { generateAIBulletPoints } from '@/utils/aiHelpers';
import { useToast } from '@/hooks/use-toast';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from '@/components/ui/sortable-item';

const experienceSchema = z.object({
  experience: z.array(z.object({
    id: z.string(),
    jobTitle: z.string().min(1, 'Job title is required'),
    company: z.string().min(1, 'Company is required'),
    location: z.string().min(1, 'Location is required'),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().optional(),
    current: z.boolean().default(false),
    description: z.string().optional(),
    achievements: z.array(z.string()).default([])
  }))
});

interface ExperienceFormProps {
  data: Experience[];
  onChange: (data: Experience[]) => void;
}

export function ExperienceForm({ data, onChange }: ExperienceFormProps) {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = React.useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(experienceSchema),
    defaultValues: { experience: data.length > 0 ? data : [createNewExperience()] },
    mode: 'onChange'
  });

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: 'experience'
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  React.useEffect(() => {
    const subscription = form.watch((values) => {
      onChange(values.experience || []);
    });
    return () => subscription.unsubscribe();
  }, [form, onChange]);

  function createNewExperience(): Experience {
    return {
      id: Date.now().toString(),
      jobTitle: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      achievements: []
    };
  }

  const handleGenerateAIBulletPoints = async (index: number) => {
    const experienceData = form.getValues(`experience.${index}`);
    
    if (!experienceData.jobTitle || !experienceData.company) {
      toast({
        title: "Missing Information",
        description: "Please enter job title and company first",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(experienceData.id);
    try {
      const bulletPoints = await generateAIBulletPoints(experienceData);
      form.setValue(`experience.${index}.achievements`, bulletPoints);
      toast({
        title: "Success",
        description: "AI bullet points generated successfully"
      });
    } catch (error) {
      console.error('Error generating AI bullet points:', error);
      toast({
        title: "Error",
        description: "Failed to generate AI bullet points. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(null);
    }
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = fields.findIndex(field => field.id === active.id);
      const newIndex = fields.findIndex(field => field.id === over.id);
      
      move(oldIndex, newIndex);
    }
  };

  const addAchievement = (experienceIndex: number) => {
    const achievements = form.getValues(`experience.${experienceIndex}.achievements`) || [];
    form.setValue(`experience.${experienceIndex}.achievements`, [...achievements, '']);
  };

  const removeAchievement = (experienceIndex: number, achievementIndex: number) => {
    const achievements = form.getValues(`experience.${experienceIndex}.achievements`) || [];
    const updated = achievements.filter((_, i) => i !== achievementIndex);
    form.setValue(`experience.${experienceIndex}.achievements`, updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Work Experience</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append(createNewExperience())}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Experience
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
                          Experience {index + 1}
                        </CardTitle>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleGenerateAIBulletPoints(index)}
                          disabled={isGenerating === field.id}
                          className="flex items-center gap-2"
                        >
                          <Sparkles className="h-4 w-4" />
                          {isGenerating === field.id ? 'Generating...' : 'AI Bullets'}
                        </Button>
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
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`experience.${index}.jobTitle`}
                          render={({ field: formField }) => (
                            <FormItem>
                              <FormLabel>Job Title *</FormLabel>
                              <FormControl>
                                <Input placeholder="Software Engineer" {...formField} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`experience.${index}.company`}
                          render={({ field: formField }) => (
                            <FormItem>
                              <FormLabel>Company *</FormLabel>
                              <FormControl>
                                <Input placeholder="Tech Corp" {...formField} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`experience.${index}.location`}
                          render={({ field: formField }) => (
                            <FormItem>
                              <FormLabel>Location *</FormLabel>
                              <FormControl>
                                <Input placeholder="San Francisco, CA" {...formField} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="space-y-2">
                          <FormField
                            control={form.control}
                            name={`experience.${index}.current`}
                            render={({ field: formField }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                <div className="space-y-0.5">
                                  <FormLabel>Current Job</FormLabel>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={formField.value}
                                    onCheckedChange={formField.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name={`experience.${index}.startDate`}
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
                          name={`experience.${index}.endDate`}
                          render={({ field: formField }) => (
                            <FormItem>
                              <FormLabel>End Date</FormLabel>
                              <FormControl>
                                <Input 
                                  type="month" 
                                  {...formField} 
                                  disabled={form.watch(`experience.${index}.current`)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name={`experience.${index}.description`}
                        render={({ field: formField }) => (
                          <FormItem>
                            <FormLabel>Job Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Brief description of your role and responsibilities..."
                                {...formField}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <FormLabel>Key Achievements</FormLabel>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addAchievement(index)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        {form.watch(`experience.${index}.achievements`)?.map((_, achievementIndex) => (
                          <div key={achievementIndex} className="flex gap-2">
                            <FormField
                              control={form.control}
                              name={`experience.${index}.achievements.${achievementIndex}`}
                              render={({ field: formField }) => (
                                <FormItem className="flex-1">
                                  <FormControl>
                                    <Input
                                      placeholder="• Improved system performance by 40%..."
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
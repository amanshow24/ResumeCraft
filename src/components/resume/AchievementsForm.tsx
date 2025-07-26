import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Achievement } from '@/types/resume';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from '@/components/ui/sortable-item';

const achievementsSchema = z.object({
  achievements: z.array(z.object({
    id: z.string(),
    title: z.string().min(1, 'Title is required'),
    organization: z.string().optional(),
    date: z.string().min(1, 'Date is required'),
    description: z.string().min(1, 'Description is required')
  }))
});

interface AchievementsFormProps {
  data: Achievement[];
  onChange: (data: Achievement[]) => void;
}

export function AchievementsForm({ data, onChange }: AchievementsFormProps) {
  const form = useForm({
    resolver: zodResolver(achievementsSchema),
    defaultValues: { achievements: data.length > 0 ? data : [createNewAchievement()] },
    mode: 'onChange'
  });

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: 'achievements'
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  React.useEffect(() => {
    const subscription = form.watch((values) => {
      onChange(values.achievements || []);
    });
    return () => subscription.unsubscribe();
  }, [form, onChange]);

  function createNewAchievement(): Achievement {
    return {
      id: Date.now().toString(),
      title: '',
      organization: '',
      date: '',
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Achievements & Awards</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append(createNewAchievement())}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Achievement
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
                          Achievement {index + 1}
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
                          name={`achievements.${index}.title`}
                          render={({ field: formField }) => (
                            <FormItem>
                              <FormLabel>Title *</FormLabel>
                              <FormControl>
                                <Input placeholder="Employee of the Year" {...formField} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`achievements.${index}.organization`}
                          render={({ field: formField }) => (
                            <FormItem>
                              <FormLabel>Organization</FormLabel>
                              <FormControl>
                                <Input placeholder="Tech Corp" {...formField} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`achievements.${index}.date`}
                          render={({ field: formField }) => (
                            <FormItem className="md:col-span-2">
                              <FormLabel>Date *</FormLabel>
                              <FormControl>
                                <Input type="month" {...formField} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name={`achievements.${index}.description`}
                        render={({ field: formField }) => (
                          <FormItem>
                            <FormLabel>Description *</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Brief description of the achievement and its impact..."
                                {...formField}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
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
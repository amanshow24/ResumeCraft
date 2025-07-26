import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CustomSection } from '@/types/resume';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from '@/components/ui/sortable-item';

const customSectionsSchema = z.object({
  customSections: z.array(z.object({
    id: z.string(),
    title: z.string().min(1, 'Section title is required'),
    items: z.array(z.object({
      title: z.string().min(1, 'Item title is required'),
      subtitle: z.string().optional(),
      date: z.string().optional(),
      description: z.string().optional()
    })).min(1, 'At least one item is required')
  }))
});

interface CustomSectionsFormProps {
  data: CustomSection[];
  onChange: (data: CustomSection[]) => void;
}

export function CustomSectionsForm({ data, onChange }: CustomSectionsFormProps) {
  const form = useForm({
    resolver: zodResolver(customSectionsSchema),
    defaultValues: { customSections: data.length > 0 ? data : [] },
    mode: 'onChange'
  });

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: 'customSections'
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  React.useEffect(() => {
    const subscription = form.watch((values) => {
      onChange(values.customSections || []);
    });
    return () => subscription.unsubscribe();
  }, [form, onChange]);

  function createNewCustomSection(): CustomSection {
    return {
      id: Date.now().toString(),
      title: '',
      items: [{ title: '', subtitle: '', date: '', description: '' }]
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

  const addSectionItem = (sectionIndex: number) => {
    const items = form.getValues(`customSections.${sectionIndex}.items`) || [];
    form.setValue(`customSections.${sectionIndex}.items`, [...items, { title: '', subtitle: '', date: '', description: '' }]);
  };

  const removeSectionItem = (sectionIndex: number, itemIndex: number) => {
    const items = form.getValues(`customSections.${sectionIndex}.items`) || [];
    if (items.length > 1) {
      const updated = items.filter((_, i) => i !== itemIndex);
      form.setValue(`customSections.${sectionIndex}.items`, updated);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Custom Sections</h3>
          <p className="text-sm text-muted-foreground">
            Add additional sections like Projects, Certifications, Publications, etc.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append(createNewCustomSection())}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Section
        </Button>
      </div>

      {fields.length === 0 && (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">No custom sections added yet</p>
              <Button
                type="button"
                variant="outline"
                onClick={() => append(createNewCustomSection())}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Your First Section
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Form {...form}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={fields} strategy={verticalListSortingStrategy}>
            <div className="space-y-4">
              {fields.map((field, sectionIndex) => (
                <SortableItem key={field.id} id={field.id}>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <div className="flex items-center gap-2">
                        <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                        <CardTitle className="text-base">
                          Custom Section {sectionIndex + 1}
                        </CardTitle>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => remove(sectionIndex)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name={`customSections.${sectionIndex}.title`}
                        render={({ field: formField }) => (
                          <FormItem>
                            <FormLabel>Section Title *</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Projects, Certifications, Publications" {...formField} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <FormLabel>Section Items</FormLabel>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addSectionItem(sectionIndex)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        {form.watch(`customSections.${sectionIndex}.items`)?.map((_, itemIndex) => (
                          <Card key={itemIndex} className="border-l-4 border-l-primary/20">
                            <CardContent className="pt-4">
                              <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <h4 className="text-sm font-medium">Item {itemIndex + 1}</h4>
                                  {form.watch(`customSections.${sectionIndex}.items`)?.length > 1 && (
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => removeSectionItem(sectionIndex, itemIndex)}
                                      className="text-destructive hover:text-destructive"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <FormField
                                    control={form.control}
                                    name={`customSections.${sectionIndex}.items.${itemIndex}.title`}
                                    render={({ field: formField }) => (
                                      <FormItem>
                                        <FormLabel>Title *</FormLabel>
                                        <FormControl>
                                          <Input placeholder="e.g., Project Name, Certificate Title" {...formField} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />

                                  <FormField
                                    control={form.control}
                                    name={`customSections.${sectionIndex}.items.${itemIndex}.subtitle`}
                                    render={({ field: formField }) => (
                                      <FormItem>
                                        <FormLabel>Subtitle</FormLabel>
                                        <FormControl>
                                          <Input placeholder="e.g., Organization, Technology Used" {...formField} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />

                                  <FormField
                                    control={form.control}
                                    name={`customSections.${sectionIndex}.items.${itemIndex}.date`}
                                    render={({ field: formField }) => (
                                      <FormItem className="md:col-span-2">
                                        <FormLabel>Date</FormLabel>
                                        <FormControl>
                                          <Input placeholder="e.g., 2023, June 2023, 2022-2023" {...formField} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>

                                <FormField
                                  control={form.control}
                                  name={`customSections.${sectionIndex}.items.${itemIndex}.description`}
                                  render={({ field: formField }) => (
                                    <FormItem>
                                      <FormLabel>Description</FormLabel>
                                      <FormControl>
                                        <Textarea
                                          placeholder="Brief description of the project, certification, or achievement..."
                                          {...formField}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </CardContent>
                          </Card>
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
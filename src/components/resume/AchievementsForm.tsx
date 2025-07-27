import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Plus, GripVertical } from 'lucide-react';
import { Achievement } from '@/types/resume';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableItem } from '@/components/ui/sortable-item';

const achievementSchema = z.object({
  achievements: z.array(z.object({
    id: z.string(),
    title: z.string().min(1, 'Title is required'),
    organization: z.string().optional(),
    date: z.string().min(1, 'Date is required'),
    description: z.string().min(1, 'Description is required'),
  }))
});

type AchievementFormData = z.infer<typeof achievementSchema>;

interface AchievementsFormProps {
  data: Achievement[];
  onChange: (data: Achievement[]) => void;
}

export function AchievementsForm({ data, onChange }: AchievementsFormProps) {
  const form = useForm<AchievementFormData>({
    resolver: zodResolver(achievementSchema),
    defaultValues: { achievements: data },
    mode: 'onChange'
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  React.useEffect(() => {
    const subscription = form.watch((values) => {
      if (values.achievements) {
        onChange(values.achievements as Achievement[]);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, onChange]);

  React.useEffect(() => {
    form.setValue('achievements', data);
  }, [data, form]);

  function createNewAchievement(): Achievement {
    return {
      id: crypto.randomUUID(),
      title: '',
      organization: '',
      date: '',
      description: ''
    };
  }

  const addAchievement = () => {
    const currentAchievements = form.getValues('achievements');
    const newAchievement = createNewAchievement();
    form.setValue('achievements', [...currentAchievements, newAchievement]);
  };

  const removeAchievement = (index: number) => {
    const currentAchievements = form.getValues('achievements');
    form.setValue('achievements', currentAchievements.filter((_, i) => i !== index));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const achievements = form.getValues('achievements');
      const activeIndex = achievements.findIndex(item => item.id === active.id);
      const overIndex = achievements.findIndex(item => item.id === over.id);

      if (activeIndex !== -1 && overIndex !== -1) {
        const reorderedAchievements = arrayMove(achievements, activeIndex, overIndex);
        form.setValue('achievements', reorderedAchievements);
      }
    }
  };

  const achievements = form.watch('achievements');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Achievements & Awards</h3>
          <p className="text-sm text-muted-foreground">
            Add your professional achievements, awards, and recognitions
          </p>
        </div>
        <Button type="button" onClick={addAchievement} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Achievement
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={achievements} strategy={verticalListSortingStrategy}>
          <div className="space-y-4">
            {achievements.map((achievement, index) => (
              <SortableItem key={achievement.id} id={achievement.id}>
                <Card>
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                        Achievement {index + 1}
                      </CardTitle>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAchievement(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`achievement-title-${index}`}>
                          Title *
                        </Label>
                        <Input
                          id={`achievement-title-${index}`}
                          {...form.register(`achievements.${index}.title`)}
                          placeholder="e.g., Employee of the Year"
                        />
                        {form.formState.errors.achievements?.[index]?.title && (
                          <p className="text-sm text-destructive">
                            {form.formState.errors.achievements[index]?.title?.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`achievement-organization-${index}`}>
                          Organization
                        </Label>
                        <Input
                          id={`achievement-organization-${index}`}
                          {...form.register(`achievements.${index}.organization`)}
                          placeholder="e.g., Microsoft"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`achievement-date-${index}`}>
                        Date *
                      </Label>
                      <Input
                        id={`achievement-date-${index}`}
                        type="date"
                        {...form.register(`achievements.${index}.date`)}
                      />
                      {form.formState.errors.achievements?.[index]?.date && (
                        <p className="text-sm text-destructive">
                          {form.formState.errors.achievements[index]?.date?.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`achievement-description-${index}`}>
                        Description *
                      </Label>
                      <Textarea
                        id={`achievement-description-${index}`}
                        {...form.register(`achievements.${index}.description`)}
                        placeholder="Describe your achievement and its impact..."
                        rows={3}
                      />
                      {form.formState.errors.achievements?.[index]?.description && (
                        <p className="text-sm text-destructive">
                          {form.formState.errors.achievements[index]?.description?.message}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </SortableItem>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {achievements.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                No achievements added yet. Click "Add Achievement" to get started.
              </p>
              <Button type="button" onClick={addAchievement} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Achievement
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
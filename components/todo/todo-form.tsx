/**
 * Todo Form Component
 *
 * Form for creating/editing todos with all required fields:
 * - Title (1-100 chars, required)
 * - Description (max 500 chars, required)
 * - Icon (from TODO_ICON_OPTIONS, required)
 * - Due Date (ISO 8601 datetime, required)
 *
 * Uses React Hook Form + Zod for validation.
 */

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { Textarea } from '../ui/textarea';
import { TodoDateTimePicker } from './datetime-picker';
import { IconPicker } from './icon-picker';

const todoFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .max(100, 'Title must be 100 characters or less'),
  description: z.string().max(500, 'Description must be 500 characters or less'),
  icon: z.string().min(1, 'Please select an icon'),
  dueDate: z.date().min(1, 'Due date is required'),
});

type TodoFormData = z.infer<typeof todoFormSchema>;

interface TodoFormProps {
  onSubmit: (data: TodoFormData) => void | Promise<void>;
  onCancel?: () => void;
  initialData?: Partial<TodoFormData>;
  isLoading?: boolean;
}

export function TodoForm({ onSubmit, onCancel, initialData, isLoading }: TodoFormProps) {
  const newDueDate = new Date();
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<TodoFormData>({
    resolver: zodResolver(todoFormSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      icon: initialData?.icon || '',
      dueDate: initialData?.dueDate || newDueDate,
    },
  });

  const title = watch('title');
  const description = watch('description');

  async function handleFormSubmit(data: TodoFormData) {
    await onSubmit(data);
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1">
      <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={true}>
        <View className="gap-4">
          {/* Title Input */}
          <View className="gap-2">
            <Text className="font-medium text-foreground text-sm">Title</Text>
            <Controller
              control={control}
              name="title"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  testID="todo-title-input"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Enter todo title (max 100 chars)"
                  maxLength={100}
                  editable={!isLoading}
                />
              )}
            />
            {errors.title && (
              <Text className="text-destructive text-xs">{errors.title.message}</Text>
            )}
            <Text className="text-muted-foreground text-xs">{title.length}/100 characters</Text>
          </View>

          {/* Description Input */}
          <View className="gap-2">
            <Text className="font-medium text-foreground text-sm">Description</Text>
            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, onBlur, value } }) => (
                <Textarea
                  testID="todo-description-input"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Enter todo description (max 500 chars)"
                  multiline
                  numberOfLines={4}
                  maxLength={500}
                  editable={!isLoading}
                  className="min-h-24"
                />
              )}
            />
            {errors.description && (
              <Text className="text-destructive text-xs">{errors.description.message}</Text>
            )}
            <Text className="text-muted-foreground text-xs">
              {description.length}/500 characters
            </Text>
          </View>

          {/* Icon Picker */}
          <View className="gap-2">
            <Controller
              control={control}
              name="icon"
              render={({ field: { onChange, value } }) => (
                <IconPicker
                  selectedIcon={value}
                  onSelectIcon={onChange}
                  testID="todo-icon-picker"
                />
              )}
            />
            {errors.icon && <Text className="text-destructive text-xs">{errors.icon.message}</Text>}
          </View>

          {/* Due Date Picker */}
          <Controller
            control={control}
            name="dueDate"
            render={({ field: { onChange, value } }) => (
              <TodoDateTimePicker
                value={value}
                onChange={(date) => {
                  onChange(date);
                }}
                error={errors.dueDate?.message}
                testID="todo-due-date-picker"
              />
            )}
          />

          {/* Action Buttons */}
          <View className="mt-4 mb-safe-offset-4 gap-3">
            <Button
              testID="create-todo-submit"
              onPress={handleSubmit(handleFormSubmit)}
              disabled={isLoading}>
              <Text className="font-medium text-primary-foreground">
                {isLoading ? 'Creating...' : 'Create Todo'}
              </Text>
            </Button>

            {onCancel && (
              <Button variant="outline" onPress={onCancel} disabled={isLoading}>
                <Text className="text-foreground">Cancel</Text>
              </Button>
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/**
 * Todo Form Component
 *
 * Form for creating/editing todos with all required fields:
 * - Title (1-100 chars, required)
 * - Description (max 500 chars, required)
 * - Icon (from TODO_ICON_OPTIONS, required)
 * - Due Date (ISO 8601 datetime, required)
 *
 * Validates all fields on submit.
 */

import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { validateTodoFields } from '@/lib/utils/validation';
import { Textarea } from '../ui/textarea';
import { TodoDateTimePicker } from './datetime-picker';
import { IconPicker } from './icon-picker';

interface TodoFormData {
  title: string;
  description: string;
  icon: string;
  dueDate: string; // ISO 8601 string
}

interface TodoFormProps {
  onSubmit: (data: TodoFormData) => void | Promise<void>;
  onCancel?: () => void;
  initialData?: Partial<TodoFormData>;
  isLoading?: boolean;
}

export function TodoForm({ onSubmit, onCancel, initialData, isLoading }: TodoFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [icon, setIcon] = useState(initialData?.icon || '');
  const [dueDate, setDueDate] = useState<Date | undefined>(
    initialData?.dueDate ? new Date(initialData.dueDate) : undefined
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async () => {
    // Validate all fields
    const validationErrors = validateTodoFields({
      title,
      description,
      icon,
      dueDate: dueDate?.toISOString() ?? '',
    });

    // If validation errors, display them and stop
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Clear errors and submit
    setErrors({});
    await onSubmit({
      title: title.trim(),
      description,
      icon,
      dueDate: dueDate?.toISOString() ?? '',
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1">
      <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={true}>
        <View className="gap-4">
          {/* Title Input */}
          <View className="gap-2">
            <Label>Title</Label>
            <Input
              testID="todo-title-input"
              value={title}
              onChangeText={(text) => {
                setTitle(text);
                // Clear error on change
                if (errors.title) {
                  setErrors((prev) => ({ ...prev, title: '' }));
                }
              }}
              placeholder="Enter todo title (max 100 chars)"
              maxLength={100}
              editable={!isLoading}
            />
            {errors.title && <Text className="text-destructive text-xs">{errors.title}</Text>}
            <Text className="text-muted-foreground text-xs">{title.length}/100 characters</Text>
          </View>

          {/* Description Input */}
          <View className="gap-2">
            <Label>Description</Label>
            <Textarea
              testID="todo-description-input"
              value={description}
              onChangeText={(text) => {
                setDescription(text);
                // Clear error on change
                if (errors.description) {
                  setErrors((prev) => ({ ...prev, description: '' }));
                }
              }}
              placeholder="Enter todo description (max 500 chars)"
              multiline
              numberOfLines={4}
              maxLength={500}
              editable={!isLoading}
              className="min-h-24"
            />
            {errors.description && (
              <Text className="text-destructive text-xs">{errors.description}</Text>
            )}
            <Text className="text-muted-foreground text-xs">
              {description.length}/500 characters
            </Text>
          </View>

          {/* Icon Picker */}
          <View className="gap-2">
            <IconPicker
              selectedIcon={icon}
              onSelectIcon={(selectedIcon) => {
                setIcon(selectedIcon);
                // Clear error on change
                if (errors.icon) {
                  setErrors((prev) => ({ ...prev, icon: '' }));
                }
              }}
              testID="todo-icon-picker"
            />
            {errors.icon && <Text className="text-destructive text-xs">{errors.icon}</Text>}
          </View>

          {/* Due Date Picker */}
          <TodoDateTimePicker
            value={dueDate}
            onChange={(date) => {
              setDueDate(date);
              // Clear error on change
              if (errors.dueDate) {
                setErrors((prev) => ({ ...prev, dueDate: '' }));
              }
            }}
            error={errors.dueDate}
            testID="todo-due-date-picker"
          />

          {/* Action Buttons */}
          <View className="mt-4 mb-safe-offset-4 gap-3">
            <Button testID="create-todo-submit" onPress={handleSubmit} disabled={isLoading}>
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

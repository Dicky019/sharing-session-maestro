/**
 * DateTime Picker Component
 *
 * Platform-specific date/time picker:
 * - iOS/Android: Native picker from @react-native-community/datetimepicker
 * - Web: HTML5 datetime-local input
 */

import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Calendar } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { useState } from 'react';
import { Platform, Pressable, TextInput, View } from 'react-native';
import { FadeIn } from 'react-native-reanimated';
import { Label } from '@/components/ui/label';
import { NativeOnlyAnimatedView } from '@/components/ui/native-only-animated-view';
import { Text } from '@/components/ui/text';

interface DateTimePickerProps {
  value?: Date;
  onChange: (date: Date) => void;
  label?: string;
  error?: string;
  testID?: string;
}

export function TodoDateTimePicker({
  value,
  onChange,
  label = 'Due Date',
  error,
  testID = 'todo-due-date-picker',
}: DateTimePickerProps) {
  const { colorScheme } = useColorScheme();
  const [showPicker, setShowPicker] = useState(false);
  const iconColor = colorScheme === 'dark' ? '#ffffff' : '#000000';

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  // Handle native picker change (iOS/Android)
  const handleNativeChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowPicker(Platform.OS === 'ios'); // Keep open on iOS
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  // Handle web input change
  const handleWebChange = (value: string) => {
    if (value) {
      onChange(new Date(value));
    }
  };

  // Web implementation
  if (Platform.OS === 'web') {
    return (
      <View className="gap-2">
        <Label nativeID={testID}>{label}</Label>
        <TextInput
          nativeID={testID}
          value={value ? value.toISOString().slice(0, 16) : ''}
          onChange={(e) => handleWebChange((e.target as any).value)}
          className="h-12 rounded-lg border border-input bg-background px-4 text-foreground"
          placeholder="Select date and time"
          // @ts-expect-error - Web-specific props
          type="datetime-local"
        />
        {error && <Text className="text-destructive text-xs">{error}</Text>}
      </View>
    );
  }

  // Native (iOS/Android) implementation
  return (
    <View className="gap-2">
      <Label nativeID={testID}>{label}</Label>
      <View
        testID={testID}
        nativeID={testID}
        className={`h-12 flex-row items-center gap-2 rounded-md border border-input px-4 ${error ? 'border-destructive' : 'border-input'}bg-background`}>
        <Calendar size={20} color={iconColor} />
        <DateTimePicker
          testID="todo-due-date"
          value={value || new Date()}
          mode="date"
          display="default"
          onChange={handleNativeChange}
          minimumDate={new Date()} // Don't allow past dates
        />
        <DateTimePicker
          testID="todo-due-time"
          value={value || new Date()}
          mode="time"
          display="default"
          onChange={handleNativeChange}
          minimumDate={new Date()} // Don't allow past dates
        />
      </View>

      {error && <Text className="text-destructive text-xs">{error}</Text>}
    </View>
  );
}

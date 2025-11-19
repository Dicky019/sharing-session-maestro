/**
 * DateTime Picker Component
 *
 * Platform-specific date/time picker:
 * - iOS: Button with Popover containing inline picker
 * - Android: Button that shows native modal DateTimePicker
 * - Web: HTML5 datetime-local input
 */

import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Calendar } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { useState } from 'react';
import { Platform, Pressable, TextInput, View } from 'react-native';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';

interface DateTimePickerProps {
  value: Date;
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
  const iconColor = colorScheme === 'dark' ? '#ffffff' : '#000000';
  const [showAndroidPicker, setShowAndroidPicker] = useState(false);
  const [showAndroidTimePicker, setShowAndroidTimePicker] = useState(false);

  // Format date for display
  const formatDateTime = (date: Date) => {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Handle native picker change (iOS/Android)
  const handleNativeChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowAndroidPicker(false);
      if (_event.type === 'set' && selectedDate) {
        // After date is selected, show time picker
        onChange(selectedDate);
        setShowAndroidTimePicker(true);
      }
    } else if (selectedDate) {
      onChange(selectedDate);
    }
  };

  // Handle time picker change (Android only)
  const handleTimeChange = (_event: DateTimePickerEvent, selectedTime?: Date) => {
    setShowAndroidTimePicker(false);
    if (_event.type === 'set' && selectedTime) {
      // Combine the current date with the selected time
      const combined = new Date(value);
      combined.setHours(selectedTime.getHours());
      combined.setMinutes(selectedTime.getMinutes());
      onChange(combined);
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

  // Android implementation - modal DateTimePicker
  if (Platform.OS === 'android') {
    return (
      <View className="gap-2">
        <Label nativeID={testID}>{label}</Label>
        <Pressable
          testID={testID}
          onPress={() => setShowAndroidPicker(true)}
          className={`h-12 flex-row items-center gap-2 rounded-md border px-4 ${error ? 'border-destructive' : 'border-input'} bg-background`}>
          <Calendar size={20} color={iconColor} />
          <Text className="flex-1 text-foreground">{formatDateTime(value)}</Text>
        </Pressable>

        {showAndroidPicker && (
          <DateTimePicker
            testID="android-date-picker"
            value={value}
            mode="date"
            display="default"
            onChange={handleNativeChange}
            minimumDate={new Date()}
          />
        )}

        {showAndroidTimePicker && (
          <DateTimePicker
            testID="android-time-picker"
            value={value}
            mode="time"
            display="default"
            onChange={handleTimeChange}
          />
        )}

        {error && <Text className="text-destructive text-xs">{error}</Text>}
      </View>
    );
  }

  // iOS implementation - Popover with inline picker
  return (
    <View className="gap-2">
      <Label nativeID={testID}>{label}</Label>
      <View
        testID={testID}
        nativeID={testID}
        className={`h-12 flex-row items-center gap-2 rounded-md border border-input px-4 ${error ? 'border-destructive' : 'border-input'}bg-background`}>
        <Calendar size={20} color={iconColor} />
        <DateTimePicker
          testID="todo-ios-due-date"
          value={value}
          mode="date"
          display="default"
          onChange={handleNativeChange}
          minimumDate={new Date()} // Don't allow past dates
        />
      </View>

      {error && <Text className="text-destructive text-xs">{error}</Text>}
    </View>
  );
}

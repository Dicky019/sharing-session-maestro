/**
 * Icon Picker Component
 *
 * Displays a grid of available todo icons from TODO_ICON_OPTIONS.
 * Users can tap an icon to select it.
 */

import {
  AlarmClock,
  AlertCircle,
  AlertTriangle,
  Book,
  Briefcase,
  Calendar,
  CheckCircle,
  CheckSquare,
  Clipboard,
  Clock,
  Coffee,
  FileText,
  Flag,
  Heart,
  Home,
  Lightbulb,
  ListTodo,
  type LucideIcon,
  Mail,
  MessageCircle,
  Pause,
  Phone,
  Play,
  Repeat,
  ShoppingCart,
  Star,
  Timer,
  XCircle,
} from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { Pressable, ScrollView, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { TODO_ICON_OPTIONS } from '@/lib/types/todo';

// Map icon names to components
const ICON_MAP: Record<string, LucideIcon> = {
  CheckSquare,
  Clipboard,
  ListTodo,
  FileText,
  Calendar,
  Clock,
  Timer,
  AlarmClock,
  Star,
  Flag,
  AlertCircle,
  AlertTriangle,
  Home,
  Briefcase,
  ShoppingCart,
  Heart,
  Coffee,
  Play,
  Pause,
  Repeat,
  CheckCircle,
  XCircle,
  Lightbulb,
  MessageCircle,
  Phone,
  Mail,
  Book,
};

interface IconPickerProps {
  selectedIcon?: string;
  onSelectIcon: (icon: string) => void;
  testID?: string;
}

export function IconPicker({ selectedIcon, onSelectIcon, testID }: IconPickerProps) {
  const { colorScheme } = useColorScheme();
  const iconColor = colorScheme === 'dark' ? '#ffffff' : '#000000';

  return (
    <View className="gap-3" testID={testID}>
      <Text className="font-medium text-sm">Select Icon</Text>
      <ScrollView
        className="max-h-96 rounded-lg border border-input p-3"
        showsVerticalScrollIndicator={true}>
        <View className="flex-row flex-wrap justify-between gap-2">
          {TODO_ICON_OPTIONS.map((iconName) => {
            const IconComponent = ICON_MAP[iconName];
            const isSelected = selectedIcon === iconName;

            return (
              <Pressable
                key={iconName}
                onPress={() => onSelectIcon(iconName)}
                accessibilityLabel={iconName}
                accessibilityRole="button"
                className={`h-14 w-14 items-center justify-center rounded-lg border ${isSelected ? 'border-primary bg-primary' : 'border-input bg-background'}
                `}>
                {IconComponent && (
                  <IconComponent size={24} color={isSelected ? '#ffffff' : iconColor} />
                )}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
      {selectedIcon && (
        <Text className="text-muted-foreground text-xs">Selected: {selectedIcon}</Text>
      )}
    </View>
  );
}

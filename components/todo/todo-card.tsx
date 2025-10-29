/**
 * Todo Card Component
 *
 * Displays a todo item with icon, title, description, due date, and status.
 * Used in todo lists across all status tabs.
 */

import * as Icons from 'lucide-react-native';
import { Calendar } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { Pressable, View } from 'react-native';
import { Card, CardContent } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { TODO_STATUS_LABELS, type Todo } from '@/lib/types/todo';

interface TodoCardProps {
  todo: Todo;
  onPress?: (todo: Todo) => void;
  testID?: string;
}

export function TodoCard({ todo, onPress, testID }: TodoCardProps) {
  const { colorScheme } = useColorScheme();
  const iconColor = colorScheme === 'dark' ? '#ffffff' : '#000000';

  // Get the icon component dynamically
  const IconComponent = Icons[todo.icon as keyof typeof Icons] as any;

  // Format due date
  const formatDueDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const isOverdue = date < now && todo.status !== 'complete';

    return {
      text: date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      }),
      isOverdue,
    };
  };

  const dueDate = formatDueDate(todo.dueDate);

  // Status badge colors
  const statusColors = {
    active: 'bg-blue-500',
    inactive: 'bg-orange-500',
    complete: 'bg-green-500',
  };

  return (
    <Card
      className="mb-3 p-0"
      accessibilityLabel={`Todo: ${todo.title}`}
      testID={testID}
      onTouchStart={() => onPress?.(todo)}>
      <CardContent className="gap-3 p-4">
        {/* Header: Icon and Status */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            {IconComponent && (
              <View
                testID={`todo-icon-${todo.icon}`}
                className="h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <IconComponent size={20} color={iconColor} />
              </View>
            )}
            <View className={`rounded-full px-2 py-1 ${statusColors[todo.status]}`}>
              <Text className="font-medium text-white text-xs">
                {TODO_STATUS_LABELS[todo.status]}
              </Text>
            </View>
          </View>
        </View>

        {/* Title */}
        <Text className="font-semibold text-foreground text-lg">{todo.title}</Text>

        {/* Description */}
        <Text className="text-muted-foreground text-sm" numberOfLines={2}>
          {todo.description}
        </Text>

        {/* Due Date */}
        <View className="flex-row items-center gap-2">
          <Calendar size={14} color={dueDate.isOverdue ? '#ef4444' : iconColor} />
          <Text
            className={`text-xs ${
              dueDate.isOverdue ? 'font-medium text-destructive' : 'text-muted-foreground'
            }`}>
            {dueDate.isOverdue ? 'Overdue: ' : 'Due: '}
            {dueDate.text}
          </Text>
        </View>
      </CardContent>
    </Card>
  );
}

/**
 * Empty State Component
 *
 * Displays a message when there are no todos in a status category.
 */

import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { TODO_STATUS_LABELS, type TodoStatus } from '@/lib/types/todo';

interface EmptyStateProps {
  status: TodoStatus;
}

export function EmptyState({ status }: EmptyStateProps) {
  const messages: Record<TodoStatus, string> = {
    active: 'No active todos. Create one to get started!',
    inactive: 'No inactive todos. Tasks marked as missed will appear here.',
    complete: 'No completed todos yet. Mark tasks as complete to see them here.',
  };

  return (
    <View className="flex-1 items-center justify-center p-8">
      <Text className="text-center text-lg text-muted-foreground">{messages[status]}</Text>
      <Text className="mt-2 text-center text-muted-foreground text-sm">
        Showing: {TODO_STATUS_LABELS[status]}
      </Text>
    </View>
  );
}

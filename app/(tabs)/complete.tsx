/**
 * Complete Todos Screen
 *
 * Displays todos with status="complete"
 */

import { useQuery } from 'convex/react';
import { useRouter } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { TodoList } from '@/components/todo/todo-list';
import { Text } from '@/components/ui/text';
import { api } from '@/convex/_generated/api';

export default function CompleteScreen() {
  const _router = useRouter();
  const todos = useQuery(api.todos.listByStatus, { status: 'complete' });

  // Handle loading state
  if (todos === undefined) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" />
        <Text className="mt-4 text-muted-foreground">Loading todos...</Text>
      </View>
    );
  }

  // Handle todo press (navigate to detail - will implement in User Story 3)
  const handleTodoPress = (todo: any) => {
    // TODO: Navigate to todo detail screen when implemented
    console.log('Todo pressed:', todo);
  };

  return (
    <View className="flex-1 bg-background">
      <TodoList
        todos={todos}
        status="complete"
        onTodoPress={handleTodoPress}
        testID="complete-todo-list"
      />
    </View>
  );
}

/**
 * Active Todos Screen
 *
 * Displays todos with status="active"
 */

import { useQuery } from 'convex/react';
import { useRouter } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { AuthDebug } from '@/components/debug/auth-debug';
import { TodoList } from '@/components/todo/todo-list';
import { Text } from '@/components/ui/text';
import { api } from '@/convex/_generated/api';

export default function ActiveScreen() {
  const _router = useRouter();
  const todos = useQuery(api.todos.listByStatus, { status: 'active' });

  // Handle loading state
  if (todos === undefined) {
    return (
      <View className="flex-1 bg-background">
        {/* <AuthDebug /> */}
        <View className="flex-1 items-center justify-center p-8">
          <ActivityIndicator size="large" />
          <Text className="mt-4 text-muted-foreground">Loading todos...</Text>
        </View>
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
      {/* <AuthDebug /> */}
      <TodoList
        todos={todos}
        status="active"
        onTodoPress={handleTodoPress}
        testID="active-todo-list"
      />
    </View>
  );
}

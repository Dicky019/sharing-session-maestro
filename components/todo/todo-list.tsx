/**
 * Todo List Component
 *
 * Renders an array of TodoCard components.
 * Shows EmptyState when no todos are present.
 */

import { FlatList } from 'react-native';
import type { Todo, TodoStatus } from '@/lib/types/todo';
import { EmptyState } from './empty-state';
import { TodoCard } from './todo-card';

interface TodoListProps {
  todos: Todo[];
  status: TodoStatus;
  onTodoPress?: (todo: Todo) => void;
  testID?: string;
}

export function TodoList({ todos, status, onTodoPress, testID }: TodoListProps) {
  // Show empty state when no todos
  if (todos.length === 0) {
    return <EmptyState status={status} />;
  }

  return (
    <FlatList
      testID={testID}
      data={todos}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <TodoCard todo={item} onPress={onTodoPress} testID={`todo-card-${item._id}`} />
      )}
      contentContainerClassName="p-4"
      showsVerticalScrollIndicator={true}
    />
  );
}

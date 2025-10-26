/**
 * Create Todo Screen
 *
 * Modal screen for creating a new todo item.
 * Uses TodoForm component and Convex mutation.
 */

import { useMutation } from 'convex/react';
import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, View } from 'react-native';
import { TodoForm } from '@/components/todo/todo-form';
import { api } from '@/convex/_generated/api';

export default function NewTodoScreen() {
  const router = useRouter();
  const createTodo = useMutation(api.todos.create);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: {
    title: string;
    description: string;
    icon: string;
    dueDate: string;
  }) => {
    try {
      setIsLoading(true);

      // Create todo via Convex mutation
      await createTodo({
        title: data.title,
        description: data.description,
        icon: data.icon,
        dueDate: data.dueDate,
      });

      // Show success message
      Alert.alert('Success', 'Todo created successfully', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.error('Error creating todo:', error);
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Failed to create todo. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Create Todo',
          presentation: 'modal',
        }}
      />
      <View className="flex-1 bg-background">
        <TodoForm onSubmit={handleSubmit} onCancel={handleCancel} isLoading={isLoading} />
      </View>
    </>
  );
}

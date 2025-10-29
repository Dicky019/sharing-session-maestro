/**
 * Tab Navigation Layout
 *
 * Three tabs for todo status categories:
 * - Active: Current/in-progress tasks
 * - Inactive (Terlewat): Missed/skipped tasks
 * - Complete: Finished tasks
 */

import { Tabs, useRouter } from 'expo-router';
import { CheckCircle, ListTodo, Plus, XCircle } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { Pressable, View } from 'react-native';
import { UserMenu } from '@/components/user-menu';

export default function TabLayout() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const iconColor = colorScheme === 'dark' ? '#ffffff' : '#000000';

  // Header left: Theme toggle and user menu
  const HeaderLeft = () => (
    <View className="ml-4">
      <UserMenu />
    </View>
  );

  // Header right: Create button
  const HeaderRight = () => (
    <Pressable
      onPress={() => router.push('/todo/new')}
      testID="create-todo-button"
      accessibilityLabel="Create new todo"
      accessibilityRole="button"
      className="mr-4 p-2">
      <Plus size={24} color={iconColor} />
    </Pressable>
  );

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: iconColor,
        headerShown: true,
        headerLeft: () => <HeaderLeft />,
        headerRight: () => <HeaderRight />,
      }}>
      <Tabs.Screen
        name="active"
        options={{
          tabBarButtonTestID: 'active',
          title: 'Active',
          tabBarIcon: ({ color }) => <ListTodo color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="inactive"
        options={{
          tabBarButtonTestID: 'inactive',
          title: 'Terlewat',
          tabBarIcon: ({ color }) => <XCircle color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="complete"
        options={{
          tabBarButtonTestID: 'complete',
          title: 'Complete',
          tabBarIcon: ({ color }) => <CheckCircle color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}

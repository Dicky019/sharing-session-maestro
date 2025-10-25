import { useUser } from '@clerk/clerk-expo';
import { Stack } from 'expo-router';
import { XIcon } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { Image, View } from 'react-native';
import { toast } from 'sonner-native';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { UserMenu } from '@/components/user-menu';
import { CLERK_LOGO, LOGO, LOGO_STYLE } from '@/lib/constants';

export const SCREEN_OPTIONS = {
  header: () => (
    <View className="absolute top-safe right-0 left-0 web:mx-2 flex-row justify-between px-4 py-2">
      <ThemeToggle />
      <UserMenu />
    </View>
  ),
};

export default function Screen() {
  const { colorScheme } = useColorScheme();
  const { user } = useUser();

  return (
    <>
      <Stack.Screen options={SCREEN_OPTIONS} />
      <View className="flex-1 items-center justify-center gap-8 p-4">
        <View className="flex-row items-center justify-center gap-3.5">
          <Image
            source={CLERK_LOGO[colorScheme ?? 'light']}
            resizeMode="contain"
            style={LOGO_STYLE}
          />
          <Icon as={XIcon} className="mr-1 size-5" />
          <Image source={LOGO[colorScheme ?? 'light']} style={LOGO_STYLE} resizeMode="contain" />
        </View>
        <View className="max-w-sm gap-2 px-4">
          <Text variant="h1" className="font-medium text-3xl">
            Make it yours{user?.firstName ? `, ${user.firstName}` : ''}.
          </Text>
          <Text className="text-center font-mono ios:text-foreground text-muted-foreground text-sm">
            Update the screens and components to match your design and logic.
          </Text>
        </View>
        <View className="gap-2">
          {/* <Link href="https://go.clerk.com/8e6CCee" asChild> */}
          <Button size="sm" onPress={() => toast.warning('Hello, World!')}>
            <Text>Explore Clerk Docs</Text>
          </Button>
          {/* </Link> */}
        </View>
      </View>
    </>
  );
}

import { useAuth, useUser } from '@clerk/clerk-expo';
import type { TriggerRef } from '@rn-primitives/popover';
import { LogOutIcon } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { useMemo, useRef } from 'react';
import { View } from 'react-native';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Text } from '@/components/ui/text';
import { ThemeIcon } from './theme-toggle';

export function UserMenu() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const { toggleColorScheme } = useColorScheme();
  const popoverTriggerRef = useRef<TriggerRef>(null);

  async function onSignOut() {
    popoverTriggerRef.current?.close();
    await signOut();
  }

  return (
    <Popover>
      <PopoverTrigger asChild ref={popoverTriggerRef}>
        <Button variant="ghost" size="icon" className="size-8 rounded-full">
          <UserAvatar />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" side="bottom" className="p-0">
        <View className="gap-3 border-border border-b p-3">
          <View className="flex-row items-center gap-3">
            <UserAvatar className="size-10" />
            <View className="flex-1">
              <Text className="font-medium leading-5" numberOfLines={1} ellipsizeMode="tail">
                {user?.fullName || user?.emailAddresses[0]?.emailAddress}
              </Text>
              <Text className="font-normal text-muted-foreground text-sm leading-4">
                {user?.username ?? ''}
              </Text>
            </View>
          </View>
          <View className="flex-col gap-3 py-0.5">
            <Button variant="outline" size="sm" className="flex-1" onPress={toggleColorScheme}>
              <ThemeIcon className="size-4" />
              <Text>Change Theme</Text>
            </Button>
            <Button variant="outline" size="sm" className="flex-1" onPress={onSignOut}>
              <Icon as={LogOutIcon} className="size-4" />
              <Text>Sign Out</Text>
            </Button>
          </View>
        </View>
      </PopoverContent>
    </Popover>
  );
}

function UserAvatar(props: Omit<React.ComponentProps<typeof Avatar>, 'alt'>) {
  const { user } = useUser();

  const { initials, imageSource, userName } = useMemo(() => {
    const userName = user?.username ?? '';
    const initials = userName
      .split(' ')
      .map((name) => name[0])
      .join('');

    const imageSource = user?.imageUrl ? { uri: user.imageUrl } : undefined;
    return { initials, imageSource, userName };
  }, [user?.imageUrl, user?.username]);

  return (
    <Avatar alt={`${userName}'s avatar`} {...props}>
      <AvatarImage source={imageSource} />
      <AvatarFallback>
        <Text>{initials}</Text>
      </AvatarFallback>
    </Avatar>
  );
}

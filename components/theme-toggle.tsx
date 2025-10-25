import type { LucideProps } from 'lucide-react-native';
import { MoonStarIcon, SunIcon } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Icon } from './ui/icon';

const THEME_ICONS = {
  light: SunIcon,
  dark: MoonStarIcon,
};

export function ThemeToggle() {
  const { toggleColorScheme } = useColorScheme();

  return (
    <Button onPress={toggleColorScheme} size="icon" variant="ghost" className="rounded-full">
      <ThemeIcon />
    </Button>
  );
}

export function ThemeIcon({ className, ...props }: LucideProps) {
  const { colorScheme } = useColorScheme();

  return (
    <Icon as={THEME_ICONS[colorScheme ?? 'light']} className={cn('size-6', className)} {...props} />
  );
}

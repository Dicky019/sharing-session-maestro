import { type StartSSOFlowParams, useSSO } from '@clerk/clerk-expo';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { useColorScheme } from 'nativewind';
import { useEffect, useState } from 'react';
import { Image, type ImageSourcePropType, Platform, View } from 'react-native';
import { Button } from '@/components/ui/button';
import { handleSignUp } from '@/lib/oauth-utils';
import { cn } from '@/lib/utils';
import { Text } from './ui/text';

WebBrowser.maybeCompleteAuthSession();

type SocialConnectionStrategy = Extract<StartSSOFlowParams['strategy'], 'oauth_google'>;

interface SocialConnectionConfig {
  title: string;
  type: SocialConnectionStrategy;
  source: ImageSourcePropType;
  useTint?: boolean;
}

const SOCIAL_CONNECTION_STRATEGIES: SocialConnectionConfig[] = [
  {
    title: 'Google',
    type: 'oauth_google',
    source: { uri: 'https://img.clerk.com/static/google.png?width=160' },
    useTint: false,
  },
];

/**
 * Social connections component for OAuth authentication (Google, Apple, GitHub)
 */
export function SocialConnections() {
  useWarmUpBrowser();
  const { colorScheme } = useColorScheme();
  const { startSSOFlow } = useSSO();
  const [isLoading, setIsLoading] = useState(false);

  const onSocialLoginPress = (strategy: SocialConnectionStrategy) => {
    return async () => {
      try {
        setIsLoading(true);

        const { createdSessionId, setActive, signUp } = await startSSOFlow({
          strategy,
          redirectUrl: AuthSession.makeRedirectUri(),
        });

        // Session created automatically by Clerk
        if (createdSessionId && setActive) {
          await setActive({ session: createdSessionId });
          return;
        }

        // Handle sign-up flow for new users
        const signUpSuccess = await handleSignUp(signUp, setActive);
        if (signUpSuccess) return;

        if (__DEV__) {
          console.warn('Could not complete OAuth authentication');
        }
      } catch (error: any) {
        if (__DEV__) {
          console.error('OAuth error:', error.message || error);
        }
      } finally {
        setIsLoading(false);
      }
    };
  };

  return (
    <View className="gap-2 sm:flex-row sm:gap-3">
      {SOCIAL_CONNECTION_STRATEGIES.map((strategy) => {
        return (
          <Button
            key={strategy.type}
            variant="outline"
            size="sm"
            className="sm:flex-1"
            disabled={isLoading}
            onPress={onSocialLoginPress(strategy.type)}>
            <Image
              className={cn('size-4', strategy.useTint && Platform.select({ web: 'dark:invert' }))}
              tintColor={Platform.select({
                native: strategy.useTint ? (colorScheme === 'dark' ? 'white' : 'black') : undefined,
              })}
              source={strategy.source}
            />
            <Text>{strategy.title}</Text>
          </Button>
        );
      })}
    </View>
  );
}

/**
 * Warm up browser for native platforms to improve OAuth performance
 * @see https://docs.expo.dev/guides/authentication/#improving-user-experience
 */
const useWarmUpBrowser = Platform.select({
  web: () => {},
  default: () => {
    useEffect(() => {
      void WebBrowser.warmUpAsync();
      return () => void WebBrowser.coolDownAsync();
    }, []);
  },
});

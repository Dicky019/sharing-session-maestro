/**
 * Auth Debug Component
 *
 * Shows authentication status and helps debug Clerk + Convex integration
 */

import { useAuth } from '@clerk/clerk-expo';
import { useQuery } from 'convex/react';
import { View } from 'react-native';
import { Card, CardContent } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { api } from '@/convex/_generated/api';

export function AuthDebug() {
  const { isSignedIn, userId, getToken } = useAuth();
  const convexAuth = useQuery(api.debug.testAuth);

  return (
    <Card className="m-4">
      <CardContent className="gap-3 p-4">
        <Text className="font-bold text-lg">Auth Debug Info</Text>

        <View className="gap-1">
          <Text className="font-medium">Clerk Status:</Text>
          <Text className="text-sm">Signed In: {isSignedIn ? '✅ Yes' : '❌ No'}</Text>
          <Text className="text-sm">User ID: {userId || 'None'}</Text>
        </View>

        <View className="gap-1">
          <Text className="font-medium">Convex Status:</Text>
          <Text className="text-sm">
            Authenticated: {convexAuth?.isAuthenticated ? '✅ Yes' : '❌ No'}
          </Text>
          {convexAuth?.identity && (
            <>
              <Text className="text-muted-foreground text-sm">
                Subject: {convexAuth.identity.subject}
              </Text>
              <Text className="text-muted-foreground text-sm">
                Token ID: {convexAuth.identity.tokenIdentifier.slice(0, 20)}...
              </Text>
            </>
          )}
        </View>

        {isSignedIn && !convexAuth?.isAuthenticated && (
          <View className="rounded-lg bg-destructive/10 p-3">
            <Text className="font-medium text-destructive">⚠️ Auth Mismatch</Text>
            <Text className="mt-1 text-destructive text-sm">
              You're signed in to Clerk but not authenticated with Convex.
              {'\n\n'}
              Fix: Sign out and sign back in to generate a new JWT token.
            </Text>
          </View>
        )}
      </CardContent>
    </Card>
  );
}

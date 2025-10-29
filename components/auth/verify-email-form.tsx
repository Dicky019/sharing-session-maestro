import { useSignUp } from '@clerk/clerk-expo';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { type TextStyle, View } from 'react-native';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';

const RESEND_CODE_INTERVAL_SECONDS = 30;

const TABULAR_NUMBERS_STYLE: TextStyle = { fontVariant: ['tabular-nums'] };

const verifyEmailSchema = z.object({
  code: z.string().min(1, 'Verification code is required').length(6, 'Code must be 6 digits'),
});

type VerifyEmailFormData = z.infer<typeof verifyEmailSchema>;

export function VerifyEmailForm() {
  const { signUp, setActive, isLoaded } = useSignUp();
  const { email = '' } = useLocalSearchParams<{ email?: string }>();
  const { countdown, restartCountdown } = useCountdown(RESEND_CODE_INTERVAL_SECONDS);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<VerifyEmailFormData>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      code: '',
    },
  });

  useEffect(() => {
    console.log('[VerifyEmail] Component mounted');
    console.log('[VerifyEmail] Email from params:', email);
    console.log('[VerifyEmail] Is test email?', email.includes('+clerk_test'));
    console.log('[VerifyEmail] SignUp loaded?', isLoaded);

    if (isLoaded && signUp) {
      console.log('[VerifyEmail] SignUp status:', signUp.status);
      console.log('[VerifyEmail] SignUp ID:', signUp.id);
      console.log(
        '[VerifyEmail] Email verification status:',
        signUp.verifications?.emailAddress?.status
      );
      console.log('[VerifyEmail] Unverified fields:', signUp.unverifiedFields);
      console.log('[VerifyEmail] Missing fields:', signUp.missingFields);

      // If email is already verified, check what's needed
      if (signUp.verifications?.emailAddress?.status === 'verified') {
        if (signUp.status === 'complete') {
          console.log('[VerifyEmail] ✅ Sign-up complete, activating session...');
          setActive({ session: signUp.createdSessionId }).catch((err) => {
            console.error('[VerifyEmail] Error activating session:', err);
          });
        } else if (signUp.status === 'missing_requirements') {
          console.log('[VerifyEmail] ⚠️ Email already verified but sign-up incomplete');
          console.log('[VerifyEmail] Missing fields:', signUp.missingFields);

          // If only username is missing, show a helpful message
          if (signUp.missingFields?.includes('username') && signUp.missingFields.length === 1) {
            setError('code', {
              type: 'manual',
              message:
                'Email verified! However, a username is required. Please go back and sign up again with a username.',
            });
          }
        }
      }
    }
  }, [isLoaded, signUp, email, setActive, setError]);

  async function onSubmit(data: VerifyEmailFormData) {
    if (!isLoaded) {
      console.log('[VerifyEmail] SignUp not loaded yet');
      return;
    }

    console.log('[VerifyEmail] Starting verification attempt');
    console.log('[VerifyEmail] Code entered:', data.code);
    console.log('[VerifyEmail] Code length:', data.code.length);

    if (email.includes('+clerk_test')) {
      console.log('[VerifyEmail] ⚠️ TEST EMAIL - Expected code: 424242');
      console.log('[VerifyEmail] Code matches?', data.code === '424242');
    }

    try {
      // Use the code the user provided to attempt verification
      console.log('[VerifyEmail] Attempting email verification...');
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code: data.code,
      });

      console.log('[VerifyEmail] Verification attempt completed');
      console.log('[VerifyEmail] Status:', signUpAttempt.status);
      console.log('[VerifyEmail] Created session ID:', signUpAttempt.createdSessionId || 'N/A');

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === 'complete') {
        console.log('[VerifyEmail] ✅ Verification complete!');
        console.log('[VerifyEmail] Created session ID:', signUpAttempt.createdSessionId);
        console.log('[VerifyEmail] Setting active session...');
        await setActive({ session: signUpAttempt.createdSessionId });
        console.log('[VerifyEmail] Session activated, redirecting...');
        return;
      }
      // TODO: Handle other statuses
      // If the status is not complete, check why. User may need to
      // complete further steps.
      console.warn('[VerifyEmail] ⚠️ Verification not complete');
      console.warn('[VerifyEmail] Current status:', signUpAttempt.status);
      console.warn('[VerifyEmail] Unverified fields:', signUpAttempt.unverifiedFields);
      console.warn('[VerifyEmail] Missing fields:', signUpAttempt.missingFields);
    } catch (err) {
      console.error('[VerifyEmail] ❌ Error during verification:');
      // See https://go.clerk.com/mRUDrIe for more info on error handling
      if (err instanceof Error) {
        console.error('[VerifyEmail] Error message:', err.message);
        console.error('[VerifyEmail] Error stack:', err.stack);

        // Handle already verified case
        if (err.message.includes('already been verified')) {
          console.log(
            '[VerifyEmail] Email already verified. Checking if sign-up can be completed...'
          );

          // Try to complete the sign-up or show what's missing
          if (signUp.status === 'complete') {
            console.log('[VerifyEmail] Sign-up is complete, activating session...');
            await setActive({ session: signUp.createdSessionId });
            return;
          }

          console.log('[VerifyEmail] Sign-up status:', signUp.status);
          console.log('[VerifyEmail] Unverified fields:', signUp.unverifiedFields);
          console.log('[VerifyEmail] Missing fields:', signUp.missingFields);
          setError('code', {
            type: 'manual',
            message:
              'Email already verified. If you are still seeing this screen, please try signing in instead.',
          });
          return;
        }

        setError('code', { type: 'manual', message: err.message });
        return;
      }
      console.error('[VerifyEmail] Error details:', err);
    }
  }

  async function onResendCode() {
    if (!isLoaded) {
      console.log('[VerifyEmail] SignUp not loaded, cannot resend');
      return;
    }

    console.log('[VerifyEmail] Resending verification code...');
    console.log('[VerifyEmail] Email:', email);

    try {
      await signUp.prepareEmailAddressVerification({
        strategy: 'email_code',
      });
      console.log('[VerifyEmail] ✅ Code resent successfully');

      if (email.includes('+clerk_test')) {
        console.log('[VerifyEmail] ⚠️ TEST EMAIL - Use code: 424242');
      }

      restartCountdown();
    } catch (err) {
      console.error('[VerifyEmail] ❌ Error resending code:');
      // See https://go.clerk.com/mRUDrIe for more info on error handling
      if (err instanceof Error) {
        console.error('[VerifyEmail] Error message:', err.message);
        setError('code', { type: 'manual', message: err.message });
        return;
      }
      console.error('[VerifyEmail] Error details:', err);
    }
  }

  return (
    <View className="gap-6">
      <Card className="border-border/0 shadow-none sm:border-border sm:shadow-black/5 sm:shadow-sm">
        <CardHeader>
          <CardTitle className="text-center text-xl sm:text-left">Verify your email</CardTitle>
          <CardDescription className="text-center sm:text-left">
            Enter the verification code sent to {email || 'your email'}
          </CardDescription>
        </CardHeader>
        <CardContent className="gap-6">
          <View className="gap-6">
            <View className="gap-1.5">
              <Label htmlFor="code">Verification code</Label>
              <Controller
                control={control}
                name="code"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    id="code"
                    testID="code"
                    autoCapitalize="none"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    keyboardType="numeric"
                    autoComplete="sms-otp"
                    textContentType="oneTimeCode"
                    onSubmitEditing={handleSubmit(onSubmit)}
                  />
                )}
              />
              {errors.code ? (
                <Text className="font-medium text-destructive text-sm">{errors.code.message}</Text>
              ) : null}
              {email.includes('+clerk_test') ? (
                <View className="rounded-md border border-primary/20 bg-primary/5 p-3">
                  <Text className="text-center text-primary text-xs">
                    Test email detected. Use code: <Text className="font-bold">424242</Text>
                  </Text>
                </View>
              ) : null}
              <Button variant="link" size="sm" disabled={countdown > 0} onPress={onResendCode}>
                <Text className="text-center text-xs">
                  Didn&apos;t receive the code? Resend{' '}
                  {countdown > 0 ? (
                    <Text className="text-xs" style={TABULAR_NUMBERS_STYLE}>
                      ({countdown})
                    </Text>
                  ) : null}
                </Text>
              </Button>
            </View>
            <Button
              testID="verify-email-submit"
              className="w-full"
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}>
              <Text>Submit</Text>
            </Button>
          </View>
        </CardContent>
      </Card>
    </View>
  );
}

function useCountdown(seconds = 30) {
  const [countdown, setCountdown] = useState(seconds);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startCountdown = useCallback(() => {
    setCountdown(seconds);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [seconds]);

  useEffect(() => {
    startCountdown();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [startCountdown]);

  return { countdown, restartCountdown: startCountdown };
}

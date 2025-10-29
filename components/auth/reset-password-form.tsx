import { useSignIn } from '@clerk/clerk-expo';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { type TextInput, View } from 'react-native';
import { toast } from 'sonner-native';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';

const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must be less than 100 characters'),
  code: z.string().min(1, 'Verification code is required'),
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordForm() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const codeInputRef = useRef<TextInput>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      code: '',
    },
  });

  async function onSubmit(data: ResetPasswordFormData) {
    if (!isLoaded) {
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await signIn?.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code: data.code,
        password: data.password,
      });

      if (result?.status === 'complete') {
        // Set the active session to
        // the newly created session (user is now signed in)
        await setActive({ session: result.createdSessionId });
        toast.success('Password reset successfully');
        return;
      }
      // TODO: Handle other statuses
    } catch (err) {
      // See https://go.clerk.com/mRUDrIe for more info on error handling
      if (err instanceof Error) {
        const isPasswordMessage = err.message.toLowerCase().includes('password');
        if (isPasswordMessage) {
          setError('password', { message: err.message });
        } else {
          setError('code', { message: err.message });
        }
        toast.error(err.message);
        return;
      }
      console.error(JSON.stringify(err, null, 2));
      toast.error('Failed to reset password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  function onPasswordSubmitEditing() {
    codeInputRef.current?.focus();
  }

  return (
    <View className="gap-6">
      <Card className="border-border/0 shadow-none sm:border-border sm:shadow-black/5 sm:shadow-sm">
        <CardHeader>
          <CardTitle className="text-center text-xl sm:text-left">Reset password</CardTitle>
          <CardDescription className="text-center sm:text-left">
            Enter the code sent to your email and set a new password
          </CardDescription>
        </CardHeader>
        <CardContent className="gap-6">
          <View className="gap-6">
            <View className="gap-1.5">
              <View className="flex-row items-center">
                <Label htmlFor="password">New password</Label>
              </View>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    testID="reset-password-new"
                    id="password"
                    secureTextEntry
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    returnKeyType="next"
                    submitBehavior="submit"
                    onSubmitEditing={onPasswordSubmitEditing}
                    editable={!isSubmitting}
                  />
                )}
              />
              {errors.password && (
                <Text className="font-medium text-destructive text-sm">
                  {errors.password.message}
                </Text>
              )}
            </View>
            <View className="gap-1.5">
              <Label htmlFor="code">Verification code</Label>
              <Controller
                control={control}
                name="code"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    ref={codeInputRef}
                    id="code"
                    testID="reset-password-code"
                    autoCapitalize="none"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    keyboardType="numeric"
                    autoComplete="sms-otp"
                    textContentType="oneTimeCode"
                    onSubmitEditing={handleSubmit(onSubmit)}
                    editable={!isSubmitting}
                  />
                )}
              />
              {errors.code && (
                <Text className="font-medium text-destructive text-sm">{errors.code.message}</Text>
              )}
            </View>
            <Button
              testID="reset-password-submit"
              className="w-full"
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}>
              <Text>{isSubmitting ? 'Resetting...' : 'Reset Password'}</Text>
            </Button>
          </View>
        </CardContent>
      </Card>
    </View>
  );
}

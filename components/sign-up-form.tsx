import { useSignUp } from '@clerk/clerk-expo';
import { Link, router } from 'expo-router';
import { useRef, useState } from 'react';
import { type TextInput, View } from 'react-native';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';

export function SignUpForm() {
  const { signUp, setActive, isLoaded } = useSignUp();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const firstNameInputRef = useRef<TextInput>(null);
  const lastNameInputRef = useRef<TextInput>(null);
  const usernameInputRef = useRef<TextInput>(null);
  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const [error, setError] = useState<{
    firstName?: string;
    lastName?: string;
    username?: string;
    email?: string;
    password?: string;
  }>({});

  async function onSubmit() {
    if (!isLoaded) {
      console.log('[SignUp] Sign up not loaded yet');
      return;
    }

    const isTestEmail = email.includes('+clerk_test');

    console.log('[SignUp] Starting sign-up process');
    console.log('[SignUp] Username:', username);
    console.log('[SignUp] Email:', email);
    console.log('[SignUp] Is test email?', isTestEmail);

    // Start sign-up process using email and password provided
    try {
      console.log('[SignUp] Creating sign-up...');

      const signUpResponse = await signUp.create({
        firstName,
        lastName,
        username,
        emailAddress: email,
        password,
      });
      console.log('[SignUp] Sign-up created successfully');
      console.log('[SignUp] Sign-up status:', signUpResponse.status);
      console.log('[SignUp] Sign-up ID:', signUpResponse.id);
      console.log(
        '[SignUp] Email verification status:',
        signUpResponse.verifications?.emailAddress?.status
      );

      // Check if email is already verified (shouldn't happen in normal flow, but just in case)
      if (signUpResponse.verifications?.emailAddress?.status === 'verified') {
        console.log('[SignUp] ✅ Email already verified!');

        // Check if sign-up is complete
        if (signUpResponse.status === 'complete') {
          console.log('[SignUp] Sign-up complete, activating session...');
          await setActive({ session: signUpResponse.createdSessionId });
          console.log('[SignUp] Session activated, redirecting to home...');
          router.replace('/');
          return;
        }

        console.log('[SignUp] Email verified but sign-up not complete');
        console.log('[SignUp] Status:', signUpResponse.status);
        console.log('[SignUp] Unverified fields:', signUpResponse.unverifiedFields);
      }

      // Send user an email with verification code
      console.log('[SignUp] Preparing email verification...');
      await signUp.prepareEmailAddressVerification({
        strategy: 'email_code',
      });
      console.log('[SignUp] Email verification prepared successfully');

      if (isTestEmail) {
        console.log('[SignUp] ⚠️ TEST EMAIL DETECTED - Use code: 424242');
      }

      console.log('[SignUp] Navigating to verify-email screen...');
      router.push(`/(auth)/sign-up/verify-email?email=${encodeURIComponent(email)}`);
    } catch (err) {
      console.error('[SignUp] ❌ Error during sign-up:');
      // See https://go.clerk.com/mRUDrIe for more info on error handling
      if (err instanceof Error) {
        console.error('[SignUp] Error message:', err.message);
        console.error('[SignUp] Error stack:', err.stack);

        // Determine which field has the error
        const errorMsg = err.message.toLowerCase();
        if (errorMsg.includes('first name') || errorMsg.includes('firstname')) {
          setError({ firstName: err.message });
        } else if (errorMsg.includes('last name') || errorMsg.includes('lastname')) {
          setError({ lastName: err.message });
        } else if (errorMsg.includes('username')) {
          setError({ username: err.message });
        } else if (errorMsg.includes('identifier') || errorMsg.includes('email')) {
          setError({ email: err.message });
        } else if (errorMsg.includes('password')) {
          setError({ password: err.message });
        } else {
          setError({ email: err.message });
        }
        return;
      }
      console.error('[SignUp] Error details:', err);
    }
  }

  function onFirstNameSubmitEditing() {
    lastNameInputRef.current?.focus();
  }

  function onLastNameSubmitEditing() {
    usernameInputRef.current?.focus();
  }

  function onUsernameSubmitEditing() {
    emailInputRef.current?.focus();
  }

  function onEmailSubmitEditing() {
    passwordInputRef.current?.focus();
  }

  return (
    <View className="gap-6">
      <Card className="border-border/0 shadow-none sm:border-border sm:shadow-black/5 sm:shadow-sm">
        <CardHeader>
          <CardTitle className="text-center text-xl sm:text-left">Create your account</CardTitle>
          <CardDescription className="text-center sm:text-left">
            Welcome! Please fill in the details to get started.
          </CardDescription>
        </CardHeader>
        <CardContent className="gap-6">
          <View className="gap-6">
            <View className="flex-row gap-2">
              <View className="flex-1 gap-1.5">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  ref={firstNameInputRef}
                  id="firstName"
                  testID="first-name"
                  placeholder="John"
                  autoComplete="given-name"
                  autoCapitalize="words"
                  onChangeText={setFirstName}
                  onSubmitEditing={onFirstNameSubmitEditing}
                  returnKeyType="next"
                  submitBehavior="submit"
                />
                {error.firstName ? (
                  <Text className="font-medium text-destructive text-sm">{error.firstName}</Text>
                ) : null}
              </View>
              <View className="flex-1 gap-1.5">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  ref={lastNameInputRef}
                  id="lastName"
                  testID="last-name"
                  placeholder="Doe"
                  autoComplete="family-name"
                  autoCapitalize="words"
                  onChangeText={setLastName}
                  onSubmitEditing={onLastNameSubmitEditing}
                  returnKeyType="next"
                  submitBehavior="submit"
                />
                {error.lastName ? (
                  <Text className="font-medium text-destructive text-sm">{error.lastName}</Text>
                ) : null}
              </View>
            </View>
            <View className="gap-1.5">
              <Label htmlFor="username">Username</Label>
              <Input
                ref={usernameInputRef}
                id="username"
                testID="username"
                placeholder="johndoe"
                autoComplete="username"
                autoCapitalize="none"
                onChangeText={setUsername}
                onSubmitEditing={onUsernameSubmitEditing}
                returnKeyType="next"
                submitBehavior="submit"
              />
              {error.username ? (
                <Text className="font-medium text-destructive text-sm">{error.username}</Text>
              ) : null}
            </View>
            <View className="gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                ref={emailInputRef}
                id="email"
                testID="sign-up-email"
                placeholder="m@example.com"
                keyboardType="email-address"
                autoComplete="email"
                autoCapitalize="none"
                onChangeText={setEmail}
                onSubmitEditing={onEmailSubmitEditing}
                returnKeyType="next"
                submitBehavior="submit"
              />
              {error.email ? (
                <Text className="font-medium text-destructive text-sm">{error.email}</Text>
              ) : null}
            </View>
            <View className="gap-1.5">
              <View className="flex-row items-center">
                <Label htmlFor="password">Password</Label>
              </View>
              <Input
                ref={passwordInputRef}
                id="password"
                testID="sign-up-password"
                secureTextEntry
                onChangeText={setPassword}
                returnKeyType="send"
                onSubmitEditing={onSubmit}
              />
              {error.password ? (
                <Text className="font-medium text-destructive text-sm">{error.password}</Text>
              ) : null}
            </View>
            <Button className="w-full" onPress={onSubmit}>
              <Text>Continue</Text>
            </Button>
          </View>
          <Text className="text-center text-sm">
            Already have an account?{' '}
            <Link href="/(auth)/sign-in" dismissTo className="text-sm underline underline-offset-4">
              Sign in
            </Link>
          </Text>
        </CardContent>
      </Card>
    </View>
  );
}

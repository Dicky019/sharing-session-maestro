/**
 * OAuth utility functions for handling social authentication flows
 */

/**
 * Generate a unique username from email or first name
 * @param emailAddress - User's email address
 * @param firstName - User's first name
 * @returns Generated username with random suffix
 */
export const generateUsername = (emailAddress?: string, firstName?: string): string => {
  let username = '';

  if (emailAddress) {
    username = emailAddress.split('@')[0];
  } else if (firstName) {
    username = firstName.toLowerCase().replace(/\s+/g, '');
  } else {
    username = 'user';
  }

  const randomSuffix = Math.floor(Math.random() * 10000);
  return `${username}${randomSuffix}`;
};

/**
 * Handle OAuth sign-up flow with automatic username generation
 * @param signUp - Clerk sign-up object
 * @param setActive - Function to set active session
 * @returns Promise<boolean> - True if sign-up successful
 */
export const handleSignUp = async (signUp: any, setActive: any): Promise<boolean> => {
  if (!signUp) return false;

  try {
    let result = signUp;

    // Generate and update username if required
    if (signUp.missingFields?.includes('username')) {
      const username = generateUsername(signUp.emailAddress, signUp.firstName);
      result = await signUp.update({ username });
    }

    // Activate session if signup is complete
    if (result.status === 'complete' && result.createdSessionId && setActive) {
      await setActive({ session: result.createdSessionId });
      return true;
    }

    // Finalize account creation if needed
    if (result.status !== 'complete') {
      result = await signUp.create({});

      if (result.createdSessionId && setActive) {
        await setActive({ session: result.createdSessionId });
        return true;
      }
    }

    return false;
  } catch (error: any) {
    if (__DEV__) {
      console.error('Sign-up error:', error.message);
    }
    return false;
  }
};

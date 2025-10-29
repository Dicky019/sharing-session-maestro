/**
 * Test Credentials Generator for Maestro Auth Flows
 *
 * Generates test credentials using Clerk's test email format (+clerk_test)
 * which bypasses actual email delivery and uses verification code 424242.
 *
 * Usage in Maestro YAML:
 * - runScript: credentials.js
 * - inputText: ${output.TEST_EMAIL}
 * - inputText: ${output.TEST_PASSWORD}
 */

// Output for Maestro (use testUser for stable credentials, uniqueTestUser for parallel runs)
output.TEST_EMAIL = 'johndoe+clerk_test@example.com';
output.TEST_NEW_PASSWORD = 'JohndoeNewPassword123!';
output.VERIFICATION_CODE = '424242';

// Log for debugging (visible in Maestro console)
console.log('Test Forgot Password generated:');
console.log('Email:', output.TEST_EMAIL);
console.log('New Password:', output.TEST_NEW_PASSWORD);
console.log('Verification Code:', output.VERIFICATION_CODE);

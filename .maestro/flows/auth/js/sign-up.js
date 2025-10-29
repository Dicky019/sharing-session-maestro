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
output.TEST_PASSWORD = 'JohndoePassword123!';
output.TEST_FIRST_NAME = 'Doe';
output.TEST_LAST_NAME = 'John';
output.TEST_USERNAME = 'johndoe';
output.VERIFICATION_CODE = '424242';

// Log for debugging (visible in Maestro console)
console.log('Test SignUp generated:');
console.log('Email:', output.TEST_EMAIL);
console.log('Username:', output.TEST_USERNAME);
console.log('Verification Code:', output.VERIFICATION_CODE);
console.log('Note: Using Clerk test email format - no actual email will be sent');

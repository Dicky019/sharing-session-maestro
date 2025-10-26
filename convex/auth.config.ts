/**
 * Convex Authentication Configuration
 *
 * Integrates with Clerk for user authentication via JWT.
 *
 * SETUP REQUIRED:
 * 1. Go to Clerk Dashboard → Configure → JWT Templates
 * 2. Create new template → Select "Convex"
 * 3. Name MUST be "convex"
 * 4. Copy the Issuer URL (e.g., https://verb-noun-00.clerk.accounts.dev)
 * 5. Replace CLERK_JWT_ISSUER_DOMAIN environment variable below
 */

export default {
  providers: [
    {
      // TODO: Set CLERK_JWT_ISSUER_DOMAIN in your Convex deployment environment
      // This should be the Issuer URL from your Clerk JWT template
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN!,
      applicationID: 'convex',
    },
  ],
};

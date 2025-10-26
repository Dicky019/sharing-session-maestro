/**
 * Debug query to test authentication
 */
import { query } from './_generated/server';

export const testAuth = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    return {
      isAuthenticated: !!identity,
      identity: identity
        ? {
            subject: identity.subject,
            tokenIdentifier: identity.tokenIdentifier,
          }
        : null,
    };
  },
});

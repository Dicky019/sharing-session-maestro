# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React Native project built with Expo, featuring Clerk authentication and React Native Reusables UI components. The app runs on iOS, Android, and Web platforms with React Native's New Architecture enabled.

**Key Technologies:**
- **Expo Router** (file-based routing)
- **Clerk** (authentication with OAuth support for Apple, GitHub, Google)
- **NativeWind** (Tailwind CSS for React Native)
- **React Native Reusables** (UI component library)
- **TypeScript** with strict mode enabled

## Development Commands

```bash
# Start development server with MCP server enabled
pnpm dev

# Platform-specific launches (after dev server is running)
# Press 'i' for iOS simulator (Mac only)
# Press 'a' for Android emulator
# Press 'w' for web browser

# Alternative start commands
pnpm android  # Start with Android
pnpm ios      # Start with iOS
pnpm web      # Start with web

# Clean build artifacts and dependencies
pnpm clean
```

## Environment Setup

Before running the app:
1. Set up a Clerk account at https://go.clerk.com/blVsQlm
2. Configure authentication with "Email, phone, username" option
3. Enable Apple, GitHub, and Google as SSO connections
4. Copy `.env.example` to `.env.local`
5. Add your `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` from Clerk dashboard

## Testing Authentication (Development Mode)

Clerk provides special test credentials for development that bypass actual email/SMS delivery:

### Test Email Addresses
Use any email with the `+clerk_test` subaddress format:
- Example: `john+clerk_test@example.com`
- **Verification Code**: Always use `424242`
- No actual email is sent; the code works instantly

### Test Phone Numbers
Use fictional numbers following the North American format:
- Pattern: `+1 (XXX) 555-0100` to `+1 (XXX) 555-0199`
- Example: `+1 (201) 555-0123`
- **Verification Code**: Always use `424242`
- No actual SMS is sent

### Debugging Sign-Up Flow
The sign-up components include comprehensive logging with `[SignUp]` and `[VerifyEmail]` prefixes:
- Check console for step-by-step progress
- Test email detection automatically logs expected code `424242`
- Full error details are logged for troubleshooting

**Quick Test:**
1. Sign up with `test+clerk_test@example.com`
2. Use any password (min 8 characters)
3. Enter verification code: `424242`
4. Check console logs for detailed flow information

## Project Architecture

### File-Based Routing (Expo Router)

The routing structure uses Expo Router's file-based system:

- **`app/_layout.tsx`**: Root layout with ClerkProvider, ThemeProvider, and protected route logic
  - Uses `Stack.Protected` with guards to control access based on `isSignedIn` state
  - Screens under `guard={!isSignedIn}` are auth-only (sign-in, sign-up, etc.)
  - Screens under `guard={isSignedIn}` require authentication (main app screens)

- **`app/index.tsx`**: Main authenticated home screen

- **`app/(auth)/*`**: Authentication flow screens
  - `sign-in.tsx`: Sign in with email/password or OAuth
  - `sign-up/index.tsx`: Sign up form
  - `sign-up/verify-email.tsx`: Email verification step
  - `forgot-password.tsx`: Password reset request
  - `reset-password.tsx`: Password reset form

### Component Structure

**UI Components** (`components/ui/`):
- Primitive components based on React Native Reusables
- Styled with NativeWind (Tailwind classes)
- Include: Button, Input, Card, Avatar, Label, Icon, Text, Separator, Popover

**Feature Components** (`components/`):
- `sign-in-form.tsx`, `sign-up-form.tsx`: Auth forms
- `forgot-password-form.tsx`, `reset-password-form.tsx`: Password recovery
- `verify-email-form.tsx`: Email verification UI
- `social-connections.tsx`: OAuth buttons for Apple/GitHub/Google
- `user-menu.tsx`: User profile dropdown
- `theme-toggle.tsx`: Light/dark mode switcher

### Path Aliases

The project uses TypeScript path aliases (configured in `tsconfig.json`):
```typescript
"@/*" -> Project root
```

Examples:
- `@/components/ui/button` → `components/ui/button.tsx`
- `@/lib/utils` → `lib/utils.ts`
- `@/assets/images/logo.png` → `assets/images/logo.png`

### Theming System

**Theme Definition** (`lib/theme.ts`):
- `THEME` object contains HSL color definitions for light/dark modes
- `NAV_THEME` adapts theme for React Navigation
- Colors follow a design token system (background, foreground, primary, secondary, muted, accent, destructive, border, input, ring)

**Theme Usage**:
- NativeWind's `useColorScheme()` hook for getting current theme
- `className` prop with Tailwind classes (e.g., `className="bg-background text-foreground"`)
- Theme colors are CSS variables that automatically switch with color scheme

### Shared Constants

**`lib/constants.tsx`**: Centralized constants for reusability
- Image assets (logos for light/dark modes)
- Common styles (e.g., `LOGO_STYLE`)
- Screen options for consistent header configurations

### Clerk Authentication Flow

1. **Initial Load**: `_layout.tsx` checks `isSignedIn` from `useAuth()`
2. **Protected Routes**: `Stack.Protected` components guard routes
3. **Token Caching**: Uses `tokenCache` from `@clerk/clerk-expo/token-cache`
4. **Session Management**: Clerk handles token refresh automatically
5. **Sign Out**: Available through `UserMenu` component

### Styling Approach

- **NativeWind 4.x**: Use Tailwind utility classes in `className` prop
- **Global Styles**: Defined in `global.css` with CSS variables for theme tokens
- **Responsive**: Use NativeWind's responsive prefixes (e.g., `web:mx-2`)
- **Platform-specific**: Use `ios:` and `android:` prefixes when needed
- **Dark Mode**: Automatically handled via CSS variables, no need for conditional styles

## Code Style Guidelines

- **TypeScript**: Strict mode enabled, always type props and component return types
- **Formatting**: Prettier configured with Tailwind plugin for class sorting
- **Component Exports**: Use default exports for screens, named exports for reusable components
- **Imports**: Group by external dependencies, then internal with path aliases
- **File Naming**:
  - kebab-case for component files (e.g., `user-menu.tsx`)
  - PascalCase for component names (e.g., `UserMenu`)

## Common Patterns

**Creating a New Screen:**
1. Add file to `app/` directory (or subdirectory for grouping)
2. Export default function component
3. Add `<Stack.Screen />` to `_layout.tsx` if custom options needed
4. Protected screens go inside appropriate `Stack.Protected` block

**Adding a New UI Component:**
1. Create in `components/ui/` following React Native Reusables patterns
2. Use NativeWind for styling with Tailwind classes
3. Support dark mode via theme CSS variables
4. Export component with named export

**Working with Forms:**
- Form components typically manage their own state
- Use Clerk's hooks (`useSignIn`, `useSignUp`, etc.) for auth operations
- Handle errors with Clerk's error types
- Display loading states during async operations

## Important Notes

- The project uses Expo's New Architecture and Edge-to-Edge mode
- MCP Server is enabled via `EXPO_UNSTABLE_MCP_SERVER=1` environment variable
- Package manager is pnpm (see `.npmrc`)
- React Native Reanimated and Worklets are included for animations
- Safe area handling via `react-native-safe-area-context`

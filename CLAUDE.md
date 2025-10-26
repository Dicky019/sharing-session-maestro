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
- **Biome** (linting and formatting)

## Development Commands

```bash
# Start development server (copies .env.development to .env)
pnpm dev

# Platform-specific launches (after dev server is running)
# Press 'i' for iOS simulator (Mac only)
# Press 'a' for Android emulator
# Press 'w' for web browser

# Alternative platform-specific commands
pnpm android  # Development build for Android
pnpm ios      # Development build for iOS
pnpm web      # Development build for web

# Production builds
pnpm android:prod  # Android release build
pnpm ios:prod      # iOS release build
pnpm web:prod      # Web production build

# App store builds (requires EAS CLI)
pnpm build:android  # Build for Google Play Store
pnpm build:ios      # Build for Apple App Store

# Code quality
pnpm lint           # Run Biome linter
pnpm lint:fix       # Fix auto-fixable lint issues
pnpm format         # Format code with Biome
pnpm format:fix     # Format and apply unsafe fixes

# Cleanup
pnpm clean  # Remove .expo and node_modules
```

## Environment Setup

Before running the app:

1. **Set up Clerk account** at https://go.clerk.com/blVsQlm
2. Configure authentication with **"Email, phone, username"** option
3. Enable **Apple, GitHub, and Google** as SSO connections
4. Get your Clerk publishable keys from https://go.clerk.com/u8KAui7

**Environment Files:**
- `.env.development` - Development Clerk key (`pk_test_...`)
- `.env.production` - Production Clerk key (`pk_live_...`)
- `.env.example` - Template showing required variables

The `pnpm dev` command automatically copies `.env.development` to `.env` before starting the server.

**Important:** Never commit `.env` files. They are gitignored.

## Testing Authentication (Development Mode)

Clerk provides special test credentials that bypass actual email/SMS delivery:

### Test Email Addresses
- Format: `[name]+clerk_test@example.com`
- Example: `john+clerk_test@example.com`
- **Verification Code**: Always `424242`
- No actual email is sent

### Test Phone Numbers
- Pattern: `+1 (XXX) 555-0100` to `+1 (XXX) 555-0199`
- Example: `+1 (201) 555-0123`
- **Verification Code**: Always `424242`
- No actual SMS is sent

### Quick Test Flow
1. Sign up with `test+clerk_test@example.com`
2. Use any password (minimum 8 characters)
3. Enter verification code: `424242`
4. Check console logs (prefixed with `[SignUp]` or `[VerifyEmail]`) for detailed flow information

## Project Architecture

### File-Based Routing (Expo Router)

The routing structure uses Expo Router's file-based system with authentication guards:

**`app/_layout.tsx`** - Root layout with providers and protected route logic:
- Wraps app in `ClerkProvider`, `ThemeProvider`, `GestureHandlerRootView`
- Uses `Stack.Protected` with guards based on `isSignedIn` state
- Screens under `guard={!isSignedIn}` are auth-only (sign-in, sign-up)
- Screens under `guard={isSignedIn}` require authentication
- Suppresses iOS Simulator warnings in development mode

**Route Structure:**
```
app/
├── _layout.tsx              # Root layout with auth guards
├── index.tsx                # Main authenticated home screen
├── (auth)/                  # Auth flow screens (unprotected)
│   ├── sign-in.tsx
│   ├── sign-up/
│   │   ├── _layout.tsx
│   │   ├── index.tsx
│   │   └── verify-email.tsx
│   ├── forgot-password.tsx
│   └── reset-password.tsx
├── +html.tsx                # Web-specific HTML wrapper
└── +not-found.tsx           # 404 page
```

### Component Architecture

**UI Components** (`components/ui/`):
- Primitive components based on **React Native Reusables**
- Styled exclusively with **NativeWind** (Tailwind classes)
- Examples: Button, Input, Card, Avatar, Label, Icon, Text, Separator, Popover
- All support dark mode via theme CSS variables

**Feature Components** (`components/`):
- `sign-in-form.tsx`, `sign-up-form.tsx` - Auth forms
- `forgot-password-form.tsx`, `reset-password-form.tsx` - Password recovery
- `verify-email-form.tsx` - Email verification UI
- `social-connections.tsx` - OAuth buttons for Apple/GitHub/Google
- `user-menu.tsx` - User profile dropdown with sign-out
- `theme-toggle.tsx` - Light/dark mode switcher

### Path Aliases

Configured in `tsconfig.json`:
```typescript
"@/*" -> Project root
```

**Always use path aliases for imports:**
```typescript
// Correct
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LOGO } from '@/lib/constants';

// Avoid
import { Button } from '../../components/ui/button';
```

### Theming System

**Theme Definition** (`lib/theme.ts`):
- `THEME` - HSL color definitions for light/dark modes
- `NAV_THEME` - Adapted theme for React Navigation
- Design tokens: `background`, `foreground`, `primary`, `secondary`, `muted`, `accent`, `destructive`, `border`, `input`, `ring`

**Theme Usage:**
```typescript
import { useColorScheme } from 'nativewind';

const { colorScheme } = useColorScheme(); // 'light' | 'dark'
```

**Styling Rules:**
- Use theme CSS variables via Tailwind classes: `className="bg-background text-foreground"`
- Dark mode is automatic via CSS variables
- Platform-specific styles: `ios:`, `android:`, `web:` prefixes
- Responsive styles: Use NativeWind's responsive prefixes

**Never use hardcoded colors:**
```typescript
// Wrong
className="bg-blue-500"

// Correct
className="bg-primary"
```

### Shared Utilities

**`lib/constants.ts`** - Centralized constants:
- `LOGO` - App logo (adapts to theme)
- `CLERK_LOGO` - Clerk branding
- `LOGO_STYLE` - Reusable style object

**`lib/utils.ts`** - Utility functions:
- `cn()` - Tailwind class merging with `clsx` and `tailwind-merge`

**`lib/oauth-utils.ts`** - OAuth flow helpers:
- `generateUsername()` - Creates unique username from email/firstName
- `handleSignUp()` - Handles OAuth sign-up with automatic username generation

### Clerk Authentication Flow

1. **Initial Load**: `_layout.tsx` checks `isSignedIn` from `useAuth()`
2. **Splash Screen**: Hidden once `isLoaded` is true
3. **Protected Routes**: `Stack.Protected` guards routes based on auth state
4. **Token Caching**: Automatic via `@clerk/clerk-expo/token-cache`
5. **OAuth Handling**: `oauth-utils.ts` manages username generation for social sign-ins
6. **Session Management**: Clerk handles token refresh automatically
7. **Sign Out**: Available through `UserMenu` component

## Code Style Guidelines

### TypeScript Rules
- **Strict mode enabled** - Always type props and component return types
- Prefer `interface` for React component props
- Use `type` for unions, intersections, and utility types

### File & Component Naming
- **Files**: kebab-case (e.g., `user-menu.tsx`)
- **Components**: PascalCase (e.g., `UserMenu`)
- **Screens**: Default exports
- **Reusable components**: Named exports

### Import Organization
```typescript
// 1. External dependencies
import { View } from 'react-native';
import { useAuth } from '@clerk/clerk-expo';

// 2. Internal imports with path aliases
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
```

### Biome Configuration

The project uses **Biome** (not Prettier) for linting and formatting:

**Key Rules:**
- Line width: 100 characters
- Indentation: 2 spaces
- Quotes: Single quotes for JS/TS, double quotes for JSX
- Trailing commas: ES5 style
- **Sorted Tailwind classes** (enforced error-level)
- Auto-organize imports on save

**Disabled Rules:**
- `noForEach`, `noUselessFragments` - Allow forEach and fragments
- `useExhaustiveDependencies` - Relaxed hook dependency checks
- `noExplicitAny` - Allow explicit `any` when needed

Run `pnpm lint` before committing.

## Common Patterns

### Creating a New Screen

1. Add file to `app/` directory (or subdirectory for route groups)
2. Export default function component
3. Add `<Stack.Screen />` configuration to `app/_layout.tsx` if needed
4. Place inside appropriate `Stack.Protected` block based on auth requirements

Example:
```typescript
// app/profile.tsx
export default function ProfileScreen() {
  return <View>...</View>;
}

// app/_layout.tsx - Add to protected section
<Stack.Protected guard={isSignedIn}>
  <Stack.Screen name="index" />
  <Stack.Screen name="profile" options={{ title: 'Profile' }} />
</Stack.Protected>
```

### Adding a New UI Component

1. Create in `components/ui/` following React Native Reusables patterns
2. Use NativeWind for styling with Tailwind classes
3. Support dark mode via theme CSS variables (no conditional logic needed)
4. Export component with named export
5. Type all props with TypeScript

Example:
```typescript
import { Text } from 'react-native';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'destructive';
}

export function Badge({ children, variant = 'default' }: BadgeProps) {
  return (
    <Text className={cn(
      'bg-primary text-primary-foreground',
      variant === 'destructive' && 'bg-destructive text-destructive-foreground'
    )}>
      {children}
    </Text>
  );
}
```

### Working with Forms

- Form components manage their own state with `useState`
- Use Clerk hooks for auth operations:
  - `useSignIn()` - Sign in flows
  - `useSignUp()` - Sign up flows
  - `useUser()` - Current user data
  - `useAuth()` - Auth state and session
- Handle errors with Clerk's error types
- Display loading states during async operations

### OAuth Integration

When adding OAuth flows, use `lib/oauth-utils.ts`:

```typescript
import { handleSignUp } from '@/lib/oauth-utils';

const { signUp } = useSignUp();
const { setActive } = useSessionList();

const success = await handleSignUp(signUp, setActive);
```

This handles:
- Automatic username generation from email/firstName
- Missing field completion
- Session activation

## Important Notes

- **New Architecture**: Expo's React Native New Architecture is enabled
- **Edge-to-Edge**: UI extends to screen edges (use safe area insets)
- **Package Manager**: pnpm (see `.npmrc` - strict peer dependencies disabled)
- **Animations**: React Native Reanimated and Worklets included
- **Safe Areas**: Use `react-native-safe-area-context` for proper insets
- **Toasts**: Sonner Native configured at bottom-center with close button
- **Platform Suppression**: iOS Simulator warnings are suppressed in development (`LogBox.ignoreLogs`)

## Active Technologies
- TypeScript 5.9.2 (strict mode) with React Native 0.81.5 and React 19.1.0 + Expo SDK 54, Expo Router 6, React Native Reusables, NativeWind 4, Clerk (existing auth), @react-native-community/datetimepicker (001-todo-list-status)
- In-memory storage (dummy data in API routes) - no database persistence for Phase 1 (001-todo-list-status)
- TypeScript 5.x with strict mode enabled (React Native + Expo SDK 52+) (001-todo-list-status)
- In-memory Map (user-keyed) for MVP, with clear migration path to AsyncStorage or SQLite (001-todo-list-status)
- AsyncStorage (user-keyed by Clerk userId) for persistent local storage across logout/login cycles (001-todo-list-status)

## Recent Changes
- 001-todo-list-status: Added TypeScript 5.9.2 (strict mode) with React Native 0.81.5 and React 19.1.0 + Expo SDK 54, Expo Router 6, React Native Reusables, NativeWind 4, Clerk (existing auth), @react-native-community/datetimepicker

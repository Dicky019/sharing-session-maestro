# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React Native project built with Expo, featuring Clerk authentication, Convex backend, and React Native Reusables UI components. The app is a Todo management system with status tracking (active/inactive/complete) that runs on iOS, Android, and Web platforms with React Native's New Architecture enabled. It includes comprehensive Maestro UI tests for automation.

**Key Technologies:**
- **Expo Router** (file-based routing)
- **Clerk** (authentication with OAuth support for Apple, GitHub, Google)
- **Convex** (real-time backend with type-safe queries/mutations)
- **NativeWind** (Tailwind CSS for React Native)
- **React Native Reusables** (UI component library)
- **TypeScript** with strict mode enabled
- **Biome** (linting and formatting)
- **Maestro** (mobile UI testing framework)

## Development Commands

```bash
# Start development server
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

# Convex backend
npx convex dev      # Start Convex dev server (watches for changes)
npx convex deploy   # Deploy to production

# Cleanup
pnpm clean  # Remove .expo and node_modules
```

## Environment Setup

Before running the app:

### 1. Clerk Authentication Setup
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

### 2. Convex Backend Setup
1. Install Convex CLI: `npm install -g convex`
2. Create Convex project at https://dashboard.convex.dev
3. Run `npx convex dev` to initialize and link your project
4. Configure Clerk JWT integration:
   - Go to Clerk Dashboard → Configure → JWT Templates
   - Create new template → Select "Convex"
   - Name MUST be "convex"
   - Copy the Issuer URL (e.g., https://verb-noun-00.clerk.accounts.dev)
   - Set `CLERK_JWT_ISSUER_DOMAIN` in your Convex deployment environment
5. The Convex URL will be automatically added to your `.env.local` file

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
- Wraps app in `ClerkProvider`, `ConvexProviderWithClerk`, `ThemeProvider`, `GestureHandlerRootView`
- Uses `Stack.Protected` with guards based on `isSignedIn` state
- Screens under `guard={!isSignedIn}` are auth-only (sign-in, sign-up)
- Screens under `guard={isSignedIn}` require authentication
- Suppresses iOS Simulator warnings in development mode

**Route Structure:**
```
app/
├── _layout.tsx              # Root layout with auth guards & Convex provider
├── index.tsx                # Redirects to tabs
├── (tabs)/                  # Tab navigation (requires auth)
│   ├── _layout.tsx          # Tab bar configuration
│   ├── active.tsx           # Active todos list
│   ├── inactive.tsx         # Inactive todos list
│   └── complete.tsx         # Completed todos list
├── todo/
│   └── new.tsx              # Create todo form
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

### Convex Backend Architecture

**`convex/schema.ts`** - Database schema definition:
- Defines `todos` table with user isolation via `userId` field
- Indexes: `by_user`, `by_user_and_status` for optimized queries
- All fields are required (title, description, icon, status, dueDate)

**`convex/todos.ts`** - Backend functions:
- `list` - Query all todos for authenticated user
- `listByStatus` - Query todos filtered by status (for tab navigation)
- `create` - Mutation to create new todo with validation
- All functions require Clerk authentication via `ctx.auth.getUserIdentity()`

**`convex/auth.config.ts`** - Clerk JWT integration:
- Configures Clerk as authentication provider
- Requires `CLERK_JWT_ISSUER_DOMAIN` environment variable

**Integration Flow:**
1. User authenticates via Clerk
2. Clerk provides JWT token
3. `ConvexProviderWithClerk` passes JWT to Convex
4. Convex validates token and extracts `identity.subject` (Clerk user ID)
5. Backend functions use `identity.subject` for user isolation

### Component Architecture

**UI Components** (`components/ui/`):
- Primitive components based on **React Native Reusables**
- Styled exclusively with **NativeWind** (Tailwind classes)
- Examples: Button, Input, Card, Avatar, Label, Icon, Text, Separator, Popover
- All support dark mode via theme CSS variables

**Feature Components** (`components/`):
- `sign-in-form.tsx`, `sign-up-form.tsx` - Auth forms with firstName/lastName
- `forgot-password-form.tsx`, `reset-password-form.tsx` - Password recovery
- `verify-email-form.tsx` - Email verification UI
- `social-connections.tsx` - OAuth buttons for Apple/GitHub/Google
- `user-menu.tsx` - User profile dropdown with sign-out
- `theme-toggle.tsx` - Light/dark mode switcher

**Todo Components** (`components/todo/`):
- `todo-form.tsx` - Create/edit todo form with validation
- `todo-card.tsx` - Todo item display with status badge
- `datetime-picker.tsx` - Date/time picker for due dates
- `icon-picker.tsx` - Icon selection UI (uses lucide-react-native icons)

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
import { Todo } from '@/lib/types/todo';

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
- `parseEmailName()` - Parses email format like "test+clerk_test@example.com" into firstName/lastName
- `generateUsername()` - Creates unique username from email/firstName
- `handleSignUp()` - Handles OAuth sign-up with automatic username generation

**`lib/types/todo.ts`** - Todo type definitions:
- `Todo` interface with all required fields
- `TodoStatus` type: 'active' | 'inactive' | 'complete'
- `TODO_STATUS_LABELS` - Display names for statuses
- `TODO_ICON_OPTIONS` - Available icons from lucide-react-native (27 options)

### Authentication & Data Flow

1. **Initial Load**: `_layout.tsx` checks `isSignedIn` from `useAuth()`
2. **Splash Screen**: Hidden once `isLoaded` is true
3. **Protected Routes**: `Stack.Protected` guards routes based on auth state
4. **Token Management**: Clerk JWT passed to Convex via `ConvexProviderWithClerk`
5. **Data Fetching**: Use Convex hooks (`useQuery`, `useMutation`) with automatic reactivity
6. **User Isolation**: All Convex queries filtered by `userId` (from Clerk JWT)
7. **Sign Out**: Available through `UserMenu` component

## Code Style Guidelines

### TypeScript Rules
- **Strict mode enabled** - Always type props and component return types
- Prefer `interface` for React component props
- Use `type` for unions, intersections, and utility types

### File & Component Naming
- **Files**: kebab-case (e.g., `user-menu.tsx`, `todo-card.tsx`)
- **Components**: PascalCase (e.g., `UserMenu`, `TodoCard`)
- **Screens**: Default exports
- **Reusable components**: Named exports

### Import Organization
```typescript
// 1. External dependencies
import { View } from 'react-native';
import { useAuth } from '@clerk/clerk-expo';
import { useQuery, useMutation } from 'convex/react';

// 2. Internal imports with path aliases
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { api } from '@/convex/_generated/api';
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
// app/todo/[id].tsx
export default function TodoDetailScreen() {
  return <View>...</View>;
}

// app/_layout.tsx - Add to protected section
<Stack.Protected guard={isSignedIn}>
  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
  <Stack.Screen name="todo/[id]" options={{ title: 'Todo Details' }} />
</Stack.Protected>
```

### Working with Convex

**Querying Data:**
```typescript
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

function TodoList() {
  const todos = useQuery(api.todos.list);
  // todos is automatically reactive and includes loading/error states

  if (todos === undefined) return <Text>Loading...</Text>;
  return <FlatList data={todos} ... />;
}
```

**Mutating Data:**
```typescript
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

function CreateTodoForm() {
  const createTodo = useMutation(api.todos.create);

  async function handleSubmit() {
    await createTodo({
      title: 'Buy groceries',
      description: 'Get milk and eggs',
      icon: 'ShoppingCart',
      dueDate: new Date().toISOString(),
    });
  }
}
```

**Filtered Queries:**
```typescript
// Query todos by status for tab navigation
const activeTodos = useQuery(api.todos.listByStatus, { status: 'active' });
const completeTodos = useQuery(api.todos.listByStatus, { status: 'complete' });
```

### Adding a New Convex Function

1. Define in `convex/todos.ts` (or create new file)
2. Use `query` for read operations, `mutation` for writes
3. Always validate authentication: `await ctx.auth.getUserIdentity()`
4. Use `identity.subject` for user isolation
5. Validate input args with proper error messages
6. TypeScript types are auto-generated in `convex/_generated/`

Example:
```typescript
export const updateStatus = mutation({
  args: {
    todoId: v.id('todos'),
    status: v.union(v.literal('active'), v.literal('inactive'), v.literal('complete')),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');

    // Verify ownership before update
    const todo = await ctx.db.get(args.todoId);
    if (todo?.userId !== identity.subject) {
      throw new Error('Unauthorized');
    }

    await ctx.db.patch(args.todoId, {
      status: args.status,
      updatedAt: new Date().toISOString(),
    });
  },
});
```

### Working with Forms

- Form components manage their own state with `useState`
- Use Clerk hooks for auth operations:
  - `useSignIn()` - Sign in flows
  - `useSignUp()` - Sign up flows
  - `useUser()` - Current user data
  - `useAuth()` - Auth state and session
- Use Convex mutations for data operations
- Handle errors with proper error states
- Display loading states during async operations
- Validate inputs before submission

### Todo Form Validation

The todo form has strict validation rules:
- **Title**: Required, 1-100 characters
- **Description**: Required, max 500 characters
- **Icon**: Required, must be from `TODO_ICON_OPTIONS` (27 icons available)
- **Due Date**: Required, must be valid ISO 8601 datetime
- **Status**: Defaults to 'active' on creation

All validation is enforced both client-side and server-side (Convex).

## Maestro UI Testing

### Test Structure

Tests are located in `.maestro/flows/`:
```
.maestro/flows/
├── common/
│   ├── sign-in.yaml          # Reusable sign-in flow
│   ├── sign-up.yaml          # Reusable sign-up flow
│   └── setup-auth.yaml       # Common auth setup
└── todos/
    ├── create-todo.yaml      # Test creating a new todo
    ├── calculate-datetime.js # Helper script for date/time
    └── ...
```

### Running Maestro Tests

```bash
# Install Maestro CLI (Mac/Linux)
curl -Ls "https://get.maestro.mobile.dev" | bash

# Run a single test
maestro test .maestro/flows/todos/create-todo.yaml

# Run all tests
maestro test .maestro/flows/

# Run with specific app ID
maestro test .maestro/flows/todos/create-todo.yaml --env APP_ID=your.app.id
```

### Writing Maestro Tests

Tests use YAML syntax with built-in commands:

```yaml
appId: ${APP_ID}
tags:
  - smokeTest
---
# Test description

- launchApp

# Reuse common flows
- runFlow:
    when:
      notVisible:
        id: "user-menu"
    file: ../common/sign-in.yaml

# Interact with elements
- tapOn: "Create new todo"
- tapOn:
    id: "todo-title-input"
- inputText: "Buy groceries"
- hideKeyboard

# Assertions
- assertVisible: "Todo created successfully"
- assertVisible:
    id: "todo-icon-ShoppingCart"
```

**Key Testing Patterns:**
- Always use `testID` prop for reliable element selection
- Use conditional flows (`when`) to handle auth state
- Hide keyboard before tapping non-input elements
- Use JavaScript helpers for dynamic data (dates, etc.)
- Tag tests appropriately (smokeTest, regression, etc.)

### testID Conventions

When adding testIDs for Maestro tests:
- Use kebab-case: `testID="todo-title-input"`
- Be specific: `testID="create-todo-submit"` not just `testID="submit"`
- Icon elements: `testID="todo-icon-{IconName}"` e.g., `testID="todo-icon-ShoppingCart"`
- Status badges: `testID="{status}"` e.g., `testID="active"`

## Important Notes

- **New Architecture**: Expo's React Native New Architecture is enabled
- **Edge-to-Edge**: UI extends to screen edges (use safe area insets)
- **Package Manager**: pnpm (see `.npmrc` - strict peer dependencies disabled)
- **Animations**: React Native Reanimated and Worklets included
- **Safe Areas**: Use `react-native-safe-area-context` for proper insets
- **Toasts**: Sonner Native configured at bottom-center with close button
- **Platform Suppression**: iOS Simulator warnings are suppressed in development (`LogBox.ignoreLogs`)
- **Real-time Updates**: Convex provides automatic reactivity - queries re-run when data changes
- **User Isolation**: All todos are scoped to the authenticated user via Clerk JWT
- **Date/Time Handling**: All dates stored as ISO 8601 strings in Convex
- **Icon Library**: Uses lucide-react-native with 27 predefined icons for todos

# Developer Quickstart: Todo List Feature

**Feature**: Todo List with Status Management (Active, Inactive, Complete)
**Branch**: `001-todo-list-status`
**Stack**: React Native + Expo + Convex + Clerk + Maestro
**Date**: 2025-10-29

## Prerequisites

Before you begin, ensure you have the following installed and configured:

### Required Tools

- **Node.js** (v18 or later)
- **pnpm** (package manager)
- **Expo CLI** (installed globally or via npx)
- **Maestro CLI** (for E2E testing)
- **Platform-specific tools**:
  - iOS: Xcode and iOS Simulator (macOS only)
  - Android: Android Studio and Android Emulator
  - Web: Modern web browser (Chrome, Safari, Firefox)

### Required Accounts

1. **Clerk Account** (Authentication)
   - Sign up at https://go.clerk.com/blVsQlm
   - Configure authentication with "Email, phone, username" option
   - Enable SSO connections: Apple, GitHub, Google
   - Get publishable keys from https://go.clerk.com/u8KAui7

2. **Convex Account** (Backend Database)
   - Sign up at https://convex.dev
   - Create a new project or use existing one
   - Get deployment URL (e.g., `https://your-project.convex.cloud`)

### Install Maestro CLI

```bash
curl -Ls "https://get.maestro.mobile.dev" | bash
```

Verify installation:
```bash
maestro --version
```

## Initial Setup

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd sharing-session-maestro

# Checkout feature branch
git checkout 001-todo-list-status

# Install dependencies
pnpm install
```

### 2. Configure Clerk Authentication

Create environment files from the example:

```bash
cp .env.example .env.development
cp .env.example .env.production
```

Edit `.env.development` and add your Clerk publishable key:

```bash
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_DEVELOPMENT_KEY
```

Edit `.env.production` with production key:

```bash
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_YOUR_PRODUCTION_KEY
```

**Important**: Never commit `.env` files (they are gitignored).

### 3. Configure Convex Backend

#### Step 1: Initialize Convex

```bash
npx convex dev
```

This will:
- Create a new Convex project (or link to existing)
- Generate `.env.local` with Convex deployment URL
- Start the Convex development server
- Watch for schema and function changes

#### Step 2: Set Up Clerk JWT Template

1. Go to **Clerk Dashboard** → **Configure** → **JWT Templates**
2. Click **+ New template** → Select **Convex**
3. Name the template: `convex` (MUST be lowercase "convex")
4. Copy the **Issuer URL** (e.g., `https://verb-noun-00.clerk.accounts.dev`)
5. Go to your **Convex Dashboard** → **Settings** → **Environment Variables**
6. Add environment variable:
   - **Key**: `CLERK_JWT_ISSUER_DOMAIN`
   - **Value**: Your Clerk issuer URL (from step 4)

#### Step 3: Verify Convex Setup

Check that the following files exist:
- `convex/schema.ts` - Database schema (todos table)
- `convex/todos.ts` - Backend queries and mutations
- `convex/auth.config.ts` - Clerk authentication config

### 4. Start Development Environment

```bash
# Start Expo dev server (automatically copies .env.development to .env)
pnpm dev
```

In another terminal, ensure Convex is running:

```bash
# Start Convex dev server (if not already running)
npx convex dev
```

### 5. Launch Your Platform

From the Expo dev server terminal:

- Press `i` for **iOS Simulator** (macOS only)
- Press `a` for **Android Emulator**
- Press `w` for **Web Browser**

Or use platform-specific commands:

```bash
pnpm ios      # iOS development build
pnpm android  # Android development build
pnpm web      # Web development build
```

## Development Workflow (TDD with Maestro)

This project follows **Test-Driven Development** principles with Maestro E2E tests.

### TDD Cycle

#### 1. Red Phase - Write Failing Test

Create a new Maestro test flow that describes the expected behavior:

```bash
# Example: Create test for new feature
touch .maestro/flows/todos/my-new-feature.yaml
```

Write the test flow:

```yaml
appId: ${APP_ID}
tags:
  - todos
---
# Test: My New Feature
# Purpose: Verify new feature works as expected

- runFlow:
    when:
      visible: "Sign in to .*"
    file: ../common/setup-auth.yaml

- tapOn: "My New Button"
- assertVisible: "Expected Result"
```

Run the test (it should fail):

```bash
maestro test .maestro/flows/todos/my-new-feature.yaml -e APP_ID=com.anonymous.sharingsessionmaestro
```

#### 2. Green Phase - Implement Feature

Implement the minimum code to make the test pass:

1. **Update Convex Schema** (if needed):
   - Edit `convex/schema.ts` to add new fields or tables

2. **Create/Update Backend Functions**:
   - Edit `convex/todos.ts` for queries/mutations
   - Use Convex validators (`v.string()`, `v.union()`, etc.)

3. **Build UI Components**:
   - Create components in `components/todo/`
   - Use React Native Reusables for UI primitives
   - Style with NativeWind (Tailwind classes)

4. **Connect Frontend to Backend**:
   - Use `useQuery()` for reading data
   - Use `useMutation()` for creating/updating data
   - Import from `convex/react`

Example:

```typescript
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

export default function MyComponent() {
  // Query data
  const todos = useQuery(api.todos.list);

  // Mutation for creating
  const createTodo = useMutation(api.todos.create);

  const handleCreate = async () => {
    await createTodo({
      title: "New Todo",
      description: "Description",
      icon: "CheckSquare",
      dueDate: new Date().toISOString(),
    });
  };

  return (/* UI */);
}
```

Run the test again:

```bash
maestro test .maestro/flows/todos/my-new-feature.yaml -e APP_ID=com.anonymous.sharingsessionmaestro
```

#### 3. Refactor Phase - Improve Code Quality

Once tests are green:

1. **Clean up code**:
   - Remove duplication
   - Extract reusable components
   - Improve naming and organization

2. **Run linter**:
   ```bash
   pnpm lint
   pnpm lint:fix  # Auto-fix issues
   ```

3. **Format code**:
   ```bash
   pnpm format
   pnpm format:fix  # Apply unsafe fixes
   ```

4. **Re-run tests** to ensure refactoring didn't break anything:
   ```bash
   maestro test .maestro/flows/todos/
   ```

### TDD Best Practices

- Write tests BEFORE implementation
- Keep tests focused on user behavior (not implementation details)
- Use descriptive test names and comments
- Run tests frequently during development
- Commit tests alongside feature code

## Project Structure

### Directory Layout

```
sharing-session-maestro/
├── app/                           # Expo Router screens
│   ├── (tabs)/                    # Bottom tab navigation
│   │   ├── _layout.tsx            # Tab configuration
│   │   ├── active.tsx             # Active todos screen
│   │   ├── inactive.tsx           # Inactive/terlewat screen
│   │   └── complete.tsx           # Complete todos screen
│   ├── (auth)/                    # Authentication screens
│   │   ├── sign-in.tsx            # Sign in form
│   │   └── sign-up/               # Sign up flow
│   ├── todo/
│   │   └── new.tsx                # Create todo modal
│   ├── _layout.tsx                # Root layout with providers
│   └── index.tsx                  # Main screen (redirects to active)
│
├── components/                    # React components
│   ├── todo/                      # Todo feature components
│   │   ├── todo-list.tsx          # List component
│   │   ├── todo-card.tsx          # Individual todo card
│   │   ├── todo-form.tsx          # Form with all fields
│   │   ├── icon-picker.tsx        # Icon selection grid
│   │   ├── datetime-picker.tsx    # Datetime picker wrapper
│   │   └── empty-state.tsx        # Empty state UI
│   ├── ui/                        # Reusable UI primitives
│   │   ├── button.tsx             # Button component
│   │   ├── input.tsx              # Input field
│   │   └── ...                    # Other UI components
│   ├── sign-in-form.tsx           # Auth forms
│   ├── user-menu.tsx              # User profile dropdown
│   └── theme-toggle.tsx           # Light/dark mode switcher
│
├── convex/                        # Convex backend
│   ├── schema.ts                  # Database schema (todos table)
│   ├── todos.ts                   # Todo queries & mutations
│   ├── auth.config.ts             # Clerk JWT integration
│   └── _generated/                # Auto-generated types (DO NOT EDIT)
│       ├── api.d.ts               # API types
│       ├── dataModel.d.ts         # Data model types
│       └── server.d.ts            # Server types
│
├── lib/                           # Shared utilities
│   ├── types/
│   │   └── todo.ts                # TypeScript types & constants
│   ├── utils.ts                   # Utility functions (cn, etc.)
│   ├── constants.ts               # App constants
│   ├── theme.ts                   # Theme configuration
│   └── oauth-utils.ts             # OAuth helpers
│
├── .maestro/                      # Maestro E2E tests
│   └── flows/
│       ├── todos/                 # Todo feature tests
│       │   ├── create-todo.yaml   # Create todo (smokeTest)
│       │   ├── calculate-datetime.js  # Date calculation helper
│       │   └── validate-missing-fields.yaml
│       └── common/                # Reusable flows
│           └── setup-auth.yaml    # Auth setup flow
│
├── specs/                         # Feature specifications
│   └── 001-todo-list-status/      # This feature's docs
│       ├── quickstart.md          # This file
│       ├── spec.md                # Feature specification
│       ├── tasks.md               # Implementation tasks
│       └── data-model.md          # Data model documentation
│
├── .env.development               # Development environment vars
├── .env.production                # Production environment vars
├── .env.example                   # Environment template
├── CLAUDE.md                      # Project instructions for Claude
└── package.json                   # Dependencies and scripts
```

### Key Files & Responsibilities

#### Convex Backend

- **`convex/schema.ts`**: Database schema definition
  - Defines `todos` table structure
  - Sets up indexes for efficient queries
  - Enforces data types with Convex validators

- **`convex/todos.ts`**: Backend business logic
  - `list()` - Query all todos for authenticated user
  - `listByStatus()` - Query todos filtered by status
  - `create()` - Create new todo with validation
  - All functions require Clerk authentication

- **`convex/auth.config.ts`**: Authentication configuration
  - Integrates Clerk JWT with Convex
  - Uses `CLERK_JWT_ISSUER_DOMAIN` environment variable

#### Frontend Components

- **`components/todo/todo-form.tsx`**: Todo creation/editing form
  - Icon picker integration
  - Title, description, due date fields
  - Form validation (client-side)

- **`components/todo/todo-card.tsx`**: Individual todo display
  - Shows title, description, icon, due date
  - Status badge (Active/Inactive/Complete)
  - Quick actions for status changes

- **`components/todo/icon-picker.tsx`**: Icon selection UI
  - Grid of Lucide icons
  - Defined in `TODO_ICON_OPTIONS`

- **`components/todo/datetime-picker.tsx`**: Date/time picker
  - Native picker on iOS/Android
  - HTML5 input on web
  - Platform-specific implementation

#### Screens

- **`app/(tabs)/active.tsx`**: Active todos tab
  - Queries: `api.todos.listByStatus({ status: 'active' })`
  - Shows floating action button (FAB) for create

- **`app/(tabs)/inactive.tsx`**: Inactive todos tab
  - Queries: `api.todos.listByStatus({ status: 'inactive' })`

- **`app/(tabs)/complete.tsx`**: Complete todos tab
  - Queries: `api.todos.listByStatus({ status: 'complete' })`

- **`app/todo/new.tsx`**: Create todo modal
  - Uses `TodoForm` component
  - Calls `api.todos.create` mutation

#### Types & Constants

- **`lib/types/todo.ts`**: TypeScript definitions
  - `Todo` interface
  - `TodoStatus` type
  - `TODO_ICON_OPTIONS` array

## Testing Strategy

### Test Organization

Tests are organized by feature in `.maestro/flows/`:

```
.maestro/flows/
├── todos/                         # Todo feature tests
│   ├── create-todo.yaml           # SMOKE TEST: Create todo
│   ├── validate-missing-fields.yaml
│   └── calculate-datetime.js      # JavaScript helper for date math
├── auth/                          # Authentication tests
│   ├── sign-in.yaml
│   └── sign-up.yaml
└── common/                        # Reusable flows (NOT executed)
    └── setup-auth.yaml            # Auth setup subflow
```

### Running Tests

#### Run All Tests

```bash
maestro test .maestro/flows -e APP_ID=com.anonymous.sharingsessionmaestro
```

#### Run Smoke Tests Only (Fast, Critical Paths)

```bash
maestro test .maestro/flows --includeTags smokeTest -e APP_ID=com.anonymous.sharingsessionmaestro
```

Smoke tests include:
- `create-todo.yaml` - Create todo with all required fields

#### Run Feature-Specific Tests

```bash
# Todo feature tests only
maestro test .maestro/flows --includeTags todos -e APP_ID=com.anonymous.sharingsessionmaestro

# Auth tests only
maestro test .maestro/flows --includeTags auth -e APP_ID=com.anonymous.sharingsessionmaestro
```

#### Run Single Test Flow

```bash
maestro test .maestro/flows/todos/create-todo.yaml -e APP_ID=com.anonymous.sharingsessionmaestro
```

### Test Environment Variables

Set `APP_ID` based on your platform:

- **iOS**: `com.anonymous.sharingsessionmaestro`
- **Android**: `com.anonymous.sharingsessionmaestro`
- **Web**: Use URL instead of APP_ID (not yet configured)

### Debugging Failed Tests

1. **Run test with debug output**:
   ```bash
   maestro test .maestro/flows/todos/create-todo.yaml -e APP_ID=com.anonymous.sharingsessionmaestro --debug-output
   ```

2. **Check Maestro logs**:
   - Look for assertion failures
   - Check element IDs (testID props)
   - Verify timing issues (add delays if needed)

3. **Verify app state**:
   - Ensure user is authenticated
   - Check Convex dashboard for data
   - Look at console logs in terminal

4. **Common issues**:
   - **Element not found**: Check testID in component
   - **Timing issues**: Add `- wait: 1000` before assertions
   - **Auth failures**: Verify Clerk keys in `.env.development`

### Test Coverage

Current test flows:

1. **create-todo.yaml** (smokeTest, todos)
   - Authenticate user
   - Navigate to Active tab
   - Fill in all required fields (title, description, icon, due date)
   - Submit form
   - Verify success message
   - Verify todo appears in Active tab

2. **validate-missing-fields.yaml** (todos)
   - Test form validation
   - Verify error messages for missing fields

### Writing New Tests

Follow this template:

```yaml
appId: ${APP_ID}
tags:
  - smokeTest  # If critical path
  - todos      # Feature tag
---
# Test: [Feature Name]
#
# Purpose: [What this test verifies]
#
# Prerequisites:
# - [What needs to be set up]
#
# Test Steps:
# 1. [Step 1]
# 2. [Step 2]
# ...

# Authenticate user (if needed)
- runFlow:
    when:
      visible: "Sign in to .*"
    file: ../common/setup-auth.yaml

# Test steps
- tapOn: "Button ID"
- inputText: "Sample text"
- assertVisible: "Expected text"
```

## Common Development Tasks

### Add a New Icon to Icon Picker

1. **Check available Lucide icons**: https://lucide.dev/icons/
2. **Edit `lib/types/todo.ts`**:
   ```typescript
   export const TODO_ICON_OPTIONS = [
     'CheckSquare',
     'Calendar',
     // ... existing icons
     'NewIconName',  // Add new icon
   ] as const;
   ```
3. Icon automatically appears in icon picker grid
4. No component changes needed

### Add a New Todo Field

#### Backend (Convex)

1. **Update schema** (`convex/schema.ts`):
   ```typescript
   export default defineSchema({
     todos: defineTable({
       userId: v.string(),
       title: v.string(),
       description: v.string(),
       icon: v.string(),
       status: v.union(v.literal('active'), v.literal('inactive'), v.literal('complete')),
       dueDate: v.string(),
       newField: v.string(),  // Add new field
       createdAt: v.string(),
       updatedAt: v.string(),
     })
       .index('by_user', ['userId'])
       .index('by_user_and_status', ['userId', 'status']),
   });
   ```

2. **Update mutation** (`convex/todos.ts`):
   ```typescript
   export const create = mutation({
     args: {
       title: v.string(),
       description: v.string(),
       icon: v.string(),
       dueDate: v.string(),
       newField: v.string(),  // Add to args
     },
     handler: async (ctx, args) => {
       // ... validation

       await ctx.db.insert('todos', {
         userId: identity.subject,
         title: args.title,
         description: args.description,
         icon: args.icon,
         status: 'active',
         dueDate: args.dueDate,
         newField: args.newField,  // Add to insert
         createdAt: now,
         updatedAt: now,
       });
     },
   });
   ```

#### Frontend

3. **Update TypeScript type** (`lib/types/todo.ts`):
   ```typescript
   export interface Todo {
     _id: Id<"todos">;
     userId: string;
     title: string;
     description: string;
     icon: string;
     status: TodoStatus;
     dueDate: string;
     newField: string;  // Add to interface
     createdAt: string;
     updatedAt: string;
   }
   ```

4. **Update form component** (`components/todo/todo-form.tsx`):
   ```typescript
   const [newField, setNewField] = useState('');

   // Add input field to form JSX
   <Input
     value={newField}
     onChangeText={setNewField}
     placeholder="New field"
   />

   // Update submit handler
   const handleSubmit = async () => {
     await createTodo({
       title,
       description,
       icon,
       dueDate,
       newField,  // Include in mutation call
     });
   };
   ```

5. **Update todo card** (`components/todo/todo-card.tsx`):
   ```typescript
   // Display new field
   <Text>{todo.newField}</Text>
   ```

### Add a New Todo Status

1. **Update schema** (`convex/schema.ts`):
   ```typescript
   status: v.union(
     v.literal('active'),
     v.literal('inactive'),
     v.literal('complete'),
     v.literal('newStatus')  // Add new status
   ),
   ```

2. **Update TypeScript type** (`lib/types/todo.ts`):
   ```typescript
   export type TodoStatus = 'active' | 'inactive' | 'complete' | 'newStatus';
   ```

3. **Create new tab screen** (`app/(tabs)/newStatus.tsx`):
   ```typescript
   import { useQuery } from 'convex/react';
   import { api } from '@/convex/_generated/api';

   export default function NewStatusScreen() {
     const todos = useQuery(api.todos.listByStatus, { status: 'newStatus' });

     return (
       <TodoList todos={todos} emptyMessage="No new status todos" />
     );
   }
   ```

4. **Add tab to navigation** (`app/(tabs)/_layout.tsx`):
   ```typescript
   <Tabs.Screen
     name="newStatus"
     options={{
       title: 'New Status',
       tabBarIcon: ({ color }) => <Icon name="NewIcon" color={color} />,
     }}
   />
   ```

### Update Validation Rules

Edit `convex/todos.ts` mutation handlers:

```typescript
export const create = mutation({
  args: { /* ... */ },
  handler: async (ctx, args) => {
    // Example: Change title max length
    if (trimmedTitle.length > 200) {  // Changed from 100
      throw new Error('Title must be 200 characters or less');
    }

    // Example: Make description optional
    if (args.description && args.description.length > 500) {
      throw new Error('Description must be 500 characters or less');
    }

    // ... rest of validation
  },
});
```

### Debug Convex Queries

1. **Check Convex Dashboard**:
   - Go to https://dashboard.convex.dev
   - Select your project
   - View **Data** tab to see todos table
   - View **Logs** tab for function calls and errors

2. **Add console logs** (convex/todos.ts):
   ```typescript
   export const list = query({
     args: {},
     handler: async (ctx) => {
       const identity = await ctx.auth.getUserIdentity();
       console.log('User ID:', identity?.subject);  // Logs appear in Convex dashboard

       const todos = await ctx.db
         .query('todos')
         .withIndex('by_user', (q) => q.eq('userId', identity!.subject))
         .collect();

       console.log('Found todos:', todos.length);
       return todos;
     },
   });
   ```

3. **Test queries in Convex dashboard**:
   - Go to **Functions** tab
   - Select a query/mutation
   - Click **Run** with test arguments
   - View results and logs

### Test Authentication in Development

Use Clerk's special test credentials (no actual email/SMS sent):

#### Test Email Addresses

- Format: `[name]+clerk_test@example.com`
- Example: `john+clerk_test@example.com`
- Verification code: Always `424242`

#### Test Phone Numbers

- Pattern: `+1 (XXX) 555-0100` to `+1 (XXX) 555-0199`
- Example: `+1 (201) 555-0123`
- Verification code: Always `424242`

#### Quick Test Flow

1. Sign up with `test+clerk_test@example.com`
2. Use any password (minimum 8 characters)
3. Enter verification code: `424242`
4. Check console logs for auth flow details

## Troubleshooting

### Issue: Convex Functions Not Working

**Symptoms**:
- "Unauthenticated" errors
- Empty todo lists
- Mutations failing silently

**Solutions**:

1. **Check Clerk JWT template**:
   - Verify template name is exactly `convex` (lowercase)
   - Copy Issuer URL from Clerk dashboard
   - Add to Convex environment variables as `CLERK_JWT_ISSUER_DOMAIN`

2. **Verify authentication**:
   ```typescript
   // In your component
   const { isSignedIn, userId } = useAuth();
   console.log('Signed in:', isSignedIn, 'User ID:', userId);
   ```

3. **Check Convex logs**:
   - Go to Convex dashboard → Logs
   - Look for authentication errors

### Issue: Schema Changes Not Applying

**Symptoms**:
- New fields not appearing in database
- TypeScript errors about missing properties

**Solutions**:

1. **Restart Convex dev server**:
   ```bash
   # Stop current process (Ctrl+C)
   npx convex dev
   ```

2. **Clear and rebuild**:
   ```bash
   rm -rf convex/_generated
   npx convex dev
   ```

3. **Check for schema errors**:
   - Look at terminal running `npx convex dev`
   - Fix any validation errors in `convex/schema.ts`

### Issue: Todos Not Persisting

**Symptoms**:
- Todos disappear after refresh
- Changes not saving

**Cause**: Unlike the old in-memory API routes, Convex persists data automatically.

**Solutions**:

1. **Check Convex connection**:
   - Ensure `npx convex dev` is running
   - Check `.env.local` has `CONVEX_URL`

2. **Verify mutations are called**:
   ```typescript
   const createTodo = useMutation(api.todos.create);

   const handleCreate = async () => {
     try {
       const id = await createTodo({ /* args */ });
       console.log('Created todo:', id);
     } catch (error) {
       console.error('Create failed:', error);
     }
   };
   ```

3. **Check Convex dashboard**:
   - View Data tab → todos table
   - Verify records exist

### Issue: Maestro Tests Failing

**Symptoms**:
- Timeout errors
- Element not found errors
- Assertion failures

**Solutions**:

1. **Check app is running**:
   ```bash
   pnpm dev
   # Wait for "Metro waiting on exp://..."
   # Launch iOS/Android before running tests
   ```

2. **Verify testID props**:
   - Check component has `testID` attribute
   - Use exact ID in Maestro test
   ```typescript
   <Button testID="create-todo-submit">Submit</Button>
   ```

3. **Add delays for async operations**:
   ```yaml
   - tapOn: "Submit"
   - wait: 1000  # Wait for API call
   - assertVisible: "Success"
   ```

4. **Run with debug output**:
   ```bash
   maestro test .maestro/flows/todos/create-todo.yaml --debug-output
   ```

### Issue: DateTime Picker Not Showing (Web)

**Cause**: Web uses HTML5 datetime-local input

**Solutions**:

1. Use modern browser (Chrome, Safari, Firefox latest)
2. Test on iOS/Android for native picker
3. Check browser console for errors

### Issue: Icons Not Rendering

**Symptoms**:
- Blank squares instead of icons
- "Icon not found" errors

**Solutions**:

1. **Verify icon name in `TODO_ICON_OPTIONS`**:
   ```typescript
   // lib/types/todo.ts
   export const TODO_ICON_OPTIONS = [
     'CheckSquare',  // Must match Lucide icon name exactly
     'Calendar',
     // ...
   ] as const;
   ```

2. **Check icon is from Lucide**:
   - Search at https://lucide.dev/icons/
   - Use exact name from Lucide docs

3. **Verify icon picker import**:
   ```typescript
   import { CheckSquare, Calendar } from 'lucide-react-native';
   ```

## Performance Tips

1. **Query Optimization**:
   - Use `listByStatus` for filtered views (faster than client-side filtering)
   - Convex automatically optimizes queries with indexes

2. **Real-time Updates**:
   - `useQuery` automatically subscribes to changes
   - No manual polling needed

3. **Optimistic Updates** (future enhancement):
   - Use Convex's built-in optimistic updates
   - See: https://docs.convex.dev/client/react/optimistic-updates

4. **Large Lists** (>100 todos):
   - Consider pagination with `limit()` and `skip()`
   - Or use FlashList for virtualization

## Next Steps

After setting up and testing the feature:

1. **Run all tests**:
   ```bash
   maestro test .maestro/flows --includeTags smokeTest
   ```

2. **Code quality checks**:
   ```bash
   pnpm lint
   pnpm format
   ```

3. **Review feature specification**:
   - Read `specs/001-todo-list-status/spec.md`
   - Check `specs/001-todo-list-status/tasks.md` for implementation details

4. **Explore Convex dashboard**:
   - View data in todos table
   - Monitor function logs
   - Check performance metrics

## Resources

### Documentation

- **Convex**: https://docs.convex.dev
  - React integration: https://docs.convex.dev/client/react
  - Authentication: https://docs.convex.dev/auth/clerk
  - Schema definition: https://docs.convex.dev/database/schemas

- **Clerk**: https://clerk.com/docs
  - JWT templates: https://clerk.com/docs/backend-requests/making/jwt-templates
  - React Native: https://clerk.com/docs/quickstarts/expo

- **Expo Router**: https://docs.expo.dev/router/introduction/
  - File-based routing: https://docs.expo.dev/router/create-pages/
  - Tabs navigation: https://docs.expo.dev/router/advanced/tabs/

- **Maestro**: https://maestro.mobile.dev
  - Writing flows: https://maestro.mobile.dev/getting-started/writing-your-first-flow
  - Best practices: https://maestro.mobile.dev/best-practices/flows

- **React Native Reusables**: https://rnr-docs.vercel.app
- **Lucide Icons**: https://lucide.dev/icons/
- **NativeWind**: https://www.nativewind.dev

### Getting Help

**Issue**: Feature not working as expected

**Steps**:
1. Check console for error messages (both Expo and Convex terminals)
2. Verify Clerk authentication (check Clerk dashboard)
3. Check Convex dashboard for data and logs
4. Review Maestro test results
5. Consult `CLAUDE.md` for project conventions

**Need Support?**
- Check `specs/001-todo-list-status/spec.md` for requirements
- Review `specs/001-todo-list-status/data-model.md` for schema details
- See `specs/001-todo-list-status/tasks.md` for implementation checklist

## Summary

This quickstart guide covers:

- Complete setup from zero to running app
- TDD workflow with Maestro
- Project structure and key files
- Testing strategy and commands
- Common development tasks
- Troubleshooting common issues

**Quick Reference Commands**:

```bash
# Setup
pnpm install
npx convex dev
pnpm dev

# Testing
maestro test .maestro/flows --includeTags smokeTest
maestro test .maestro/flows/todos/create-todo.yaml

# Code Quality
pnpm lint
pnpm format

# Platform-specific
pnpm ios      # iOS
pnpm android  # Android
pnpm web      # Web
```

Happy coding!

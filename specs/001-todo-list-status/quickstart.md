# Quick Start: Todo List Feature

**Feature**: Todo List with Status Management
**Branch**: `001-todo-list-status`
**Date**: 2025-10-26

## Prerequisites

- Expo development environment set up
- Clerk authentication configured
- Project dependencies installed (`pnpm install`)

## Installation

### 1. Install New Dependencies

Only one new dependency is required for this feature:

```bash
npx expo install @react-native-community/datetimepicker
```

All other dependencies (Expo Router, lucide-react-native, NativeWind) are already installed.

### 2. Checkout Feature Branch

```bash
git checkout 001-todo-list-status
```

## Running the Feature

### Start Development Server

```bash
pnpm dev
```

Then launch your preferred platform:
- Press `i` for iOS Simulator
- Press `a` for Android Emulator
- Press `w` for Web Browser

### Sign In

Use Clerk test credentials:
- Email: `test+clerk_test@example.com`
- Password: Any password (min 8 characters)
- Verification code: `424242`

Or sign in with OAuth (Apple, GitHub, Google).

## Feature Overview

### Tab Navigation

After signing in, you'll see three tabs at the bottom (mobile) or top (web):

1. **Active** - Current todos in progress
2. **Terlewat (Inactive)** - Missed or skipped todos
3. **Complete** - Finished todos

### Creating a Todo

1. Tap the **+** button (floating action button or header button)
2. Fill in the form:
   - **Icon**: Tap to select from icon grid
   - **Title**: Required (1-100 characters)
   - **Description**: Optional (max 500 characters)
   - **Due Date**: Optional (tap to open datetime picker)
3. Tap **Save**

The todo appears in the **Active** tab.

### Changing Status

**From Todo Card**:
- Tap the checkmark icon → Mark as complete
- Tap the X icon → Mark as inactive (terlewat)
- Long press → Show status menu with all options

**All Status Transitions**:
- Active → Complete
- Active → Inactive
- Complete → Active (reactivate)
- Complete → Inactive
- Inactive → Active (reactivate)
- Inactive → Complete

### Editing a Todo

1. Tap on a todo card
2. Edit any field (icon, title, description, due date)
3. Tap **Save**

Changes apply immediately.

### Deleting a Todo

1. Tap on a todo card
2. Tap the **Delete** button (red, at bottom of form)
3. Confirm deletion

Deletion is permanent (no undo).

## Testing with API Routes

### View API Endpoint

API routes are accessible at:
- **Local**: `http://localhost:8081/api/todos`
- **Web**: `/api/todos` (relative to app root)

### Test with curl

**List all todos**:
```bash
curl -H "Authorization: Bearer YOUR_CLERK_TOKEN" \
  http://localhost:8081/api/todos
```

**Create a todo**:
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_CLERK_TOKEN" \
  -d '{"title":"Test todo","icon":"CheckSquare"}' \
  http://localhost:8081/api/todos
```

**Change status**:
```bash
curl -X PATCH \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_CLERK_TOKEN" \
  -d '{"status":"complete"}' \
  http://localhost:8081/api/todos/TODO_ID/status
```

**Delete a todo**:
```bash
curl -X DELETE \
  -H "Authorization: Bearer YOUR_CLERK_TOKEN" \
  http://localhost:8081/api/todos/TODO_ID
```

> **Note**: Replace `YOUR_CLERK_TOKEN` with actual token from Clerk SDK. In the app, this is handled automatically.

### Dummy Data

The API uses in-memory storage with sample data:
- On first access, each user gets 3-5 sample todos
- Data persists during app session only
- Restarting the app resets to sample data

## Maestro Testing

### Install Maestro

```bash
curl -Ls "https://get.maestro.mobile.dev" | bash
```

### Run Tests

**All tests**:
```bash
maestro test .maestro/flows
```

**Single test flow**:
```bash
maestro test .maestro/flows/todos/create-todo.yaml
```

**Smoke tests only** (fast, critical paths):
```bash
maestro test .maestro/flows --includeTags smokeTest
```

**Feature-specific tests**:
```bash
maestro test .maestro/flows --includeTags todos
```

**Test flows included**:
1. **todos/create-todo.yaml** - Create new todo with all fields (smokeTest)
2. **todos/change-status-complete.yaml** - Mark active todo as complete (smokeTest)
3. **todos/change-status-inactive.yaml** - Mark active todo as inactive
4. **todos/reactivate-from-complete.yaml** - Reactivate completed todo
5. **todos/reactivate-from-inactive.yaml** - Reactivate inactive todo
6. **todos/edit-todo.yaml** - Edit existing todo
7. **todos/delete-todo.yaml** - Delete existing todo
8. **common/setup-auth.yaml** - Reusable auth setup (NOT executed as test)

### Test Flow Examples

**Create Todo Test** (`.maestro/flows/todos/create-todo.yaml`):
1. Run common auth setup (runFlow: ../common/setup-auth.yaml)
2. Navigate to Active tab
3. Tap create button
4. Fill form (icon, title, description, due date)
5. Submit form
6. Verify todo appears in Active tab

**Change Status Test** (`.maestro/flows/todos/change-status-complete.yaml`):
1. Run common auth setup
2. Create a todo (inline or via subflow)
3. Mark as complete
4. Verify todo moves to Complete tab

**Reactivate Test** (`.maestro/flows/todos/reactivate-from-inactive.yaml`):
1. Run common auth setup
2. Create an inactive todo
3. Long press to show status menu
4. Select "Active"
5. Verify todo moves to Active tab

## Project Structure

```text
app/
├── (tabs)/
│   ├── _layout.tsx        # Tab configuration
│   ├── active.tsx         # Active todos screen
│   ├── inactive.tsx       # Inactive/terlewat screen
│   └── complete.tsx       # Complete todos screen
├── todo/
│   ├── new.tsx            # Create todo modal
│   └── [id].tsx           # Edit todo screen
└── api/todos/
    ├── index+api.ts       # GET /api/todos, POST /api/todos
    ├── [id]+api.ts        # GET/PUT/DELETE /api/todos/:id
    └── [id]/status+api.ts # PATCH /api/todos/:id/status

components/todo/
├── todo-list.tsx          # List component
├── todo-card.tsx          # Individual todo card
├── todo-form.tsx          # Form with all fields
├── icon-picker.tsx        # Icon selection grid
├── datetime-picker.tsx    # Datetime picker wrapper
└── empty-state.tsx        # Empty state UI

lib/types/
└── todo.ts                # TypeScript interfaces

.maestro/
├── flows/
│   ├── todos/                       # Feature-based test organization
│   │   ├── create-todo.yaml         # Create todo test (smokeTest)
│   │   ├── change-status-complete.yaml
│   │   ├── change-status-inactive.yaml
│   │   ├── reactivate-from-complete.yaml
│   │   ├── reactivate-from-inactive.yaml
│   │   ├── edit-todo.yaml
│   │   └── delete-todo.yaml
│   └── common/                      # Reusable utility flows (NOT executed)
│       └── setup-auth.yaml          # Clerk auth setup
└── config.yaml                      # Test suite config (tags, exclusions)
```

## Common Tasks

### Add a New Icon Option

1. Edit `lib/types/todo.ts`
2. Add icon name to `TODO_ICON_OPTIONS` array
3. Icon will automatically appear in icon picker

### Change Default Icon

1. Edit `components/todo/todo-form.tsx`
2. Update `useState` initial value for icon
3. Or update in `lib/types/todo.ts` interface default

### Modify Sample Data

1. Edit `app/api/todos/index+api.ts`
2. Find `getTodosForUser` function
3. Modify sample todos array

### Change Tab Order

1. Edit `app/(tabs)/_layout.tsx`
2. Reorder `<Tabs.Screen>` components
3. Tabs render in file order

## Troubleshooting

### Issue: "No todos" in all tabs

**Cause**: API route not initialized for user

**Solution**:
1. Sign out and sign back in
2. Or restart the app (`pnpm dev`)
3. Sample data will reinitialize

### Issue: DateTime picker not showing

**Platform**: Web

**Cause**: Web uses HTML5 input, may not be supported in all browsers

**Solution**:
1. Use Chrome/Safari/Firefox (modern versions)
2. Or test on mobile (iOS/Android) where native picker is used

### Issue: Icons not rendering

**Cause**: Icon name not in `TODO_ICON_OPTIONS`

**Solution**:
1. Check `lib/types/todo.ts` for valid icon names
2. Or add new icon to `TODO_ICON_OPTIONS`

### Issue: Status change not persisting

**Cause**: In-memory storage resets on app restart

**Expected Behavior**: This is intentional for dummy data phase

**Future Enhancement**: Replace with AsyncStorage or database

## Performance Tips

1. **Many Todos**: Performance tested up to 100 todos per status (per success criteria)
2. **List Virtualization**: If > 100 todos, consider `FlashList` instead of `ScrollView`
3. **API Caching**: Consider React Query for optimistic updates (future enhancement)

## Next Steps

After testing the feature:

1. **Review Code**: Check components follow project conventions
2. **Run Linter**: `pnpm lint` (Biome)
3. **Format Code**: `pnpm format` (Biome)
4. **Run Maestro Tests**: Ensure all tests pass
5. **Create PR**: Use `/speckit.implement` for task tracking

## Resources

- [Expo API Routes Docs](https://docs.expo.dev/router/reference/api-routes/)
- [Expo Router Tabs](https://docs.expo.dev/router/advanced/tabs/)
- [React Native DateTime Picker](https://github.com/react-native-datetimepicker/datetimepicker)
- [Lucide Icons](https://lucide.dev/icons/)
- [Maestro Documentation](https://maestro.mobile.dev/)

## Getting Help

**Issue**: Feature not working as expected

**Steps**:
1. Check console for error messages
2. Verify Clerk authentication is working
3. Test API routes with curl
4. Check Maestro test results

**Contact**: Refer to project CLAUDE.md for development guidelines

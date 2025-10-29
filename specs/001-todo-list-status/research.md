# Research: Todo List Technology Decisions

**Feature**: Todo List with Status Management
**Date**: 2025-10-26 (Updated: 2025-10-29)
**Purpose**: Resolve technical unknowns and document technology choices

> **Update Note (2025-10-29)**: Updated Section 5 (Form State Management) to reflect constitutional requirement for React Hook Form + Zod v4 (Principle VIII). Added Section 6 (Error Handling) documenting Sonner Native usage. Updated dependencies status to confirm all packages are pre-installed.

## 1. Backend: Convex for Real-Time Data Sync

### Decision: Convex with Clerk Authentication

**Chosen Approach**:
- Convex for backend database and real-time queries/mutations
- Clerk integration for authentication and userId isolation
- TypeScript-first schema definition in `convex/schema.ts`
- Real-time reactivity via `useQuery` and `useMutation` hooks
- Automatic data sync across devices and sessions

**Implementation Pattern**:
```typescript
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  todos: defineTable({
    userId: v.string(), // From Clerk identity.subject
    title: v.string(),
    description: v.string(),
    icon: v.string(),
    status: v.union(v.literal("active"), v.literal("inactive"), v.literal("complete")),
    dueDate: v.string(), // ISO 8601
    createdAt: v.string(),
    updatedAt: v.string(),
  }).index("by_user", ["userId"]),
});

// convex/todos.ts
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    return await ctx.db
      .query("todos")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .collect();
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    icon: v.string(),
    dueDate: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const now = new Date().toISOString();
    return await ctx.db.insert("todos", {
      userId: identity.subject,
      title: args.title,
      description: args.description,
      icon: args.icon,
      status: "active",
      dueDate: args.dueDate,
      createdAt: now,
      updatedAt: now,
    });
  },
});
```

**Rationale**:
- **Real-time sync**: Convex automatically syncs data across all clients
- **Offline-first**: Built-in optimistic updates and offline support
- **Type-safe**: Full TypeScript support from schema to queries
- **Clerk integration**: Native support for Clerk authentication with `ctx.auth.getUserIdentity()`
- **Scalability**: Managed backend eliminates need for manual API routes
- **Cross-platform**: Works identically on iOS, Android, and Web

**Alternatives Considered**:
- ❌ **Expo API Routes + AsyncStorage**: Limited to single device, no real-time sync
- ❌ **Firebase**: More complex setup, less TypeScript support
- ❌ **Supabase**: Requires PostgreSQL knowledge, more boilerplate
- ✅ **Convex**: Perfect fit for React Native with real-time requirements

**Required Configuration**:
1. Install Convex: `npm install convex`
2. Initialize: `npx convex dev`
3. Create Clerk JWT template named "convex"
4. Configure `convex/auth.config.ts` with Clerk issuer domain
5. Wrap app with `ConvexProviderWithClerk`

**References**:
- [Convex React Native Quickstart](https://docs.convex.dev/quickstart/react-native)
- [Convex + Clerk Auth](https://docs.convex.dev/auth/clerk)
- [Expo App with Clerk & Convex](https://stack.convex.dev/user-authentication-with-clerk-and-convex)

---

## 2. Tab Navigation with Expo Router

### Decision: (tabs) Layout Group with Lucide Icons

**Chosen Approach**:
- Create `app/(tabs)/_layout.tsx` with `<Tabs>` component
- Three tabs: Active, Inactive (Terlewat), Complete
- Tab bar icons from `lucide-react-native` (already installed)
- Badge counts showing todo count per status
- Bottom tab bar on mobile, top tabs on web (via responsive design)

**Implementation Pattern**:
```typescript
// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { ListTodo, XCircle, CheckCircle } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="active"
        options={{
          title: 'Active',
          tabBarIcon: ({ color }) => <ListTodo color={color} />
        }}
      />
      {/* ... */}
    </Tabs>
  );
}
```

**Rationale**:
- File-based routing with `(tabs)` group follows Expo Router conventions
- Lucide icons already in project dependencies (consistency)
- Tab navigation is intuitive for status-based organization
- Badge counts provide at-a-glance information

**Alternatives Considered**:
- ❌ **Drawer Navigation**: Not suitable for 3 equal-priority sections
- ❌ **Stack Navigation**: Requires too many taps to switch between statuses
- ❌ **Custom Tab Bar**: Reinventing wheel, React Native Reusables doesn't provide tabs

**References**:
- [Expo Router Tabs](https://docs.expo.dev/router/advanced/tabs/)
- [Lucide React Native Icons](https://lucide.dev/guide/packages/lucide-react-native)

---

## 3. DateTime Picker Integration

### Decision: @react-native-community/datetimepicker with Platform Handling

**Chosen Approach**:
- Install `@react-native-community/datetimepicker`
- Wrap in custom `DateTimePicker` component for cross-platform consistency
- iOS: Native modal picker
- Android: Native dialog picker
- Web: HTML5 datetime-local input fallback
- Store as ISO 8601 string in todo data

**Implementation Pattern**:
```typescript
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform } from 'react-native';

// components/todo/datetime-picker.tsx
export function DateTimePicker({ value, onChange }) {
  if (Platform.OS === 'web') {
    return <input type="datetime-local" />;
  }

  return (
    <DateTimePicker
      value={value}
      mode="datetime"
      onChange={onChange}
    />
  );
}
```

**Rationale**:
- Official React Native Community package with good platform support
- Native UX on iOS/Android (familiar to users)
- Degrades gracefully on web with HTML5 input
- ISO 8601 format is standard and sortable

**Alternatives Considered**:
- ❌ **react-native-modal-datetime-picker**: Extra wrapper, not needed
- ❌ **Custom date picker**: Time-consuming, poor UX vs native
- ❌ **Expo DateTimePicker**: Deprecated in favor of community package

**Dependencies to Add**:
```bash
npx expo install @react-native-community/datetimepicker
```

**References**:
- [@react-native-community/datetimepicker](https://github.com/react-native-datetimepicker/datetimepicker)
- [Platform-Specific Code](https://reactnative.dev/docs/platform-specific-code)

---

## 4. Icon Selection Component

### Decision: Grid Picker with Lucide Icons

**Chosen Approach**:
- Create `IconPicker` component with scrollable grid
- Curate list of ~30 relevant icons (CheckSquare, Calendar, Bell, etc.)
- Store icon name as string in todo data
- Render icon dynamically using lucide-react-native

**Implementation Pattern**:
```typescript
// components/todo/icon-picker.tsx
import * as Icons from 'lucide-react-native';

const ICON_OPTIONS = ['CheckSquare', 'Calendar', 'Bell', 'Star', ...];

export function IconPicker({ selected, onSelect }) {
  return (
    <ScrollView horizontal>
      {ICON_OPTIONS.map(iconName => {
        const IconComponent = Icons[iconName];
        return (
          <Pressable onPress={() => onSelect(iconName)}>
            <IconComponent color={selected === iconName ? 'primary' : 'muted'} />
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
```

**Rationale**:
- Lucide provides 1000+ icons (already in project)
- Grid layout allows quick visual scanning
- Storing icon name (string) keeps data model simple
- Dynamic rendering keeps bundle size small

**Alternatives Considered**:
- ❌ **Emoji Picker**: Platform-inconsistent rendering
- ❌ **Image Upload**: Overkill, increases complexity
- ❌ **Expo Icons**: Limited selection compared to Lucide

**Icon Curation Strategy**:
- Productivity: CheckSquare, Clipboard, ListTodo
- Time: Calendar, Clock, Timer
- Priority: Star, Flag, AlertCircle
- Categories: Home, Briefcase, ShoppingCart, Heart
- Actions: Play, Pause, Repeat, CheckCircle

**References**:
- [Lucide Icon List](https://lucide.dev/icons/)

---

## 5. Form State Management

### Decision: React Hook Form + Zod v4 (Constitutional Requirement)

**Chosen Approach**:
- React Hook Form for performant form state management
- Zod v4 for schema-based validation with TypeScript inference
- `zodResolver` from `@hookform/resolvers/zod` for integration
- `Controller` component for React Native input wrapping
- Real-time validation feedback on field changes
- Inline error message display

**Implementation Pattern**:
```typescript
// components/todo/todo-form.tsx
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

const todoFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .max(100, 'Title must be 100 characters or less'),
  description: z.string().max(500, 'Description must be 500 characters or less'),
  icon: z.string().min(1, 'Please select an icon'),
  dueDate: z.date().min(1, 'Due date is required'),
});

type TodoFormData = z.infer<typeof todoFormSchema>;

export function TodoForm({ onSubmit, initialData }: TodoFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TodoFormData>({
    resolver: zodResolver(todoFormSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      icon: initialData?.icon || '',
      dueDate: initialData?.dueDate || new Date(),
    },
  });

  return (
    <Controller
      control={control}
      name="title"
      render={({ field: { onChange, onBlur, value } }) => (
        <Input
          value={value}
          onChangeText={onChange}
          onBlur={onBlur}
          placeholder="Enter todo title"
        />
      )}
    />
  );
}
```

**Rationale**:
- **Constitutional Mandate**: Principle VIII requires React Hook Form + Zod v4 for all forms
- **Type Safety**: Zod schemas provide runtime validation with full TypeScript inference
- **Performance**: React Hook Form minimizes re-renders compared to useState approaches
- **Developer Experience**: No manual validation logic, error handling built-in
- **Consistency**: All forms across the app use the same validation pattern
- **Maintainability**: Schema-based validation is easier to modify and extend

**Alternatives Considered**:
- ❌ **React useState + Manual Validation**: Violates constitution, more boilerplate, error-prone
- ❌ **Formik**: Not specified in constitution, heavier than React Hook Form
- ✅ **React Hook Form + Zod v4**: Constitutional requirement, optimal solution

**Validation Rules**:
- Title: Required, 1-100 characters (trimmed)
- Description: Required, max 500 characters
- Icon: Required (must be from TODO_ICON_OPTIONS)
- Due Date: Required, must be valid date

**Dependencies Required**:
```json
{
  "react-hook-form": "^7.65.0",
  "@hookform/resolvers": "^5.2.2",
  "zod": "^4.1.12"
}
```

**References**:
- [React Hook Form Documentation](https://react-hook-form.com/)
- [Zod v4 Documentation](https://zod.dev/)
- [Constitution Principle VIII](../.specify/memory/constitution.md#viii-standardized-form-validation-react-hook-form--zod-v4)

---

## 6. Error Handling & Toast Notifications

### Decision: Sonner Native (Already Installed)

**Chosen Approach**:
- Sonner Native for cross-platform toast notifications
- Error toasts for API failures (create/update/delete operations)
- Non-blocking notifications at bottom-center with close button
- Preserve user input in forms after errors (no data loss)
- Provide retry mechanisms for failed operations

**Implementation Pattern**:
```typescript
import { toast } from 'sonner-native';

// In todo form component
async function handleCreateTodo(data: TodoFormData) {
  try {
    await createTodo({
      title: data.title,
      description: data.description,
      icon: data.icon,
      dueDate: data.dueDate.toISOString(),
    });
    toast.success('Todo created successfully!');
    router.back();
  } catch (error) {
    toast.error('Failed to create todo. Please try again.', {
      description: error instanceof Error ? error.message : 'Unknown error',
      action: {
        label: 'Retry',
        onClick: () => handleCreateTodo(data),
      },
    });
    // Form data is preserved automatically by React Hook Form
  }
}
```

**Rationale**:
- **Already Installed**: Sonner Native (v0.21.1) is in package.json, no new dependency needed
- **Cross-Platform**: Works consistently on iOS, Android, and Web
- **User-Friendly**: Non-blocking toasts don't interrupt user workflow
- **Accessibility**: Supports screen readers and keyboard navigation
- **Customizable**: Supports actions (retry buttons), descriptions, and variants
- **Configuration**: Already configured at bottom-center with close button (per CLAUDE.md)

**Alternatives Considered**:
- ❌ **React Native Toast Message**: Additional dependency, similar functionality
- ❌ **Custom Modal**: Blocking UI, worse UX than toasts
- ❌ **Alert API**: Platform-inconsistent, blocks user interaction
- ✅ **Sonner Native**: Already installed, optimal UX

**Error Handling Strategy**:
- **API Failures**: Show error toast with retry button, preserve form data
- **Network Failures**: Same handling as API failures
- **Validation Errors**: Inline form validation (React Hook Form), no toast needed
- **Success Feedback**: Success toast on create/update/delete operations
- **Loading States**: Button disabled with loading text during async operations

**Toast Types**:
- `toast.success()` - Todo created/updated/deleted successfully
- `toast.error()` - API/network failures with retry action
- `toast.info()` - Informational messages (optional)

**Implementation Notes**:
- Toasts appear at bottom-center (configured in app layout)
- Close button available on all toasts
- Toasts auto-dismiss after timeout (configurable)
- Multiple toasts stack vertically
- No need to manually clear toasts (auto-managed)

**References**:
- [Sonner Native Documentation](https://gqty.dev/sonner-native)
- [Toast Notification Best Practices](https://www.nngroup.com/articles/toast-notification/)

---

## 7. Data Initialization & Sample Data

### Decision: Convex Functions with Seeding Logic

**Chosen Approach**:
- Convex handles all data persistence automatically
- Sample data initialized on first user access
- No need for manual storage management
- Data syncs across devices via Convex cloud

**Implementation Pattern**:
```typescript
// convex/todos.ts
export const initializeSampleData = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    // Check if user already has todos
    const existing = await ctx.db
      .query("todos")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .first();

    if (existing) return; // Already initialized

    // Create sample todos
    const now = new Date().toISOString();
    const tomorrow = new Date(Date.now() + 86400000).toISOString();

    await ctx.db.insert("todos", {
      userId: identity.subject,
      title: "Welcome to Todo List!",
      description: "This is your first todo",
      icon: "CheckSquare",
      status: "active",
      dueDate: tomorrow,
      createdAt: now,
      updatedAt: now,
    });

    // Add more sample todos...
  },
});
```

**Rationale**:
- No manual storage code required
- Real-time sync across all user devices
- Built-in persistence (survives logout/login)
- Convex manages data lifecycle automatically

**Sample Data Strategy**:
- 3-5 sample todos per user on first access
- Mix of all three statuses (Active, Inactive, Complete)
- Variety of icons, dates, and content lengths
- Demonstrates all features

**References**:
- [Convex Mutations](https://docs.convex.dev/database/writing-data)
- [Convex Authentication](https://docs.convex.dev/auth/clerk)

---

## Summary of Technology Stack

| Component | Technology | Rationale |
|-----------|-----------|-----------|
| **Backend** | Convex + Clerk Auth | Real-time sync, managed infrastructure, TypeScript-first |
| **Database** | Convex Cloud | Automatic persistence, cross-device sync, queries/mutations |
| **Navigation** | Expo Router Tabs | File-based, cross-platform, intuitive |
| **DateTime Picker** | @react-native-community/datetimepicker | Platform-native, official package |
| **Icons** | lucide-react-native | Already installed, large selection |
| **Form State** | React Hook Form + Zod v4 | Constitutional requirement, type-safe validation |
| **Error Handling** | Sonner Native | Already installed, cross-platform toasts |
| **Data Fetching** | useQuery, useMutation (Convex hooks) | Real-time reactivity, optimistic updates |
| **UI Components** | React Native Reusables + NativeWind | Existing project standards |
| **Type Safety** | TypeScript strict mode | Project requirement |
| **Testing** | Maestro | Project constitution requirement |

---

## Dependencies Status

All required dependencies are already installed in the project:

**Already Installed**:
- ✅ `convex` (^1.28.0) - Backend database + real-time sync
- ✅ `@react-native-community/datetimepicker` (8.4.4) - Platform-native datetime picker
- ✅ `react-hook-form` (^7.65.0) - Form state management
- ✅ `@hookform/resolvers` (^5.2.2) - Zod integration for React Hook Form
- ✅ `zod` (^4.1.12) - Schema-based validation
- ✅ `sonner-native` (^0.21.1) - Toast notifications for error handling
- ✅ `lucide-react-native` (^0.545.0) - Icon library
- ✅ `expo-router` (^6.0.10) - File-based routing with tabs

**No additional dependencies required** - all technologies leverage existing project packages.

---

## Implementation Order

Based on research findings, recommended implementation sequence:

1. **Convex Setup** (initialize project, configure Clerk JWT template, create auth.config.ts)
2. **Convex Schema** (`convex/schema.ts` with todos table)
3. **Convex Functions** (`convex/todos.ts` with queries/mutations)
4. **Provider Setup** (wrap app with ConvexProviderWithClerk)
5. **Data Model & Types** (`lib/types/todo.ts` matching Convex schema)
6. **Tab Navigation** (layout and empty screens)
7. **Todo List Components** (display todos with useQuery)
8. **Icon Picker** (reusable component)
9. **DateTime Picker** (platform wrapper)
10. **Todo Form** (creation/editing with useMutation)
11. **Maestro Tests** (end-to-end flows)

This order minimizes rework and allows incremental testing with real-time data sync.

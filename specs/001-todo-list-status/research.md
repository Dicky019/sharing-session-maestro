# Research: Todo List Technology Decisions

**Feature**: Todo List with Status Management
**Date**: 2025-10-26
**Purpose**: Resolve technical unknowns and document technology choices

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

### Decision: React useState with Validation Helper

**Chosen Approach**:
- Local component state using React `useState`
- Custom `useTodoForm` hook for form logic
- Validation on submit (not on change for better UX)
- Error state managed separately per field
- Optimistic UI updates (submit first, then API)

**Implementation Pattern**:
```typescript
// components/todo/todo-form.tsx
function useTodoForm(initialData?) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [icon, setIcon] = useState(initialData?.icon || 'CheckSquare');
  const [dueDate, setDueDate] = useState(initialData?.dueDate || new Date());
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (title.length > 100) newErrors.title = 'Title too long';
    return newErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return false;
    }
    // API submission logic
    return true;
  };

  return { title, setTitle, description, setDescription, icon, setIcon, dueDate, setDueDate, errors, handleSubmit };
}
```

**Rationale**:
- Simple state management for form-only data
- No need for global state (todos fetched from API)
- Validation-on-submit provides better UX than validation-on-change
- Custom hook makes logic reusable and testable

**Alternatives Considered**:
- ❌ **React Hook Form**: Overkill for 4 fields
- ❌ **Formik**: Heavy dependency for simple form
- ❌ **Zustand/Redux**: Global state not needed for form

**Validation Rules**:
- Title: Required, 1-100 characters
- Description: Optional, max 500 characters
- Icon: Required (default provided)
- Due Date: Optional, must be future date (warning only)

**References**:
- [React useState Hook](https://react.dev/reference/react/useState)
- [Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)

---

## 6. Data Initialization & Sample Data

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
| **Form State** | React useState + custom hook | Simple, no extra dependencies |
| **Data Fetching** | useQuery, useMutation (Convex hooks) | Real-time reactivity, optimistic updates |
| **UI Components** | React Native Reusables + NativeWind | Existing project standards |
| **Type Safety** | TypeScript strict mode | Project requirement |
| **Testing** | Maestro | Project constitution requirement |

---

## New Dependencies Required

```bash
# Convex backend (database + real-time sync)
npm install convex

# DateTime picker
npx expo install @react-native-community/datetimepicker
```

All other technologies leverage existing project dependencies.

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

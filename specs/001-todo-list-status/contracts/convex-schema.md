# Convex Schema & Functions Contract

**Feature**: Todo List with Status Management
**Backend**: Convex Cloud Database
**Authentication**: Clerk (via JWT)

## Database Schema

### Table: `todos`

```typescript
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  todos: defineTable({
    userId: v.string(),        // Clerk identity.subject
    title: v.string(),          // Required, 1-100 characters
    description: v.string(),    // Required, max 500 characters
    icon: v.string(),           // Required, must be from TODO_ICON_OPTIONS
    status: v.union(
      v.literal("active"),
      v.literal("inactive"),
      v.literal("complete")
    ),
    dueDate: v.string(),        // Required, ISO 8601 datetime
    createdAt: v.string(),      // ISO 8601 timestamp
    updatedAt: v.string(),      // ISO 8601 timestamp
  })
    .index("by_user", ["userId"])
    .index("by_user_and_status", ["userId", "status"]),
});
```

### Indexes

- **by_user**: Query all todos for a specific user
- **by_user_and_status**: Query todos filtered by user and status (for tab filtering)

---

## Query Functions

### `list`

**Purpose**: Get all todos for the authenticated user

**Arguments**: None

**Returns**: `Array<Todo>`

**Authentication**: Required (returns Unauthenticated error if not logged in)

**Implementation**:
```typescript
export const list = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    return await ctx.db
      .query("todos")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .order("desc") // Newest first
      .collect();
  },
});
```

**Usage**:
```typescript
const todos = useQuery(api.todos.list);
```

---

### `listByStatus`

**Purpose**: Get todos for a specific status tab

**Arguments**:
- `status`: `"active" | "inactive" | "complete"`

**Returns**: `Array<Todo>`

**Authentication**: Required

**Implementation**:
```typescript
export const listByStatus = query({
  args: { status: v.union(v.literal("active"), v.literal("inactive"), v.literal("complete")) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    return await ctx.db
      .query("todos")
      .withIndex("by_user_and_status", (q) =>
        q.eq("userId", identity.subject).eq("status", args.status)
      )
      .order("desc")
      .collect();
  },
});
```

**Usage**:
```typescript
const activeTodos = useQuery(api.todos.listByStatus, { status: "active" });
```

---

### `get`

**Purpose**: Get a single todo by ID

**Arguments**:
- `id`: Convex document ID

**Returns**: `Todo | null`

**Authentication**: Required

**Authorization**: Only returns the todo if it belongs to the authenticated user

**Implementation**:
```typescript
export const get = query({
  args: { id: v.id("todos") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const todo = await ctx.db.get(args.id);
    if (!todo || todo.userId !== identity.subject) {
      return null;
    }

    return todo;
  },
});
```

**Usage**:
```typescript
const todo = useQuery(api.todos.get, { id: todoId });
```

---

## Mutation Functions

### `create`

**Purpose**: Create a new todo with all required fields

**Arguments**:
```typescript
{
  title: string;        // Required, 1-100 characters
  description: string;  // Required, max 500 characters
  icon: string;         // Required, from TODO_ICON_OPTIONS
  dueDate: string;      // Required, ISO 8601 datetime
}
```

**Returns**: Convex document ID of created todo

**Authentication**: Required

**Validation**:
- Title: 1-100 characters, non-empty after trim
- Description: 1-500 characters, non-empty
- Icon: Must be in predefined list
- DueDate: Valid ISO 8601 string

**Implementation**:
```typescript
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

    // Validation
    if (args.title.trim().length === 0 || args.title.length > 100) {
      throw new Error("Title must be 1-100 characters");
    }
    if (args.description.trim().length === 0 || args.description.length > 500) {
      throw new Error("Description must be 1-500 characters");
    }
    // Icon validation...
    // DueDate validation...

    const now = new Date().toISOString();

    return await ctx.db.insert("todos", {
      userId: identity.subject,
      title: args.title.trim(),
      description: args.description,
      icon: args.icon,
      status: "active", // Default status
      dueDate: args.dueDate,
      createdAt: now,
      updatedAt: now,
    });
  },
});
```

**Usage**:
```typescript
const createTodo = useMutation(api.todos.create);
const todoId = await createTodo({
  title: "Buy groceries",
  description: "Milk, eggs, bread",
  icon: "ShoppingCart",
  dueDate: "2025-10-27T18:00:00Z",
});
```

---

### `update`

**Purpose**: Update an existing todo's fields (except status)

**Arguments**:
```typescript
{
  id: Id<"todos">;
  title?: string;
  description?: string;
  icon?: string;
  dueDate?: string;
}
```

**Returns**: `void`

**Authentication**: Required

**Authorization**: Only the owner can update their todos

**Implementation**:
```typescript
export const update = mutation({
  args: {
    id: v.id("todos"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    icon: v.optional(v.string()),
    dueDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const todo = await ctx.db.get(args.id);
    if (!todo || todo.userId !== identity.subject) {
      throw new Error("Todo not found or unauthorized");
    }

    const updates: any = { updatedAt: new Date().toISOString() };
    if (args.title !== undefined) updates.title = args.title.trim();
    if (args.description !== undefined) updates.description = args.description;
    if (args.icon !== undefined) updates.icon = args.icon;
    if (args.dueDate !== undefined) updates.dueDate = args.dueDate;

    await ctx.db.patch(args.id, updates);
  },
});
```

**Usage**:
```typescript
const updateTodo = useMutation(api.todos.update);
await updateTodo({
  id: todoId,
  title: "Updated title",
  description: "Updated description",
});
```

---

### `changeStatus`

**Purpose**: Change a todo's status (Active/Inactive/Complete)

**Arguments**:
```typescript
{
  id: Id<"todos">;
  status: "active" | "inactive" | "complete";
}
```

**Returns**: `void`

**Authentication**: Required

**Authorization**: Only the owner can change status

**Implementation**:
```typescript
export const changeStatus = mutation({
  args: {
    id: v.id("todos"),
    status: v.union(v.literal("active"), v.literal("inactive"), v.literal("complete")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const todo = await ctx.db.get(args.id);
    if (!todo || todo.userId !== identity.subject) {
      throw new Error("Todo not found or unauthorized");
    }

    await ctx.db.patch(args.id, {
      status: args.status,
      updatedAt: new Date().toISOString(),
    });
  },
});
```

**Usage**:
```typescript
const changeStatus = useMutation(api.todos.changeStatus);
await changeStatus({ id: todoId, status: "complete" });
```

---

### `remove`

**Purpose**: Delete a todo permanently

**Arguments**:
```typescript
{
  id: Id<"todos">;
}
```

**Returns**: `void`

**Authentication**: Required

**Authorization**: Only the owner can delete their todos

**Implementation**:
```typescript
export const remove = mutation({
  args: { id: v.id("todos") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const todo = await ctx.db.get(args.id);
    if (!todo || todo.userId !== identity.subject) {
      throw new Error("Todo not found or unauthorized");
    }

    await ctx.db.delete(args.id);
  },
});
```

**Usage**:
```typescript
const removeTodo = useMutation(api.todos.remove);
await removeTodo({ id: todoId });
```

---

## Authentication Configuration

### `convex/auth.config.ts`

```typescript
import { AuthConfig } from "convex/server";

export default {
  providers: [
    {
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN!,
      applicationID: "convex",
    },
  ],
} satisfies AuthConfig;
```

### Environment Variables

**Backend** (Convex):
- `CLERK_JWT_ISSUER_DOMAIN`: Clerk issuer URL (e.g., `https://verb-noun-00.clerk.accounts.dev`)

**Frontend** (Expo):
- `EXPO_PUBLIC_CONVEX_URL`: Convex deployment URL (from `npx convex dev`)
- `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`: Clerk publishable key

---

## Client Setup

### Root Layout Provider

```typescript
// app/_layout.tsx
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {/* App screens */}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
```

---

## Error Handling

### Common Errors

- **"Unauthenticated"**: User not logged in via Clerk
- **"Todo not found or unauthorized"**: Todo doesn't exist or doesn't belong to user
- **Validation errors**: Field validation failed (title too long, description empty, etc.)

### Client-Side Error Handling

```typescript
const createTodo = useMutation(api.todos.create);

try {
  await createTodo({ title, description, icon, dueDate });
} catch (error) {
  // Show error toast
  console.error("Failed to create todo:", error);
}
```

---

## Real-Time Updates

Convex automatically syncs data across all clients:

1. User A creates a todo → Database updated
2. Convex pushes update to all connected clients
3. User B's `useQuery(api.todos.list)` automatically re-renders with new data

**No polling, WebSockets, or manual refresh needed.**

---

## Data Lifecycle

### On Account Deletion

When a user deletes their Clerk account, implement a cleanup function:

```typescript
export const deleteUserData = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const todos = await ctx.db
      .query("todos")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .collect();

    for (const todo of todos) {
      await ctx.db.delete(todo._id);
    }
  },
});
```

This should be called from a Clerk webhook when the user account is deleted.

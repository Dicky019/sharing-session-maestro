# TypeScript Type Definitions

## Core Types

### TodoStatus

```typescript
/**
 * Todo status states
 * - inactive: Todo is paused or not started
 * - active: Todo is in progress (default for new todos)
 * - complete: Todo is finished
 */
export type TodoStatus = "inactive" | "active" | "complete";
```

---

### Todo (Convex Document)

```typescript
import { Id } from "./_generated/dataModel";

/**
 * Todo document from Convex database
 * Includes Convex system fields (_id, _creationTime)
 */
export interface Todo {
  _id: Id<"todos">;               // Convex document ID
  _creationTime: number;          // Unix timestamp (ms) when created
  userId: string;                 // Clerk user ID
  title: string;                  // 1-100 characters
  description: string;            // 1-500 characters
  icon: string;                   // Lucide icon name
  dueDate: string;                // ISO 8601 format (e.g., "2025-10-29T14:30:00.000Z")
  status: TodoStatus;             // Current status
  lastModified: number;           // Unix timestamp (ms) when last updated
}
```

---

## Form Data Types

### TodoFormData

```typescript
/**
 * Form data for creating or editing a todo
 * Used by TodoForm component and new/edit screens
 */
export interface TodoFormData {
  title: string;                  // Required, 1-100 chars
  description: string;            // Required, 1-500 chars
  icon: string;                   // Required, one of TODO_ICON_OPTIONS
  dueDate: string;                // Required, ISO 8601 format
}
```

### CreateTodoInput

```typescript
/**
 * Input for create mutation
 * Same as TodoFormData (status defaults to "active" on server)
 */
export type CreateTodoInput = TodoFormData;
```

### UpdateTodoInput

```typescript
/**
 * Input for update mutation
 * All fields are optional (partial updates)
 */
export interface UpdateTodoInput {
  title?: string;                 // Optional, 1-100 chars if provided
  description?: string;           // Optional, 1-500 chars if provided
  icon?: string;                  // Optional, one of TODO_ICON_OPTIONS if provided
  dueDate?: string;               // Optional, ISO 8601 format if provided
}
```

---

## Constants

### TODO_ICON_OPTIONS

```typescript
import {
  Briefcase,
  ShoppingCart,
  Home,
  Heart,
  BookOpen,
  Dumbbell,
  Plane,
  DollarSign,
  Users,
  Coffee,
  Music,
  Camera,
  Code,
  Palette,
  Lightbulb,
  Target,
  Calendar,
  Mail,
  Phone,
  MessageSquare,
  FileText,
  Folder,
  Settings,
  Star,
  Trophy,
  Gift,
  Zap,
} from "lucide-react-native";

/**
 * Available icon options for todos
 * Each icon has a name, component, and label
 */
export const TODO_ICON_OPTIONS = [
  { name: "Briefcase", icon: Briefcase, label: "Work" },
  { name: "ShoppingCart", icon: ShoppingCart, label: "Shopping" },
  { name: "Home", icon: Home, label: "Home" },
  { name: "Heart", icon: Heart, label: "Health" },
  { name: "BookOpen", icon: BookOpen, label: "Learning" },
  { name: "Dumbbell", icon: Dumbbell, label: "Fitness" },
  { name: "Plane", icon: Plane, label: "Travel" },
  { name: "DollarSign", icon: DollarSign, label: "Finance" },
  { name: "Users", icon: Users, label: "Social" },
  { name: "Coffee", icon: Coffee, label: "Break" },
  { name: "Music", icon: Music, label: "Music" },
  { name: "Camera", icon: Camera, label: "Photo" },
  { name: "Code", icon: Code, label: "Coding" },
  { name: "Palette", icon: Palette, label: "Creative" },
  { name: "Lightbulb", icon: Lightbulb, label: "Ideas" },
  { name: "Target", icon: Target, label: "Goals" },
  { name: "Calendar", icon: Calendar, label: "Event" },
  { name: "Mail", icon: Mail, label: "Email" },
  { name: "Phone", icon: Phone, label: "Call" },
  { name: "MessageSquare", icon: MessageSquare, label: "Message" },
  { name: "FileText", icon: FileText, label: "Document" },
  { name: "Folder", icon: Folder, label: "Project" },
  { name: "Settings", icon: Settings, label: "Settings" },
  { name: "Star", icon: Star, label: "Important" },
  { name: "Trophy", icon: Trophy, label: "Achievement" },
  { name: "Gift", icon: Gift, label: "Gift" },
  { name: "Zap", icon: Zap, label: "Quick Task" },
] as const;

/**
 * Type for valid icon names
 */
export type TodoIconName = typeof TODO_ICON_OPTIONS[number]["name"];
```

### TODO_STATUS_LABELS

```typescript
/**
 * Human-readable labels for todo statuses
 * Used in UI (badges, filters, etc.)
 */
export const TODO_STATUS_LABELS: Record<TodoStatus, string> = {
  inactive: "Inactive",
  active: "Active",
  complete: "Complete",
};
```

### TODO_STATUS_COLORS

```typescript
/**
 * Tailwind color classes for each status
 * Used in TodoCard badges and status indicators
 */
export const TODO_STATUS_COLORS: Record<TodoStatus, string> = {
  inactive: "bg-muted text-muted-foreground",           // Gray
  active: "bg-primary text-primary-foreground",         // Blue
  complete: "bg-green-500 text-white dark:bg-green-600", // Green
};
```

---

## Utility Types

### TodoFilterStatus

```typescript
/**
 * Filter options for todo list
 * Includes "all" option in addition to status values
 */
export type TodoFilterStatus = TodoStatus | "all";
```

### TodoCardProps

```typescript
/**
 * Props for TodoCard component
 */
export interface TodoCardProps {
  todo: Todo;
  onStatusChange?: (id: Id<"todos">, status: TodoStatus) => void;
  onEdit?: (id: Id<"todos">) => void;
  onDelete?: (id: Id<"todos">) => void;
}
```

### TodoFormProps

```typescript
/**
 * Props for TodoForm component
 */
export interface TodoFormProps {
  initialData?: TodoFormData;     // For edit mode
  onSubmit: (data: TodoFormData) => Promise<void>;
  submitLabel?: string;           // Default: "Create Todo" or "Update Todo"
  isSubmitting?: boolean;
}
```

---

## Validation

### Validation Constants

```typescript
/**
 * Validation constraints for todo fields
 */
export const TODO_VALIDATION = {
  TITLE_MIN_LENGTH: 1,
  TITLE_MAX_LENGTH: 100,
  DESCRIPTION_MIN_LENGTH: 1,
  DESCRIPTION_MAX_LENGTH: 500,
} as const;
```

### Validation Functions

```typescript
/**
 * Validate todo form data
 * Returns array of error messages (empty if valid)
 */
export function validateTodoFormData(data: Partial<TodoFormData>): string[] {
  const errors: string[] = [];

  if (!data.title) {
    errors.push("Title is required");
  } else if (data.title.length < TODO_VALIDATION.TITLE_MIN_LENGTH) {
    errors.push(`Title must be at least ${TODO_VALIDATION.TITLE_MIN_LENGTH} character`);
  } else if (data.title.length > TODO_VALIDATION.TITLE_MAX_LENGTH) {
    errors.push(`Title must be at most ${TODO_VALIDATION.TITLE_MAX_LENGTH} characters`);
  }

  if (!data.description) {
    errors.push("Description is required");
  } else if (data.description.length < TODO_VALIDATION.DESCRIPTION_MIN_LENGTH) {
    errors.push(`Description must be at least ${TODO_VALIDATION.DESCRIPTION_MIN_LENGTH} character`);
  } else if (data.description.length > TODO_VALIDATION.DESCRIPTION_MAX_LENGTH) {
    errors.push(`Description must be at most ${TODO_VALIDATION.DESCRIPTION_MAX_LENGTH} characters`);
  }

  if (!data.icon) {
    errors.push("Icon is required");
  }

  if (!data.dueDate) {
    errors.push("Due date is required");
  } else {
    // Validate ISO 8601 format
    const date = new Date(data.dueDate);
    if (isNaN(date.getTime())) {
      errors.push("Invalid due date format");
    }
  }

  return errors;
}

/**
 * Check if todo form data is valid
 */
export function isTodoFormDataValid(data: Partial<TodoFormData>): data is TodoFormData {
  return validateTodoFormData(data).length === 0;
}
```

---

## Date Formatting

### Date Utility Functions

```typescript
/**
 * Format ISO 8601 date string to human-readable format
 * Example: "2025-10-29T14:30:00.000Z" -> "Oct 29, 2025 2:30 PM"
 */
export function formatTodoDate(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Format ISO 8601 date string to short date
 * Example: "2025-10-29T14:30:00.000Z" -> "Oct 29, 2025"
 */
export function formatTodoDateShort(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Check if todo is overdue
 */
export function isTodoOverdue(todo: Todo): boolean {
  if (todo.status === "complete") return false;
  return new Date(todo.dueDate) < new Date();
}

/**
 * Get relative time string
 * Example: "in 2 hours", "3 days ago"
 */
export function getRelativeTimeString(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffMinutes < -60) {
    if (diffHours < -24) {
      return `${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? "s" : ""} ago`;
    }
    return `${Math.abs(diffHours)} hour${Math.abs(diffHours) !== 1 ? "s" : ""} ago`;
  } else if (diffMinutes < 0) {
    return `${Math.abs(diffMinutes)} minute${Math.abs(diffMinutes) !== 1 ? "s" : ""} ago`;
  } else if (diffMinutes < 60) {
    return `in ${diffMinutes} minute${diffMinutes !== 1 ? "s" : ""}`;
  } else if (diffHours < 24) {
    return `in ${diffHours} hour${diffHours !== 1 ? "s" : ""}`;
  } else {
    return `in ${diffDays} day${diffDays !== 1 ? "s" : ""}`;
  }
}
```

---

## Usage Examples

### Creating a Todo

```typescript
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

const createTodo = useMutation(api.todos.create);

const formData: TodoFormData = {
  title: "Complete project proposal",
  description: "Write and submit the Q1 proposal",
  icon: "Briefcase",
  dueDate: new Date("2025-10-30T17:00:00").toISOString(),
};

const todoId = await createTodo(formData);
```

### Querying Todos

```typescript
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

// Get all todos
const todos = useQuery(api.todos.list);

// Get active todos only
const activeTodos = useQuery(api.todos.listByStatus, { status: "active" });

// Get specific todo
const todo = useQuery(api.todos.get, { id: todoId });
```

### Updating a Todo

```typescript
const updateTodo = useMutation(api.todos.update);

// Partial update (only title and due date)
await updateTodo({
  id: todoId,
  title: "Updated title",
  dueDate: new Date("2025-10-31T17:00:00").toISOString(),
});
```

### Changing Status

```typescript
const changeStatus = useMutation(api.todos.changeStatus);

await changeStatus({
  id: todoId,
  status: "complete",
});
```

### Deleting a Todo

```typescript
const removeTodo = useMutation(api.todos.remove);

await removeTodo({ id: todoId });
```

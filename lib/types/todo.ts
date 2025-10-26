/**
 * Todo item with status management
 *
 * All fields are required per clarification session.
 */
export interface Todo {
  /** Convex document ID */
  _id: string;

  /** Clerk user ID (owner of todo) */
  userId: string;

  /** Todo title (required, 1-100 chars) */
  title: string;

  /** Detailed description (required, max 500 chars) */
  description: string;

  /** Icon name from lucide-react-native (required) */
  icon: string;

  /** Current status of the todo */
  status: TodoStatus;

  /** Due date/time (required, ISO 8601 string) */
  dueDate: string;

  /** Creation timestamp (ISO 8601) */
  createdAt: string;

  /** Last modification timestamp (ISO 8601) */
  updatedAt: string;
}

/**
 * Todo status enumeration
 */
export type TodoStatus = 'active' | 'inactive' | 'complete';

/**
 * Status display names (for UI)
 */
export const TODO_STATUS_LABELS: Record<TodoStatus, string> = {
  active: 'Active',
  inactive: 'Terlewat', // Indonesian for "missed" or "skipped"
  complete: 'Complete',
};

/**
 * Available icon options for todos
 */
export const TODO_ICON_OPTIONS = [
  // Productivity
  'CheckSquare',
  'Clipboard',
  'ListTodo',
  'FileText',
  // Time
  'Calendar',
  'Clock',
  'Timer',
  'AlarmClock',
  // Priority
  'Star',
  'Flag',
  'AlertCircle',
  'AlertTriangle',
  // Categories
  'Home',
  'Briefcase',
  'ShoppingCart',
  'Heart',
  'Coffee',
  // Actions
  'Play',
  'Pause',
  'Repeat',
  // 'CheckCircle',
  // 'XCircle',

  // Other
  'Lightbulb',
  'MessageCircle',
  'Phone',
  'Mail',
  'Book',
] as const;

export type TodoIcon = (typeof TODO_ICON_OPTIONS)[number];

/**
 * Convex Backend Functions for Todo Management
 *
 * Queries and mutations for CRUD operations on todos.
 * All functions require authentication via Clerk.
 */

import { v } from 'convex/values';
import { TODO_ICON_OPTIONS } from '../lib/types/todo';
import { mutation, query } from './_generated/server';

/**
 * Query: Get all todos for authenticated user
 * Ordered by createdAt descending (newest first)
 */
export const list = query({
  args: {},
  handler: async (ctx) => {
    // Require authentication
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated');
    }

    // Query todos by userId index
    const todos = await ctx.db
      .query('todos')
      .withIndex('by_user', (q) => q.eq('userId', identity.subject))
      .order('desc')
      .collect();

    return todos;
  },
});

/**
 * Query: Get todos filtered by status for authenticated user
 * Used by tab navigation to show active/inactive/complete todos
 */
export const listByStatus = query({
  args: {
    status: v.union(v.literal('active'), v.literal('inactive'), v.literal('complete')),
  },
  handler: async (ctx, args) => {
    // Require authentication
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated');
    }

    // Query todos by userId and status index
    const todos = await ctx.db
      .query('todos')
      .withIndex('by_user_and_status', (q) =>
        q.eq('userId', identity.subject).eq('status', args.status)
      )
      .order('desc')
      .collect();

    return todos;
  },
});

/**
 * Mutation: Create a new todo
 * Validates all required fields and sets default status to "active"
 */
export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    icon: v.string(),
    dueDate: v.string(), // ISO 8601 datetime string
  },
  handler: async (ctx, args) => {
    // Require authentication
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated');
    }

    // Validate title (1-100 characters, required)
    const trimmedTitle = args.title.trim();
    if (trimmedTitle.length === 0) {
      throw new Error('Title is required');
    }
    if (trimmedTitle.length > 100) {
      throw new Error('Title must be 100 characters or less');
    }

    // Validate description (required, max 500 characters)
    if (!args.description || args.description.trim().length === 0) {
      throw new Error('Description is required');
    }
    if (args.description.length > 500) {
      throw new Error('Description must be 500 characters or less');
    }

    // Validate icon (must be from TODO_ICON_OPTIONS)
    if (!args.icon) {
      throw new Error('Icon is required');
    }
    if (!TODO_ICON_OPTIONS.includes(args.icon as any)) {
      throw new Error('Invalid icon selection');
    }

    // Validate dueDate (ISO 8601 format)
    if (!args.dueDate) {
      throw new Error('Due date is required');
    }
    try {
      const date = new Date(args.dueDate);
      if (Number.isNaN(date.getTime())) {
        throw new Error('Invalid date format');
      }
    } catch {
      throw new Error('Invalid date format');
    }

    // Create todo with validated data
    const now = new Date().toISOString();
    const todoId = await ctx.db.insert('todos', {
      userId: identity.subject,
      title: trimmedTitle,
      description: args.description,
      icon: args.icon,
      status: 'active', // Default status
      dueDate: args.dueDate,
      createdAt: now,
      updatedAt: now,
    });

    return todoId;
  },
});

/**
 * Mutation: Change todo status
 * Updates a todo's status between active, inactive, and complete
 * Validates ownership before updating
 */
export const changeStatus = mutation({
  args: {
    id: v.id('todos'),
    status: v.union(v.literal('active'), v.literal('inactive'), v.literal('complete')),
  },
  handler: async (ctx, args) => {
    // Require authentication
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated');
    }

    // Get the todo and verify ownership
    const todo = await ctx.db.get(args.id);
    if (!todo) {
      throw new Error('Todo not found');
    }
    if (todo.userId !== identity.subject) {
      throw new Error('Unauthorized: You can only update your own todos');
    }

    // Update status and timestamp
    await ctx.db.patch(args.id, {
      status: args.status,
      updatedAt: new Date().toISOString(),
    });

    return { success: true };
  },
});

/**
 * Query: Get a single todo by ID
 * Used for edit screen to fetch todo details
 * Validates ownership before returning
 */
export const get = query({
  args: {
    id: v.id('todos'),
  },
  handler: async (ctx, args) => {
    // Require authentication
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated');
    }

    // Get the todo
    const todo = await ctx.db.get(args.id);
    if (!todo) {
      return null;
    }

    // Verify ownership
    if (todo.userId !== identity.subject) {
      return null; // Don't reveal existence of other users' todos
    }

    return todo;
  },
});

/**
 * Mutation: Update todo fields
 * Updates title, description, icon, and/or dueDate
 * Validates ownership and field constraints
 */
export const update = mutation({
  args: {
    id: v.id('todos'),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    icon: v.optional(v.string()),
    dueDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Require authentication
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated');
    }

    // Get the todo and verify ownership
    const todo = await ctx.db.get(args.id);
    if (!todo) {
      throw new Error('Todo not found');
    }
    if (todo.userId !== identity.subject) {
      throw new Error('Unauthorized: You can only update your own todos');
    }

    // Build update object with validation
    const updates: any = { updatedAt: new Date().toISOString() };

    if (args.title !== undefined) {
      const trimmedTitle = args.title.trim();
      if (trimmedTitle.length === 0) {
        throw new Error('Title is required');
      }
      if (trimmedTitle.length > 100) {
        throw new Error('Title must be 100 characters or less');
      }
      updates.title = trimmedTitle;
    }

    if (args.description !== undefined) {
      if (args.description.trim().length === 0) {
        throw new Error('Description is required');
      }
      if (args.description.length > 500) {
        throw new Error('Description must be 500 characters or less');
      }
      updates.description = args.description;
    }

    if (args.icon !== undefined) {
      if (!args.icon) {
        throw new Error('Icon is required');
      }
      if (!TODO_ICON_OPTIONS.includes(args.icon as any)) {
        throw new Error('Invalid icon selection');
      }
      updates.icon = args.icon;
    }

    if (args.dueDate !== undefined) {
      if (!args.dueDate) {
        throw new Error('Due date is required');
      }
      try {
        const date = new Date(args.dueDate);
        if (Number.isNaN(date.getTime())) {
          throw new Error('Invalid date format');
        }
      } catch {
        throw new Error('Invalid date format');
      }
      updates.dueDate = args.dueDate;
    }

    // Apply updates
    await ctx.db.patch(args.id, updates);

    return { success: true };
  },
});

/**
 * Mutation: Delete a todo permanently
 * Validates ownership before deleting
 */
export const remove = mutation({
  args: {
    id: v.id('todos'),
  },
  handler: async (ctx, args) => {
    // Require authentication
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated');
    }

    // Get the todo and verify ownership
    const todo = await ctx.db.get(args.id);
    if (!todo) {
      throw new Error('Todo not found');
    }
    if (todo.userId !== identity.subject) {
      throw new Error('Unauthorized: You can only delete your own todos');
    }

    // Delete the todo
    await ctx.db.delete(args.id);

    return { success: true };
  },
});

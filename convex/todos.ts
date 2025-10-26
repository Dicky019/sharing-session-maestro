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

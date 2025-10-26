/**
 * Convex Database Schema
 *
 * Feature: Todo List with Status Management
 * Defines the structure of the todos table with userId isolation.
 */

import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  todos: defineTable({
    // Clerk user ID (from identity.subject)
    userId: v.string(),

    // Todo content fields (all required)
    title: v.string(), // Required, 1-100 characters
    description: v.string(), // Required, max 500 characters
    icon: v.string(), // Required, must be from TODO_ICON_OPTIONS
    status: v.union(v.literal('active'), v.literal('inactive'), v.literal('complete')),

    // Timestamps
    dueDate: v.string(), // Required, ISO 8601 datetime
    createdAt: v.string(), // ISO 8601 timestamp
    updatedAt: v.string(), // ISO 8601 timestamp
  })
    // Index for querying all todos for a specific user
    .index('by_user', ['userId'])
    // Index for querying todos filtered by user and status (for tab navigation)
    .index('by_user_and_status', ['userId', 'status']),
});

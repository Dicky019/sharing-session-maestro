/**
 * Validation utilities for Todo form fields
 *
 * All validations based on requirements from spec.md and data-model.md
 */

import { TODO_ICON_OPTIONS } from '../types/todo';

/**
 * Validate todo title
 * @param title - Todo title to validate
 * @returns Error message if invalid, null if valid
 */
export function validateTitle(title: string): string | null {
  const trimmed = title.trim();

  if (trimmed.length === 0) {
    return 'Title is required';
  }

  if (trimmed.length > 100) {
    return 'Title must be 100 characters or less';
  }

  return null; // Valid
}

/**
 * Validate todo description
 * @param description - Todo description to validate
 * @returns Error message if invalid, null if valid
 */
export function validateDescription(description: string): string | null {
  if (!description || description.trim().length === 0) {
    return 'Description is required';
  }

  if (description.length > 500) {
    return 'Description must be 500 characters or less';
  }

  return null; // Valid
}

/**
 * Validate todo icon
 * @param icon - Icon name to validate
 * @returns Error message if invalid, null if valid
 */
export function validateIcon(icon: string): string | null {
  if (!icon) {
    return 'Icon is required';
  }

  if (!TODO_ICON_OPTIONS.includes(icon as any)) {
    return 'Invalid icon selection';
  }

  return null; // Valid
}

/**
 * Validate due date
 * @param dueDate - Due date string (ISO 8601) to validate
 * @returns Error message if invalid, null if valid (warning for past dates)
 */
export function validateDueDate(dueDate: string): string | null {
  if (!dueDate) {
    return 'Due date is required';
  }

  try {
    const date = new Date(dueDate);
    if (Number.isNaN(date.getTime())) {
      return 'Invalid date format';
    }

    // Warning only (not error) if date is in the past
    const now = new Date();
    if (date < now) {
      return 'Warning: Due date is in the past';
    }

    return null; // Valid
  } catch (_e) {
    return 'Invalid date format';
  }
}

/**
 * Validate all todo fields
 * @param fields - Todo fields to validate
 * @returns Object with field-specific error messages (empty if all valid)
 */
export function validateTodoFields(fields: {
  title: string;
  description: string;
  icon: string;
  dueDate: string;
}): Record<string, string> {
  const errors: Record<string, string> = {};

  const titleError = validateTitle(fields.title);
  if (titleError) errors.title = titleError;

  const descriptionError = validateDescription(fields.description);
  if (descriptionError) errors.description = descriptionError;

  const iconError = validateIcon(fields.icon);
  if (iconError) errors.icon = iconError;

  const dueDateError = validateDueDate(fields.dueDate);
  if (dueDateError && !dueDateError.startsWith('Warning:')) {
    // Only add errors, not warnings
    errors.dueDate = dueDateError;
  }

  return errors;
}

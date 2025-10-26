# Feature Specification: Todo List with Status Management

**Feature Branch**: `001-todo-list-status`
**Created**: 2025-10-26
**Status**: Draft
**Input**: User description: "create todo list dengan 3 status inactive (terlewat), active & complite"

## Clarifications

### Session 2025-10-26

- Q: What fields should a todo have? Spec mentions "text content" but plan shows icon, title, description, due date. → A: All fields required (title, description, icon, and due date)
- Q: How do users change a todo's status? → A: Quick action buttons + long press menu (checkmark/X buttons for common actions, long press shows full status menu)
- Q: How should the UI handle API failures (create/update/delete operations)? → A: Show error toast, keep form data, allow retry (preserve user input, non-blocking error notification)
- Q: What happens to todo data when user logs out or deletes their account? → A: Persist after logout, permanent delete on account deletion (data remains on device after logout and restored when user logs back in, all todos permanently deleted if Clerk account is deleted)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create and View Todos (Priority: P1)

Users need a way to create todo items and see them organized by status. This is the core functionality that provides immediate value - users can capture tasks and track their current state.

**Why this priority**: Without the ability to create and view todos, the feature provides no value. This is the minimum viable product.

**Independent Test**: Can be fully tested by creating several todo items and verifying they appear in the correct status category (active by default).

**Acceptance Scenarios**:

1. **Given** user is on the todo list screen, **When** user creates a new todo item with all required fields (title, description, icon, due date), **Then** the todo appears in the "Active" status section
2. **Given** user has created multiple todos, **When** user views the todo list, **Then** todos are grouped by their status (Inactive/Terlewat, Active, Complete)
3. **Given** user creates a todo with any missing required field, **When** user attempts to save, **Then** system prevents creation and shows validation message specifying which fields are required
4. **Given** user fills todo form with valid data, **When** API fails during save operation, **Then** system displays error toast, preserves all entered data in form, and shows retry button

---

### User Story 2 - Change Todo Status (Priority: P2)

Users need to move todos between different statuses as they progress through tasks. This allows users to mark tasks as complete, reactivate old tasks, or mark tasks as missed/skipped.

**Why this priority**: Status management is the key differentiator of this feature. Users need to track progress by moving items between the three states.

**Independent Test**: Can be tested independently by creating active todos and moving them to complete or inactive status, then verifying the visual organization updates correctly.

**Acceptance Scenarios**:

1. **Given** user has an active todo, **When** user taps the checkmark quick action button, **Then** the todo moves to the "Complete" section
2. **Given** user has an active todo, **When** user taps the X quick action button, **Then** the todo moves to the "Inactive" section
3. **Given** user has a complete todo, **When** user long presses and selects "Active" from the status menu, **Then** the todo moves back to the "Active" section
4. **Given** user has an inactive todo, **When** user long presses and selects "Active" from the status menu, **Then** the todo moves to the "Active" section
5. **Given** user has any todo, **When** user long presses the todo card, **Then** a status menu appears showing all three status options (Active, Inactive, Complete)

---

### User Story 3 - Edit and Delete Todos (Priority: P3)

Users need to modify or remove todos when tasks change or become irrelevant. This provides flexibility to maintain an accurate todo list.

**Why this priority**: While useful, users can work around missing edit/delete by creating new todos or leaving old ones inactive. This is a quality-of-life improvement.

**Independent Test**: Can be tested by creating todos, editing their fields (title, description, icon, due date), and deleting unwanted items to verify data persistence and list updates.

**Acceptance Scenarios**:

1. **Given** user has a todo item, **When** user edits any field (title, description, icon, or due date), **Then** the updated values are saved and displayed
2. **Given** user has a todo item, **When** user deletes it, **Then** the todo is removed from all status sections
3. **Given** user edits a todo and removes any required field, **When** user attempts to save, **Then** system shows validation error and prevents the change

---

### Edge Cases

- What happens when user has no todos in a status category? Display empty state message (e.g., "No active todos")
- What happens when user rapidly changes todo status multiple times? System should handle state updates gracefully without data loss
- What happens when user deletes the last todo in a category? Category header remains visible with empty state
- What happens to todo status when app is closed and reopened? Status must persist across sessions, even after logout
- What happens if user creates an extremely long todo text? Text should wrap or truncate appropriately in the UI
- What happens when API fails during create/update/delete operations? Display non-blocking error toast, preserve user input in form, provide retry button to attempt operation again
- What happens during network failures? Same error handling as API failures (error toast + retry), user can continue using app with existing data
- What happens when user logs out? All todo data remains on local device and is restored when the same user logs back in
- What happens when user deletes their Clerk account? All todos are permanently deleted and cannot be recovered

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow users to create new todo items with ALL required fields: title (1-100 characters), description (max 500 characters), icon (from predefined set), and due date
- **FR-002**: System MUST support three distinct status states for each todo: Inactive (terlewat/missed), Active, and Complete
- **FR-003**: System MUST display todos grouped by their current status
- **FR-004**: Users MUST be able to change a todo's status between any of the three states via:
  - Quick action buttons (checkmark icon for Complete, X icon for Inactive) visible on todo cards
  - Long press menu showing all status options (Active, Inactive, Complete) for any todo
- **FR-005**: System MUST persist all todos and their statuses across app sessions, app restarts, and user logout/login cycles
- **FR-006**: Users MUST be able to edit all fields of existing todos (title, description, icon, due date)
- **FR-007**: Users MUST be able to delete todos permanently
- **FR-008**: System MUST prevent creation or editing of todos with missing required fields (title, description, icon, or due date)
- **FR-009**: New todos MUST default to "Active" status when created
- **FR-010**: System MUST display todos within each status section in creation order (newest first)
- **FR-011**: System MUST handle API failures gracefully by:
  - Displaying non-blocking error toast notifications
  - Preserving user input in forms (do not clear on error)
  - Providing a retry mechanism for failed operations
- **FR-012**: System MUST manage data lifecycle by:
  - Persisting all todo data locally on the device after logout (data restored when user logs back in)
  - Permanently deleting all user todos when Clerk account is deleted (no recovery possible)

### Key Entities

- **Todo Item**: Represents a single task with required attributes:
  - Unique identifier (UUID)
  - Title (1-100 characters, required)
  - Description (max 500 characters, required)
  - Icon (from predefined set, required)
  - Due date (datetime, required)
  - Status (Inactive/Active/Complete)
  - Creation timestamp
  - Last modified timestamp
- **Status**: Represents one of three states - Inactive (terlewat/missed tasks), Active (current tasks), Complete (finished tasks)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can create a new todo in under 5 seconds
- **SC-002**: Users can change todo status with a single tap (via quick action buttons for Active→Complete and Active→Inactive transitions)
- **SC-003**: Users can see all todos organized by status at a glance
- **SC-004**: System maintains todo data accurately across app restarts and user logout/login cycles with 100% data retention
- **SC-005**: 95% of users successfully understand the three status categories without additional explanation
- **SC-006**: Users can manage (create, update, delete, change status) at least 100 todos without performance degradation

## Assumptions

- Todos are personal to each authenticated user (not shared between users)
- Todos do not have priorities or categories beyond the three status states
- The three status states are sufficient for user needs (no additional custom statuses needed)
- Users primarily interact with active todos; inactive and complete sections are for reference
- Local device storage is sufficient for todo persistence (no cloud sync required initially)
- Users access todos from a single device (no multi-device synchronization)

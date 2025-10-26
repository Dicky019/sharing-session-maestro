# Tasks: Todo List with Status Management

**Input**: Design documents from `/specs/001-todo-list-status/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/convex-schema.md

**Tests**: Maestro test flows are REQUIRED per constitution (Test-First Development principle)

**Organization**: Tasks grouped by user story to enable independent implementation and testing

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Mobile + Web**: `app/` (Expo Router), `convex/` (backend), `components/` (React Native)
- All paths are from repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, Convex backend setup, and basic structure

- [x] T001 Install Convex dependency: `npm install convex`
- [ ] T002 Initialize Convex project: `npx convex dev` (creates convex/ folder and deployment) - REQUIRES MANUAL SETUP
- [x] T003 [P] Install DateTimePicker: `npx expo install @react-native-community/datetimepicker`
- [ ] T004 [P] Create Clerk JWT template in Clerk Dashboard (name: "convex", save issuer URL) - REQUIRES MANUAL SETUP
- [ ] T005 Create Convex auth configuration in convex/auth.config.ts with Clerk issuer domain - DEPENDS ON T004
- [x] T006 [P] Create TypeScript interfaces in lib/types/todo.ts (Todo, TodoStatus, TODO_ICON_OPTIONS)
- [x] T007 [P] Create .maestro directory structure (.maestro/flows/todos/, .maestro/flows/common/)
- [x] T008 [P] Create .maestro/config.yaml with flow patterns and excludeTags for common utilities

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story implementation

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T009 Create Convex schema in convex/schema.ts (todos table with userId, title, description, icon, status, dueDate, createdAt, updatedAt)
- [x] T010 Add indexes to Convex schema: by_user (userId), by_user_and_status (userId, status)
- [x] T011 Update app/_layout.tsx to wrap app with ConvexProviderWithClerk
- [ ] T012 Configure environment variables: EXPO_PUBLIC_CONVEX_URL, EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY, CLERK_JWT_ISSUER_DOMAIN - REQUIRES MANUAL SETUP
- [x] T013 Create tab navigation layout in app/(tabs)/_layout.tsx with Active, Inactive (Terlewat), Complete tabs
- [x] T014 [P] Create empty tab screens: app/(tabs)/active.tsx, app/(tabs)/inactive.tsx, app/(tabs)/complete.tsx
- [x] T015 [P] Create base UI components: components/todo/empty-state.tsx (show when no todos in status)
- [x] T016 [P] Create validation helper functions in lib/utils/validation.ts (validateTitle, validateDescription, validateIcon, validateDueDate)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Create and View Todos (Priority: P1) 🎯 MVP

**Goal**: Users can create todo items with all required fields and see them organized by status

**Independent Test**: Create several todo items and verify they appear in the correct status category (active by default)

### Maestro Tests for User Story 1 (TDD - Write FIRST)

> **⚠️ RED PHASE**: Write these tests FIRST, run them, ensure they FAIL before implementation

- [x] T017 [P] [US1] Create .maestro/flows/common/setup-auth.yaml (reusable Clerk auth flow with +clerk_test email and 424242 code)
- [x] T018 [P] [US1] Write Maestro flow .maestro/flows/todos/create-todo.yaml (smokeTest tag) - test creating todo with all fields, verify in Active tab
- [x] T019 [P] [US1] Write Maestro flow .maestro/flows/todos/validate-missing-fields.yaml - test form validation for missing required fields
- [ ] T020 [US1] Run Maestro tests to confirm RED phase (all tests should FAIL): `maestro test .maestro/flows/todos/`

### Convex Backend for User Story 1

> **GREEN PHASE**: Implement Convex functions to make tests pass

- [x] T021 [P] [US1] Implement convex/todos.ts query: `list` (get all todos for authenticated user, ordered by createdAt desc)
- [x] T022 [P] [US1] Implement convex/todos.ts query: `listByStatus` (filter todos by status for tab navigation)
- [x] T023 [US1] Implement convex/todos.ts mutation: `create` (validate all fields, set userId from identity.subject, default status to "active")

### UI Components for User Story 1

> **GREEN PHASE**: Build UI components

- [x] T024 [P] [US1] Create components/todo/icon-picker.tsx (grid of icons from TODO_ICON_OPTIONS, tap to select)
- [x] T025 [P] [US1] Create components/todo/datetime-picker.tsx (platform-specific: native for iOS/Android, HTML5 input for web)
- [x] T026 [US1] Create components/todo/todo-form.tsx (form with all 4 required fields: title, description, icon, dueDate, validation on submit)
- [x] T027 [US1] Create components/todo/todo-card.tsx (display todo with icon, title, description, due date, status)
- [x] T028 [US1] Create components/todo/todo-list.tsx (render array of TodoCards, show empty state when no todos)

### Screens for User Story 1

- [x] T029 [US1] Implement app/todo/new.tsx (modal/screen with TodoForm, useMutation for create, handle errors with toast)
- [x] T030 [P] [US1] Implement app/(tabs)/active.tsx with useQuery(api.todos.listByStatus, {status: "active"})
- [x] T031 [P] [US1] Implement app/(tabs)/inactive.tsx with useQuery(api.todos.listByStatus, {status: "inactive"})
- [x] T032 [P] [US1] Implement app/(tabs)/complete.tsx with useQuery(api.todos.listByStatus, {status: "complete"})
- [x] T033 [US1] Add Create button to tab screens (floating action button or header button)

### Verification for User Story 1

> **REFACTOR PHASE**: Ensure tests pass, clean up code

- [ ] T034 [US1] Run Maestro tests to confirm GREEN phase: `maestro test .maestro/flows/todos/ --includeTags smokeTest` - REQUIRES MANUAL EXECUTION
- [ ] T035 [US1] Test error handling: disconnect network, try creating todo, verify error toast + retry button - REQUIRES MANUAL TESTING
- [x] T036 [US1] Refactor: Extract common form logic to custom hook (useTodoForm) if needed - SKIPPED (form is well-structured)
- [x] T037 [US1] Code quality: Run `pnpm lint:fix` and `pnpm format:fix`

**Checkpoint**: User Story 1 complete - users can create and view todos grouped by status

---

## Phase 4: User Story 2 - Change Todo Status (Priority: P2)

**Goal**: Users can move todos between statuses using quick action buttons and long press menu

**Independent Test**: Create active todos, move to complete/inactive, verify visual organization updates

### Maestro Tests for User Story 2 (TDD - Write FIRST)

> **⚠️ RED PHASE**: Write these tests FIRST, ensure they FAIL before implementation

- [ ] T038 [P] [US2] Write Maestro flow .maestro/flows/todos/change-status-complete.yaml (smokeTest tag) - tap checkmark button, verify todo in Complete tab
- [ ] T039 [P] [US2] Write Maestro flow .maestro/flows/todos/change-status-inactive.yaml - tap X button, verify todo in Inactive tab
- [ ] T040 [P] [US2] Write Maestro flow .maestro/flows/todos/reactivate-from-complete.yaml - long press, select Active, verify in Active tab
- [ ] T041 [P] [US2] Write Maestro flow .maestro/flows/todos/reactivate-from-inactive.yaml - long press, select Active, verify in Active tab
- [ ] T042 [P] [US2] Write Maestro flow .maestro/flows/todos/show-status-menu.yaml - long press, verify menu shows all 3 options
- [ ] T043 [US2] Run Maestro tests to confirm RED phase: `maestro test .maestro/flows/todos/ --includeTags todos`

### Convex Backend for User Story 2

> **GREEN PHASE**: Implement status change mutation

- [ ] T044 [US2] Implement convex/todos.ts mutation: `changeStatus` (validate ownership via userId, update status + updatedAt timestamp)

### UI Components for User Story 2

> **GREEN PHASE**: Add status change UI

- [ ] T045 [P] [US2] Add quick action buttons to components/todo/todo-card.tsx (checkmark icon for Complete, X icon for Inactive)
- [ ] T046 [US2] Add long press handler to components/todo/todo-card.tsx (show Popover/Menu with all 3 status options)
- [ ] T047 [US2] Connect buttons to useMutation(api.todos.changeStatus) with optimistic updates

### Verification for User Story 2

> **REFACTOR PHASE**: Ensure tests pass, clean up code

- [ ] T048 [US2] Run Maestro tests to confirm GREEN phase: `maestro test .maestro/flows/todos/`
- [ ] T049 [US2] Test rapid status changes: tap multiple buttons quickly, verify no data loss
- [ ] T050 [US2] Test offline status change: disconnect network, change status, verify optimistic update + sync when reconnected
- [ ] T051 [US2] Code quality: Run `pnpm lint:fix` and `pnpm format:fix`

**Checkpoint**: User Stories 1 AND 2 complete - users can create, view, and change todo statuses

---

## Phase 5: User Story 3 - Edit and Delete Todos (Priority: P3)

**Goal**: Users can modify or remove todos when tasks change or become irrelevant

**Independent Test**: Create todos, edit their fields, delete items, verify persistence and UI updates

### Maestro Tests for User Story 3 (TDD - Write FIRST)

> **⚠️ RED PHASE**: Write these tests FIRST, ensure they FAIL before implementation

- [ ] T052 [P] [US3] Write Maestro flow .maestro/flows/todos/edit-todo.yaml - tap todo, edit title/description/icon/dueDate, verify changes saved
- [ ] T053 [P] [US3] Write Maestro flow .maestro/flows/todos/validate-edit-empty-fields.yaml - edit todo, clear required field, verify validation error
- [ ] T054 [P] [US3] Write Maestro flow .maestro/flows/todos/delete-todo.yaml - tap todo, tap delete button, confirm, verify removed from all tabs
- [ ] T055 [US3] Run Maestro tests to confirm RED phase: `maestro test .maestro/flows/todos/`

### Convex Backend for User Story 3

> **GREEN PHASE**: Implement update and delete mutations

- [ ] T056 [P] [US3] Implement convex/todos.ts mutation: `update` (validate ownership, update provided fields, refresh updatedAt)
- [ ] T057 [P] [US3] Implement convex/todos.ts mutation: `remove` (validate ownership, delete todo permanently)
- [ ] T058 [P] [US3] Implement convex/todos.ts query: `get` (fetch single todo by ID for edit screen)

### Screens for User Story 3

> **GREEN PHASE**: Build edit screen

- [ ] T059 [US3] Create app/todo/[id].tsx (edit screen with TodoForm pre-filled, useMutation for update, delete button)
- [ ] T060 [US3] Make TodoCard tappable to navigate to edit screen (use router.push with todo ID)
- [ ] T061 [US3] Handle form errors in edit screen (preserve input on error, show retry button)
- [ ] T062 [US3] Add delete confirmation dialog (Alert or Modal, confirm before calling remove mutation)

### Verification for User Story 3

> **REFACTOR PHASE**: Ensure tests pass, clean up code

- [ ] T063 [US3] Run Maestro tests to confirm GREEN phase: `maestro test .maestro/flows/todos/`
- [ ] T064 [US3] Test editing last todo in category: verify empty state appears after deletion
- [ ] T065 [US3] Test data persistence: edit todo, close app, reopen, verify changes persist
- [ ] T066 [US3] Code quality: Run `pnpm lint:fix` and `pnpm format:fix`

**Checkpoint**: All user stories complete - full CRUD + status management functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T067 [P] Update quickstart.md to replace API routes section with Convex setup instructions
- [ ] T068 [P] Add sample data initialization: implement convex/todos.ts mutation `initializeSampleData` (check if user has todos, create 3-5 samples on first access)
- [ ] T069 [P] Performance testing: Create 100+ todos, verify UI maintains 60fps, list scrolling is smooth
- [ ] T070 [P] Add data cleanup function in convex/todos.ts: `deleteUserData` mutation (for Clerk account deletion webhook)
- [ ] T071 [P] Test cross-device sync: Create todo on device A, verify appears on device B in real-time
- [ ] T072 [P] Test logout/login persistence: Create todos, logout, login as same user, verify all todos restored
- [ ] T073 Dark mode testing: Verify all screens work in light and dark mode
- [ ] T074 Accessibility: Add accessibility labels to buttons and inputs
- [ ] T075 Run full Maestro test suite: `maestro test .maestro/flows/` (all tests should pass)
- [ ] T076 Final code quality check: `pnpm lint` and `pnpm format` (no errors)
- [ ] T077 Update CLAUDE.md if new patterns or conventions were established

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion (T001-T008) - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational (T009-T016) - Can start after Phase 2
- **User Story 2 (Phase 4)**: Depends on Foundational (T009-T016) - Can start in parallel with US1
- **User Story 3 (Phase 5)**: Depends on Foundational (T009-T016) - Can start in parallel with US1 and US2
- **Polish (Phase 6)**: Depends on completion of all user stories (T017-T066)

### User Story Dependencies

- **User Story 1 (P1)**: No dependencies on other stories - Can start after Foundational
- **User Story 2 (P2)**: No dependencies on other stories - Can start after Foundational (but benefits from US1 components)
- **User Story 3 (P3)**: No dependencies on other stories - Can start after Foundational (reuses US1 components)

**Note**: While US2 and US3 can technically start after Foundational, in practice it makes sense to complete US1 first as it provides the base components (TodoCard, TodoForm, TodoList) that US2 and US3 extend.

### TDD Workflow Within Each User Story

1. **RED**: Write Maestro tests first, run them, confirm they FAIL
2. **GREEN**: Implement Convex mutations/queries and UI to make tests PASS
3. **REFACTOR**: Clean up code while keeping tests green

### Parallel Opportunities

**Setup Phase (can run simultaneously)**:
- T002 + T003 (Convex init + DateTimePicker install)
- T004 + T005 (Clerk JWT template + auth.config.ts)
- T006 + T007 + T008 (TypeScript types + Maestro folders + config)

**Foundational Phase (can run simultaneously)**:
- T009 + T010 (Convex schema + indexes) → must complete together
- T012 (environment variables) → can run independently
- T013 + T014 (tab layout + empty screens) → can run in parallel
- T015 + T016 (empty state component + validation utils) → can run in parallel

**Within User Story 1 (after T020 RED phase)**:
- T021 + T022 + T023 (all Convex functions can be implemented in parallel)
- T024 + T025 + T026 + T027 + T028 (all UI components can be built in parallel)
- T030 + T031 + T032 (all tab screens can be implemented in parallel)

**Within User Story 2 (after T043 RED phase)**:
- T045 + T046 (quick actions + long press can be added in parallel)

**Within User Story 3 (after T055 RED phase)**:
- T056 + T057 + T058 (all Convex mutations can be implemented in parallel)

**Polish Phase (most tasks can run in parallel)**:
- T067, T068, T069, T070, T071, T072, T073, T074 can all run in parallel

---

## Parallel Example: User Story 1 (After RED Phase)

```bash
# After T020 (tests written and failing), these tasks can run in parallel:

# Terminal 1 - Backend engineer
npx convex dev  # Keep running
# Implement T021, T022, T023 in convex/todos.ts

# Terminal 2 - Frontend engineer A
# Implement T024 (icon-picker.tsx) and T025 (datetime-picker.tsx)

# Terminal 3 - Frontend engineer B
# Implement T026 (todo-form.tsx) and T027 (todo-card.tsx)

# Terminal 4 - Frontend engineer C
# Implement T030, T031, T032 (all tab screens)

# After all parallel tasks complete, sequential integration:
# T029 (create todo screen)
# T033 (add create button)
# T034 (run tests - should now PASS)
```

---

## Implementation Strategy

### MVP Scope (Immediate Value)

**Phase 1 + Phase 2 + Phase 3** = User Story 1 Complete
- Tasks T001 through T037
- Delivers: Create and view todos organized by status
- Total tasks: 37
- Estimated effort: 1-2 weeks (solo developer)

### Phase 2 Delivery (Status Management)

**+ Phase 4** = User Story 2 Complete
- Tasks T038 through T051
- Adds: Status change via quick actions and long press menu
- Additional tasks: 14
- Estimated effort: +3-5 days

### Full Feature Delivery (Complete CRUD)

**+ Phase 5 + Phase 6** = All User Stories + Polish
- Tasks T052 through T077
- Adds: Edit, delete, and polish
- Additional tasks: 26
- Total tasks: 77
- Estimated effort: 2-3 weeks total (solo developer)

### Incremental Testing Strategy

- Run Maestro tests after each user story phase: `maestro test .maestro/flows/todos/`
- Smoke tests only for quick validation: `maestro test --includeTags smokeTest`
- Full suite before each commit: `maestro test .maestro/flows/`
- CI/CD integration: Run tests on pull requests

---

## Task Count Summary

- **Phase 1 (Setup)**: 8 tasks
- **Phase 2 (Foundational)**: 8 tasks (T009-T016)
- **Phase 3 (User Story 1 - P1)**: 21 tasks (T017-T037)
- **Phase 4 (User Story 2 - P2)**: 14 tasks (T038-T051)
- **Phase 5 (User Story 3 - P3)**: 15 tasks (T052-T066)
- **Phase 6 (Polish)**: 11 tasks (T067-T077)

**Total**: 77 tasks

**Parallelizable**: 42 tasks marked [P]
**Sequential**: 35 tasks (dependencies or integration work)

**By User Story**:
- US1: 21 tasks (core feature - longest due to foundational components)
- US2: 14 tasks (extends US1 components)
- US3: 15 tasks (reuses US1/US2 components)

---

## Validation Checklist

Before marking the feature complete:

- [ ] All 77 tasks completed
- [ ] All Maestro tests pass: `maestro test .maestro/flows/`
- [ ] Smoke tests pass: `maestro test --includeTags smokeTest`
- [ ] Code quality: `pnpm lint` shows no errors
- [ ] Code formatting: `pnpm format` applied
- [ ] Manual testing on iOS, Android, and Web
- [ ] Dark mode works on all screens
- [ ] Performance: 100+ todos without degradation
- [ ] Cross-device sync verified
- [ ] Logout/login persistence verified
- [ ] Error handling tested (network offline scenarios)
- [ ] All acceptance criteria from spec.md satisfied
- [ ] quickstart.md updated with Convex setup instructions
- [ ] Constitution compliance: All principles followed (TDD, authentication-first, type safety, etc.)

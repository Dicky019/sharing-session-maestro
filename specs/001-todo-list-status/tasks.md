# Tasks: Todo List with Status Management

**Input**: Design documents from `/specs/001-todo-list-status/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/convex-schema.md

**Tests**: Maestro UI tests included (TDD approach per constitution requirement)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Mobile + Web (React Native with Expo)**: `app/`, `components/`, `convex/`, `.maestro/`
- All paths relative to repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and Convex backend setup

- [ ] T001 Install Convex backend dependency via `npm install convex`
- [ ] T002 [P] Install datetime picker dependency via `npx expo install @react-native-community/datetimepicker`
- [ ] T003 Initialize Convex project via `npx convex dev` and create deployment
- [ ] T004 [P] Create Clerk JWT template named "convex" in Clerk Dashboard
- [ ] T005 Configure Convex authentication in convex/auth.config.ts with Clerk issuer domain
- [ ] T006 Update app/_layout.tsx to wrap with ConvexProviderWithClerk provider
- [ ] T007 [P] Add environment variables EXPO_PUBLIC_CONVEX_URL and CLERK_JWT_ISSUER_DOMAIN

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core backend schema and types that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T008 Define Convex database schema in convex/schema.ts with todos table and indexes (by_user, by_user_and_status)
- [ ] T009 [P] Create TypeScript type definitions in lib/types/todo.ts (Todo interface, TodoStatus type, TODO_STATUS_LABELS, TODO_ICON_OPTIONS)
- [ ] T010 [P] Create todo data validation helper in lib/utils/validation.ts (validateTodoFields function)
- [ ] T011 Deploy Convex schema via `npx convex deploy`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Create and View Todos (Priority: P1) 🎯 MVP

**Goal**: Users can create todo items with all required fields (title, description, icon, due date) and view them organized by status

**Independent Test**: Create several todos and verify they appear in the Active tab with correct data

### Maestro Tests for User Story 1 (TDD - Write FIRST)

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T012 [P] [US1] Create Maestro test .maestro/flows/todos/create-todo.yaml for creating a new todo with all required fields
- [ ] T013 [P] [US1] Create Maestro test .maestro/flows/common/setup-auth.yaml as reusable auth subflow (tagged "util")
- [ ] T014 [P] [US1] Update .maestro/config.yaml to include todos/*.yaml and exclude common/*.yaml

### Convex Backend for User Story 1

- [ ] T015 [P] [US1] Implement Convex query `list` in convex/todos.ts to fetch all todos for authenticated user
- [ ] T016 [P] [US1] Implement Convex query `listByStatus` in convex/todos.ts to fetch todos filtered by status
- [ ] T017 [US1] Implement Convex mutation `create` in convex/todos.ts with validation for all required fields (title, description, icon, dueDate)

### UI Components for User Story 1

- [ ] T018 [P] [US1] Create IconPicker component in components/todo/icon-picker.tsx with grid of TODO_ICON_OPTIONS
- [ ] T019 [P] [US1] Create DateTimePicker cross-platform wrapper in components/todo/datetime-picker.tsx (native for iOS/Android, HTML5 for web)
- [ ] T020 [US1] Create TodoForm component in components/todo/todo-form.tsx with all four required fields and validation
- [ ] T021 [P] [US1] Create TodoCard component in components/todo/todo-card.tsx to display individual todo item
- [ ] T022 [P] [US1] Create TodoList component in components/todo/todo-list.tsx to render list of TodoCards
- [ ] T023 [P] [US1] Create EmptyState component in components/todo/empty-state.tsx for empty lists

### Tab Navigation for User Story 1

- [ ] T024 [US1] Create tab layout in app/(tabs)/_layout.tsx with Active, Terlewat (Inactive), and Complete tabs using Lucide icons
- [ ] T025 [P] [US1] Create Active todos screen in app/(tabs)/active.tsx using useQuery(api.todos.listByStatus, {status: "active"})
- [ ] T026 [P] [US1] Create Inactive todos screen in app/(tabs)/inactive.tsx using useQuery(api.todos.listByStatus, {status: "inactive"})
- [ ] T027 [P] [US1] Create Complete todos screen in app/(tabs)/complete.tsx using useQuery(api.todos.listByStatus, {status: "complete"})

### Todo Creation Screen for User Story 1

- [ ] T028 [US1] Create todo creation modal screen in app/todo/new.tsx using TodoForm and useMutation(api.todos.create)
- [ ] T029 [US1] Add create todo button (Plus icon) to tab navigation header in app/(tabs)/_layout.tsx

**Checkpoint**: At this point, User Story 1 should be fully functional - users can create todos and view them organized by status (active by default)

---

## Phase 4: User Story 2 - Change Todo Status (Priority: P2)

**Goal**: Users can move todos between different statuses (active, inactive, complete) via quick action buttons and long press menu

**Independent Test**: Create active todos, change their status to complete or inactive, verify they move to correct tabs

### Maestro Tests for User Story 2 (TDD - Write FIRST)

- [ ] T030 [P] [US2] Create Maestro test .maestro/flows/todos/change-status-complete.yaml for marking active todo as complete
- [ ] T031 [P] [US2] Create Maestro test .maestro/flows/todos/change-status-inactive.yaml for marking active todo as inactive
- [ ] T032 [P] [US2] Create Maestro test .maestro/flows/todos/reactivate-from-complete.yaml for reactivating completed todo
- [ ] T033 [P] [US2] Create Maestro test .maestro/flows/todos/reactivate-from-inactive.yaml for reactivating inactive todo

### Convex Backend for User Story 2

- [ ] T034 [US2] Implement Convex mutation `changeStatus` in convex/todos.ts to update todo status with authorization check

### UI Components for User Story 2

- [ ] T035 [US2] Add quick action buttons (checkmark and X icons) to TodoCard component in components/todo/todo-card.tsx
- [ ] T036 [US2] Add long press menu to TodoCard component showing all three status options (Active, Inactive, Complete)
- [ ] T037 [US2] Integrate changeStatus mutation with quick action buttons and long press menu handlers

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently - users can create todos and change their status

---

## Phase 5: User Story 3 - Edit and Delete Todos (Priority: P3)

**Goal**: Users can modify all fields of existing todos and permanently delete unwanted todos

**Independent Test**: Create todos, edit their fields (title, description, icon, due date), delete items, verify changes persist

### Maestro Tests for User Story 3 (TDD - Write FIRST)

- [ ] T038 [P] [US3] Create Maestro test .maestro/flows/todos/edit-todo.yaml for editing existing todo fields
- [ ] T039 [P] [US3] Create Maestro test .maestro/flows/todos/delete-todo.yaml for permanently deleting a todo

### Convex Backend for User Story 3

- [ ] T040 [P] [US3] Implement Convex query `get` in convex/todos.ts to fetch single todo by ID with authorization
- [ ] T041 [P] [US3] Implement Convex mutation `update` in convex/todos.ts to update todo fields with validation
- [ ] T042 [P] [US3] Implement Convex mutation `remove` in convex/todos.ts to delete todo with authorization

### UI Components for User Story 3

- [ ] T043 [US3] Create todo edit screen in app/todo/[id].tsx using dynamic route, TodoForm, and useMutation(api.todos.update)
- [ ] T044 [US3] Add navigation to edit screen on TodoCard tap
- [ ] T045 [US3] Add delete button with confirmation dialog to edit screen using useMutation(api.todos.remove)
- [ ] T046 [US3] Update TodoForm to support edit mode (pre-fill fields from existing todo data)

**Checkpoint**: All user stories should now be independently functional - full CRUD + status management complete

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and overall quality

- [ ] T047 [P] Add error toast notifications for Convex mutation failures (Sonner Native integration)
- [ ] T048 [P] Add loading states to TodoForm during async operations (isLoading prop)
- [ ] T049 [P] Add optimistic UI updates for status changes (immediate visual feedback before Convex sync)
- [ ] T050 [P] Add testID props to all interactive elements following convention (e.g., todo-icon-{IconName}, {status}, create-todo-submit)
- [ ] T051 Run all Maestro tests via `maestro test .maestro -e APP_ID=com.ios.diki.sharingsessionmaestro`
- [ ] T052 [P] Run Biome linter and formatter via `pnpm lint:fix` and `pnpm format:fix`
- [ ] T053 Verify quickstart.md instructions are accurate by following the developer guide
- [ ] T054 [P] Update .maestro/README.md with test documentation and testID conventions
- [ ] T055 [P] Performance test with 100+ todos per status tab to verify < 5s creation time and 60fps UI

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Enhances US1 components but independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Reuses US1 components but independently testable

### Within Each User Story

- Maestro tests MUST be written and FAIL before implementation (TDD)
- Convex queries/mutations before UI components
- Core components (IconPicker, DateTimePicker, TodoForm) before screens
- Tab navigation screens can be created in parallel after core components
- Integration tasks (buttons, handlers) after both backend and UI components exist

### Parallel Opportunities

- **Phase 1 Setup**: All tasks marked [P] can run in parallel (T002, T004, T007)
- **Phase 2 Foundational**: T009 and T010 can run in parallel (different files)
- **Once Foundational completes**: All three user stories can start in parallel (if team capacity allows)
- **Within User Story 1**:
  - Maestro tests: T012, T013, T014 in parallel
  - Convex backend: T015, T016 in parallel (T017 can follow after)
  - UI components: T018, T019, T021, T022, T023 in parallel
  - Tab screens: T025, T026, T027 in parallel
- **Within User Story 2**:
  - Maestro tests: T030, T031, T032, T033 in parallel
- **Within User Story 3**:
  - Maestro tests: T038, T039 in parallel
  - Convex backend: T040, T041, T042 in parallel
- **Phase 6 Polish**: All tasks marked [P] can run in parallel

---

## Parallel Example: User Story 1 Implementation

```bash
# Step 1: Launch all Maestro tests together (write first, verify they fail):
Task T012: "Create .maestro/flows/todos/create-todo.yaml"
Task T013: "Create .maestro/flows/common/setup-auth.yaml"
Task T014: "Update .maestro/config.yaml"

# Step 2: Launch Convex queries in parallel:
Task T015: "Implement list query in convex/todos.ts"
Task T016: "Implement listByStatus query in convex/todos.ts"

# Step 3: Launch UI components in parallel:
Task T018: "Create icon-picker.tsx"
Task T019: "Create datetime-picker.tsx"
Task T021: "Create todo-card.tsx"
Task T022: "Create todo-list.tsx"
Task T023: "Create empty-state.tsx"

# Step 4: Launch tab screens in parallel (after components):
Task T025: "Create app/(tabs)/active.tsx"
Task T026: "Create app/(tabs)/inactive.tsx"
Task T027: "Create app/(tabs)/complete.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (Convex, dependencies, environment)
2. Complete Phase 2: Foundational (schema, types, validation) - CRITICAL
3. Complete Phase 3: User Story 1 (create and view todos)
4. **STOP and VALIDATE**: Run Maestro test `create-todo.yaml` to verify independently
5. Deploy/demo basic todo creation and viewing

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently with Maestro → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently with Maestro → Deploy/Demo (status management)
4. Add User Story 3 → Test independently with Maestro → Deploy/Demo (edit/delete)
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together (T001-T011)
2. Once Foundational is done:
   - Developer A: User Story 1 (T012-T029) - Create and view
   - Developer B: User Story 2 (T030-T037) - Status changes
   - Developer C: User Story 3 (T038-T046) - Edit and delete
3. Stories complete and integrate independently via real-time Convex sync

---

## TDD Workflow (Per Constitution)

**Red → Green → Refactor**

### Red (Tests First)
1. Write Maestro test flows BEFORE any implementation
2. Run tests - they MUST fail (feature doesn't exist yet)
3. Get user approval on test scenarios

### Green (Make Tests Pass)
1. Implement Convex backend functions
2. Build UI components
3. Wire up mutations/queries
4. Run tests - they should now pass

### Refactor (Clean Up)
1. Optimize component structure
2. Extract reusable logic
3. Improve code quality
4. Tests stay green throughout

---

## Notes

- **[P] tasks** = different files, no dependencies, can run in parallel
- **[Story] label** maps task to specific user story for traceability
- Each user story should be independently completable and testable
- **Verify Maestro tests fail before implementing** (TDD principle)
- Commit after each task or logical group of tasks
- Stop at any checkpoint to validate story independently
- **Real-time sync**: Convex automatically propagates changes across all clients
- **testID convention**: Use kebab-case (e.g., `todo-icon-ShoppingCart`, `create-todo-submit`)
- **Data persistence**: Convex handles automatically - no manual storage code needed
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence

---

## Summary

- **Total Tasks**: 55
- **User Story 1 (MVP)**: 18 tasks (T012-T029) - Create and view todos
- **User Story 2**: 8 tasks (T030-T037) - Change status
- **User Story 3**: 9 tasks (T038-T046) - Edit and delete
- **Setup + Foundational**: 11 tasks (T001-T011)
- **Polish**: 9 tasks (T047-T055)
- **Parallel Opportunities**: 30+ tasks marked [P] can run concurrently
- **Maestro Tests**: 10 test flows across 3 user stories
- **Independent Testing**: Each story verifiable in isolation

**Suggested MVP Scope**: Phase 1 + Phase 2 + Phase 3 (User Story 1 only) = 29 tasks

**Format Validation**: ✅ All tasks follow `- [ ] [ID] [P?] [Story?] Description with file path` format

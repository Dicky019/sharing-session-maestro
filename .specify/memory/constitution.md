<!--
Sync Impact Report:
Version Change: 1.2.0 → 1.2.1
Modified Principles:
  - Principle VIII: Standardized Form Validation - Updated to specify Zod v4 explicitly
Added Sections: None
Removed Sections: None

Templates Status:
  ✅ plan-template.md - Aligned, no changes needed
  ✅ spec-template.md - Aligned, no changes needed
  ✅ tasks-template.md - Aligned, no changes needed
  ✅ CLAUDE.md - Already includes Zod v4 in active technologies

Follow-up TODOs: None (all forms already migrated to React Hook Form + Zod v4)
-->

# Sharing Session Maestro Constitution

## Core Principles

### I. Mobile-First with Universal Reach

Every feature MUST work seamlessly across iOS, Android, and Web platforms. Platform-specific code is permitted only when absolutely necessary for native functionality (e.g., biometrics, push notifications). UI components MUST use React Native Reusables and NativeWind to ensure consistent styling across all platforms.

**Rationale**: The project targets maximum accessibility. Users should have identical experiences regardless of their device choice. This principle prevents fragmentation and ensures maintainability.

### II. Authentication-First Security

All authenticated screens and features MUST be protected using Clerk's authentication guards. Routes MUST explicitly declare their authentication requirements using `Stack.Protected` with appropriate guards. OAuth providers (Apple, GitHub, Google) MUST be tested and functional alongside email/password authentication.

**Rationale**: Security cannot be retrofitted. By making authentication a first-class concern from the start, we prevent security vulnerabilities and ensure user data protection.

### III. Test-First Development (NON-NEGOTIABLE)

For features requiring automated testing:
1. Maestro test flows MUST be written BEFORE implementation
2. Tests MUST fail initially (Red phase)
3. Implementation proceeds to make tests pass (Green phase)
4. Code MUST be refactored while keeping tests passing (Refactor phase)

User approval of test flows is REQUIRED before implementation begins.

**Rationale**: TDD ensures features meet requirements and prevents regression. The Red-Green-Refactor cycle is fundamental to quality. This project is designed as a teaching example for Maestro testing, making test discipline essential.

### IV. Component Reusability & UI Consistency

UI components MUST be built from React Native Reusables primitives located in `components/ui/`. Custom components MUST follow the established patterns (NativeWind styling, theme variables, TypeScript strict typing). New UI patterns MUST be justified and cannot violate existing design tokens.

**Rationale**: Consistency creates professional user experiences. Reusable components reduce bugs and development time. The React Native Reusables library provides battle-tested primitives.

### V. Type Safety & Code Quality

TypeScript strict mode is MANDATORY. All components MUST have typed props and return types. Code formatting MUST use Biome (configured formatter). Linting rules MUST pass before commits.

**Rationale**: Type safety catches bugs at compile time. Strict mode prevents common TypeScript pitfalls. Consistent formatting reduces code review friction.

### VI. User Story-Driven Development

Features MUST be broken down into independent, prioritized user stories (P1, P2, P3, etc.). Each user story MUST:
- Deliver standalone value
- Be independently testable
- Have clear acceptance criteria
- Be implementable in isolation

**Rationale**: User stories enable incremental delivery and parallel development. Each story represents a shippable increment, allowing MVP releases and faster feedback cycles.

### VII. Environment Separation

Development and production environments MUST be strictly separated:
- `.env.development` for local development
- `.env.production` for production builds
- NEVER commit `.env` files to version control
- Clerk publishable keys MUST be environment-specific

**Rationale**: Environment separation prevents production data leaks during development and ensures safe testing with development credentials.

### VIII. Standardized Form Validation (React Hook Form + Zod v4)

All forms MUST use React Hook Form for state management and Zod v4 for schema-based validation. Form components MUST:
- Define validation schemas using Zod v4 API with typed inference
- Use `useForm` hook with Zod resolver (`zodResolver` from `@hookform/resolvers/zod`)
- Use React Hook Form's `Controller` component for React Native inputs
- Provide real-time validation feedback on field changes
- Display validation errors inline with accessible error messages
- Leverage TypeScript type inference from Zod schemas

**Version Requirements**:
- Zod: `^4.0.0` (v4.x.x)
- React Hook Form: `^7.0.0`
- @hookform/resolvers: `^5.0.0`

**Implementation Pattern** (React Native):
```typescript
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(100),
  email: z.email('Invalid email address'),  // Zod v4 simplified API
});

type FormData = z.infer<typeof formSchema>;

function MyForm() {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: '', email: '' },
  });

  const onSubmit = (data: FormData) => {
    // Type-safe data, already validated
  };

  return (
    <Controller
      control={control}
      name="email"
      render={({ field: { onChange, onBlur, value } }) => (
        <Input
          value={value}
          onChangeText={onChange}
          onBlur={onBlur}
        />
      )}
    />
  );
}
```

**Zod v4 API Changes**:
- `z.string().email()` instead of `z.string().email(message)`
- `z.email()` as shorthand for email validation
- Simplified chaining and method signatures
- Enhanced type inference and error messages

**Requirements**:
- Schema definitions MUST be co-located with form components
- Error messages MUST be user-friendly (not technical jargon)
- Validation MUST handle edge cases (empty strings, whitespace, special characters)
- Forms MUST be accessible (proper labels, error announcements)
- Use `Controller` component for all React Native form inputs
- Use `isSubmitting` state to disable form during async operations

**Rationale**: React Hook Form provides performant form state management with minimal re-renders. Zod v4 ensures type-safe validation with runtime checking and improved API ergonomics. Together, they eliminate manual validation logic, reduce bugs, and provide excellent TypeScript inference. This standard ensures consistency across all forms and improves developer experience and user experience.

## Cross-Platform Consistency

### File-Based Routing Standards

All routing MUST use Expo Router's file-based system. Routes are defined by files in the `app/` directory:
- `app/_layout.tsx`: Root layout with providers and guards
- `app/(auth)/*`: Authentication flow screens
- `app/index.tsx`: Main authenticated home

New routes MUST follow this convention. Dynamic routes MUST use `[param]` syntax. Route groups MUST use `(group)` syntax.

### Path Alias Requirements

All imports MUST use the `@/*` path alias pointing to the project root. Relative imports (`../../`) are DISCOURAGED except within the same feature directory.

Examples:
- `@/components/ui/button` (CORRECT)
- `../../components/ui/button` (AVOID)

### Theme System Compliance

All colors MUST use theme CSS variables defined in `lib/theme.ts`:
- `background`, `foreground`, `primary`, `secondary`, `muted`, `accent`, `destructive`, `border`, `input`, `ring`
- Dark mode support is AUTOMATIC via CSS variables
- Custom colors REQUIRE justification and addition to theme system

Manual color values (e.g., `className="bg-blue-500"`) are FORBIDDEN.

## Quality Standards

### Code Style Requirements

- **File Naming**: kebab-case for files (e.g., `user-menu.tsx`)
- **Component Naming**: PascalCase for component names (e.g., `UserMenu`)
- **Import Order**: External dependencies first, then internal imports with path aliases
- **Exports**: Default exports for screens, named exports for reusable components

### Documentation Requirements

- Public components MUST have JSDoc comments describing purpose and props
- Complex logic MUST include inline comments explaining the "why"
- Screens MUST include `<Stack.Screen />` options for navigation configuration

## Maestro Testing Standards

### Fundamental Principle: One Flow, One User Scenario

Each Maestro flow MUST test a single user scenario. Do NOT create monolithic tests that combine multiple user intents.

**Correct Examples**:
- `create-todo.yaml` - Create a single todo
- `change-status-complete.yaml` - Mark todo as complete
- `login.yaml` - Sign in with credentials

**Incorrect Examples**:
- ❌ `todo-full-workflow.yaml` - Create, edit, change status, delete (too broad)
- ❌ `app-smoke-test.yaml` - Tests multiple unrelated features

**Rationale**: Single-scenario flows enable parallel execution, granular failure reporting, and continued test progression despite individual failures.

### Test Organization: Feature-Based Hierarchy

Maestro flows MUST be organized in feature-based subdirectories:

```
.maestro/
├── flows/
│   ├── auth/               # Authentication flows
│   │   ├── login.yaml
│   │   ├── signup.yaml
│   │   └── logout.yaml
│   ├── todos/              # Todo feature flows
│   │   ├── create-todo.yaml
│   │   ├── edit-todo.yaml
│   │   ├── delete-todo.yaml
│   │   └── change-status.yaml
│   └── common/             # Reusable utility flows (NOT executed as tests)
│       ├── setup-auth.yaml
│       └── cleanup.yaml
├── config.yaml             # Test suite configuration
└── .maestro.yaml           # Maestro CLI configuration (optional)
```

**Rules**:
- Group flows by feature/user journey (NOT by test type)
- Reserve `common/` for utility flows excluded from test runs
- Use descriptive folder names matching app features
- Avoid flat structures - they become unmaintainable

### Flow Naming Conventions

Flow filenames MUST follow this pattern: `<action>-<target>[-<detail>].yaml`

**Examples**:
- `create-todo.yaml` (action: create, target: todo)
- `change-status-complete.yaml` (action: change-status, detail: complete)
- `validate-empty-title.yaml` (action: validate, target: empty-title)
- `reactivate-from-inactive.yaml` (action: reactivate, detail: from-inactive)

**Rules**:
- Use kebab-case (lowercase with hyphens)
- Start with verb (action-oriented)
- Be specific but concise
- Avoid redundant words like "test-" prefix (implicit)

### Flow Composition: Reusable Subflows

Use `runFlow` to compose tests from reusable modules. Extract common setup/teardown into `common/` directory flows.

**Example**:
```yaml
# .maestro/flows/todos/create-todo.yaml
appId: com.yourapp
---
- runFlow: ../common/setup-auth.yaml  # Reusable auth setup
- tapOn: "Create Todo"
- inputText: "Buy groceries"
- tapOn: "Save"
- assertVisible: "Buy groceries"
```

**Rules**:
- Common flows MUST be in `common/` directory
- Use relative paths for `runFlow` (e.g., `../common/setup-auth.yaml`)
- Document reusable flows with comments
- Keep reusable flows focused (single responsibility)

### Test Configuration Management

Use `.maestro/config.yaml` to control test execution:

```yaml
# .maestro/config.yaml
flows:
  - auth/*.yaml
  - todos/*.yaml
  # Exclude common utilities from test runs:
  - "!common/*.yaml"

# OR use tags to exclude utilities:
excludeTags:
  - util
  - wip
```

**Rules**:
- Use glob patterns to auto-include new tests
- Explicitly exclude `common/` directory
- Use tags for conditional execution (smoke vs. full suite)
- Document tag meanings in config comments

### Test Categorization: Tags for Conditional Execution

Tag flows to enable environment-specific execution:

```yaml
# .maestro/flows/todos/create-todo.yaml
appId: com.yourapp
tags:
  - smokeTest   # Run on every PR
  - todos       # Feature-specific
---
- tapOn: "Create Todo"
# ... test steps
```

**Tag Categories**:
- `smokeTest` - Critical paths (run on every PR)
- `regression` - Full regression suite (nightly builds)
- `<feature>` - Feature-specific (e.g., `auth`, `todos`, `profile`)
- `slow` - Long-running tests (exclude from PR checks)
- `util` - Utility flows (always exclude)

**Execution Examples**:
```bash
# PR checks (fast, critical paths only)
maestro test .maestro/flows/ --includeTags smokeTest

# Nightly regression (full suite except slow tests)
maestro test .maestro/flows/ --excludeTags slow,util

# Feature-specific testing
maestro test .maestro/flows/ --includeTags todos
```

### Test Data Management

Use Maestro's built-in features for test data:

```yaml
# Environment variables for credentials
env:
  TEST_EMAIL: ${TEST_EMAIL}
  TEST_PASSWORD: ${TEST_PASSWORD}

# Constants for reusable values
constants:
  TODO_TITLE: "Test Todo Item"
  TODO_DESCRIPTION: "This is a test description"

# Randomization for unique data
- inputText: "Todo ${randomNumber(1000)}"
```

**Rules**:
- Use environment variables for secrets/credentials
- Use constants for repeated values within a flow
- Use `${randomNumber()}` or `${randomEmail()}` for unique data
- For Clerk test data: Use `+clerk_test` emails and `424242` verification code
- Document expected environment variables in flow comments

### Platform-Specific Testing

Leverage Maestro's platform support while maintaining cross-platform tests:

```yaml
# Platform-specific steps (when necessary)
- runFlow:
    when:
      platform: iOS
    file: ios-specific-setup.yaml

- runFlow:
    when:
      platform: Android
    file: android-specific-setup.yaml
```

**Rules**:
- Write platform-agnostic tests by default
- Use platform conditionals ONLY when behavior truly differs
- Test on all three platforms (iOS, Android, Web) before merging
- Document platform-specific quirks in flow comments

### Test Isolation & Independence

Each flow MUST be independently executable without dependencies on other flows:

**Requirements**:
- Set up necessary preconditions within the flow (or via `runFlow` common setup)
- Do NOT rely on app state from previous tests
- Clean up after test if needed (delete created data)
- Use unique identifiers to avoid conflicts (random numbers/emails)

**Anti-Pattern Example**:
```yaml
# ❌ BAD: Assumes todo exists from previous test
- tapOn: "First Todo"
- tapOn: "Delete"
```

**Correct Pattern**:
```yaml
# ✅ GOOD: Creates todo first, then tests deletion
- runFlow: ../common/create-sample-todo.yaml
- tapOn:
    text: "${SAMPLE_TODO_TITLE}"
- tapOn: "Delete"
- assertNotVisible: "${SAMPLE_TODO_TITLE}"
```

### CI/CD Integration Requirements

Maestro tests MUST be executable in CI/CD pipelines:

**Requirements**:
- Tests MUST pass in headless mode (no manual interaction)
- Environment variables MUST be configurable via CI secrets
- Test results MUST be exportable (JUnit XML format)
- Parallel execution MUST be supported for speed
- Flaky tests MUST be identified and fixed (NOT ignored)

**Example CI Configuration** (GitHub Actions):
```yaml
- name: Run Maestro Tests
  run: |
    maestro test .maestro/flows/ \
      --includeTags smokeTest \
      --format junit \
      --output test-results.xml
  env:
    TEST_EMAIL: ${{ secrets.TEST_EMAIL }}
    TEST_PASSWORD: ${{ secrets.TEST_PASSWORD }}
```

### Test Execution Order

Within each user story phase:

1. **Write Maestro flows** → Create all .yaml files for the story
2. **Run tests** → Execute with `maestro test` (MUST FAIL initially)
3. **Get approval** → Review test scenarios with stakeholders
4. **Implement features** → Build the functionality
5. **Run tests again** → Execute with `maestro test` (MUST PASS)
6. **Refactor** → Clean up code while keeping tests green

**Validation Checkpoints**:
- After step 2: All tests MUST fail (Red phase)
- After step 5: All tests MUST pass (Green phase)
- Before merge: All tests MUST pass on all platforms

### Anti-Patterns to Avoid

**❌ Long Sequential Flows**:
```yaml
# BAD: Combines login + create + edit + delete
- runFlow: login.yaml
- tapOn: "Create Todo"
- tapOn: "Edit Todo"
- tapOn: "Delete Todo"
```

**❌ Hardcoded Sleep Calls**:
```yaml
# BAD: Maestro handles waits automatically
- tapOn: "Submit"
- sleep: 5000  # Unnecessary
- assertVisible: "Success"
```

**❌ Brittle Selectors**:
```yaml
# BAD: Position-based selection
- tapOn:
    index: 0  # Fragile

# GOOD: Semantic selection
- tapOn:
    text: "Create Todo"
```

**❌ Flat Directory Structure**:
```
.maestro/flows/
├── test1.yaml
├── test2.yaml
├── test3.yaml  # Hard to navigate
...
```

### Maestro Best Practices Summary

1. **One flow, one scenario** - Decompose by user intent
2. **Feature-based folders** - Group by feature, not test type
3. **Reusable subflows** - Extract common setup to `common/`
4. **Tag for execution** - Use tags for smoke vs. full suite
5. **Independent tests** - Each flow MUST run standalone
6. **Platform coverage** - Test on iOS, Android, Web
7. **CI/CD ready** - Headless execution, parallel support
8. **No sleep calls** - Trust Maestro's automatic waiting
9. **Semantic selectors** - Use text/accessibility IDs, not positions
10. **Test-first discipline** - Write flows BEFORE implementation

## Governance

### Amendment Process

1. Proposed changes MUST be documented with rationale
2. Changes affecting multiple features REQUIRE project-wide review
3. Breaking changes REQUIRE migration plan for existing features
4. Constitution updates MUST increment version according to semantic versioning

### Version Policy

- **MAJOR**: Backward incompatible principle removals or redefinitions
- **MINOR**: New principles added or material expansions to guidance
- **PATCH**: Clarifications, wording fixes, non-semantic refinements

### Compliance & Review

All pull requests MUST verify compliance with constitution principles. Code reviews MUST reference specific principles when requesting changes. Complexity that violates principles MUST be justified in the implementation plan's "Complexity Tracking" section.

**Runtime Guidance**: For agent-specific development guidance, see `CLAUDE.md` at the project root.

**Version**: 1.2.1 | **Ratified**: 2025-10-26 | **Last Amended**: 2025-10-29

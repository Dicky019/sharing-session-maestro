# Maestro Test Suite Documentation

This directory contains automated UI tests for the Todo app using Maestro mobile testing framework.

## 📁 Directory Structure

```
.maestro/
├── config.yaml                 # Maestro configuration file
├── README.md                   # This file
└── flows/
    ├── auth/                   # Authentication flows
    │   ├── credentials.js     # JavaScript: Test credentials helper
    │   ├── sign-in.yaml       # Sign in with existing account
    │   ├── sign-up.yaml       # Complete registration flow
    │   └── sign-out.yaml      # Utility: Sign out current user
    └── todos/                  # Todo management flows
        ├── create-todo.yaml   # Create new todo with all fields
        └── calculate-datetime.js  # JavaScript: Calculate dates for tests
```

## 🚀 Running Tests

### Prerequisites

Install Maestro CLI:
```bash
# macOS/Linux
curl -Ls "https://get.maestro.mobile.dev" | bash

# Add to PATH (if needed)
export PATH="$HOME/.maestro/bin:$PATH"
```

### Run All Tests

```bash
# Run all tests (uses config.yaml)
maestro test .maestro -e APP_ID=com.ios.diki.sharingsessionmaestro

# Run specific test
maestro test .maestro/flows/todos/create-todo.yaml -e APP_ID=com.ios.diki.sharingsessionmaestro
```

### Run by Tags

```bash
# Run only smoke tests
maestro test .maestro -e APP_ID=com.ios.diki.sharingsessionmaestro --includeTags smokeTest

# Run only auth tests
maestro test .maestro -e APP_ID=com.ios.diki.sharingsessionmaestro --includeTags auth

# Run only todo tests
maestro test .maestro -e APP_ID=com.ios.diki.sharingsessionmaestro --includeTags todos

# Exclude utility flows
maestro test .maestro -e APP_ID=com.ios.diki.sharingsessionmaestro --excludeTags util
```

### Continuous Mode

```bash
# Watch mode - reruns tests on changes
maestro test .maestro -e APP_ID=com.ios.diki.sharingsessionmaestro --continuous
```

## 📋 Test Flows

### Authentication Flows

#### 1. Sign In (`auth/sign-in.yaml`)
**Tags:** `smokeTest`, `auth`

Tests the complete sign-in flow for existing users.

**Test Data:**
- Loaded from `credentials.js` JavaScript helper
- Email: `test+clerk_test@example.com`
- Password: `TestPassword123!`

**Steps:**
1. Load test credentials from JavaScript
2. Launch app
3. Sign out if already logged in
4. Fill in credentials from script output
5. Submit form
6. Verify successful authentication

**Run:**
```bash
maestro test .maestro/flows/auth/sign-in.yaml -e APP_ID=com.ios.diki.sharingsessionmaestro
```

---

#### 2. Sign Up (`auth/sign-up.yaml`)
**Tags:** `smokeTest`, `auth`

Tests the complete registration flow with email verification.

**Test Data:**
- Loaded from `credentials.js` JavaScript helper
- First Name: `Test`
- Last Name: `User`
- Username: `testuser{timestamp}` (unique per run)
- Email: `test+clerk_test@example.com`
- Password: `TestPassword123!`
- Verification Code: `424242` (Clerk test code)

**Steps:**
1. Load test credentials from JavaScript
2. Launch app
3. Navigate to sign-up screen
4. Fill in all registration fields from script output
5. Submit form
6. Enter verification code from script
7. Verify account creation and auto sign-in

**Run:**
```bash
maestro test .maestro/flows/auth/sign-up.yaml -e APP_ID=com.ios.diki.sharingsessionmaestro
```

---

#### 3. Sign Out (`auth/sign-out.yaml`)
**Tags:** `util`, `auth`

Reusable utility flow to sign out the current user.

**Usage in other flows:**
```yaml
- runFlow:
    when:
      visible:
        id: "user-menu-.*"
    file: ../auth/sign-out.yaml
```

**Steps:**
1. Open user menu
2. Tap sign-out button
3. Verify redirect to sign-in screen

---

### Todo Management Flows

#### 1. Create Todo (`todos/create-todo.yaml`)
**Tags:** `smokeTest`, `todos`

Tests the complete todo creation flow with all required fields.

**Test Data:**
- Title: `Buy groceries`
- Description: `Get milk, eggs, bread, and vegetables for the week`
- Icon: `ShoppingCart`
- Due Date: Tomorrow (calculated dynamically)
- Status: `active` (default)

**Steps:**
1. Authenticate user if needed
2. Navigate to Active tab
3. Open create form
4. Fill all required fields
5. Submit form
6. Verify success message
7. Verify todo appears in list with correct data

**Run:**
```bash
maestro test .maestro/flows/todos/create-todo.yaml -e APP_ID=com.ios.diki.sharingsessionmaestro
```

---

## 🧪 Test Data

### JavaScript Credentials Helper

All auth tests use a centralized JavaScript helper for managing test credentials.

**File:** `.maestro/flows/auth/credentials.js`

**Usage in YAML:**
```yaml
# Load credentials at the beginning of your flow
- runScript: credentials.js

# Use credentials in your test
- inputText: ${output.TEST_EMAIL}          # test+clerk_test@example.com
- inputText: ${output.TEST_PASSWORD}        # TestPassword123!
- inputText: ${output.TEST_FIRST_NAME}      # Test
- inputText: ${output.TEST_LAST_NAME}       # User
- inputText: ${output.TEST_USERNAME}        # testuser{timestamp}
- inputText: ${output.VERIFICATION_CODE}    # 424242
```

**Available Output Variables:**

| Variable | Value | Description |
|----------|-------|-------------|
| `${output.TEST_EMAIL}` | `test+clerk_test@example.com` | Clerk test email |
| `${output.TEST_PASSWORD}` | `TestPassword123!` | Test password |
| `${output.TEST_FIRST_NAME}` | `Test` | First name |
| `${output.TEST_LAST_NAME}` | `User` | Last name |
| `${output.TEST_USERNAME}` | `testuser{timestamp}` | Unique username |
| `${output.VERIFICATION_CODE}` | `424242` | Clerk test code |

**Benefits:**
- ✅ Centralized credential management
- ✅ Easy to update in one place
- ✅ Supports unique test data (via timestamp)
- ✅ Consistent across all auth flows

### Clerk Test Credentials

The app uses Clerk's test mode which bypasses email/SMS delivery:

**Test Email Format:**
- Pattern: `[name]+clerk_test@example.com`
- Verification Code: Always `424242`
- No actual email is sent

**Examples:**
- `test+clerk_test@example.com`
- `user123+clerk_test@example.com`
- `{username}+clerk_test@example.com`

### Todo Icons

Available icons (from lucide-react-native):
- Productivity: `CheckSquare`, `Clipboard`, `ListTodo`, `FileText`
- Time: `Calendar`, `Clock`, `Timer`, `AlarmClock`
- Priority: `Star`, `Flag`, `AlertCircle`, `AlertTriangle`
- Categories: `Home`, `Briefcase`, `ShoppingCart`, `Heart`, `Coffee`
- Actions: `Play`, `Pause`, `Repeat`
- Other: `Lightbulb`, `MessageCircle`, `Phone`, `Mail`, `Book`

## 🎯 testID Conventions

When adding new UI elements, follow these conventions for reliable test selectors:

### Naming Pattern
- Use **kebab-case**: `testID="todo-title-input"`
- Be **specific**: `testID="create-todo-submit"` not just `testID="submit"`
- Include **context**: `testID="user-menu-{username}"`

### Common Patterns

**Authentication:**
```tsx
testID="first-name"
testID="last-name"
testID="username"
testID="password"
testID="email"
testID="code"
testID="submit"
testID="user-menu-{username}"
testID="sign-out"
```

**Todos:**
```tsx
testID="active"           // Tab selector
testID="inactive"         // Tab selector
testID="complete"         // Tab selector
testID="todo-icon-{IconName}"  // e.g., "todo-icon-ShoppingCart"
testID="create-todo-submit"
testID="todo-due-date"
```

## 🔧 Helper Scripts

### calculate-datetime.js

JavaScript helper for calculating dynamic dates in tests.

**Usage:**
```yaml
- runScript: calculate-datetime.js
- tapOn: ${output.TOMORROW_DAY}
```

**Outputs:**
- `TOMORROW_DAY`: Tomorrow's day number
- Other date calculations as needed

## 📝 Writing New Tests

### Template Structure

```yaml
appId: ${APP_ID}
tags:
  - smokeTest  # Critical path tests
  - feature    # Feature name (auth, todos, etc.)
---
# Test: Test Name
#
# Purpose: Brief description of what this test validates
#
# Prerequisites:
# - List any setup requirements
# - Account states needed
#
# Test Steps:
# 1. Step one
# 2. Step two
# ...
#
# Expected Result:
# - Expected outcome
# - What should happen

# Step 1: Do something
- tapOn: "Button"

# Step 2: Verify result
- assertVisible: "Success message"
```

### Best Practices

1. **Always add comments** explaining what each step does
2. **Use testIDs** for reliable element selection (not text when possible)
3. **Add tags** for organizing test runs (`smokeTest`, feature name, `util`)
4. **Wait for animations** when opening modals/popovers
5. **Hide keyboard** before tapping non-input elements
6. **Use conditional flows** to handle different app states
7. **Verify results** with assertions after actions
8. **Document test data** in comments

### Example: New Test

```yaml
appId: ${APP_ID}
tags:
  - smokeTest
  - todos
---
# Test: Delete Todo
#
# Purpose: Verify user can delete a todo from the list
#
# Prerequisites:
# - User must be authenticated
# - At least one todo must exist
#
# Test Steps:
# 1. Sign in if needed
# 2. Navigate to Active tab
# 3. Long press on todo item
# 4. Tap delete button
# 5. Confirm deletion
# 6. Verify todo is removed from list
#
# Expected Result:
# - Todo is deleted from database
# - Success message appears
# - Todo no longer visible in list

# Sign in if not authenticated
- runFlow:
    when:
      visible: "SignIn to .*"
    file: ../auth/sign-in.yaml

# Navigate to Active tab
- tapOn:
    id: "active"

# Long press on first todo item
- longPressOn:
    id: "todo-item-0"

# Tap delete button
- tapOn: "Delete"

# Confirm deletion
- tapOn: "OK"

# Verify success message
- assertVisible: "Todo deleted successfully"

# Verify todo is gone (inverse assertion)
- assertNotVisible:
    id: "todo-item-0"
```

## 🐛 Troubleshooting

### Common Issues

**1. testID not found**
- Ensure element has `testID` prop in React Native code
- Check if element is inside a portal (Popover, Modal)
- Remove `accessible={true}` from parent containers
- Wait for animations: `- waitForAnimationToEnd`

**2. Element not visible**
- Scroll to element: `- scroll`
- Hide keyboard: `- hideKeyboard`
- Wait for navigation: `- waitForAnimationToEnd`

**3. Test hangs/times out**
- Check if modal/overlay is blocking UI
- Ensure form submission redirects properly
- Add explicit waits after actions

**4. Flaky tests**
- Add `waitForAnimationToEnd` after navigation
- Use testID instead of text matching
- Ensure test data is unique

## 📚 Resources

- [Maestro Documentation](https://maestro.mobile.dev/)
- [Maestro CLI Reference](https://maestro.mobile.dev/reference/commands)
- [Maestro YAML Syntax](https://maestro.mobile.dev/reference/flow-syntax)
- [Clerk Test Mode](https://clerk.com/docs/testing/overview)

---

**Last Updated:** 2025-01-29
**Maintained by:** Development Team

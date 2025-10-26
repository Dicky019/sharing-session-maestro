# Task Completion Checklist

When completing any coding task in this project, follow these steps:

## 1. Code Quality Checks

### Run Linter
```bash
pnpm lint
```
- Fix any errors reported by Biome
- If auto-fixable, run `pnpm lint:fix`

### Run Formatter
```bash
pnpm format
```
- Ensures consistent code style
- Biome will format with 2-space indentation, 100 char line width
- Tailwind classes will be automatically sorted

## 2. Type Checking

### Verify TypeScript
- Check for TypeScript errors in your editor
- Ensure strict mode compliance
- All props should be typed
- No `any` types unless absolutely necessary

## 3. Testing (When Applicable)

### Maestro Tests (for Todo feature)
```bash
maestro test .maestro/flows/
```
- Run affected test flows
- Ensure all tests pass
- Follow TDD: Red → Green → Refactor

### Manual Testing
- Test on iOS simulator (Mac only)
- Test on Android emulator
- Test on Web browser
- Verify dark mode works
- Check responsive behavior

## 4. Convex Backend (for Todo feature)

### Verify Convex Schema
```bash
npx convex dev
```
- Ensure schema changes are synced
- Check for Convex function errors
- Verify authentication works

## 5. Git Workflow

### Before Committing
```bash
# Check status
git status

# Review changes
git diff

# Stage changes
git add .

# Lint and format
pnpm lint:fix
pnpm format:fix

# Commit with conventional commit message
git commit -m "feat: add todo creation flow"
# or
git commit -m "fix: resolve status change bug"
# or
git commit -m "refactor: extract validation logic"
```

### Commit Message Conventions
- `feat:` - New feature
- `fix:` - Bug fix
- `refactor:` - Code restructuring
- `test:` - Adding/updating tests
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `chore:` - Maintenance tasks

## 6. Documentation Updates

### If Public API Changed
- Update relevant `.md` files in `specs/` directory
- Update CLAUDE.md if affecting development workflow
- Update README.md if user-facing changes

### If New Component Created
- Add JSDoc comments
- Document props with TypeScript types
- Include usage examples if reusable

## 7. Performance Checks

### For UI Components
- Verify 60fps rendering
- Check for unnecessary re-renders
- Ensure proper memoization if needed

### For Convex Functions
- Check query performance
- Verify proper indexing
- Ensure optimistic updates work

## Quick Checklist Summary

- [ ] Code linted: `pnpm lint`
- [ ] Code formatted: `pnpm format`
- [ ] TypeScript strict mode compliant
- [ ] Tests pass (if applicable)
- [ ] Manual testing on all platforms
- [ ] Convex schema synced (if backend changes)
- [ ] Git commit with conventional message
- [ ] Documentation updated (if needed)
- [ ] Performance verified

## Special Notes

### For Expo Router Changes
- Test navigation flows
- Verify protected routes work
- Check deep linking (if applicable)

### For Clerk Authentication
- Test with development credentials:
  - Email: `test+clerk_test@example.com`
  - Code: `424242`
- Verify session persistence
- Check OAuth flows (Apple, GitHub, Google)

### For NativeWind Styling
- Verify dark mode theming
- Check platform-specific styles
- Ensure responsive behavior on different screen sizes
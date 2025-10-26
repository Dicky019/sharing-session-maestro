# Code Style and Conventions

## TypeScript Configuration
- **Strict Mode**: Enabled in `tsconfig.json`
- **Path Aliases**: `@/*` maps to project root
  - Example: `import { Button } from '@/components/ui/button'`
  - Avoid relative imports like `../../components/ui/button`

## File Naming
- **Component Files**: kebab-case (e.g., `user-menu.tsx`, `todo-card.tsx`)
- **Component Names**: PascalCase (e.g., `UserMenu`, `TodoCard`)
- **Screens**: kebab-case files in `app/` directory

## Component Exports
- **Screens**: Default exports (e.g., `export default function SignIn()`)
- **Reusable Components**: Named exports (e.g., `export function Button()`)

## Import Organization
1. External dependencies first
2. Internal imports with `@/*` aliases
3. Group by: React, third-party, components, lib, assets

Example:
```typescript
import React from 'react';
import { View, Text } from 'react-native';
import { useAuth } from '@clerk/clerk-expo';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
```

## Biome Configuration
- **Formatter**: 2-space indentation, 100 character line width
- **JavaScript**: Single quotes, double quotes for JSX, trailing commas (ES5)
- **Sorted Classes**: Enforced via `useSortedClasses` rule for Tailwind
- **Auto-organize Imports**: Enabled

## Styling Approach
- **NativeWind**: Use Tailwind utility classes in `className` prop
- **Theme Variables**: Use CSS variables (e.g., `bg-background`, `text-foreground`)
- **Never hardcode colors**: Always use theme tokens
- **Platform-specific**: Use `ios:`, `android:`, `web:` prefixes when needed

Examples:
```typescript
// ✅ Correct
className="bg-background text-foreground"
className="ios:pt-4 android:pt-2 web:pt-0"

// ❌ Avoid
className="bg-blue-500 text-white"
```

## Dark Mode
- Automatically handled via CSS variables
- No conditional styles needed
- Theme configured in `lib/theme.ts`

## Type Safety
- Always type component props
- Use interfaces for complex types
- Export types when reusable
- Convex validators for schema definitions

## Naming Patterns
- **Hooks**: `use` prefix (e.g., `useTodoForm`)
- **Utilities**: descriptive names (e.g., `validateTitle`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `TODO_ICON_OPTIONS`)
- **Types**: PascalCase (e.g., `TodoStatus`, `CreateTodoRequest`)
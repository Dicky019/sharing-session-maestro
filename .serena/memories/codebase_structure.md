# Codebase Structure

## Root Directory Layout

```
sharing-session-maestro/
├── app/                    # Expo Router (file-based routing)
├── components/             # React components
├── lib/                    # Utilities and shared code
├── assets/                 # Images, fonts, static files
├── convex/                 # Convex backend functions & schema
├── specs/                  # Feature specifications
├── .specify/               # Specification tooling
├── .claude/                # Claude Code configuration
├── .maestro/               # Maestro test flows (to be created)
├── ios/                    # iOS native code
├── android/                # Android native code
├── .expo/                  # Expo build artifacts (gitignored)
├── node_modules/           # Dependencies (gitignored)
└── .git/                   # Git repository
```

## app/ - Expo Router Screens

```
app/
├── _layout.tsx             # Root layout with providers & auth guards
├── index.tsx               # Home screen (protected)
├── +html.tsx               # Web HTML wrapper
├── +not-found.tsx          # 404 page
└── (auth)/                 # Authentication screens group
    ├── sign-in.tsx
    ├── sign-up/
    │   ├── _layout.tsx
    │   ├── index.tsx
    │   └── verify-email.tsx
    ├── forgot-password.tsx
    └── reset-password.tsx
```

**Routing Pattern**:
- File-based routing via Expo Router
- `(auth)` - Route group (doesn't affect URL)
- Protected routes via `Stack.Protected` in `_layout.tsx`
- Guards check `isSignedIn` from Clerk

## components/ - React Components

```
components/
├── ui/                     # Reusable UI primitives
│   ├── button.tsx
│   ├── input.tsx
│   ├── card.tsx
│   ├── avatar.tsx
│   ├── label.tsx
│   ├── icon.tsx
│   ├── text.tsx
│   ├── separator.tsx
│   └── popover.tsx
├── sign-in-form.tsx        # Sign in form component
├── sign-up-form.tsx        # Sign up form component
├── verify-email-form.tsx   # Email verification component
├── forgot-password-form.tsx
├── reset-password-form.tsx
├── social-connections.tsx  # OAuth provider buttons
├── user-menu.tsx           # User profile dropdown
└── theme-toggle.tsx        # Dark/light mode toggle
```

**Component Patterns**:
- UI components use React Native Reusables patterns
- Styled with NativeWind (Tailwind classes)
- Support dark mode via theme CSS variables
- Named exports for reusability

## lib/ - Shared Libraries

```
lib/
├── constants.tsx           # App-wide constants (logos, styles, etc.)
├── theme.ts                # Theme configuration (THEME, NAV_THEME)
├── utils.ts                # Utility functions (cn, etc.)
└── oauth-utils.ts          # OAuth flow helpers (username generation)
```

**Key Utilities**:
- `cn()` - Class name merger using clsx and tailwind-merge
- `THEME` - HSL color definitions for light/dark modes
- `NAV_THEME` - React Navigation theme adapter

## convex/ - Backend Functions

```
convex/
├── schema.ts               # Database schema definitions
├── todos.ts                # Todo queries & mutations
└── auth.config.ts          # Clerk authentication config
```

**Convex Patterns**:
- TypeScript-first schema with validators
- Queries: `query({ args, handler })`
- Mutations: `mutation({ args, handler })`
- Auth: `ctx.auth.getUserIdentity()`

## specs/ - Feature Specifications

```
specs/
└── 001-todo-list-status/
    ├── spec.md             # Feature specification
    ├── plan.md             # Implementation plan
    ├── tasks.md            # Task breakdown (to be generated)
    ├── research.md         # Technology decisions
    ├── data-model.md       # TypeScript interfaces
    ├── quickstart.md       # Developer guide
    └── contracts/
        ├── api.yaml        # OpenAPI spec
        └── convex-schema.md # Convex API contract
```

**Specification Structure**:
- Follows `/speckit.*` command pattern
- Each feature in numbered subdirectory
- Comprehensive planning artifacts

## Configuration Files

```
Root/
├── package.json            # Dependencies & scripts
├── tsconfig.json           # TypeScript config (strict mode, path aliases)
├── biome.json              # Biome linter/formatter config
├── tailwind.config.js      # Tailwind CSS configuration
├── metro.config.js         # Metro bundler config
├── babel.config.js         # Babel transpiler config
├── app.json                # Expo app configuration
├── components.json         # React Native Reusables config
├── global.css              # Global styles & CSS variables
├── .prettierrc             # Prettier config
├── .env.example            # Environment template
├── .env.development        # Dev environment vars (gitignored)
├── .env.production         # Prod environment vars (gitignored)
├── .env                    # Active environment (gitignored)
├── .gitignore              # Git ignore patterns
├── .npmrc                  # pnpm configuration
└── CLAUDE.md               # AI assistant instructions
```

## Important Directories to Ignore

- `.expo/` - Build artifacts
- `node_modules/` - Dependencies
- `.git/` - Git metadata
- `ios/build/` - iOS build output
- `android/build/` - Android build output

## Path Aliases

All imports use `@/*` alias mapping to project root:
```typescript
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LOGO } from '@/lib/constants';
```

Configured in `tsconfig.json`:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["*"]
    }
  }
}
```
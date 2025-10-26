# Suggested Commands

## Development Workflow

### Start Development Server
```bash
pnpm dev
# Automatically copies .env.development to .env and starts Expo dev server
# Then press: 'i' for iOS, 'a' for Android, 'w' for Web
```

### Platform-Specific Launch
```bash
pnpm android   # Run on Android in development mode
pnpm ios       # Run on iOS in development mode (Mac only)
pnpm web       # Run web app in development mode
```

## Code Quality (Run Before Committing)

### Linting
```bash
pnpm lint         # Check code with Biome
pnpm lint:fix     # Fix auto-fixable lint issues (includes unsafe fixes)
```

### Formatting
```bash
pnpm format       # Format code with Biome (write mode)
pnpm format:fix   # Format and apply unsafe fixes
```

## Production Builds

### Local Production Builds
```bash
pnpm android:prod  # Build and run Android release variant
pnpm ios:prod      # Build and run iOS release configuration
pnpm web:prod      # Run web with production env
```

### App Store Builds (requires EAS)
```bash
pnpm build:android  # Build for Google Play Store
pnpm build:ios      # Build for Apple App Store
```

## Utilities

### Clean Project
```bash
pnpm clean  # Remove .expo and node_modules directories
```

### Reinstall Dependencies
```bash
pnpm clean
pnpm install
```

## Convex Backend (for Todo Feature)

### Initialize Convex
```bash
npm install convex
npx convex dev  # Creates convex/ folder and deployment
```

### Convex Development Server
```bash
npx convex dev  # Watch for changes and sync schema
```

## Git Workflow
```bash
git status
git add .
git commit -m "feat: description"
git push
```

## Testing (Maestro - when implemented)
```bash
# Run all Maestro flows
maestro test .maestro/flows/

# Run specific feature tests
maestro test .maestro/flows/todos/

# Run with tags
maestro test --include-tags smokeTest .maestro/flows/
```

## Environment Setup
```bash
# Copy example environment file
cp .env.example .env.development

# Edit with your Clerk keys
# EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
```

## Common Darwin (macOS) System Commands
```bash
ls -la           # List all files including hidden
cd <directory>   # Change directory
pwd              # Print working directory
grep -r "text"   # Recursive search in files
find . -name     # Find files by name
open .           # Open current directory in Finder
```
# Sharing Session Maestro

A modern React Native starter template built with Expo, featuring complete authentication flows and cross-platform support.

Built with [Expo](https://expo.dev), [Clerk](https://go.clerk.com/gjgxNgT), and [React Native Reusables](https://reactnativereusables.com).

## ✨ Features

- ⚛️ **Expo Router** - File-based routing for iOS, Android, and Web
- 🔐 **Clerk Authentication** - Complete auth flows with OAuth support
- 🎨 **NativeWind** - Tailwind CSS styling for React Native
- 📦 **React Native Reusables** - Production-ready UI components
- 🌓 **Dark Mode** - Automatic theme switching with system preference
- 🚀 **New Architecture** - React Native's latest architecture enabled
- 🎯 **TypeScript** - Strict mode for type safety
- 🔧 **Biome** - Fast linting and formatting
- 🔒 **Protected Routes** - Authentication guards with Stack.Protected

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** 18+ installed
- **pnpm** package manager (`npm install -g pnpm`)
- **Expo CLI** (`npm install -g expo-cli`)
- **iOS Simulator** (Mac only) or **Android Emulator**

## 🚀 Quick Start

### 1. Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd sharing-session-maestro

# Install dependencies
pnpm install
```

### 2. Set Up Clerk Authentication

1. Create a Clerk account at [clerk.com](https://go.clerk.com/blVsQlm)
2. Create a new application
3. Configure authentication:
   - Enable **"Email, phone, username"** option
   - Add OAuth providers: **Apple**, **GitHub**, **Google**
4. Get your publishable keys from the [API Keys page](https://go.clerk.com/u8KAui7)

### 3. Configure Environment Variables

Create your environment files:

**`.env.development`** (for local development):
```bash
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_dev_key_here
```

**`.env.production`** (for production builds):
```bash
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_your_prod_key_here
```

> **Note:** The `.env.development` file is automatically copied to `.env` when you run `pnpm dev`

### 4. Start Development Server

```bash
pnpm dev
```

Then launch your preferred platform:
- Press **`i`** for iOS Simulator (Mac only)
- Press **`a`** for Android Emulator
- Press **`w`** for Web Browser

Or scan the QR code with [Expo Go](https://expo.dev/go) on your physical device.

## 🧪 Testing Authentication

Clerk provides special test credentials for development that bypass actual email/SMS delivery:

### Test Email Addresses
Use any email with `+clerk_test` suffix:
```
john+clerk_test@example.com
```
**Verification Code:** `424242`

### Test Phone Numbers
Use North American format with 555 prefix:
```
+1 (201) 555-0123
```
**Verification Code:** `424242`

### Quick Test Flow
1. Sign up with `test+clerk_test@example.com`
2. Use any password (minimum 8 characters)
3. Enter code `424242` when prompted
4. Check console for detailed logs (prefixed with `[SignUp]` or `[VerifyEmail]`)

## 📱 Available Commands

### Development

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server (copies .env.development) |
| `pnpm android` | Run on Android in development mode |
| `pnpm ios` | Run on iOS in development mode |
| `pnpm web` | Run web app in development mode |

### Production Builds

| Command | Description |
|---------|-------------|
| `pnpm android:prod` | Build and run Android release |
| `pnpm ios:prod` | Build and run iOS release |
| `pnpm web:prod` | Run web with production env |
| `pnpm build:android` | Build for Google Play Store (requires EAS) |
| `pnpm build:ios` | Build for Apple App Store (requires EAS) |

### Code Quality

| Command | Description |
|---------|-------------|
| `pnpm lint` | Check code with Biome |
| `pnpm lint:fix` | Fix auto-fixable lint issues |
| `pnpm format` | Format code with Biome |
| `pnpm format:fix` | Format and apply unsafe fixes |

### Utilities

| Command | Description |
|---------|-------------|
| `pnpm clean` | Remove .expo and node_modules |

## 📁 Project Structure

```
sharing-session-maestro/
├── app/                       # Expo Router (file-based routing)
│   ├── _layout.tsx           # Root layout with auth guards
│   ├── index.tsx             # Home screen (protected)
│   ├── (auth)/               # Authentication screens
│   │   ├── sign-in.tsx
│   │   ├── sign-up/
│   │   │   ├── _layout.tsx
│   │   │   ├── index.tsx
│   │   │   └── verify-email.tsx
│   │   ├── forgot-password.tsx
│   │   └── reset-password.tsx
│   ├── +html.tsx             # Web HTML wrapper
│   └── +not-found.tsx        # 404 page
│
├── components/
│   ├── ui/                   # Reusable UI primitives
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   └── ...
│   ├── sign-in-form.tsx      # Sign in form
│   ├── sign-up-form.tsx      # Sign up form
│   ├── verify-email-form.tsx # Email verification
│   ├── social-connections.tsx # OAuth buttons
│   ├── user-menu.tsx         # User profile dropdown
│   └── theme-toggle.tsx      # Dark/light mode toggle
│
├── lib/
│   ├── constants.ts          # App-wide constants
│   ├── theme.ts              # Theme configuration
│   ├── utils.ts              # Utility functions (cn, etc.)
│   └── oauth-utils.ts        # OAuth flow helpers
│
├── assets/                   # Images, fonts, etc.
├── .env.development          # Development environment vars
├── .env.production           # Production environment vars
├── .env.example              # Environment template
├── global.css                # Global styles & CSS variables
├── tailwind.config.js        # Tailwind configuration
└── biome.json                # Biome linter/formatter config
```

## 🎨 Styling Guide

### Path Aliases

Use the `@/` alias for cleaner imports:

```typescript
// ✅ Correct
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LOGO } from '@/lib/constants';

// ❌ Avoid
import { Button } from '../../components/ui/button';
```

### Theming

The app uses CSS variables for consistent theming:

```typescript
// ✅ Use theme variables
className="bg-background text-foreground"
className="bg-primary text-primary-foreground"

// ❌ Don't use hardcoded colors
className="bg-blue-500 text-white"
```

Theme is configured in `lib/theme.ts` with automatic dark mode support.

### Platform-Specific Styles

Use NativeWind's platform prefixes when needed:

```typescript
className="ios:pt-4 android:pt-2 web:pt-0"
```

## 🔐 Authentication Flow

The app uses Clerk for authentication with the following flow:

1. **App Launch** → Check auth state in `app/_layout.tsx`
2. **Not Signed In** → Show sign-in/sign-up screens
3. **OAuth Flow** → Auto-generate username via `lib/oauth-utils.ts`
4. **Email Verification** → Verify with code (424242 in dev mode)
5. **Signed In** → Access protected routes
6. **Session** → Auto-refresh handled by Clerk

### Protected Routes

Routes are guarded using `Stack.Protected`:

```typescript
// Only shown when NOT signed in
<Stack.Protected guard={!isSignedIn}>
  <Stack.Screen name="(auth)/sign-in" />
</Stack.Protected>

// Only shown when signed in
<Stack.Protected guard={isSignedIn}>
  <Stack.Screen name="index" />
</Stack.Protected>
```

## 🏗️ Building for Production

### Prerequisites

Install EAS CLI:
```bash
npm install -g eas-cli
eas login
```

### Configure EAS

```bash
eas build:configure
```

### Build for App Stores

**Android:**
```bash
pnpm build:android
```

**iOS:**
```bash
pnpm build:ios
```

Builds will be available in your EAS dashboard.

## 🧰 Tech Stack

| Technology | Purpose |
|-----------|---------|
| [Expo](https://expo.dev) | React Native framework |
| [Expo Router](https://expo.dev/router) | File-based routing |
| [Clerk](https://clerk.com) | Authentication & user management |
| [NativeWind](https://nativewind.dev) | Tailwind CSS for React Native |
| [React Native Reusables](https://reactnativereusables.com) | UI component library |
| [TypeScript](https://typescriptlang.org) | Type safety |
| [Biome](https://biomejs.dev) | Linting & formatting |
| [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) | Animations |

## 📚 Learn More

- [Clerk Documentation](https://clerk.com/docs)
- [Expo Documentation](https://docs.expo.dev/)
- [Expo Router Guide](https://expo.dev/router)
- [NativeWind Documentation](https://nativewind.dev/)
- [React Native Reusables](https://reactnativereusables.com)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)

## 🤝 Contributing

This project was created for a sharing session on Maestro testing. Feel free to use it as a template for your own projects!

## 📄 License

This project is open source and available under the MIT License.

---

**Made with ❤️ for the React Native community**

If this template helps you, consider giving [React Native Reusables](https://github.com/founded-labs/react-native-reusables) a ⭐ on GitHub!

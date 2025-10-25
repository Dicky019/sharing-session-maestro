# Sharing Session Maestro

This is a [React Native](https://reactnative.dev) project built with [Expo](https://expo.dev), [Clerk](https://go.clerk.com/gjgxNgT), and [React Native Reusables](https://reactnativereusables.com).

It was initialized using the following command:

```bash
npx @react-native-reusables/cli@latest init -t sharing-session-maestro
```

## Getting Started

### Prerequisites

Before running the app, make sure to:

1. [Set up your Clerk account](https://go.clerk.com/blVsQlm)
2. In the instance setup, leave the default option selected: **Email, phone, username**
3. Enable Apple, GitHub, and Google as sign-in options under SSO Connections
4. Get your Clerk publishable keys:
   - Development key from [your API keys](https://go.clerk.com/u8KAui7)
   - Production key (create a separate Clerk instance for production)

### Environment Setup

This project uses separate environment files for development and production:

**For Development:**
1. Update `.env.development` with your development Clerk key:
   ```
   EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_dev_key
   ```

**For Production:**
1. Update `.env.production` with your production Clerk key:
   ```
   EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_your_prod_key
   ```

### Installation

```bash
# Install dependencies
pnpm install

# or
npm install
# or
yarn install
```

## Development

### Start Development Server

```bash
pnpm dev
```

This will:
- Copy `.env.development` to `.env`
- Launch the Expo development server

You can then open the app with:
- **iOS**: press `i` to launch in the iOS simulator (Mac only)
- **Android**: press `a` to launch in the Android emulator
- **Web**: press `w` to run in a browser

Or scan the QR code with the [Expo Go](https://expo.dev/go) app to test on your device.

### Platform-Specific Development

```bash
# Run on Android (development)
pnpm android

# Run on iOS (development)
pnpm ios

# Run on Web (development)
pnpm web
```

## Production

### Testing Production Build Locally

```bash
# Test production mode in development server
pnpm dev:prod

# Run production builds on specific platforms
pnpm android:prod  # Android release build
pnpm ios:prod      # iOS release build
pnpm web:prod      # Web production build
```

### Building for App Stores

```bash
# Build for Android (requires EAS CLI)
pnpm build:android

# Build for iOS (requires EAS CLI)
pnpm build:ios
```

**Note:** Building for app stores requires [Expo Application Services (EAS)](https://docs.expo.dev/build/introduction/). Make sure to:
1. Install EAS CLI: `npm install -g eas-cli`
2. Login: `eas login`
3. Configure your project: `eas build:configure`

## Project Structure

```
sharing-session-maestro/
├── app/                      # Expo Router pages
│   ├── (auth)/              # Authentication screens
│   │   ├── sign-in.tsx
│   │   ├── sign-up/
│   │   ├── forgot-password.tsx
│   │   └── reset-password.tsx
│   ├── _layout.tsx          # Root layout with providers
│   ├── index.tsx            # Main authenticated screen
│   └── constants.tsx        # Shared constants
├── components/              # React components
│   ├── ui/                  # Reusable UI components
│   ├── sign-in-form.tsx
│   ├── sign-up-form.tsx
│   ├── user-menu.tsx
│   ├── theme-toggle.tsx
│   └── ...
├── lib/                     # Utilities and configurations
│   ├── utils.ts             # Helper functions
│   ├── theme.ts             # Theme configuration
│   └── constants.tsx        # App-wide constants
├── assets/                  # Images, fonts, etc.
├── .env.development         # Development environment variables
├── .env.production          # Production environment variables
└── .env.example             # Environment template
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start development server with development env |
| `pnpm dev:prod` | Start server with production env (for testing) |
| `pnpm android` | Run Android app in development mode |
| `pnpm android:prod` | Build and run Android release |
| `pnpm ios` | Run iOS app in development mode |
| `pnpm ios:prod` | Build and run iOS release |
| `pnpm web` | Run web app in development mode |
| `pnpm web:prod` | Run web app with production env |
| `pnpm build:android` | Build Android app for Play Store |
| `pnpm build:ios` | Build iOS app for App Store |
| `pnpm clean` | Remove build artifacts and node_modules |

## Included Screens and Features

- Protected routes using Clerk authentication
- Sign in screen with email/password
- OAuth with Apple, GitHub, and Google
- Sign up flow with email verification
- Forgot password screen
- Reset password screen
- User profile menu with sign out
- Light/Dark theme toggle
- Responsive design for mobile and web

## Project Features

- ⚛️ Built with [Expo Router](https://expo.dev/router) (file-based routing)
- 🔐 Authentication powered by [Clerk](https://go.clerk.com/Q1MKAz0)
- 🎨 Styled with [Tailwind CSS](https://tailwindcss.com/) via [NativeWind](https://www.nativewind.dev/)
- 📦 UI powered by [React Native Reusables](https://github.com/founded-labs/react-native-reusables)
- 🚀 React Native New Architecture enabled
- 🔥 Edge to Edge enabled
- 📱 Runs on iOS, Android, and Web
- 🌓 Dark mode support
- 🔒 Protected routes with authentication guards
- 🎯 TypeScript with strict mode
- 💅 Prettier for code formatting

## Environment Variables

This project uses environment-specific configuration:

### `.env.development`
Used for local development and testing. Contains development Clerk keys and API endpoints.

### `.env.production`
Used for production builds and deployments. Contains production Clerk keys and API endpoints.

### `.env.example`
Template file showing required environment variables.

**Important:** Never commit `.env` file. The build scripts automatically copy the appropriate environment file (`.env.development` or `.env.production`) to `.env` before running.

## Path Aliases

The project uses TypeScript path aliases for cleaner imports:

```typescript
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { LOGO } from '@/lib/constants'
```

Configuration is in `tsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["*"]
    }
  }
}
```

## Theming

The app supports light and dark modes:
- Theme configuration is in `lib/theme.ts`
- Uses CSS variables for theme tokens
- Automatically adapts to system preference
- Manual toggle available via `ThemeToggle` component

## Learn More

- [Clerk Docs](https://go.clerk.com/Q1MKAz0)
- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [Expo Docs](https://docs.expo.dev/)
- [Expo Router Docs](https://expo.dev/router)
- [NativeWind Docs](https://www.nativewind.dev/)
- [React Native Reusables](https://reactnativereusables.com)

## Contributing

This project was created for a sharing session on Maestro testing. Feel free to use it as a template for your own projects!

---

If this template helps you move faster, consider giving [React Native Reusables](https://github.com/founded-labs/react-native-reusables) a ⭐ on GitHub. It helps a lot!

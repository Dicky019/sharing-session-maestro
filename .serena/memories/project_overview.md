# Project Overview

## Purpose
A modern React Native starter template built with Expo for a sharing session on Maestro testing. The project features complete authentication flows using Clerk and cross-platform support (iOS, Android, Web).

Currently building a **Todo List with Status Management** feature that uses:
- Convex for real-time backend database
- Clerk authentication with userId isolation
- Three status categories: Active, Inactive (Terlewat), Complete
- Cross-device data synchronization

## Tech Stack

### Core Framework
- **Expo SDK 54+**: React Native framework with New Architecture enabled
- **React Native 0.81.5**: Mobile framework
- **React 19.1.0**: UI library
- **TypeScript 5.9.2**: Type safety with strict mode enabled

### Backend & Authentication
- **Convex 1.28.0**: Real-time database with TypeScript functions
- **Clerk (@clerk/clerk-expo 2.16.1)**: Authentication with OAuth support (Apple, GitHub, Google)
- **Clerk + Convex Integration**: JWT-based authentication via `ctx.auth.getUserIdentity()`

### Routing & Navigation
- **Expo Router 6.0.10**: File-based routing
- **React Navigation 7.0.0**: Navigation primitives

### UI & Styling
- **NativeWind 4.2.1**: Tailwind CSS for React Native
- **React Native Reusables**: UI component library (@rn-primitives/*)
- **Lucide React Native 0.545.0**: Icon library
- **Tailwind CSS 3.4.14**: Utility-first CSS
- **Class Variance Authority**: Component variants

### Code Quality
- **Biome 2.3.0**: Fast linting and formatting
- **Prettier 3.6.2**: Code formatting with Tailwind plugin
- **TypeScript Strict Mode**: Type checking

### Animations & Effects
- **React Native Reanimated 4.1.1**: High-performance animations
- **React Native Worklets 0.5.1**: Worklet support

### Platform Support
- iOS 15+
- Android 5.0+
- Web (modern browsers)

## Package Manager
- **pnpm**: Configured in `.npmrc`
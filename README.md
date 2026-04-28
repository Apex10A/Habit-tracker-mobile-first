# Habit Tracker PWA

A lightweight, offline-first Progressive Web App (PWA) built with Next.js to help you track daily habits and build streaks.

## Project Overview
This application allows users to create, manage, and track daily habits. It features a dashboard with streak visualization, habit completion toggling, and full offline support via a Service Worker.

## Setup Instructions
1. Navigate to the `habit` directory: `cd habit`
2. Install dependencies: `npm install`

## Run Instructions
- Development: `npm run dev`
- Production Build: `npm run build`
- Production Start: `npm run start`

## Test Instructions
- Unit Tests: `npm run test:unit`
- Integration Tests: `npm run test:integration`
- E2E Tests: `npm run test:e2e`
- All Tests: `npm run test`

## LocalStorage Structure
The app persists data entirely in the browser's localStorage using three keys:
- `habit-tracker-users`: Stores user credentials and profile information.
- `habit-tracker-session`: Manages the currently active user session.
- `habit-tracker-habits`: Stores all habit definitions and completion logs.

## PWA Support
- **Service Worker**: Caches the app shell and core assets for offline access.
- **Manifest**: Provides app metadata for installation on mobile and desktop.
- **Offline Mode**: The app loads from cache when no network connection is available.

## Trade-offs and Limitations
- **LocalStorage Storage**: Data is limited to the current browser/device and can be cleared by the user.
- **Daily Frequency**: Currently only supports daily habit tracking.
- **Client-Side Auth**: Simple localStorage-based authentication for demo purposes.

## Test Mapping
| Test File | Behavior Verified |
|-----------|-------------------|
| `tests/unit/slug.test.ts` | Slug generation logic and edge cases |
| `tests/unit/validators.test.ts` | Habit name validation rules |
| `tests/unit/streaks.test.ts` | Current streak calculation logic |
| `tests/unit/habits.test.ts` | Habit completion toggling and immutability |
| `tests/integration/auth-flow.test.tsx` | Signup/Login UI and session management |
| `tests/integration/habit-form.test.tsx` | Habit CRUD operations and UI updates |
| `tests/e2e/app.spec.ts` | Full user journeys, redirects, and offline support |

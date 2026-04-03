# Pathfindr Mobile Application

React Native mobile application built with Expo, TypeScript, and React Navigation.

## Tech Stack

- **Framework:** React Native with Expo
- **Language:** TypeScript
- **Navigation:** React Navigation (Stack + Bottom Tabs)
- **State Management:** Redux Toolkit
- **Data Fetching:** TanStack Query (React Query)
- **HTTP Client:** Axios
- **Authentication:** Expo Local Authentication (Biometrics)
- **Notifications:** Expo Notifications
- **Storage:** Expo Secure Store

## Directory Structure

```
src/
├── screens/          # Screen components
├── components/       # Reusable components
├── navigation/       # Navigation configuration
├── services/         # API services
├── hooks/            # Custom hooks
├── store/            # Redux store and slices
├── types/            # TypeScript types
└── utils/            # Utility functions
```

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

3. Start the development server:
```bash
npm start
```

4. Run on specific platform:
```bash
npm run ios        # Run on iOS simulator
npm run android    # Run on Android emulator
npm run web        # Run on web browser
```

## Building for Production

### Using EAS (Expo Application Services)

1. Install EAS CLI:
```bash
npm install -g eas-cli
```

2. Configure EAS:
```bash
eas build:configure
```

3. Build for Android:
```bash
npm run build:android
```

4. Build for iOS:
```bash
npm run build:ios
```

## Features

### Implemented
- ✅ Home/Landing screen
- ✅ Authentication screens (Login/Register)
- ✅ Redux state management
- ✅ Navigation setup
- ✅ TypeScript types

### To Be Implemented
- [ ] Student Dashboard
- [ ] UAP Creation & Management
- [ ] Scholarship Browsing
- [ ] University Discovery
- [ ] Job/Internship Listings
- [ ] Application Tracking
- [ ] Push Notifications
- [ ] Biometric Authentication
- [ ] Document Upload (Camera/Gallery)
- [ ] Offline Mode
- [ ] Deep Linking

## Platform Requirements

- **iOS:** 14.0+
- **Android:** 10+ (API Level 29+)
- **Node.js:** 18+
- **Expo SDK:** 50+

## Learn More

- [Expo Documentation](https://docs.expo.dev)
- [React Native Documentation](https://reactnative.dev)
- [React Navigation](https://reactnavigation.org)

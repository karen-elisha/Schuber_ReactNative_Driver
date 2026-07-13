# 🚌 Schuber Admin Mobile App (React Native + Expo)

Welcome to the **Schuber Admin** mobile application. This repository contains the administrative panel application built on React Native and configured as an Expo-managed workflow (compatible with Expo SDK 54 and Expo Go).

---

## 🚀 Key Features

*   **Expo Go Support**: Pure JavaScript ecosystem optimized for rapid development and testing without requiring native Android (`android/`) or iOS (`ios/`) build pipelines.
*   **Firebase Integration**:
    *   **Authentication**: Real-time admin creation and secure login checking via `signInWithEmailAndPassword` and `createUserWithEmailAndPassword`.
    *   **Firestore Database**: Persists detailed admin user accounts in the `admins` collection under their corresponding Firebase Authentication `uid`.
    *   **Session Persistence**: Enabled `AsyncStorage` persistent authentication state so admin user logins remain cached on the device when the app is restarted.
*   **Input Controls**:
    *   **Mobile Number Restriction**: The registration form is configured to accept exactly `10` digits for the phone field and automatically filters out non-numeric characters (letters, spaces, prefixes) in real-time.
*   **Clean Testing Suite**: Robust, pre-configured test suite powered by `jest-expo` and mocked native dependencies (`AsyncStorage`, `react-native-gesture-handler`, and `react-native-safe-area-context`).
*   **Warning-Free Interface**: Globally suppresses minor warning toasts and banners via `LogBox.ignoreAllLogs()` to provide a polished user experience.

---

## 🛠️ Getting Started

### Prerequisites

1.  Download and install the **Expo Go** application on your mobile device (Android Google Play Store or iOS App Store).
2.  Install [Node.js](https://nodejs.org) (v18+ recommended) on your development computer.

### Step 1: Install Dependencies

From the project root directory, run the following command to download and build all package dependencies:

```sh
# For PowerShell/Windows environments:
npm.cmd install --legacy-peer-deps
```

### Step 2: Configure Environment Credentials

Because Firebase credentials are excluded from Git tracking for safety, you must create a local `.env` file in the project root:

1. **Copy the Template**: Copy `.env.example` to a new file named `.env` in the root of the project.
2. **Add Credentials**: Open the newly created `.env` file and enter your Firebase project parameters:
   ```env
   EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key-here
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=schuber-12563.firebaseapp.com
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=schuber-12563
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=schuber-12563.firebasestorage.app
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=767178914651
   EXPO_PUBLIC_FIREBASE_APP_ID=1:767178914651:android:8790d9da8b72dbd094f87e
   ```
3. **Save**: Save the file. The Expo server will automatically load these variables at start.
4. **Standalone Builds (Optional)**: If you intend to compile standalone native APKs/AABs or use EAS Build, make sure to save your own copy of `google-services.json` in the project root directory (which is untracked by Git).

---

## 📱 Testing and Development

### Running the App on Expo Go

To start the Metro Bundler and generate the QR code, run:

```sh
npx.cmd expo start --clear
```

1.  A QR code will print in your terminal window.
2.  **Android**: Open the **Expo Go** application and select "Scan QR Code".
3.  **iOS**: Open your default **Camera App** and scan the QR code to prompt launching in Expo Go.

### Running Lint Checks

To run the ESLint static code analyzer:

```sh
npm.cmd run lint
```

### Running Unit Tests

To run the Jest test suite:

```sh
npm.cmd test
```

---

## 📂 Project Architecture

```
├── __tests__/            # Jest unit tests
├── navigation/           # Stack navigator navigation configurations
├── screens/              # App screens (Dashboard, Login, SignUp, Details, etc.)
├── App.tsx               # App entry point component
├── firebase.js           # Firebase SDK initialization settings
├── google-services.json  # Firebase Android configuration file
├── app.json              # Expo application manifest
└── package.json          # Node dependencies and scripts
```

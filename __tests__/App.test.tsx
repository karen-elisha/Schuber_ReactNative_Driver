/**
 * @format
 */

import 'react-native-gesture-handler/jestSetup';
import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.useFakeTimers();



jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const inset = { top: 0, left: 0, right: 0, bottom: 0 };
  const frame = { x: 0, y: 0, width: 390, height: 844 };
  const mockContext = React.createContext({ insets: inset, frame });
  return {
    SafeAreaProvider: ({ children }) => children,
    SafeAreaView: ({ children }) => children,
    SafeAreaConsumer: ({ children }) => children(inset),
    useSafeAreaInsets: () => inset,
    useSafeAreaFrame: () => frame,
    SafeAreaContext: mockContext,
    SafeAreaInsetsContext: mockContext,
    initialWindowMetrics: {
      fallback: true,
      frame,
      insets: inset,
    },
  };
});

jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
}));

jest.mock('firebase/auth', () => ({
  initializeAuth: jest.fn(),
  getReactNativePersistence: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  doc: jest.fn(),
  setDoc: jest.fn(),
  getDoc: jest.fn(),
}));

jest.mock('../firebase', () => ({
  auth: {},
  db: {},
}));

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});

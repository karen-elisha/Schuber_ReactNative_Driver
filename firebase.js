import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyCjjsdekq606kSzuOrQ01HXyjetcMSLGyA",
  authDomain: "schuber-12563.firebaseapp.com",
  projectId: "schuber-12563",
  storageBucket: "schuber-12563.firebasestorage.app",
  messagingSenderId: "767178914651",
  appId: "1:767178914651:android:8790d9da8b72dbd094f87e"
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

const db = getFirestore(app);

export { app, auth, db };

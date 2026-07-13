import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Animated,
  BackHandler,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
// If you're not using Expo / don't have expo-linear-gradient installed, run:
// npx expo install expo-linear-gradient
// or swap the <LinearGradient> wrapper below for a plain <View style={styles.container}>.

const STORAGE_KEY = 'SchuberDriver';

import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';


export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [securePassword, setSecurePassword] = useState(true);


  // Animations
  const appNameOpacity = useRef(new Animated.Value(0)).current;
  const cardTranslateY = useRef(new Animated.Value(100)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardShakeX = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(1)).current;

  const checkAutoLogin = useCallback(async () => {
    const isLoggedIn = await AsyncStorage.getItem(`${STORAGE_KEY}:isAdminLoggedIn`);
    if (isLoggedIn === 'true') {
      navigation.replace('Dashboard');
    }
  }, [navigation]);

  const seedDemoCredentials = useCallback(async () => {
    const registered = await AsyncStorage.getItem(`${STORAGE_KEY}:admin_registered`);
    if (!registered) {
      await AsyncStorage.multiSet([
        [`${STORAGE_KEY}:admin_name`, 'Super Admin'],
        [`${STORAGE_KEY}:admin_email`, 'admin@schuber.com'],
        [`${STORAGE_KEY}:admin_phone`, '+91 98765 00000'],
        [`${STORAGE_KEY}:admin_password`, 'admin123'],
        [`${STORAGE_KEY}:admin_role`, 'SUPER_ADMIN'],
        [`${STORAGE_KEY}:admin_registered`, 'true'],
      ]);
    }
  }, []);

  const setupAnimations = useCallback(() => {
    Animated.timing(appNameOpacity, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    Animated.parallel([
      Animated.timing(cardTranslateY, {
        toValue: 0,
        duration: 600,
        delay: 300,
        useNativeDriver: true,
      }),
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 600,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [appNameOpacity, cardTranslateY, cardOpacity]);

  const shakeCard = useCallback(() => {
    Animated.sequence([
      Animated.timing(cardShakeX, { toValue: 20, duration: 80, useNativeDriver: true }),
      Animated.timing(cardShakeX, { toValue: -40, duration: 80, useNativeDriver: true }),
      Animated.timing(cardShakeX, { toValue: 40, duration: 80, useNativeDriver: true }),
      Animated.timing(cardShakeX, { toValue: 0, duration: 80, useNativeDriver: true }),
    ]).start();
  }, [cardShakeX]);

  const bounceCard = useCallback((onEnd) => {
    Animated.sequence([
      Animated.timing(cardScale, { toValue: 0.97, duration: 150, useNativeDriver: true }),
      Animated.timing(cardScale, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start(onEnd);
  }, [cardScale]);

  const validate = useCallback(() => {
    let valid = true;
    setEmailError('');
    setPasswordError('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Email is required');
      valid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Invalid email format');
      valid = false;
    } else if (!password) {
      setPasswordError('Password is required');
      valid = false;
    } else if (password.length < 6) {
      setPasswordError('Minimum 6 characters');
      valid = false;
    }
    return valid;
  }, [email, password]);

  const performLogin = useCallback(async () => {
    console.log('LOGIN: start');
    setLoading(true);
    try {
      // 1. Authenticate with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Fetch admin details from Firestore (to check if they exist in the admins collection)
      let nameValue = 'Admin';
      const adminDoc = await getDoc(doc(db, 'admins', user.uid));
      if (adminDoc.exists()) {
        const data = adminDoc.data();
        nameValue = data.name || 'Admin';
      } else {
        // If not in admins, check if user exists in the general users collection or is admin
        console.log('User is not explicitly in admins collection, fallback to general login');
      }

      // 3. Save local login session state
      await AsyncStorage.multiSet([
        [`${STORAGE_KEY}:isAdminLoggedIn`, 'true'],
        [`${STORAGE_KEY}:loginTimestamp`, Date.now().toString()],
        [`${STORAGE_KEY}:admin_name`, nameValue],
        [`${STORAGE_KEY}:admin_email`, email],
      ]);
      console.log('LOGIN: completed successfully');
      setLoading(false);
      navigation.replace('Dashboard');
    } catch (err) {
      console.log('LOGIN: failed', err);
      setLoading(false);
      let errorMsg = err?.message || String(err);
      if (
        err?.code === 'auth/invalid-credential' ||
        err?.code === 'auth/user-not-found' ||
        err?.code === 'auth/wrong-password'
      ) {
        errorMsg = 'Invalid email or password. Please try again.';
      }
      Alert.alert('Login Failed', errorMsg);
    }
  }, [email, password, navigation]);

  const handleLoginPress = useCallback(() => {
    if (!validate()) {
      shakeCard();
      return;
    }
    bounceCard(() => {
      performLogin();
    });
  }, [validate, shakeCard, bounceCard, performLogin]);

  const showForgotPassword = useCallback(async () => {
    const savedEmail = await AsyncStorage.getItem(`${STORAGE_KEY}:admin_email`);
    const savedPassword = await AsyncStorage.getItem(`${STORAGE_KEY}:admin_password`);
    Alert.alert(
      'Password Recovery',
      `Your registered credentials:\n\nEmail: ${savedEmail}\nPassword: ${savedPassword}\n\nPlease keep these safe.`,
      [{ text: 'OK' }]
    );
  }, []);

  const handleBackPress = useCallback(() => {
    Alert.alert('Exit App', 'Do you want to exit?', [
      { text: 'Yes', onPress: () => BackHandler.exitApp() },
      { text: 'No' },
    ]);
    return true;
  }, []);

  useEffect(() => {
    checkAutoLogin();
    setupAnimations();
    seedDemoCredentials();

    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => backHandler.remove();
  }, [checkAutoLogin, setupAnimations, seedDemoCredentials, handleBackPress]);

  return (
    <LinearGradient colors={['#FFF7E1', '#FCE7B8']} style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flexFill}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          {/* App Name */}
          <Animated.Text style={[styles.appName, { opacity: appNameOpacity }]}>
            🚌 Schuber Admin
          </Animated.Text>
          <Text style={styles.subtitle}>School Transport Management</Text>

          {/* Login Card */}
          <Animated.View
            style={[
              styles.card,
              {
                opacity: cardOpacity,
                transform: [
                  { translateY: cardTranslateY },
                  { translateX: cardShakeX },
                  { scale: cardScale },
                ],
              },
            ]}
          >
            <Text style={styles.cardTitle}>Admin Login</Text>

            {/* Email */}
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, emailError ? styles.inputError : null]}
              placeholder="admin@schuber.com"
              placeholderTextColor="#9B9B9B"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={(t) => { setEmail(t); setEmailError(''); }}
            />
            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

            {/* Password */}
            <Text style={styles.label}>Password</Text>
            <View style={[styles.inputContainer, passwordError ? styles.inputErrorContainer : null]}>
              <TextInput
                style={styles.passwordInput}
                placeholder="••••••"
                placeholderTextColor="#9B9B9B"
                secureTextEntry={securePassword}
                value={password}
                onChangeText={(t) => { setPassword(t); setPasswordError(''); }}
              />
              <TouchableOpacity onPress={() => setSecurePassword(!securePassword)} style={styles.eyeButton}>
                <Ionicons name={securePassword ? 'eye-off' : 'eye'} size={20} color="#6B6B6B" />
              </TouchableOpacity>
            </View>
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

            {/* Forgot Password */}
            <TouchableOpacity onPress={showForgotPassword} style={styles.forgotWrap}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
              onPress={handleLoginPress}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loginBtnText}>LOGIN</Text>
              )}
            </TouchableOpacity>

            {/* Sign Up Link */}
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')} style={styles.signupWrap}>
              <Text style={styles.signupText}>
                New admin?{' '}
                <Text style={styles.signupLink}>Sign Up</Text>
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flexFill: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  appName: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1F1B24',
    letterSpacing: 1,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B6B6B',
    marginBottom: 40,
    letterSpacing: 0.5,
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 28,
    borderWidth: 1,
    borderColor: '#EFEAE0',
    shadowColor: '#4E3A85',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F1B24',
    marginBottom: 24,
    textAlign: 'center',
  },
  label: {
    fontSize: 13,
    color: '#6B6B6B',
    marginBottom: 6,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#F6F6F6',
    borderWidth: 1,
    borderColor: '#EFEAE0',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#1F1B24',
    fontSize: 15,
    marginBottom: 6,
  },
  inputError: {
    borderColor: '#E14434',
  },
  errorText: {
    color: '#E14434',
    fontSize: 12,
    marginBottom: 8,
  },
  forgotWrap: {
    alignSelf: 'flex-end',
    marginBottom: 24,
    marginTop: 4,
  },
  forgotText: {
    color: '#664EA4',
    fontSize: 13,
    fontWeight: '500',
  },
  loginBtn: {
    backgroundColor: '#664EA4',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginBtnDisabled: {
    opacity: 0.6,
  },
  loginBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 1,
  },
  signupWrap: {
    alignItems: 'center',
  },
  signupText: {
    color: '#6B6B6B',
    fontSize: 14,
  },
  signupLink: {
    color: '#E07C00',
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F6F6',
    borderWidth: 1,
    borderColor: '#EFEAE0',
    borderRadius: 10,
    paddingHorizontal: 16,
    marginBottom: 6,
  },
  inputErrorContainer: {
    borderColor: '#E14434',
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    color: '#1F1B24',
    fontSize: 15,
  },
  eyeButton: {
    paddingLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
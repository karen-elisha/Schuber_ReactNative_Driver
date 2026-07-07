import React, { useState, useEffect, useRef } from 'react';
import {
  View,
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
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'SchuberAdmin';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Animations
  const appNameOpacity = useRef(new Animated.Value(0)).current;
  const cardTranslateY = useRef(new Animated.Value(100)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardShakeX = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    checkAutoLogin();
    setupAnimations();
    seedDemoCredentials();

    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => backHandler.remove();
  }, []);

  const checkAutoLogin = async () => {
    const isLoggedIn = await AsyncStorage.getItem(`${STORAGE_KEY}:isAdminLoggedIn`);
    if (isLoggedIn === 'true') {
      navigation.replace('Dashboard');
    }
  };

  const seedDemoCredentials = async () => {
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
  };

  const setupAnimations = () => {
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
  };

  const shakeCard = () => {
    Animated.sequence([
      Animated.timing(cardShakeX, { toValue: 20, duration: 80, useNativeDriver: true }),
      Animated.timing(cardShakeX, { toValue: -40, duration: 80, useNativeDriver: true }),
      Animated.timing(cardShakeX, { toValue: 40, duration: 80, useNativeDriver: true }),
      Animated.timing(cardShakeX, { toValue: 0, duration: 80, useNativeDriver: true }),
    ]).start();
  };

  const bounceCard = (onEnd) => {
    Animated.sequence([
      Animated.timing(cardScale, { toValue: 0.97, duration: 150, useNativeDriver: true }),
      Animated.timing(cardScale, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start(onEnd);
  };

  const validate = () => {
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
  };

  const performLogin = async () => {
    if (!validate()) return;

    setLoading(true);

    const savedEmail = await AsyncStorage.getItem(`${STORAGE_KEY}:admin_email`);
    const savedPassword = await AsyncStorage.getItem(`${STORAGE_KEY}:admin_password`);
    const adminName = await AsyncStorage.getItem(`${STORAGE_KEY}:admin_name`);

    if (email === savedEmail && password === savedPassword) {
      await AsyncStorage.multiSet([
        [`${STORAGE_KEY}:isAdminLoggedIn`, 'true'],
        [`${STORAGE_KEY}:loginTimestamp`, Date.now().toString()],
      ]);
      setLoading(false);
      bounceCard(() => {
        Alert.alert('', `Welcome, ${adminName || 'Admin'}!`);
        navigation.replace('Dashboard');
      });
    } else {
      setLoading(false);
      shakeCard();
      Alert.alert('Login Failed', 'Invalid email or password. Please try again.', [
        { text: 'Try Again' },
      ]);
    }
  };

  const showForgotPassword = async () => {
    const savedEmail = await AsyncStorage.getItem(`${STORAGE_KEY}:admin_email`);
    const savedPassword = await AsyncStorage.getItem(`${STORAGE_KEY}:admin_password`);
    Alert.alert(
      'Password Recovery',
      `Your registered credentials:\n\nEmail: ${savedEmail}\nPassword: ${savedPassword}\n\nPlease keep these safe.`,
      [{ text: 'OK' }]
    );
  };

  const handleBackPress = () => {
    Alert.alert('Exit App', 'Do you want to exit?', [
      { text: 'Yes', onPress: () => BackHandler.exitApp() },
      { text: 'No' },
    ]);
    return true;
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
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
            placeholderTextColor="#aaa"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={(t) => { setEmail(t); setEmailError(''); }}
          />
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

          {/* Password */}
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={[styles.input, passwordError ? styles.inputError : null]}
            placeholder="••••••"
            placeholderTextColor="#aaa"
            secureTextEntry
            value={password}
            onChangeText={(t) => { setPassword(t); setPasswordError(''); }}
          />
          {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

          {/* Forgot Password */}
          <TouchableOpacity onPress={showForgotPassword} style={styles.forgotWrap}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
            onPress={performLogin}
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
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
    color: '#f8fafc',
    letterSpacing: 1,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 40,
    letterSpacing: 0.5,
  },
  card: {
    width: '100%',
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#f1f5f9',
    marginBottom: 24,
    textAlign: 'center',
  },
  label: {
    fontSize: 13,
    color: '#94a3b8',
    marginBottom: 6,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#f1f5f9',
    fontSize: 15,
    marginBottom: 6,
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginBottom: 8,
  },
  forgotWrap: {
    alignSelf: 'flex-end',
    marginBottom: 24,
    marginTop: 4,
  },
  forgotText: {
    color: '#3b82f6',
    fontSize: 13,
    fontWeight: '500',
  },
  loginBtn: {
    backgroundColor: '#3b82f6',
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
    color: '#94a3b8',
    fontSize: 14,
  },
  signupLink: {
    color: '#3b82f6',
    fontWeight: '600',
  },
});

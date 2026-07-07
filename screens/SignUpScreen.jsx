import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'SchuberAdmin';

export default function SignUpScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({});

  const setError = (field, message) => {
    setErrors((prev) => ({ ...prev, [field]: message }));
  };

  const clearError = (field) => {
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setErrors({});

    if (!name) { setError('name', 'Name is required'); return false; }
    if (!email) { setError('email', 'Email is required'); return false; }
    if (!emailRegex.test(email)) { setError('email', 'Invalid email format'); return false; }
    if (!phone) { setError('phone', 'Phone is required'); return false; }
    if (phone.length < 10) { setError('phone', 'Enter valid phone number'); return false; }
    if (!password) { setError('password', 'Password is required'); return false; }
    if (password.length < 6) { setError('password', 'Minimum 6 characters'); return false; }
    if (confirmPassword !== password) { setError('confirmPassword', 'Passwords do not match'); return false; }

    const savedEmail = await AsyncStorage.getItem(`${STORAGE_KEY}:admin_email`);
    if (savedEmail === email) { setError('email', 'Email already registered'); return false; }

    return true;
  };

  const performSignUp = async () => {
    const valid = await validate();
    if (!valid) return;

    setLoading(true);

    await AsyncStorage.multiSet([
      [`${STORAGE_KEY}:admin_name`, name],
      [`${STORAGE_KEY}:admin_email`, email],
      [`${STORAGE_KEY}:admin_phone`, phone],
      [`${STORAGE_KEY}:admin_password`, password],
      [`${STORAGE_KEY}:admin_role`, 'ADMIN'],
      [`${STORAGE_KEY}:admin_registered`, 'true'],
    ]);

    setLoading(false);

    Alert.alert(
      'Registration Successful!',
      `Welcome ${name}!\n\nYour admin account has been created.\nEmail: ${email}\n\nYou can now login with your credentials.`,
      [
        {
          text: 'Go to Login',
          onPress: () => navigation.replace('Login'),
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

          {/* Title */}
          <Text style={styles.appName}>🚌 Schuber Admin</Text>
          <Text style={styles.subtitle}>Create Admin Account</Text>

          {/* Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Sign Up</Text>

            {/* Name */}
            <Field
              label="Full Name"
              placeholder="Super Admin"
              value={name}
              onChangeText={(t) => { setName(t); clearError('name'); }}
              error={errors.name}
            />

            {/* Email */}
            <Field
              label="Email"
              placeholder="admin@schuber.com"
              value={email}
              onChangeText={(t) => { setEmail(t); clearError('email'); }}
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            {/* Phone */}
            <Field
              label="Phone"
              placeholder="+91 98765 00000"
              value={phone}
              onChangeText={(t) => { setPhone(t); clearError('phone'); }}
              error={errors.phone}
              keyboardType="phone-pad"
            />

            {/* Password */}
            <Field
              label="Password"
              placeholder="••••••"
              value={password}
              onChangeText={(t) => { setPassword(t); clearError('password'); }}
              error={errors.password}
              secureTextEntry
            />

            {/* Confirm Password */}
            <Field
              label="Confirm Password"
              placeholder="••••••"
              value={confirmPassword}
              onChangeText={(t) => { setConfirmPassword(t); clearError('confirmPassword'); }}
              error={errors.confirmPassword}
              secureTextEntry
            />

            {/* Sign Up Button */}
            <TouchableOpacity
              style={[styles.signupBtn, loading && styles.btnDisabled]}
              onPress={performSignUp}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.signupBtnText}>CREATE ACCOUNT</Text>
              )}
            </TouchableOpacity>

            {/* Login Link */}
            <TouchableOpacity
              onPress={() => navigation.replace('Login')}
              style={styles.loginWrap}
            >
              <Text style={styles.loginText}>
                Already have an account?{' '}
                <Text style={styles.loginLink}>Login</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Field({ label, placeholder, value, onChangeText, error, secureTextEntry, keyboardType, autoCapitalize }) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, error ? styles.inputError : null]}
        placeholder={placeholder}
        placeholderTextColor="#aaa"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType || 'default'}
        autoCapitalize={autoCapitalize || 'words'}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
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
    fontSize: 28,
    fontWeight: '800',
    color: '#f8fafc',
    letterSpacing: 1,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 32,
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
    marginBottom: 20,
    textAlign: 'center',
  },
  fieldWrap: {
    marginBottom: 4,
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
    marginBottom: 4,
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginBottom: 8,
  },
  signupBtn: {
    backgroundColor: '#10b981',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  signupBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 1,
  },
  loginWrap: {
    alignItems: 'center',
  },
  loginText: {
    color: '#94a3b8',
    fontSize: 14,
  },
  loginLink: {
    color: '#3b82f6',
    fontWeight: '600',
  },
});

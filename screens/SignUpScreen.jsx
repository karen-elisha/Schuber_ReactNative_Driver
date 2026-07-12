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
import LinearGradient from 'react-native-linear-gradient';
// If you're not using Expo / don't have expo-linear-gradient installed, run:
// npx expo install expo-linear-gradient
// or swap the <LinearGradient> wrapper below for a plain <View style={styles.container}>.

const STORAGE_KEY = 'SchuberDriver';

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
    // TEMP: dummy sign-up bypass — skips field validation.
    // To restore real validation, revert this function.
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
    <LinearGradient colors={['#FFF7E1', '#FCE7B8']} style={styles.container}>
      <SafeAreaView style={styles.flexFill}>
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
    </LinearGradient>
  );
}

function Field({ label, placeholder, value, onChangeText, error, secureTextEntry, keyboardType, autoCapitalize }) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, error ? styles.inputError : null]}
        placeholder={placeholder}
        placeholderTextColor="#9B9B9B"
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
    fontSize: 28,
    fontWeight: '800',
    color: '#1F1B24',
    letterSpacing: 1,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B6B6B',
    marginBottom: 32,
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
    marginBottom: 20,
    textAlign: 'center',
  },
  fieldWrap: {
    marginBottom: 4,
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
    marginBottom: 4,
  },
  inputError: {
    borderColor: '#E14434',
  },
  errorText: {
    color: '#E14434',
    fontSize: 12,
    marginBottom: 8,
  },
  signupBtn: {
    backgroundColor: '#2FAE60',
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
    color: '#6B6B6B',
    fontSize: 14,
  },
  loginLink: {
    color: '#664EA4',
    fontWeight: '600',
  },
});
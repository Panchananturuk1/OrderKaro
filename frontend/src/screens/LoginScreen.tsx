// @ts-nocheck
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { APP_NAME, COLORS, SCREEN_PADDING, BORDER_RADIUS } from '../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { login, resetAuthError, setCredentials } from '../redux/slices/authSlice';
import { RootState } from '../redux/store';
import { createTestUser, TEST_CREDENTIALS, TEST_USER } from '../utils/testAuth';

const { width } = Dimensions.get('window');

const LoginScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { isLoading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [creatingTestUser, setCreatingTestUser] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'BottomTabs' }],
      });
    }
  }, [isAuthenticated, navigation]);

  // Reset error when component mounts
  useEffect(() => {
    dispatch(resetAuthError());
    setValidationError('');
    
    // For debugging - auto-fill with test credentials
    setEmail('test@example.com');
    setPassword('password123');
  }, [dispatch]);

  const validateForm = () => {
    setValidationError('');
    
    // Basic validation
    if (!email.trim()) {
      setValidationError('Email is required');
      return false;
    }
    
    if (!password.trim() || password.length < 6) {
      setValidationError('Password should be at least 6 characters');
      return false;
    }

    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    
    try {
      console.log('Attempting login with:', { email, password });
      // Login user
      await dispatch(login({ email, password })).unwrap();
      console.log('Login dispatch completed');
      // Navigation is handled by the useEffect that watches isAuthenticated
    } catch (error) {
      console.error('Authentication error:', error);
      // Error handling is done by the redux store
    }
  };

  const navigateToRegister = () => {
    navigation.navigate('Register');
  };

  const handleUseTestCredentials = () => {
    setEmail(TEST_CREDENTIALS.email);
    setPassword(TEST_CREDENTIALS.password);
  };

  const handleCreateTestUser = async () => {
    setCreatingTestUser(true);
    
    try {
      const result = await createTestUser();
      
      if (result.success) {
        setEmail(result.email);
        setPassword(result.password);
        Alert.alert(
          'Test User Created',
          `A test user has been created with email: ${result.email}\n\nTap Login to sign in with these credentials.`,
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Error', result.error || 'Failed to create test user');
      }
    } catch (err) {
      Alert.alert('Error', 'An unexpected error occurred when creating test user');
      console.error(err);
    } finally {
      setCreatingTestUser(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.appName}>{APP_NAME}</Text>
            <Text style={styles.tagline}>Fresh groceries delivered to your doorstep</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.headerText}>
              Login to your account
            </Text>

            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color={COLORS.GRAY} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color={COLORS.GRAY} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.passwordToggle}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={COLORS.GRAY}
                />
              </TouchableOpacity>
            </View>

            {validationError ? <Text style={styles.errorText}>{validationError}</Text> : null}
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.authButton}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={COLORS.WHITE} />
              ) : (
                <Text style={styles.authButtonText}>
                  Login
                </Text>
              )}
            </TouchableOpacity>

            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.divider} />
            </View>

            <View style={styles.socialButtonsContainer}>
              <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-google" size={20} color="#DB4437" />
                <Text style={styles.socialButtonText}>Google</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-facebook" size={20} color="#4267B2" />
                <Text style={styles.socialButtonText}>Facebook</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>
              Don't have an account?
            </Text>
            <TouchableOpacity onPress={navigateToRegister}>
              <Text style={styles.footerLinkText}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: SCREEN_PADDING,
    paddingTop: 40,
    paddingBottom: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: COLORS.GRAY,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
    color: COLORS.BLACK,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GRAY,
    borderRadius: BORDER_RADIUS,
    marginBottom: 16,
    height: 50,
    backgroundColor: COLORS.WHITE,
  },
  inputIcon: {
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: COLORS.BLACK,
  },
  passwordToggle: {
    padding: 12,
  },
  errorText: {
    color: COLORS.RED,
    marginBottom: 16,
    fontSize: 14,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: COLORS.PRIMARY,
    fontSize: 14,
  },
  authButton: {
    backgroundColor: COLORS.PRIMARY,
    height: 50,
    borderRadius: BORDER_RADIUS,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  authButtonText: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontWeight: 'bold',
  },
  testButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    marginBottom: 15,
  },
  testButton: {
    flex: 1,
    height: 44,
    borderRadius: BORDER_RADIUS,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  createTestUserButton: {
    backgroundColor: '#673ab7',
  },
  testButtonText: {
    color: COLORS.WHITE,
    fontSize: 14,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.LIGHT_GRAY,
  },
  dividerText: {
    marginHorizontal: 10,
    color: COLORS.GRAY,
    fontSize: 14,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: (width - (SCREEN_PADDING * 2) - 10) / 2,
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GRAY,
    borderRadius: BORDER_RADIUS,
  },
  socialButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: COLORS.BLACK,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    color: COLORS.GRAY,
    fontSize: 14,
  },
  footerLinkText: {
    color: COLORS.PRIMARY,
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },
});

export default LoginScreen; 
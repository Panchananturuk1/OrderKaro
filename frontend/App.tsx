// @ts-nocheck
import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { Provider, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { store } from './src/redux/store';
import AppNavigation from './src/navigation/AppNavigation';
import { checkAuthStatus, logout } from './src/redux/slices/authSlice';
import { STORAGE_KEYS } from './src/utils/constants';

// Clear all stored auth data (for testing purposes)
const clearAuthData = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
    console.log('Auth data cleared for testing');
  } catch (error) {
    console.error('Error clearing auth data:', error);
  }
};

// Set this to true to clear auth data on app start (for development only)
const CLEAR_AUTH_ON_START = true;

// Auth check component that runs on app startup
const AuthCheck = () => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    const initAuth = async () => {
      // Only clear auth data if explicitly set for development
      if (CLEAR_AUTH_ON_START) {
        await clearAuthData();
      }
      
      // Check authentication status when app loads
      console.log('Checking auth status...');
      dispatch(checkAuthStatus());
    };
    
    initAuth();
  }, [dispatch]);
  
  return null;
};

// Wrap the AppNavigation and AuthCheck in one component to ensure useDispatch works
const Main = () => {
  return (
    <>
      <StatusBar style="auto" />
      <AppNavigation />
      <AuthCheck />
      <Toast />
    </>
  );
};

// Create a simple fallback component in case of errors
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.placeholderContainer}>
          <Text style={styles.placeholderText}>Something went wrong</Text>
          <Text>Please reload the app</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <ErrorBoundary>
          <Main />
        </ErrorBoundary>
      </SafeAreaProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  placeholderText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
}); 
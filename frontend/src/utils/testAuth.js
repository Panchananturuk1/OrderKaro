import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from './constants';

// Mock test user credentials
export const TEST_CREDENTIALS = {
  email: 'test@example.com',
  password: 'password123'
};

// Mock test user data
const TEST_USER = {
  id: 'test-user-123',
  email: TEST_CREDENTIALS.email,
  name: 'Test User',
  phone: '1234567890',
  created_at: new Date().toISOString(),
};

// Function to create a test user (mock)
export const createTestUser = async () => {
  try {
    console.log('Creating mock test user...');
    
    // Store user data in AsyncStorage
    await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, 'mock-auth-token-123');
    await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(TEST_USER));
    
    console.log('Mock user created and stored');
    
    return { 
      success: true, 
      user: TEST_USER,
      email: TEST_CREDENTIALS.email,
      password: TEST_CREDENTIALS.password
    };
  } catch (error) {
    console.error('Test user creation failed:', error.message);
    return { success: false, error: error.message };
  }
};

// Function to test login (mock)
export const testLogin = async (email, password) => {
  try {
    console.log('Testing mock login with:', email);
    
    // Simple validation
    if (email === TEST_CREDENTIALS.email && password === TEST_CREDENTIALS.password) {
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, 'mock-auth-token-123');
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(TEST_USER));
      
      console.log('Mock login successful');
      return { success: true, user: TEST_USER };
    } else {
      console.error('Mock login failed: Invalid credentials');
      return { 
        success: false, 
        error: 'Invalid email or password' 
      };
    }
  } catch (error) {
    console.error('Login test failed:', error.message);
    return { success: false, error: error.message };
  }
}; 
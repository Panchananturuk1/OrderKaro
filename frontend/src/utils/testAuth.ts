// Test authentication utilities to simulate auth functionality
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from './constants';

// Base test account credentials - accessible to all users
export const TEST_CREDENTIALS = {
  email: 'test@example.com',
  password: 'password123',
};

// Sample user data
export const TEST_USER = {
  id: 'test-user-1',
  email: TEST_CREDENTIALS.email,
  name: 'Test User',
  phone: '+1 (555) 123-4567',
  created_at: new Date().toISOString(),
  avatar_url: 'https://randomuser.me/api/portraits/men/32.jpg',
};

/**
 * Simulates a login attempt
 * @param email User email
 * @param password User password
 * @returns Login result
 */
export const testLogin = async (email: string, password: string) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Check if credentials match the test account
  if (email === TEST_CREDENTIALS.email && password === TEST_CREDENTIALS.password) {
    console.log('Test login successful');
    return {
      success: true,
      user: TEST_USER,
    };
  }
  
  // Check dynamically created test accounts
  try {
    const testAccounts = await getTestAccounts();
    const account = testAccounts.find(acc => acc.email === email && acc.password === password);
    
    if (account) {
      console.log('Dynamic test login successful');
      return {
        success: true,
        user: {
          id: 'user-' + account.email.split('@')[0],
          email: account.email,
          name: account.name || 'User ' + account.email.split('@')[0],
          phone: account.phone || '+1 (555) 987-6543',
          created_at: account.created_at,
          avatar_url: 'https://randomuser.me/api/portraits/men/22.jpg',
        },
      };
    }
  } catch (error) {
    console.error('Error checking dynamic test accounts:', error);
  }
  
  // Failed login
  return {
    success: false,
    error: 'Invalid email or password',
  };
};

// Store for dynamically created test accounts
const getTestAccounts = async () => {
  try {
    const accounts = await AsyncStorage.getItem(STORAGE_KEYS.TEST_ACCOUNTS);
    return accounts ? JSON.parse(accounts) : [];
  } catch (error) {
    console.error('Error reading test accounts:', error);
    return [];
  }
};

/**
 * Creates a new test user for demo purposes
 */
export const createTestUser = async () => {
  try {
    // Generate random credentials
    const randomId = Math.floor(Math.random() * 10000);
    const email = `user${randomId}@example.com`;
    const password = `pass${randomId}`;
    const name = `Test User ${randomId}`;
    
    // Add to test accounts store
    const accounts = await getTestAccounts();
    const newAccount = {
      email,
      password,
      name,
      created_at: new Date().toISOString(),
    };
    
    accounts.push(newAccount);
    await AsyncStorage.setItem(STORAGE_KEYS.TEST_ACCOUNTS, JSON.stringify(accounts));
    
    console.log('Created test user:', email);
    
    return {
      success: true,
      email,
      password,
    };
  } catch (error) {
    console.error('Error creating test user:', error);
    return {
      success: false,
      error: 'Failed to create test user',
    };
  }
}; 
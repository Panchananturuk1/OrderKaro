import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from './constants';

/**
 * Utility to view registered user data stored in AsyncStorage
 * Run this function in your app or in a development screen
 * to see all registered users.
 */
export const viewUserData = async () => {
  try {
    // Get user data from AsyncStorage
    const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
    const authToken = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    
    console.log('======= CURRENT USER DATA =======');
    console.log('User Data:', userData ? JSON.parse(userData) : 'No user data found');
    console.log('Auth Token:', authToken || 'No auth token found');
    console.log('================================');
    
    return {
      userData: userData ? JSON.parse(userData) : null,
      authToken
    };
  } catch (error) {
    console.error('Error viewing user data:', error);
    return { error: error.message };
  }
};

/**
 * Clears all user data from AsyncStorage
 * Use this to reset the authentication state
 */
export const clearUserData = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
    console.log('User data cleared successfully');
    return { success: true };
  } catch (error) {
    console.error('Error clearing user data:', error);
    return { error: error.message };
  }
};

/**
 * This is a mock function that would normally connect to a database
 * Since we're using AsyncStorage for authentication in this demo,
 * there's no actual database to query.
 * 
 * In a real app with a PostgreSQL database, you would connect to your
 * database and query the users table.
 */
export const getAllUsers = async () => {
  try {
    // This is just a mock function to demonstrate how you would normally
    // query a database for all users
    const currentUser = await viewUserData();
    
    return {
      message: "Since we're using AsyncStorage for authentication in this demo, there's no database to query. The current logged-in user is shown above.",
      databaseConnection: "In a real app with PostgreSQL, you would connect to your database using a library like 'pg' or an ORM like Prisma/Sequelize and query the users table.",
      exampleQuery: "SELECT * FROM users",
      currentUser: currentUser.userData
    };
  } catch (error) {
    console.error('Error querying users:', error);
    return { error: error.message };
  }
};

// Export a function that can be called from a development screen
export const viewRegisteredUsers = async () => {
  const userData = await viewUserData();
  const allUsers = await getAllUsers();
  
  return {
    currentUser: userData.userData,
    allUsers: allUsers,
    howToView: "To view registered users, import the viewUserData function and call it in your app. The results will appear in your console."
  };
}; 
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../../utils/constants';
import { testLogin } from '../../utils/testAuth';

// User type definition
export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  created_at: string;
  avatar_url?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false, // This ensures we start with authentication required
  isLoading: true, // Start with loading true to check auth status
  error: null,
};

// Async thunk for login
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      console.log('Login attempt with:', { email });
      
      // Use mock login functionality instead of Supabase
      const result = await testLogin(email, password);
      
      if (!result.success) {
        throw new Error(result.error || 'Login failed');
      }
      
      // Store user data in AsyncStorage for persistence
      const token = 'auth-token-' + Date.now();
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(result.user));
      
      console.log('Login successful:', result.user);
      
      // Return user data and token
      return {
        user: result.user,
        token: token,
      };
    } catch (error: any) {
      console.error('Login error:', error.message);
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

// Async thunk for register
export const register = createAsyncThunk(
  'auth/register',
  async (
    { name, email, phone, password }: { name: string; email: string; phone: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      // Create a mock user for registration
      const user = {
        id: 'reg-user-' + Date.now(),
        email,
        name,
        phone,
        created_at: new Date().toISOString(),
      };
      
      // Store user data in AsyncStorage
      const token = 'mock-auth-token-' + Date.now();
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
      
      console.log('Mock registration successful:', user);
      
      return {
        user,
        token,
      };
    } catch (error: any) {
      console.error('Registration error:', error.message);
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

// Async thunk for checking auth status
export const checkAuthStatus = createAsyncThunk('auth/checkStatus', async (_, { rejectWithValue }) => {
  try {
    console.log('Checking auth status...');
    
    // Check if we have stored credentials
    const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
    
    console.log('Stored auth data found:', { hasToken: !!token, hasUserData: !!userData });
    
    if (!token || !userData) {
      return { user: null, token: null };
    }
    
    // Parse user data
    const user = JSON.parse(userData);
    
    return {
      user,
      token,
    };
  } catch (error: any) {
    console.error('Auth check error:', error.message);
    return rejectWithValue(error.message || 'Authentication check failed');
  }
});

// Async thunk for logging out
export const logout = createAsyncThunk('auth/logoutUser', async (_, { rejectWithValue }) => {
  try {
    console.log('Logging out user');
    
    // Clear local storage
    await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
    
    console.log('User logged out successfully');
    return true;
  } catch (error: any) {
    console.error('Logout error:', error.message);
    return rejectWithValue(error.message || 'Logout failed');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetAuthError: (state) => {
      state.error = null;
    },
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Register cases
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Check auth status cases
      .addCase(checkAuthStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = !!action.payload.user;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(checkAuthStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Logout cases
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetAuthError, setCredentials } = authSlice.actions;

export default authSlice.reducer; 
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Import configurations but handle cases where they're not properly initialized
let auth, supabase;
try {
  const firebase = require('../config/firebase');
  auth = firebase.auth;
} catch (error) {
  console.warn('Firebase auth not available, using mock implementation');
  auth = () => ({
    createUser: () => Promise.resolve({ uid: `mock-${Date.now()}`, email: 'mock@example.com' }),
    getUserByEmail: () => Promise.resolve({ uid: 'mock-user-id', email: 'mock@example.com' }),
    getUser: () => Promise.resolve({ uid: 'mock-user-id', email: 'mock@example.com' })
  });
}

try {
  const supabaseModule = require('../config/supabase');
  supabase = supabaseModule.supabase;
} catch (error) {
  console.warn('Supabase not available, using mock implementation');
  // Mock is already handled in supabase.js
}

// Sample users data for development
const USERS = [
  {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123', // In a real app, this would be hashed
    phone: '9876543210',
    addresses: [],
    created_at: '2023-01-01T00:00:00Z'
  }
];

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Validate input
    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide all required fields'
      });
    }

    // For development, we'll skip the Firebase/Supabase operations and use local data
    // Check if user already exists
    const existingUser = USERS.find(user => user.email === email || user.phone === phone);
    
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'User with this email or phone already exists'
      });
    }
    
    // Create a new user ID
    const userId = (USERS.length + 1).toString();
    
    // Create new user
    const newUser = {
      id: userId,
      name,
      email,
      password, // In a real app, this would be hashed
      phone,
      addresses: [],
      created_at: new Date().toISOString()
    };
    
    // Add to users array
    USERS.push(newUser);

    // Generate JWT token
    const token = jwt.sign(
      { uid: userId, email },
      process.env.JWT_SECRET || 'development_secret_key',
      { expiresIn: '7d' }
    );

    // Return user without password and with token
    const { password: _, ...userResponse } = newUser;
    
    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      user: userResponse,
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Registration failed'
    });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide email and password'
      });
    }

    // Find user
    const user = USERS.find(u => u.email === email);
    
    // Check if user exists and password matches
    if (!user || user.password !== password) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { uid: user.id, email: user.email },
      process.env.JWT_SECRET || 'development_secret_key',
      { expiresIn: '7d' }
    );

    // Return user without password and with token
    const { password: _, ...userResponse } = user;
    
    res.json({
      status: 'success',
      message: 'Login successful',
      user: userResponse,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Login failed'
    });
  }
});

/**
 * @route   POST /api/auth/logout
 * @desc    Log out user (clear client-side tokens)
 * @access  Public
 */
router.post('/logout', (req, res) => {
  // JWT tokens are stateless, so there's nothing to do server-side
  // The client should discard the token
  res.json({
    status: 'success',
    message: 'Logged out successfully'
  });
});

/**
 * @route   GET /api/auth/status
 * @desc    Check authentication status
 * @access  Private
 */
router.get('/status', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
      return res.status(401).json({ 
        status: 'error', 
        message: 'Not authenticated' 
      });
    }

    // Verify JWT token
    jwt.verify(token, process.env.JWT_SECRET || 'development_secret_key', async (err, decoded) => {
      if (err) {
        return res.status(401).json({ 
          status: 'error', 
          message: 'Invalid or expired token' 
        });
      }

      // Get user (in development, from local array)
      const user = USERS.find(u => u.id === decoded.uid);
      
      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'User not found'
        });
      }

      // Return user without password
      const { password: _, ...userResponse } = user;
      
      res.json({
        status: 'success',
        message: 'Authenticated',
        user: userResponse,
        token // Return the same token
      });
    });
  } catch (error) {
    console.error('Auth status check error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Authentication check failed'
    });
  }
});

module.exports = router; 
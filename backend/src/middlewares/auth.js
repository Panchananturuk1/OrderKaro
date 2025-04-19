const jwt = require('jsonwebtoken');
const admin = require('firebase-admin');
const { supabase } = require('../config/supabase');

/**
 * Middleware to authenticate JWT token from the Authorization header
 */
const authenticateToken = (req, res, next) => {
  // For development purposes, we're bypassing actual token verification
  // In a production environment, you would verify the JWT token
  
  // Get the auth header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN format
  
  if (token == null) {
    // For development, proceed even without a token
    console.log('No auth token provided, proceeding anyway for development');
    req.user = { id: 'dev-user-id', email: 'dev@example.com' };
    return next();
  }
  
  // In development, we're not actually verifying the token
  // Just logging that we received one
  console.log('Auth token received, proceeding for development');
  req.user = { id: 'dev-user-id', email: 'dev@example.com' };
  next();
  
  // In a real implementation, you would do:
  /*
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });
    req.user = user;
    next();
  });
  */
};

/**
 * Middleware to authenticate Firebase token
 */
const authenticateFirebaseToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
      return res.status(401).json({ 
        status: 'error', 
        message: 'Access denied. No token provided.' 
      });
    }

    // Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email
    };
    next();
  } catch (error) {
    console.error('Firebase auth middleware error:', error);
    return res.status(403).json({ 
      status: 'error', 
      message: 'Invalid or expired token.' 
    });
  }
};

/**
 * Middleware to authenticate Supabase token
 */
const authenticateSupabaseToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
      return res.status(401).json({ 
        status: 'error', 
        message: 'Access denied. No token provided.' 
      });
    }

    // Get user from Supabase auth
    const { data: { user }, error } = await supabase.auth.getUser(authHeader);
    
    if (error || !user) {
      return res.status(403).json({ 
        status: 'error', 
        message: 'Invalid or expired token.' 
      });
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error('Supabase auth middleware error:', error);
    return res.status(500).json({ 
      status: 'error', 
      message: 'Authentication service error.' 
    });
  }
};

/**
 * Middleware to check if user has admin role
 */
const isAdmin = async (req, res, next) => {
  try {
    if (!req.user || !req.user.role || req.user.role !== 'admin') {
      return res.status(403).json({ 
        status: 'error', 
        message: 'Access denied. Admin privileges required.' 
      });
    }
    next();
  } catch (error) {
    console.error('Admin check middleware error:', error);
    return res.status(500).json({ 
      status: 'error', 
      message: 'Authorization service error.' 
    });
  }
};

module.exports = {
  authenticateToken,
  authenticateFirebaseToken,
  authenticateSupabaseToken,
  isAdmin
}; 
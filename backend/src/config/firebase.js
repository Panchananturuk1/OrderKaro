const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

// Path to the Firebase service account key file
const SERVICE_ACCOUNT_PATH = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || path.join(__dirname, '../../firebase-service-account.json');

// Initialize Firebase Admin SDK
try {
  // Check if service account file exists
  if (fs.existsSync(SERVICE_ACCOUNT_PATH)) {
    // Initialize with service account file
    const serviceAccount = require(SERVICE_ACCOUNT_PATH);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET || undefined
    });
  } else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    // Initialize with environment variable containing service account JSON
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET || undefined
    });
  } else {
    // For development mode, initialize with a default credential
    // This will work for basic functionality but not for storage operations
    console.log('Initializing Firebase in development mode without credentials');
    admin.initializeApp({
      projectId: 'orderkaro-dev',
    });
  }
  
  console.log('Firebase Admin SDK initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase Admin SDK:', error);
  // Don't exit the process in development to allow working on other features
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
}

// Export Firebase admin and auth
const auth = admin.auth;

// Only create storage bucket if a bucket name is provided
let storage = null;
let bucket = null;
if (process.env.FIREBASE_STORAGE_BUCKET) {
  storage = admin.storage();
  bucket = storage.bucket();
}

// Export services
module.exports = {
  admin,
  auth,
  // Export storage services only if they're initialized
  ...(storage && { storage }),
  ...(bucket && { bucket })
}; 
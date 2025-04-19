// App-wide constants

// Currency symbol for the app
export const CURRENCY_SYMBOL = '₹';

// API URLs
export const BASE_URL = 'https://api.orderkaro.com';
export const API_URL = 'http://localhost:5001/api';
export const API_ENDPOINTS = {
  PRODUCTS: '/products',
  CATEGORIES: '/categories',
  FEATURED: '/products/featured',
  CART: '/cart',
  ORDERS: '/orders',
  USER: '/user',
  AUTH: '/auth',
};

// App dimensions and values
export const SCREEN_PADDING = 16;
export const BORDER_RADIUS = 8;

// Delivery settings
export const FREE_DELIVERY_THRESHOLD = 500;
export const DELIVERY_CHARGE = 40;

// Product listing
export const PRODUCTS_PER_PAGE = 10;

// Order status values
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

// Color scheme
export const COLORS = {
  PRIMARY: '#4CAF50',
  SECONDARY: '#FF9800',
  BLACK: '#333333',
  GRAY: '#666666',
  LIGHT_GRAY: '#999999',
  LIGHTER_GRAY: '#f5f5f5',
  WHITE: '#FFFFFF',
  RED: '#FF3B30',
  GREEN: '#4CAF50',
  YELLOW: '#FFCC00',
};

// Storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  CART: 'cart_data',
  RECENT_SEARCHES: 'recent_searches',
  TEST_ACCOUNTS: 'test_accounts',
};

// Firebase config
export const FIREBASE_CONFIG = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
};

// Razorpay config
export const RAZORPAY_KEY_ID = 'YOUR_RAZORPAY_KEY_ID';

// App settings
export const APP_NAME = 'Order Karo';

// Categories
export const PRODUCT_CATEGORIES = [
  { id: 1, name: 'Fruits & Vegetables', icon: 'leaf' },
  { id: 2, name: 'Dairy & Breakfast', icon: 'cafe' },
  { id: 3, name: 'Staples', icon: 'basket' },
  { id: 4, name: 'Snacks & Beverages', icon: 'fast-food' },
  { id: 5, name: 'Cleaning & Household', icon: 'home' },
  { id: 6, name: 'Beauty & Hygiene', icon: 'fitness' },
]; 
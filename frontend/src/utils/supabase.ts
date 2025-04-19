import { createClient } from '@supabase/supabase-js';
import { STORAGE_KEYS } from './constants';

// Supabase Configuration
// Using a production Supabase instance instead of localhost
const SUPABASE_URL = 'https://vrvhptqkhxpyhbfpijyt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZydmhwdHFraHhweWhiZnBpanl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTg5MTU0NTUsImV4cCI6MjAxNDQ5MTQ1NX0.HrtvNRUVjXRcXCjYQ-CdOJ_mR9oKATu9m1QYCDLl8lI';

// Initialize Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false
  }
});

// Helper function to get user from local storage
export const getCurrentUser = async () => {
  const session = await supabase.auth.getSession();
  return session?.data?.session?.user || null;
};

// Helper function to get auth token
export const getToken = async () => {
  const session = await supabase.auth.getSession();
  return session?.data?.session?.access_token || null;
};

// Type definitions for database tables
export type User = {
  id: string;
  email: string;
  name: string;
  phone: string;
  created_at: string;
  avatar_url?: string;
};

export type Address = {
  id: string;
  user_id: string;
  type: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  is_default: boolean;
};

export type Order = {
  id: string;
  user_id: string;
  status: string;
  total: number;
  items_count: number;
  created_at: string;
  updated_at: string;
  delivery_address_id: string;
  payment_method: string;
  payment_status: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  total: number;
  product_name: string;
  product_image: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  sale_price?: number;
  image_url: string;
  unit: string;
  stock: number;
  category_id: string;
  rating?: number;
  reviews_count?: number;
  created_at: string;
};

export type Category = {
  id: string;
  name: string;
  icon: string;
  image_url?: string;
};

// Table names for easy reference
export const TABLES = {
  USERS: 'users',
  ADDRESSES: 'addresses',
  ORDERS: 'orders',
  ORDER_ITEMS: 'order_items',
  PRODUCTS: 'products',
  CATEGORIES: 'categories',
}; 
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client with environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

let supabase = null;

// Check if Supabase credentials are available
if (!supabaseUrl || !supabaseKey) {
  console.warn('Missing Supabase credentials. Using mock Supabase client for development.');
  
  // In development, continue without exiting
  if (process.env.NODE_ENV === 'production') {
    console.error('Supabase credentials required for production. Make sure SUPABASE_URL and SUPABASE_ANON_KEY are set in your environment variables.');
    process.exit(1);
  }
  
  // Mock Supabase client for development
  supabase = {
    from: () => ({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: null })
        }),
        limit: () => Promise.resolve({ data: [], error: null }),
        or: () => ({
          limit: () => Promise.resolve({ data: [], error: null })
        })
      }),
      insert: () => ({
        select: () => Promise.resolve({ data: [], error: null })
      })
    }),
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: null })
    }
  };
} else {
  // Create real Supabase client instance
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log('Supabase client initialized successfully');
  } catch (error) {
    console.error('Error initializing Supabase client:', error);
    
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
    
    // Mock client for development in case of initialization error
    supabase = {
      from: () => ({
        select: () => ({
          eq: () => ({
            single: () => Promise.resolve({ data: null, error: null })
          }),
          limit: () => Promise.resolve({ data: [], error: null })
        }),
        insert: () => ({
          select: () => Promise.resolve({ data: [], error: null })
        })
      }),
      auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: null })
      }
    };
  }
}

module.exports = { supabase }; 
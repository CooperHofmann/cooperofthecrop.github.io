import { createClient } from '@supabase/supabase-js';

// Supabase client for client-side operations
// Uses environment variables that are safe to expose in browser
export const createBrowserClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a mock client for build time
    if (typeof window === 'undefined') {
      return null as any;
    }
    throw new Error('Missing Supabase environment variables. Please configure .env.local');
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });
};

// Export a default instance for convenience
export const supabase = createBrowserClient();

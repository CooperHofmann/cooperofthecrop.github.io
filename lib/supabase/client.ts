import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Supabase client for client-side operations
// Uses environment variables that are safe to expose in browser
export const createBrowserClient = (): SupabaseClient | null => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // Return null for build time when vars aren't available
    if (typeof window === 'undefined') {
      return null;
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
// Type assertion is safe because runtime checks will throw if env vars missing
export const supabase = createBrowserClient() as SupabaseClient;

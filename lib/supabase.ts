import { createClient } from '@supabase/supabase-js';

// Create a single supabase client for the browser
const createBrowserClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials not found. Please check your environment variables.');
    // Return a dummy client for development that won't throw errors
    return {
      auth: {
        signInWithPassword: async () => ({ data: {}, error: new Error('Supabase not configured') }),
        signInWithOAuth: async () => ({ data: {}, error: new Error('Supabase not configured') }),
        getUser: async () => ({ data: { user: null }, error: null }),
        signOut: async () => ({ error: null }),
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            data: [],
            error: null,
          }),
        }),
        insert: () => ({
          select: () => ({
            data: [],
            error: null,
          }),
        }),
      }),
    } as any;
  }
  
  return createClient(supabaseUrl, supabaseAnonKey);
};

export const supabase = createBrowserClient();

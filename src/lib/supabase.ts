import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variables for Supabase (with user's live project credentials)
const defaultUrl = 'https://ykfsvptxuzknxurecvqz.supabase.co';
const defaultKey = 'sb_publishable_8wQUPu_khdOoKXl92M9gew_lVSFJr4B';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || defaultUrl;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || defaultKey;

// Check if valid credentials are provided
export const isSupabaseConfigured = (): boolean => {
  return (
    typeof supabaseUrl === 'string' &&
    supabaseUrl.trim() !== '' &&
    !supabaseUrl.includes('your-project-id') &&
    typeof supabaseAnonKey === 'string' &&
    supabaseAnonKey.trim() !== '' &&
    !supabaseAnonKey.includes('your-anon-public-key')
  );
};

// Create a single Supabase client for interacting with your database
let client: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient | null => {
  if (!isSupabaseConfigured()) {
    return null;
  }

  if (!client) {
    try {
      client = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      });
    } catch (err) {
      console.warn('Failed to initialize Supabase client:', err);
      return null;
    }
  }

  return client;
};

// Export active client instance (or a dummy-safe proxy if unconfigured)
export const supabase = getSupabaseClient();

export const getSupabaseStatus = () => {
  const configured = isSupabaseConfigured();
  return {
    configured,
    url: configured ? supabaseUrl : 'Not Configured (Running in Offline/Local Mode)',
    hasKey: configured,
  };
};

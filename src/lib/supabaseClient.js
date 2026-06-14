import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Conditional creation: the site must not crash when .env is absent
// (e.g. local design work before the backend is wired up).
export const supabase = url && anonKey ? createClient(url, anonKey) : null;

export const isSupabaseConfigured = Boolean(supabase);

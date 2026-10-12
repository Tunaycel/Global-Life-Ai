import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Supabase Auth keeps the email/password accounts: hashing, confirmation and reset emails.
// The URL and publishable key are public by design; access is governed by Supabase itself.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

let browserClient: SupabaseClient | null = null;

export function supabaseConfigured(): boolean {
    return Boolean(url && key);
}

// One client per browser tab; it also picks up the session from a reset-password link.
export function supabaseBrowser(): SupabaseClient {
    if (!url || !key) throw new Error("Supabase is not configured: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
    browserClient ??= createClient(url, key);
    return browserClient;
}

// A fresh client per server call, so no session leaks between users.
export function supabaseServer(): SupabaseClient {
    if (!url || !key) throw new Error("Supabase is not configured: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
    return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

// Error codes shared by the credentials provider and the login page.
export const AUTH_ERRORS = {
    invalid: "invalid_credentials",
    unconfirmed: "email_not_confirmed",
    unavailable: "auth_unavailable",
} as const;

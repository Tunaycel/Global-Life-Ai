import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Supabase Auth keeps the email/password accounts: hashing, confirmation and reset emails.
// The URL and publishable key are public by design; access is governed by Supabase itself.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export function supabaseConfigured(): boolean {
    return Boolean(url && key);
}

// The app's session lives in NextAuth, so Supabase never keeps one: nothing is written to
// localStorage and tokens in a link are read by our own code, not picked up automatically.
export function supabaseClient(): SupabaseClient {
    if (!url || !key) throw new Error("Supabase is not configured: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
    return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } });
}

// Tokens Supabase puts after "#" in confirmation and reset links (implicit flow).
export function readLinkTokens(hash: string) {
    const params = new URLSearchParams(hash.replace(/^#/, ""));
    return {
        accessToken: params.get("access_token"),
        refreshToken: params.get("refresh_token"),
        type: params.get("type"),
        error: params.get("error_code") ?? params.get("error"),
    };
}

// Error codes shared by the credentials provider and the login page.
export const AUTH_ERRORS = {
    invalid: "invalid_credentials",
    unconfirmed: "email_not_confirmed",
    rateLimited: "rate_limited",
    unavailable: "auth_unavailable",
} as const;

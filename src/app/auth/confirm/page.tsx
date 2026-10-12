"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import AuthCard from "@/components/auth/AuthCard";
import { readLinkTokens, supabaseClient, supabaseConfigured } from "@/lib/supabase";

// The confirmation email lands here. Supabase confirms the address before redirecting and
// adds a session after "#"; we do not need it, so it is cleared from the address bar and
// revoked, and the user signs in normally.
export default function ConfirmEmailPage() {
    const router = useRouter();

    useEffect(() => {
        const tokens = readLinkTokens(window.location.hash);
        window.history.replaceState(null, "", window.location.pathname);
        if (tokens.error || !tokens.accessToken || !tokens.refreshToken) {
            router.replace("/auth/login?error=confirm_failed");
            return;
        }
        const finish = () => router.replace("/auth/login?confirmed=1");
        if (!supabaseConfigured()) return finish();
        const supabase = supabaseClient();
        supabase.auth
            .setSession({ access_token: tokens.accessToken, refresh_token: tokens.refreshToken })
            .then(() => supabase.auth.signOut({ scope: "local" }))
            .catch(() => {})
            .finally(finish);
    }, [router]);

    return (
        <AuthCard title="E-postan doğrulanıyor" subtitle="Bir saniye, seni giriş sayfasına götürüyoruz.">
            <div role="status" className="flex justify-center py-6 text-white/60">
                <Loader2 className="w-6 h-6 animate-spin" aria-hidden="true" />
                <span className="sr-only">Yükleniyor</span>
            </div>
        </AuthCard>
    );
}

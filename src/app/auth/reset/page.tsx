"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Loader2 } from "lucide-react";
import type { SupabaseClient } from "@supabase/supabase-js";
import AuthCard, { inputClass, buttonClass } from "@/components/auth/AuthCard";
import { readLinkTokens, supabaseClient, supabaseConfigured } from "@/lib/supabase";

// Opened from the reset email. The recovery tokens after "#" are read once, cleared from the
// address bar, and held only in memory for this one password change; then every session of
// the account is signed out.
export default function ResetPasswordPage() {
    const router = useRouter();
    const client = useRef<SupabaseClient | null>(null);
    const [ready, setReady] = useState<boolean | null>(null);
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const tokens = readLinkTokens(window.location.hash);
        window.history.replaceState(null, "", window.location.pathname);
        if (!supabaseConfigured() || tokens.type !== "recovery" || !tokens.accessToken || !tokens.refreshToken) {
            Promise.resolve().then(() => setReady(false));
            return;
        }
        const supabase = supabaseClient();
        client.current = supabase;
        supabase.auth
            .setSession({ access_token: tokens.accessToken, refresh_token: tokens.refreshToken })
            .then(({ error: sessionError }) => setReady(!sessionError))
            .catch(() => setReady(false));
    }, []);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        if (password.length < 8) return setError("Şifre en az 8 karakter olmalı.");
        if (password !== confirm) return setError("Şifreler aynı değil.");
        const supabase = client.current;
        if (!supabase) return setReady(false);
        setLoading(true);
        try {
            const { error: updateError } = await supabase.auth.updateUser({ password });
            if (updateError) {
                setError(updateError.code === "same_password"
                    ? "Yeni şifre eskisiyle aynı olamaz."
                    : "Şifre güncellenemedi. Bağlantının süresi dolmuş olabilir; yeniden iste.");
                return;
            }
            // Sign the account out everywhere, so whoever had the old password loses access.
            await supabase.auth.signOut({ scope: "global" }).catch(() => {});
            router.push("/auth/login?reset=1");
        } finally {
            setLoading(false);
        }
    }

    return (
        <AuthCard title="Yeni şifre belirle" subtitle="Hesabın için yeni bir şifre seç.">
            {ready === false ? (
                <p role="alert" className="rounded-2xl border border-[#FF453A]/20 bg-[#FF453A]/5 px-4 py-3 text-sm text-[#FF6B60]">
                    Bu bağlantı geçersiz ya da süresi dolmuş. <Link href="/auth/forgot" className="underline">Yeni bağlantı iste</Link>.
                </p>
            ) : (
                <form className="space-y-6" onSubmit={onSubmit}>
                    {error && <p role="alert" className="rounded-2xl border border-[#FF453A]/20 bg-[#FF453A]/5 px-4 py-3 text-sm text-[#FF6B60]">{error}</p>}
                    {[
                        { id: "password", label: "Yeni şifre", value: password, set: setPassword },
                        { id: "confirm", label: "Yeni şifre (tekrar)", value: confirm, set: setConfirm },
                    ].map((field) => (
                        <div key={field.id} className="space-y-2">
                            <label htmlFor={field.id} className="text-xs font-semibold text-white/50 ml-1">{field.label}</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 pointer-events-none" />
                                <input id={field.id} type="password" required minLength={8} autoComplete="new-password" value={field.value} onChange={(e) => field.set(e.target.value)} placeholder="••••••••" className={inputClass} />
                            </div>
                        </div>
                    ))}
                    <button type="submit" disabled={loading || ready === null} className={buttonClass} style={{ background: "linear-gradient(135deg, #00DC82, #00E5FF)" }}>
                        {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Kaydediliyor</> : "Şifreyi kaydet"}
                    </button>
                </form>
            )}
        </AuthCard>
    );
}

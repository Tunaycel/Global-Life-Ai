"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Loader2 } from "lucide-react";
import AuthCard, { inputClass, buttonClass } from "@/components/auth/AuthCard";
import { supabaseBrowser } from "@/lib/supabase";

// Opened from the reset email. Supabase reads the recovery token from the link and starts a
// short session; we use it only to set the new password, then send the user to sign in.
export default function ResetPasswordPage() {
    const router = useRouter();
    const [ready, setReady] = useState<boolean | null>(null);
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const supabase = supabaseBrowser();
        const { data: sub } = supabase.auth.onAuthStateChange((event) => {
            if (event === "PASSWORD_RECOVERY") setReady(true);
        });
        supabase.auth.getSession().then(({ data }) => setReady((current) => current ?? Boolean(data.session)));
        return () => sub.subscription.unsubscribe();
    }, []);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        if (password.length < 8) return setError("Şifre en az 8 karakter olmalı.");
        if (password !== confirm) return setError("Şifreler aynı değil.");
        setLoading(true);
        const supabase = supabaseBrowser();
        const { error: updateError } = await supabase.auth.updateUser({ password });
        setLoading(false);
        if (updateError) {
            setError(updateError.code === "same_password"
                ? "Yeni şifre eskisiyle aynı olamaz."
                : "Şifre güncellenemedi. Bağlantının süresi dolmuş olabilir; yeniden iste.");
            return;
        }
        await supabase.auth.signOut();
        router.push("/auth/login?reset=1");
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

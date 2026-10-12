"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Loader2, MailCheck } from "lucide-react";
import AuthCard, { inputClass, buttonClass } from "@/components/auth/AuthCard";
import { supabaseBrowser } from "@/lib/supabase";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [sent, setSent] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const { error: resetError } = await supabaseBrowser().auth.resetPasswordForEmail(email.trim().toLowerCase(), {
                redirectTo: `${window.location.origin}/auth/reset`,
            });
            // Same answer whether or not the address has an account.
            if (resetError && resetError.status !== 400) throw resetError;
            setSent(true);
        } catch {
            setError("Bağlantı şu an gönderilemedi. Biraz sonra tekrar dene.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <AuthCard title="Şifreni mi unuttun?" subtitle="E-posta adresini yaz, sana yeni şifre bağlantısı gönderelim.">
            {sent ? (
                <div role="status" className="rounded-2xl border border-[#00DC82]/20 bg-[#00DC82]/5 p-6 text-center">
                    <MailCheck className="mx-auto mb-3 w-8 h-8 text-[#00DC82]" />
                    <p className="text-white font-semibold mb-1">E-postanı kontrol et</p>
                    <p className="text-sm text-white/60 font-light">Bu adrese kayıtlı bir hesap varsa, şifre yenileme bağlantısı birkaç dakika içinde gelir.</p>
                </div>
            ) : (
                <form className="space-y-6" onSubmit={onSubmit}>
                    {error && <p role="alert" className="rounded-2xl border border-[#FF453A]/20 bg-[#FF453A]/5 px-4 py-3 text-sm text-[#FF6B60]">{error}</p>}
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-xs font-semibold text-white/50 ml-1">E-posta</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 pointer-events-none" />
                            <input id="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ornek@email.com" className={inputClass} />
                        </div>
                    </div>
                    <button type="submit" disabled={loading} className={buttonClass} style={{ background: "linear-gradient(135deg, #00DC82, #00E5FF)" }}>
                        {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Gönderiliyor</> : "Bağlantıyı gönder"}
                    </button>
                </form>
            )}
            <p className="text-center text-xs text-white/30 mt-8 font-light">
                <Link href="/auth/login" className="text-[#00DC82] font-semibold hover:text-[#00E5FF] transition-colors">Girişe dön</Link>
            </p>
        </AuthCard>
    );
}

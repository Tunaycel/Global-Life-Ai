"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getProviders, signIn } from "next-auth/react";
import { AUTH_ERRORS, supabaseClient, supabaseConfigured } from "@/lib/supabase";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2, ShieldCheck, Globe, Zap, Mic, Users, Star } from "lucide-react";
import dynamic from "next/dynamic";

const SceneAuthentication = dynamic(
    () => import("@/components/3d/SceneAuthentication"),
    { ssr: false }
);

// High-quality SVG Icons with original colors
const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" style={{ fill: "#4285F4" }} />
        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" style={{ fill: "#34A853" }} />
        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" style={{ fill: "#FBBC05" }} />
        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" style={{ fill: "#EA4335" }} />
    </svg>
);

// Only "/..." paths, so a crafted link cannot send a fresh session to another site.
function safeCallback(): string {
    const value = new URLSearchParams(window.location.search).get("callbackUrl");
    return value && value.startsWith("/") && !value.startsWith("//") ? value : "/dashboard";
}

// Messages carried in the URL (after confirming the email, after a reset, or an error
// NextAuth redirected back with). Kept in its own Suspense boundary so the rest of the
// page still renders on the server.
function UrlMessages({ hidden }: { hidden: boolean }) {
    const params = useSearchParams();
    if (hidden) return null;
    const notice = params.get("confirmed")
        ? "E-postan doğrulandı. Şimdi giriş yapabilirsin."
        : params.get("reset") ? "Şifren güncellendi. Yeni şifrenle giriş yap." : null;
    const error = params.get("error") ? errorMessage(params.get("error")) : null;
    return (
        <>
            {notice && <p role="status" className="mb-6 rounded-2xl border border-[#00DC82]/20 bg-[#00DC82]/5 px-4 py-3 text-sm text-[#00DC82]">{notice}</p>}
            {error && <p role="alert" className="mb-6 rounded-2xl border border-[#FF453A]/20 bg-[#FF453A]/5 px-4 py-3 text-sm text-[#FF6B60]">{error}</p>}
        </>
    );
}

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [googleEnabled, setGoogleEnabled] = useState(false);
    const router = useRouter();

    // The Google button shows only when the server has Google keys.
    useEffect(() => {
        getProviders().then((providers) => setGoogleEnabled(Boolean(providers?.google))).catch(() => {});
    }, []);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setSubmitted(true);
        setLoading(true);
        try {
            if (!supabaseConfigured()) throw new Error(AUTH_ERRORS.unavailable);
            // The password goes to Supabase from the visitor's browser; NextAuth gets only the
            // resulting access token and checks it on the server.
            const { data, error: authError } = await supabaseClient().auth.signInWithPassword({
                email: email.trim().toLowerCase(),
                password,
            });
            if (authError || !data.session) {
                const code = authError?.code === "email_not_confirmed" ? AUTH_ERRORS.unconfirmed
                    : authError?.status === 429 ? AUTH_ERRORS.rateLimited
                    : authError?.code === "invalid_credentials" || authError?.status === 400 ? AUTH_ERRORS.invalid
                    : AUTH_ERRORS.unavailable;
                setError(errorMessage(code));
                return;
            }
            const result = await signIn("credentials", { accessToken: data.session.access_token, redirect: false });
            if (!result || result.error) {
                setError(errorMessage(result?.error ?? null));
                return;
            }
            router.push(safeCallback());
        } catch {
            setError(errorMessage(null));
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex bg-[#030308] p-4 gap-4">
            {/* Left — 3D Scene Card (Soft, floating) */}
            <div className="hidden lg:flex flex-1 relative overflow-hidden rounded-[40px] bg-[#0A0A0F] border border-white/5 items-center justify-center p-12 lg:pl-16">

                {/* Logo top-left - restored visibility on desktop */}
                <div className="absolute top-10 left-10 z-30">
                    <Link href="/" className="inline-flex items-center gap-3 group">
                        <Image src="/brand/globallife-logo.svg" alt="" width={40} height={40} className="w-10 h-10 rounded-xl group-hover:scale-105 transition-transform duration-300" />
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                            GlobalLife
                        </span>
                    </Link>
                </div>

                {/* Scene Background (Absolute) - Centered more naturally */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <SceneAuthentication />
                </div>

                {/* Content Overlay - Detailed & Soft */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    className="relative z-30 flex flex-col items-start justify-center text-left max-w-[600px] w-full"
                >
                    <div className="mb-10 inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 shadow-lg shadow-black/20">
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="w-6 h-6 rounded-full bg-gradient-to-br from-white/20 to-white/5 border border-white/10" />
                            ))}
                        </div>
                        <span className="text-xs font-medium text-white/80 tracking-wide">2.4M+ Global Öğrenci</span>
                    </div>

                    <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-[0.9] tracking-tighter" style={{ fontFamily: "var(--font-display)" }}>
                        Sınırları <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00DC82] via-[#00E5FF] to-[#00DC82] bg-[length:200%_auto] animate-gradient-x">Kaldır.</span>
                    </h1>

                    <p className="text-lg text-white/60 mb-12 font-light leading-relaxed max-w-[480px]">
                        Yapay zeka asistanınla 7/24 dil pratiği yap, vize süreçlerini otomatikleştir ve hayalindeki kariyere ulaş.
                    </p>

                    {/* Detailed Features Grid */}
                    <div className="grid grid-cols-2 gap-4 w-full mb-12">
                        {[
                            {
                                icon: Mic,
                                title: "AI Konuşma Pratiği",
                                desc: "Doğal aksan, anlık geri bildirim."
                            },
                            {
                                icon: ShieldCheck,
                                title: "Vize Garantisi",
                                desc: "%98 başarı oranı ile analiz."
                            },
                            {
                                icon: Globe,
                                title: "Global Network",
                                desc: "150+ ülkede iş fırsatları."
                            },
                            {
                                icon: Zap,
                                title: "Hızlandırılmış Eğitim",
                                desc: "Kişiselleştirilmiş öğrenme rotası."
                            },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 + i * 0.1 }}
                                className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors duration-300 group"
                            >
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00DC82]/10 to-[#00E5FF]/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-white/5">
                                    <item.icon className="w-5 h-5 text-[#00DC82] group-hover:text-[#00E5FF] transition-colors" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-white mb-1 group-hover:text-[#00DC82] transition-colors">{item.title}</h3>
                                    <p className="text-xs text-white/40 leading-relaxed font-light">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Trust Indicators */}
                    <div className="flex items-center gap-6 opacity-60">
                        <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-[#00DC82] fill-[#00DC82]" />
                            <span className="text-sm font-medium text-white">4.9/5 Trustpilot</span>
                        </div>
                        <div className="w-px h-4 bg-white/20" />
                        <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-[#00E5FF]" />
                            <span className="text-sm font-medium text-white">Topluluk onaylı</span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Right — Form (WIDER as requested) */}
            <div className="flex-1 flex items-center justify-center relative z-10 p-6 lg:p-12">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#00DC82]/5 via-transparent to-transparent pointer-events-none" />

                {/* WIDER Form Container max-w-[480px] */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-[480px] bg-[#0A0A0F]/50 backdrop-blur-sm p-8 lg:p-10 rounded-[40px] border border-white/5 shadow-2xl shadow-black/40"
                >
                    <div className="lg:hidden mb-10 text-center">
                        <Link href="/" className="inline-flex items-center gap-2.5 group">
                            <Image src="/brand/globallife-logo.svg" alt="" width={48} height={48} className="w-12 h-12 rounded-2xl group-hover:scale-105 transition-transform duration-300" />
                        </Link>
                    </div>

                    <div className="mb-8 text-center lg:text-left">
                        <h2 className="text-4xl font-bold text-white mb-2 tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Hoş Geldin</h2>
                        <p className="text-[#888899] font-light text-lg">Hesabına giriş yaparak devam et</p>
                    </div>

                    {/* Social Login with Original Colors */}
                    {googleEnabled && (<>
                    <div className="mb-6">
                        <button
                            type="button"
                            onClick={() => signIn("google", { callbackUrl: safeCallback() })}
                            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 group"
                        >
                            <GoogleIcon />
                            <span className="text-sm font-medium text-white/90 group-hover:text-white transition-colors">Google ile devam et</span>
                        </button>
                    </div>

                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex-1 h-px bg-white/5" />
                        <span className="text-[10px] font-medium text-white/30 uppercase tracking-widest">veya</span>
                        <div className="flex-1 h-px bg-white/5" />
                    </div>
                    </>)}

                    {/* Form */}
                    <Suspense>
                        <UrlMessages hidden={submitted} />
                    </Suspense>
                    {error && (
                        <p role="alert" className="mb-6 rounded-2xl border border-[#FF453A]/20 bg-[#FF453A]/5 px-4 py-3 text-sm text-[#FF6B60]">{error}</p>
                    )}

                    <form className="space-y-6" onSubmit={onSubmit}>
                        <div className="space-y-2">
                            <label htmlFor="login-email" className="text-xs font-semibold text-white/50 ml-1 uppercase tracking-wider">Email</label>
                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-r from-[#00DC82]/10 to-[#00E5FF]/10 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-[#00DC82] transition-colors duration-300 pointer-events-none z-10" />
                                <input
                                    id="login-email"
                                    type="email"
                                    required
                                    autoComplete="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="ornek@email.com"
                                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-white/10 outline-none focus:border-[#00DC82]/30 focus:bg-[#030308] relative z-0 transition-all duration-300 text-sm font-light"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between ml-1">
                                <label htmlFor="login-password" className="text-xs font-semibold text-white/50 uppercase tracking-wider">Şifre</label>
                                <Link href="/auth/forgot" className="text-xs text-[#00DC82] hover:text-[#00E5FF] transition-colors font-medium">Unuttun mu?</Link>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-r from-[#00DC82]/10 to-[#00E5FF]/10 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-[#00DC82] transition-colors duration-300 pointer-events-none z-10" />
                                <input
                                    id="login-password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-12 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-white/10 outline-none focus:border-[#00DC82]/30 focus:bg-[#030308] relative z-0 transition-all duration-300 text-sm font-light"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-white/10 transition-colors text-white/30 hover:text-white z-10"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 disabled:opacity-60 disabled:pointer-events-none rounded-2xl font-bold text-[#030308] shadow-[0_4px_20px_rgba(0,220,130,0.15)] hover:shadow-[0_4px_30px_rgba(0,220,130,0.3)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 group relative overflow-hidden mt-6"
                            style={{ background: "linear-gradient(135deg, #00DC82, #00E5FF)" }}
                        >
                            <span className="relative z-10 flex items-center gap-2 text-sm uppercase tracking-wide">{loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Giriş yapılıyor</> : <>Giriş Yap <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>}</span>
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        </button>
                    </form>

                    <p className="text-center text-xs text-white/30 mt-8 font-light">
                        Hesabın yok mu?{" "}
                        <Link href="/auth/register" className="text-[#00DC82] font-semibold hover:text-[#00E5FF] transition-colors duration-300">
                            Hemen ücretsiz kaydol
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}

function errorMessage(code: string | null): string {
    switch (code) {
        case "invalid_credentials":
        case "CredentialsSignin":
            return "E-posta ya da şifre hatalı.";
        case "email_not_confirmed":
            return "E-postanı henüz doğrulamadın. Gelen kutundaki bağlantıya tıkla.";
        case "rate_limited":
            return "Çok fazla deneme yapıldı. Birkaç dakika sonra tekrar dene.";
        case "confirm_failed":
            return "Doğrulama bağlantısı geçersiz ya da süresi dolmuş. Yeniden kayıt olmayı dene.";
        case "OAuthAccountNotLinked":
            return "Bu e-posta başka bir giriş yöntemiyle kayıtlı.";
        default:
            return "Giriş şu an yapılamadı. Biraz sonra tekrar dene.";
    }
}

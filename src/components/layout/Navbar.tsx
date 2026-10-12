"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "@/components/providers/LocaleProvider";
import { locales } from "@/lib/i18n";
import { useSession } from "next-auth/react";
import { Menu, X, ChevronDown, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";

const Globe3D = dynamic(() => import("@/components/3d/Globe3D"), {
    ssr: false,
    loading: () => (
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#00DC82]/20 to-[#00E5FF]/20 animate-pulse" />
    ),
});

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [langOpen, setLangOpen] = useState(false);

    const { locale, setLocale, t } = useLocale();
    const { data: session } = useSession();
    const langRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (langRef.current && !langRef.current.contains(e.target as Node)) {
                setLangOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);


    const currentLocale = locales.find((l) => l.code === locale);

    const navLinks = [
        { label: t("nav", "features") as string, href: "#features" },
        { label: t("nav", "language") as string, href: "#services" },
        { label: t("nav", "visa") as string, href: "#services" },
    ];

    return (
        <>
            <motion.header
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
                    scrolled ? "py-2" : "py-4"
                )}
            >
                <nav
                    className={cn(
                        "max-w-[1200px] mx-auto px-6 h-14 flex items-center justify-between rounded-2xl transition-all duration-500",
                        scrolled
                            ? "bg-[rgba(0,0,0,0.7)] backdrop-blur-xl border border-[rgba(255,255,255,0.06)] shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
                            : "bg-transparent"
                    )}
                >
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
                        <Globe3D size={48} />
                        <span className="font-bold text-lg text-white tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                            GlobalLife
                            <span className="ml-1" style={{
                                background: "linear-gradient(135deg, #00DC82, #00E5FF)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                            }}>AI</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden lg:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                className="px-4 py-2 text-[rgba(255,255,255,0.5)] hover:text-white text-sm font-medium transition-colors duration-200 rounded-lg hover:bg-[rgba(255,255,255,0.05)]"
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden lg:flex items-center gap-2">
                        {/* Language Switcher */}
                        <div ref={langRef} className="relative">
                            <button
                                onClick={() => setLangOpen(!langOpen)}
                                className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-[rgba(255,255,255,0.05)] transition-colors text-sm"
                            >
                                <span className="text-[rgba(255,255,255,0.7)] font-medium">{currentLocale?.flag}</span>
                                <ChevronDown className={cn("w-3 h-3 text-[rgba(255,255,255,0.4)] transition-transform", langOpen && "rotate-180")} />
                            </button>
                            <AnimatePresence>
                                {langOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                        className="absolute right-0 top-full mt-2 rounded-xl overflow-hidden min-w-[160px]"
                                        style={{
                                            background: "rgba(20,20,30,0.95)",
                                            border: "1px solid rgba(255,255,255,0.08)",
                                            backdropFilter: "blur(20px)",
                                            boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
                                        }}
                                    >
                                        {locales.map((l) => (
                                            <button
                                                key={l.code}
                                                onClick={() => { setLocale(l.code); setLangOpen(false); }}
                                                className={cn(
                                                    "w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors",
                                                    locale === l.code
                                                        ? "text-white bg-[rgba(255,255,255,0.08)]"
                                                        : "text-[rgba(255,255,255,0.5)] hover:text-white hover:bg-[rgba(255,255,255,0.04)]"
                                                )}
                                            >
                                                <span className="font-mono text-xs opacity-60">{l.flag}</span>
                                                <span>{l.label}</span>
                                                {locale === l.code && (
                                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#00DC82]" />
                                                )}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>



                        {session ? (
                            <Link
                                href="/dashboard"
                                className="flex items-center gap-2.5 px-5 py-2 text-sm font-semibold text-[#030308] rounded-lg transition-all hover:shadow-[0_0_20px_rgba(0,220,130,0.4)]"
                                style={{ background: "linear-gradient(135deg, #00DC82, #00E5FF)" }}
                            >
                                <LayoutDashboard className="w-4 h-4" />
                                <span>Dashboard</span>
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href="/auth/login"
                                    className="px-4 py-2 text-sm font-medium text-[rgba(255,255,255,0.6)] hover:text-white transition-colors"
                                >
                                    {t("nav", "login") as string}
                                </Link>
                                <Link
                                    href="/auth/register"
                                    className="px-5 py-2 text-sm font-semibold text-white rounded-lg transition-all hover:shadow-[0_0_20px_rgba(10,132,255,0.4)]"
                                    style={{ background: "linear-gradient(135deg, #00DC82, #00E5FF)", color: "#030308" }}
                                >
                                    {t("nav", "getStarted") as string}
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile toggle */}
                    <button
                        className="lg:hidden p-2 rounded-lg hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                        onClick={() => setMobileOpen(!mobileOpen)}
                    >
                        {mobileOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
                    </button>
                </nav>
            </motion.header>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 lg:hidden"
                        style={{ background: "rgba(0,0,0,0.95)", backdropFilter: "blur(20px)" }}
                    >
                        <div className="pt-24 px-6 flex flex-col gap-2">
                            {navLinks.map((link, i) => (
                                <motion.a
                                    key={link.label}
                                    href={link.href}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    onClick={() => setMobileOpen(false)}
                                    className="py-3 px-4 text-lg font-medium text-white hover:bg-[rgba(255,255,255,0.05)] rounded-xl transition-colors"
                                >
                                    {link.label}
                                </motion.a>
                            ))}
                            <hr className="border-[rgba(255,255,255,0.08)] my-4" />
                            {/* Mobile Language */}
                            <div className="flex items-center gap-2 flex-wrap px-4">
                                {locales.map((l) => (
                                    <button
                                        key={l.code}
                                        onClick={() => setLocale(l.code)}
                                        className={cn(
                                            "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                            locale === l.code
                                                ? "bg-[rgba(0,220,130,0.15)] text-[#00DC82]"
                                                : "text-[rgba(255,255,255,0.4)] hover:text-white"
                                        )}
                                    >
                                        {l.flag}
                                    </button>
                                ))}
                            </div>
                            <div className="flex flex-col gap-3 mt-4">
                                <Link href="/auth/login" className="py-3 text-center rounded-xl text-white border border-[rgba(255,255,255,0.1)]">
                                    {t("nav", "login") as string}
                                </Link>
                                <Link
                                    href="/auth/register"
                                    className="py-3 text-center rounded-xl text-white font-semibold"
                                    style={{ background: "linear-gradient(135deg, #00DC82, #00E5FF)", color: "#030308" }}
                                >
                                    {t("nav", "getStarted") as string}
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

// The single-card layout used by the password pages, in the login page's style.
export default function AuthCard({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#030308] p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-[440px] rounded-[32px] bg-[#0A0A0F] border border-white/5 p-8 sm:p-10 shadow-[0_0_80px_rgba(0,0,0,0.6)]"
            >
                <Link href="/" className="inline-flex items-center gap-2.5 mb-8 group">
                    <Image src="/brand/globallife-logo.svg" alt="" width={40} height={40} className="w-10 h-10 rounded-xl group-hover:scale-105 transition-transform duration-300" />
                    <span className="text-white font-semibold">GlobalLife</span>
                </Link>
                <h1 className="text-3xl font-bold text-white mb-2 tracking-tight" style={{ fontFamily: "var(--font-display)" }}>{title}</h1>
                <p className="text-[#888899] font-light mb-8">{subtitle}</p>
                {children}
            </motion.div>
        </div>
    );
}

export const inputClass =
    "w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-white/10 outline-none focus:border-[#00DC82]/30 focus:bg-[#030308] transition-all duration-300 text-sm font-light";

export const buttonClass =
    "w-full py-4 rounded-2xl font-bold text-[#030308] text-sm flex items-center justify-center gap-2 transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none";

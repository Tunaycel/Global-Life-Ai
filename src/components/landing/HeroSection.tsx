"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { wordRevealContainer, wordReveal } from "@/lib/animations";
import { ChevronDown, Play, Star, ArrowRight } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import Link from "next/link";

export default function HeroSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    const { t } = useLocale();

    return (
        <section
            ref={ref}
            className="relative min-h-screen flex items-center overflow-hidden"
        >
            {/* Radial spotlight for depth */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: `
            radial-gradient(ellipse 80% 50% at 50% 20%, rgba(0,220,130,0.04) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 30% 60%, rgba(0,229,255,0.03) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 100%, rgba(3,3,8,0.8) 0%, transparent 50%)
          `,
                }}
            />

            {/* Content */}
            <div className="relative z-10 max-w-[1200px] mx-auto px-6 w-full pt-24">
                <div className="text-center max-w-[900px] mx-auto">
                    {/* Tag */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.7, delay: 0.3 }}
                        className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full mb-10"
                        style={{
                            background: "rgba(0,220,130,0.06)",
                            border: "1px solid rgba(0,220,130,0.15)",
                            backdropFilter: "blur(12px)",
                        }}
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00DC82] opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00DC82]" />
                        </span>
                        <span className="text-sm tracking-wider font-medium uppercase" style={{ color: "rgba(0,220,130,0.7)" }}>
              {"// "}{t("hero", "tag") as string}
                        </span>
                    </motion.div>

                    {/* Title — Space Grotesk */}
                    <motion.h1
                        variants={wordRevealContainer}
                        initial="initial"
                        animate={isInView ? "animate" : "initial"}
                        className="mb-8"
                        style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "clamp(2.8rem, 6.5vw, 5rem)",
                            fontWeight: 700,
                            lineHeight: 1.05,
                            letterSpacing: "-0.04em",
                        }}
                    >
                        <span className="block text-white">
                            {(t("hero", "title1") as string).split(" ").map((word, i) => (
                                <span key={i} className="inline-block overflow-hidden mr-[0.3em]">
                                    <motion.span variants={wordReveal} className="inline-block">{word}</motion.span>
                                </span>
                            ))}
                        </span>
                        <span className="block">
                            {(t("hero", "title2") as string).split(" ").map((word, i) => (
                                <span key={i} className="inline-block overflow-hidden mr-[0.3em]">
                                    <motion.span
                                        variants={wordReveal}
                                        className="inline-block"
                                        style={
                                            word === "AI" || word === "AI." || word === "KI."
                                                ? {
                                                    background: "linear-gradient(135deg, #00DC82, #00E5FF, #F5A623)",
                                                    WebkitBackgroundClip: "text",
                                                    WebkitTextFillColor: "transparent",
                                                }
                                                : { color: "white" }
                                        }
                                    >
                                        {word}
                                    </motion.span>
                                </span>
                            ))}
                        </span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="text-lg md:text-xl mb-12 max-w-[640px] mx-auto leading-relaxed"
                        style={{ color: "rgba(255,255,255,0.45)", fontFamily: "var(--font-sans)" }}
                    >
                        {t("hero", "subtitle") as string}
                    </motion.p>

                    {/* CTAs */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.8 }}
                        className="flex flex-wrap items-center justify-center gap-4 mb-6"
                    >
                        <Link
                            href="/auth/register"
                            className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-[#030308] overflow-hidden transition-transform hover:scale-105 active:scale-[0.98]"
                            style={{
                                fontFamily: "var(--font-display)",
                                background: "linear-gradient(135deg, #00DC82, #00E5FF)",
                                boxShadow: "0 0 50px rgba(0,220,130,0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
                            }}
                        >
                            <span className="relative z-10">{t("hero", "cta") as string}</span>
                            <ArrowRight className="relative z-10 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                        </Link>
                        <button
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all hover:scale-105"
                            style={{
                                fontFamily: "var(--font-display)",
                                background: "rgba(255,255,255,0.04)",
                                border: "1px solid rgba(255,255,255,0.1)",
                                color: "rgba(255,255,255,0.7)",
                                backdropFilter: "blur(8px)",
                            }}
                        >
                            <Play className="w-4 h-4" /> {t("hero", "demo") as string}
                        </button>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : {}}
                        transition={{ delay: 1 }}
                        className="text-xs mb-14"
                        style={{ color: "rgba(255,255,255,0.2)" }}
                    >
                        {t("hero", "noCard") as string}
                    </motion.p>

                    {/* Social Proof */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 1.1 }}
                        className="flex items-center justify-center gap-6"
                    >
                        <div className="flex -space-x-2">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div
                                    key={i}
                                    className="w-9 h-9 rounded-full border-2 border-[#030308]"
                                    style={{
                                        background: `linear-gradient(135deg, hsl(${140 + i * 30}, 70%, 50%), hsl(${170 + i * 30}, 60%, 45%))`,
                                    }}
                                />
                            ))}
                        </div>
                        <div className="text-left">
                            <p className="text-sm text-white font-semibold" style={{ fontFamily: "var(--font-display)" }}>
                                2,400+ {t("hero", "users") as string}
                            </p>
                            <div className="flex items-center gap-1 mt-0.5">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <Star key={i} className="w-3.5 h-3.5 fill-[#F5A623] text-[#F5A623]" />
                                ))}
                                <span className="text-xs ml-1" style={{ color: "rgba(255,255,255,0.3)" }}>4.9</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 1.5 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
            >
                <span className="text-[10px] uppercase tracking-[0.2em]" style={{ color: "rgba(255,255,255,0.25)", fontFamily: "var(--font-display)" }}>
                    Scroll
                </span>
                <ChevronDown className="w-5 h-5 bounce-chevron" style={{ color: "rgba(255,255,255,0.25)" }} />
            </motion.div>
        </section>
    );
}

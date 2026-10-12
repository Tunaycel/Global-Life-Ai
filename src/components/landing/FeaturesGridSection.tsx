"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Zap, Shield, BarChart3, Clock, Cpu, Globe, Sparkles, Lock } from "lucide-react";

const features = [
    { icon: Cpu, title: "Neural Language Engine", desc: "AI conversations that adapt to your level in real time", span: "md:col-span-2", gradient: "from-[#0A84FF]/10 to-[#5E5CE6]/10" },
    { icon: BarChart3, title: "Progress Analytics", desc: "Deep insights into your learning patterns with predictive scoring", span: "", gradient: "from-[#5E5CE6]/10 to-[#BF5AF2]/10" },
    { icon: Shield, title: "Document Vault", desc: "Encrypted storage for sensitive immigration documents", span: "", gradient: "from-[#30D158]/10 to-[#34C759]/10" },
    { icon: Globe, title: "Country Guides", desc: "Immigration guides for the destinations you are considering", span: "", gradient: "from-[#0A84FF]/10 to-[#00C7BE]/10" },
    { icon: Clock, title: "24/7 Availability", desc: "AI consultants that never sleep — get answers at 3 AM", span: "", gradient: "from-[#FF9F0A]/10 to-[#FF6723]/10" },
    { icon: Zap, title: "Instant Feedback", desc: "Real-time pronunciation scoring and grammar correction", span: "md:col-span-2", gradient: "from-[#BF5AF2]/10 to-[#FF2D55]/10" },
    { icon: Lock, title: "Secure by Default", desc: "Encrypted connections and a managed database for your data", span: "", gradient: "from-[#636366]/10 to-[#48484A]/10" },
    { icon: Sparkles, title: "Smart Recommendations", desc: "AI-curated study materials based on your progress and goals", span: "", gradient: "from-[#FFD60A]/10 to-[#FF9F0A]/10" },
];

export default function FeaturesGridSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section
            ref={ref}
            id="features"
            className="relative py-24 overflow-hidden"
            style={{ background: "transparent" }}
        >
            <div className="relative z-10 max-w-[1100px] mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : {}}
                        className="text-xs font-medium uppercase tracking-[0.2em] mb-4"
                        style={{ color: "rgba(255,255,255,0.3)" }}
                    >
                        Platform Features
                    </motion.p>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        className="text-3xl md:text-4xl font-bold text-white tracking-tight"
                    >
                        Built for Excellence
                    </motion.h2>
                </div>

                {/* Bento Grid */}
                <div className="grid md:grid-cols-4 gap-4">
                    {features.map((feature, i) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.05 + i * 0.06 }}
                            className={`group rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 ${feature.span}`}
                            style={{
                                background: "rgba(255,255,255,0.02)",
                                border: "1px solid rgba(255,255,255,0.05)",
                            }}
                        >
                            <div
                                className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br ${feature.gradient}`}
                            >
                                <feature.icon className="w-5 h-5 text-white/70" />
                            </div>
                            <h3 className="font-semibold text-white mb-1.5">{feature.title}</h3>
                            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
                                {feature.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

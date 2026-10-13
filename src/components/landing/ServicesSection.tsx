"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Languages, Plane, BookOpen, Mic, FileCheck, Map, Brain, Shield, GraduationCap, Headphones } from "lucide-react";

const tabs = [
    {
        id: "language",
        label: "Language Learning",
        icon: Languages,
        features: [
            { icon: Mic, title: "AI Voice Tutor", desc: "Real-time conversation practice with adaptive AI that corrects pronunciation and grammar instantly" },
            { icon: Brain, title: "Neural Personalization", desc: "Algorithms that analyze your learning patterns and create optimized study paths" },
            { icon: GraduationCap, title: "IELTS & TOEFL Mastery", desc: "Structured exam preparation with AI-scored mock tests and detailed feedback" },
            { icon: Headphones, title: "Immersive Listening", desc: "Context-aware listening exercises using real-world audio scenarios" },
        ],
    },
    {
        id: "visa",
        label: "Visa & Immigration",
        icon: Plane,
        features: [
            { icon: FileCheck, title: "Document Intelligence", desc: "AI-powered document review that catches errors before submission" },
            { icon: Map, title: "Personal Roadmap", desc: "Step-by-step immigration timeline customized to your destination and visa type" },
            { icon: Shield, title: "24/7 AI Consultant", desc: "Expert-level immigration guidance available anytime, in any language" },
            { icon: BookOpen, title: "Country Insights", desc: "Guides on the requirements, costs and opportunities of your destination country" },
        ],
    },
];

export default function ServicesSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const [activeTab, setActiveTab] = useState("language");

    const activeData = tabs.find((tab) => tab.id === activeTab)!;

    return (
        <section
            ref={ref}
            id="services"
            className="relative py-24 overflow-hidden"
            style={{ background: "transparent" }}
        >
            {/* Ambient glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] pointer-events-none"
                style={{ background: "radial-gradient(ellipse at center top, rgba(94,92,230,0.06), transparent 70%)" }}
            />

            <div className="relative z-10 max-w-[1100px] mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-12">
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : {}}
                        className="text-xs font-medium uppercase tracking-[0.2em] mb-4"
                        style={{ color: "rgba(255,255,255,0.3)" }}
                    >
                        Core Capabilities
                    </motion.p>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        className="text-3xl md:text-4xl font-bold text-white tracking-tight"
                    >
                        Two Platforms. One Mission.
                    </motion.h2>
                </div>

                {/* Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.1 }}
                    className="flex justify-center gap-2 mb-12"
                >
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id
                                ? "text-white shadow-[0_0_20px_rgba(10,132,255,0.15)]"
                                : "text-[rgba(255,255,255,0.4)] hover:text-[rgba(255,255,255,0.6)]"
                                }`}
                            style={
                                activeTab === tab.id
                                    ? { background: "rgba(10,132,255,0.12)", border: "1px solid rgba(10,132,255,0.2)" }
                                    : { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }
                            }
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </motion.div>

                {/* Features Grid */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="grid md:grid-cols-2 gap-5"
                    >
                        {activeData.features.map((feature, i) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.08 }}
                                className="group rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
                                style={{
                                    background: "rgba(255,255,255,0.02)",
                                    border: "1px solid rgba(255,255,255,0.06)",
                                }}
                            >
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-all group-hover:shadow-[0_0_20px_rgba(10,132,255,0.15)]"
                                    style={{ background: "rgba(10,132,255,0.08)", border: "1px solid rgba(10,132,255,0.1)" }}
                                >
                                    <feature.icon className="w-5 h-5 text-[#0A84FF]" />
                                </div>
                                <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
                                    {feature.desc}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    );
}

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Construction } from "lucide-react";

const tabs = ["Speaking", "Writing", "Reading", "Listening"];

const speakingParts = [
    { part: "Part 1", title: "Genel Sorular", desc: "Günlük konular hakkında kısa cevaplar", count: "12 Soru Seti", band: "6.5" },
    { part: "Part 2", title: "Cue Card", desc: "1 dk hazırlık, 2 dk konuşma", count: "20 Kart", band: "—" },
    { part: "Part 3", title: "Derinlemesine Tartışma", desc: "Detaylı analiz ve fikir belirtme", count: "15 Konu", band: "—" },
];

export default function IELTSPage() {
    const [activeTab, setActiveTab] = useState("Speaking");

    return (
        <div className="max-w-[1100px] mx-auto space-y-6">
            <div>
                <h1 className="text-h2 text-[var(--text-primary)] mb-2">IELTS Hazırlık</h1>
                <p className="text-body text-[var(--text-secondary)]">Tam sınav simülasyonu ve detaylı geri bildirim</p>
            </div>

            {/* Score Overview */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="lg:col-span-1 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)] p-5 text-center">
                    <p className="text-xs text-[var(--text-tertiary)] mb-1">Tahmini Band</p>
                    <p className="text-h1 gradient-text">6.5</p>
                    <p className="text-xs text-[var(--text-secondary)] mt-1">Genel Skor</p>
                </div>
                {["Listening: 7.0", "Reading: 6.5", "Writing: 6.0", "Speaking: 6.5"].map((score, i) => (
                    <div key={i} className="rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)] p-5 text-center">
                        <p className="text-sm font-semibold text-[var(--text-primary)]">{score.split(":")[0]}</p>
                        <p className="text-h3 text-[var(--text-primary)] mt-1">{score.split(":")[1]}</p>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-[var(--border)] pb-0">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all -mb-px ${activeTab === tab
                                ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                                : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {activeTab === "Speaking" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    {speakingParts.map((part, i) => (
                        <motion.div
                            key={part.part}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)] p-6 flex items-center justify-between hover:shadow-md transition-all"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-[#0A84FF]/10 flex items-center justify-center font-bold text-[#0A84FF] text-sm">
                                    {part.part.split(" ")[1]}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-[var(--text-primary)]">{part.part}: {part.title}</h3>
                                    <p className="text-caption text-[var(--text-secondary)]">{part.desc}</p>
                                    <p className="text-xs text-[var(--text-tertiary)] mt-1">{part.count}</p>
                                </div>
                            </div>
                            <button className="btn-primary !py-2.5 !px-5 !text-sm shrink-0">
                                Başla
                            </button>
                        </motion.div>
                    ))}

                    {/* Mock Test */}
                    <div className="rounded-2xl bg-gradient-to-r from-[#0A84FF]/10 to-[#5E5CE6]/10 border border-[#0A84FF]/20 p-6 text-center">
                        <h3 className="text-h3 text-[var(--text-primary)] mb-2">Tam Mock Test</h3>
                        <p className="text-body text-[var(--text-secondary)] mb-4">Gerçek sınav formatında 4 bölüm, tam süre</p>
                        <button className="btn-primary shimmer !py-3 !px-8">Mock Test Başlat</button>
                    </div>
                </motion.div>
            )}

            {activeTab !== "Speaking" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)] p-12 text-center">
                    <Construction className="w-12 h-12 mx-auto mb-4 text-[var(--text-secondary)]" aria-hidden="true" />
                    <h3 className="text-h3 text-[var(--text-primary)] mb-2">{activeTab} Modülü</h3>
                    <p className="text-body text-[var(--text-secondary)]">Bu modül yakında aktif olacak. Speaking ile başlamayı dene!</p>
                </motion.div>
            )}
        </div>
    );
}

"use client";

import { motion } from "framer-motion";
import {
    Mic, Book, GraduationCap, Plane, Play, ArrowRight,
    Clock, Brain, Flame, Plus, Search, Bell, History,
    CheckCircle2, Circle, MoreHorizontal, Trophy
} from "lucide-react";
import Link from "next/link";
import { useState, type SVGProps } from "react";

const fadeInUp = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
};

const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];

export default function LanguageLabPage() {
    const [selectedLevel, setSelectedLevel] = useState("B2");

    return (
        <div className="max-w-[1200px] mx-auto space-y-6">

            {/* ── HEADER ── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Language Laboratory</h1>
                    <p className="text-sm text-white/30 font-medium">Continue your immersion training.</p>
                </div>

                <div className="flex items-center gap-4">
                    {/* Level Selector */}
                    <div className="flex items-center gap-1 p-1 rounded-full bg-white/5 border border-white/10">
                        {levels.map((lvl) => (
                            <button
                                key={lvl}
                                onClick={() => setSelectedLevel(lvl)}
                                className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${selectedLevel === lvl
                                    ? "bg-[#0A84FF] text-white shadow-[0_0_12px_rgba(10,132,255,0.4)]"
                                    : "text-white/30 hover:text-white/60"
                                    }`}
                            >
                                {lvl}
                            </button>
                        ))}
                    </div>

                    {/* Search & Actions */}
                    <div className="flex items-center gap-2">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20 group-hover:text-white/40 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search modules..."
                                className="pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-[#0A84FF]/40 w-[180px] transition-all"
                            />
                        </div>
                        <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 border border-white/10">
                            <span className="text-[10px] font-bold text-white/60 uppercase">US</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-[#30D158]" />
                        </div>
                    </div>
                </div>
            </div>

            {/* ── TOP STATS ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Study Time", value: "12h 45m", icon: Clock, color: "#0A84FF" },
                    { label: "Words Learned", value: "1,248", icon: Brain, color: "#5E5CE6", sub: "+24 this week" },
                    { label: "Current Streak", value: "14 Days", icon: Flame, color: "#FF9F0A" },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        {...fadeInUp}
                        transition={{ delay: i * 0.05 }}
                        className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col justify-between h-[120px]"
                    >
                        <div className="flex items-center justify-between">
                            <p className="text-[10px] font-bold text-white/30 uppercase tracking-wider">{stat.label}</p>
                            <stat.icon className="w-4 h-4 text-white/30" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">{stat.value}</p>
                            {stat.sub && (
                                <p className="text-[10px] font-semibold text-[#30D158] mt-1">{stat.sub}</p>
                            )}
                            <div className="h-1 w-full bg-white/5 rounded-full mt-3 overflow-hidden">
                                <div className="h-full bg-current rounded-full" style={{ width: "60%", color: stat.color }} />
                            </div>
                        </div>
                    </motion.div>
                ))}

                {/* Set New Goal Card */}
                <motion.div
                    {...fadeInUp}
                    transition={{ delay: 0.15 }}
                    className="p-5 rounded-2xl bg-[#0A84FF]/5 border border-[#0A84FF]/10 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-[#0A84FF]/10 transition-colors h-[120px]"
                >
                    <div className="w-8 h-8 rounded-full bg-[#0A84FF]/20 flex items-center justify-center">
                        <Plus className="w-4 h-4 text-[#0A84FF]" />
                    </div>
                    <p className="text-xs font-bold text-white">Set New Goal</p>
                </motion.div>
            </div>

            {/* ── MAIN GRID ── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

                {/* ── AI Speech Lab (Main) ── */}
                <motion.div
                    {...fadeInUp}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-8 rounded-3xl p-8 relative overflow-hidden flex flex-col items-center justify-center min-h-[440px]"
                    style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
                >
                    <div className="absolute top-8 left-8">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#BF5AF2] animate-pulse" />
                            <span className="text-[9px] font-black text-[#BF5AF2] uppercase tracking-[0.2em]">Live Analysis</span>
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-2">AI Speech Lab</h2>
                        <p className="text-sm text-white/30 max-w-[300px] leading-relaxed">
                            Real-time pronunciation correction with phonetic feedback engine.
                        </p>
                    </div>

                    <div className="absolute top-8 right-8">
                        <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                            <AudioLines className="w-5 h-5 text-white/60" />
                        </button>
                    </div>

                    {/* Waveform Animation */}
                    <div className="flex items-center justify-center gap-1.5 h-24 mb-12">
                        {[1.2, 2.5, 3.8, 4.2, 5.0, 4.2, 3.8, 2.5, 1.2].map((h, i) => (
                            <motion.div
                                key={i}
                                initial={{ height: 10 }}
                                animate={{ height: [10, h * 15, 10] }}
                                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1, ease: "easeInOut" }}
                                className="w-2.5 rounded-full"
                                style={{ background: "linear-gradient(to bottom, #BF5AF2, #5E5CE6)" }}
                            />
                        ))}
                    </div>

                    <div className="flex flex-col items-center gap-4">
                        <button className="flex items-center gap-3 px-10 py-4 rounded-full bg-white text-[#030308] font-bold text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-[0_8px_24px_rgba(255,255,255,0.1)]">
                            <Play className="w-4 h-4 fill-current" />
                            Start Session
                        </button>
                        <div className="flex flex-col items-center">
                            <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] mb-1">Accuracy</span>
                            <span className="text-2xl font-bold text-white">94.2%</span>
                        </div>
                    </div>
                </motion.div>

                {/* ── Side Cards ── */}
                <div className="lg:col-span-4 flex flex-col gap-5">

                    {/* IELTS Card */}
                    <motion.div
                        {...fadeInUp}
                        transition={{ delay: 0.25 }}
                        className="p-6 rounded-3xl flex flex-col justify-between h-[210px] relative overflow-hidden group"
                        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
                    >
                        <div className="flex items-start justify-between">
                            <div className="w-10 h-10 rounded-xl bg-[#FFD60A]/10 border border-[#FFD60A]/20 flex items-center justify-center">
                                <Trophy className="w-5 h-5 text-[#FFD60A]" />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white mb-1">IELTS Target 8.5</h3>
                            <p className="text-xs text-white/30 mb-4 line-clamp-2">Advanced academic vocabulary module.</p>
                            <div className="flex items-center gap-4">
                                <div className="relative w-12 h-12">
                                    <svg className="w-12 h-12 -rotate-90" viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                                        <circle cx="50" cy="50" r="42" fill="none" stroke="#FFD60A" strokeWidth="8" strokeLinecap="round" strokeDasharray={264} strokeDashoffset={264 * 0.25} />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white">75%</div>
                                </div>
                                <span className="text-xs font-bold text-white/80 group-hover:text-white transition-colors cursor-pointer flex items-center gap-1.5">
                                    Continue <ArrowRight className="w-3.5 h-3.5" />
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Grammar Card */}
                    <motion.div
                        {...fadeInUp}
                        transition={{ delay: 0.3 }}
                        className="p-6 rounded-3xl flex flex-col justify-between h-[210px]"
                        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
                    >
                        <div className="w-10 h-10 rounded-xl bg-[#30D158]/10 border border-[#30D158]/20 flex items-center justify-center">
                            <Book className="w-5 h-5 text-[#30D158]" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white mb-1">Grammar Architect</h3>
                            <p className="text-xs text-white/30 mb-6">Master complex sentence structures.</p>
                            <div className="h-6 w-full bg-white/5 rounded-full overflow-hidden relative">
                                <div className="absolute left-0 top-0 h-full bg-[#30D158]/40 rounded-full" style={{ width: "80%" }} />
                                <div className="absolute inset-0 flex items-center px-4">
                                    <div className="h-1 w-full bg-white/10 rounded-full">
                                        <div className="h-full bg-[#30D158] rounded-full" style={{ width: "40%" }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* ── Visa Simulation Card (Wide) ── */}
            <motion.div
                {...fadeInUp}
                transition={{ delay: 0.35 }}
                className="p-8 rounded-[32px] flex flex-col md:flex-row items-center gap-8"
                style={{ background: "linear-gradient(135deg, rgba(94,92,230,0.05), rgba(10,132,255,0.05))", border: "1px solid rgba(255,255,255,0.06)" }}
            >
                <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                    <UserCircle className="w-10 h-10 text-white/40" />
                </div>
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">Visa Interview Simulation</h3>
                    <p className="text-sm text-white/30 leading-relaxed max-w-[600px]">
                        Practice high-stakes conversations with an AI officer trained on real interview transcripts. Includes body language analysis via webcam.
                    </p>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                    <div className="flex -space-x-2">
                        <div className="w-8 h-8 rounded-full bg-white/10 border-2 border-[#030308] flex items-center justify-center text-[10px] font-bold text-white/60">You</div>
                        <div className="w-8 h-8 rounded-full bg-[#0A84FF] border-2 border-[#030308] flex items-center justify-center text-[10px] font-bold text-white">AI</div>
                    </div>
                    <button className="px-8 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-bold hover:bg-white/10 transition-colors">
                        Resume
                    </button>
                </div>
            </motion.div>

            {/* ── RECENT ACTIVITY ── */}
            <motion.div
                {...fadeInUp}
                transition={{ delay: 0.4 }}
                className="rounded-3xl p-8"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-lg font-bold text-white flex items-center gap-3">
                        <History className="w-5 h-5 text-white/30" />
                        Recent Activity
                    </h3>
                    <button className="text-xs font-bold text-white/30 hover:text-white/60 transition-colors">View All</button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] border-b border-white/5">
                                <th className="pb-4 font-black">Module</th>
                                <th className="pb-4 font-black">Type</th>
                                <th className="pb-4 font-black">Duration</th>
                                <th className="pb-4 font-black">Score</th>
                                <th className="pb-4 font-black text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.03]">
                            {[
                                { name: "Future Tense Mastery", type: "Grammar", duration: "12m 30s", score: "92%", color: "#30D158", status: "Completed" },
                                { name: "Business Networking", type: "Speaking", duration: "45m 00s", score: "--", color: "#BF5AF2", status: "In Progress" },
                            ].map((row, i) => (
                                <tr key={i} className="group">
                                    <td className="py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: row.color }} />
                                            <span className="text-sm font-bold text-white/80 group-hover:text-white transition-colors">{row.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-5 text-xs text-white/40">{row.type}</td>
                                    <td className="py-5 text-xs text-white/40">{row.duration}</td>
                                    <td className="py-5 text-sm font-bold text-white/80">{row.score}</td>
                                    <td className="py-5 text-right">
                                        <span className={`px-2.5 py-1 rounded text-[10px] font-bold ${row.status === "Completed"
                                            ? "bg-[#30D158]/10 text-[#30D158]"
                                            : "bg-white/5 text-white/40"
                                            }`}>
                                            {row.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>

        </div>
    );
}

/* ── HELPERS ── */
function AudioLines(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M2 10v3" />
            <path d="M6 6v11" />
            <path d="M10 3v18" />
            <path d="M14 8v7" />
            <path d="M18 5v13" />
            <path d="M22 10v3" />
        </svg>
    )
}

function UserCircle(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="10" r="3" />
            <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
        </svg>
    )
}

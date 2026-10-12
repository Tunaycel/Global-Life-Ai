"use client";

import { motion } from "framer-motion";
import {
    Search, Plane, Shield, GraduationCap, Briefcase,
    Compass, Users, Globe, ArrowUpRight, History,
    MessageSquare, CheckCircle, Smartphone,
    Sparkles, ArrowRight, UserCheck, Info, Bell, Settings
} from "lucide-react";
import Link from "next/link";

const fadeInUp = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
};

const popularDestinations = [
    { code: "DE", name: "Germany", bg: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=400&q=80" },
    { code: "US", name: "United States", bg: "https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=400&q=80" },
    { code: "GB", name: "United Kingdom", bg: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&q=80" },
    { code: "CA", name: "Canada", bg: "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=400&q=80" },
];

const visaCategories = [
    { icon: GraduationCap, title: "Student Visa", duration: "3-6 Months", color: "#0A84FF" },
    { icon: Briefcase, title: "Work Visa", duration: "4-8 Months", color: "#FFD60A" },
    { icon: Compass, title: "Tourist Visa", duration: "1-3 Months", color: "#30D158" },
    { icon: Users, title: "Family Visa", duration: "6-12 Months", color: "#BF5AF2" },
];

export default function GlobalVisaCenter() {
    return (
        <div className="max-w-[1240px] mx-auto space-y-12">

            {/* ── HERO SECTION ── */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative rounded-[40px] p-12 overflow-hidden flex flex-col items-center text-center group"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
                {/* Background Pattern */}
                <div className="absolute inset-0 pointer-events-none opacity-20">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(94,92,230,0.1),transparent_70%)]" />
                    <div className="w-full h-full border-b border-white/[0.03] bg-[size:40px_40px] bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)]" />
                </div>

                <h1 className="relative text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight leading-tight">
                    Global Visa <br />
                    <span className="bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent">Control Center</span>
                </h1>

                <p className="relative text-lg text-white/40 max-w-[600px] mb-10 leading-relaxed font-medium">
                    AI-powered immigration intelligence and visa processing hub. <br />
                    Analyze your eligibility instantly.
                </p>

                <div className="relative w-full max-w-lg group/search">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2">
                        <Search className="w-5 h-5 text-white/20 group-focus-within/search:text-[#0A84FF] transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Enter destination (e.g., Germany, Canada)..."
                        className="w-full pl-14 pr-32 py-5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/20 focus:outline-none focus:border-[#0A84FF]/40 transition-all text-sm backdrop-blur-md"
                    />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 px-6 py-2.5 rounded-xl bg-[#0A84FF] text-white text-[11px] font-black uppercase tracking-wider hover:bg-[#0A84FF]/90 transition-colors shadow-lg shadow-[#0A84FF]/20">
                        Analyze
                    </button>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* ── LEFT: POPULAR DESTINATIONS ── */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-xl font-bold text-white tracking-tight">Popular Destinations</h2>
                        <button className="text-[10px] font-black text-[#0A84FF] uppercase tracking-widest hover:text-[#0A84FF]/80 transition-colors flex items-center gap-2">
                            View all countries <ArrowRight className="w-3 h-3" />
                        </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {popularDestinations.map((dest, i) => (
                            <motion.div
                                key={dest.code}
                                {...fadeInUp}
                                transition={{ delay: i * 0.1 }}
                                className="relative aspect-[3/4] rounded-3xl overflow-hidden group cursor-pointer border border-white/5"
                            >
                                <img
                                    src={dest.bg}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[30%] group-hover:grayscale-0"
                                    alt={dest.name}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                                <div className="absolute top-4 left-4">
                                    <div className="w-10 h-10 rounded-full border border-white/20 p-1 backdrop-blur-md">
                                        <div className="w-full h-full rounded-full overflow-hidden bg-white/10 flex items-center justify-center">
                                            <Globe className="w-5 h-5 text-white/60" />
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute bottom-6 left-6">
                                    <p className="text-2xl font-black text-white mb-0.5 tracking-tighter">{dest.code}</p>
                                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{dest.name}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* ── RIGHT: AI ADVISOR ── */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    <motion.div
                        {...fadeInUp}
                        transition={{ delay: 0.3 }}
                        className="rounded-[32px] p-8 relative overflow-hidden flex-1"
                        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
                    >
                        <div className="absolute top-0 right-0 p-4">
                            <div className="w-10 h-10 rounded-xl bg-[#0A84FF]/10 flex items-center justify-center border border-[#0A84FF]/20">
                                <Sparkles className="w-5 h-5 text-[#0A84FF]" />
                            </div>
                        </div>

                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#5E5CE6] to-[#0A84FF] flex items-center justify-center shadow-lg shadow-blue-500/20">
                                <UserCheck className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white leading-tight">Immigration Assistant</h3>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1 h-1 rounded-full bg-[#30D158]" />
                                    <span className="text-[9px] font-bold text-[#30D158] uppercase tracking-wider">Live</span>
                                </div>
                            </div>
                        </div>

                        <p className="text-sm text-white/30 mb-8 leading-relaxed font-medium">
                            Analyzing 40+ visa parameters in real-time. I can help determine your eligibility score instantly.
                        </p>

                        <button className="w-full py-4 rounded-2xl bg-[#0A84FF] text-white text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-600/20 hover:shadow-blue-600/30 transition-all flex items-center justify-center gap-3 active:scale-[0.98]">
                            <Sparkles className="w-4 h-4 fill-current" />
                            Analyze My Eligibility
                        </button>

                        <div className="mt-8 pt-6 border-t border-white/5 space-y-4">
                            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-4">Recent Updates</p>
                            {[
                                { icon: Info, label: "US Policy Update", time: "2 hours ago" },
                                { icon: Plane, label: "CA Travel Restrictions", time: "5 hours ago" },
                            ].map((update, idx) => (
                                <div key={idx} className="flex items-center gap-3 group cursor-pointer">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors border border-white/5">
                                        <update.icon className="w-4 h-4 text-white/30 group-hover:text-white/60 transition-colors" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-white/80 group-hover:text-white transition-colors">{update.label}</p>
                                        <p className="text-[10px] text-white/20 font-medium">{update.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* ── VISA CATEGORIES ── */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white tracking-tight">Visa Categories</h2>
                    <div className="flex gap-2">
                        <button className="w-10 h-10 rounded-full border border-white/5 hover:border-white/20 flex items-center justify-center transition-colors">
                            <ArrowRight className="w-4 h-4 text-white/40 rotate-180" />
                        </button>
                        <button className="w-10 h-10 rounded-full border border-white/5 hover:border-white/20 flex items-center justify-center transition-colors">
                            <ArrowRight className="w-4 h-4 text-white/40" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    {visaCategories.map((cat, i) => (
                        <motion.div
                            key={cat.title}
                            {...fadeInUp}
                            transition={{ delay: 0.4 + (i * 0.1) }}
                            className="p-8 rounded-[32px] group cursor-pointer relative overflow-hidden"
                            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
                        >
                            <div className="absolute top-6 right-8">
                                <ArrowUpRight className="w-5 h-5 text-white/10 group-hover:text-white transition-colors" />
                            </div>

                            <div
                                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110"
                                style={{ backgroundColor: `${cat.color}15`, border: `1px solid ${cat.color}20` }}
                            >
                                <cat.icon className="w-6 h-6" style={{ color: cat.color }} />
                            </div>

                            <h3 className="text-lg font-bold text-white mb-2 leading-tight">{cat.title}</h3>
                            <p className="text-[11px] font-bold text-white/20 uppercase tracking-widest">Typical Process: {cat.duration}</p>

                            <div className="mt-8 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full rounded-full"
                                    style={{ backgroundColor: cat.color }}
                                    initial={{ width: 0 }}
                                    whileInView={{ width: "40%" }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

        </div>
    );
}

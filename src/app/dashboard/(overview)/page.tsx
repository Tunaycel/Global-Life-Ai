"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
    BookOpen, Plane, Flame, Target, Trophy, Lightbulb,
    ArrowRight, CheckCircle2, Circle, Clock, Mic, FileText, BookMarked, AudioLines,
    Zap, Headphones, Book
} from "lucide-react";

const fadeInUp = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
};

/* ── Streak Grid (deterministic) ── */
const streakData = [
    1, 0, 1, 1, 0, 1, 0,
    1, 1, 0, 1, 1, 1, 0,
    0, 1, 1, 1, 0, 1, 1,
    1, 1, 1, 1, 1, 1, 1,
];

const tasks = [
    { text: "Kelime Çalışması", done: true },
    { text: "Okuma Pratiği (B1)", done: true },
    { text: "Dinleme Egzersizi", done: true },
    { text: "AI Konuşma Pratiği", done: false },
    { text: "Vize Belge Kontrolü", done: false },
];

export default function DashboardPage() {
    const completedTasks = tasks.filter((t) => t.done).length;
    const progressPct = (completedTasks / tasks.length) * 100;

    return (
        <div className="max-w-[1100px] mx-auto space-y-5">
            {/* ═══════ ROW 1: Daily Progress + Language + Achievements ═══════ */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

                {/* ── Günlük İlerleme ── */}
                <motion.div
                    {...fadeInUp}
                    transition={{ duration: 0.5, delay: 0.05 }}
                    className="lg:col-span-1 rounded-2xl p-6"
                    style={{
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid rgba(255,255,255,0.06)",
                    }}
                >
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="font-semibold text-white flex items-center gap-2 text-sm">
                            <Target className="w-4 h-4 text-[#0A84FF]" />
                            Günlük İlerleme
                        </h3>
                        <span className="text-[10px] text-white/30">•••</span>
                    </div>

                    {/* Circular Progress */}
                    <div className="flex justify-center mb-5">
                        <div className="relative w-28 h-28">
                            <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
                                <motion.circle
                                    cx="50" cy="50" r="42" fill="none"
                                    stroke="url(#progressGrad)"
                                    strokeWidth="6"
                                    strokeLinecap="round"
                                    strokeDasharray={264}
                                    initial={{ strokeDashoffset: 264 }}
                                    animate={{ strokeDashoffset: 264 * (1 - progressPct / 100) }}
                                    transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
                                />
                                <defs>
                                    <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#0A84FF" />
                                        <stop offset="100%" stopColor="#5E5CE6" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-2xl font-bold text-white">{progressPct.toFixed(0)}%</span>
                                <span className="text-[10px] text-white/30">Tamamlandı</span>
                            </div>
                        </div>
                    </div>

                    <p className="text-xs text-white/30 text-center mb-4">{completedTasks}/{tasks.length} görev tamamlandı</p>

                    {/* Task list */}
                    <div className="space-y-2.5">
                        {tasks.map((task, i) => (
                            <div key={i} className="flex items-center gap-3">
                                {task.done ? (
                                    <CheckCircle2 className="w-4 h-4 text-[#30D158] shrink-0" />
                                ) : (
                                    <Circle className="w-4 h-4 text-white/15 shrink-0" />
                                )}
                                <span className={`text-xs ${task.done ? "text-white/30 line-through" : "text-white/70"}`}>
                                    {task.text}
                                </span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* ── Dil Öğrenme ── */}
                <motion.div
                    {...fadeInUp}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="lg:col-span-2 rounded-2xl p-6"
                    style={{
                        background: "linear-gradient(145deg, rgba(10,132,255,0.08), rgba(94,92,230,0.05))",
                        border: "1px solid rgba(10,132,255,0.12)",
                    }}
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-white flex items-center gap-2 text-sm">
                            <BookOpen className="w-4 h-4 text-[#0A84FF]" />
                            Dil Öğrenme
                        </h3>
                        <span
                            className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                            style={{ background: "rgba(10,132,255,0.15)", color: "#0A84FF" }}
                        >
                            B1 Seviye
                        </span>
                    </div>

                    <p className="text-xs text-white/40 mb-2">Almanca • Orta Seviye</p>

                    <div className="flex items-end gap-2 mb-5">
                        <span className="text-4xl font-bold text-white">62%</span>
                        <span className="text-xs text-white/30 mb-1.5">Genel İlerleme</span>
                    </div>

                    {/* Progress bar */}
                    <div className="h-2 rounded-full mb-5" style={{ background: "rgba(255,255,255,0.06)" }}>
                        <motion.div
                            className="h-full rounded-full"
                            style={{ background: "linear-gradient(90deg, #0A84FF, #5E5CE6)" }}
                            initial={{ width: 0 }}
                            animate={{ width: "62%" }}
                            transition={{ duration: 1, delay: 0.4 }}
                        />
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3 mb-5">
                        {[
                            { label: "Kelime", value: "1,240" },
                            { label: "Ders", value: "24/40" },
                            { label: "Puan", value: "850 XP" },
                        ].map((stat, i) => (
                            <div
                                key={i}
                                className="rounded-xl p-3 text-center"
                                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.04)" }}
                            >
                                <p className="text-lg font-bold text-white">{stat.value}</p>
                                <p className="text-[10px] text-white/30">{stat.label}</p>
                            </div>
                        ))}
                    </div>

                    <Link
                        href="/dashboard/language"
                        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold text-white transition-all hover:brightness-110"
                        style={{ background: "linear-gradient(135deg, #0A84FF, #5E5CE6)" }}
                    >
                        Derse Devam Et <ArrowRight className="w-4 h-4" />
                    </Link>
                </motion.div>

                {/* ── Son Başarılar ── */}
                <motion.div
                    {...fadeInUp}
                    transition={{ duration: 0.5, delay: 0.15 }}
                    className="lg:col-span-1 rounded-2xl p-6"
                    style={{
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid rgba(255,255,255,0.06)",
                    }}
                >
                    <h3 className="font-semibold text-white flex items-center gap-2 text-sm mb-5">
                        <Trophy className="w-4 h-4 text-[#FFD60A]" />
                        Son Başarılar
                    </h3>

                    <div className="space-y-4">
                        {[
                            { icon: Zap, title: "Hızlı Öğrenici", desc: "3 günde 5 ünite", color: "#0A84FF" },
                            { icon: Mic, title: "Konuşma Ustası", desc: "10dk AI sohbeti", color: "#5E5CE6" },
                            { icon: Book, title: "Kelime Avcısı", desc: "500 yeni kelime", color: "#30D158" },
                        ].map((badge, i) => {
                            const Icon = badge.icon;
                            return (
                                <div key={i} className="flex items-center gap-3">
                                    <div
                                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                                        style={{ background: `${badge.color}15`, border: `1px solid ${badge.color}20` }}
                                    >
                                        <Icon className="w-5 h-5" style={{ color: badge.color }} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-semibold text-white truncate">{badge.title}</p>
                                        <p className="text-[10px] text-white/30">{badge.desc}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <p className="text-[10px] text-white/20 mt-4 text-center">
                        Sırada: <span className="text-[#FFD60A]">Kelime Avcısı</span> • 500 yeni kelime
                    </p>
                </motion.div>
            </div>

            {/* ═══════ ROW 2: Streak + Visa ═══════ */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                {/* ── 12 Gün Streak ── */}
                <motion.div
                    {...fadeInUp}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="rounded-2xl p-6"
                    style={{
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid rgba(255,255,255,0.06)",
                    }}
                >
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-white flex items-center gap-2 text-sm">
                            <Flame className="w-4 h-4 text-[#FF9F0A]" />
                            12 Gün Streak
                        </h3>
                        <span
                            className="px-2.5 py-1 rounded-full text-[10px] font-bold"
                            style={{ background: "rgba(48,209,88,0.12)", color: "#30D158" }}
                        >
                            En İyi: 24 Gün
                        </span>
                    </div>

                    <p className="text-xs text-white/30 mb-4">Harika gidiyorsun, zinciri kırma!</p>

                    {/* Grid */}
                    <div className="grid grid-cols-7 gap-1.5 mb-3">
                        {streakData.map((active, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5 + i * 0.02 }}
                                className="aspect-square rounded-sm"
                                style={{
                                    background: active
                                        ? i >= 21
                                            ? "#30D158"
                                            : i >= 14
                                                ? "rgba(48,209,88,0.6)"
                                                : "rgba(48,209,88,0.3)"
                                        : "rgba(255,255,255,0.04)",
                                }}
                            />
                        ))}
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-[10px] text-white/20">4 hafta önce</span>
                        <span className="text-[10px] text-white/20">Bugün</span>
                    </div>
                </motion.div>

                {/* ── Vize Durumu ── */}
                <motion.div
                    {...fadeInUp}
                    transition={{ duration: 0.5, delay: 0.25 }}
                    className="rounded-2xl p-6"
                    style={{
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid rgba(255,255,255,0.06)",
                    }}
                >
                    <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-white flex items-center gap-2 text-sm">
                            <Plane className="w-4 h-4 text-[#5E5CE6]" />
                            Vize Durumu
                        </h3>
                        <Link href="/dashboard/visa" className="text-[10px] text-white/30 hover:text-white/60 transition-colors flex items-center gap-1">
                            Detaylar <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>
                    <p className="text-xs text-white/30 mb-6">Öğrenci Vizesi • Almanya 🇩🇪</p>

                    {/* Step tracker */}
                    <div className="flex items-center justify-between mb-3 px-2">
                        {[
                            { label: "Üniversite", sub: "Kabul Alındı", status: "done" },
                            { label: "Dil Yeterliliği", sub: "B1 Sertifika", status: "done" },
                            { label: "Belgeler", sub: "Kontrol Ediliyor", status: "active" },
                            { label: "Randevu", sub: "Bekliyor", status: "pending" },
                        ].map((step, i) => (
                            <div key={i} className="flex flex-col items-center text-center relative">
                                {/* Connector line */}
                                {i > 0 && (
                                    <div
                                        className="absolute top-3 right-full w-full h-0.5"
                                        style={{
                                            background: step.status === "pending"
                                                ? "rgba(255,255,255,0.06)"
                                                : step.status === "active"
                                                    ? "linear-gradient(90deg, #30D158, #0A84FF)"
                                                    : "#30D158",
                                        }}
                                    />
                                )}
                                {/* Dot */}
                                <div
                                    className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold mb-2 relative z-10"
                                    style={{
                                        background: step.status === "done"
                                            ? "#30D158"
                                            : step.status === "active"
                                                ? "#0A84FF"
                                                : "rgba(255,255,255,0.08)",
                                        color: step.status === "pending" ? "rgba(255,255,255,0.3)" : "white",
                                    }}
                                >
                                    {step.status === "done" ? "✓" : step.status === "active" ? "•" : i + 1}
                                </div>
                                <p className="text-[10px] font-medium text-white/70">{step.label}</p>
                                <p className="text-[9px] text-white/30" style={step.status === "active" ? { color: "#0A84FF" } : {}}>
                                    {step.sub}
                                </p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* ═══════ ROW 3: AI Önerileri ═══════ */}
            <motion.div
                {...fadeInUp}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="rounded-2xl p-6"
                style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.06)",
                }}
            >
                <h3 className="font-semibold text-white flex items-center gap-2 text-sm mb-5">
                    <Lightbulb className="w-4 h-4 text-[#FFD60A]" />
                    AI Önerileri
                </h3>

                <div className="grid sm:grid-cols-2 gap-3">
                    {[
                        {
                            icon: Mic,
                            color: "#FF453A",
                            title: "IELTS Speaking İpucu",
                            desc: "Geçmiş zaman kullanırken \"used to\" kalıbını daha sık kullanarak akıcılığını artırabilirsin."
                        },
                        {
                            icon: FileText,
                            color: "#5E5CE6",
                            title: "Eksik Belge Uyarısı",
                            desc: "Vize başvurusu için biyometrik fotoğrafını sisteme yüklemeyi unutma."
                        },
                        {
                            icon: BookMarked,
                            color: "#0A84FF",
                            title: "Kelime Tekrarı",
                            desc: "Geçen hafta öğrendiğin \"Wirtschaft\" (Ekonomi) konusundaki 10 kelimeyi tekrar etme zamanı."
                        },
                        {
                            icon: AudioLines,
                            color: "#30D158",
                            title: "Telaffuz Analizi",
                            desc: "\"ch\" sesini çıkarırken zorlanıyorsun. İşte senin için hazırladığım 2 dakikalık egzersiz."
                        },
                    ].map((rec, i) => {
                        const Icon = rec.icon;
                        return (
                            <div
                                key={i}
                                className="flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-all duration-200 hover:scale-[1.01]"
                                style={{
                                    background: "rgba(255,255,255,0.02)",
                                    border: "1px solid rgba(255,255,255,0.04)",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                                    e.currentTarget.style.borderColor = `${rec.color}30`;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.04)";
                                }}
                            >
                                <div
                                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                                    style={{ background: `${rec.color}12`, border: `1px solid ${rec.color}20` }}
                                >
                                    <Icon className="w-4 h-4" style={{ color: rec.color }} />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-white mb-0.5">{rec.title}</p>
                                    <p className="text-[11px] text-white/35 leading-relaxed line-clamp-2">{rec.desc}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </motion.div>
        </div>
    );
}

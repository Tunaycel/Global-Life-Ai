"use client";

import { motion } from "framer-motion";
import EmptyState from "@/components/ui/EmptyState";
import { useLocale } from "@/components/providers/LocaleProvider";
import { BarChart3, TrendingUp, Clock, BookOpen, Flame, Target, Calendar } from "lucide-react";

const weeklyData = [
    { day: "Pzt", minutes: 45, lessons: 2 },
    { day: "Sal", minutes: 30, lessons: 1 },
    { day: "Çar", minutes: 60, lessons: 3 },
    { day: "Per", minutes: 20, lessons: 1 },
    { day: "Cum", minutes: 50, lessons: 2 },
    { day: "Cmt", minutes: 75, lessons: 4 },
    { day: "Paz", minutes: 40, lessons: 2 },
];

const skills = [
    { name: "Speaking", score: 72, color: "#0A84FF" },
    { name: "Listening", score: 65, color: "#5E5CE6" },
    { name: "Reading", score: 80, color: "#30D158" },
    { name: "Writing", score: 55, color: "#FF9F0A" },
    { name: "Grammar", score: 70, color: "#BF5AF2" },
    { name: "Vocabulary", score: 60, color: "#FF453A" },
];

const recentLessons = [
    { title: "Serbest Konuşma: Hobbiler", duration: "25 dk", score: 82, date: "Bugün" },
    { title: "IELTS Speaking Part 1", duration: "18 dk", score: 75, date: "Dün" },
    { title: "Gramer: Past Tense", duration: "30 dk", score: 90, date: "2 gün önce" },
    { title: "Telaffuz: Th Sesleri", duration: "15 dk", score: 65, date: "3 gün önce" },
    { title: "İş İngilizcesi: Sunum", duration: "22 dk", score: 78, date: "4 gün önce" },
];

const maxMinutes = Math.max(...weeklyData.map((d) => d.minutes));

export default function ProgressPage() {
    const { t } = useLocale();

    return (
        <div className="max-w-[1100px] mx-auto space-y-6">
            <div>
                <h1 className="text-h2 text-[var(--text-primary)] mb-2">İlerleme Takibi</h1>
                <p className="text-body text-[var(--text-secondary)]">İngilizce öğrenme yolculuğun</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { icon: Clock, label: "Toplam Süre", value: "48 saat", color: "#0A84FF" },
                    { icon: BookOpen, label: "Tamamlanan Ders", value: "127", color: "#5E5CE6" },
                    { icon: Flame, label: "En Uzun Streak", value: "12 Gün", color: "#FF9F0A" },
                    { icon: Target, label: "Kelime Haznesi", value: "1,240", color: "#30D158" },
                ].map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)] p-5"
                    >
                        <stat.icon className="w-5 h-5 mb-3" style={{ color: stat.color }} />
                        <p className="text-h3 text-[var(--text-primary)]">{stat.value}</p>
                        <p className="text-caption text-[var(--text-secondary)]">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Weekly Activity Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)] p-6"
                >
                    <h3 className="font-semibold text-[var(--text-primary)] flex items-center gap-2 mb-6">
                        <Calendar className="w-5 h-5 text-[#0A84FF]" /> Haftalık Aktivite
                    </h3>
                    <div className="flex items-end gap-3 h-[160px]">
                        {weeklyData.map((d, i) => (
                            <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                                <motion.div
                                    className="w-full rounded-lg bg-gradient-to-t from-[#0A84FF] to-[#5E5CE6]"
                                    initial={{ height: 0 }}
                                    animate={{ height: `${(d.minutes / maxMinutes) * 100}%` }}
                                    transition={{ delay: 0.3 + i * 0.05, duration: 0.5 }}
                                />
                                <span className="text-[10px] text-[var(--text-tertiary)] font-medium">{d.day}</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center justify-between mt-4 text-xs text-[var(--text-tertiary)]">
                        <span>Bu hafta: 320 dk</span>
                        <span className="text-[#30D158]">↑ %15 geçen hafta</span>
                    </div>
                </motion.div>

                {/* Skills Radar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)] p-6"
                >
                    <h3 className="font-semibold text-[var(--text-primary)] flex items-center gap-2 mb-6">
                        <BarChart3 className="w-5 h-5 text-[#5E5CE6]" /> Beceri Seviyeleri
                    </h3>
                    <div className="space-y-4">
                        {skills.map((skill, i) => (
                            <div key={skill.name}>
                                <div className="flex items-center justify-between text-sm mb-1.5">
                                    <span className="text-[var(--text-secondary)]">{skill.name}</span>
                                    <span className="font-semibold text-[var(--text-primary)]">{skill.score}%</span>
                                </div>
                                <div className="h-2 rounded-full bg-[var(--surface)]">
                                    <motion.div
                                        className="h-full rounded-full"
                                        style={{ background: skill.color }}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${skill.score}%` }}
                                        transition={{ delay: 0.3 + i * 0.08, duration: 0.6 }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Recent Lessons */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)] p-6"
            >
                <h3 className="font-semibold text-[var(--text-primary)] flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-[#30D158]" /> Son Dersler
                </h3>
                <div className="space-y-3">
                    {recentLessons.length === 0 && (
                        <EmptyState
                            icon={BookOpen}
                            title={t("states", "lessonsTitle") as string}
                            description={t("states", "lessonsDescription") as string}
                            action={{ label: t("states", "lessonsAction") as string, href: "/dashboard/language/lesson" }}
                        />
                    )}
                    {recentLessons.map((lesson, i) => (
                        <div
                            key={i}
                            className="flex items-center justify-between p-3 rounded-xl bg-[var(--surface)] hover:bg-[var(--surface-hover)] transition-colors"
                        >
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="w-10 h-10 rounded-xl bg-[#0A84FF]/10 flex items-center justify-center shrink-0">
                                    <BookOpen className="w-5 h-5 text-[#0A84FF]" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-[var(--text-primary)] truncate">{lesson.title}</p>
                                    <p className="text-xs text-[var(--text-tertiary)]">{lesson.date} • {lesson.duration}</p>
                                </div>
                            </div>
                            <div className="shrink-0 ml-3">
                                <span
                                    className={`text-sm font-bold ${lesson.score >= 80 ? "text-[#30D158]" : lesson.score >= 60 ? "text-[#FF9F0A]" : "text-[#FF453A]"
                                        }`}
                                >
                                    {lesson.score}%
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}

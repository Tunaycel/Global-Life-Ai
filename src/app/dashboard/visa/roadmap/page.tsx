"use client";

import { motion } from "framer-motion";
import { CheckCircle, Circle, ArrowRight, Map as MapIcon } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";
import { useLocale } from "@/components/providers/LocaleProvider";

type Step = { text: string; done: boolean; current?: boolean };
type Phase = { title: string; status: string; steps: Step[] };

const phases: Phase[] = [
    {
        title: "Hazırlık",
        status: "completed",
        steps: [
            { text: "Hedef belirleme", done: true },
            { text: "Ülke araştırması", done: true },
            { text: "Bütçe planı", done: true },
        ],
    },
    {
        title: "Dil Yeterliliği",
        status: "active",
        steps: [
            { text: "IELTS Academic sınav kaydı", done: true },
            { text: "IELTS hazırlık (B1→B2)", done: false, current: true },
            { text: "Sınava gir & sonuç al", done: false },
        ],
    },
    {
        title: "Üniversite Başvurusu",
        status: "pending",
        steps: [
            { text: "Programları karşılaştır", done: false },
            { text: "uni-assist başvurusu", done: false },
            { text: "Kabul mektubu al", done: false },
        ],
    },
    {
        title: "Mali Hazırlık",
        status: "pending",
        steps: [
            { text: "Bloke hesap aç (Expatrio)", done: false },
            { text: "11.208€ yatır", done: false },
            { text: "Sağlık sigortası yap", done: false },
        ],
    },
    {
        title: "Vize Başvurusu",
        status: "pending",
        steps: [
            { text: "Belgeleri hazırla", done: false },
            { text: "Konsolosluk randevusu al", done: false },
            { text: "Başvuru yap", done: false },
            { text: "Vize onayla", done: false },
        ],
    },
    {
        title: "Yolculuk",
        status: "pending",
        steps: [
            { text: "Uçak bileti al", done: false },
            { text: "Konaklama ayarla", done: false },
            { text: "Belediye kaydı (Anmeldung)", done: false },
            { text: "Banka hesabı aç", done: false },
        ],
    },
];

const statusColors: Record<string, string> = {
    completed: "#30D158",
    active: "#0A84FF",
    pending: "#86868B",
};

export default function RoadmapPage() {
    const { t } = useLocale();

    return (
        <div className="max-w-[800px] mx-auto space-y-6">
            <div>
                <h1 className="text-h2 text-[var(--text-primary)] mb-2">Kişisel Yol Haritam</h1>
                <p className="text-body text-[var(--text-secondary)]">🇩🇪 Almanya — TU München — Öğrenci Vizesi</p>
            </div>

            {/* Progress Overview */}
            <div className="flex items-center gap-4 p-5 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)]">
                <div className="relative w-16 h-16 shrink-0">
                    <svg className="w-16 h-16 -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="42" fill="none" stroke="var(--border)" strokeWidth="8" />
                        <motion.circle
                            cx="50" cy="50" r="42" fill="none" stroke="#0A84FF" strokeWidth="8" strokeLinecap="round"
                            strokeDasharray={264}
                            initial={{ strokeDashoffset: 264 }}
                            animate={{ strokeDashoffset: 264 * 0.75 }}
                            transition={{ duration: 1 }}
                        />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-[var(--text-primary)]">25%</span>
                </div>
                <div>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">Faz 2/6 — Dil Yeterliliği</p>
                    <p className="text-xs text-[var(--text-secondary)]">Tahmini tamamlanma: 4-6 ay</p>
                </div>
            </div>

            {/* Timeline */}
            <div className="space-y-0">
                {phases.length === 0 && (
                    <EmptyState
                        icon={MapIcon}
                        title={t("states", "roadmapTitle") as string}
                        description={t("states", "roadmapDescription") as string}
                        action={{ label: t("states", "roadmapAction") as string, href: "/dashboard/visa/countries" }}
                    />
                )}
                {phases.map((phase, pi) => (
                    <motion.div
                        key={phase.title}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: pi * 0.1 }}
                        className="relative"
                    >
                        {/* Vertical line */}
                        {pi < phases.length - 1 && (
                            <div
                                className="absolute left-5 top-12 bottom-0 w-0.5"
                                style={{ background: statusColors[phase.status] + "30" }}
                            />
                        )}

                        <div className="flex gap-4 pb-6">
                            {/* Dot */}
                            <div
                                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white text-sm font-bold z-10"
                                style={{ background: statusColors[phase.status] }}
                            >
                                {phase.status === "completed" ? "✓" : pi + 1}
                            </div>

                            {/* Content */}
                            <div className="flex-1 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)] p-5">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-semibold text-[var(--text-primary)]">{phase.title}</h3>
                                    <span
                                        className="text-xs font-semibold px-2.5 py-1 rounded-full"
                                        style={{ background: statusColors[phase.status] + "15", color: statusColors[phase.status] }}
                                    >
                                        {phase.status === "completed" ? "Tamamlandı" : phase.status === "active" ? "Devam Ediyor" : "Beklemede"}
                                    </span>
                                </div>
                                <div className="space-y-2">
                                    {phase.steps.map((step, si) => (
                                        <div key={si} className="flex items-center gap-3">
                                            {step.done ? (
                                                <CheckCircle className="w-4 h-4 text-[#30D158] shrink-0" />
                                            ) : (
                                                <Circle className={`w-4 h-4 shrink-0 ${step.current ? "text-[#0A84FF]" : "text-[var(--text-tertiary)]"}`} />
                                            )}
                                            <span className={`text-sm ${step.done ? "text-[var(--text-secondary)] line-through" : step.current ? "text-[var(--color-primary)] font-medium" : "text-[var(--text-primary)]"}`}>
                                                {step.text}
                                            </span>
                                            {step.current && (
                                                <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-[#0A84FF]/10 text-[#0A84FF] font-semibold">
                                                    Şu an
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

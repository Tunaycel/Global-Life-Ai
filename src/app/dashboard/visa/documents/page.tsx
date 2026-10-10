"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import EmptyState from "@/components/ui/EmptyState";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Upload, FileText, Image, CheckCircle, AlertCircle, Clock, Eye, Trash2, Plus } from "lucide-react";

const documents = [
    { name: "Pasaport.pdf", status: "approved", date: "5 Şubat 2026", size: "2.3 MB", icon: "📕" },
    { name: "Banka_Dökümü.pdf", status: "approved", date: "3 Şubat 2026", size: "1.1 MB", icon: "📄" },
    { name: "Transkript.pdf", status: "reviewing", date: "10 Şubat 2026", size: "3.4 MB", icon: "📋" },
    { name: "Motivasyon_Mektubu.docx", status: "issue", date: "11 Şubat 2026", size: "0.5 MB", icon: "📝" },
    { name: "Sağlık_Sigortası.pdf", status: "pending", date: "—", size: "—", icon: "🏥" },
    { name: "Kabul_Mektubu.pdf", status: "pending", date: "—", size: "—", icon: "🎓" },
];

const statusConfig: Record<string, { label: string; color: string; icon: typeof CheckCircle }> = {
    approved: { label: "Onaylandı", color: "#30D158", icon: CheckCircle },
    reviewing: { label: "İnceleniyor", color: "#0A84FF", icon: Clock },
    issue: { label: "Sorun Var", color: "#FF453A", icon: AlertCircle },
    pending: { label: "Yüklenmedi", color: "#86868B", icon: Upload },
};

export default function DocumentsPage() {
    const { t } = useLocale();

    return (
        <div className="max-w-[900px] mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-h2 text-[var(--text-primary)] mb-1">Belge Merkezi</h1>
                    <p className="text-body text-[var(--text-secondary)]">Almanya Öğrenci Vizesi için gerekli belgeler</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-[var(--text-primary)]">2/6</span>
                    <span className="text-caption text-[var(--text-secondary)]">onaylandı</span>
                </div>
            </div>

            {/* Progress */}
            <div className="h-2 rounded-full bg-[var(--surface)]">
                <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-[#30D158] to-[#0A84FF]"
                    initial={{ width: 0 }}
                    animate={{ width: "33%" }}
                    transition={{ duration: 1, delay: 0.3 }}
                />
            </div>

            {/* Upload Zone */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                id="upload"
                className="border-2 border-dashed border-[var(--border)] rounded-2xl p-8 text-center hover:border-[var(--color-primary)]/50 transition-colors cursor-pointer"
            >
                <Upload className="w-10 h-10 text-[var(--text-tertiary)] mx-auto mb-3" />
                <p className="text-sm font-medium text-[var(--text-primary)] mb-1">Belge yüklemek için tıkla veya sürükle</p>
                <p className="text-xs text-[var(--text-tertiary)]">PDF, DOCX, JPG, PNG — Max 10MB</p>
            </motion.div>

            {/* Document List */}
            <div className="space-y-3">
                {documents.length === 0 && (
                    <EmptyState
                        icon={FileText}
                        title={t("states", "documentsTitle") as string}
                        description={t("states", "documentsDescription") as string}
                        action={{ label: t("states", "documentsAction") as string, href: "#upload" }}
                    />
                )}
                {documents.map((doc, i) => {
                    const status = statusConfig[doc.status];
                    const StatusIcon = status.icon;
                    return (
                        <motion.div
                            key={doc.name}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.06 }}
                            className="flex items-center gap-4 p-4 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)] hover:shadow-sm transition-all"
                        >
                            <span className="text-2xl shrink-0">{doc.icon}</span>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{doc.name}</p>
                                <p className="text-xs text-[var(--text-tertiary)]">{doc.date} • {doc.size}</p>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                                <span
                                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                                    style={{ background: `${status.color}15`, color: status.color }}
                                >
                                    <StatusIcon className="w-3 h-3" /> {status.label}
                                </span>
                                {doc.status !== "pending" && (
                                    <button className="p-1.5 rounded-lg hover:bg-[var(--surface)] transition-colors">
                                        <Eye className="w-4 h-4 text-[var(--text-tertiary)]" />
                                    </button>
                                )}
                                {doc.status === "pending" && (
                                    <button className="btn-primary !py-1.5 !px-3 !text-xs">
                                        <Plus className="w-3 h-3" /> Yükle
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* AI Analysis */}
            <div className="rounded-2xl bg-gradient-to-r from-[#5E5CE6]/10 to-[#BF5AF2]/10 border border-[#5E5CE6]/20 p-6">
                <h3 className="font-semibold text-[var(--text-primary)] mb-2 flex items-center gap-2">
                    ✨ AI Belge Analizi
                </h3>
                <p className="text-sm text-[var(--text-secondary)] mb-4">
                    Yüklenen belgelerinizi AI ile analiz edin. Eksik bilgi, format hatası ve süre kontrolü otomatik yapılır.
                </p>
                <button className="btn-primary !py-2.5 !text-sm shimmer">Tüm Belgeleri Analiz Et</button>
            </div>
        </div>
    );
}

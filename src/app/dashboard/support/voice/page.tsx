"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Video, MicOff, VideoOff, PhoneOff, MessageCircle, Volume2, Settings } from "lucide-react";

// Picked once when the module loads, so the bars keep their height across renders.
const waveHeights = Array.from({ length: 30 }, () => Math.random() * 30 + 6);

export default function VoiceSupportPage() {
    const [callActive, setCallActive] = useState(false);
    const [muted, setMuted] = useState(false);
    const [videoOff, setVideoOff] = useState(false);

    return (
        <div className="max-w-[700px] mx-auto space-y-6">
            <div>
                <h1 className="text-h2 text-[var(--text-primary)] mb-2">Canlı Destek</h1>
                <p className="text-body text-[var(--text-secondary)]">AI danışmanınızla sesli veya görüntülü görüşme başlatın</p>
            </div>

            {!callActive ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                >
                    {/* Call Options */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                            onClick={() => setCallActive(true)}
                            className="flex flex-col items-center gap-4 p-8 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)] hover:-translate-y-1 hover:shadow-lg hover:border-[var(--color-primary)]/30 transition-all"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-[#0A84FF]/10 flex items-center justify-center">
                                <Phone className="w-8 h-8 text-[#0A84FF]" />
                            </div>
                            <div className="text-center">
                                <h3 className="font-semibold text-[var(--text-primary)]">Sesli Arama</h3>
                                <p className="text-caption text-[var(--text-secondary)] mt-1">AI danışmanla sesli görüşme</p>
                            </div>
                        </button>

                        <button
                            onClick={() => setCallActive(true)}
                            className="flex flex-col items-center gap-4 p-8 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)] hover:-translate-y-1 hover:shadow-lg hover:border-[var(--color-primary)]/30 transition-all"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-[#5E5CE6]/10 flex items-center justify-center">
                                <Video className="w-8 h-8 text-[#5E5CE6]" />
                            </div>
                            <div className="text-center">
                                <h3 className="font-semibold text-[var(--text-primary)]">Görüntülü Arama</h3>
                                <p className="text-caption text-[var(--text-secondary)] mt-1">AI avatar ile yüz yüze</p>
                            </div>
                        </button>
                    </div>

                    {/* Info */}
                    <div className="rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)] p-6 space-y-4">
                        <h3 className="font-semibold text-[var(--text-primary)]">📋 Arama Özellikleri</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                "Gerçek zamanlı çeviri",
                                "Otomatik transkript",
                                "Ekran paylaşımı",
                                "Belge inceleme",
                                "Kayıt alma",
                                "Çoklu dil desteği",
                            ].map((feat) => (
                                <div key={feat} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                                    <span className="text-[#30D158]">✓</span> {feat}
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="rounded-2xl overflow-hidden"
                >
                    {/* Call Screen */}
                    <div
                        className="relative flex flex-col items-center justify-center p-12 min-h-[500px]"
                        style={{ background: "linear-gradient(135deg, #0a0a1a, #1a1a2e)" }}
                    >
                        {/* AI Avatar */}
                        <motion.div
                            animate={{
                                boxShadow: [
                                    "0 0 40px rgba(10,132,255,0.2)",
                                    "0 0 60px rgba(10,132,255,0.4)",
                                    "0 0 40px rgba(10,132,255,0.2)",
                                ],
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-32 h-32 rounded-full bg-gradient-to-br from-[#0A84FF] to-[#5E5CE6] flex items-center justify-center text-6xl"
                        >
                            🤖
                        </motion.div>
                        <h3 className="text-white font-semibold text-lg mt-6">AI Danışman</h3>
                        <p className="text-white/40 text-sm mt-1">Bağlandı • 02:34</p>

                        {/* Waveform */}
                        <div className="flex items-center gap-[3px] h-10 mt-6">
                            {Array.from({ length: 30 }).map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="w-1 rounded-full bg-[#0A84FF]"
                                    animate={{
                                        height: [6, waveHeights[i], 6],
                                    }}
                                    transition={{
                                        duration: 0.6,
                                        repeat: Infinity,
                                        delay: i * 0.03,
                                    }}
                                />
                            ))}
                        </div>

                        {/* Live Transcription */}
                        <div className="mt-8 max-w-[400px] text-center">
                            <p className="text-white/60 text-sm leading-relaxed">
                                &ldquo;Almanya için öğrenci vizesi başvurunuzda bloke hesap açmanız gerekiyor. Expatrio ile online olarak 1-2 iş gününde tamamlayabilirsiniz...&rdquo;
                            </p>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-4 mt-12">
                            <button
                                onClick={() => setMuted(!muted)}
                                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${muted ? "bg-white/20" : "bg-white/10"}`}
                            >
                                {muted ? <MicOff className="w-6 h-6 text-white" /> : <Volume2 className="w-6 h-6 text-white" />}
                            </button>
                            <button
                                onClick={() => setVideoOff(!videoOff)}
                                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${videoOff ? "bg-white/20" : "bg-white/10"}`}
                            >
                                {videoOff ? <VideoOff className="w-6 h-6 text-white" /> : <Video className="w-6 h-6 text-white" />}
                            </button>
                            <button className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center">
                                <MessageCircle className="w-6 h-6 text-white" />
                            </button>
                            <button
                                onClick={() => setCallActive(false)}
                                className="w-14 h-14 rounded-full bg-[#FF453A] flex items-center justify-center hover:brightness-110 transition-all"
                            >
                                <PhoneOff className="w-6 h-6 text-white" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}

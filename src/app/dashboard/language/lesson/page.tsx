"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mic, MicOff, Keyboard, Lightbulb, RotateCcw, BarChart3, SkipForward, LogOut, Volume2, Clock } from "lucide-react";
import Link from "next/link";

const avatars = [
    { name: "Sarah", accent: "Amerikan İngilizcesi", active: true },
    { name: "James", accent: "İngiliz İngilizcesi", active: false },
    { name: "Elena", accent: "İspanyolca", active: false },
    { name: "Hans", accent: "Almanca", active: false },
];

// Picked once when the module loads, so the bars keep their height across renders.
const waveHeights = Array.from({ length: 40 }, () => Math.random() * 24 + 4);

export default function LessonPage() {
    const [isRecording, setIsRecording] = useState(false);
    const [messages, setMessages] = useState([
        { role: "ai", text: "Hello! Today we're going to practice talking about your hobbies. Tell me, what do you enjoy doing in your free time? Try to speak for at least 30 seconds." },
        { role: "user", text: "I really enjoy playing football with my friends on weekends. We usually go to the park near my house..." },
        { role: "ai", text: "Great start! Your sentence structure is good. Let me give you a small correction: instead of 'playing football', in American English we often say 'playing soccer'. Now, can you tell me more about why you enjoy it?" },
    ]);

    return (
        <div className="max-w-[900px] mx-auto h-[calc(100vh-8rem)] flex flex-col">
            {/* Top Bar */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <Link href="/dashboard/language" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                        ← Geri
                    </Link>
                    <span className="text-[var(--border)]">|</span>
                    <span className="text-sm font-medium text-[var(--text-primary)]">Serbest Konuşma</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#30D158]/10 text-[#30D158] text-xs font-semibold">B1</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                    <Clock className="w-4 h-4" />
                    <span>12:34</span>
                </div>
            </div>

            {/* AI Avatar Area */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl bg-gradient-to-b from-[#0a0a1a] to-[#1a1a2e] border border-[rgba(255,255,255,0.08)] p-6 mb-4"
            >
                <div className="flex flex-col items-center">
                    {/* Avatar */}
                    <div className="relative mb-4">
                        <div className={`w-24 h-24 rounded-full bg-gradient-to-br from-[#0A84FF] to-[#5E5CE6] flex items-center justify-center text-3xl font-semibold text-white ${!isRecording ? "pulse-glow" : ""}`}>
                            S
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#30D158] border-2 border-[#0a0a1a] flex items-center justify-center">
                            <Volume2 className="w-3 h-3 text-white" />
                        </div>
                    </div>
                    <h3 className="text-white font-semibold">Sarah — AI Teacher</h3>
                    <p className="text-xs text-[rgba(255,255,255,0.4)]">Amerikan İngilizcesi • Serbest Konuşma</p>
                </div>
            </motion.div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-1">
                {messages.map((msg, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: msg.role === "ai" ? -20 : 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                        <div
                            className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === "ai"
                                    ? "bg-[var(--surface)] text-[var(--text-primary)] rounded-tl-sm"
                                    : "bg-[var(--color-primary)] text-white rounded-tr-sm"
                                }`}
                        >
                            {msg.text}
                        </div>
                    </motion.div>
                ))}

                {/* Typing Indicator */}
                <div className="flex justify-start">
                    <div className="bg-[var(--surface)] rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1.5">
                        <span className="typing-dot" />
                        <span className="typing-dot" />
                        <span className="typing-dot" />
                    </div>
                </div>
            </div>

            {/* Real-time Transcription */}
            {isRecording && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl bg-[var(--surface)] border border-[var(--border)] p-4 mb-4"
                >
                    <p className="text-xs text-[var(--text-tertiary)] mb-2">Gerçek zamanlı transkripsiyon:</p>
                    <p className="text-sm text-[var(--text-primary)]">
                        I think football is a great way to <span className="underline decoration-wavy decoration-[#FF453A]">exercize</span>...
                    </p>
                    {/* Waveform */}
                    <div className="flex items-center gap-[2px] h-8 mt-3">
                        {Array.from({ length: 40 }).map((_, i) => (
                            <motion.div
                                key={i}
                                className="w-1 rounded-full bg-[var(--color-primary)]"
                                animate={{
                                    height: [4, waveHeights[i], 4],
                                }}
                                transition={{
                                    duration: 0.5,
                                    repeat: Infinity,
                                    delay: i * 0.02,
                                }}
                            />
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Controls */}
            <div className="space-y-3">
                {/* Mic Button */}
                <div className="flex justify-center">
                    <button
                        onClick={() => setIsRecording(!isRecording)}
                        className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${isRecording
                                ? "bg-[#FF453A] shadow-[0_0_30px_rgba(255,69,58,0.4)] scale-110"
                                : "bg-[var(--color-primary)] shadow-[0_0_30px_rgba(10,132,255,0.3)] hover:scale-105"
                            }`}
                    >
                        {isRecording ? (
                            <MicOff className="w-6 h-6 text-white" />
                        ) : (
                            <Mic className="w-6 h-6 text-white" />
                        )}
                    </button>
                </div>
                <p className="text-center text-xs text-[var(--text-tertiary)]">
                    {isRecording ? "Dinliyorum... Konuşmayı bitirmek için tıkla" : "Konuşmak için mikrofona bas"}
                </p>

                {/* Action Buttons */}
                <div className="flex items-center justify-center gap-3 flex-wrap">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-sm text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] transition-colors">
                        <Keyboard className="w-4 h-4" /> Yazarak Cevapla
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-sm text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] transition-colors">
                        <Lightbulb className="w-4 h-4" /> İpucu
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-sm text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] transition-colors">
                        <RotateCcw className="w-4 h-4" /> Tekrar Et
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-sm text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] transition-colors">
                        <BarChart3 className="w-4 h-4" /> Skor
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-sm text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] transition-colors">
                        <SkipForward className="w-4 h-4" /> Sonraki
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FF453A]/10 border border-[#FF453A]/20 text-sm text-[#FF453A] hover:bg-[#FF453A]/20 transition-colors">
                        <LogOut className="w-4 h-4" /> Dersi Bitir
                    </button>
                </div>
            </div>
        </div>
    );
}

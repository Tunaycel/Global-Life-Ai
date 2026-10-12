"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Sparkles, BookOpen, Plane, BarChart3, HelpCircle, RefreshCw } from "lucide-react";

const suggestions = [
    { icon: BookOpen, text: "IELTS'te nasıl 7+ alabilirim?", color: "#0A84FF" },
    { icon: Plane, text: "Almanya vize süreci nedir?", color: "#5E5CE6" },
    { icon: BarChart3, text: "Haftalık ilerleme raporumu göster", color: "#30D158" },
    { icon: HelpCircle, text: "Schengen vizesi için hangi belgeler lazım?", color: "#FF9F0A" },
];

const welcomeMessages = [
    { role: "ai", text: "Merhaba! Ben GlobalLife AI asistanınızım. Size dil öğrenme, vize süreçleri, belgeler ve platform kullanımı hakkında yardımcı olabilirim.\n\nHerhangi bir sorunuz var mı?" },
];

export default function AssistantPage() {
    const [messages, setMessages] = useState(welcomeMessages);
    const [input, setInput] = useState("");
    const endRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const send = (text: string) => {
        if (!text.trim()) return;
        setMessages((prev) => [...prev, { role: "user", text }]);
        setInput("");
        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                { role: "ai", text: "Bu harika bir soru! Analizimi yapıyorum...\n\nSorunuzla ilgili kapsamlı bir cevap hazırlıyorum. Lütfen birkaç saniye bekleyin." },
            ]);
        }, 1000);
    };

    return (
        <div className="max-w-[800px] mx-auto h-[calc(100vh-8rem)] flex flex-col">
            <div className="mb-4">
                <h1 className="text-h2 text-[var(--text-primary)]">AI Asistan</h1>
                <p className="text-caption text-[var(--text-secondary)]">Dil öğrenme ve vize süreçleri hakkında her şeyi sor</p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                {messages.map((msg, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                        {msg.role === "ai" && (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0A84FF] to-[#5E5CE6] flex items-center justify-center mr-3 shrink-0 mt-1">
                                <Sparkles className="w-4 h-4 text-white" />
                            </div>
                        )}
                        <div
                            className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${msg.role === "ai"
                                    ? "bg-[var(--surface)] text-[var(--text-primary)] rounded-tl-sm"
                                    : "bg-[var(--color-primary)] text-white rounded-tr-sm"
                                }`}
                        >
                            {msg.text}
                        </div>
                    </motion.div>
                ))}
                <div ref={endRef} />

                {/* Suggestions */}
                {messages.length <= 1 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                        {suggestions.map((s) => (
                            <button
                                key={s.text}
                                onClick={() => send(s.text)}
                                className="flex items-center gap-3 p-4 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-left hover:-translate-y-0.5 hover:shadow-md transition-all"
                            >
                                <s.icon className="w-5 h-5 shrink-0" style={{ color: s.color }} />
                                <span className="text-sm text-[var(--text-primary)]">{s.text}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Input */}
            <form
                onSubmit={(e) => { e.preventDefault(); send(input); }}
                className="mt-4 flex gap-2"
            >
                <div className="flex-1 bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-3 focus-within:border-[var(--color-primary)] transition-all">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Bir şey sorun..."
                        className="w-full bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] outline-none"
                    />
                </div>
                <button type="submit" className="p-3 rounded-xl bg-[var(--color-primary)] text-white hover:brightness-110 transition-all shrink-0">
                    <Send className="w-5 h-5" />
                </button>
            </form>
        </div>
    );
}

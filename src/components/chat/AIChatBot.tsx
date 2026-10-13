"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Sparkles } from "lucide-react";

interface Message {
    role: "user" | "ai";
    text: string;
}

const quickQuestions = [
    "What languages do you support?",
    "How does visa consulting work?",
    "How does AI tutoring work?",
];

const aiResponses: Record<string, string> = {
    "what languages do you support?":
        "We currently support 10 languages: English, German, Polish, French, Spanish, Italian, Portuguese, Japanese, Korean, and Mandarin Chinese. Our AI tutors provide real-time conversation practice, pronunciation feedback, and adaptive lesson plans for each language.",
    "how does visa consulting work?":
        "The visa guide shows a roadmap and a document checklist for the country you want to move to.",
    "how does ai tutoring work?":
        "Our AI tutors use advanced language models to conduct real-time conversations at your proficiency level. They provide instant grammar corrections, pronunciation analysis, vocabulary building, and create personalized study plans that adapt as you improve.",
};

function getAIResponse(input: string): string {
    const lower = input.toLowerCase().trim();
    for (const [key, value] of Object.entries(aiResponses)) {
        if (lower.includes(key.split(" ")[0]) && lower.includes(key.split(" ").slice(-1)[0])) {
            return value;
        }
    }
    return "Thanks for your question! Our team would love to help. For detailed inquiries, you can reach us at support@globallife.ai. Is there anything specific about our language learning or visa consulting services I can help with?";
}

function replyDelay(): number {
    return 800 + Math.random() * 1200;
}

export default function AIChatBot() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: "ai", text: "Hi! I'm GlobalLife AI Assistant. Ask me anything about our language learning or visa consulting services!" },
    ]);
    const [input, setInput] = useState("");
    const [typing, setTyping] = useState(false);
    const endRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, typing]);

    const send = (text: string) => {
        if (!text.trim()) return;
        setMessages((prev) => [...prev, { role: "user", text }]);
        setInput("");
        setTyping(true);

        setTimeout(() => {
            setTyping(false);
            setMessages((prev) => [...prev, { role: "ai", text: getAIResponse(text) }]);
        }, replyDelay());
    };

    return (
        <>
            {/* Floating Button */}
            <motion.button
                onClick={() => setOpen(!open)}
                className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl"
                style={{
                    background: "linear-gradient(135deg, #00DC82, #00E5FF)",
                    boxShadow: "0 0 30px rgba(0,220,130,0.4), 0 8px 32px rgba(0,0,0,0.3)",
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1, type: "spring" }}
            >
                {open ? (
                    <X className="w-6 h-6 text-[#030308]" />
                ) : (
                    <MessageCircle className="w-6 h-6 text-[#030308]" />
                )}
            </motion.button>

            {/* Pulse ring */}
            {!open && (
                <div
                    className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full animate-ping pointer-events-none"
                    style={{ background: "rgba(0,220,130,0.2)" }}
                />
            )}

            {/* Chat Window */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        transition={{ type: "spring", damping: 25 }}
                        className="fixed bottom-24 right-6 z-50 w-[380px] max-h-[520px] rounded-2xl overflow-hidden flex flex-col"
                        style={{
                            background: "rgba(8,8,20,0.92)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            backdropFilter: "blur(24px)",
                            boxShadow: "0 25px 60px rgba(0,0,0,0.5), 0 0 40px rgba(0,220,130,0.08)",
                        }}
                    >
                        {/* Header */}
                        <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #00DC82, #00E5FF)" }}>
                                <Sparkles className="w-4 h-4 text-[#030308]" />
                            </div>
                            <div>
                                <p className="text-white font-semibold text-sm" style={{ fontFamily: "var(--font-display)" }}>GlobalLife AI</p>
                                <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.35)" }}>Always online • Instant answers</p>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-[200px] max-h-[320px]">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                    {msg.role === "ai" && (
                                        <div className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center mt-0.5" style={{ background: "rgba(0,220,130,0.1)" }}>
                                            <Bot className="w-3.5 h-3.5 text-[#00DC82]" />
                                        </div>
                                    )}
                                    <div
                                        className="max-w-[260px] px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed"
                                        style={
                                            msg.role === "user"
                                                ? { background: "linear-gradient(135deg, #00DC82, #00B4D8)", color: "#030308" }
                                                : { background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.75)", border: "1px solid rgba(255,255,255,0.05)" }
                                        }
                                    >
                                        {msg.text}
                                    </div>
                                    {msg.role === "user" && (
                                        <div className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center mt-0.5" style={{ background: "rgba(255,255,255,0.06)" }}>
                                            <User className="w-3.5 h-3.5 text-[rgba(255,255,255,0.4)]" />
                                        </div>
                                    )}
                                </div>
                            ))}
                            {typing && (
                                <div className="flex gap-2 items-start">
                                    <div className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center" style={{ background: "rgba(0,220,130,0.1)" }}>
                                        <Bot className="w-3.5 h-3.5 text-[#00DC82]" />
                                    </div>
                                    <div className="px-4 py-3 rounded-2xl" style={{ background: "rgba(255,255,255,0.05)" }}>
                                        <div className="flex gap-1">
                                            <span className="w-2 h-2 rounded-full bg-[rgba(255,255,255,0.3)] animate-bounce" style={{ animationDelay: "0ms" }} />
                                            <span className="w-2 h-2 rounded-full bg-[rgba(255,255,255,0.3)] animate-bounce" style={{ animationDelay: "150ms" }} />
                                            <span className="w-2 h-2 rounded-full bg-[rgba(255,255,255,0.3)] animate-bounce" style={{ animationDelay: "300ms" }} />
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={endRef} />
                        </div>

                        {/* Quick Questions */}
                        {messages.length <= 2 && (
                            <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                                {quickQuestions.map((q) => (
                                    <button
                                        key={q}
                                        onClick={() => send(q)}
                                        className="text-[11px] px-3 py-1.5 rounded-full transition-colors"
                                        style={{
                                            background: "rgba(255,255,255,0.04)",
                                            border: "1px solid rgba(255,255,255,0.08)",
                                            color: "rgba(255,255,255,0.5)",
                                        }}
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Input */}
                        <div className="px-4 py-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                            <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                                <input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && send(input)}
                                    placeholder="Ask anything..."
                                    className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-[rgba(255,255,255,0.2)]"
                                />
                                <button
                                    onClick={() => send(input)}
                                    disabled={!input.trim()}
                                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-20"
                                    style={{ background: input.trim() ? "linear-gradient(135deg, #00DC82, #00E5FF)" : "transparent" }}
                                >
                                    <Send className="w-3.5 h-3.5" style={{ color: input.trim() ? "#030308" : "rgba(255,255,255,0.3)" }} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

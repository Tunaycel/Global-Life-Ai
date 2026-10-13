"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Paperclip, Mic, Phone, Video, MoreVertical, Bot, Sparkles, FileText, MapIcon, Calculator, CalendarDays, ListChecks } from "lucide-react";

const initialMessages = [
    {
        role: "ai",
        text: "Merhaba! Ben GlobalLife AI vize danışmanınızım. Size nasıl yardımcı olabilirim?",
        time: "14:30",
    },
    {
        role: "ai",
        text: "Hangi ülke ve vize türü ile ilgilendiğinizi söylerseniz, size özel bir yol haritası oluşturabilirim. Ayrıca belgelerinizi analiz edebilir, eksikleri tespit edebilirim.",
        time: "14:30",
    },
    {
        role: "user",
        text: "Almanya için öğrenci vizesi almak istiyorum. Lisans eğitimi için TU München'e başvurmayı düşünüyorum.",
        time: "14:32",
    },
    {
        role: "ai",
        text: "Harika seçim! 🇩🇪 TU München, Almanya'nın en prestijli üniversitelerinden biri. Öğrenci vizesi için şu adımları izlemeniz gerekiyor:\n\n1. **Üniversite Kabul Mektubu** — Öncelikle uni-assist üzerinden başvuru yapmalısınız\n2. **Bloke Hesap (Sperrkonto)** — 11.208€ (aylık 934€ x 12 ay) \n3. **Sağlık Sigortası** — AOK veya TK öğrenci sigortası\n4. **Dil Yeterliliği** — TestDaF C1 veya IELTS Academic 6.5+\n5. **Pasaport** — En az 6 ay geçerli\n6. **Vize Randevusu** — Ankara veya İstanbul Alman Büyükelçiliği\n\nBunlardan hangisi hakkında detaylı bilgi almak istersiniz?",
        time: "14:33",
    },
    {
        role: "user",
        text: "Bloke hesap ne kadar sürüyor? Ve hangi bankayı öneriyorsunuz?",
        time: "14:35",
    },
    {
        role: "ai",
        text: "Bloke hesap açmak genelde **1-3 iş günü** sürer. En popüler seçenekler:\n\n**Expatrio** (En hızlı — Online, 1-2 gün)\n• Online başvuru, Türk kartı ile ödeme\n• Aylık ücret: 5€\n\n**Fintiba** (Güvenilir — Online, 2-3 gün)\n• Benzer süreç, biraz daha yavaş\n• Aylık ücret: 4.90€\n\n**Deutsche Bank** (Geleneksel — 1-2 hafta)\n• Şube gerekli, daha yavaş\n\n**Önerim:** Expatrio ile başlayın. Hızlı ve güvenilir.\n\nİsterseniz başvuru sürecinde adım adım rehberlik edebilirim!",
        time: "14:36",
    },
];

export default function VisaChatPage() {
    const [messages, setMessages] = useState(initialMessages);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        const userMsg = { role: "user" as const, text: input, time: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }) };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");

        // Simulate AI response
        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                {
                    role: "ai",
                    text: "Çok iyi bir soru! Bu konuda size detaylı bilgi vereyim. Öncelikle belirtmem gereken birkaç önemli nokta var...\n\nSorunuzla ilgili en güncel bilgileri araştırıyorum. Lütfen 1-2 saniye bekleyin.",
                    time: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
                },
            ]);
        }, 1500);
    };

    return (
        <div className="max-w-[900px] mx-auto h-[calc(100vh-8rem)] flex flex-col">
            {/* Chat Header */}
            <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)] mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#5E5CE6] to-[#BF5AF2] flex items-center justify-center">
                        <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-sm text-[var(--text-primary)]">AI Vize Danışmanı</h3>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#30D158]" />
                            <span className="text-xs text-[#30D158]">Online</span>
                            <span className="text-xs text-[var(--text-tertiary)] ml-2">🇩🇪 Almanya — Öğrenci Vizesi</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button className="p-2 rounded-lg hover:bg-[var(--surface)] transition-colors" title="Sesli Arama">
                        <Phone className="w-4 h-4 text-[var(--text-secondary)]" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-[var(--surface)] transition-colors" title="Görüntülü Arama">
                        <Video className="w-4 h-4 text-[var(--text-secondary)]" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-[var(--surface)] transition-colors">
                        <MoreVertical className="w-4 h-4 text-[var(--text-secondary)]" />
                    </button>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
                {[
                    { icon: FileText, text: "Belge Analizi" },
                    { icon: MapIcon, text: "Yol Haritası" },
                    { icon: Calculator, text: "Maliyet Hesapla" },
                    { icon: CalendarDays, text: "Randevu Bilgisi" },
                    { icon: ListChecks, text: "Checklist" },
                ].map((action) => (
                    <button
                        key={action.text}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--surface)] border border-[var(--border)] text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] transition-colors whitespace-nowrap shrink-0"
                    >
                        <action.icon className="w-3.5 h-3.5" aria-hidden="true" /> {action.text}
                    </button>
                ))}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {messages.map((msg, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: msg.role === "ai" ? -20 : 20, y: 10 }}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                        <div className={`max-w-[85%] ${msg.role === "ai" ? "" : ""}`}>
                            <div
                                className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${msg.role === "ai"
                                        ? "bg-[var(--surface)] text-[var(--text-primary)] rounded-tl-sm"
                                        : "bg-[var(--color-primary)] text-white rounded-tr-sm"
                                    }`}
                            >
                                {msg.text}
                            </div>
                            <p className={`text-[10px] text-[var(--text-tertiary)] mt-1 ${msg.role === "user" ? "text-right" : ""}`}>
                                {msg.time}
                            </p>
                        </div>
                    </motion.div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={sendMessage} className="mt-4 flex items-end gap-2">
                <button
                    type="button"
                    className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] transition-colors shrink-0"
                >
                    <Paperclip className="w-5 h-5" />
                </button>
                <div className="flex-1 bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-3 focus-within:border-[var(--color-primary)] focus-within:ring-2 focus-within:ring-[var(--color-primary)]/20 transition-all">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage(e))}
                        placeholder="Mesajınızı yazın..."
                        rows={1}
                        className="w-full bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] outline-none resize-none"
                    />
                </div>
                <button
                    type="button"
                    className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] transition-colors shrink-0"
                >
                    <Mic className="w-5 h-5" />
                </button>
                <button
                    type="submit"
                    className="p-3 rounded-xl bg-[var(--color-primary)] text-white hover:brightness-110 transition-all shrink-0"
                >
                    <Send className="w-5 h-5" />
                </button>
            </form>
        </div>
    );
}

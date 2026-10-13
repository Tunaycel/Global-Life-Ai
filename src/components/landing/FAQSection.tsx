"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
    {
        q: "How does AI language tutoring work?",
        a: "Our AI tutors hold real-time conversations at your level. They give pronunciation feedback, grammar corrections and lesson plans that change as you progress. Think of it as having a personal language teacher available 24/7.",
    },
    {
        q: "Can I really replace a human visa consultant?",
        a: "Our AI consultant helps with research, document preparation and process guidance for the country you choose. For complex legal matters, we recommend consulting a licensed attorney.",
    },
    {
        q: "What languages are supported?",
        a: "Currently we support English, German, Polish, French, Spanish, Italian, Portuguese, Japanese, Korean, and Mandarin Chinese. We're adding new languages every month based on user demand.",
    },
    {
        q: "Is my personal data secure?",
        a: "Sign-in is handled by Supabase Auth. Our privacy policy will explain what we store and how we use it.",
    },
    {
        q: "How accurate is the IELTS score prediction?",
        a: "The score is an estimate from our AI model, not an official IELTS result. Use it to follow your progress between practice sessions.",
    },
];

export default function FAQSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section
            ref={ref}
            id="faq"
            className="relative py-24 overflow-hidden"
            style={{ background: "transparent" }}
        >
            <div className="relative z-10 max-w-[700px] mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-14">
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : {}}
                        className="text-xs font-medium uppercase tracking-[0.2em] mb-4"
                        style={{ color: "rgba(255,255,255,0.3)" }}
                    >
                        FAQ
                    </motion.p>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        className="text-3xl md:text-4xl font-bold text-white tracking-tight"
                    >
                        Common Questions
                    </motion.h2>
                </div>

                {/* Accordion */}
                <div className="space-y-3">
                    {faqs.map((faq, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 15 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.05 + i * 0.05 }}
                            className="rounded-xl overflow-hidden transition-all"
                            style={{
                                background: openIndex === i ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.015)",
                                border: openIndex === i ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(255,255,255,0.04)",
                            }}
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                className="w-full flex items-center justify-between p-5 text-left"
                            >
                                <span className="font-medium text-white text-sm pr-4">{faq.q}</span>
                                <ChevronDown
                                    className={`w-4 h-4 text-[rgba(255,255,255,0.3)] shrink-0 transition-transform duration-300 ${openIndex === i ? "rotate-180" : ""
                                        }`}
                                />
                            </button>
                            <AnimatePresence>
                                {openIndex === i && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.25 }}
                                    >
                                        <p className="px-5 pb-5 text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
                                            {faq.a}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

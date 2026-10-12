"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";

const Globe3D = dynamic(() => import("@/components/3d/Globe3D"), {
    ssr: false,
    loading: () => (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#0A84FF]/20 to-[#5E5CE6]/20 animate-pulse" />
    ),
});

const footerLinks = {
    Product: [
        { label: "Features", href: "#features" },
        { label: "Language Learning", href: "#services" },
        { label: "Visa Consulting", href: "#services" },
    ],
    Company: [
        { label: "About", href: "#" },
        { label: "Careers", href: "#" },
        { label: "Blog", href: "#" },
        { label: "Press", href: "#" },
    ],
    Legal: [
        { label: "Privacy Policy", href: "#" },
        { label: "Terms of Service", href: "#" },
        { label: "Cookie Policy", href: "#" },
        { label: "GDPR", href: "#" },
    ],
    Support: [
        { label: "Help Center", href: "#" },
        { label: "Contact Us", href: "#" },
        { label: "Status", href: "#" },
        { label: "API Docs", href: "#" },
    ],
};

export default function Footer() {
    return (
        <footer style={{ background: "rgba(3,3,8,0.85)", borderTop: "1px solid rgba(255,255,255,0.04)", backdropFilter: "blur(20px)" }}>
            <div className="max-w-[1200px] mx-auto px-6 py-16">
                <div className="grid md:grid-cols-6 gap-10">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <Globe3D size={28} />
                            <span className="font-bold text-white">
                                GlobalLife
                                <span className="ml-1" style={{
                                    background: "linear-gradient(135deg, #0A84FF, #5E5CE6)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                }}>AI</span>
                            </span>
                        </Link>
                        <p className="text-sm leading-relaxed mb-6 max-w-[260px]" style={{ color: "rgba(255,255,255,0.35)" }}>
                            AI-powered language training and immigration consulting. Your future starts here.
                        </p>
                        <div className="flex items-center gap-3">
                            {[Github, Twitter, Linkedin, Mail].map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-[rgba(255,255,255,0.05)]"
                                    style={{ border: "1px solid rgba(255,255,255,0.06)" }}
                                >
                                    <Icon className="w-3.5 h-3.5 text-[rgba(255,255,255,0.4)]" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    {Object.entries(footerLinks).map(([title, links]) => (
                        <div key={title}>
                            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">{title}</h4>
                            <div className="space-y-2.5">
                                {links.map((link) => (
                                    <a
                                        key={link.label}
                                        href={link.href}
                                        className="block text-sm transition-colors hover:text-white"
                                        style={{ color: "rgba(255,255,255,0.35)" }}
                                    >
                                        {link.label}
                                    </a>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom */}
                <div className="mt-14 pt-6 flex flex-col md:flex-row items-center justify-between gap-4"
                    style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
                >
                    <p className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
                        &copy; {new Date().getFullYear()} GlobalLife AI. All rights reserved.
                    </p>
                    <p className="text-xs" style={{ color: "rgba(255,255,255,0.15)" }}>
                        Made with precision by AI
                    </p>
                </div>
            </div>
        </footer>
    );
}

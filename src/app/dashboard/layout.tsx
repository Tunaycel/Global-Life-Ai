"use client";

import { useState, useSyncExternalStore, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import dynamic from "next/dynamic";
import {
    Home, BookOpen, Plane, MessageCircle, BarChart3, Settings,
    ChevronLeft, Bell, Menu, X, LogOut, Flame
} from "lucide-react";

const Globe3D = dynamic(() => import("@/components/3d/Globe3D"), {
    ssr: false,
    loading: () => (
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0A84FF]/20 to-[#5E5CE6]/20 animate-pulse" />
    ),
});
import { cn } from "@/lib/utils";

const navItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard" },
    { icon: BookOpen, label: "Dil Öğrenme", href: "/dashboard/language" },
    { icon: Plane, label: "Vize Rehberi", href: "/dashboard/visa" },
    { icon: MessageCircle, label: "AI Asistan", href: "/dashboard/assistant" },
    { icon: BarChart3, label: "İstatistikler", href: "/dashboard/stats" },
];

// This layout is prerendered at build time, so a date in the HTML would be the
// build date. The server snapshot is empty; the client fills in today's date.
const noopSubscribe = () => () => { };

function TodayDate() {
    const today = useSyncExternalStore(
        noopSubscribe,
        () => new Date().toLocaleDateString("tr-TR", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
        () => "\u00a0"
    );
    return <>{today}</>;
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const pathname = usePathname();
    const { data: session } = useSession();

    const userName = session?.user?.name || "Kullanıcı";
    const userImage = session?.user?.image;
    const userInitial = userName.charAt(0).toUpperCase();

    // A render helper, not a component: a component declared in here would be
    // recreated (and remounted, Globe3D included) on every render.
    const renderSidebar = (mobile = false) => (
        <div
            className={cn(
                "h-full flex flex-col",
                !mobile && (collapsed ? "w-[72px]" : "w-[220px]"),
                mobile && "w-[260px]"
            )}
            style={{
                background: "#0A0A12",
                borderRight: "1px solid rgba(255,255,255,0.06)",
            }}
        >
            {/* Logo */}
            <div className="h-16 flex items-center gap-3 px-3 shrink-0">
                <Globe3D size={44} />
                {(!collapsed || mobile) && (
                    <div>
                        <span className="font-bold text-sm text-white tracking-tight">GlobalLife AI</span>
                    </div>
                )}
            </div>

            {/* Nav */}
            <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href + "/"));
                    const Icon = item.icon;
                    const isExactDashboard = item.href === "/dashboard" && pathname === "/dashboard";
                    const active = isExactDashboard || isActive;

                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            onClick={mobile ? () => setMobileOpen(false) : undefined}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                                active
                                    ? "text-white"
                                    : "text-white/40 hover:text-white/70 hover:bg-white/5"
                            )}
                            style={active ? {
                                background: "linear-gradient(135deg, rgba(10,132,255,0.15), rgba(94,92,230,0.1))",
                                borderLeft: "3px solid #0A84FF",
                            } : {}}
                        >
                            <Icon className="w-[18px] h-[18px] shrink-0" />
                            {(!collapsed || mobile) && <span>{item.label}</span>}
                        </Link>
                    );
                })}
            </nav>

            {/* Settings at bottom */}
            <div className="px-3 pb-2">
                <Link
                    href="/dashboard/settings"
                    onClick={mobile ? () => setMobileOpen(false) : undefined}
                    className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                        pathname === "/dashboard/settings"
                            ? "text-white bg-white/5"
                            : "text-white/40 hover:text-white/70 hover:bg-white/5"
                    )}
                >
                    <Settings className="w-[18px] h-[18px] shrink-0" />
                    {(!collapsed || mobile) && <span>Ayarlar</span>}
                </Link>
            </div>

            {/* Profile */}
            {(!collapsed || mobile) && (
                <div className="p-3 border-t border-white/5">
                    <div className="flex items-center gap-3 px-3 py-2.5">
                        {userImage ? (
                            <img src={userImage} alt="" className="w-9 h-9 rounded-full object-cover" />
                        ) : (
                            <div
                                className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold"
                                style={{ background: "linear-gradient(135deg, #0A84FF, #5E5CE6)" }}
                            >
                                {userInitial}
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-white truncate">{userName}</p>
                        </div>
                        <button
                            onClick={() => signOut({ callbackUrl: "/" })}
                            className="p-1.5 rounded-lg hover:bg-white/5 transition-colors text-white/30 hover:text-white/60"
                            title="Çıkış Yap"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Collapse toggle */}
            {!mobile && (
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="absolute top-[72px] -right-3 w-6 h-6 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors z-10"
                    style={{
                        background: "#0A0A12",
                        border: "1px solid rgba(255,255,255,0.08)",
                    }}
                >
                    <ChevronLeft className={cn("w-3 h-3 text-white/40 transition-transform", collapsed && "rotate-180")} />
                </button>
            )}
        </div>
    );

    return (
        <div className="h-screen flex overflow-hidden" style={{ background: "#030308" }}>
            {/* Desktop Sidebar */}
            <div className="hidden lg:block relative shrink-0 transition-all duration-300">
                {renderSidebar()}
            </div>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileOpen(false)}
                            className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed left-0 top-0 bottom-0 z-50 lg:hidden"
                        >
                            {renderSidebar(true)}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top Bar */}
                <header
                    className="h-16 flex items-center justify-between px-6 shrink-0"
                    style={{
                        background: "rgba(3,3,8,0.8)",
                        borderBottom: "1px solid rgba(255,255,255,0.04)",
                        backdropFilter: "blur(20px)",
                    }}
                >
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setMobileOpen(true)}
                            className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-white/5 transition-colors"
                        >
                            <Menu className="w-5 h-5 text-white" />
                        </button>
                        <div>
                            <h1 className="text-lg font-bold text-white leading-tight">
                                Merhaba, {userName.split(" ")[0]}!
                            </h1>
                            <p className="text-xs text-white/30 font-medium mt-0.5">
                                <TodayDate />
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Streak */}
                        <div
                            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full"
                            style={{ background: "rgba(255,159,10,0.1)", border: "1px solid rgba(255,159,10,0.15)" }}
                        >
                            <Flame className="w-4 h-4 text-[#FF9F0A]" />
                            <span className="text-sm font-bold text-[#FF9F0A]">12</span>
                        </div>
                        {/* Notification */}
                        <button className="relative p-2 rounded-lg hover:bg-white/5 transition-colors">
                            <Bell className="w-5 h-5 text-white/40" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FF453A]" />
                        </button>
                        {/* Avatar */}
                        {userImage ? (
                            <img src={userImage} alt="" className="w-8 h-8 rounded-full object-cover cursor-pointer" />
                        ) : (
                            <div
                                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold cursor-pointer"
                                style={{ background: "linear-gradient(135deg, #0A84FF, #5E5CE6)" }}
                            >
                                {userInitial}
                            </div>
                        )}
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6" style={{ background: "#030308" }}>
                    {children}
                </main>
            </div>
        </div>
    );
}

import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Ayarlar",
    description: "Profilini ve tercihlerini yönet.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}

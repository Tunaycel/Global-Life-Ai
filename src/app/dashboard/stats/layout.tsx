import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "İstatistikler",
    description: "Öğrenme istatistiklerini incele.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}

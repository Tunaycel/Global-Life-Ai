import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "İlerleme",
    description: "Haftalık çalışmanı ve beceri gelişimini gör.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}

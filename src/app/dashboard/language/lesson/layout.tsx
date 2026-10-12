import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Ders",
    description: "AI öğretmenle konuşma pratiği yap.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}

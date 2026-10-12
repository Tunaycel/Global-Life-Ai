import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Başlarken",
    description: "Hedeflerini seç, sana uygun planı hazırlayalım.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}

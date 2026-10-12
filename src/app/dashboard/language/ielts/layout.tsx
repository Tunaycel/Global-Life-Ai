import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "IELTS hazırlık",
    description: "IELTS sınavına bölüm bölüm hazırlan.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}

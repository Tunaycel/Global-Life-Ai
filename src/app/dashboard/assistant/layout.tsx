import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "AI asistan",
    description: "Dil öğrenme ve vize süreçleri hakkında sorularını sor.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}

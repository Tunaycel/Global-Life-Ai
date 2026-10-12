import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Vize asistanı",
    description: "Vize sorularını AI asistana sor.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}

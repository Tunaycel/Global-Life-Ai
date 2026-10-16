import type { Metadata } from "next";

export const metadata: Metadata = {
    title: {
        default: "Ders",
        template: "%s · GlobalLife AI",
    },
    description: "Dersteki alıştırmaları adım adım çöz.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sesli destek",
    description: "AI danışmanla sesli görüşme.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Yol haritası",
    description: "Taşınma sürecini adım adım takip et.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}

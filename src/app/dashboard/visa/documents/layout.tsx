import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Belgeler",
    description: "Vize başvurun için gereken belgeleri takip et.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}

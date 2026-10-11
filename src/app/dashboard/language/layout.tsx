import type { Metadata } from "next";

export const metadata: Metadata = {
    title: {
        default: "Dil öğrenme",
        template: "%s · GlobalLife AI",
    },
    description: "Dil seviyeni takip et ve derslerine devam et.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}

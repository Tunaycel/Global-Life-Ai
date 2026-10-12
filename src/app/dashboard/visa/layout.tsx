import type { Metadata } from "next";

export const metadata: Metadata = {
    title: {
        default: "Vize rehberi",
        template: "%s · GlobalLife AI",
    },
    description: "Vize türlerini ve hedef ülkeleri incele.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}

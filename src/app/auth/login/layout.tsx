import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Giriş yap",
    description: "E-posta ya da Google hesabınla GlobalLife AI'ye giriş yap.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}

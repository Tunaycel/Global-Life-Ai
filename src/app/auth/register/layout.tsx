import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Hesap oluştur",
    description: "E-posta ya da Google ile ücretsiz bir GlobalLife AI hesabı oluştur.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}

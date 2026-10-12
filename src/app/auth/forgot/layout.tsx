import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Şifremi unuttum",
    description: "GlobalLife AI şifreni yenilemek için bağlantı iste.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}

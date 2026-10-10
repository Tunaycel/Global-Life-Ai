"use client";

import Link from "next/link";
import { Compass } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";

export default function NotFound() {
    const { t } = useLocale();

    return (
        <main className="min-h-screen flex items-center justify-center bg-[#030308] px-6">
            <div className="max-w-md w-full text-center">
                <Compass className="w-12 h-12 text-[#0A84FF] mx-auto mb-4" aria-hidden="true" />
                <p className="text-sm font-semibold text-white/40 mb-2">404</p>
                <h1 className="text-2xl font-semibold text-white mb-2">{t("notFound", "title") as string}</h1>
                <p className="text-sm text-white/50 mb-8">{t("notFound", "description") as string}</p>
                <Link href="/" className="btn-primary !py-2 !px-5 !text-sm">
                    {t("notFound", "back") as string}
                </Link>
            </div>
        </main>
    );
}

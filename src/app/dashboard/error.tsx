"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function DashboardError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="max-w-md w-full rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)] p-8 text-center">
                <AlertTriangle className="w-10 h-10 text-[#FF9F0A] mx-auto mb-4" aria-hidden="true" />
                <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">Bir şeyler ters gitti.</h2>
                <p className="text-sm text-[var(--text-secondary)] mb-6">
                    Bu sayfa yüklenirken bir hata oluştu. Tekrar deneyebilir ya da panele dönebilirsin.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button type="button" onClick={() => reset()} className="btn-primary !py-2 !px-4 !text-sm">
                        <RotateCcw className="w-4 h-4" aria-hidden="true" /> Tekrar dene
                    </button>
                    <Link href="/dashboard" className="btn-ghost !py-2 !px-4 !text-sm">
                        Panele dön
                    </Link>
                </div>
            </div>
        </div>
    );
}

import Link from "next/link";
import type { LucideIcon } from "lucide-react";

type EmptyStateProps = {
    icon: LucideIcon;
    title: string;
    description?: string;
    action?: { label: string; href: string };
};

export default function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
    return (
        <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface-elevated)] px-6 py-10 text-center">
            <Icon className="w-10 h-10 text-[var(--text-tertiary)] mx-auto mb-3" aria-hidden="true" />
            <p className="text-sm font-semibold text-[var(--text-primary)]">{title}</p>
            {description && <p className="text-xs text-[var(--text-secondary)] mt-1">{description}</p>}
            {action && (
                <Link href={action.href} className="btn-primary mt-5 !py-2 !px-4 !text-sm">
                    {action.label}
                </Link>
            )}
        </div>
    );
}

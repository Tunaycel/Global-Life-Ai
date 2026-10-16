"use client";

import Link from "next/link";
import { Trophy } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";

interface Props {
    correct: number;
    /** Questions that count; vocabulary cards are not scored. */
    scored: number;
    /** Vocabulary cards seen in the lesson. */
    words: number;
    onRestart: () => void;
}

export default function ScoreScreen({ correct, scored, words, onRestart }: Props) {
    const { t } = useLocale();

    return (
        <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-8 text-center">
            <Trophy className="w-10 h-10 text-[var(--color-warning)] mx-auto mb-4" aria-hidden="true" />
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">{t("lesson", "finished") as string}</h2>
            {scored > 0 && (
                <p className="text-[var(--text-secondary)]">
                    <span className="text-3xl font-semibold tabular-nums text-[var(--text-primary)]">
                        {correct} / {scored}
                    </span>
                    <br />
                    {t("lesson", "scoreLabel") as string}
                </p>
            )}
            {words > 0 && (
                <p className="text-sm text-[var(--text-secondary)] mt-3">
                    {words} {t("lesson", "wordsLearned") as string}
                </p>
            )}
            <div className="flex flex-wrap justify-center gap-3 mt-8">
                <button type="button" onClick={onRestart} autoFocus className="btn-primary !py-2 !px-6 !text-sm">
                    {t("lesson", "restart") as string}
                </button>
                <Link href="/dashboard/language" className="btn-ghost !py-2 !px-6 !text-sm">
                    {t("lesson", "backToLanguage") as string}
                </Link>
            </div>
        </div>
    );
}

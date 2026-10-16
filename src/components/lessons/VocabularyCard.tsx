"use client";

import { useState } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import type { LessonLanguage, VocabularyExercise } from "@/lib/lessons/types";
import { blockKeyRepeat } from "./keys";

interface Props {
    exercise: VocabularyExercise;
    language: LessonLanguage;
    onNext: () => void;
}

/** Shows a term, then its meaning on request. Not scored. */
export default function VocabularyCard({ exercise, language, onNext }: Props) {
    const { t } = useLocale();
    const [revealed, setRevealed] = useState(false);

    return (
        <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-8 text-center">
            <p className="text-xs uppercase tracking-wide text-[var(--text-secondary)] mb-4">{t("lesson", "newWord") as string}</p>
            <p lang={language} className="text-3xl font-semibold text-[var(--text-primary)] mb-6">{exercise.term}</p>

            {revealed ? (
                <>
                    <p className="text-lg text-[var(--text-primary)] mb-2">{exercise.translation}</p>
                    {exercise.example && (
                        <div className="mt-4 text-sm">
                            <p lang={language} className="text-[var(--text-primary)]">{exercise.example.text}</p>
                            <p className="text-[var(--text-secondary)]">{exercise.example.translation}</p>
                        </div>
                    )}
                    <button type="button" onClick={onNext} onKeyDown={blockKeyRepeat} autoFocus className="btn-primary !py-2 !px-6 !text-sm mt-8">
                        {t("lesson", "next") as string}
                    </button>
                </>
            ) : (
                <button type="button" onClick={() => setRevealed(true)} onKeyDown={blockKeyRepeat} autoFocus className="btn-primary !py-2 !px-6 !text-sm">
                    {t("lesson", "showMeaning") as string}
                </button>
            )}
        </div>
    );
}

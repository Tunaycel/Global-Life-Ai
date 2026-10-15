"use client";

import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import type { LessonLanguage, MultipleChoiceExercise } from "@/lib/lessons/types";

interface Props {
    exercise: MultipleChoiceExercise;
    language: LessonLanguage;
    onDone: (correct: boolean) => void;
}

/** Pick one option by click, Enter or its number key; then shows right or wrong. */
export default function MultipleChoiceQuestion({ exercise, language, onDone }: Props) {
    const { t } = useLocale();
    const [picked, setPicked] = useState<number | null>(null);
    const answered = picked !== null;
    const correct = picked === exercise.answer;

    useEffect(() => {
        if (answered) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.ctrlKey || e.metaKey || e.altKey) return;
            const n = Number(e.key);
            if (Number.isInteger(n) && n >= 1 && n <= exercise.options.length) setPicked(n - 1);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [answered, exercise.options.length]);

    const optionStyle = (i: number) => {
        if (!answered) return "border-[var(--border)] hover:border-[var(--color-primary)]";
        if (i === exercise.answer) return "border-[var(--color-accent)] bg-[var(--color-accent)]/10";
        if (i === picked) return "border-[var(--color-error)] bg-[var(--color-error)]/10";
        return "border-[var(--border)] opacity-50";
    };

    return (
        <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-8">
            <p className="text-lg font-medium text-[var(--text-primary)] mb-6">{exercise.prompt}</p>

            <div className="flex flex-col gap-3">
                {exercise.options.map((option, i) => (
                    <button
                        key={i}
                        type="button"
                        onClick={() => setPicked(i)}
                        disabled={answered}
                        autoFocus={i === 0}
                        className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${optionStyle(i)}`}
                    >
                        <span className="w-6 h-6 shrink-0 rounded-md border border-[var(--border)] text-xs flex items-center justify-center text-[var(--text-secondary)]">
                            {i + 1}
                        </span>
                        <span lang={language} className="flex-1 text-[var(--text-primary)]">{option}</span>
                        {answered && i === exercise.answer && <Check className="w-4 h-4 text-[var(--color-accent)]" aria-hidden="true" />}
                        {answered && i === picked && !correct && <X className="w-4 h-4 text-[var(--color-error)]" aria-hidden="true" />}
                    </button>
                ))}
            </div>

            <div role="status" aria-live="polite">
                {answered && (
                    <div className="mt-6">
                        <p className={`font-semibold ${correct ? "text-[var(--color-accent)]" : "text-[var(--color-error)]"}`}>
                            {t("lesson", correct ? "correct" : "wrong") as string}
                        </p>
                        {!correct && (
                            <p className="text-sm text-[var(--text-primary)] mt-1">
                                {t("lesson", "correctAnswer") as string}{" "}
                                <span lang={language} className="font-semibold">{exercise.options[exercise.answer]}</span>
                            </p>
                        )}
                        {exercise.explanation && <p className="text-sm text-[var(--text-secondary)] mt-2">{exercise.explanation}</p>}
                    </div>
                )}
            </div>

            {answered && (
                <button type="button" onClick={() => onDone(correct)} autoFocus className="btn-primary !py-2 !px-6 !text-sm mt-6">
                    {t("lesson", "next") as string}
                </button>
            )}
        </div>
    );
}

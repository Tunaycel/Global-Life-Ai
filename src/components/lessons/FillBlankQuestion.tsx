"use client";

import { useState } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { BLANK, type FillBlankExercise, type LessonLanguage } from "@/lib/lessons/types";
import { isFillBlankCorrect } from "@/lib/lessons/validate";
import { blockKeyRepeat } from "./keys";

interface Props {
    exercise: FillBlankExercise;
    language: LessonLanguage;
    onDone: (correct: boolean) => void;
}

/** A sentence with a text box in its gap; Enter checks the answer. */
export default function FillBlankQuestion({ exercise, language, onDone }: Props) {
    const { t } = useLocale();
    const [input, setInput] = useState("");
    const [checked, setChecked] = useState(false);
    const correct = checked && isFillBlankCorrect(exercise, input);

    const gap = exercise.sentence.indexOf(BLANK);
    const before = exercise.sentence.slice(0, gap);
    const after = exercise.sentence.slice(gap + BLANK.length);

    const check = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() !== "") setChecked(true);
    };

    const inputStyle = !checked
        ? "border-[var(--border)] focus:border-[var(--color-primary)]"
        : correct
            ? "border-[var(--color-accent)] text-[var(--color-accent)]"
            : "border-[var(--color-error)] text-[var(--color-error)]";

    return (
        <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-8">
            <p className="text-xs uppercase tracking-wide text-[var(--text-secondary)] mb-4">{t("lesson", "fillBlank") as string}</p>

            <form onSubmit={check}>
                <p lang={language} className="text-2xl text-[var(--text-primary)] leading-relaxed">
                    {before}
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        readOnly={checked}
                        autoFocus
                        autoComplete="off"
                        autoCapitalize="off"
                        spellCheck={false}
                        aria-label={t("lesson", "yourAnswer") as string}
                        className={`mx-1 w-40 bg-transparent border-b-2 outline-none text-center ${inputStyle}`}
                    />
                    {after}
                </p>
                {exercise.translation && <p className="text-sm text-[var(--text-secondary)] mt-3">{exercise.translation}</p>}
                {exercise.hint && !checked && <p className="text-sm text-[var(--text-secondary)] mt-2">{exercise.hint}</p>}

                {!checked && (
                    <button type="submit" disabled={input.trim() === ""} className="btn-primary !py-2 !px-6 !text-sm mt-6 disabled:opacity-40">
                        {t("lesson", "check") as string}
                    </button>
                )}
            </form>

            <div role="status" aria-live="polite">
                {checked && (
                    <div className="mt-6">
                        <p className={`font-semibold ${correct ? "text-[var(--color-accent)]" : "text-[var(--color-error)]"}`}>
                            {t("lesson", correct ? "correct" : "wrong") as string}
                        </p>
                        {!correct && (
                            <p className="text-sm text-[var(--text-primary)] mt-1">
                                {t("lesson", "correctAnswer") as string}{" "}
                                <span lang={language} className="font-semibold">{exercise.answers[0]}</span>
                            </p>
                        )}
                    </div>
                )}
            </div>

            {checked && (
                <button type="button" onClick={() => onDone(correct)} onKeyDown={blockKeyRepeat} autoFocus className="btn-primary !py-2 !px-6 !text-sm mt-6">
                    {t("lesson", "next") as string}
                </button>
            )}
        </div>
    );
}

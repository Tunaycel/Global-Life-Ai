"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock, ListChecks } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { tPlural } from "@/lib/i18n";
import type { Exercise, Lesson, Unit } from "@/lib/lessons/types";
import FillBlankQuestion from "./FillBlankQuestion";
import MultipleChoiceQuestion from "./MultipleChoiceQuestion";
import ScoreScreen from "./ScoreScreen";
import VocabularyCard from "./VocabularyCard";

interface Props {
    unit: Unit;
    lesson: Lesson;
}

export default function LessonPlayer({ unit, lesson }: Props) {
    const { t, locale } = useLocale();
    const [index, setIndex] = useState(0);
    const [correct, setCorrect] = useState(0);
    const total = lesson.exercises.length;
    const words = lesson.exercises.filter((e) => e.kind === "vocabulary").length;
    const scored = total - words;
    const exercise: Exercise | undefined = lesson.exercises[index];
    const next = () => setIndex((i) => i + 1);
    const answer = (isCorrect: boolean) => {
        if (isCorrect) setCorrect((c) => c + 1);
        next();
    };
    const restart = () => {
        setIndex(0);
        setCorrect(0);
    };

    return (
        <div className="max-w-[720px] mx-auto">
            <div className="flex items-center gap-3 mb-6">
                <Link
                    href="/dashboard/language"
                    className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                    ← {t("lesson", "back") as string}
                </Link>
                <span className="text-[var(--border)]" aria-hidden="true">|</span>
                <span className="text-sm text-[var(--text-secondary)]">{unit.title}</span>
                <span className="px-2 py-0.5 rounded-full bg-[#30D158]/10 text-[#30D158] text-xs font-semibold">{unit.level}</span>
            </div>

            <h1 className="text-2xl font-semibold text-[var(--text-primary)] mb-2">{lesson.title}</h1>
            <p className="text-sm text-[var(--text-secondary)] mb-4">{lesson.goal}</p>
            <div className="flex items-center gap-4 text-xs text-[var(--text-secondary)] mb-6">
                <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                    {lesson.minutes} {t("lesson", "minutes") as string}
                </span>
                <span className="flex items-center gap-1.5">
                    <ListChecks className="w-3.5 h-3.5" aria-hidden="true" />
                    {words} {tPlural("lesson", "words", words, locale)} · {scored} {tPlural("lesson", "questions", scored, locale)}
                </span>
            </div>

            <div className="flex items-center gap-3 mb-6">
                <progress
                    value={Math.min(index, total)}
                    max={total}
                    aria-label={t("lesson", "progress") as string}
                    className="flex-1 h-1.5 rounded-full overflow-hidden appearance-none [&::-webkit-progress-bar]:bg-[var(--border)] [&::-webkit-progress-value]:bg-[#0A84FF] [&::-moz-progress-bar]:bg-[#0A84FF]"
                />
                <span className="text-xs tabular-nums text-[var(--text-secondary)]">
                    {Math.min(index + 1, total)} / {total}
                </span>
            </div>

            {exercise?.kind === "vocabulary" && (
                <VocabularyCard key={exercise.id} exercise={exercise} language={unit.language} onNext={next} />
            )}
            {exercise?.kind === "multiple-choice" && (
                <MultipleChoiceQuestion key={exercise.id} exercise={exercise} onDone={answer} />
            )}
            {exercise?.kind === "fill-blank" && (
                <FillBlankQuestion key={exercise.id} exercise={exercise} language={unit.language} onDone={answer} />
            )}
            {!exercise && <ScoreScreen correct={correct} scored={scored} words={words} onRestart={restart} />}
        </div>
    );
}

"use client";

import Link from "next/link";
import { Clock, ListChecks } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import type { Lesson, Unit } from "@/lib/lessons/types";

interface Props {
    unit: Unit;
    lesson: Lesson;
}

export default function LessonPlayer({ unit, lesson }: Props) {
    const { t } = useLocale();

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
            <div className="flex items-center gap-4 text-xs text-[var(--text-secondary)]">
                <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                    {lesson.minutes} {t("lesson", "minutes") as string}
                </span>
                <span className="flex items-center gap-1.5">
                    <ListChecks className="w-3.5 h-3.5" aria-hidden="true" />
                    {lesson.exercises.length} {t("lesson", "exercises") as string}
                </span>
            </div>
        </div>
    );
}

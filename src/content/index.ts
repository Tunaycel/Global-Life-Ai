import type { Lesson, Unit } from "@/lib/lessons/types";
import { unit1 as deA1Unit1 } from "./de/a1/unit-1";

/** Every unit the app knows about. New units are added here. */
export const units: Unit[] = [deA1Unit1];

export function findLesson(id: string): { unit: Unit; lesson: Lesson } | undefined {
    for (const unit of units) {
        const lesson = unit.lessons.find((l) => l.id === id);
        if (lesson) return { unit, lesson };
    }
    return undefined;
}

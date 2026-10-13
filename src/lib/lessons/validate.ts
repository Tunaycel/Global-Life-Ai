import { BLANK, BLANK_PATTERN, type Exercise, type Unit } from "./types";

// The types catch missing fields in content written in TypeScript; this also
// catches what types cannot (an answer index out of range, a sentence without a
// gap, a duplicate id) and stays safe if content later arrives as JSON.
export function validateUnits(units: Unit[]): string[] {
    const problems: string[] = [];
    const seen = new Set<string>();

    const claim = (id: string, where: string) => {
        if (!id?.trim()) problems.push(`${where}: empty id`);
        else if (seen.has(id)) problems.push(`${where}: duplicate id "${id}"`);
        seen.add(id);
    };

    for (const unit of units) {
        claim(unit.id, `unit ${unit.id}`);
        if (!unit.lessons?.length) problems.push(`unit ${unit.id}: no lessons`);

        for (const lesson of unit.lessons ?? []) {
            const where = `lesson ${lesson.id}`;
            claim(lesson.id, where);
            if (!lesson.exercises?.length) problems.push(`${where}: no exercises`);
            if (!(lesson.minutes > 0)) problems.push(`${where}: minutes must be positive`);

            for (const exercise of lesson.exercises ?? []) {
                claim(exercise.id, `${where} / ${exercise.id}`);
                problems.push(...checkExercise(exercise).map((p) => `${where} / ${exercise.id}: ${p}`));
            }
        }
    }
    return problems;
}

function checkExercise(exercise: Exercise): string[] {
    switch (exercise.kind) {
        case "vocabulary":
            return !exercise.term.trim() || !exercise.translation.trim() ? ["term and translation are required"] : [];
        case "multiple-choice": {
            const problems: string[] = [];
            if (exercise.options.length < 2) problems.push("needs at least two options");
            if (new Set(exercise.options).size !== exercise.options.length) problems.push("options repeat");
            if (!Number.isInteger(exercise.answer) || exercise.answer < 0 || exercise.answer >= exercise.options.length) {
                problems.push(`answer ${exercise.answer} is not an option index`);
            }
            return problems;
        }
        case "fill-blank": {
            const problems: string[] = [];
            const gaps = exercise.sentence.match(BLANK_PATTERN) ?? [];
            if (gaps.length !== 1 || gaps[0] !== BLANK) problems.push(`sentence needs exactly one ${BLANK}`);
            if (!exercise.answers.length || exercise.answers.some((a) => !a.trim())) problems.push("needs non-empty answers");
            return problems;
        }
        default: {
            const unknown: never = exercise;
            return [`unknown kind "${(unknown as { kind?: unknown }).kind}"`];
        }
    }
}

/** Compares a typed answer leniently: case, surrounding and repeated spaces do not matter. */
export function isFillBlankCorrect(exercise: { answers: string[] }, input: string): boolean {
    const normalize = (s: string) => s.trim().replace(/\s+/g, " ").toLocaleLowerCase("de");
    const typed = normalize(input);
    return typed !== "" && exercise.answers.some((a) => normalize(a) === typed);
}

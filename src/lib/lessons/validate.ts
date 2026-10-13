import { BLANK, type Unit } from "./types";

// The types catch mistakes in content written in TypeScript. This also catches
// what types cannot (an answer index out of range, a sentence without a gap, a
// duplicate id) and reports problems instead of throwing on malformed data, so
// it stays usable if content later arrives as JSON.

const ID_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const GAPS = /_{3,}/g;

type Fields = Record<string, unknown>;
const isRecord = (v: unknown): v is Fields => typeof v === "object" && v !== null && !Array.isArray(v);
const isText = (v: unknown): v is string => typeof v === "string" && v.trim() !== "";
const list = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);

export function validateUnits(units: readonly Unit[]): string[] {
    const problems: string[] = [];
    const seen = new Set<string>();

    const claim = (id: unknown, where: string) => {
        if (typeof id !== "string" || !ID_PATTERN.test(id)) problems.push(`${where}: id must be lowercase letters, digits and dashes`);
        else if (seen.has(id)) problems.push(`${where}: duplicate id "${id}"`);
        else seen.add(id);
    };
    const requireText = (fields: Fields, keys: string[], where: string) => {
        for (const key of keys) if (!isText(fields[key])) problems.push(`${where}: ${key} is empty`);
    };

    if (!Array.isArray(units)) return ["units is not a list"];

    for (const unit of units as unknown[]) {
        if (!isRecord(unit)) {
            problems.push("a unit is not an object");
            continue;
        }
        const unitWhere = `unit ${String(unit.id)}`;
        claim(unit.id, unitWhere);
        requireText(unit, ["title"], unitWhere);
        if (!list(unit.lessons).length) problems.push(`${unitWhere}: no lessons`);

        for (const lesson of list(unit.lessons)) {
            if (!isRecord(lesson)) {
                problems.push(`${unitWhere}: a lesson is not an object`);
                continue;
            }
            const where = `lesson ${String(lesson.id)}`;
            claim(lesson.id, where);
            requireText(lesson, ["title", "goal"], where);
            if (!list(lesson.exercises).length) problems.push(`${where}: no exercises`);
            const minutes = lesson.minutes;
            if (typeof minutes !== "number" || !Number.isFinite(minutes) || minutes <= 0) {
                problems.push(`${where}: minutes must be a positive number`);
            }

            for (const exercise of list(lesson.exercises)) {
                if (!isRecord(exercise)) {
                    problems.push(`${where}: an exercise is not an object`);
                    continue;
                }
                const exerciseWhere = `${where} / ${String(exercise.id)}`;
                claim(exercise.id, exerciseWhere);
                problems.push(...checkExercise(exercise).map((p) => `${exerciseWhere}: ${p}`));
            }
        }
    }
    return problems;
}

function checkExercise(exercise: Fields): string[] {
    const problems: string[] = [];
    const empty = (key: string) => {
        if (!isText(exercise[key])) problems.push(`${key} is empty`);
    };

    switch (exercise.kind) {
        case "vocabulary": {
            empty("term");
            empty("translation");
            const example = exercise.example;
            if (example !== undefined && (!isRecord(example) || !isText(example.text) || !isText(example.translation))) {
                problems.push("example needs text and translation");
            }
            break;
        }
        case "multiple-choice": {
            empty("prompt");
            const options = exercise.options;
            if (!Array.isArray(options) || options.length < 2) problems.push("needs at least two options");
            else if (!options.every(isText)) problems.push("an option is empty");
            else if (new Set(options.map((o) => o.trim())).size !== options.length) problems.push("options repeat");
            const answer = exercise.answer;
            if (typeof answer !== "number" || !Number.isInteger(answer) || answer < 0 || answer >= list(options).length) {
                problems.push(`answer ${String(answer)} is not an option index`);
            }
            break;
        }
        case "fill-blank": {
            const sentence = exercise.sentence;
            const gaps = typeof sentence === "string" ? (sentence.match(GAPS) ?? []) : [];
            if (gaps.length !== 1 || gaps[0] !== BLANK) problems.push(`sentence needs exactly one ${BLANK}`);
            const answers = exercise.answers;
            if (!Array.isArray(answers) || !answers.length || !answers.every(isText)) problems.push("needs non-empty answers");
            break;
        }
        default:
            problems.push(`unknown kind "${String(exercise.kind)}"`);
    }
    return problems;
}

/**
 * Compares a typed answer leniently. Ignored: case, extra spaces, a trailing
 * full stop or similar, invisible characters, and how the keyboard encoded
 * umlauts. A Turkish keyboard's "İ" counts as "I".
 */
export function isFillBlankCorrect(exercise: { answers: string[] }, input: string): boolean {
    const typed = normalizeAnswer(input);
    return typed !== "" && exercise.answers.some((a) => normalizeAnswer(a) === typed);
}

function normalizeAnswer(s: string): string {
    return s
        .normalize("NFC")
        .replace(/[\u200B-\u200D\uFEFF]/g, "")
        .toLocaleLowerCase("de")
        .replace(/\u0307/g, "")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/[.,!?;:]+$/, "")
        .trim();
}

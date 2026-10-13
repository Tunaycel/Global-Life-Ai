import { readdirSync } from "node:fs";
import { basename } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { describe, expect, it } from "vitest";
import { findLesson, units } from "@/content";
import type { Exercise, Unit } from "@/lib/lessons/types";
import { isFillBlankCorrect, validateUnits } from "@/lib/lessons/validate";

describe("lesson content", () => {
  it("has no malformed units, lessons or exercises", () => {
    expect(validateUnits(units)).toEqual([]);
  });

  it("registers the unit exported by every unit-*.ts file in src/content", async () => {
    const dir = fileURLToPath(new URL("../../content/", import.meta.url));
    const files = readdirSync(dir, { recursive: true, encoding: "utf8" }).filter((f) => /^unit-[\w-]+\.ts$/.test(basename(f)));
    expect(files.length).toBeGreaterThan(0);
    for (const file of files) {
      const mod: Record<string, unknown> = await import(pathToFileURL(dir + file).href);
      const exported = Object.values(mod).filter((v) => typeof v === "object" && v !== null && "lessons" in v);
      expect(exported, `${file} should export exactly one unit`).toHaveLength(1);
      expect(units, `${file} is not in src/content/index.ts`).toContain(exported[0]);
    }
  });

  it("finds a lesson by id", () => {
    expect(findLesson("de-a1-u1-l2")?.lesson.title).toBe("Adın ve nereli olduğun");
    expect(findLesson("nope")).toBeUndefined();
  });
});

describe("validateUnits", () => {
  const unit = (exercises: Exercise[]): Unit => ({
    id: "u",
    language: "de",
    level: "A1",
    explainedIn: "tr",
    title: "t",
    lessons: [{ id: "l", title: "t", goal: "g", minutes: 5, exercises }],
  });
  // Content that may later come from JSON, where the types do not hold.
  const raw = (exercise: unknown) => validateUnits([unit([exercise as Exercise])]);

  it("reports an answer index outside the options", () => {
    expect(raw({ kind: "multiple-choice", id: "m", prompt: "p", options: ["a", "b"], answer: 2 })).toEqual([
      "lesson l / m: answer 2 is not an option index",
    ]);
  });

  it("reports a sentence without exactly one gap", () => {
    const fb = (sentence: string) => raw({ kind: "fill-blank", id: "f", sentence, answers: ["x"] });
    expect(fb("no gap")).toEqual(["lesson l / f: sentence needs exactly one ___"]);
    expect(fb("a ___ b ___")).toEqual(["lesson l / f: sentence needs exactly one ___"]);
    expect(fb("a ____ b")).toEqual(["lesson l / f: sentence needs exactly one ___"]);
    expect(fb("Ich ___.")).toEqual([]);
  });

  it("reports duplicate and badly formed ids", () => {
    expect(
      validateUnits([
        unit([
          { kind: "vocabulary", id: "v", term: "a", translation: "b" },
          { kind: "vocabulary", id: "v", term: "c", translation: "d" },
          { kind: "vocabulary", id: "l", term: "e", translation: "f" },
        ]),
      ]),
    ).toEqual(['lesson l / v: duplicate id "v"', 'lesson l / l: duplicate id "l"']);
    expect(raw({ kind: "vocabulary", id: " e", term: "a", translation: "b" })).toEqual([
      "lesson l /  e: id must be lowercase letters, digits and dashes",
    ]);
  });

  it("reports empty units and lessons and bad minutes", () => {
    const base = unit([]);
    expect(validateUnits([{ ...base, lessons: [] }])).toEqual(["unit u: no lessons"]);
    for (const minutes of [0, Number.NaN, Number.POSITIVE_INFINITY, "5" as unknown as number]) {
      expect(validateUnits([{ ...base, lessons: [{ ...base.lessons[0], minutes }] }])).toEqual([
        "lesson l: no exercises",
        "lesson l: minutes must be a positive number",
      ]);
    }
  });

  it("reports empty prompts, options and repeats in multiple choice", () => {
    const mc = (prompt: string, options: unknown[], answer: unknown = 0) =>
      raw({ kind: "multiple-choice", id: "m", prompt, options, answer });
    expect(mc("p", ["a"])).toEqual(["lesson l / m: needs at least two options"]);
    expect(mc("p", ["a", "a "])).toEqual(["lesson l / m: options repeat"]);
    expect(mc("p", ["", "b"])).toEqual(["lesson l / m: an option is empty"]);
    expect(mc("p", ["a", 1])).toEqual(["lesson l / m: an option is empty"]);
    expect(mc(" ", ["a", "b"])).toEqual(["lesson l / m: prompt is empty"]);
    expect(mc("p", ["a", "b"], 1.5)).toEqual(["lesson l / m: answer 1.5 is not an option index"]);
  });

  it("reports empty answers and vocabulary", () => {
    expect(raw({ kind: "fill-blank", id: "f", sentence: "a ___", answers: [] })).toEqual(["lesson l / f: needs non-empty answers"]);
    expect(raw({ kind: "fill-blank", id: "f", sentence: "a ___", answers: [" "] })).toEqual(["lesson l / f: needs non-empty answers"]);
    expect(raw({ kind: "vocabulary", id: "v", term: " ", translation: "b" })).toEqual(["lesson l / v: term is empty"]);
    expect(raw({ kind: "vocabulary", id: "v", term: "a", translation: "b", example: { text: "x" } })).toEqual([
      "lesson l / v: example needs text and translation",
    ]);
  });

  it("reports malformed data instead of throwing", () => {
    expect(raw({ kind: "listening", id: "x" })).toEqual(['lesson l / x: unknown kind "listening"']);
    expect(raw({ kind: "vocabulary", id: "v", term: null, translation: "b" })).toEqual(["lesson l / v: term is empty"]);
    expect(raw({ kind: "multiple-choice", id: "m", prompt: "p", answer: 0 })).toEqual([
      "lesson l / m: needs at least two options",
      "lesson l / m: answer 0 is not an option index",
    ]);
    expect(raw({ kind: "fill-blank", id: "f", sentence: null })).toEqual([
      "lesson l / f: sentence needs exactly one ___",
      "lesson l / f: needs non-empty answers",
    ]);
    expect(raw(null)).toEqual(["lesson l: an exercise is not an object"]);
    expect(validateUnits(null as unknown as Unit[])).toEqual(["units is not a list"]);
  });
});

describe("isFillBlankCorrect", () => {
  it("ignores case, extra spaces and a trailing full stop", () => {
    const exercise = { answers: ["heiße", "heisse"] };
    expect(isFillBlankCorrect(exercise, "  Heiße ")).toBe(true);
    expect(isFillBlankCorrect(exercise, "heisse.")).toBe(true);
  });

  it("accepts a Turkish keyboard capital İ, decomposed umlauts and invisible characters", () => {
    expect(isFillBlankCorrect({ answers: ["ich"] }, "İch")).toBe(true);
    expect(isFillBlankCorrect({ answers: ["Grüße"] }, "Gru\u0308ße")).toBe(true);
    expect(isFillBlankCorrect({ answers: ["gut"] }, "g\u200But")).toBe(true);
  });

  it("rejects wrong and empty answers", () => {
    const exercise = { answers: ["heiße"] };
    expect(isFillBlankCorrect(exercise, "heißt")).toBe(false);
    expect(isFillBlankCorrect(exercise, "   ")).toBe(false);
    expect(isFillBlankCorrect(exercise, ".")).toBe(false);
  });
});

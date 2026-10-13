import { describe, expect, it } from "vitest";
import { findLesson, units } from "@/content";
import type { Unit } from "@/lib/lessons/types";
import { isFillBlankCorrect, validateUnits } from "@/lib/lessons/validate";

describe("lesson content", () => {
  it("has no malformed units, lessons or exercises", () => {
    expect(validateUnits(units)).toEqual([]);
  });

  it("finds a lesson by id", () => {
    expect(findLesson("de-a1-u1-l2")?.lesson.title).toBe("Adın ve nereli olduğun");
    expect(findLesson("nope")).toBeUndefined();
  });
});

describe("validateUnits", () => {
  const unit = (exercises: Unit["lessons"][number]["exercises"]): Unit => ({
    id: "u",
    language: "de",
    level: "A1",
    explainedIn: "tr",
    title: "t",
    lessons: [{ id: "l", title: "t", goal: "g", minutes: 5, exercises }],
  });

  it("reports an answer index outside the options", () => {
    const problems = validateUnits([unit([{ kind: "multiple-choice", id: "m", prompt: "p", options: ["a", "b"], answer: 2 }])]);
    expect(problems).toEqual(["lesson l / m: answer 2 is not an option index"]);
  });

  it("reports a sentence without exactly one gap", () => {
    const problems = validateUnits([unit([{ kind: "fill-blank", id: "f", sentence: "no gap", answers: ["x"] }])]);
    expect(problems).toEqual(["lesson l / f: sentence needs exactly one ___"]);
  });

  it("reports duplicate ids", () => {
    const problems = validateUnits([
      unit([
        { kind: "vocabulary", id: "v", term: "a", translation: "b" },
        { kind: "vocabulary", id: "v", term: "c", translation: "d" },
      ]),
    ]);
    expect(problems).toEqual(['lesson l / v: duplicate id "v"']);
  });

  it("reports an id reused across levels", () => {
    const problems = validateUnits([unit([{ kind: "vocabulary", id: "l", term: "a", translation: "b" }])]);
    expect(problems).toEqual(['lesson l / l: duplicate id "l"']);
  });

  it("reports empty units and lessons and bad minutes", () => {
    const base = unit([]);
    expect(validateUnits([{ ...base, lessons: [] }])).toEqual(["unit u: no lessons"]);
    expect(validateUnits([{ ...base, id: " " }])).toContain("unit  : empty id");
    const lesson = { ...base.lessons[0], minutes: Number.NaN };
    expect(validateUnits([{ ...base, lessons: [lesson] }])).toEqual([
      "lesson l: no exercises",
      "lesson l: minutes must be positive",
    ]);
  });

  it("reports multiple choice with too few, repeated or non-integer options", () => {
    const mc = (options: string[], answer: number) =>
      validateUnits([unit([{ kind: "multiple-choice", id: "m", prompt: "p", options, answer }])]);
    expect(mc(["a"], 0)).toEqual(["lesson l / m: needs at least two options"]);
    expect(mc(["a", "a"], 0)).toEqual(["lesson l / m: options repeat"]);
    expect(mc(["a", "b"], 1.5)).toEqual(["lesson l / m: answer 1.5 is not an option index"]);
  });

  it("reports two gaps, a too-long gap and empty answers", () => {
    const fb = (sentence: string, answers: string[]) =>
      validateUnits([unit([{ kind: "fill-blank", id: "f", sentence, answers }])]);
    expect(fb("a ___ b ___", ["x"])).toEqual(["lesson l / f: sentence needs exactly one ___"]);
    expect(fb("a ____ b", ["x"])).toEqual(["lesson l / f: sentence needs exactly one ___"]);
    expect(fb("a ___ b", [])).toEqual(["lesson l / f: needs non-empty answers"]);
    expect(fb("a ___ b", [" "])).toEqual(["lesson l / f: needs non-empty answers"]);
  });

  it("reports an empty vocabulary term", () => {
    const problems = validateUnits([unit([{ kind: "vocabulary", id: "v", term: " ", translation: "b" }])]);
    expect(problems).toEqual(["lesson l / v: term and translation are required"]);
  });

  it("reports an unknown exercise kind instead of crashing", () => {
    const listening = { kind: "listening", id: "x" } as unknown as Unit["lessons"][number]["exercises"][number];
    expect(validateUnits([unit([listening])])).toEqual(['lesson l / x: unknown kind "listening"']);
  });
});

describe("isFillBlankCorrect", () => {
  const exercise = { answers: ["heiße", "heisse"] };

  it("ignores case and extra spaces", () => {
    expect(isFillBlankCorrect(exercise, "  Heiße ")).toBe(true);
    expect(isFillBlankCorrect(exercise, "heisse")).toBe(true);
  });

  it("rejects wrong and empty answers", () => {
    expect(isFillBlankCorrect(exercise, "heißt")).toBe(false);
    expect(isFillBlankCorrect(exercise, "   ")).toBe(false);
  });
});

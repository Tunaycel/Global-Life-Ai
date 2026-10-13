// Shape of the lesson content in src/content/. A unit is a few short lessons;
// a lesson is a list of exercises the player shows one at a time.

import type { Locale } from "@/lib/i18n";

export type LessonLanguage = "de" | "en";

export type CefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

/** A word or phrase to learn, with an optional example sentence. */
export interface VocabularyExercise {
    kind: "vocabulary";
    id: string;
    term: string;
    translation: string;
    example?: { text: string; translation: string };
}

/** One correct option out of several. `answer` is the index into `options`. */
export interface MultipleChoiceExercise {
    kind: "multiple-choice";
    id: string;
    prompt: string;
    options: string[];
    answer: number;
    explanation?: string;
}

/** A sentence with one `___` gap. Any of `answers` counts as correct. */
export interface FillBlankExercise {
    kind: "fill-blank";
    id: string;
    sentence: string;
    answers: string[];
    translation?: string;
    hint?: string;
}

// Listening and speaking join this union when audio lands (#27).
export type Exercise = VocabularyExercise | MultipleChoiceExercise | FillBlankExercise;

export interface Lesson {
    id: string;
    title: string;
    goal: string;
    minutes: number;
    exercises: Exercise[];
}

export interface Unit {
    id: string;
    language: LessonLanguage;
    level: CefrLevel;
    /** Language of titles, prompts, translations and explanations. */
    explainedIn: Locale;
    title: string;
    lessons: Lesson[];
}

export const BLANK = "___";

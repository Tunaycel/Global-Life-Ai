// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { LocaleProvider } from "@/components/providers/LocaleProvider";
import type { Lesson, Unit } from "@/lib/lessons/types";
import LessonPlayer from "./LessonPlayer";

const lesson: Lesson = {
    id: "test-lesson",
    title: "Test lesson",
    goal: "Check the player",
    minutes: 5,
    exercises: [
        { kind: "vocabulary", id: "v1", term: "Hallo", translation: "Merhaba" },
        { kind: "multiple-choice", id: "q1", prompt: "Hallo ne demek?", options: ["Merhaba", "Hoşça kal"], answer: 0 },
        { kind: "fill-blank", id: "q2", sentence: "Ich ___ Anna.", answers: ["bin"] },
    ],
};

const unit: Unit = {
    id: "test-unit",
    language: "de",
    level: "A1",
    explainedIn: "tr",
    title: "Test unit",
    lessons: [lesson],
};

// The page renders in Turkish by default, so the buttons are found by their Turkish text.
function renderPlayer() {
    render(
        <LocaleProvider>
            <LessonPlayer unit={unit} lesson={lesson} />
        </LocaleProvider>,
    );
}

function passVocabulary() {
    fireEvent.click(screen.getByRole("button", { name: "Anlamını göster" }));
    fireEvent.click(screen.getByRole("button", { name: "Devam" }));
}

function answerQuestions({ pickCorrect, typed }: { pickCorrect: boolean; typed: string }) {
    fireEvent.click(screen.getByRole("button", { name: pickCorrect ? /Merhaba$/ : /Hoşça kal$/ }));
    fireEvent.click(screen.getByRole("button", { name: "Devam" }));
    fireEvent.change(screen.getByRole("textbox", { name: "Cevabın" }), { target: { value: typed } });
    fireEvent.click(screen.getByRole("button", { name: "Kontrol et" }));
    fireEvent.click(screen.getByRole("button", { name: "Devam" }));
}

afterEach(cleanup);

describe("LessonPlayer", () => {
    it("scores only the questions, not the vocabulary cards", () => {
        renderPlayer();
        passVocabulary();
        answerQuestions({ pickCorrect: true, typed: "falsch" });

        expect(screen.getByText("1 / 2")).toBeTruthy();
        expect(screen.getByText("1 yeni kelime öğrendin")).toBeTruthy();
    });

    it("moves one step when Continue is clicked twice before the screen updates", () => {
        renderPlayer();
        fireEvent.click(screen.getByRole("button", { name: "Anlamını göster" }));
        const next = screen.getByRole("button", { name: "Devam" });
        act(() => {
            next.click();
            next.click();
        });

        expect(screen.getByText("Hallo ne demek?")).toBeTruthy();
        expect(screen.getByText("2 / 3")).toBeTruthy();
    });

    it("starts clean after Start again", () => {
        renderPlayer();
        passVocabulary();
        answerQuestions({ pickCorrect: true, typed: "bin" });
        expect(screen.getByText("2 / 2")).toBeTruthy();

        fireEvent.click(screen.getByRole("button", { name: "Tekrar başla" }));
        expect(screen.getByRole("button", { name: "Anlamını göster" })).toBeTruthy();
        expect(screen.queryByText("Merhaba")).toBeNull();

        passVocabulary();
        answerQuestions({ pickCorrect: false, typed: "falsch" });
        expect(screen.getByText("0 / 2")).toBeTruthy();
    });
});

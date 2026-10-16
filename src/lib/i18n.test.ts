import { describe, expect, it } from "vitest";
import { t, tPlural } from "@/lib/i18n";

describe("t", () => {
  it("returns the text for the requested locale", () => {
    expect(t("nav", "login", "tr")).toBe("Giriş Yap");
    expect(t("nav", "login", "pl")).toBe("Zaloguj się");
  });

  it("falls back to the key when the section or the key is unknown", () => {
    expect(t("nope", "login", "en")).toBe("login");
    expect(t("nav", "nope", "en")).toBe("nope");
  });
});

describe("tPlural", () => {
  it("picks the singular for one item", () => {
    expect(tPlural("lesson", "words", 1, "en")).toBe("word");
    expect(tPlural("lesson", "words", 1, "de")).toBe("Wort");
    expect(tPlural("lesson", "questions", 1, "pl")).toBe("pytanie");
  });

  it("uses the Polish 2-4 and 5+ forms", () => {
    expect(tPlural("lesson", "words", 2, "pl")).toBe("słowa");
    expect(tPlural("lesson", "words", 22, "pl")).toBe("słowa");
    expect(tPlural("lesson", "words", 5, "pl")).toBe("słów");
    expect(tPlural("lesson", "words", 12, "pl")).toBe("słów");
  });

  it("keeps Turkish without a plural suffix and never borrows English", () => {
    expect(tPlural("lesson", "words", 1, "tr")).toBe("kelime");
    expect(tPlural("lesson", "words", 7, "tr")).toBe("kelime");
  });

  it("uses the plural for zero and many in English", () => {
    expect(tPlural("lesson", "words", 0, "en")).toBe("words");
    expect(tPlural("lesson", "wordsLearned", 3, "en")).toBe("new words learned");
  });
});

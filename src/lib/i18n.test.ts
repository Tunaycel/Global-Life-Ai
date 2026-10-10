import { describe, expect, it } from "vitest";
import { t } from "@/lib/i18n";

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

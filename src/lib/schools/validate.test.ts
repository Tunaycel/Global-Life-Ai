import { describe, expect, it } from "vitest";
import { programs, universities } from "@/content/schools";
import type { Program, University } from "@/lib/schools/types";
import { validateSchools } from "@/lib/schools/validate";

const today = new Date("2026-10-13T12:00:00Z");

// Made-up records that only exercise the validator; they are not shown to users.
const university: University = {
  id: "example-university",
  name: "Example University",
  country: "DE",
  state: "Baden-Württemberg",
  city: "Stuttgart",
  type: "university",
  website: "https://example.org",
  internationalOffice: { email: "international@example.org", url: "https://example.org/international" },
  sourceUrl: "https://example.org/about",
  verifiedAt: "2026-10-01",
};

const program: Program = {
  id: "example-msc-cs",
  universityId: "example-university",
  name: "Computer Science (M.Sc.)",
  degree: "master",
  field: "computer-science",
  languages: ["en"],
  durationSemesters: 4,
  fees: { currency: "EUR", semesterContribution: 200, tuitionPerSemesterNonEU: 1500, tuitionPerSemesterEU: 0, sourceUrl: "https://example.org/fees", verifiedAt: "2026-09-20" },
  requirements: {
    gradeCutoff: 2.5,
    language: [
      [
        { test: "IELTS", minScore: 6.5, minSectionScore: 6 },
        { test: "TOEFL iBT", minScore: 90 },
      ],
      [{ test: "CEFR", minLevel: "A2", language: "de" }],
    ],
    other: ["Bachelor's degree in computer science"],
  },
  admission: {
    applyVia: "uni-assist-vpd",
    deadlines: [
      { intake: "winter", applicants: "non-eu", opens: "02-01", closes: "05-31" },
      { intake: "winter", applicants: "all", closes: "07-15" },
    ],
    sourceUrl: "https://example.org/apply",
    verifiedAt: "2026-10-01",
  },
  url: "https://example.org/msc-cs",
  sourceUrl: "https://example.org/msc-cs",
  verifiedAt: "2026-10-01",
};

// Overrides may be malformed on purpose, as data from JSON could be.
const check = (u: object = {}, p: object = {}, on = today) =>
  validateSchools([{ ...university, ...u }] as University[], [{ ...program, ...p }] as Program[], on);
const P = "program example-msc-cs";
const U = "university example-university";

describe("school data", () => {
  it("has no malformed universities or programs", () => {
    expect(validateSchools(universities, programs)).toEqual([]);
  });
});

describe("validateSchools", () => {
  it("accepts a complete record", () => {
    expect(check()).toEqual([]);
  });

  it("accepts unknown fees, language requirement, admission and duration left out", () => {
    const minimal: Program = { ...program, requirements: {} };
    delete minimal.fees;
    delete minimal.durationSemesters;
    delete minimal.admission;
    expect(validateSchools([university], [minimal], today)).toEqual([]);
  });

  it("tells an unknown language requirement apart from none", () => {
    expect(check({}, { requirements: { language: [] } })).toEqual([]);
    expect(check({}, { requirements: { language: [[]] } })).toEqual([`${P}: requirements: each language group must list at least one test`]);
    expect(check({}, { requirements: { language: [{ test: "IELTS", minScore: 6 }] } })).toEqual([
      `${P}: requirements: each language group must list at least one test`,
    ]);
  });

  it("requires an https source and a real verification date", () => {
    expect(check({ sourceUrl: "http://example.org" })).toEqual([`${U}: sourceUrl must be an https link`]);
    for (const url of [
      "not a url", "https://", "https://localhost", "https://.", "https://1.2.3.4", "https://u.de ", "https://u.de\n",
      "https://user:pw@example.org", "javascript:alert(1)",
    ]) {
      expect(check({}, { sourceUrl: url })).toEqual([`${P}: sourceUrl must be an https link`]);
    }
    expect(check({}, { sourceUrl: "HTTPS://EXAMPLE.ORG/x" })).toEqual([]);
    expect(check({}, { verifiedAt: "2026-02-30" })).toEqual([`${P}: verifiedAt must be a date as YYYY-MM-DD`]);
    expect(check({}, { verifiedAt: undefined })).toEqual([`${P}: verifiedAt must be a date as YYYY-MM-DD`]);
  });

  it("accepts a record verified today in Türkiye, rejects one dated after tomorrow", () => {
    const istanbulAfterMidnight = new Date("2026-10-12T22:30:00Z");
    expect(check({}, { verifiedAt: "2026-10-13" }, istanbulAfterMidnight)).toEqual([]);
    expect(check({}, { verifiedAt: "2026-10-14" })).toEqual([]);
    expect(check({}, { verifiedAt: "2026-10-15" })).toEqual([`${P}: verifiedAt is in the future`]);
  });

  it("reports unknown universities, duplicate and malformed ids", () => {
    expect(check({}, { universityId: "nope" })).toEqual([`${P}: unknown university "nope"`]);
    expect(check({}, { id: "example-university" })).toEqual(['program example-university: duplicate id "example-university"']);
    expect(validateSchools([university, university], [], today)).toEqual([`${U}: duplicate id "example-university"`]);
    expect(check({ id: "Example" })).toEqual([
      "university Example: id must be lowercase letters, digits and dashes",
      `${P}: unknown university "example-university"`,
    ]);
  });

  it("reports out-of-range language scores and grades", () => {
    const language = (...group: object[]) => check({}, { requirements: { language: [group] } });
    expect(language({ test: "IELTS", minScore: 6.3 })).toEqual([`${P}: requirements: IELTS score 6.3 is not between 0 and 9 in steps of 0.5`]);
    expect(language({ test: "IELTS", minScore: 6.49999 })).toEqual([
      `${P}: requirements: IELTS score 6.49999 is not between 0 and 9 in steps of 0.5`,
    ]);
    expect(language({ test: "IELTS", minScore: "6.5" })).toEqual([`${P}: requirements: IELTS score 6.5 is not between 0 and 9 in steps of 0.5`]);
    expect(language({ test: "IELTS", minScore: 6, minSectionScore: 6.5 })).toEqual([
      `${P}: requirements: IELTS section score 6.5 cannot fit an overall score of 6`,
    ]);
    expect(language({ test: "TOEFL iBT", minScore: 80, minSectionScore: 21 })).toEqual([
      `${P}: requirements: TOEFL iBT section score 21 cannot fit an overall score of 80`,
    ]);
    expect(language({ test: "IELTS", minScore: 0.3, minSectionScore: 6 })).toEqual([
      `${P}: requirements: IELTS score 0.3 is not between 0 and 9 in steps of 0.5`,
    ]);
    expect(language({ test: "TOEFL iBT", minScore: 90, minSectionScore: 31 })).toEqual([
      `${P}: requirements: TOEFL iBT section score 31 is not between 0 and 30 in steps of 1`,
    ]);
    expect(language({ test: "TOEFL iBT", minScore: 90.5 })).toEqual([
      `${P}: requirements: TOEFL iBT score 90.5 is not between 0 and 120 in steps of 1`,
    ]);
    expect(language({ test: "TestDaF", minScore: 2 })).toEqual([`${P}: requirements: TestDaF score 2 is not between 3 and 5 in steps of 1`]);
    expect(language({ test: "TestDaF", minScore: 4, minSectionScore: 4 })).toEqual([`${P}: requirements: TestDaF: unknown field "minSectionScore"`]);
    expect(language({ test: "DSH", minScore: 3 })).toEqual([]);
    expect(language({ test: "CEFR", minLevel: "D1", language: "fr" })).toEqual([
      `${P}: requirements: CEFR level "D1" is unknown`,
      `${P}: requirements: CEFR language "fr" is unknown`,
    ]);
    expect(language({ test: "Duolingo", minScore: 120 })).toEqual([`${P}: requirements: unknown language test "Duolingo"`]);
    expect(language({ test: "__proto__", minScore: 1 })).toEqual([`${P}: requirements: unknown language test "__proto__"`]);
    expect(language({ test: "IELTS", minScore: 6.5 }, { test: "IELTS", minScore: 7 })).toEqual([
      `${P}: requirements: IELTS listed twice in one group`,
    ]);
    for (const gradeCutoff of [1, 4]) expect(check({}, { requirements: { gradeCutoff } })).toEqual([]);
    expect(check({}, { requirements: { gradeCutoff: 0.7 } })).toEqual([`${P}: requirements: gradeCutoff must be between 1.0 and 4.0`]);
  });

  it("reports bad fees", () => {
    expect(check({}, { fees: { currency: "USD", tuitionPerSemesterNonEU: -1 } })).toEqual([
      `${P}: fees: unknown currency "USD"`,
      `${P}: fees: tuitionPerSemesterNonEU must be zero or more`,
    ]);
    expect(check({}, { fees: { currency: "PLN", tuitionPerSemesterNonEU: 0 } })).toEqual([`${P}: fees: German programs charge in EUR`]);
    expect(check({}, { fees: { currency: "EUR" } })).toEqual([`${P}: fees: leave fees out instead of listing no amounts`]);
    expect(check({}, { fees: { currency: "EUR", fee: 100 } })).toEqual([
      `${P}: fees: unknown field "fee"`,
      `${P}: fees: leave fees out instead of listing no amounts`,
    ]);
  });

  it("reports bad admission details", () => {
    const admission = (a: object) => check({}, { admission: { deadlines: [], rolling: true, ...a } });
    expect(admission({})).toEqual([]);
    expect(admission({ rolling: undefined })).toEqual([`${P}: admission: list deadlines or set rolling`]);
    expect(admission({ deadlines: [{ intake: "winter", applicants: "all", closes: "07-15" }] })).toEqual([
      `${P}: admission: rolling admission lists no deadlines`,
    ]);
    expect(admission({ applyVia: "email" })).toEqual([`${P}: admission: unknown applyVia "email"`]);
    expect(admission({ rolling: undefined, deadlines: [{ intake: "winter", applicants: "all", closes: "02-29" }] })).toEqual([
      `${P}: deadline: closes "02-29" must be a day as MM-DD`,
    ]);
    expect(admission({ rolling: undefined, deadlines: [{ intake: "winter", applicants: "all", opens: "13-01", closes: "07-15" }] })).toEqual([
      `${P}: deadline: opens "13-01" must be a day as MM-DD`,
    ]);
    expect(
      admission({
        rolling: undefined,
        deadlines: [
          { intake: "winter", applicants: "all", closes: "05-31" },
          { intake: "winter", applicants: "all", closes: "06-15" },
        ],
      }),
    ).toEqual([`${P}: deadline: winter all listed twice`]);
    expect(admission({ rolling: undefined, deadlines: [{ intake: "winter", applicants: "eu", closes: "05-31" }] })).toEqual([
      `${P}: deadline: unknown applicants "eu"`,
    ]);
  });

  it("reports bad contact details, states and enums", () => {
    expect(check({ internationalOffice: { email: "not-an-email" } })).toEqual([`${U}: internationalOffice.email is not an email address`]);
    expect(check({ internationalOffice: { email: "a@b..de" } })).toEqual([`${U}: internationalOffice.email is not an email address`]);
    expect(check({ internationalOffice: { url: "http://example.org" } })).toEqual([`${U}: internationalOffice.url must be an https link`]);
    expect(check({ website: "http://example.org" })).toEqual([`${U}: website must be an https link`]);
    expect(check({ state: "Baden-Wuerttemberg" })).toEqual([`${U}: "Baden-Wuerttemberg" is not a German state as written in GERMAN_STATES`]);
    expect(check({ country: "FR" })).toEqual([`${U}: unknown country "FR"`]);
    expect(check({ adress: "x" })).toEqual([`${U}: unknown field "adress"`]);
    expect(check({}, { languages: [] })).toEqual([`${P}: languages must list at least one of en, de, pl`]);
    expect(check({}, { languages: [, ] })).toEqual([`${P}: languages must list at least one of en, de, pl`]);
    expect(check({}, { field: "astrology" })).toEqual([`${P}: unknown field "astrology"`]);
    expect(check({}, { durationSemesters: 3.5 })).toEqual([`${P}: durationSemesters must be a positive whole number`]);
  });

  it("checks a section source like a record source, and only when one is given", () => {
    expect(check({}, { fees: { currency: "EUR", semesterContribution: 200, sourceUrl: "https://example.org/fees" } })).toEqual([
      `${P}: fees: verifiedAt must be a date as YYYY-MM-DD`,
    ]);
    expect(check({}, { admission: { rolling: true, deadlines: [], verifiedAt: "2027-01-01" } })).toEqual([
      `${P}: admission: sourceUrl must be an https link`,
      `${P}: admission: verifiedAt is in the future`,
    ]);
  });

  it("reports malformed data instead of throwing", () => {
    expect(validateSchools([university], [program], new Date("nope"))).toEqual(["today is not a valid date"]);
    expect(validateSchools(null as unknown as University[], null as unknown as Program[], today)).toEqual([
      "universities is not a list",
      "programs is not a list",
    ]);
    expect(validateSchools([university], [null as unknown as Program], today)).toEqual(["a program is not an object"]);
    expect(check({}, { requirements: null, admission: 5, fees: 5 })).toEqual([
      `${P}: fees is not an object`,
      `${P}: requirements is not an object`,
      `${P}: admission is not an object`,
    ]);
    const hostile = JSON.parse('{"toString": 1}');
    expect(check({}, { field: hostile })).toEqual([`${P}: unknown field "{"toString":1}"`]);
  });
});

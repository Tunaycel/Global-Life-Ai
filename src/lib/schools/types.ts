// Shape of the school data in src/content/schools/. Every value shown to users
// must come from an official page: anything not verified stays undefined and the
// UI says it is unknown, rather than showing an estimate.

import type { CefrLevel } from "@/lib/lessons/types";

export type CountryCode = "DE" | "PL";

export const GERMAN_STATES = [
    "Baden-Württemberg", "Bayern", "Berlin", "Brandenburg", "Bremen", "Hamburg", "Hessen",
    "Mecklenburg-Vorpommern", "Niedersachsen", "Nordrhein-Westfalen", "Rheinland-Pfalz",
    "Saarland", "Sachsen", "Sachsen-Anhalt", "Schleswig-Holstein", "Thüringen",
] as const;

export type GermanState = (typeof GERMAN_STATES)[number];

export type Degree = "bachelor" | "master";

export type TeachingLanguage = "en" | "de" | "pl";

export type Field =
    | "computer-science"
    | "data-science"
    | "engineering"
    | "natural-sciences"
    | "mathematics"
    | "business"
    | "economics"
    | "social-sciences"
    | "health"
    | "architecture"
    | "arts-humanities"
    | "law";

/** University, or university of applied sciences (Fachhochschule / Hochschule). */
export type InstitutionType = "university" | "applied-sciences";

/** Where a record was checked, and when (YYYY-MM-DD). */
export interface Verified {
    sourceUrl: string;
    verifiedAt: string;
}

/**
 * Set both when a section was checked on a different page, or on a different
 * day, from its program; otherwise the program's sourceUrl and verifiedAt apply.
 */
export type SectionSource = Partial<Verified>;

export interface University extends Verified {
    id: string;
    name: string;
    country: CountryCode;
    /** German Bundesland (one of GERMAN_STATES) or Polish voivodeship; fees can depend on it. */
    state: string;
    city: string;
    type: InstitutionType;
    website: string;
    internationalOffice?: { email?: string; url?: string };
}

/** One accepted proof of language skill. */
export type LanguageRequirement =
    /** Overall band, and optionally the lowest band allowed in each section. */
    | { test: "IELTS"; minScore: number; minSectionScore?: number }
    | { test: "TOEFL iBT"; minScore: number; minSectionScore?: number }
    /** TestDaF level (TDN 3-5) required in every section. */
    | { test: "TestDaF"; minScore: number }
    /** DSH level 1-3. */
    | { test: "DSH"; minScore: number }
    /** Any certificate at this CEFR level, as the program words it. */
    | { test: "CEFR"; minLevel: CefrLevel; language: TeachingLanguage };

export type LanguageTest = LanguageRequirement["test"];

export interface Fees extends SectionSource {
    currency: "EUR" | "PLN";
    /** Semesterbeitrag: admin fee and transit ticket, paid by every student. */
    semesterContribution?: number;
    /** Tuition per semester for students from outside the EU; 0 when there is none. */
    tuitionPerSemesterNonEU?: number;
    /** Tuition per semester for EU students, e.g. for continuing-education master's; 0 when there is none. */
    tuitionPerSemesterEU?: number;
    note?: string;
}

export interface Requirements extends SectionSource {
    /**
     * Worst accepted grade on the German scale (1.0 best, 4.0 pass), after
     * conversion: an applicant qualifies with a grade at or below this number.
     */
    gradeCutoff?: number;
    /**
     * Each inner list is a set of alternatives (any one is enough); every inner
     * list must be met. [[IELTS 6.5, TOEFL 90], [German A2]] means English and
     * German. Undefined when the page does not say; [] when none is required.
     */
    language?: LanguageRequirement[][];
    /** Other requirements in the program's own words, e.g. "180 ECTS in computer science". */
    other?: string[];
}

export interface Deadline {
    intake: "winter" | "summer";
    /** Who the dates apply to; programs often close earlier for non-EU applicants. */
    applicants: "non-eu" | "all";
    /** First and last day to apply, as MM-DD; they repeat every year. */
    opens?: string;
    closes: string;
}

export interface Admission extends SectionSource {
    /** uni-assist-vpd: get a VPD from uni-assist, then apply on the university portal. */
    applyVia?: "uni-assist" | "uni-assist-vpd" | "direct";
    /** Applications are accepted all year; `deadlines` must then be empty. */
    rolling?: boolean;
    deadlines: Deadline[];
}

export interface Program extends Verified {
    id: string;
    universityId: string;
    name: string;
    degree: Degree;
    field: Field;
    languages: TeachingLanguage[];
    durationSemesters?: number;
    /** Campus city when it differs from the university's main city. */
    city?: string;
    fees?: Fees;
    requirements: Requirements;
    /** Undefined when deadlines and how to apply are not verified yet. */
    admission?: Admission;
    url: string;
}

/** Score ranges each test can take, used by the validator and the match engine. */
export const SCORE_RANGES: Record<Exclude<LanguageTest, "CEFR">, { min: number; max: number; step: number }> = {
    IELTS: { min: 0, max: 9, step: 0.5 },
    "TOEFL iBT": { min: 0, max: 120, step: 1 },
    TestDaF: { min: 3, max: 5, step: 1 },
    DSH: { min: 1, max: 3, step: 1 },
};

/** Highest section score each test reports, for minSectionScore. */
export const SECTION_SCORE_MAX: Partial<Record<LanguageTest, number>> = { IELTS: 9, "TOEFL iBT": 30 };

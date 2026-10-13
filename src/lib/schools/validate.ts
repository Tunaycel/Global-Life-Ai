import { GERMAN_STATES, SCORE_RANGES, SECTION_SCORE_MAX, type Program, type University } from "./types";

// Checks school data the types cannot: ranges, dates, links between programs and
// universities, and that every record says where it was verified. Reads input as
// unknown and reports problems instead of throwing, so it also works on JSON.

const ID_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;

const COUNTRIES = ["DE", "PL"];
const DEGREES = ["bachelor", "master"];
const LANGUAGES = ["en", "de", "pl"];
const INSTITUTION_TYPES = ["university", "applied-sciences"];
const FIELDS = [
    "computer-science", "data-science", "engineering", "natural-sciences", "mathematics", "business",
    "economics", "social-sciences", "health", "architecture", "arts-humanities", "law",
];
const CEFR_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];
const APPLY_ROUTES = ["uni-assist", "uni-assist-vpd", "direct"];

const UNIVERSITY_KEYS = ["id", "name", "country", "state", "city", "type", "website", "internationalOffice", "sourceUrl", "verifiedAt"];
const PROGRAM_KEYS = [
    "id", "universityId", "name", "degree", "field", "languages", "durationSemesters", "city", "fees",
    "requirements", "admission", "url", "sourceUrl", "verifiedAt",
];
const SOURCE_KEYS = ["sourceUrl", "verifiedAt"];
const FEE_KEYS = ["currency", "semesterContribution", "tuitionPerSemesterNonEU", "tuitionPerSemesterEU", "note", ...SOURCE_KEYS];
const REQUIREMENT_KEYS = ["gradeCutoff", "language", "other", ...SOURCE_KEYS];
const ADMISSION_KEYS = ["applyVia", "rolling", "deadlines", ...SOURCE_KEYS];
const DEADLINE_KEYS = ["intake", "applicants", "opens", "closes"];

type Fields = Record<string, unknown>;
const isRecord = (v: unknown): v is Fields => typeof v === "object" && v !== null && !Array.isArray(v);
const isText = (v: unknown): v is string => typeof v === "string" && v.trim() !== "";
const isOneOf = (v: unknown, options: readonly string[]) => typeof v === "string" && options.includes(v);
const isNumber = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);
/** Array.from fills holes in sparse arrays with undefined, so every() sees them. */
const items = (v: unknown[]): unknown[] => Array.from(v);

/** Prints any value for a message without throwing, even for objects with a broken toString. */
function show(v: unknown): string {
    if (typeof v === "string") return v;
    if (typeof v === "number" || typeof v === "boolean" || v == null) return `${v}`;
    try {
        return JSON.stringify(v) ?? typeof v;
    } catch {
        return typeof v;
    }
}

const HOST_PATTERN = /^([a-z0-9-]+\.)+[a-z][a-z0-9-]*$/i;

/** An https link to a domain name (not an IP address), without spaces, user name or password. */
function isHttpsUrl(v: unknown): boolean {
    if (typeof v !== "string" || /\s/.test(v) || !/^https:\/\//i.test(v)) return false;
    try {
        const url = new URL(v);
        return HOST_PATTERN.test(url.hostname) && !url.username && !url.password;
    } catch {
        return false;
    }
}

/** A real calendar date written as YYYY-MM-DD. */
function isDay(v: unknown): v is string {
    if (typeof v !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
    const date = new Date(`${v}T00:00:00Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === v;
}

/** A day that exists every year, written as MM-DD (so no 02-29). */
function isMonthDay(v: unknown): boolean {
    return typeof v === "string" && /^\d{2}-\d{2}$/.test(v) && v !== "02-29" && isDay(`2025-${v}`);
}

function unknownKeys(record: Fields, allowed: string[], where: string): string[] {
    return Object.keys(record).filter((k) => !allowed.includes(k)).map((k) => `${where}: unknown field "${k}"`);
}

export function validateSchools(universities: readonly University[], programs: readonly Program[], today = new Date()): string[] {
    const problems: string[] = [];
    const ids = new Set<string>();
    const universityCountries = new Map<string, unknown>();
    // A record checked today in Türkiye can carry tomorrow's UTC date, so allow one day ahead.
    if (!(today instanceof Date) || Number.isNaN(today.getTime())) return ["today is not a valid date"];
    const latestDay = new Date(today.getTime() + 86_400_000).toISOString().slice(0, 10);
    const checkDay = (value: unknown, where: string) => {
        if (!isDay(value)) problems.push(`${where}: verifiedAt must be a date as YYYY-MM-DD`);
        else if (value > latestDay) problems.push(`${where}: verifiedAt is in the future`);
    };
    const checkSectionSource = (section: unknown, where: string) => {
        if (!isRecord(section) || (section.sourceUrl === undefined && section.verifiedAt === undefined)) return;
        if (!isHttpsUrl(section.sourceUrl)) problems.push(`${where}: sourceUrl must be an https link`);
        checkDay(section.verifiedAt, where);
    };

    const claim = (id: unknown, where: string): boolean => {
        if (typeof id !== "string" || !ID_PATTERN.test(id)) {
            problems.push(`${where}: id must be lowercase letters, digits and dashes`);
            return false;
        }
        if (ids.has(id)) {
            problems.push(`${where}: duplicate id "${id}"`);
            return false;
        }
        ids.add(id);
        return true;
    };
    const checkVerified = (record: Fields, where: string) => {
        if (!isHttpsUrl(record.sourceUrl)) problems.push(`${where}: sourceUrl must be an https link`);
        checkDay(record.verifiedAt, where);
    };
    const requireText = (record: Fields, keys: string[], where: string) => {
        for (const key of keys) if (!isText(record[key])) problems.push(`${where}: ${key} is empty`);
    };

    if (!Array.isArray(universities)) problems.push("universities is not a list");
    else {
        for (const university of items(universities)) {
            if (!isRecord(university)) {
                problems.push("a university is not an object");
                continue;
            }
            const where = `university ${show(university.id)}`;
            if (claim(university.id, where)) universityCountries.set(university.id as string, university.country);
            problems.push(...unknownKeys(university, UNIVERSITY_KEYS, where));
            requireText(university, ["name", "state", "city"], where);
            if (!isOneOf(university.country, COUNTRIES)) problems.push(`${where}: unknown country "${show(university.country)}"`);
            else if (university.country === "DE" && isText(university.state) && !isOneOf(university.state, GERMAN_STATES)) {
                problems.push(`${where}: "${university.state}" is not a German state as written in GERMAN_STATES`);
            }
            if (!isOneOf(university.type, INSTITUTION_TYPES)) problems.push(`${where}: unknown type "${show(university.type)}"`);
            if (!isHttpsUrl(university.website)) problems.push(`${where}: website must be an https link`);
            const office = university.internationalOffice;
            if (office !== undefined) {
                if (!isRecord(office)) problems.push(`${where}: internationalOffice is not an object`);
                else {
                    problems.push(...unknownKeys(office, ["email", "url"], `${where}: internationalOffice`));
                    if (office.email !== undefined && !(typeof office.email === "string" && EMAIL_PATTERN.test(office.email))) {
                        problems.push(`${where}: internationalOffice.email is not an email address`);
                    }
                    if (office.url !== undefined && !isHttpsUrl(office.url)) problems.push(`${where}: internationalOffice.url must be an https link`);
                }
            }
            checkVerified(university, where);
        }
    }

    if (!Array.isArray(programs)) {
        problems.push("programs is not a list");
        return problems;
    }
    for (const program of items(programs)) {
        if (!isRecord(program)) {
            problems.push("a program is not an object");
            continue;
        }
        const where = `program ${show(program.id)}`;
        claim(program.id, where);
        problems.push(...unknownKeys(program, PROGRAM_KEYS, where));
        requireText(program, ["name"], where);
        const universityId = program.universityId;
        if (typeof universityId !== "string" || !universityCountries.has(universityId)) {
            problems.push(`${where}: unknown university "${show(universityId)}"`);
        }
        if (!isOneOf(program.degree, DEGREES)) problems.push(`${where}: unknown degree "${show(program.degree)}"`);
        if (!isOneOf(program.field, FIELDS)) problems.push(`${where}: unknown field "${show(program.field)}"`);
        const languages = program.languages;
        if (!Array.isArray(languages) || !languages.length || !items(languages).every((l) => isOneOf(l, LANGUAGES))) {
            problems.push(`${where}: languages must list at least one of ${LANGUAGES.join(", ")}`);
        }
        const duration = program.durationSemesters;
        if (duration !== undefined && !(Number.isInteger(duration) && (duration as number) > 0)) {
            problems.push(`${where}: durationSemesters must be a positive whole number`);
        }
        if (program.city !== undefined && !isText(program.city)) problems.push(`${where}: city is empty`);
        if (!isHttpsUrl(program.url)) problems.push(`${where}: url must be an https link`);
        const country = typeof universityId === "string" ? universityCountries.get(universityId) : undefined;
        problems.push(...checkFees(program.fees, country).map((p) => `${where}: ${p}`));
        problems.push(...checkRequirements(program.requirements).map((p) => `${where}: ${p}`));
        problems.push(...checkAdmission(program.admission).map((p) => `${where}: ${p}`));
        checkSectionSource(program.fees, `${where}: fees`);
        checkSectionSource(program.requirements, `${where}: requirements`);
        checkSectionSource(program.admission, `${where}: admission`);
        checkVerified(program, where);
    }
    return problems;
}

function checkFees(fees: unknown, country: unknown): string[] {
    if (fees === undefined) return [];
    if (!isRecord(fees)) return ["fees is not an object"];
    const problems = unknownKeys(fees, FEE_KEYS, "fees");
    if (!isOneOf(fees.currency, ["EUR", "PLN"])) problems.push(`fees: unknown currency "${show(fees.currency)}"`);
    else if (country === "DE" && fees.currency !== "EUR") problems.push("fees: German programs charge in EUR");
    const amounts = ["semesterContribution", "tuitionPerSemesterNonEU", "tuitionPerSemesterEU"];
    for (const key of amounts) {
        const value = fees[key];
        if (value !== undefined && !(isNumber(value) && value >= 0)) problems.push(`fees: ${key} must be zero or more`);
    }
    if (amounts.every((key) => fees[key] === undefined)) problems.push("fees: leave fees out instead of listing no amounts");
    if (fees.note !== undefined && !isText(fees.note)) problems.push("fees: note is empty");
    return problems;
}

function checkRequirements(requirements: unknown): string[] {
    if (!isRecord(requirements)) return ["requirements is not an object"];
    const problems = unknownKeys(requirements, REQUIREMENT_KEYS, "requirements");
    const cutoff = requirements.gradeCutoff;
    if (cutoff !== undefined && !(isNumber(cutoff) && cutoff >= 1 && cutoff <= 4)) {
        problems.push("requirements: gradeCutoff must be between 1.0 and 4.0");
    }
    const groups = requirements.language;
    if (groups !== undefined) {
        if (!Array.isArray(groups)) problems.push("requirements: language must be a list of alternatives");
        else {
            for (const group of items(groups)) {
                if (!Array.isArray(group) || !group.length) {
                    problems.push("requirements: each language group must list at least one test");
                    continue;
                }
                const tests = new Set<string>();
                for (const requirement of items(group)) {
                    problems.push(...checkLanguageRequirement(requirement).map((p) => `requirements: ${p}`));
                    if (!isRecord(requirement)) continue;
                    const key = requirement.test === "CEFR" ? `CEFR ${show(requirement.language)}` : show(requirement.test);
                    if (tests.has(key)) problems.push(`requirements: ${key} listed twice in one group`);
                    tests.add(key);
                }
            }
        }
    }
    const other = requirements.other;
    if (other !== undefined && !(Array.isArray(other) && items(other).every(isText))) problems.push("requirements: other must list non-empty text");
    return problems;
}

const SECTIONS_IN_TOTAL: Record<string, number> = { IELTS: 1, "TOEFL iBT": 4 };

/** True when score is a whole number of steps above min, allowing for float rounding. */
function isOnStep(score: number, min: number, step: number): boolean {
    const steps = (score - min) / step;
    return Math.abs(steps - Math.round(steps)) < 1e-9;
}

function checkLanguageRequirement(requirement: unknown): string[] {
    if (!isRecord(requirement)) return ["a language requirement is not an object"];
    const test = requirement.test;
    if (test === "CEFR") {
        const problems = unknownKeys(requirement, ["test", "minLevel", "language"], "CEFR");
        if (!isOneOf(requirement.minLevel, CEFR_LEVELS)) problems.push(`CEFR level "${show(requirement.minLevel)}" is unknown`);
        if (!isOneOf(requirement.language, LANGUAGES)) problems.push(`CEFR language "${show(requirement.language)}" is unknown`);
        return problems;
    }
    if (typeof test !== "string" || !Object.hasOwn(SCORE_RANGES, test)) return [`unknown language test "${show(test)}"`];
    const name = test as keyof typeof SCORE_RANGES;
    const sectionMax = SECTION_SCORE_MAX[name];
    const problems = unknownKeys(requirement, sectionMax ? ["test", "minScore", "minSectionScore"] : ["test", "minScore"], name);
    const range = SCORE_RANGES[name];
    const score = requirement.minScore;
    const scoreValid = isNumber(score) && score >= range.min && score <= range.max && isOnStep(score, range.min, range.step);
    if (!scoreValid) problems.push(`${name} score ${show(score)} is not between ${range.min} and ${range.max} in steps of ${range.step}`);
    const section = requirement.minSectionScore;
    if (sectionMax !== undefined && section !== undefined) {
        if (!isNumber(section) || section < 0 || section > sectionMax || !isOnStep(section, 0, range.step)) {
            problems.push(`${name} section score ${show(section)} is not between 0 and ${sectionMax} in steps of ${range.step}`);
        } else if (scoreValid && section * (SECTIONS_IN_TOTAL[name] ?? 1) > score) {
            // IELTS overall is about the average band; TOEFL overall is the sum of four sections.
            problems.push(`${name} section score ${section} cannot fit an overall score of ${score}`);
        }
    }
    return problems;
}

function checkAdmission(admission: unknown): string[] {
    if (admission === undefined) return [];
    if (!isRecord(admission)) return ["admission is not an object"];
    const problems = unknownKeys(admission, ADMISSION_KEYS, "admission");
    if (admission.applyVia !== undefined && !isOneOf(admission.applyVia, APPLY_ROUTES)) {
        problems.push(`admission: unknown applyVia "${show(admission.applyVia)}"`);
    }
    if (admission.rolling !== undefined && typeof admission.rolling !== "boolean") problems.push("admission: rolling must be true or false");
    const deadlines = admission.deadlines;
    if (!Array.isArray(deadlines)) return [...problems, "admission: deadlines must be a list"];
    if (admission.rolling === true && deadlines.length) problems.push("admission: rolling admission lists no deadlines");
    if (!deadlines.length && admission.rolling !== true) problems.push("admission: list deadlines or set rolling");

    const seen = new Set<string>();
    for (const deadline of items(deadlines)) {
        if (!isRecord(deadline)) {
            problems.push("deadline is not an object");
            continue;
        }
        problems.push(...unknownKeys(deadline, DEADLINE_KEYS, "deadline"));
        if (!isOneOf(deadline.intake, ["winter", "summer"])) problems.push(`deadline: unknown intake "${show(deadline.intake)}"`);
        if (!isOneOf(deadline.applicants, ["non-eu", "all"])) problems.push(`deadline: unknown applicants "${show(deadline.applicants)}"`);
        const key = `${show(deadline.intake)} ${show(deadline.applicants)}`;
        if (seen.has(key)) problems.push(`deadline: ${key} listed twice`);
        seen.add(key);
        if (!isMonthDay(deadline.closes)) problems.push(`deadline: closes "${show(deadline.closes)}" must be a day as MM-DD`);
        if (deadline.opens !== undefined && !isMonthDay(deadline.opens)) {
            problems.push(`deadline: opens "${show(deadline.opens)}" must be a day as MM-DD`);
        }
    }
    return problems;
}

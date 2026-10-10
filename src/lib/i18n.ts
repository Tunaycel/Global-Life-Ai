export type Locale = "tr" | "en" | "de" | "pl";

export const locales: { code: Locale; label: string; flag: string }[] = [
    { code: "tr", label: "Türkçe", flag: "TR" },
    { code: "en", label: "English", flag: "EN" },
    { code: "de", label: "Deutsch", flag: "DE" },
    { code: "pl", label: "Polski", flag: "PL" },
];

const translations = {
    nav: {
        features: { tr: "Özellikler", en: "Features", de: "Funktionen", pl: "Funkcje" },
        language: { tr: "Dil Öğrenme", en: "Language Learning", de: "Sprachlernen", pl: "Nauka Języków" },
        visa: { tr: "Vize Danışmanlık", en: "Visa Consulting", de: "Visaberatung", pl: "Doradztwo Wizowe" },
        pricing: { tr: "Fiyatlandırma", en: "Pricing", de: "Preise", pl: "Cennik" },
        about: { tr: "Hakkımızda", en: "About", de: "Über uns", pl: "O nas" },
        login: { tr: "Giriş Yap", en: "Sign In", de: "Anmelden", pl: "Zaloguj się" },
        getStarted: { tr: "Ücretsiz Başla", en: "Start Free", de: "Kostenlos starten", pl: "Zacznij za darmo" },
    },
    hero: {
        tag: { tr: "Geleceğin Platformu", en: "The Future Platform", de: "Die Zukunftsplattform", pl: "Platforma Przyszłości" },
        title1: {
            tr: "Yurtdışı Hayalini",
            en: "Your Global Dream,",
            de: "Dein globaler Traum,",
            pl: "Twoje globalne marzenie,",
        },
        title2: {
            tr: "AI ile Gerçekleştir.",
            en: "Powered by AI.",
            de: "Angetrieben von KI.",
            pl: "Napędzane przez AI.",
        },
        subtitle: {
            tr: "Yapay zeka destekli dil eğitimi ve göç danışmanlığı. Kişiselleştirilmiş öğrenme yolculuğunuz tek platformda.",
            en: "AI-powered language training and immigration consulting. Your personalized learning journey, all in one platform.",
            de: "KI-gestützte Sprachausbildung und Einwanderungsberatung. Ihre personalisierte Lernreise auf einer Plattform.",
            pl: "Szkolenie językowe i doradztwo imigracyjne wspierane przez AI. Twoja spersonalizowana ścieżka nauki na jednej platformie.",
        },
        cta: { tr: "Deneyimi Keşfet", en: "Explore the Experience", de: "Erlebe die Zukunft", pl: "Odkryj doświadczenie" },
        demo: { tr: "Canlı Demo", en: "Live Demo", de: "Live-Demo", pl: "Demo na żywo" },
        noCard: {
            tr: "Kredi kartı gerekmez — 60 saniyede başla",
            en: "No credit card required — Start in 60 seconds",
            de: "Keine Kreditkarte erforderlich — In 60 Sekunden starten",
            pl: "Karta kredytowa nie jest wymagana — Zacznij w 60 sekund",
        },
        users: {
            tr: "aktif kullanıcı",
            en: "active users",
            de: "aktive Nutzer",
            pl: "aktywnych użytkowników",
        },
    },
    trusted: {
        title: {
            tr: "Dünyanın Önde Gelen Kurumları Tarafından Tercih Ediliyor",
            en: "Trusted by Leading Institutions Worldwide",
            de: "Von führenden Institutionen weltweit vertraut",
            pl: "Zaufanie wiodących instytucji na całym świecie",
        },
    },
    problem: {
        title: {
            tr: "Eski Yöntemler Sizi Geride Bırakıyor",
            en: "Legacy Methods Are Holding You Back",
            de: "Veraltete Methoden halten Sie zurück",
            pl: "Stare metody Cię hamują",
        },
        subtitle: {
            tr: "GlobalLife AI ile farkı yaşayın",
            en: "Experience the difference with GlobalLife AI",
            de: "Erleben Sie den Unterschied mit GlobalLife AI",
            pl: "Poczuj różnicę z GlobalLife AI",
        },
        oldWay: { tr: "Geleneksel Yöntem", en: "The Old Way", de: "Der alte Weg", pl: "Stary sposób" },
        newWay: { tr: "GlobalLife AI", en: "GlobalLife AI", de: "GlobalLife AI", pl: "GlobalLife AI" },
        problems: {
            tr: [
                "Yüzlerce dolarlık danışmanlık ücretleri",
                "Belirsiz süreçler ve tutarsız bilgi",
                "Tek tip ders planları, kişiselleştirme yok",
                "Sınırlı çalışma saatleri, randevu bekleme",
                "Sonuç garantisi olmayan hizmetler",
            ],
            en: [
                "Hundreds of dollars in consulting fees",
                "Unclear processes and inconsistent information",
                "One-size-fits-all lesson plans, no personalization",
                "Limited office hours, waiting for appointments",
                "Services with no guaranteed results",
            ],
            de: [
                "Hunderte Euro an Beratungsgebühren",
                "Unklare Prozesse und inkonsistente Informationen",
                "Einheitliche Lehrpläne ohne Personalisierung",
                "Begrenzte Öffnungszeiten, Terminwartezeiten",
                "Dienstleistungen ohne Ergebnisgarantie",
            ],
            pl: [
                "Setki dolarów opłat konsultingowych",
                "Niejasne procesy i niespójne informacje",
                "Jednolite plany lekcji, brak personalizacji",
                "Ograniczone godziny pracy, czekanie na wizytę",
                "Usługi bez gwarancji rezultatów",
            ],
        },
        solutions: {
            tr: [
                "Aylık sabit ücret, sınırsız erişim",
                "Şeffaf süreç takibi, doğrulanmış veri",
                "Yapay zeka ile tam kişisel öğrenme planı",
                "7/24 anında cevap, sıfır bekleme",
                "Veri odaklı sonuç takibi ve optimizasyon",
            ],
            en: [
                "Fixed monthly fee, unlimited access",
                "Transparent process tracking, verified data",
                "Fully personalized AI learning plans",
                "24/7 instant responses, zero waiting",
                "Data-driven result tracking and optimization",
            ],
            de: [
                "Feste monatliche Gebühr, unbegrenzter Zugang",
                "Transparente Prozessverfolgung, verifizierte Daten",
                "Vollständig personalisierte KI-Lernpläne",
                "24/7 sofortige Antworten, keine Wartezeit",
                "Datengetriebene Ergebnisverfolgung und Optimierung",
            ],
            pl: [
                "Stała opłata miesięczna, nieograniczony dostęp",
                "Przejrzyste śledzenie procesów, zweryfikowane dane",
                "W pełni spersonalizowane plany nauki AI",
                "Natychmiastowe odpowiedzi 24/7, zero czekania",
                "Śledzenie wyników i optymalizacja oparta na danych",
            ],
        },
    },
    stats: {
        users: { tr: "Aktif Kullanıcı", en: "Active Users", de: "Aktive Nutzer", pl: "Aktywni Użytkownicy" },
        lessons: { tr: "AI Ders Tamamlandı", en: "AI Lessons Completed", de: "KI-Lektionen abgeschlossen", pl: "Ukończone lekcje AI" },
        satisfaction: { tr: "Kullanıcı Memnuniyeti", en: "User Satisfaction", de: "Nutzerzufriedenheit", pl: "Zadowolenie Użytkowników" },
        countries: { tr: "Desteklenen Ülke", en: "Countries Supported", de: "Unterstützte Länder", pl: "Obsługiwane Kraje" },
    },
    cta: {
        title: {
            tr: "Geleceğinizi Şekillendirin",
            en: "Shape Your Future",
            de: "Gestalten Sie Ihre Zukunft",
            pl: "Kształtuj swoją przyszłość",
        },
        subtitle: {
            tr: "Binlerce kullanıcı yurtdışı hedeflerine GlobalLife AI ile ulaştı. Sırada siz varsınız.",
            en: "Thousands of users have reached their global goals with GlobalLife AI. You're next.",
            de: "Tausende Nutzer haben ihre globalen Ziele mit GlobalLife AI erreicht. Sie sind als Nächstes dran.",
            pl: "Tysiące użytkowników osiągnęło swoje globalne cele z GlobalLife AI. Ty jesteś następny.",
        },
        button: { tr: "Hemen Başla", en: "Get Started Now", de: "Jetzt starten", pl: "Zacznij teraz" },
    },
    notFound: {
        title: { tr: "Bu sayfa bulunamadı.", en: "This page could not be found.", de: "Diese Seite wurde nicht gefunden.", pl: "Nie znaleziono tej strony." },
        description: {
            tr: "Adres yanlış yazılmış ya da sayfa kaldırılmış olabilir.",
            en: "The address may be mistyped, or the page may have been removed.",
            de: "Die Adresse ist vielleicht falsch geschrieben oder die Seite wurde entfernt.",
            pl: "Adres może być błędnie wpisany lub strona została usunięta.",
        },
        back: { tr: "Ana sayfaya dön", en: "Back to the home page", de: "Zurück zur Startseite", pl: "Wróć do strony głównej" },
    },
} as const;

export type TranslationKey = keyof typeof translations;

type Entry = Partial<Record<Locale, string | string[]>>;

export function t(section: string, key: string, locale: Locale): string | string[] {
    const sec = (translations as unknown as Record<string, Record<string, Entry | undefined> | undefined>)[section];
    if (!sec) return key;
    const entry = sec[key];
    if (!entry) return key;
    return entry[locale] ?? entry["en"] ?? key;
}

export default translations;

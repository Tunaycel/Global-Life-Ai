"use client";

import { createContext, useContext, useCallback, useSyncExternalStore, ReactNode } from "react";
import { Locale, locales, t } from "@/lib/i18n";

interface LocaleContextType {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: (section: string, key: string) => string | string[];
}

const LocaleContext = createContext<LocaleContextType>({
    locale: "tr",
    setLocale: () => { },
    t: () => "",
});

export function useLocale() {
    return useContext(LocaleContext);
}

// The server cannot read localStorage, so it always renders "tr". Reading the
// stored locale through useSyncExternalStore makes the first client render use
// the same "tr" snapshot, then switch to the stored locale after hydration.
const STORAGE_KEY = "locale";
const CHANGE_EVENT = "locale-change";

// Last locale chosen in this tab, used when localStorage is unavailable.
let fallbackLocale: Locale = "tr";

function readStoredLocale(): Locale {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return locales.some((l) => l.code === stored) ? (stored as Locale) : fallbackLocale;
    } catch {
        return fallbackLocale;
    }
}

function subscribe(onChange: () => void) {
    window.addEventListener("storage", onChange);
    window.addEventListener(CHANGE_EVENT, onChange);
    return () => {
        window.removeEventListener("storage", onChange);
        window.removeEventListener(CHANGE_EVENT, onChange);
    };
}

export function LocaleProvider({ children }: { children: ReactNode }) {
    const locale = useSyncExternalStore<Locale>(subscribe, readStoredLocale, () => "tr");

    const setLocale = useCallback((newLocale: Locale) => {
        fallbackLocale = newLocale;
        try {
            localStorage.setItem(STORAGE_KEY, newLocale);
        } catch (error) {
            console.warn("Could not save the locale, keeping it for this tab only.", error);
            // Drop any older stored value so reads fall back to the new locale.
            try {
                localStorage.removeItem(STORAGE_KEY);
            } catch { }
        }
        window.dispatchEvent(new Event(CHANGE_EVENT));
    }, []);

    const translate = useCallback(
        (section: string, key: string) => t(section, key, locale),
        [locale]
    );

    return (
        <LocaleContext.Provider value={{ locale, setLocale, t: translate }}>
            {children}
        </LocaleContext.Provider>
    );
}

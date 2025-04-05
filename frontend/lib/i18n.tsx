"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import en from "../messages/en.json";
import it from "../messages/it.json";

type Language = "en" | "it";

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

// Export the context so it's accessible where needed
export const I18nContext = createContext<I18nContextType>({
  language: "en",
  setLanguage: () => {},
  t: (key) => key,
});

const messages = {
  en,
  it,
};

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    // Load language from localStorage on mount
    const savedLanguage = localStorage.getItem("language") as Language;
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "it")) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  const t = (key: string, params?: Record<string, string | number>) => {
    const keys = key.split(".");
    let value: any = messages[language];

    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) return key;
    }

    if (typeof value === "string" && params) {
      return value.replace(/\{(\w+)\}/g, (_, key) =>
        String(params[key] || `{${key}}`)
      );
    }

    return value;
  };

  return React.createElement(I18nContext.Provider, {
    value: { language, setLanguage: handleSetLanguage, t },
    children,
  });
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}

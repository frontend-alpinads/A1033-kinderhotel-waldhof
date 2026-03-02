"use client";

import { createContext, useContext } from "react";
import type { Dictionary } from "@/locales";
import type { Locale } from "./config";

interface TranslationsContextValue {
  locale: Locale;
  dictionary: Dictionary;
}

const TranslationsContext = createContext<TranslationsContextValue | null>(null);

interface TranslationsProviderProps {
  locale: Locale;
  dictionary: Dictionary;
  children: React.ReactNode;
}

export function TranslationsProvider({
  locale,
  dictionary,
  children,
}: TranslationsProviderProps) {
  return (
    <TranslationsContext.Provider value={{ locale, dictionary }}>
      {children}
    </TranslationsContext.Provider>
  );
}

export function useTranslations() {
  const context = useContext(TranslationsContext);
  if (!context) {
    throw new Error("useTranslations must be used within a TranslationsProvider");
  }
  return context;
}

export function useLocale() {
  const { locale } = useTranslations();
  return locale;
}

export function useDictionary() {
  const { dictionary } = useTranslations();
  return dictionary;
}

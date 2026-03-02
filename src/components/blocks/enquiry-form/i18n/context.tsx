"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { EnquiryFormTranslations, Locale } from "./types";
import de from "./locales/de";
import en from "./locales/en";
import it from "./locales/it";

const locales: Record<Locale, EnquiryFormTranslations> = {
  de,
  en,
  it,
};

/**
 * Get translations for a given locale
 */
export function getTranslations(locale: Locale): EnquiryFormTranslations {
  return locales[locale] || locales.de;
}

/**
 * Context for enquiry form translations
 */
const EnquiryFormTranslationsContext = createContext<EnquiryFormTranslations | null>(null);

interface EnquiryFormProviderProps {
  locale: Locale;
  children: ReactNode;
  /** Optional override translations (for consumers who want to customize) */
  overrides?: Partial<EnquiryFormTranslations>;
}

/**
 * Provider component for enquiry form translations
 */
export function EnquiryFormProvider({
  locale,
  children,
  overrides,
}: EnquiryFormProviderProps) {
  const baseTranslations = getTranslations(locale);
  const translations = overrides
    ? { ...baseTranslations, ...overrides }
    : baseTranslations;

  return (
    <EnquiryFormTranslationsContext.Provider value={translations}>
      {children}
    </EnquiryFormTranslationsContext.Provider>
  );
}

/**
 * Hook to access all enquiry form translations
 * Falls back to German translations when used outside a provider (e.g., in hero booking forms)
 */
export function useEnquiryFormTranslations(): EnquiryFormTranslations {
  const context = useContext(EnquiryFormTranslationsContext);
  // Return fallback translations when used outside provider (e.g., hero booking forms)
  if (!context) {
    return locales.de;
  }
  return context;
}

/**
 * Hook to access date selection translations
 */
export function useDateSelectionTranslations() {
  const translations = useEnquiryFormTranslations();
  return translations.dateSelection;
}

/**
 * Hook to access room selection translations
 */
export function useRoomSelectionTranslations() {
  const translations = useEnquiryFormTranslations();
  return translations.roomSelection;
}

/**
 * Hook to access guest selection translations
 */
export function useGuestSelectionTranslations() {
  const translations = useEnquiryFormTranslations();
  return translations.guestSelection;
}

/**
 * Hook to access offer selection translations
 */
export function useOfferSelectionTranslations() {
  const translations = useEnquiryFormTranslations();
  return translations.offerSelection;
}

/**
 * Hook to access form translations
 */
export function useFormTranslations() {
  const translations = useEnquiryFormTranslations();
  return translations.form;
}

/**
 * Hook to access validation translations
 */
export function useValidationTranslations() {
  const translations = useEnquiryFormTranslations();
  return translations.validation;
}

/**
 * Hook to access offer tabs translations
 */
export function useOfferTabsTranslations() {
  const translations = useEnquiryFormTranslations();
  return translations.offerTabs;
}

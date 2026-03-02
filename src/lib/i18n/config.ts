export const locales = ['de', 'en', 'it'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'de';

export const localeNames: Record<Locale, string> = {
  de: 'Deutsch',
  en: 'English',
  it: 'Italiano',
};

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

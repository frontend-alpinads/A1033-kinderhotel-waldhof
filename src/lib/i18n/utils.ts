import { locales, type Locale, defaultLocale } from "./config";
import { formatPathname, parsePathname } from "./routing";

/**
 * Extract locale from pathname
 * @param pathname - The current pathname (e.g., "/en/page" or "/de")
 * @returns The locale found in the path, or the default locale
 */
export function getLocaleFromPathname(pathname: string): Locale {
  return parsePathname(pathname).locale;
}

/**
 * Remove locale prefix from pathname
 * @param pathname - The current pathname (e.g., "/en/about")
 * @returns The pathname without the locale (e.g., "/about")
 */
export function removeLocaleFromPathname(pathname: string): string {
  const parsed = parsePathname(pathname);
  return formatPathname({
    version: parsed.version,
    locale: defaultLocale,
    slugPath: parsed.slugPath,
  });
}

/**
 * Switch locale while preserving the rest of the path
 * @param currentPathname - The current pathname
 * @param newLocale - The locale to switch to
 * @returns The new pathname with the new locale
 */
export function switchLocale(
  currentPathname: string,
  newLocale: Locale,
): string {
  const parsed = parsePathname(currentPathname);
  return formatPathname({
    version: parsed.version,
    locale: newLocale,
    slugPath: parsed.slugPath,
  });
}

/**
 * Get alternate URLs for all locales (useful for SEO)
 * @param currentPathname - The current pathname
 * @returns Object with locale keys and their corresponding URLs
 */
export function getAlternateUrls(
  currentPathname: string,
): Record<Locale, string> {
  return locales.reduce(
    (acc, locale) => {
      acc[locale] = switchLocale(currentPathname, locale);
      return acc;
    },
    {} as Record<Locale, string>,
  );
}

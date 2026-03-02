import type { Locale } from "@/lib/i18n";
import type { SiteVersion } from "@/lib/i18n/routing";

export const THANK_YOU_SLUG_BY_LOCALE: Record<Locale, string> = {
  de: "/danke",
  en: "/thank-you",
  it: "/grazie",
};

export const PRIVACY_SLUG_BY_LOCALE: Record<Locale, string> = {
  de: "/datenschutzeinstellungen",
  en: "/privacy-settings",
  it: "/impostazioni-privacy",
};

export type PageKey = "home" | "thank-you" | "privacy";

export type RouteDecision =
  | { type: "render"; page: PageKey; version: SiteVersion; locale: Locale }
  | { type: "redirect"; to: string };

export function decideRoute(input: {
  version: SiteVersion;
  locale: Locale;
  slugPath: string;
}): RouteDecision | null {
  const { version, locale, slugPath } = input;

  // Global routes (thank-you, privacy) are unversioned-only
  // If a version prefix is used, return null (will trigger 404)
  const isGlobalRoute =
    slugPath === THANK_YOU_SLUG_BY_LOCALE[locale] ||
    slugPath === PRIVACY_SLUG_BY_LOCALE[locale];

  if (isGlobalRoute) {
    if (version !== "v1") {
      // Version prefix used with global route → 404
      return null;
    }
    if (slugPath === THANK_YOU_SLUG_BY_LOCALE[locale]) {
      return { type: "render", page: "thank-you", version: "v1", locale };
    }
    if (slugPath === PRIVACY_SLUG_BY_LOCALE[locale]) {
      return { type: "render", page: "privacy", version: "v1", locale };
    }
  }

  if (slugPath === "/") return { type: "render", page: "home", version, locale };

  return null;
}


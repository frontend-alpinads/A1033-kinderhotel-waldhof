import { defaultLocale, locales, type Locale } from "./config";
import { variantKeys, type VariantKey } from "@/contents/variants-keys";

// Type for alias map (alias string -> VariantKey)
type AliasMap = Map<string, VariantKey>;

// Import variantKeys at module level for type inference
const allVariantKeys = variantKeys;

// SiteVersion is now dynamic based on available variant keys
// v1 is always the default (unversioned routes alias to v1)
export const siteVersions = variantKeys.filter(
  (k) => k !== variantKeys[0],
) as readonly string[];
export type SiteVersion = "v1" | (typeof siteVersions)[number];

export interface ParsedPathname {
  version: SiteVersion;
  locale: Locale;
  hasExplicitLocale: boolean;
  slugSegments: string[];
  slugPath: string; // always starts with "/" ("/" means home)
  isAliasPath: boolean; // true if path was resolved from an alias
  resolvedFromAlias?: string; // the alias used to resolve this path
}

function normalizePathname(pathname: string): string {
  if (!pathname) return "/";
  return pathname.startsWith("/") ? pathname : `/${pathname}`;
}

const LOCALE_HINT_BY_FIRST_SLUG_SEGMENT: Partial<Record<string, Locale>> = {
  // Thank-you
  danke: "de",
  "thank-you": "en",
  grazie: "it",

  // Privacy
  datenschutzeinstellungen: "de",
  "privacy-settings": "en",
  "impostazioni-privacy": "it",
};

export function parsePathname(
  pathname: string,
  aliasMap?: AliasMap,
): ParsedPathname {
  const normalized = normalizePathname(pathname);
  const segments = normalized.split("/").filter(Boolean);

  let version: SiteVersion = "v1";
  let idx = 0;
  let isAliasPath = false;
  let resolvedFromAlias: string | undefined;

  const maybeVersion = segments[0];

  // First, check if the first segment is a path alias
  if (aliasMap && maybeVersion && aliasMap.has(maybeVersion)) {
    const variantKey = aliasMap.get(maybeVersion)!;
    // "default" variant maps to "v1" in URL terms
    version = variantKey === "default" ? "v1" : (variantKey as SiteVersion);
    isAliasPath = true;
    resolvedFromAlias = maybeVersion;
    idx = 1;
  }
  // Then check if it's a valid variant key (including v1, but v1 is handled as unversioned)
  else if (
    maybeVersion &&
    allVariantKeys.includes(maybeVersion as VariantKey)
  ) {
    version = maybeVersion as SiteVersion;
    idx = 1;
  }

  const maybeLocale = segments[idx];
  const hasExplicitLocale =
    !!maybeLocale && locales.includes(maybeLocale as Locale);
  let locale: Locale = hasExplicitLocale
    ? (maybeLocale as Locale)
    : defaultLocale;

  const slugSegments = segments.slice(idx + (hasExplicitLocale ? 1 : 0));
  const slugPath = "/" + slugSegments.join("/");

  // If there's no explicit locale segment, we can infer locale from certain
  // locale-specific slugs (e.g. /thank-you, /grazie) to keep URLs nice.
  if (!hasExplicitLocale && slugSegments.length > 0) {
    const hint = LOCALE_HINT_BY_FIRST_SLUG_SEGMENT[slugSegments[0]];
    if (hint) locale = hint;
  }

  return {
    version,
    locale,
    hasExplicitLocale,
    slugSegments,
    slugPath: slugPath === "/" ? "/" : slugPath,
    isAliasPath,
    resolvedFromAlias,
  };
}

export function parseSegments(
  segments?: string[],
  aliasMap?: AliasMap,
): ParsedPathname {
  return parsePathname("/" + (segments ?? []).join("/"), aliasMap);
}

export function formatPathname(args: {
  version: SiteVersion;
  locale: Locale;
  slugPath: string; // "/" or "/some/path"
}): string {
  const { version, locale, slugPath } = args;
  const slug = slugPath === "/" ? "" : slugPath;

  const versionPrefix = version === "v1" ? "" : `/${version}`;
  const localePrefix = locale === defaultLocale ? "" : `/${locale}`;

  const path = `${versionPrefix}${localePrefix}${slug}`;
  return path || "/";
}

/**
 * Format a pathname using a path alias instead of the version.
 * e.g., formatPathnameWithAlias({ alias: "spring-summer", locale: "en", slugPath: "/" })
 *       => "/spring-summer/en"
 */
export function formatPathnameWithAlias(args: {
  alias: string;
  locale: Locale;
  slugPath: string;
}): string {
  const { alias, locale, slugPath } = args;
  const slug = slugPath === "/" ? "" : slugPath;
  const localePrefix = locale === defaultLocale ? "" : `/${locale}`;
  return `/${alias}${localePrefix}${slug}`;
}

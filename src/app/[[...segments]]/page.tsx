import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

// Revalidate every hour (ISR)
export const revalidate = 3600;

import type { Locale } from "@/lib/i18n";
import { defaultLocale, locales } from "@/lib/i18n";
import {
  formatPathname,
  formatPathnameWithAlias,
  parseSegments,
} from "@/lib/i18n/routing";
import { decideRoute } from "@/lib/routes/registry";
import { renderHome } from "../render-home";
import { PrivacySettingsPage } from "@/components/pages/privacy/privacy-settings-page";
import { ThankYouPage } from "@/components/pages/thank-you/thank-you-page";
import { HOTEL_CONFIG, SEO_CONFIG } from "@/hotel-config";
import { getAliasMap, getAliasForVariant } from "@/contents/alias-map";
import type { VariantKey } from "@/contents/variants-keys";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ segments?: string[] }>;
}): Promise<Metadata> {
  const { segments } = await params;
  const aliasMap = await getAliasMap();
  const parsed = parseSegments(segments, aliasMap);

  // Get alias for canonical URL if configured
  const variantKey: VariantKey =
    parsed.version === "v1" ? "default" : (parsed.version as VariantKey);
  const alias = getAliasForVariant(variantKey, aliasMap);

  // Use alias path for canonical if alias exists
  const canonicalPath = alias
    ? formatPathnameWithAlias({
        alias,
        locale: parsed.locale,
        slugPath: parsed.slugPath,
      })
    : formatPathname({
        version: parsed.version,
        locale: parsed.locale,
        slugPath: parsed.slugPath,
      });

  const decision = decideRoute({
    version: parsed.version,
    locale: parsed.locale,
    slugPath: parsed.slugPath,
  });

  const base: Metadata = {
    metadataBase: new URL(SEO_CONFIG.baseUrl),
    alternates: {
      canonical: canonicalPath,
    },
  };

  if (!decision || decision.type !== "render") return base;

  if (decision.page === "home") {
    const seoMeta = SEO_CONFIG.home[decision.locale];

    return {
      ...base,
      title: seoMeta.title,
      description: seoMeta.description,
      openGraph: {
        title: seoMeta.ogTitle,
        description: seoMeta.ogDescription,
        url: canonicalPath,
        siteName: HOTEL_CONFIG.name,
        locale: seoMeta.ogLocale,
        type: "website",
        images: [SEO_CONFIG.ogImage],
      },
      twitter: {
        card: "summary_large_image",
        title: seoMeta.ogTitle,
        description: seoMeta.ogDescription,
        images: [SEO_CONFIG.ogImage],
      },
      alternates: {
        ...base.alternates,
        languages: locales.reduce(
          (acc, l) => {
            acc[l] = formatPathname({
              version: parsed.version,
              locale: l,
              slugPath: "/",
            });
            return acc;
          },
          {} as Record<Locale, string>,
        ),
      },
    };
  }

  if (decision.page === "privacy") {
    return {
      ...base,
      title:
        decision.locale === "de"
          ? "Datenschutzeinstellungen"
          : decision.locale === "it"
            ? "Impostazioni Privacy"
            : "Privacy Settings",
    };
  }

  if (decision.page === "thank-you") {
    return {
      ...base,
      title:
        decision.locale === "de"
          ? "Anfrage erhalten"
          : decision.locale === "it"
            ? "Richiesta Ricevuta"
            : "Inquiry Received",
    };
  }

  return {
    ...base,
  };
}

export default async function CatchAllPage({
  params,
}: {
  params: Promise<{ segments?: string[] }>;
}) {
  const { segments } = await params;
  const aliasMap = await getAliasMap();
  const parsed = parseSegments(segments, aliasMap);

  // Get the variant key for this version
  const variantKey: VariantKey =
    parsed.version === "v1" ? "default" : (parsed.version as VariantKey);
  const alias = getAliasForVariant(variantKey, aliasMap);

  // If variant has alias AND we're NOT on alias path AND we're on home slug → redirect to alias
  if (alias && !parsed.isAliasPath && parsed.slugPath === "/") {
    redirect(
      formatPathnameWithAlias({
        alias,
        locale: parsed.locale,
        slugPath: "/",
      }),
    );
  }

  // Option B canonicalization: never keep explicit "/de" in the URL.
  if (parsed.hasExplicitLocale && parsed.locale === defaultLocale) {
    // If we have an alias, redirect to alias path without locale
    const targetPath = alias
      ? formatPathnameWithAlias({
          alias,
          locale: defaultLocale,
          slugPath: parsed.slugPath,
        })
      : formatPathname({
          version: parsed.version,
          locale: defaultLocale,
          slugPath: parsed.slugPath,
        });
    redirect(targetPath);
  }

  const decision = decideRoute({
    version: parsed.version,
    locale: parsed.locale,
    slugPath: parsed.slugPath,
  });

  if (!decision) return notFound();
  if (decision.type === "redirect") redirect(decision.to);

  switch (decision.page) {
    case "home":
      return await renderHome(decision.version, decision.locale);
    case "privacy":
      return <PrivacySettingsPage />;
    case "thank-you":
      return <ThankYouPage locale={decision.locale} />;
    default:
      return notFound();
  }
}

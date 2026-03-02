import type { Locale } from "@/lib/i18n/config";
import de from "./de";
import en from "./en";
import it from "./it";
import { Dictionary } from "./types";

const dictionaries: Record<Locale, Dictionary> = {
  de,
  en,
  it,
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export type { Dictionary };

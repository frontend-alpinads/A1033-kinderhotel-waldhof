"use client";

import { Button } from "@/components/ui/button";
import type { Locale } from "@/lib/i18n";
import { useRouter } from "next/navigation";

const LABEL_BY_LOCALE: Record<Locale, string> = {
  de: "Schließen",
  en: "Close",
  it: "Chiudi",
};

export function ThankYouBackButton({ locale }: { locale: Locale }) {
  const router = useRouter();
  return (
    <Button variant={"outline-primary"} onClick={() => router.back()}>
      {LABEL_BY_LOCALE[locale]}
    </Button>
  );
}


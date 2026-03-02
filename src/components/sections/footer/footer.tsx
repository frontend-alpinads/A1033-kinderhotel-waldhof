"use client";

import { FooterV1 } from "./variants/footer-v1";
import { FooterV2 } from "./variants/footer-v2";
import { useSectionVariants } from "@/contents";
import { FooterV3 } from "./variants/footer-v3";

const footerVariants = {
  v1: FooterV1,
  v2: FooterV2,
  v3: FooterV3,
};

export function Footer() {
  const { footer: footerVariant } = useSectionVariants();
  const FooterImpl =
    footerVariants[footerVariant as keyof typeof footerVariants];
  if (!FooterImpl) {
    return null;
  }

  return <FooterImpl />;
}

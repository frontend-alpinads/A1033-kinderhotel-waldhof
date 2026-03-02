"use client";

import { FaqsV1 } from "./variants/faqs-v1";
import { FaqsV2 } from "./variants/faqs-v2";
import { useSectionVariants } from "@/contents";
import type { Faq } from "@/shared-types";

const faqVariants = {
  v1: FaqsV1,
  v2: FaqsV2,
};

interface FaqsProps {
  faqs?: Faq[];
}

export function Faqs({ faqs }: FaqsProps) {
  const { faqs: faqsVariant } = useSectionVariants();
  const FaqsImpl = faqVariants[faqsVariant as keyof typeof faqVariants];
  if (!FaqsImpl) {
    return null;
  }

  return <FaqsImpl faqs={faqs} />;
}

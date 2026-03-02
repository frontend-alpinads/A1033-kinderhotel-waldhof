"use client";

import { FaqAccordion } from "../../faq-accordion";
import { useFaqsContent } from "@/contents";
import type { Faq } from "@/shared-types";

interface FaqsV2Props {
  faqs?: Faq[];
}

export function FaqsV2({ faqs }: FaqsV2Props) {
  const faqsContent = useFaqsContent();
  const titleParts = faqsContent.title.split("\n");

  // Use fetched faqs data or fall back to empty array
  const faqsData = faqs && faqs.length > 0 ? faqs : [];

  return (
    <section
      id="faqs"
      className="bg-background relative overflow-hidden py-20 lg:py-30"
    >
      {/* Contents */}
      <div className="relative mx-auto flex w-full flex-col items-center gap-14 lg:grid lg:grid-cols-2 lg:items-start lg:gap-20">
        <div className="relative mx-auto flex w-full flex-col items-center gap-4 px-4 lg:items-start lg:px-5">
          <h2 className="text-accent bg-border/30 px-3 py-2 text-center text-base leading-[150%] font-medium tracking-[5%] uppercase lg:mb-1 lg:text-start">
            - {faqsContent.badge} -
          </h2>

          <p className="font-title text-display-2 text-center font-normal lg:text-start">
            {titleParts[0]} {titleParts[1]}
          </p>

          <p className="mx-auto w-full max-w-360 text-center text-base leading-normal -tracking-[1%] opacity-80 lg:text-start">
            {faqsContent.description}
          </p>
        </div>

        <div className="relative mx-auto flex w-full max-w-240 flex-col px-4 lg:flex-1 lg:px-5">
          <FaqAccordion items={faqsData} allowMultiple />
        </div>
      </div>
    </section>
  );
}

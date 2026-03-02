"use client";

import { EnquiryV1 } from "./variants/enquiry-v1";
import { useSectionVariants } from "@/contents";
import { EnquiryV2 } from "./variants/enquiry-v2";

const enquiryVariants = {
  v1: EnquiryV1,
  v2: EnquiryV2,
};

export function Enquiry() {
  const { enquiry: enquiryVariant } = useSectionVariants();
  const EnquiryImpl =
    enquiryVariants[enquiryVariant as keyof typeof enquiryVariants];
  if (!EnquiryImpl) {
    return null;
  }

  return <EnquiryImpl />;
}

"use client";

import { OffersV1 } from "./variants/offers-v1";
import { OffersV2 } from "./variants/offers-v2";
import { useSectionVariants } from "@/contents";
import { Offer } from "@/shared-types";

const offersVariants = {
  v1: OffersV1,
  v2: OffersV2,
};

type OffersProps = {
  offers: Offer[];
};

export function Offers({ offers }: OffersProps) {
  const { offers: offersVariant } = useSectionVariants();
  const OffersImpl =
    offersVariants[offersVariant as keyof typeof offersVariants];
  if (!OffersImpl) {
    return null;
  }

  return <OffersImpl offers={offers} />;
}

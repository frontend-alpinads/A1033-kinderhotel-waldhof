"use client";

import { OffersCarousel } from "../../offers-carousel";
import { OfferCard } from "../../offer-card";
import { Offer } from "@/shared-types";
import { useOffersContent } from "@/contents";

interface OffersV1Props {
  offers: Offer[];
}

export function OffersV1({ offers }: OffersV1Props) {
  const offersContent = useOffersContent();
  const titleParts = offersContent.title.split("\n");

  return (
    <section
      id="offers"
      className="bg-background text-foreground relative overflow-hidden py-20 lg:py-30"
    >
      <div className="relative flex w-full flex-col gap-5 lg:gap-20">
        <div className="mx-auto flex w-full flex-col items-center gap-4 px-4 text-center lg:px-5">
          <h2 className="text-accent py-2 text-center text-base leading-[150%] font-medium tracking-[5%] uppercase lg:mb-1">
            - {offersContent.badge} -
          </h2>
          <p className="font-title text-display-2 text-center font-medium">
            {titleParts[0]}
            {titleParts[1]}
          </p>

          <p className="mx-auto w-full max-w-360 text-center text-base leading-normal">
            {offersContent.description}
          </p>
        </div>

        {/*  Offers*/}
        <div className="">
          <OffersCarousel
            slides={offers.map((offer) => (
              <OfferCard key={offer.title} offer={offer} />
            ))}
          />
        </div>
      </div>
    </section>
  );
}

"use client";

import { Fragment, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRoomsAndOffers } from "@/components/providers/rooms-and-offers-provider";
import { Offer } from "@/shared-types";
import { useEnquiryFormTranslations } from "../../i18n";
import { OfferSelectionItem } from "./offer-selection-item";
import { useOfferTabs, OfferTabValue } from "./use-offer-tabs";
import { OfferTabs } from "./offer-tabs";
import { TagIcon } from "@phosphor-icons/react";

type OfferSelectionProps = {
  children: React.ReactNode;
  onOfferSelect?: (offer: Offer | null) => void;
  selectedOffer?: Offer | null;
};

export function DesktopOfferSelection({
  children,
  onOfferSelect,
}: OfferSelectionProps) {
  const t = useEnquiryFormTranslations();
  const [open, setOpen] = useState(false);
  const { offers } = useRoomsAndOffers();
  const { tabs, activeTab, setActiveTab, filteredOffers, hasDatesSelected } =
    useOfferTabs(offers);

  const handleOfferSelect = (offer: Offer) => {
    if (onOfferSelect) {
      onOfferSelect(offer);
    }
    setOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) setActiveTab(tabs[0].value);

    setOpen(open);
  };

  // Shared content for both Dialog and Popover
  const selectionContent = (
    <>
      {hasDatesSelected && (
        <OfferTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={(value) => setActiveTab(value as OfferTabValue)}
        />
      )}
      {filteredOffers.length === 0 ? (
        <div className="flex items-center justify-center p-2">
          <div className="bg-muted flex w-full flex-col items-center gap-4 border px-2 py-5 text-center">
            <TagIcon className="size-6" />
            <div className="flex flex-col items-center gap-3">
              <p className="text-foreground text-sm font-medium">
                {t.noOffersAvailable}
              </p>
              <p className="text-foreground text-sm">
                {t.offerSelection.tryAdjustingDates}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-0">
          {filteredOffers.map((offer, index) => (
            <Fragment key={`${offer.title}`}>
              <OfferSelectionItem
                key={`${offer.title}-${offer.validityPeriods[0]?.from}-${offer.validityPeriods[0]?.to}`}
                offer={offer}
                t={t}
                onSelect={handleOfferSelect}
              />
              {index !== filteredOffers.length - 1 && (
                <div className="h-px w-full bg-black/10" />
              )}
            </Fragment>
          ))}
        </div>
      )}
    </>
  );

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        className="bg-background shadow-200 max-h-[calc(50vh-5rem)] overflow-y-auto rounded-none border-none p-0"
        align="start"
        sideOffset={8}
        style={{ width: "var(--radix-popover-trigger-width)" }}
      >
        {selectionContent}
      </PopoverContent>
    </Popover>
  );
}

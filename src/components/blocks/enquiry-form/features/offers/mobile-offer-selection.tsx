"use client";

import { Fragment, useState } from "react";
import { Drawer } from "vaul";
import { useRoomsAndOffers } from "@/components/providers/rooms-and-offers-provider";
import { useEnquiryFormTranslations } from "../../i18n";
import type { Offer } from "@/shared-types";
import { OfferSelectionItem } from "./offer-selection-item";
import { useOfferTabs, OfferTabValue } from "./use-offer-tabs";
import { OfferTabs } from "./offer-tabs";
import { TagIcon } from "@phosphor-icons/react";

type OfferSelectionProps = {
  children: React.ReactNode;
  onOfferSelect?: (offer: Offer | null) => void;
  selectedOffer?: Offer | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function MobileOfferSelection({
  children,
  onOfferSelect,
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
}: OfferSelectionProps) {
  const t = useEnquiryFormTranslations();
  const { offers } = useRoomsAndOffers();
  const { tabs, activeTab, setActiveTab, filteredOffers, hasDatesSelected } =
    useOfferTabs(offers);

  const [internalOpen, setInternalOpen] = useState(false);
  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = externalOnOpenChange || setInternalOpen;

  const handleOfferSelect = (offer: Offer) => {
    onOfferSelect?.(offer);
    setOpen(false);
  };

  const selectionContent = (
    <>
      {hasDatesSelected && (
        <div className="bg-background sticky top-0 z-50 w-full">
          <OfferTabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={(value) => setActiveTab(value as OfferTabValue)}
          />
        </div>
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
            <Fragment
              key={`${offer.title}-${offer.validityPeriods[0]?.from}-${offer.validityPeriods[0]?.to}`}
            >
              <OfferSelectionItem
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
    <Drawer.Root open={open} onOpenChange={setOpen} shouldScaleBackground>
      <Drawer.Trigger asChild>{children}</Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-lg" />
        <Drawer.Content className="bg-background fixed right-0 bottom-0 left-0 z-100 flex max-h-[95svh] flex-col border-none">
          <div className="py-2">
            <Drawer.Handle />
          </div>
          <Drawer.Title className="bg-background border-border relative border-b px-4 py-5">
            {t.offerSelection.title}
          </Drawer.Title>

          <div className="flex-1 overflow-y-auto">{selectionContent}</div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

"use client";

import { Offer } from "@/shared-types";
import { CaretDownIcon } from "@phosphor-icons/react";
import Image from "next/image";

type SelectedOfferCardProps = {
  offer: Offer;
  onRemove?: () => void;
  onEdit?: () => void;
};

export function SelectedOfferCard({
  offer,
  onRemove,
  // onEdit,
}: SelectedOfferCardProps) {
  return (
    <div className="border-border hover:border-secondary flex flex-1 items-center justify-between gap-2 rounded-none border border-solid p-3 transition-colors lg:flex-1 lg:shrink-0 lg:px-4">
      <div className="flex min-w-0 flex-1 items-center gap-4 py-0">
        <div className="relative h-12 w-15 shrink-0 overflow-hidden rounded-none">
          <Image
            alt={offer.title}
            fill
            className="object-cover"
            sizes="60px 48px"
            src={offer.imageSrc || "/placeholder.png"}
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder.png";
            }}
          />
        </div>
        <div className="flex min-w-0 flex-col max-[380px]:max-w-32! max-md:max-w-40 md:flex-1">
          <span className="text-foreground truncate text-base leading-normal font-medium">
            {offer.title}
          </span>
        </div>
      </div>

      {/* Remove Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove?.();
        }}
        className="bg-destructive/10 hover:bg-destructive/20 mr-3 flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-none transition-colors"
      >
        <RemoveIcon />
        <span className="sr-only">Remove offer</span>
      </button>

      <div className="flex size-6 shrink-0 items-center justify-center">
        <CaretDownIcon className="text-primary size-6" />
      </div>
    </div>
  );
}

// Icons
const RemoveIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="13"
    height="14"
    viewBox="0 0 13 14"
    fill="none"
  >
    <path
      d="M12 2.85352H9.5V2.35352C9.5 1.95569 9.34196 1.57416 9.06066 1.29286C8.77936 1.01155 8.39782 0.853516 8 0.853516H5C4.60218 0.853516 4.22064 1.01155 3.93934 1.29286C3.65804 1.57416 3.5 1.95569 3.5 2.35352V2.85352H1C0.867392 2.85352 0.740215 2.90619 0.646447 2.99996C0.552679 3.09373 0.5 3.22091 0.5 3.35352C0.5 3.48612 0.552679 3.6133 0.646447 3.70707C0.740215 3.80084 0.867392 3.85352 1 3.85352H1.5V12.8535C1.5 13.1187 1.60536 13.3731 1.79289 13.5606C1.98043 13.7482 2.23478 13.8535 2.5 13.8535H10.5C10.7652 13.8535 11.0196 13.7482 11.2071 13.5606C11.3946 13.3731 11.5 13.1187 11.5 12.8535V3.85352H12C12.1326 3.85352 12.2598 3.80084 12.3536 3.70707C12.4473 3.6133 12.5 3.48612 12.5 3.35352C12.5 3.22091 12.4473 3.09373 12.3536 2.99996C12.2598 2.90619 12.1326 2.85352 12 2.85352ZM4.5 2.35352C4.5 2.22091 4.55268 2.09373 4.64645 1.99996C4.74021 1.90619 4.86739 1.85352 5 1.85352H8C8.13261 1.85352 8.25979 1.90619 8.35355 1.99996C8.44732 2.09373 8.5 2.22091 8.5 2.35352V2.85352H4.5V2.35352ZM10.5 12.8535H2.5V3.85352H10.5V12.8535ZM5.5 6.35352V10.3535C5.5 10.4861 5.44732 10.6133 5.35355 10.7071C5.25979 10.8008 5.13261 10.8535 5 10.8535C4.86739 10.8535 4.74021 10.8008 4.64645 10.7071C4.55268 10.6133 4.5 10.4861 4.5 10.3535V6.35352C4.5 6.22091 4.55268 6.09373 4.64645 5.99996C4.74021 5.90619 4.86739 5.85352 5 5.85352C5.13261 5.85352 5.25979 5.90619 5.35355 5.99996C5.44732 6.09373 5.5 6.22091 5.5 6.35352ZM8.5 6.35352V10.3535C8.5 10.4861 8.44732 10.6133 8.35355 10.7071C8.25979 10.8008 8.13261 10.8535 8 10.8535C7.86739 10.8535 7.74021 10.8008 7.64645 10.7071C7.55268 10.6133 7.5 10.4861 7.5 10.3535V6.35352C7.5 6.22091 7.55268 6.09373 7.64645 5.99996C7.74021 5.90619 7.86739 5.85352 8 5.85352C8.13261 5.85352 8.25979 5.90619 8.35355 5.99996C8.44732 6.09373 8.5 6.22091 8.5 6.35352Z"
      fill="#EB5252"
    />
  </svg>
);

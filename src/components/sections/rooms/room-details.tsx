"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { ReactNode, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Room } from "@/shared-types";
import { useBookingStore } from "@/stores/booking-store";
import useEmblaCarousel from "embla-carousel-react";
import {
  ArrowsOutSimpleIcon,
  CaretLeftIcon,
  CaretRightIcon,
  CheckCircleIcon,
  TagIcon,
  UsersIcon,
  XIcon,
} from "@phosphor-icons/react";
import { useCommonTranslations, useRoomsTranslations } from "@/lib/i18n";

type RoomDetailsProps = {
  room: Room;
  children: ReactNode;
};

export function RoomDetails({ room, children }: RoomDetailsProps) {
  const [open, setOpen] = useState(false);
  const [showMobileButtons, setShowMobileButtons] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const { setPrefilledRoom } = useBookingStore();

  const common = useCommonTranslations();
  const roomsT = useRoomsTranslations();

  const formatCapacity = (capacity: string) => {
    // Extract numbers from capacity string like "For 1-2 persons" or "Für 1–2 Personen"
    // Note: handles both hyphen (-) and en-dash (–)
    const match = capacity.match(/(\d+)[-–]?(\d+)?/);
    if (!match) return capacity;

    const min = parseInt(match[1]);
    const max = match[2] ? parseInt(match[2]) : null;

    const range = max ? `${min}–${max}` : `${min}`;

    return `${common.for} ${range} ${common.persons}`;
  };

  // Get all images for the carousel
  const allImages = room.images || [room.image];

  // Embla carousel
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
  });

  // Update selected index when carousel scrolls
  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedImageIndex(emblaApi.selectedScrollSnap());
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };

    emblaApi.on("select", onSelect);
    onSelect();

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  const scrollTo = (index: number) => {
    if (emblaApi) emblaApi.scrollTo(index);
  };

  const scrollPrev = () => {
    if (emblaApi) emblaApi.scrollPrev();
  };

  const scrollNext = () => {
    if (emblaApi) emblaApi.scrollNext();
  };

  const handleEnquiryClick = () => {
    setPrefilledRoom(room);
    setOpen(false); // Close the dialog
    // Wait for dialog to close before scrolling
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const enquirySection = document.getElementById("enquiry-form");
        if (enquirySection) {
          enquirySection.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    });
  };

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        setShowMobileButtons(true);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      queueMicrotask(() => setShowMobileButtons(false));
    }
  }, [open]);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent
          overlayClassName="bg-black/80 backdrop-blur-[10px]"
          showCloseButton={false}
          className="bg-primary-foreground z-150 max-h-[95dvh] max-w-none overflow-y-auto rounded-none border-none p-0 max-lg:top-auto max-lg:bottom-0 max-lg:max-h-dvh max-lg:translate-y-0 max-lg:rounded-none sm:max-w-[min(76rem,calc(100vw-5rem))] lg:gap-0"
        >
          {/* Header */}
          <DialogHeader className="border-muted bg-background sticky top-0 z-10 flex flex-row items-center justify-between border-b p-6">
            <DialogTitle className="text-foreground text-xl font-normal">
              {roomsT.roomInformation}
            </DialogTitle>
            <DialogClose className="cursor-pointer">
              <span className="sr-only">{roomsT.closeDetails}</span>
              <XIcon className="size-6" />
            </DialogClose>
          </DialogHeader>

          {/* Content */}
          <div className="bg-primary-foreground flex flex-col max-lg:pb-24 lg:max-h-[calc(95dvh-4.5rem)]">
            {/* Image Carousel Section */}
            <div className="relative shrink-0 pb-3 lg:aspect-video lg:h-auto lg:w-full lg:pb-8">
              <div
                className="h-full overflow-hidden rounded-none"
                ref={emblaRef}
              >
                <div className="flex h-full">
                  {allImages.map((imageSrc, index) => (
                    <div
                      key={index}
                      className="relative aspect-6/5 w-full flex-[0_0_100%] lg:aspect-auto lg:h-full"
                    >
                      <Image
                        fill
                        src={imageSrc}
                        alt={`${room.name} - ${roomsT.image} ${index + 1}`}
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation arrows - only visible on lg screens and when multiple images */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={scrollPrev}
                    aria-label={roomsT.previousImage}
                    disabled={!canScrollPrev}
                    className="absolute top-1/2 left-6 hidden size-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-sm transition-all hover:bg-white/20 disabled:pointer-events-none disabled:opacity-50 lg:flex"
                  >
                    <CaretLeftIcon
                      className="text-background size-6"
                      weight="regular"
                    />
                    <span className="sr-only">{roomsT.previousImage}</span>
                  </button>

                  <button
                    onClick={scrollNext}
                    aria-label={roomsT.nextImage}
                    disabled={!canScrollNext}
                    className="absolute top-1/2 right-6 hidden size-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-sm transition-all hover:bg-white/20 disabled:pointer-events-none disabled:opacity-50 lg:flex"
                  >
                    <CaretRightIcon
                      className="text-background size-6"
                      weight="regular"
                    />
                    <span className="sr-only">{roomsT.nextImage}</span>
                  </button>
                </>
              )}

              {/* Pagination dots */}
              {allImages.length > 1 && (
                <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 transform gap-3 lg:bottom-12">
                  <div className="h-1 w-50 flex-1 rounded-full bg-white/50">
                    <div
                      className="h-1 rounded-full bg-white transition-all duration-300"
                      style={{
                        width: `${((selectedImageIndex + 1) / allImages.length) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="text-foreground flex flex-1 flex-col gap-5 px-4 py-6 lg:px-6 lg:pt-0 lg:pb-8">
              <p className="font-title text-foreground text-3xl leading-[140%] font-normal uppercase">
                {room.name}
              </p>

              <div className="bg-muted h-px w-full shrink-0"></div>

              {/* Room Details */}
              <div className="flex flex-col gap-1 lg:grid lg:grid-cols-2">
                <div className="flex items-center gap-4 py-2">
                  <UsersIcon className="text-primary size-6" />
                  <p className="leading-[140%] font-normal">
                    {formatCapacity(room.capacity)}
                  </p>
                </div>

                <div className="flex items-center gap-4 py-2">
                  <ArrowsOutSimpleIcon className="text-primary size-6" />
                  <p className="leading-[140%] font-normal">{room.area}</p>
                </div>

                <div className="flex items-center gap-4 py-2">
                  <TagIcon className="text-primary size-6" />
                  <p className="leading-[140%] font-normal">
                    {common.from}{" "}
                    {room.price.toLocaleString(common.localeString, {
                      style: "currency",
                      currency: "EUR",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                    {common.perNightFor2}
                  </p>
                </div>
              </div>

              <div className="bg-muted h-px w-full shrink-0"></div>

              <p className="text-lg leading-[150%]">{room.longDescription}</p>

              {/* Included Services */}
              {room.includedServices.length > 0 && (
                <div className="text-lg">
                  <p className="mb-3 leading-[150%] font-normal">
                    {roomsT.includedServices}
                  </p>
                  <ul className="space-y-2">
                    {room.includedServices.map((service, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircleIcon
                          weight="fill"
                          className="text-primary mt-1 size-5 shrink-0"
                        />
                        <span className="text-lg leading-[150%]">
                          {service}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Desktop Action Buttons */}
              <div className="flex gap-4 pt-5 max-lg:hidden">
                <Button className="w-full" onClick={handleEnquiryClick}>
                  {common.enquiry}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Mobile Floating Action Buttons */}
      {open &&
        showMobileButtons &&
        createPortal(
          <div
            className="bg-background fixed right-0 bottom-0 left-0 flex flex-col gap-4 px-4 py-5 transition-discrete delay-100 duration-200 lg:hidden starting:opacity-0"
            style={{
              boxShadow: "0 -4px 20px 0 rgba(42, 60, 69, 0.15)",
              zIndex: 175,
              pointerEvents: "auto",
            }}
          >
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleEnquiryClick();
              }}
              className="w-full"
            >
              {common.enquiry}
            </Button>
          </div>,
          document.body,
        )}
    </>
  );
}

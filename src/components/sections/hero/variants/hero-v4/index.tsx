"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HeroImages } from "../../hero-images";
import { HeroBookingForm } from "./hero-booking-form";
import { useNavTranslations, useCommonTranslations } from "@/lib/i18n/hooks";
import { useHeroContent } from "@/contents";
import { getHotelProfile } from "@/hotel-config";
import { track } from "@vercel/analytics/react";
import { cn } from "@/lib/utils";

interface HeroV4Props {
  selectedIndex: number;
  carouselApi: {
    scrollTo: (index: number) => void;
    resetAutoplay: () => void;
  } | null;
  onThumbnailClick: (index: number) => void;
  onSlideChange: (index: number) => void;
  onApiReady: (api: {
    scrollTo: (index: number) => void;
    resetAutoplay: () => void;
  }) => void;
}

export function HeroV4({
  selectedIndex,
  carouselApi,
  onThumbnailClick,
  onSlideChange,
  onApiReady,
}: HeroV4Props) {
  const nav = useNavTranslations();
  const hero = useHeroContent();
  const common = useCommonTranslations();
  const hotelProfile = getHotelProfile();

  const navItems = [
    { label: nav.rooms, link: "#rooms" },
    { label: nav.gallery, link: "#gallery" },
  ];

  return (
    <section className="bg-background relative z-10 flex h-svh w-full flex-col">
      {/* Top Navigation */}
      <nav className="border-muted relative z-20 border-b">
        <div className="flex items-center justify-between px-4 py-4 lg:px-4">
          {/* Logo */}
          <div className="shrink-0">
            <Image
              width={100}
              height={55}
              unoptimized
              alt=""
              src={hotelProfile.logo.src}
              className="max-lg:hidden"
            />
            <Image
              width={72}
              height={40}
              unoptimized
              alt=""
              src={hotelProfile.logo.mobileSrc}
              className="lg:hidden"
            />
          </div>

          {/* Desktop Menu */}
          <div className="absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-2 lg:flex">
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={item.link ?? "#"}
                className="text-primary hover:bg-primary/10 rounded-2 px-5 py-4 text-base leading-[125%] uppercase transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Direct Enquiry Button - Mobile */}
            <Button variant={"outline-primary"} asChild className="lg:hidden">
              <a
                href="#enquiry-form"
                onClick={(e) => {
                  e.preventDefault();
                  track("cta-enquiry-mobile");
                  const enquirySection =
                    document.getElementById("enquiry-form");
                  if (enquirySection) {
                    enquirySection.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }
                }}
              >
                {nav.enquiryNow}
              </a>
            </Button>

            {/* Direct Enquiry Button - Desktop */}
            <Button
              variant={"outline-primary"}
              asChild
              className="max-lg:hidden"
            >
              <a
                href="#enquiry-form"
                onClick={(e) => {
                  e.preventDefault();
                  track("cta-enquiry-desktop");
                  const enquirySection =
                    document.getElementById("enquiry-form");
                  if (enquirySection) {
                    enquirySection.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }
                }}
              >
                {nav.enquiryNow}
              </a>
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative flex flex-1 flex-col">
        <div className="flex h-full flex-col gap-5 px-4 py-5 lg:flex-row lg:gap-5 lg:py-0 lg:pb-4">
          {/* Title and Description Row */}
          <div className="flex flex-col gap-5 lg:w-105 lg:justify-end lg:gap-40">
            <div className="contents flex-col lg:flex lg:gap-6 lg:px-3">
              <h1 className="font-title text-display-2 text-start font-medium">
                {hero.title}
              </h1>
              <p className="w-full text-start text-base leading-normal opacity-80 max-lg:hidden">
                {hero.subtitle}
              </p>
            </div>
            {/* Booking Form */}
            <div className="mx-auto w-full max-w-360">
              <HeroBookingForm hideGuestSelectionInMobile />
            </div>
          </div>

          {/* Hero Images Section */}

          <div className="relative flex-1 overflow-hidden max-lg:h-50">
            <HeroImages
              images={hero.images}
              onSlideChange={onSlideChange}
              onApiReady={onApiReady}
            />

            <div className="absolute max-lg:bottom-0 max-lg:left-1/2 max-lg:-translate-x-1/2 lg:right-0 lg:bottom-0">
              <div className="relative z-20 mx-auto flex w-fit gap-2 p-3">
                {hero.images.map((image, index) => (
                  <button
                    type="button"
                    key={index}
                    aria-label={`Go to slide ${index + 1}`}
                    onClick={() => onThumbnailClick(index)}
                    className={cn(
                      "bg-muted relative h-1 w-8 cursor-pointer overflow-hidden border-none transition-all delay-100 duration-300",
                      index === selectedIndex ? "" : "opacity-50",
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HeroBookingForm } from "./hero-booking-form";
import { useNavTranslations, useCommonTranslations } from "@/lib/i18n/hooks";
import { useHeroContent } from "@/contents";
import { getHotelProfile } from "@/hotel-config";
import { track } from "@vercel/analytics/react";

interface HeroV7Props {
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

export function HeroV7({
  selectedIndex,
  carouselApi,
  onThumbnailClick,
  onSlideChange,
  onApiReady,
}: HeroV7Props) {
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
              width={130}
              height={71}
              unoptimized
              alt=""
              src={hotelProfile.logo.src}
              className="invert max-lg:hidden"
            />
            <Image
              width={80}
              height={80}
              unoptimized
              alt=""
              src={hotelProfile.logo.mobileSrc}
              className="invert lg:hidden"
            />
          </div>

          {/* Desktop Menu */}
          <div className="absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-2 lg:flex">
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={item.link ?? "#"}
                className="hover:bg-primary/10 rounded-2 px-5 py-4 text-base leading-[125%] uppercase transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Enquiry Button - Mobile */}
            <Button variant={"outline-primary"} asChild className="lg:hidden">
              <a
                href="#enquiry-form"
                onClick={() => track("jetzt-anfragen-mobile", { route: "/" })}
              >
                {nav.enquiryNow}
              </a>
            </Button>

            {/* Enquiry Button - Desktop */}
            <Button
              variant={"outline-primary"}
              asChild
              className="max-lg:hidden"
            >
              <a
                href="#enquiry-form"
                onClick={() => track("jetzt-anfragen-desktop", { route: "/" })}
              >
                {nav.enquiryNow}
              </a>
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative flex flex-1 flex-col">
        <div className="flex h-full flex-col gap-5 px-4 py-5 lg:py-6 2xl:gap-5 2xl:pb-4">
          {/* Title and Description Row */}
          <div className="flex gap-30">
            <div className="flex flex-1 flex-row gap-30">
              <h1 className="font-title text-display-2 flex-1 text-center font-normal lg:text-start">
                {hero.title}
              </h1>
              <p className="flex-1 max-lg:hidden">{hero.subtitle}</p>
            </div>
          </div>

          {/* Video Background Section - Desktop only, Image on Mobile */}
          <div className="relative flex-1 overflow-hidden max-lg:h-50">
            {/* Mobile: Static Image */}
            <div className="absolute inset-0 lg:hidden">
              <video
                src="/heroVideo.webm"
                poster="/thumb.jpg"
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>

            {/* Desktop: Video */}
            <div className="absolute inset-0 max-lg:hidden">
              <video
                src="/heroVideo.webm"
                poster="/thumb.jpg"
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Booking Form */}
          <div className="mx-auto w-full max-w-360">
            <HeroBookingForm hideGuestSelectionInMobile />
          </div>
        </div>
      </div>
    </section>
  );
}

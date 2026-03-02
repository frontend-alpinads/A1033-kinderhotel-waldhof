"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HeroImages } from "../../hero-images";
import { HeroBookingForm } from "./hero-booking-form";
import { useNavTranslations, useCommonTranslations } from "@/lib/i18n/hooks";
import { useLocale } from "@/lib/i18n/context";
import { useHeroContent } from "@/contents";
import { getHotelProfile } from "@/hotel-config";
import { track } from "@vercel/analytics/react";
import { cn } from "@/lib/utils";
import {
  StarIcon,
  SealCheckIcon,
  CheckCircleIcon,
} from "@phosphor-icons/react";
import { testimonialsData } from "@/data/testimonials";

interface HeroV10Props {
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

export function HeroV10({
  selectedIndex,
  carouselApi,
  onThumbnailClick,
  onSlideChange,
  onApiReady,
}: HeroV10Props) {
  const nav = useNavTranslations();
  const hero = useHeroContent();
  const common = useCommonTranslations();
  const hotelProfile = getHotelProfile();
  const locale = useLocale();

  // Get the testimonial with highest rating and shortest text
  const testimonial = useMemo(() => {
    const maxRating = Math.max(...testimonialsData.map((t) => t.rating));
    const highestRated = testimonialsData.filter((t) => t.rating === maxRating);
    return highestRated.reduce((shortest, current) =>
      current.text[locale].length < shortest.text[locale].length
        ? current
        : shortest,
    );
  }, [locale]);

  const navItems = [
    { label: nav.rooms, link: "#rooms" },
    { label: nav.offers, link: "#offers" },
    { label: nav.gallery, link: "#gallery" },
  ];

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <section className="bg-background relative z-10 flex h-svh w-full flex-col">
      {/* Top Navigation */}
      <nav className="border-primary/15 bg-background relative z-20 border-b">
        <div className="flex items-center justify-between px-4 py-4 lg:py-7">
          {/* Logo - Centered on desktop */}
          <div className="shrink-0 lg:absolute lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2">
            <Image
              width={167}
              height={71}
              unoptimized
              alt=""
              src={hotelProfile.logo.src}
              className="max-lg:hidden"
            />
            <Image
              width={110}
              height={47}
              unoptimized
              alt=""
              src={hotelProfile.logo.src}
              className="lg:hidden"
            />
          </div>

          {/* Desktop Menu - Left aligned */}
          <div className="hidden items-center lg:flex">
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={item.link ?? "#"}
                className="text-primary hover:bg-primary/10 px-5 py-3 text-base font-medium uppercase transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Call Now Button */}
            <Button variant={"outline-primary"} asChild>
              <a href="tel:+390471354199" onClick={() => track("cta-call-now")}>
                {nav.callNow}
              </a>
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative flex flex-1 flex-col">
        {/* Hero Images Section */}
        <div className="relative flex-1 overflow-hidden max-lg:h-[50vh]">
          <HeroImages
            images={hero.images}
            onSlideChange={onSlideChange}
            onApiReady={onApiReady}
          />

          {/* Carousel Indicators */}
          {hero.images.length > 1 && (
            <div className="absolute bottom-0 max-lg:left-1/2 max-lg:-translate-x-1/2 lg:right-0">
              <div className="relative z-20 mx-auto flex w-fit gap-2 p-3">
                {hero.images.map((_, index) => (
                  <button
                    type="button"
                    key={index}
                    aria-label={`Go to slide ${index + 1}`}
                    onClick={() => onThumbnailClick(index)}
                    className={cn(
                      "bg-background relative h-1 cursor-pointer overflow-hidden border-none transition-all delay-100 duration-300",
                      index === selectedIndex
                        ? "w-8"
                        : "opacity-50 max-lg:w-1 lg:w-8",
                    )}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Desktop Testimonial Card - Overlay */}
          <div className="absolute bottom-8 left-5 z-10 hidden lg:block">
            <div className="bg-background shadow-100 w-90 px-6 py-5">
              <div className="flex flex-col gap-3">
                {/* Stars and Verified Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        weight="fill"
                        className={cn(
                          "size-3.5",
                          i < testimonial.rating
                            ? "text-foreground"
                            : "text-foreground/30",
                        )}
                      />
                    ))}
                  </div>
                  <div className="bg-foreground/5 flex items-center gap-1.5 px-2 py-1">
                    <CheckCircleIcon
                      weight="fill"
                      className="size-3.5 text-green-600"
                    />
                    <span className="text-foreground/50 text-xs">
                      {common.verifiedGuest}
                    </span>
                  </div>
                </div>

                {/* Quote */}
                <p className="text-foreground line-clamp-3 text-sm leading-relaxed">
                  &ldquo;{testimonial.text[locale]}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-2">
                  <div className="bg-secondary flex size-8 items-center justify-center">
                    <span className="text-background text-xs font-medium">
                      {getInitials(testimonial.name[locale])}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-foreground text-xs leading-tight font-medium">
                      {testimonial.name[locale]}
                    </span>
                    <span className="text-foreground/45 text-[10px] leading-tight">
                      {testimonial.country[locale]}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <HeroBookingForm
          selectedIndex={selectedIndex}
          testimonial={testimonial}
        />
      </div>
    </section>
  );
}

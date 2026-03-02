"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HeroImages } from "../../hero-images";
import { useNavTranslations, useCommonTranslations } from "@/lib/i18n/hooks";
import { useHeroContent } from "@/contents";
import { getHotelProfile } from "@/hotel-config";
import { track } from "@vercel/analytics/react";
import { cn } from "@/lib/utils";
import { HeroBookingForm } from "./hero-booking-form";
import { StarIcon } from "@phosphor-icons/react";

interface HeroV13Props {
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

export function HeroV13({
  selectedIndex,
  carouselApi,
  onThumbnailClick,
  onSlideChange,
  onApiReady,
}: HeroV13Props) {
  const nav = useNavTranslations();
  const hero = useHeroContent();
  const common = useCommonTranslations();
  const hotelProfile = getHotelProfile();

  const navItems = [
    { label: nav.offers, link: "#offers" },
    { label: nav.rooms, link: "#rooms" },
    { label: nav.gallery, link: "#gallery" },
  ];

  const goToEnquiry = () => {
    const enquirySection = document.getElementById("enquiry-form");
    if (enquirySection) {
      enquirySection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <section className="bg-background relative z-10 flex h-svh w-full flex-col">
      <div className="absolute inset-0 flex-1 overflow-hidden max-lg:hidden">
        <HeroImages
          images={hero.images}
          onSlideChange={onSlideChange}
          onApiReady={onApiReady}
        />

        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2"
          style={{
            background:
              "linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.6) 100%)",
          }}
        ></div>

        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-1/4"
          style={{
            background:
              "linear-gradient(0deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.6) 100%)",
          }}
        ></div>
      </div>

      {/* Top Navigation */}
      <nav className="relative z-20">
        <div className="flex items-center justify-between px-4 py-4 lg:px-4 lg:py-7">
          {/* Logo */}
          <div className="shrink-0 lg:absolute lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2">
            <Image
              width={147}
              height={71}
              unoptimized
              alt=""
              src={hotelProfile.logo.src}
              className="brightness-0 invert max-lg:hidden"
            />
            <Image
              width={84}
              height={47}
              unoptimized
              alt=""
              src={hotelProfile.logo.mobileSrc}
              className="lg:hidden"
            />
          </div>

          {/* Desktop Menu */}
          <div className="hidden items-center gap-2 lg:flex">
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={item.link ?? "#"}
                className="hover:bg-primary/10 text-primary lg:text-background px-5 py-4 text-base leading-[125%] font-medium uppercase transition-colors"
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
                  goToEnquiry();
                  track("cta-enquiry-clicked", {
                    location: "hero",
                  });
                }}
              >
                {nav.enquiryNow}
              </a>
            </Button>

            {/* Direct Enquiry Button - Desktop */}
            <Button variant={"white"} asChild className="max-lg:hidden">
              <a
                href="#enquiry-form"
                onClick={(e) => {
                  e.preventDefault();
                  goToEnquiry();
                  track("cta-enquiry-clicked", {
                    location: "hero",
                  });
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
        <div className="flex h-full flex-col gap-5 p-3 pt-0 lg:justify-end lg:px-5 lg:pt-0 lg:pb-6">
          {/* Title and Description Row */}
          <div className="relative flex-1 overflow-hidden max-lg:h-50 lg:hidden">
            <HeroImages images={hero.images} />

            <div
              className="pointer-events-none absolute inset-0 lg:hidden"
              style={{
                background:
                  "linear-gradient(180deg, rgba(0, 0, 0, 0.00) 65.06%, rgba(0, 0, 0, 0.50) 85.08%)",
              }}
            ></div>

            {hero.images.length > 1 && (
              <div className="absolute max-lg:bottom-3 max-lg:left-1/2 max-lg:-translate-x-1/2 lg:right-0 lg:bottom-0 lg:hidden">
                <div className="relative z-20 mx-auto flex w-fit gap-2 p-3">
                  {hero.images.map((image, index) => (
                    <button
                      type="button"
                      key={index}
                      aria-label={`Go to slide ${index + 1}`}
                      onClick={() => onThumbnailClick(index)}
                      className={cn(
                        "bg-muted relative h-1 w-8 cursor-pointer overflow-hidden border-none transition-all delay-100 duration-300 before:absolute before:inset-0 before:z-10 before:border before:border-white before:transition-opacity before:content-['']",
                        index === selectedIndex ? "" : "opacity-50",
                      )}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="absolute inset-x-3 bottom-14 flex flex-col gap-5 lg:hidden">
              <h1 className="font-title text-display-2 text-background text-center font-medium">
                {hero.title}
              </h1>

              <Button
                variant={"default"}
                className="lg:w-fit lg:min-w-75"
                onClick={goToEnquiry}
              >
                {nav.enquiryNow}
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-8 max-lg:hidden">
            <div className="flex flex-col gap-5 max-lg:order-first max-lg:hidden lg:flex-row lg:items-start lg:gap-16">
              <div className="contents flex-col gap-5 max-lg:hidden lg:flex">
                <h1 className="font-title text-display-2 lg:text-background text-start font-medium">
                  {hero.title}
                </h1>

                <p className="text-background flex-1 max-lg:hidden">
                  {hero.subtitle}
                </p>
              </div>
              <div className="bg-black/20 p-3 backdrop-blur-md">
                <HeroBookingForm />
              </div>
            </div>

            <div className="h-px w-full bg-white opacity-40 max-lg:hidden"></div>

            <div className="flex justify-between gap-8 max-lg:hidden">
              {/* Slide thumbs */}
              {hero.images.length > 1 && (
                <div className="border border-white/5 bg-white/10 p-2 backdrop-blur-xl">
                  <div className="relative z-20 mx-auto flex w-fit gap-2">
                    {hero.images.map((image, index) => (
                      <button
                        type="button"
                        key={index}
                        onClick={() => onThumbnailClick(index)}
                        aria-label={`Go to slide ${index + 1}`}
                        className={cn(
                          "bg-muted relative h-16 w-20 cursor-pointer overflow-hidden border-none transition-all delay-100 duration-300 before:absolute before:inset-0 before:z-10 before:border before:border-white before:transition-opacity before:content-['']",
                          index === selectedIndex
                            ? ""
                            : "before:border-white/0",
                        )}
                      >
                        <Image
                          fill
                          src={image}
                          alt=""
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Social Proof */}
              {hero.socialProof && (
                <a
                  href={hero.socialProof.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col justify-center gap-2 border border-white/5 bg-white/10 px-5 py-2 backdrop-blur-xl transition-colors hover:bg-white/20"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-background flex gap-2">
                      {Array.from({
                        length: hero.socialProof.maxRating ?? 5,
                      }).map((_, index) => (
                        <StarIcon
                          key={index}
                          weight="fill"
                          className="size-4.5"
                        />
                      ))}
                    </span>
                    {hero.socialProof.rating && (
                      <span className="text-background">
                        {hero.socialProof.rating}
                      </span>
                    )}
                  </span>
                  {hero.socialProof.reviewsText && (
                    <span className="text-background">
                      {hero.socialProof.reviewsText.replace(
                        "{count}",
                        String(hero.socialProof.totalReviews ?? 0),
                      )}
                    </span>
                  )}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

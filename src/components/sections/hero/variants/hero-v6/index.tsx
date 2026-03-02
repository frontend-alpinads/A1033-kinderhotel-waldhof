"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HeroImages } from "../../hero-images";
import { cn } from "@/lib/utils";
import { useNavTranslations, useCommonTranslations } from "@/lib/i18n/hooks";
import { useHeroContent } from "@/contents";
import { getHotelProfile } from "@/hotel-config";
// import { LanguageSwitcher } from "../language-switcher";
import { track } from "@vercel/analytics/react";

interface HeroV6Props {
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

export function HeroV6({
  selectedIndex,
  carouselApi,
  onThumbnailClick,
  onSlideChange,
  onApiReady,
}: HeroV6Props) {
  const nav = useNavTranslations();
  const hero = useHeroContent();
  const common = useCommonTranslations();
  const hotelProfile = getHotelProfile();

  const navItems = [
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
    <div className="relative z-10 flex min-h-svh flex-col lg:h-screen">
      <section className="relative z-10 flex h-full w-full flex-1 flex-col overflow-hidden">
        {/* Background Image Carousel */}
        <HeroImages
          images={hero.images}
          onSlideChange={onSlideChange}
          onApiReady={onApiReady}
        />

        {/* Overlay */}
        <div
          className="pointer-events-none absolute top-0 right-0 left-0 h-1/3 max-lg:h-40"
          style={{
            background:
              "linear-gradient(180deg, rgba(0, 0, 0, 0.40) 0%, rgba(0, 0, 0, 0.00) 100%)",
          }}
        ></div>
        <div
          className="pointer-events-none absolute right-0 bottom-0 left-0 h-1/2 max-lg:h-[90%]"
          style={{
            background:
              "linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.50) 57.09%)",
          }}
        ></div>

        {/* Navigation */}
        <div className="relative z-50">
          <nav className="relative z-150 flex items-center justify-between px-8 py-6 max-lg:p-5">
            <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-6 max-lg:hidden">
              <Image
                width={147}
                height={71}
                unoptimized
                alt=""
                src={hotelProfile.logo.src}
                className=""
              />
            </div>

            <Image
              width={80}
              height={80}
              unoptimized
              alt=""
              src={hotelProfile.logo.mobileSrc}
              className="lg:hidden"
            />

            <div className="relative flex items-center max-lg:hidden">
              <div className="flex items-center gap-0">
                {navItems.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <Link
                      href={item.link ?? "#"}
                      className="text-primary-foreground hover:bg-background/10 rounded-2 px-5 py-4 text-base leading-[125%] uppercase"
                    >
                      {item.label}
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* <div className="hidden lg:block">
                <LanguageSwitcher />
              </div>
              <div className="block lg:hidden">
                <LanguageSwitcher ghost />
              </div> */}

              {/* Direct Booking Button - Mobile */}
              <Button
                variant={"white"}
                onClick={goToEnquiry}
                className="lg:hidden"
              >
                {nav.enquiryNow}
              </Button>

              {/* Direct Booking Button - Desktop */}
              <Button
                variant={"white"}
                onClick={goToEnquiry}
                className="max-lg:hidden"
              >
                {nav.enquiryNow}
              </Button>
            </div>
          </nav>
        </div>

        {/* Texts */}
        <div className="relative z-10 mx-auto flex w-full flex-1 flex-col justify-end px-4 pb-3 lg:max-w-360 lg:items-center lg:px-13 lg:pb-8">
          <h1 className="font-title text-background text-display mb-5 text-center font-normal lg:mb-10">
            {hero.title}
          </h1>

          <div className="bg-black/20 p-3 backdrop-blur-md">
            <Button variant={"booking"} asChild className="w-full lg:w-120">
              <a
                href="#enquiry-form"
                onClick={() =>
                  track("cta-enquiry-clicked", {
                    location: "hero",
                  })
                }
              >
                {nav.enquiryNow}
              </a>
            </Button>
          </div>

          <div className="bg-glass relative z-20 mx-auto mt-4 flex w-fit gap-2 border border-white/10 p-3 lg:mt-8">
            {hero.images.map((image, index) => (
              <button
                type="button"
                key={index}
                aria-label={`Go to slide ${index + 1}`}
                onClick={() => onThumbnailClick(index)}
                className={cn(
                  "bg-background relative h-1.5 cursor-pointer overflow-hidden rounded-full border-none transition-all delay-100 duration-300",
                  index === selectedIndex ? "w-8" : "w-1.5 opacity-50",
                )}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

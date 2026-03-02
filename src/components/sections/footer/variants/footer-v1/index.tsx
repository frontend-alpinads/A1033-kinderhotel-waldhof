"use client";

import Link from "next/link";
import Image from "next/image";
import { useCommonTranslations, useFooterTranslations } from "@/lib/i18n/hooks";
import { getHotelProfile, HOTEL_CONFIG } from "@/hotel-config";
import { PRIVACY_SLUG_BY_LOCALE } from "@/lib/routes/registry";
import type { Locale } from "@/lib/i18n/config";

export function FooterV1() {
  const footer = useFooterTranslations();
  const { locale } = useCommonTranslations();
  const hotelProfile = getHotelProfile();

  const imprintUrl = HOTEL_CONFIG.legal.imprint[locale as Locale];
  const privacyUrl = HOTEL_CONFIG.legal.privacy[locale as Locale];

  return (
    <>
      <footer className="bg-secondary text-primary-foreground border-background relative border-[1rem] pb-10 lg:border-[2rem] lg:pb-15">
        <div className="bg-background mx-auto w-fit px-5 py-4 max-lg:px-1.5">
          <Image
            width={hotelProfile.logo.mobile.width}
            height={hotelProfile.logo.mobile.height}
            unoptimized
            alt=""
            className="lg:hidden"
            src={hotelProfile.logo.src}
          />
          <Image
            width={hotelProfile.logo.desktop.width}
            height={hotelProfile.logo.desktop.height}
            unoptimized
            alt=""
            className="hidden lg:block"
            src={hotelProfile.logo.src}
          />
        </div>
        <div className="relative overflow-hidden pt-8 max-lg:pt-10">
          <div className="flex flex-col gap-10 lg:gap-10">
            {/* Main Content */}
            <div className="flex flex-col items-start gap-0 lg:grid lg:grid-cols-2 lg:gap-0">
              {/* Left Column - Logo & Info */}
              <div className="flex w-full flex-row gap-6 border-t border-r border-white/20 px-8 py-16 max-lg:px-4 max-lg:py-6 lg:h-full lg:justify-between lg:border-b">
                <div className="flex flex-col gap-5 max-lg:flex-1">
                  <p className="text-base leading-normal font-medium">
                    {hotelProfile.hotelName}
                  </p>

                  <p className="text-base leading-normal font-light opacity-80">
                    {hotelProfile.address.line1} <br />
                    {hotelProfile.address.line2}
                  </p>
                </div>
                <div className="flex flex-col gap-5 max-lg:flex-1">
                  <p className="text-base leading-normal font-medium">
                    {footer.contact.title}
                  </p>

                  <a
                    href={`mailto:${hotelProfile.contact.email}`}
                    className="text-base leading-normal font-light opacity-80 hover:underline hover:opacity-100"
                  >
                    {hotelProfile.contact.email}
                  </a>
                  <a
                    href={hotelProfile.contact.phone.href}
                    className="text-base leading-normal font-light opacity-80 hover:underline hover:opacity-100"
                  >
                    {hotelProfile.contact.phone.display}
                  </a>
                </div>
              </div>

              {/* Right Columns */}
              <div className="flex w-full flex-col gap-10 border-t border-b border-white/20 px-8 py-16 max-lg:px-4 max-lg:py-6 lg:w-190 lg:flex-1 lg:flex-row lg:items-start lg:justify-between">
                <div className="grid grid-cols-2 lg:contents">
                  {/* Links Column */}
                  <div className="flex w-full flex-col gap-5 text-base leading-normal font-normal lg:w-50">
                    <p className="text-base leading-normal font-medium">
                      {footer.links.title}
                    </p>
                    <Link
                      href="#rooms"
                      className="font-light opacity-80 hover:opacity-100"
                    >
                      {footer.links.rooms}
                    </Link>
                    <Link
                      href="#gallery"
                      className="font-light opacity-80 hover:opacity-100"
                    >
                      {footer.links.gallery}
                    </Link>
                  </div>

                  {/* Legals Column */}
                  <div className="flex w-full flex-col gap-5 text-base leading-normal font-normal lg:w-[200px]">
                    <p className="text-base leading-normal font-medium">
                      {footer.legal.title}
                    </p>
                    <a
                      target="_blank"
                      href={imprintUrl}
                      className="font-light opacity-80 hover:opacity-100"
                    >
                      {footer.legal.imprint}
                    </a>
                    <a
                      target="_blank"
                      href={privacyUrl}
                      className="font-light opacity-80 hover:opacity-100"
                    >
                      {footer.legal.privacy}
                    </a>
                    <Link
                      href={`${PRIVACY_SLUG_BY_LOCALE[locale as Locale]}`}
                      className="font-light opacity-80 hover:opacity-100"
                    >
                      {footer.legal.privacySettings}
                    </Link>
                  </div>
                </div>

                {/* Contact Column */}
                <div className="flex w-full flex-col gap-5 lg:w-75">
                  <p className="text-base leading-normal font-medium">
                    {footer.social.title}
                  </p>
                  {/* Social Media */}
                  <div className="flex flex-col gap-3 text-base leading-normal font-normal">
                    {hotelProfile.social.instagram && (
                      <a
                        href={hotelProfile.social.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-light opacity-80 hover:opacity-100"
                      >
                        Instagram
                      </a>
                    )}
                    {hotelProfile.social.facebook && (
                      <a
                        href={hotelProfile.social.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-light opacity-80 hover:opacity-100"
                      >
                        Facebook
                      </a>
                    )}
                    {hotelProfile.social.youtube && (
                      <a
                        href={hotelProfile.social.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-light opacity-80 hover:opacity-100"
                      >
                        YouTube
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="flex flex-col gap-6 px-4 lg:px-8">
              <div className="flex flex-col-reverse items-start gap-6 lg:flex-row lg:justify-between">
                <p className="text-base leading-normal font-normal max-lg:order-last">
                  {footer.copyright}
                </p>
                <div className="flex flex-col gap-3">
                  <p className="text-base leading-normal font-normal">
                    {footer.credits}
                  </p>
                  <a
                    href={hotelProfile.credits.alpinAdsUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                    className="flex items-center gap-2"
                  >
                    <Image
                      src="/alpin-ads.svg"
                      alt=""
                      width={164}
                      height={29}
                    />
                    <span className="sr-only">Visit Alpin Ads website</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

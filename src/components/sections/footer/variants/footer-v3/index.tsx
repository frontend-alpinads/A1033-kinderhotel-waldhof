"use client";

import Link from "next/link";
import Image from "next/image";
import { EnvelopeIcon, PhoneIcon } from "@phosphor-icons/react";
import { useCommonTranslations, useFooterTranslations } from "@/lib/i18n/hooks";
import { getHotelProfile, HOTEL_CONFIG } from "@/hotel-config";
import { PRIVACY_SLUG_BY_LOCALE } from "@/lib/routes/registry";
import type { Locale } from "@/lib/i18n/config";
import { CopyToClipboard } from "../../copy-to-clipboard";

export function FooterV3() {
  const footer = useFooterTranslations();
  const { locale } = useCommonTranslations();
  const hotelProfile = getHotelProfile();

  const imprintUrl = HOTEL_CONFIG.legal.imprint[locale as Locale];
  const privacyUrl = HOTEL_CONFIG.legal.privacy[locale as Locale];

  const IMAGES = [
    "/footer/footer-1.png",
    "/footer/footer-2.png",
    "/footer/footer-3.png",
    "/footer/footer-4.png",
  ];

  return (
    <>
      <div className="grid w-full grid-cols-2 lg:grid-cols-4">
        {IMAGES.map((src, index) => (
          <div
            key={index}
            className="relative aspect-square w-full lg:aspect-6/5"
          >
            <Image src={src} alt="" fill />
          </div>
        ))}
      </div>

      <footer className="bg-card text-primary-foreground relative px-4 py-12.5 lg:px-12.5 lg:py-16">
        <div className="relative overflow-hidden">
          <div className="flex flex-col gap-16 lg:gap-10">
            {/* Main Content */}
            <div className="flex flex-col items-start gap-10 lg:flex-row lg:justify-between lg:gap-0">
              {/* Left Column - Logo & Info */}
              <div className="flex w-full flex-col gap-6 max-lg:items-center">
                <Image
                  width={hotelProfile.logo.desktop.width}
                  height={hotelProfile.logo.desktop.height}
                  unoptimized
                  alt=""
                  src={hotelProfile.logo.src}
                  className="brightness-0 invert"
                />

                <div className="flex flex-col gap-3 max-lg:items-center max-lg:text-center">
                  <p className="text-base leading-normal font-semibold">
                    {hotelProfile.hotelName}
                  </p>

                  <p className="text-base leading-normal opacity-80">
                    {hotelProfile.address.line1} <br />
                    {hotelProfile.address.line2}
                  </p>
                </div>
              </div>

              {/* Right Columns */}
              <div className="flex w-full flex-col gap-10 lg:w-190 lg:flex-row lg:items-start lg:justify-between">
                <div className="grid grid-cols-2 lg:contents">
                  {/* Links Column */}
                  <div className="flex w-full flex-col gap-5 text-base leading-normal font-normal lg:w-50">
                    <p className="text-xl font-medium">{footer.links.title}</p>
                    <Link
                      href="#rooms"
                      className="opacity-80 hover:opacity-100"
                    >
                      {footer.links.rooms}
                    </Link>
                    <Link
                      href="#gallery"
                      className="opacity-80 hover:opacity-100"
                    >
                      {footer.links.gallery}
                    </Link>
                  </div>

                  {/* Legals Column */}
                  <div className="flex w-full flex-col gap-5 text-base leading-normal font-normal lg:w-[200px]">
                    <p className="text-xl font-medium">{footer.legal.title}</p>
                    <a
                      target="_blank"
                      href={imprintUrl}
                      className="opacity-80 hover:opacity-100"
                    >
                      {footer.legal.imprint}
                    </a>
                    <a
                      target="_blank"
                      href={privacyUrl}
                      className="opacity-80 hover:opacity-100"
                    >
                      {footer.legal.privacy}
                    </a>
                    <Link
                      href={`${PRIVACY_SLUG_BY_LOCALE[locale as Locale]}`}
                      className="opacity-80 hover:opacity-100"
                    >
                      {footer.legal.privacySettings}
                    </Link>
                  </div>
                </div>

                {/* Contact Column */}
                <div className="flex w-full flex-col gap-5 lg:w-75">
                  <p className="text-xl font-medium">{footer.contact.title}</p>
                  <div className="flex w-full flex-col gap-3">
                    {/* Email Button */}
                    <div className="border-primary-foreground/50 bg-primary-foreground/0 hover:bg-primary-foreground/10 flex w-full items-center justify-between gap-3 border border-solid px-5 py-3 transition-colors">
                      <div className="flex items-center gap-3">
                        <EnvelopeIcon
                          size={24}
                          className="shrink-0 text-current"
                        />
                        <p className="text-base leading-normal font-normal">
                          {hotelProfile.contact.email}
                        </p>
                      </div>
                      <CopyToClipboard
                        className="opacity-50"
                        text={hotelProfile.contact.email}
                      />
                    </div>
                    {/* Phone Button */}
                    <div className="border-primary-foreground/50 bg-primary-foreground/0 hover:bg-primary-foreground/10 flex w-full items-center justify-between gap-3 border border-solid px-5 py-3 transition-colors">
                      <div className="flex items-center gap-3">
                        <PhoneIcon
                          size={24}
                          className="shrink-0 text-current"
                        />
                        <p className="text-base leading-normal font-normal">
                          {hotelProfile.contact.phone.display}
                        </p>
                      </div>
                      <CopyToClipboard
                        className="opacity-50"
                        text={hotelProfile.contact.phone.display}
                      />
                    </div>
                  </div>

                  {/* Social Icons */}
                  <div className="flex gap-5">
                    {Object.entries(hotelProfile.social).map(([key, url]) => {
                      if (!url) return null;
                      const IconComponent =
                        SOCIAL_ICONS[key as keyof typeof SOCIAL_ICONS];
                      const label =
                        SOCIAL_LABELS[key as keyof typeof SOCIAL_LABELS];
                      if (!IconComponent) return null;
                      return (
                        <a
                          key={key}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex size-8 items-center justify-center overflow-hidden rounded-none bg-white/20 transition-colors hover:bg-white/30"
                        >
                          <IconComponent />
                          <span className="sr-only">{label}</span>
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="flex flex-col gap-6">
              <div className="bg-primary-foreground relative h-px w-full overflow-hidden opacity-10"></div>
              <div className="flex flex-col-reverse items-start gap-6 lg:flex-row lg:justify-between">
                <p className="text-base leading-normal font-normal opacity-60">
                  {footer.copyright}
                </p>
                <div className="flex flex-col gap-3">
                  <p className="text-base leading-normal font-normal opacity-60">
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

const Instagram = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
  >
    <path
      d="M14.6273 5.25398C14.6144 4.70085 14.5108 4.15358 14.3207 3.63398C14.1529 3.18852 13.8888 2.7856 13.5473 2.45398C13.2157 2.11249 12.8128 1.84842 12.3673 1.68065C11.8477 1.49054 11.3005 1.38695 10.7473 1.37398C10.0407 1.33398 9.81398 1.33398 8.00065 1.33398C6.18732 1.33398 5.96065 1.33398 5.25398 1.37398C4.70085 1.38695 4.15358 1.49054 3.63398 1.68065C3.18852 1.84842 2.7856 2.11249 2.45398 2.45398C2.11227 2.7841 1.8501 3.18761 1.68732 3.63398C1.49142 4.15221 1.38546 4.70008 1.37398 5.25398C1.33398 5.96065 1.33398 6.18732 1.33398 8.00065C1.33398 9.81398 1.33398 10.0407 1.37398 10.7473C1.38546 11.3012 1.49142 11.8491 1.68732 12.3673C1.8501 12.8137 2.11227 13.2172 2.45398 13.5473C2.7856 13.8888 3.18852 14.1529 3.63398 14.3207C4.15358 14.5108 4.70085 14.6144 5.25398 14.6273C5.96065 14.6673 6.18732 14.6673 8.00065 14.6673C9.81398 14.6673 10.0407 14.6673 10.7473 14.6273C11.3005 14.6144 11.8477 14.5108 12.3673 14.3207C12.8096 14.1467 13.2113 13.8835 13.5474 13.5474C13.8835 13.2113 14.1467 12.8096 14.3207 12.3673C14.5108 11.8477 14.6144 11.3005 14.6273 10.7473C14.6273 10.0407 14.6673 9.81398 14.6673 8.00065C14.6673 6.18732 14.6673 5.96065 14.6273 5.25398ZM13.4273 10.6673C13.4225 11.0905 13.3458 11.5098 13.2007 11.9073C13.0891 12.1949 12.9189 12.456 12.7007 12.6741C12.4827 12.8922 12.2215 13.0625 11.934 13.174C11.5365 13.3192 11.1172 13.3958 10.694 13.4007C10.0273 13.434 9.78065 13.4406 8.02732 13.4406C6.27398 13.4406 6.02732 13.4407 5.36065 13.4007C4.92114 13.4105 4.48332 13.3428 4.06732 13.2007C3.77978 13.0891 3.51864 12.9189 3.30055 12.7007C3.08246 12.4827 2.91221 12.2215 2.80065 11.934C2.65248 11.5281 2.57579 11.0995 2.57398 10.6673C2.57398 10.0007 2.53398 9.75398 2.53398 8.00065C2.53398 6.24732 2.53398 6.00065 2.57398 5.33398C2.57579 4.90184 2.65248 4.47327 2.80065 4.06732C2.91221 3.77978 3.08246 3.51864 3.30055 3.30055C3.51864 3.08246 3.77978 2.91221 4.06732 2.80065C4.47327 2.65248 4.90184 2.57579 5.33398 2.57398C6.00065 2.57398 6.24732 2.53398 8.00065 2.53398C9.75398 2.53398 10.0007 2.53398 10.6673 2.57398C11.0905 2.57884 11.5098 2.65548 11.9073 2.80065C12.1949 2.91221 12.456 3.08246 12.6741 3.30055C12.8922 3.51864 13.0625 3.77978 13.174 4.06732C13.3313 4.47165 13.417 4.90026 13.4273 5.33398C13.4606 6.00065 13.4673 6.24732 13.4673 8.00065C13.4673 9.75398 13.4606 10.0007 13.4273 10.6673Z"
      fill="#FEFEFE"
    />
    <path
      d="M7.99893 4.57227C7.3212 4.57227 6.65869 4.77324 6.09518 5.14977C5.53167 5.52629 5.09246 6.06147 4.83311 6.6876C4.57375 7.31373 4.50589 8.00273 4.63811 8.66747C4.77033 9.33213 5.09669 9.94273 5.57591 10.4219C6.05514 10.9012 6.66573 11.2275 7.3304 11.3597C7.99513 11.492 8.68413 11.4241 9.31027 11.1647C9.9364 10.9054 10.4716 10.4662 10.8481 9.90267C11.2246 9.3392 11.4256 8.67667 11.4256 7.99893C11.4256 7.09013 11.0646 6.21854 10.4219 5.57591C9.77933 4.93329 8.90773 4.57227 7.99893 4.57227ZM7.99893 10.2189C7.55987 10.2189 7.13067 10.0887 6.7656 9.8448C6.40049 9.60087 6.11595 9.25413 5.94792 8.84847C5.77989 8.44287 5.73593 7.99647 5.82159 7.5658C5.90725 7.1352 6.11869 6.7396 6.42915 6.42915C6.7396 6.11869 7.1352 5.90725 7.5658 5.82159C7.99647 5.73593 8.44287 5.77989 8.84847 5.94792C9.25413 6.11595 9.60087 6.40049 9.8448 6.7656C10.0887 7.13067 10.2189 7.55987 10.2189 7.99893C10.2189 8.29047 10.1615 8.57913 10.0499 8.84847C9.9384 9.11787 9.77487 9.36253 9.56873 9.56873C9.36253 9.77487 9.11787 9.9384 8.84847 10.0499C8.57913 10.1615 8.29047 10.2189 7.99893 10.2189Z"
      fill="#FEFEFE"
    />
    <path
      d="M11.5597 3.63867C11.4015 3.63867 11.2469 3.68559 11.1153 3.77349C10.9837 3.8614 10.8812 3.98635 10.8206 4.13253C10.7601 4.27871 10.7443 4.43956 10.7751 4.59474C10.806 4.74993 10.8821 4.89247 10.9941 5.00435C11.1059 5.11624 11.2485 5.19243 11.4037 5.2233C11.5589 5.25416 11.7197 5.23833 11.8659 5.17777C12.0121 5.11723 12.137 5.01469 12.2249 4.88313C12.3128 4.75157 12.3597 4.59689 12.3597 4.43867C12.3597 4.2265 12.2755 4.02301 12.1254 3.87299C11.9754 3.72295 11.7719 3.63867 11.5597 3.63867Z"
      fill="#FEFEFE"
    />
  </svg>
);

const Facebook = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
  >
    <path
      d="M6.55465 14.6663V8.79967H4.44531V6.39967H6.55465V4.56567C6.55465 2.48367 7.79531 1.33301 9.69331 1.33301C10.3164 1.34164 10.9381 1.39579 11.5533 1.49501V3.54034H10.506C10.3274 3.51639 10.1457 3.53295 9.97438 3.58881C9.80311 3.64467 9.64658 3.73839 9.51645 3.86302C9.38631 3.98764 9.28591 4.13997 9.22271 4.3087C9.15951 4.47743 9.13511 4.65823 9.15131 4.83767V6.39967H11.456L11.088 8.79967H9.15465V14.6663H6.55465Z"
      fill="white"
    />
  </svg>
);

const Tiktok = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
  >
    <path
      d="M10.5 6.375C11.5193 7.10871 12.7441 7.50237 14 7.5V5C13.0717 5 12.1815 4.63125 11.5251 3.97487C10.8687 3.3185 10.5 2.42826 10.5 1.5H8V9.75C7.99987 10.0631 7.91571 10.3705 7.75631 10.6401C7.59692 10.9096 7.36811 11.1314 7.09377 11.2824C6.81943 11.4334 6.5096 11.508 6.1966 11.4984C5.8836 11.4889 5.5789 11.3955 5.31427 11.2281C5.04965 11.0606 4.83481 10.8253 4.69215 10.5465C4.54949 10.2677 4.48424 9.95581 4.50321 9.64324C4.52219 9.33067 4.62468 9.02892 4.80001 8.76946C4.97533 8.50999 5.21707 8.30233 5.5 8.16813V5.5C3.51063 5.85438 2 7.65875 2 9.75C2 10.8772 2.44777 11.9582 3.2448 12.7552C4.04183 13.5522 5.12283 14 6.25 14C7.37717 14 8.45817 13.5522 9.2552 12.7552C10.0522 11.9582 10.5 10.8772 10.5 9.75V6.375Z"
      stroke="white"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Youtube = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
  >
    <path
      d="M10 8L7 6V10L10 8Z"
      stroke="white"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M1.5 8.00006C1.5 9.86943 1.69187 10.9657 1.83812 11.5294C1.8768 11.6828 1.95129 11.8248 2.05548 11.9437C2.15967 12.0627 2.2906 12.1553 2.4375 12.2138C4.5325 13.0219 8 13.0001 8 13.0001C8 13.0001 11.4675 13.0219 13.5625 12.2138C13.7099 12.1556 13.8413 12.0632 13.9459 11.9442C14.0506 11.8252 14.1254 11.683 14.1644 11.5294C14.3106 10.9669 14.5025 9.86943 14.5025 8.00006C14.5025 6.13068 14.3106 5.03443 14.1644 4.47068C14.1259 4.31651 14.0512 4.17373 13.9466 4.05417C13.8419 3.93461 13.7102 3.84172 13.5625 3.78318C11.4675 2.97818 8 3.00006 8 3.00006C8 3.00006 4.5325 2.97818 2.4375 3.78631C2.28977 3.84484 2.15812 3.93774 2.05345 4.05729C1.94878 4.17685 1.87411 4.31964 1.83563 4.47381C1.69188 5.03381 1.5 6.13068 1.5 8.00006Z"
      stroke="white"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Whatsapp = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
  >
    <path
      d="M13.6 2.33C12.1 0.83 10.1 0 8 0C3.6 0 0 3.6 0 8C0 9.4 0.4 10.8 1.1 12L0 16L4.2 14.9C5.4 15.5 6.7 15.9 8 15.9C12.4 15.9 16 12.3 16 7.9C16 5.8 15.1 3.83 13.6 2.33ZM8 14.6C6.8 14.6 5.6 14.3 4.5 13.7L4.3 13.6L1.9 14.2L2.5 11.9L2.3 11.6C1.6 10.5 1.3 9.3 1.3 8C1.3 4.3 4.3 1.3 8 1.3C9.8 1.3 11.5 2 12.7 3.3C14 4.5 14.7 6.2 14.7 8C14.7 11.7 11.7 14.6 8 14.6ZM11.6 9.7C11.4 9.6 10.4 9.1 10.2 9C10 9 9.9 8.9 9.8 9.1C9.7 9.3 9.3 9.7 9.2 9.9C9.1 10 9 10 8.8 10C8.6 9.9 7.9 9.7 7.1 9C6.5 8.4 6.1 7.8 6 7.6C5.9 7.4 6 7.3 6.1 7.2C6.2 7.1 6.3 7 6.4 6.9C6.5 6.8 6.5 6.7 6.6 6.6C6.7 6.5 6.6 6.4 6.6 6.3C6.6 6.2 6.1 5.2 6 4.9C5.9 4.6 5.7 4.6 5.6 4.6H5.3C5.1 4.6 4.9 4.7 4.7 4.9C4.5 5.1 4 5.6 4 6.6C4 7.6 4.7 8.5 4.8 8.7C4.9 8.9 6.1 10.7 8.1 11.5C8.6 11.7 9 11.8 9.3 11.9C9.8 12.1 10.3 12 10.7 12C11.1 11.9 11.9 11.5 12.1 11C12.2 10.5 12.2 10.2 12.2 10.1C12.2 10 11.8 9.8 11.6 9.7Z"
      fill="white"
    />
  </svg>
);

const SOCIAL_ICONS = {
  instagram: Instagram,
  facebook: Facebook,
  youtube: Youtube,
  tiktok: Tiktok,
  whatsapp: Whatsapp,
} as const;

const SOCIAL_LABELS: Record<keyof typeof SOCIAL_ICONS, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  youtube: "YouTube",
  tiktok: "TikTok",
  whatsapp: "WhatsApp",
} as const;

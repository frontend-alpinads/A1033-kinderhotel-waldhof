"use client";

import Image from "next/image";
import { GalleryPopup } from "../../gallery-popup";
import { GalleryTabs } from "../../gallery-tabs";
import { useGalleryTabs } from "../../hooks/use-gallery-tabs";
import { useCommonTranslations } from "@/lib/i18n/hooks";

export function GalleryV5() {
  const {
    tabs,
    activeTab,
    setActiveTab,
    desktopImages,
    mobileImages,
    allImages,
    gallery,
  } = useGalleryTabs({ imagesPerCategory: [2, 2, 2, 2] });
  const common = useCommonTranslations();

  const titleParts = gallery.title.split("\n");
  const desktopRemainingPhotos = Math.max(0, allImages.length - 8);
  const mobileRemainingPhotos = Math.max(0, allImages.length - 4);
  const photosLabel = (count: number) =>
    count === 1 ? common.photo.one : common.photo.other;

  return (
    <section id="gallery" className="bg-background py-20 lg:py-30">
      {/* Contents */}
      <div className="relative mx-auto flex w-full flex-col items-center gap-14 lg:gap-20">
        <div className="mx-auto flex w-full flex-col items-center gap-4 px-4 lg:grid lg:grid-cols-2 lg:gap-20 lg:px-5">
          <div className="contents flex-col gap-4 lg:flex">
            <h2 className="text-accent py-2 text-base leading-[150%] font-semibold tracking-[5%] uppercase max-lg:text-center lg:mb-1">
              - {gallery.badge} -
            </h2>
            <p className="font-title text-display-2 font-medium max-lg:text-center">
              {titleParts[0]}
              {titleParts[1]}
            </p>
          </div>

          <p className="mx-auto w-full max-w-360 text-base leading-normal opacity-80 max-lg:text-center">
            {gallery.description}
          </p>
        </div>

        <div className="w-full px-4 lg:px-5">
          <div className="overflow-x-auto pb-5 max-lg:-mx-4 lg:pb-6">
            <div className="max-lg:px-4">
              <GalleryTabs
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                tabs={tabs}
              />
            </div>
          </div>

          {/* Desktop Grid */}
          <div className="relative hidden h-120 w-full grid-cols-5 grid-rows-3 gap-5 lg:grid lg:h-200">
            {/* Large left image: 3 cols × 2 rows */}
            {desktopImages[0] && (
              <div className="relative col-span-3 row-span-2">
                <Image
                  alt=""
                  src={desktopImages[0].src}
                  fill
                  className="absolute inset-0 h-full w-full rounded-none object-cover"
                />
              </div>
            )}

            {/* Top right image: 2 cols × 1 row */}
            {desktopImages[1] && (
              <div className="relative col-span-2 row-span-1">
                <Image
                  alt=""
                  src={desktopImages[1].src}
                  fill
                  className="absolute inset-0 h-full w-full rounded-none object-cover"
                />
              </div>
            )}

            {/* Bottom right image: 2 cols × 1 row */}
            {desktopImages[2] && (
              <div className="relative col-span-2 row-span-1">
                <Image
                  alt=""
                  src={desktopImages[2].src}
                  fill
                  className="absolute inset-0 h-full w-full rounded-none object-cover"
                />
              </div>
            )}

            {/* Bottom row: 4 images + button */}
            {desktopImages[3] && (
              <div className="relative col-span-1 row-span-1">
                <Image
                  alt=""
                  src={desktopImages[3].src}
                  fill
                  className="absolute inset-0 h-full w-full rounded-none object-cover"
                />
              </div>
            )}

            {desktopImages[4] && (
              <div className="relative col-span-1 row-span-1">
                <Image
                  alt=""
                  src={desktopImages[4].src}
                  fill
                  className="absolute inset-0 h-full w-full rounded-none object-cover"
                />
              </div>
            )}

            {desktopImages[5] && (
              <div className="relative col-span-1 row-span-1">
                <Image
                  alt=""
                  src={desktopImages[5].src}
                  fill
                  className="absolute inset-0 h-full w-full rounded-none object-cover"
                />
              </div>
            )}

            {desktopImages[6] && (
              <div className="relative col-span-1 row-span-1">
                <Image
                  alt=""
                  src={desktopImages[6].src}
                  fill
                  className="absolute inset-0 h-full w-full rounded-none object-cover"
                />
              </div>
            )}

            {/* +X Photos button cell with 8th image */}
            <GalleryPopup images={allImages}>
              <div className="relative flex cursor-pointer items-center justify-center">
                {desktopImages[7] && (
                  <Image
                    alt=""
                    src={desktopImages[7].src}
                    fill
                    className="absolute inset-0 h-full w-full rounded-none object-cover"
                  />
                )}
                <span className="relative z-10 flex h-full w-full items-center justify-center bg-black/50 px-4 py-2 text-2xl font-medium text-white underline">
                  +{desktopRemainingPhotos} {photosLabel(desktopRemainingPhotos)}
                </span>
              </div>
            </GalleryPopup>
          </div>

          {/* Mobile Grid */}
          <div className="relative grid h-140 w-full grid-cols-2 grid-rows-[1fr_1fr_1fr] gap-4 lg:hidden">
            {mobileImages[0] && (
              <div className="relative row-span-2">
                <Image
                  alt=""
                  src={mobileImages[0].src}
                  fill
                  className="absolute inset-0 h-full w-full rounded-none object-cover"
                />
              </div>
            )}

            {mobileImages[1] && (
              <div className="relative col-span-1 row-span-1">
                <Image
                  alt=""
                  src={mobileImages[1].src}
                  fill
                  className="absolute inset-0 h-full w-full rounded-none object-cover"
                />
              </div>
            )}

            {mobileImages[2] && (
              <div className="relative col-span-1 row-span-1">
                <Image
                  alt=""
                  src={mobileImages[2].src}
                  fill
                  className="absolute inset-0 h-full w-full rounded-none object-cover"
                />
              </div>
            )}

            {/* +X Photos button cell with 4th image */}
            <GalleryPopup images={allImages}>
              <div className="relative col-span-2 row-span-1 flex cursor-pointer items-center justify-center">
                {mobileImages[3] && (
                  <Image
                    alt=""
                    src={mobileImages[3].src}
                    fill
                    className="absolute inset-0 h-full w-full rounded-none object-cover"
                  />
                )}
                <span className="relative z-10 flex h-full w-full items-center justify-center bg-black/50 px-4 py-2 text-2xl font-medium text-white underline">
                  +{mobileRemainingPhotos} {photosLabel(mobileRemainingPhotos)}
                </span>
              </div>
            </GalleryPopup>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { GalleryPopup } from "../../gallery-popup";
import { GalleryTabs } from "../../gallery-tabs";
import { useGalleryTabs } from "../../hooks/use-gallery-tabs";

export function GalleryV1() {
  const {
    tabs,
    activeTab,
    setActiveTab,
    desktopImages,
    mobileImages,
    allImages,
    gallery,
  } = useGalleryTabs({ imagesPerCategory: [2, 2, 2, 2] });

  const titleParts = gallery.title.split("\n");

  // Check if we're showing different images on desktop vs mobile
  const hasDifferentMobileImages = activeTab === "all";

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

          <div className="relative grid h-160 w-full grid-cols-5 grid-rows-5 gap-5 max-lg:h-120 max-lg:grid-cols-2 max-lg:grid-rows-[1fr_1fr_1fr] max-lg:gap-4">
            {/* Position 0: Desktop only */}
            {desktopImages[0] && (
              <div
                key={1}
                className="relative row-span-2 max-lg:col-span-2 max-lg:row-span-1 max-lg:hidden"
              >
                <Image
                  alt=""
                  src={desktopImages[0].src}
                  fill
                  className="absolute inset-0 h-full w-full rounded-none object-cover"
                />
              </div>
            )}

            {/* Position 1: Desktop shows desktopImages[1], Mobile shows mobileImages[0] */}
            {hasDifferentMobileImages ? (
              <>
                {desktopImages[1] && (
                  <div
                    key="2-desktop"
                    className="relative row-span-3 max-lg:hidden"
                  >
                    <Image
                      alt=""
                      src={desktopImages[1].src}
                      fill
                      className="absolute inset-0 h-full w-full rounded-none object-cover"
                    />
                  </div>
                )}
                {mobileImages[0] && (
                  <div key="2-mobile" className="relative row-span-2 lg:hidden">
                    <Image
                      alt=""
                      src={mobileImages[0].src}
                      fill
                      className="absolute inset-0 h-full w-full rounded-none object-cover"
                    />
                  </div>
                )}
              </>
            ) : (
              desktopImages[1] && (
                <div key={2} className="relative row-span-3 max-lg:row-span-2">
                  <Image
                    alt=""
                    src={desktopImages[1].src}
                    fill
                    className="absolute inset-0 h-full w-full rounded-none object-cover"
                  />
                </div>
              )
            )}

            {/* Position 2: Desktop shows desktopImages[2], Mobile shows mobileImages[1] */}
            {hasDifferentMobileImages ? (
              <>
                {desktopImages[2] && (
                  <div
                    key="3-desktop"
                    className="relative col-span-2 row-span-3 max-lg:hidden"
                  >
                    <Image
                      alt=""
                      src={desktopImages[2].src}
                      fill
                      className="absolute inset-0 h-full w-full rounded-none object-cover"
                    />
                  </div>
                )}
                {mobileImages[1] && (
                  <div
                    key="3-mobile"
                    className="relative col-span-1 row-span-1 lg:hidden"
                  >
                    <Image
                      alt=""
                      src={mobileImages[1].src}
                      fill
                      className="absolute inset-0 h-full w-full rounded-none object-cover"
                    />
                  </div>
                )}
              </>
            ) : (
              desktopImages[2] && (
                <div
                  key={3}
                  className="relative col-span-2 row-span-3 max-lg:col-span-1 max-lg:row-span-1"
                >
                  <Image
                    alt=""
                    src={desktopImages[2].src}
                    fill
                    className="absolute inset-0 h-full w-full rounded-none object-cover"
                  />
                </div>
              )
            )}

            {/* Position 3: Desktop shows desktopImages[3], Mobile shows mobileImages[2] */}
            {hasDifferentMobileImages ? (
              <>
                {desktopImages[3] && (
                  <div
                    key="4-desktop"
                    className="relative row-span-3 max-lg:hidden"
                  >
                    <Image
                      alt=""
                      src={desktopImages[3].src}
                      fill
                      className="absolute inset-0 h-full w-full rounded-none object-cover"
                    />
                  </div>
                )}
                {mobileImages[2] && (
                  <div
                    key="4-mobile"
                    className="relative col-span-1 row-span-1 lg:hidden"
                  >
                    <Image
                      alt=""
                      src={mobileImages[2].src}
                      fill
                      className="absolute inset-0 h-full w-full rounded-none object-cover"
                    />
                  </div>
                )}
              </>
            ) : (
              desktopImages[3] && (
                <div
                  key={4}
                  className="relative row-span-3 max-lg:col-span-1 max-lg:row-span-1"
                >
                  <Image
                    alt=""
                    src={desktopImages[3].src}
                    fill
                    className="absolute inset-0 h-full w-full rounded-none object-cover"
                  />
                </div>
              )
            )}

            {/* Position 4: Desktop shows desktopImages[4], Mobile shows mobileImages[3] */}
            {hasDifferentMobileImages ? (
              <>
                {desktopImages[4] && (
                  <div
                    key="5-desktop"
                    className="relative row-span-3 max-lg:hidden"
                  >
                    <Image
                      alt=""
                      src={desktopImages[4].src}
                      fill
                      className="absolute inset-0 h-full w-full rounded-none object-cover"
                    />
                  </div>
                )}
                {mobileImages[3] && (
                  <div
                    key="5-mobile"
                    className="relative col-span-2 row-span-1 lg:hidden"
                  >
                    <Image
                      alt=""
                      src={mobileImages[3].src}
                      fill
                      className="absolute inset-0 h-full w-full rounded-none object-cover"
                    />
                  </div>
                )}
              </>
            ) : (
              desktopImages[4] && (
                <div
                  key={5}
                  className="relative row-span-3 max-lg:col-span-2 max-lg:row-span-1"
                >
                  <Image
                    alt=""
                    src={desktopImages[4].src}
                    fill
                    className="absolute inset-0 h-full w-full rounded-none object-cover"
                  />
                </div>
              )
            )}

            {/* Positions 5-7: Desktop only */}
            <div className="hidden lg:contents">
              {desktopImages[5] && (
                <div key={6} className="relative row-span-2">
                  <Image
                    alt=""
                    src={desktopImages[5].src}
                    fill
                    className="absolute inset-0 h-full w-full rounded-none object-cover"
                  />
                </div>
              )}

              {desktopImages[6] && (
                <div key={7} className="relative row-span-2">
                  <Image
                    alt=""
                    src={desktopImages[6].src}
                    fill
                    className="absolute inset-0 h-full w-full rounded-none object-cover"
                  />
                </div>
              )}

              {desktopImages[7] && (
                <div key={8} className="relative col-span-2 row-span-2">
                  <Image
                    alt=""
                    src={desktopImages[7].src}
                    fill
                    className="absolute inset-0 h-full w-full rounded-none object-cover"
                  />
                </div>
              )}
            </div>
            <div className="absolute right-0 bottom-0 p-3 max-lg:hidden">
              <GalleryPopup images={allImages}>
                <Button>
                  <span>{gallery.viewAll}</span>
                </Button>
              </GalleryPopup>
            </div>
          </div>
          <div className="pt-5 lg:hidden">
            <GalleryPopup images={allImages}>
              <Button className="w-full" variant={"outline-primary"}>
                <span>{gallery.viewAll}</span>
              </Button>
            </GalleryPopup>
          </div>
        </div>
      </div>
    </section>
  );
}

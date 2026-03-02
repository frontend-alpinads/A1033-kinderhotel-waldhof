"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { GalleryPopup } from "../../gallery-popup";
import { GalleryTabs } from "../../gallery-tabs";
import { useGalleryTabs } from "../../hooks/use-gallery-tabs";

export function GalleryV2() {
  const { tabs, activeTab, setActiveTab, filteredImages, allImages, gallery } =
    useGalleryTabs({ imagesPerCategory: [2, 2, 2, 2] });

  const titleParts = gallery.title.split("\n");

  return (
    <section id="gallery" className="bg-background py-20 lg:py-30">
      {/* Contents */}
      <div className="relative mx-auto flex w-full flex-col items-center gap-14 lg:gap-20">
        {/* Text Contents */}
        <div className="relative mx-auto flex w-full flex-col items-center gap-4 px-4 lg:px-8">
          <h2 className="text-accent bg-border/30 px-3 py-2 text-center text-base leading-[150%] tracking-[5%] uppercase lg:mb-1">
            - {gallery.badge} -
          </h2>

          <p className="font-title text-foreground text-display-2 text-center font-normal">
            {titleParts[0]} {titleParts[1]}
          </p>

          <p className="text-foreground mx-auto w-full max-w-360 text-center text-base leading-normal -tracking-[1%] opacity-80">
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
            {filteredImages[0] && (
              <div
                key={1}
                className="relative row-span-2 max-lg:col-span-2 max-lg:row-span-1 max-lg:hidden"
              >
                <Image
                  alt=""
                  src={filteredImages[0].src}
                  fill
                  className="absolute inset-0 h-full w-full rounded-none object-cover"
                />
              </div>
            )}

            {filteredImages[1] && (
              <div key={2} className="relative row-span-3 max-lg:row-span-2">
                <Image
                  alt=""
                  src={filteredImages[1].src}
                  fill
                  className="absolute inset-0 h-full w-full rounded-none object-cover"
                />
              </div>
            )}

            {filteredImages[2] && (
              <div
                key={3}
                className="relative col-span-2 row-span-3 max-lg:col-span-1 max-lg:row-span-1"
              >
                <Image
                  alt=""
                  src={filteredImages[2].src}
                  fill
                  className="absolute inset-0 h-full w-full rounded-none object-cover"
                />
              </div>
            )}

            {filteredImages[3] && (
              <div
                key={4}
                className="relative row-span-3 max-lg:col-span-1 max-lg:row-span-1"
              >
                <Image
                  alt=""
                  src={filteredImages[3].src}
                  fill
                  className="absolute inset-0 h-full w-full rounded-none object-cover"
                />
              </div>
            )}

            {filteredImages[4] && (
              <div
                key={5}
                className="relative row-span-3 max-lg:col-span-2 max-lg:row-span-1"
              >
                <Image
                  alt=""
                  src={filteredImages[4].src}
                  fill
                  className="absolute inset-0 h-full w-full rounded-none object-cover"
                />
              </div>
            )}
            <div className="hidden lg:contents">
              {filteredImages[5] && (
                <div key={6} className="relative row-span-2">
                  <Image
                    alt=""
                    src={filteredImages[5].src}
                    fill
                    className="absolute inset-0 h-full w-full rounded-none object-cover"
                  />
                </div>
              )}

              {filteredImages[6] && (
                <div key={7} className="relative row-span-2">
                  <Image
                    alt=""
                    src={filteredImages[6].src}
                    fill
                    className="absolute inset-0 h-full w-full rounded-none object-cover"
                  />
                </div>
              )}

              {filteredImages[7] && (
                <div key={8} className="relative col-span-2 row-span-2">
                  <Image
                    alt=""
                    src={filteredImages[7].src}
                    fill
                    className="absolute inset-0 h-full w-full rounded-none object-cover"
                  />
                </div>
              )}
            </div>
            <div className="absolute right-0 bottom-0 p-3">
              <GalleryPopup images={allImages}>
                <Button>
                  <span>{gallery.viewAll}</span>
                </Button>
              </GalleryPopup>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

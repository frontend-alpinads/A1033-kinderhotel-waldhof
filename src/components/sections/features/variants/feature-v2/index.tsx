"use client";

import { useFeaturesContent } from "@/contents";
import { FeaturesCarousel } from "./features-carousel";
import { FeatureCard } from "./feature-card";

export function FeaturesV2() {
  const featuresT = useFeaturesContent();
  const titleParts = featuresT.title.split("\n");
  const featureItems = featuresT.items.map((item, index) => ({
    key: `feature-${index}`,
    ...item,
  }));

  return (
    <section
      id="features"
      className="bg-card text-foreground relative overflow-hidden py-20 lg:py-30"
    >
      <div className="relative flex w-full flex-col gap-5 lg:gap-20">
        <div className="mx-auto flex w-full flex-col items-center gap-4 px-4 text-center lg:px-5">
          <h2 className="text-accent px-3 py-2 text-center text-base leading-[150%] font-medium tracking-[5%] uppercase lg:mb-1">
            - {featuresT.badge} -
          </h2>
          <p className="font-title text-display-2 text-center font-medium">
            {titleParts[0]}
            {titleParts[1]}
          </p>

          <p className="mx-auto w-full max-w-360 text-center text-base leading-normal -tracking-[1%] opacity-80">
            {featuresT.description}
          </p>
        </div>

        <div className="">
          <FeaturesCarousel
            slides={featureItems.map((item, idx) => (
              <FeatureCard
                key={item.key}
                index={idx + 1}
                title={item.title}
                description={item.description}
                iconName={item.iconName}
                imageSrc={item.imageSrc}
              />
            ))}
          />
        </div>
      </div>
    </section>
  );
}

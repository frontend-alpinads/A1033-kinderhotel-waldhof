import Image from "next/image";
import { FEATURE_ICONS } from "../../feature-icons";

type FeatureCardProps = {
  title: string;
  description: string;
  index?: number;
  iconName: string;
  imageSrc: string;
};

type FeatureIconName = keyof typeof FEATURE_ICONS;

export function FeatureCard({
  title,
  description,
  index,
  iconName,
  imageSrc,
}: FeatureCardProps) {
  const Icon = FEATURE_ICONS[iconName as FeatureIconName];
  return (
    <div className="bg-background text-foreground flex h-full flex-col lg:grid lg:w-150 lg:grid-cols-2 lg:gap-8 lg:p-5">
      <div className="relative h-60 overflow-hidden lg:min-h-90">
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="h-full w-full object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div
          className="absolute inset-0 lg:hidden"
          style={{
            background:
              "linear-gradient(180deg, rgba(0, 0, 0, 0.40) 6.88%, rgba(0, 0, 0, 0.00) 51.27%)",
          }}
        ></div>
        {Icon ? (
          <Icon
            className="text-background absolute top-2.5 left-2.5 size-10 lg:hidden"
            weight="regular"
          />
        ) : null}
      </div>
      <div className="flex flex-col gap-5 p-4 lg:row-start-1 lg:justify-between lg:gap-10 lg:p-0">
        {Icon ? (
          <Icon
            className="text-primary size-12 max-lg:hidden"
            weight="regular"
          />
        ) : null}

        <div className="">
          <h3 className="font-title mb-3 text-xl leading-[140%] font-medium tracking-[-1%] lg:text-2xl">
            {title}
          </h3>

          <p className="text-base leading-normal -tracking-[1%] opacity-80">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

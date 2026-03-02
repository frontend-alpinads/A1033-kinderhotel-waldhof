import { StarIcon, StarHalfIcon } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";

type TestimonialCardProps = {
  text: string;
  name: string;
  country: string;
  rating: number;
};

export function TestimonialCard({
  text,
  name,
  country,
  rating,
}: TestimonialCardProps) {
  // Generate stars based on rating
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <StarIcon key={`full-${i}`} className="size-4" weight="fill" />,
      );
    }

    if (hasHalfStar) {
      stars.push(<StarHalfIcon key="half" className="size-4" weight="fill" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <StarIcon key={`empty-${i}`} className="size-4" weight="regular" />,
      );
    }

    return stars;
  };

  return (
    <div className="text-foreground flex h-full flex-col gap-8 max-lg:items-center max-lg:px-4 max-lg:py-5 max-lg:text-center">
      <div>
        <div className="text-star mb-4 flex gap-1 max-lg:justify-center">
          {renderStars()}
        </div>
        {/* Testimonial Text */}
        <p className="text-xl leading-[150%] font-semibold lg:text-2xl lg:leading-[140%]">
          <span
            className={cn(
              "inline-flex text-[1em]",
              text.split(" ").length > 25
                ? "text-[0.875em] leading-[150%]"
                : "",
              text.split(" ").length > 50 ? "text-[0.75em] leading-[150%]" : "",
              text.split(" ").length > 75
                ? "leading-[150%] max-lg:text-[0.625em]"
                : "",
            )}
          >
            {text}
          </span>
        </p>
      </div>

      {/* User Info */}
      <div className="mt-auto flex flex-col gap-1">
        <p className="text-base">{name}</p>
        <p className="text-sm">{country}</p>
      </div>
    </div>
  );
}

import { StarIcon, StarHalfIcon } from "@phosphor-icons/react/dist/ssr";

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
        <StarIcon key={`full-${i}`} className="size-4.5" weight="fill" />,
      );
    }

    if (hasHalfStar) {
      stars.push(
        <StarHalfIcon key="half" className="size-4.5" weight="fill" />,
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <StarIcon key={`empty-${i}`} className="size-4.5" weight="regular" />,
      );
    }

    return stars;
  };

  return (
    <div className="bg-background text-foreground flex h-full flex-col border p-4 lg:p-5">
      {/* Stars */}
      <div className="text-star mb-5 flex gap-1">{renderStars()}</div>

      {/* Testimonial Text */}
      <p className="mb-6 text-base leading-[140%] font-medium lg:mb-16 lg:text-xl">
        &ldquo;{text}&rdquo;
      </p>

      {/* User Info */}
      <div className="mt-auto flex flex-col gap-1">
        <p className="text-base font-medium">{name}</p>
        <p className="text-sm opacity-70">{country}</p>
      </div>
    </div>
  );
}

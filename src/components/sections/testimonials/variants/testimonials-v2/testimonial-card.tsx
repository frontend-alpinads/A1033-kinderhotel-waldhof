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
    <div className="flex h-full flex-col items-center gap-8 px-4 py-5 text-center lg:gap-11 lg:p-8">
      {/* Stars */}
      <div className="text-star flex gap-1">{renderStars()}</div>

      {/* Testimonial Text */}
      <p className="text-base leading-[140%]">&ldquo;{text}&rdquo;</p>

      {/* User Info */}
      <div className="mt-auto flex flex-col gap-1">
        <p className="text-base font-medium">{name}</p>
        <p className="text-sm opacity-70">{country}</p>
      </div>
    </div>
  );
}

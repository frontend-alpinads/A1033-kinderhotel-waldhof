"use client";

import { TestimonialsV1 } from "./variants/testimonials-v1";
import { TestimonialsV2 } from "./variants/testimonials-v2";
import { TestimonialsV3 } from "./variants/testimonials-v3";
import { TestimonialsV4 } from "./variants/testimonials-v4";
import { TestimonialsV5 } from "./variants/testimonials-v5";
import { TestimonialsV6 } from "./variants/testimonials-v6";
import { useSectionVariants } from "@/contents";
import { Testimonial } from "@/shared-types";

const testimonialVariants = {
  v1: TestimonialsV1,
  v2: TestimonialsV2,
  v3: TestimonialsV3,
  v4: TestimonialsV4,
  v5: TestimonialsV5,
  v6: TestimonialsV6,
};

export function Testimonials({
  testimonials: testimonialsData,
}: {
  testimonials: Testimonial[];
}) {
  const { testimonials: testimonialsVariant } = useSectionVariants();
  const TestimonialsImpl =
    testimonialVariants[
      testimonialsVariant as keyof typeof testimonialVariants
    ];
  if (!TestimonialsImpl) {
    return null;
  }

  return <TestimonialsImpl testimonials={testimonialsData} />;
}

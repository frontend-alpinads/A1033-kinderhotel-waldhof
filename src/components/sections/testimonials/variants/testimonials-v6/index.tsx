"use client";

import { TestimonialCard } from "./testimonial-card";
import { TestimonialsCarousel } from "./testimonials-carousel";
import { useTestimonialsContent } from "@/contents";
import { Testimonial } from "@/shared-types";

interface TestimonialsV6Props {
  testimonials: Testimonial[];
}

export function TestimonialsV6({ testimonials }: TestimonialsV6Props) {
  const testimonialsContent = useTestimonialsContent();
  const titleParts = testimonialsContent.title.split("\n");

  return (
    <section id="testimonials" className="bg-background">
      <div className="bg-muted relative mx-auto flex w-full flex-col gap-14 overflow-hidden py-20 lg:gap-20 lg:py-30">
        {/* Text Contents */}
        <div className="relative flex w-full flex-col gap-4 px-4 lg:px-5">
          <div className="contents lg:flex lg:flex-col lg:gap-4">
            <h2 className="text-accent py-2 text-center text-base leading-[150%] font-medium tracking-[5%] uppercase lg:mb-1 lg:text-left">
              - {testimonialsContent.badge} -
            </h2>

            <p className="font-title text-foreground text-display-2 text-center font-medium lg:text-start">
              {titleParts[0]} {titleParts[1]}
            </p>
          </div>

          <p className="text-foreground w-full max-w-360 text-center text-base leading-normal -tracking-[1%] lg:mx-0 lg:text-left">
            {testimonialsContent.description}
          </p>
        </div>

        {/* Carousel */}
        <div className="w-full">
          <TestimonialsCarousel
            slides={testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} />
            ))}
          />
        </div>
      </div>
    </section>
  );
}

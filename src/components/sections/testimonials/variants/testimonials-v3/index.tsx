"use client";

import Image from "next/image";
import { TestimonialCard } from "./testimonial-card";
import { useTestimonialsContent } from "@/contents";
import { Testimonial } from "@/shared-types";
import { TestimonialsCarousel } from "./testimonials-carousel";

interface TestimonialsV3Props {
  testimonials: Testimonial[];
}

export function TestimonialsV3({ testimonials }: TestimonialsV3Props) {
  const testimonialsContent = useTestimonialsContent();
  const titleParts = testimonialsContent.title.split("\n");

  return (
    <section id="testimonials" className="bg-muted px-4 py-20 lg:px-5 lg:py-30">
      <div className="relative flex flex-col gap-14 lg:flex-row lg:gap-20">
        {/* Left: Sticky image + header */}
        <div className="h-fit lg:sticky lg:top-8 lg:w-130">
          <h2 className="text-accent mb-1 py-2 text-base leading-[150%] tracking-[5%] uppercase max-lg:text-center">
            - {testimonialsContent.badge} -
          </h2>
          <p className="font-title text-foreground text-display-2 mb-5 font-normal opacity-80 max-lg:text-center">
            {titleParts[0]} {titleParts[1]}
          </p>
          <p className="text-foreground mb-12 text-base leading-normal -tracking-[1%] opacity-80 max-lg:mb-0 max-lg:text-center">
            {testimonialsContent.description}
          </p>
          <div className="relative aspect-video max-lg:hidden">
            <Image
              src={testimonialsContent.image}
              alt="Testimonials"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Right: Stacked cards */}
        <div className="space-y-4 max-lg:hidden lg:flex-1 lg:space-y-6">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>

        <div className="lg:hidden">
          <div className="relative mb-5 aspect-4/3">
            <Image
              src={testimonialsContent.image}
              alt="Testimonials"
              fill
              className="object-cover"
            />
          </div>

          <div className="-mx-4">
            <TestimonialsCarousel
              slides={testimonials.map((testimonial, index) => (
                <TestimonialCard key={index} {...testimonial} />
              ))}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

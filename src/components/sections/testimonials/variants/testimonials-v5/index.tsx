"use client";

import Image from "next/image";
import { TestimonialCard } from "./testimonial-card";
import { TestimonialsCarousel } from "./testimonials-carousel";
import { useTestimonialsContent } from "@/contents";
import { Testimonial } from "@/shared-types";

interface TestimonialsV5Props {
  testimonials: Testimonial[];
}

export function TestimonialsV5({ testimonials }: TestimonialsV5Props) {
  const testimonialsContent = useTestimonialsContent();
  const titleParts = testimonialsContent.title.split("\n");

  return (
    <section id="testimonials" className="bg-background lg:px-5 lg:py-8">
      <div className="bg-muted relative mx-auto flex w-full flex-col gap-14 overflow-hidden px-4 py-20 lg:gap-20 lg:px-8 lg:py-8">
        {/* Text Contents */}
        <div className="mx-auto flex w-full flex-col gap-4">
          <div className="contents flex-col gap-4 lg:flex">
            <h2 className="text-accent py-2 text-base leading-[150%] tracking-[5%] uppercase max-lg:mx-auto max-lg:text-center lg:mb-1">
              - {testimonialsContent.badge} -
            </h2>
            <p className="font-title text-display-2 text-primary font-normal max-lg:mx-auto max-lg:text-center">
              {titleParts[0]}
              {titleParts[1]}
            </p>
          </div>

          <p className="mx-0 w-full max-w-360 text-base leading-normal -tracking-[1%] max-lg:mx-auto max-lg:text-center">
            {testimonialsContent.description}
          </p>
        </div>

        <div className="flex flex-col gap-5 lg:grid lg:grid-cols-2 lg:gap-0">
          <div className="">
            <div className="relative h-60 w-full lg:h-110">
              <Image
                src={testimonialsContent.image}
                alt="Testimonials"
                fill
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div className="max-lg:-mx-4 lg:-mr-10">
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

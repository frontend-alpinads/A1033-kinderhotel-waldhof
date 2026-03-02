"use client";

import Image from "next/image";
import { EnquiryForm } from "@/components/blocks/enquiry-form";
import { useEnquiryContent } from "@/contents";

export function EnquiryV2() {
  const enquiry = useEnquiryContent();
  const titleParts = enquiry.title.split("\n");

  return (
    <section
      id="enquiry-form"
      className="bg-background relative px-4 py-20 lg:px-5 lg:py-40"
    >
      <Image
        className="absolute inset-0 h-full w-full object-cover"
        fill
        src={enquiry.backgroundImage}
        alt=""
        quality={100}
        sizes="100vw"
      />

      <div className="absolute inset-0 bg-black/30"></div>

      <div
        className="absolute inset-x-0 top-0 h-105"
        style={{
          background:
            "linear-gradient(180deg, rgba(0, 0, 0, 0.50) 0%, rgba(0, 0, 0, 0.00) 100%)",
        }}
      ></div>

      <div className="relative flex flex-col items-center gap-8 lg:flex-row lg:items-start lg:justify-center lg:gap-10">
        <div className="text-background relative flex flex-col gap-4 px-4 max-lg:w-full max-lg:items-center lg:w-140 lg:px-0">
          <h2 className="font-title text-display-2 text-center font-normal lg:text-start">
            {titleParts[0]} {titleParts[1]}
          </h2>

          <p className="mx-auto w-full max-w-240 text-center text-base leading-normal -tracking-[1%] opacity-80 lg:text-start">
            {enquiry.description}
          </p>
        </div>

        <div className="relative z-10 w-full max-w-260">
          <EnquiryForm />
        </div>
      </div>
    </section>
  );
}

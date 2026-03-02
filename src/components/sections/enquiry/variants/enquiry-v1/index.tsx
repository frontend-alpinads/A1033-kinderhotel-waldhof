"use client";

import Image from "next/image";
import { EnquiryForm } from "@/components/blocks/enquiry-form";
import { useEnquiryContent } from "@/contents";

export function EnquiryV1() {
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

      <div className="relative flex flex-col items-center gap-8 lg:gap-16">
        <div className="text-background relative mx-auto flex w-full flex-col items-center gap-4 px-4 lg:px-5">
          <h2 className="font-title text-display-2 text-center font-medium">
            {titleParts[0]} {titleParts[1]}
          </h2>

          <p className="mx-auto w-full max-w-240 text-center text-base leading-normal -tracking-[1%]">
            {enquiry.description}
          </p>
        </div>

        <div className="relative z-10 mx-auto w-full max-w-260">
          <EnquiryForm />
        </div>
      </div>
    </section>
  );
}

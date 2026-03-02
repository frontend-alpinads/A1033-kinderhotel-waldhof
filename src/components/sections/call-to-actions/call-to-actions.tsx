"use client";

import { track } from "@vercel/analytics/react";
import { useBookingStore } from "@/stores/booking-store";
import { Button } from "@/components/ui/button";
import gsap from "gsap";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCommonTranslations } from "@/lib/i18n";
import Image from "next/image";

export function CallToActions() {
  const { selectedDates, setSelectedDates } = useBookingStore();

  const handleDateSelect = (dates: { arrival: string; departure: string }) => {
    setSelectedDates(dates);
  };

  const common = useCommonTranslations();

  const formRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (formRef.current) {
      gsap.registerPlugin(ScrollTrigger);

      const enterAnimation = () => {
        gsap.to(formRef.current, {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.4,
          ease: "power2.out",
          pointerEvents: "auto",
        });
      };

      const exitAnimation = () => {
        gsap.to(formRef.current, {
          y: 50,
          opacity: 0,
          filter: "blur(10px)",
          duration: 0.4,
          ease: "power2.out",
          pointerEvents: "none",
        });
      };

      ScrollTrigger.create({
        trigger: "#about",
        start: "top+=200 bottom",
        onEnter: () => {
          enterAnimation();
        },
        onLeaveBack: () => {
          exitAnimation();
        },
      });

      ScrollTrigger.create({
        trigger: "#enquiry-form",
        start: "top bottom",
        onEnter: () => {
          exitAnimation();
        },
        onLeaveBack: () => {
          enterAnimation();
        },
      });
    }
  });

  const formatDateDisplay = () => {
    if (!selectedDates) return common.arrivalDeparture;

    const arrivalDate = new Date(selectedDates.arrival);
    const departureDate = new Date(selectedDates.departure);

    return `${arrivalDate.toLocaleDateString(common.localeString, {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    })} - ${departureDate.toLocaleDateString(common.localeString, {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    })}`;
  };

  const handleCheckAvailability = () => {
    track("call-to-actions-form-clicked", {
      route: "/",
    });
    // Data is already in the store, just scroll to enquiry form
    const enquirySection = document.getElementById("enquiry-form");
    if (enquirySection) {
      enquirySection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div className="fixed right-4 bottom-4 z-100 lg:right-8 lg:bottom-8">
      <div
        ref={formRef}
        className="pointer-events-none translate-y-50 opacity-0 blur-[10px]"
      >
        <div className="pointer-events-auto bg-background flex w-full gap-1 overflow-hidden rounded-none p-1">
          {/* Check Availability Button */}
          <div className="relative size-12 overflow-hidden rounded-none">
            <Image
              width={48}
              height={48}
              className="absolute inset-0 h-full w-full object-cover"
              alt=""
              src={"/placeholder.jpg"}
            />
          </div>
          <Button
            variant={"default"}
            className="gap-3 max-lg:px-4 max-lg:text-sm lg:gap-4"
            onClick={handleCheckAvailability}
          >
            {common.planYourStay}
            <span className="bg-background size-1.5 rounded-full"></span>
          </Button>
        </div>
      </div>
    </div>
  );
}

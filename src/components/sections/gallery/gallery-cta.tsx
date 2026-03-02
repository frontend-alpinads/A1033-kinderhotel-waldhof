"use client";

import { useLocale } from "@/lib/i18n/context";
import { Button } from "@/components/ui/button";

type GalleryCtaProps = {
  className?: string;
  onClose?: () => void;
};

export function GalleryCta({ className, onClose }: GalleryCtaProps) {
  const locale = useLocale();

  const ctaContent = {
    de: {
      ctaText: "JETZT ANFRAGEN",
      ctaNote: "Sie werden noch nicht belastet",
    },
    en: {
      ctaText: "INQUIRE NOW",
      ctaNote: "You won't be charged yet",
    },
    it: {
      ctaText: "RICHIEDI ORA",
      ctaNote: "Non ti verrà addebitato ancora nulla",
    },
  };

  const content = ctaContent[locale];

  return (
    <div
      className={`border-input bg-background flex flex-col items-center gap-2 border-t px-3 py-2 shadow-[0px_-4px_12px_0px_rgba(150,147,147,0.1)] ${className ?? ""}`}
    >
      <p className="text-foreground/70 text-xs leading-normal">
        {content.ctaNote}
      </p>
      <Button
        className="h-12 w-full"
        size={"sm"}
        onClick={() => {
          onClose?.();
          const enquirySection = document.getElementById("enquiry-form");
          if (enquirySection) {
            enquirySection.scrollIntoView({ behavior: "smooth" });
          }
        }}
      >
        {content.ctaText}
      </Button>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Booking } from "./booking";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";

type BookingLightboxProps = {
  lang?: "de" | "it" | "en";
  accentColor?: string;
  backgroundColor?: string;
  textColor?: string;
};

export function BookingLightbox({
  lang = "de",
  accentColor,
  backgroundColor,
  textColor,
}: BookingLightboxProps) {
  const [open, setOpen] = useState(false);
  const [instanceKey, setInstanceKey] = useState(0);

  useEffect(() => {
    const handleOpen = () => {
      setInstanceKey((k) => k + 1);
      setOpen(true);
    };
    window.addEventListener("open-booking", handleOpen as EventListener);
    return () => {
      window.removeEventListener("open-booking", handleOpen as EventListener);
    };
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="max-h-[90vh] w-[min(100%,1200px)] overflow-auto rounded-2xl p-4 sm:max-w-[95vw]"
        overlayClassName="backdrop-blur-sm"
        showCloseButton={false}
      >
        <div className="absolute top-2 right-2 z-50">
          <Button variant="white" className="rounded-md" size={"icon"}>
            <XIcon />
          </Button>
        </div>
        <Booking
          key={instanceKey}
          lang={lang}
          accentColor={accentColor}
          backgroundColor={backgroundColor}
          textColor={textColor}
          widgetId={`Bs-BookingWidget-Lightbox-${instanceKey}`}
        />
      </DialogContent>
    </Dialog>
  );
}

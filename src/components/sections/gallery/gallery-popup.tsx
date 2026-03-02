"use client";

import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowLeftIcon, XIcon } from "@phosphor-icons/react";
import { ReactNode } from "react";
import { GalleryCarousel } from "./gallery-carousel";
import { GalleryGrid } from "./gallery-grid";
import { GalleryTestimonialsSidebar } from "./gallery-testimonials-sidebar";
import { useGalleryContent } from "@/contents";

type Phase = "grid" | "carousel";

type GalleryPopupProps = {
  children: ReactNode;
  images: Array<{
    src: string;
    alt: string;
    width?: number;
    height?: number;
    category?: string;
  }>;
};

export function GalleryPopup({ children, images }: GalleryPopupProps) {
  const gallery = useGalleryContent();

  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<Phase>("grid");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setPhase("carousel");
  };

  const handleBack = () => {
    setPhase("grid");
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      // Reset state when dialog closes
      setPhase("grid");
      setSelectedImageIndex(0);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        showCloseButton={false}
        overlayClassName="z-110 bg-black/40 backdrop-blur-[10px]"
        className="bg-background z-120 mx-auto flex max-h-dvh min-h-dvh max-w-screen flex-col justify-start gap-0 overflow-hidden rounded-none border-none p-0 max-lg:min-w-screen lg:max-h-[calc(100dvh-80px)] lg:min-h-[calc(100dvh-80px)] lg:max-w-350"
      >
        {/* Header */}
        <DialogHeader className="mb-0 shrink-0 pb-0">
          <DialogTitle className="bg-background border-input mb-0 flex h-13 items-center justify-between border-b px-3 text-xl leading-[1.4] font-medium">
            <div className="flex flex-1 items-center gap-6">
              {/* Back button - only in carousel phase */}
              {phase === "carousel" && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex cursor-pointer items-center justify-center"
                  aria-label="Back to gallery"
                >
                  <ArrowLeftIcon className="size-6" />
                </button>
              )}
              <span>{gallery.popup.title}</span>
            </div>
            <DialogClose className="flex cursor-pointer items-center justify-center">
              <XIcon className="text-foreground size-6" />
              <span className="sr-only">{gallery.popup.closeSrLabel}</span>
            </DialogClose>
          </DialogTitle>
        </DialogHeader>

        {/* Content */}
        <div className="flex min-h-0 flex-1 overflow-hidden">
          {/* Main Content Area */}
          <div className="bg-background border-input flex-1 overflow-hidden border-r">
            {phase === "grid" ? (
              <GalleryGrid
                images={images}
                onImageClick={handleImageClick}
                onClose={handleClose}
              />
            ) : (
              <GalleryCarousel
                images={images}
                initialSlide={selectedImageIndex}
                onClose={handleClose}
              />
            )}
          </div>

          {/* Testimonials Sidebar - desktop only */}
          <GalleryTestimonialsSidebar
            showCta={phase === "carousel"}
            onClose={handleClose}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Export hook for programmatic control
export function useGalleryPopup() {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const toggleModal = () => setIsOpen(!isOpen);

  return {
    isOpen,
    openModal,
    closeModal,
    toggleModal,
  };
}

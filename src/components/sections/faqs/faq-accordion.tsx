"use client";

import { useRef, useState } from "react";
import { CaretRightIcon } from "@phosphor-icons/react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Faq } from "@/shared-types";

interface FaqAccordionItemProps {
  item: Faq;
  isOpen: boolean;
  onToggle: () => void;
}

function FaqAccordionItem({ item, isOpen, onToggle }: FaqAccordionItemProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const content = contentRef.current;
      const inner = innerRef.current;
      const icon = iconRef.current;

      if (!content || !inner) return;

      if (isOpen) {
        // Get the natural height of the content
        const height = inner.scrollHeight;

        // Animate content height
        gsap.to(content, {
          height: height,
          duration: 0.4,
          ease: "power2.inOut",
          onComplete: () => {
            // Set to auto after animation for responsiveness
            gsap.set(content, { height: "auto" });
          },
        });

        // Rotate icon
        if (icon) {
          gsap.to(icon, {
            rotate: 90,
            duration: 0.3,
            ease: "power2.inOut",
          });
        }
      } else {
        // Set specific height before animating to 0
        gsap.set(content, { height: content.scrollHeight });

        // Animate content height
        gsap.to(content, {
          height: 0,
          duration: 0.4,
          ease: "power2.inOut",
        });

        // Rotate icon back
        if (icon) {
          gsap.to(icon, {
            rotate: 0,
            duration: 0.3,
            ease: "power2.inOut",
          });
        }
      }
    },
    { dependencies: [isOpen], scope: contentRef },
  );

  return (
    <div className="border-b px-0 py-5">
      <button
        onClick={onToggle}
        className="text-foreground flex w-full cursor-pointer items-center justify-between gap-4 py-1 text-start font-normal"
        aria-expanded={isOpen}
        aria-controls={`faq-content-${item.id}`}
      >
        <p className="text-xl leading-[140%] font-medium">{item.question}</p>
        <CaretRightIcon ref={iconRef} className="size-5 shrink-0 lg:size-6" />
      </button>

      <div
        ref={contentRef}
        id={`faq-content-${item.id}`}
        className="h-0 overflow-hidden"
      >
        <div ref={innerRef}>
          <p className="pt-3 pr-5 leading-[140%] opacity-80">{item.answer}</p>
        </div>
      </div>
    </div>
  );
}

interface FaqAccordionProps {
  items?: Faq[];
  allowMultiple?: boolean;
}

export function FaqAccordion({
  items = [],
  allowMultiple = false,
}: FaqAccordionProps) {
  const [openIds, setOpenIds] = useState<string[]>([items[0].id]);

  const toggleItem = (id: string) => {
    if (allowMultiple) {
      setOpenIds((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
      );
    } else {
      setOpenIds((prev) => (prev.includes(id) ? [] : [id]));
    }
  };

  return (
    <div className="flex flex-col justify-center">
      {items.map((item) => (
        <FaqAccordionItem
          key={item.id}
          item={item}
          isOpen={openIds.includes(item.id)}
          onToggle={() => toggleItem(item.id)}
        />
      ))}
    </div>
  );
}

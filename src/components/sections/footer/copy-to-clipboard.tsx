"use client";

import { cn } from "@/lib/utils";
import { CheckIcon, CopyIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

type CopyToClipboardProps = {
  text: string;
  className?: string;
};

export function CopyToClipboard({ text, className }: CopyToClipboardProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    if (!isCopied) {
      navigator.clipboard.writeText(text);
      setIsCopied(true);
    }
  };

  // Reset the copied state after 2 seconds
  useEffect(() => {
    setTimeout(() => {
      setIsCopied(false);
    }, 3500);
  }, [isCopied]);

  return (
    <button
      onClick={() => handleCopy()}
      className={cn(
        "relative shrink-0 cursor-pointer transition-transform hover:scale-110",
        className,
      )}
      aria-label="Copy to clipboard"
    >
      <CopyIcon
        size={20}
        weight="regular"
        className={cn(
          "transition-transform delay-200 duration-200 ease-in-out",
          isCopied && "scale-0 delay-0",
        )}
      />
      <CheckIcon
        size={20}
        weight="regular"
        className={cn(
          "absolute inset-0 scale-0 transition-transform delay-0 duration-200 ease-in-out",
          isCopied && "scale-100 delay-200",
        )}
      />
    </button>
  );
}

"use client";

import { CaretDownIcon, CheckCircleIcon } from "@phosphor-icons/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type GalleryCategorySelectProps = {
  value: string;
  onValueChange: (tab: string) => void;
  tabs: { label: string; value: string }[];
};

export function GalleryCategorySelect({
  value,
  onValueChange,
  tabs,
}: GalleryCategorySelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger
        showChevron={false}
        className="text-foreground bg-background border-primary relative mx-auto flex h-12! w-full cursor-pointer items-center justify-between rounded-none px-4 py-3 text-base tracking-[0.01rem] capitalize shadow-none"
      >
        <SelectValue />
        <CaretDownIcon className="size-4.5 text-current" />
      </SelectTrigger>
      <SelectContent
        align="center"
        className="bg-background border-border z-200 w-[calc(100vw-2rem)] rounded-none border px-1 py-0.5 shadow-lg"
      >
        {tabs.map((tab) => (
          <SelectItem
            key={tab.value}
            value={tab.value}
            className="text-foreground data-[state=checked]:text-foreground data-[state=checked]:bg-foreground/10 data-highlighted:bg-foreground/50 flex h-12 rounded-none px-4 py-3 text-start capitalize"
            customCheckIcon={
              <span className="absolute right-4 flex items-center justify-center">
                <SelectItemIndicator>
                  <CheckCircleIcon
                    weight="fill"
                    className="text-foreground size-5"
                  />
                </SelectItemIndicator>
              </span>
            }
          >
            {tab.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

"use client";

import { BedIcon, CaretDownIcon, CheckCircleIcon } from "@phosphor-icons/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRoomsTranslations } from "@/lib/i18n";

interface RoomCategorySelectProps {
  value: string;
  onValueChange: (value: string) => void;
  tabs: { label: string; value: string }[];
}

export function RoomCategorySelect({
  value,
  onValueChange,
  tabs,
}: RoomCategorySelectProps) {
  const roomsT = useRoomsTranslations();

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger
        showChevron={false}
        className="text-foreground bg-background border-primary relative mx-auto flex h-12! w-full cursor-pointer items-center rounded-none px-4 py-3 text-base tracking-[0.01rem] shadow-none"
      >
        <span className="flex flex-1 gap-4">
          <BedIcon className="size-6 text-current" />
          <span>
            {roomsT.roomType} <SelectValue />
          </span>
        </span>
        <CaretDownIcon className="size-6 text-current" />
      </SelectTrigger>
      <SelectContent
        align="center"
        className="bg-background border-border w-[calc(100vw-2rem)] rounded-none border px-1 py-0.5 shadow-lg"
      >
        {tabs.map((tab) => (
          <SelectItem
            key={tab.value}
            value={tab.value}
            className="text-foreground data-[state=checked]:text-foreground data-[state=checked]:bg-foreground/10 data-highlighted:bg-foreground/50 flex h-12 rounded-none px-4 py-3 text-center capitalize"
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

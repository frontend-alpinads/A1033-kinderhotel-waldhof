"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type RoomTabsProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tabs: { label: string; value: string }[];
};

export function RoomTabs({ activeTab, setActiveTab, tabs }: RoomTabsProps) {
  return (
    <div className="flex w-fit gap-2">
      {tabs.map((tab, index) => (
        <Button
          key={index}
          onClick={() => setActiveTab(tab.value)}
          variant={activeTab === tab.value ? "default" : "outline"}
          className={cn(
            "border-primary border text-sm leading-[125%] font-normal lg:h-fit lg:px-5 lg:py-3",
            activeTab !== tab.value &&
              "border-primary text-primary bg-primary/0 hover:bg-primary/10",
            activeTab === tab.value && "text-background pointer-events-none",
          )}
        >
          {tab.label}
        </Button>
      ))}
    </div>
  );
}

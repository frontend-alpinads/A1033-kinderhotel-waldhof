"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type GalleryTabsProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tabs: { label: string; value: string }[];
};

export function GalleryTabs({
  activeTab,
  setActiveTab,
  tabs,
}: GalleryTabsProps) {
  return (
    <div className="flex w-fit gap-2">
      {tabs.map((tab, index) => (
        <Button
          key={index}
          onClick={() => setActiveTab(tab.value)}
          variant={activeTab === tab.value ? "default" : "outline"}
          className={cn(
            "border-primary font-body border text-sm leading-[125%] font-medium lg:h-fit lg:px-5 lg:py-3",
            activeTab !== tab.value &&
              "border-primary text-primary hover:bg-primary/10 hover:text-primary font-medium",
            activeTab === tab.value && "text-background pointer-events-none",
          )}
        >
          {tab.label}
        </Button>
      ))}
    </div>
  );
}

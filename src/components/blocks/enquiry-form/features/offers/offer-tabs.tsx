"use client";

import { cn } from "@/lib/utils";

interface Tab {
  label: string;
  value: string;
}

interface OfferTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (value: string) => void;
}

export function OfferTabs({ tabs, activeTab, onTabChange }: OfferTabsProps) {
  return (
    <div className="relative flex w-full">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onTabChange(tab.value)}
          className={`relative flex-1 cursor-pointer border-b py-3 text-base transition-colors ${
            activeTab === tab.value
              ? "text-foreground"
              : "text-foreground/70 hover:text-foreground/90"
          }`}
        >
          {tab.label}
        </button>
      ))}
      <span
        className={cn(
          "bg-accent absolute bottom-0 left-0 h-px w-1/2 transition-transform duration-200 ease-in-out",
          activeTab === tabs[1].value && "translate-x-full",
        )}
      />
    </div>
  );
}

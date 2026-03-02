"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEnquiryFormTranslations } from "../../i18n";
import { CaretDownIcon, CheckIcon } from "@phosphor-icons/react";

type GuestsPickerContentProps = {
  localAdults: number;
  localChildren: number;
  localChildAges: number[];
  onAdultsChange: (increment: boolean) => void;
  onChildrenChange: (increment: boolean) => void;
  onChildAgeChange: (index: number, age: number) => void;
  onApply: () => void;
};

export function GuestsPickerContent({
  localAdults,
  localChildren,
  localChildAges,
  onAdultsChange,
  onChildrenChange,
  onChildAgeChange,
  onApply,
}: GuestsPickerContentProps) {
  const t = useEnquiryFormTranslations();

  return (
    <div className="grid gap-3">
      {/* Adults Counter */}
      <div className="flex flex-1 items-center justify-between py-2">
        <div className="text-center text-sm font-normal">{t.adults.other}</div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onAdultsChange(false)}
            className={`text-primary flex h-6 w-6 items-center justify-center rounded-full transition-colors ${
              localAdults <= 1
                ? "cursor-not-allowed opacity-20"
                : "hover:bg-background/10 cursor-pointer"
            }`}
            disabled={localAdults <= 1}
          >
            <MinusCircleIcon />
          </button>
          <div className="w-6 text-center text-sm font-normal tracking-[0.7px] uppercase">
            {localAdults}
          </div>
          <button
            onClick={() => onAdultsChange(true)}
            className="text-primary hover:bg-background/10 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full transition-colors"
          >
            <PlusCircleIcon />
          </button>
        </div>
      </div>

      {/* Children Counter */}
      <div className="flex flex-1 flex-col gap-5">
        <div className="flex items-center justify-between py-2">
          <div className="text-center text-sm font-normal">
            {t.children.other}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onChildrenChange(false)}
              className={`text-primary flex h-6 w-6 items-center justify-center rounded-full transition-colors ${
                localChildren <= 0
                  ? "cursor-not-allowed opacity-20"
                  : "hover:bg-background/10 cursor-pointer"
              }`}
              disabled={localChildren <= 0}
            >
              <MinusCircleIcon />
            </button>
            <div className="w-6 text-center text-sm tracking-[0.7px] uppercase">
              {localChildren}
            </div>
            <button
              onClick={() => onChildrenChange(true)}
              className="text-primary hover:bg-background/10 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full transition-colors"
            >
              <PlusCircleIcon />
            </button>
          </div>
        </div>

        {/* Child Age Selectors */}
        {localChildren > 0 && (
          <>
            <div className="bg-border h-px w-full"></div>
            <div className="flex flex-col gap-3">
              {Array.from({ length: localChildren }, (_, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-2"
                >
                  <div className="text-sm font-normal opacity-70">
                    {t.childAge} {index + 1}
                  </div>
                  <Select
                    value={(localChildAges[index] || 0).toString()}
                    onValueChange={(value) =>
                      onChildAgeChange(index, parseInt(value))
                    }
                  >
                    <SelectTrigger
                      className="border-muted h-12 w-32 cursor-pointer rounded-none border-t-0 border-r-0 border-b border-l-0 bg-transparent px-4 py-3 text-sm leading-normal font-normal shadow-none transition-colors"
                      showChevron={false}
                    >
                      <SelectValue />
                      <span className="">
                        <CaretDownIcon className="size-6" />
                      </span>
                    </SelectTrigger>
                    <SelectContent
                      scrollDownButtonClassname="text-foreground"
                      scrollUpButtonClassname="text-foreground"
                      className="bg-primary-foreground border-border z-100 max-h-[280px] overflow-y-auto rounded-none px-0 py-2"
                    >
                      <SelectItem
                        value="0"
                        className="focus:text-background data-highlighted:text-background focus:bg-primary data-highlighted:bg-primary cursor-pointer justify-start rounded-none px-4 py-2.5 text-sm leading-[1.2]"
                        customCheckIcon={
                          <span className="absolute right-2 flex size-3.5 items-center justify-center">
                            <SelectItemIndicator>
                              <CheckIcon className="" />
                            </SelectItemIndicator>
                          </span>
                        }
                      >
                        {"< 1"} {t.years.one}
                      </SelectItem>
                      {Array.from({ length: 17 }, (_, i) => i + 1).map(
                        (age, i) => (
                          <SelectItem
                            key={age}
                            value={age.toString()}
                            className="focus:text-background data-highlighted:text-background focus:bg-primary data-highlighted:bg-primary cursor-pointer justify-start rounded-none px-4 py-2.5 text-sm leading-[1.2]"
                            customCheckIcon={
                              <span className="absolute right-2 flex size-3.5 items-center justify-center">
                                <SelectItemIndicator>
                                  <CheckIcon className="text-current" />
                                </SelectItemIndicator>
                              </span>
                            }
                          >
                            {age} {i === 0 ? t.years.one : t.years.other}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="pt-2">
        <Button onClick={onApply} className="w-full">
          {t.apply}
        </Button>
      </div>
    </div>
  );
}

const MinusCircleIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="size-6"
  >
    <circle
      cx="10"
      cy="10"
      r="7.5"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
    />
    <path
      d="M7.5 10H12.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const PlusCircleIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="size-6"
  >
    <circle
      cx="10"
      cy="10"
      r="7.5"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
    />
    <path
      d="M10 7.5V12.5M7.5 10H12.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

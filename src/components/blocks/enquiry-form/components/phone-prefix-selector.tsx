"use client";

import { useState, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
  SelectSeparator,
  SelectGroup,
} from "@/components/ui/select";
import {
  COUNTRY_TO_PHONE_PREFIX,
  POPULAR_COUNTRY_CODES,
  getCountryFromPrefix,
} from "@/data/phone-codes";
import { countryCodeToFlagEmoji } from "@/data/country-codes";
import { useEnquiryFormTranslations } from "../i18n";

interface PhonePrefixSelectorProps {
  value: string;
  onChange: (prefix: string) => void;
  hasError?: boolean;
}

export function PhonePrefixSelector({
  value,
  onChange,
  hasError,
}: PhonePrefixSelectorProps) {
  const t = useEnquiryFormTranslations();
  const [searchQuery, setSearchQuery] = useState("");

  // Get current country code from prefix
  const currentCountryCode = getCountryFromPrefix(value);

  // Get all country codes sorted
  const allCountryCodes = Object.keys(COUNTRY_TO_PHONE_PREFIX).sort((a, b) => {
    const nameA =
      new Intl.DisplayNames([t.locale], { type: "region" }).of(a) || a;
    const nameB =
      new Intl.DisplayNames([t.locale], { type: "region" }).of(b) || b;
    return nameA.localeCompare(nameB);
  });

  // Filter based on search
  const filteredCountries = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return allCountryCodes;

    return allCountryCodes.filter((code) => {
      const name =
        new Intl.DisplayNames([t.locale], { type: "region" }).of(code) || code;
      const prefix = COUNTRY_TO_PHONE_PREFIX[code];
      return (
        name.toLowerCase().includes(q) ||
        code.toLowerCase().includes(q) ||
        prefix.includes(q)
      );
    });
  }, [searchQuery, allCountryCodes, t.locale]);

  const nonPopularCountries = filteredCountries.filter(
    (code) => !POPULAR_COUNTRY_CODES.includes(code),
  );

  const handleValueChange = (countryCode: string) => {
    const prefix = COUNTRY_TO_PHONE_PREFIX[countryCode];
    if (prefix) {
      onChange(prefix);
    }
  };

  return (
    <Select
      value={currentCountryCode || undefined}
      onValueChange={handleValueChange}
    >
      <SelectTrigger
        className={`flex h-[72px] w-[106px] cursor-pointer items-center justify-center rounded-[2px] border border-solid px-3 py-4 text-base leading-normal font-normal shadow-none transition-colors data-[size=default]:h-[72px] data-[size=sm]:h-[72px] ${
          hasError
            ? "border-destructive bg-destructive/10"
            : "border-border hover:border-secondary"
        }`}
      >
        <SelectValue>
          <div className="flex items-center justify-center gap-1">
            {currentCountryCode && (
              <span className="text-base">
                {countryCodeToFlagEmoji(currentCountryCode)}
              </span>
            )}
            <span className="text-base font-normal">{value}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="border-border rounded-[2px] border border-solid bg-white">
        {/* Search input */}
        <div className="sticky top-0 z-10 bg-white p-2">
          <input
            type="text"
            placeholder={t.search}
            className="border-border focus:border-primary placeholder:text-foreground h-10 w-full rounded-[2px] border border-solid bg-white px-3 text-sm outline-none placeholder:opacity-50"
            onChange={(e) => setSearchQuery(e.target.value)}
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        {/* Popular countries */}
        <SelectGroup>
          <SelectLabel>{t.popular}</SelectLabel>
          {POPULAR_COUNTRY_CODES.map((code) => (
            <SelectItem
              key={code}
              value={code}
              className="text-foreground! hover:bg-primary/10! focus:bg-primary/10! data-[state=checked]:bg-primary! cursor-pointer rounded-[2px] bg-transparent! data-[state=checked]:text-white!"
            >
              <div className="flex items-center gap-2">
                <span className="text-base">
                  {countryCodeToFlagEmoji(code)}
                </span>
                <span className="text-sm">
                  {new Intl.DisplayNames([t.locale], {
                    type: "region",
                  }).of(code) || code}
                </span>
                <span className="ml-auto text-sm font-normal opacity-60">
                  {COUNTRY_TO_PHONE_PREFIX[code]}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectGroup>

        <SelectSeparator className="bg-foreground/10" />

        {/* All other countries */}
        <SelectGroup>
          <SelectLabel>{t.allCountries}</SelectLabel>
          {nonPopularCountries.map((code) => (
            <SelectItem
              key={code}
              value={code}
              className="text-foreground! hover:bg-primary/10! focus:bg-primary/10! data-[state=checked]:bg-primary! cursor-pointer rounded-[2px] bg-transparent! data-[state=checked]:text-white!"
            >
              <div className="flex items-center gap-2">
                <span className="text-base">
                  {countryCodeToFlagEmoji(code)}
                </span>
                <span className="text-sm">
                  {new Intl.DisplayNames([t.locale], {
                    type: "region",
                  }).of(code) || code}
                </span>
                <span className="ml-auto text-sm opacity-60">
                  {COUNTRY_TO_PHONE_PREFIX[code]}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

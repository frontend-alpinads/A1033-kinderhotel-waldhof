"use client";

import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import Link from "next/link";
import { CaretDownIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { localeNames, locales, type Locale, parsePathname, switchLocale } from "@/lib/i18n";

const LANGUAGES = locales.map((code) => ({
  code,
  name: localeNames[code],
})) as Array<{ code: Locale; name: string }>;

type LanguageSwitcherProps = {
  ghost?: boolean;
};

export function LanguageSwitcher({ ghost = false }: LanguageSwitcherProps) {
  const pathname = usePathname();

  const currentLocale = parsePathname(pathname).locale;
  const currentLang = LANGUAGES.find((l) => l.code === currentLocale) ?? LANGUAGES[0];

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        className={buttonVariants({
          variant: ghost ? "ghost" : "secondary",
          className: "px-4! " + (ghost ? "text-background" : ""),
        })}
      >
        <span className="contents">
          {currentLang.code.toUpperCase()}
          <CaretDownIcon className="size-5 lg:size-6" weight="regular" />
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="center"
        sideOffset={12}
        className={cn(
          "text-background flex min-w-40 flex-col gap-2 rounded-none border border-white/20 p-3 backdrop-blur-sm",
          ghost && "text-background bg-primary-foreground border-none",
        )}
        style={{
          background: !ghost
            ? "linear-gradient(101deg, rgba(136, 136, 136, 0.32) 1.12%, rgba(136, 136, 136, 0.04) 148%)"
            : undefined,
        }}
      >
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            asChild
            className={cn(
              "rounded-none px-5 py-2 text-base font-normal data-highlighted:bg-white/10",
              lang.code === currentLang.code && "bg-white/20",
              ghost &&
                "text-foreground data-highlighted:bg-background data-highlighted:text-foreground",
              ghost &&
                lang.code === currentLang.code &&
                "bg-foreground text-background",
            )}
          >
            <Link
              href={switchLocale(pathname, lang.code)}
              className="w-full cursor-pointer"
            >
              {lang.name}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

"use client";

import { CookieInfo, ConsentStatus } from "./types";
import { ContentBadge } from "./content-badge";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface CookieAccordionProps {
  cookies: CookieInfo[];
  category: string;
  description: string;
  consentStatus: ConsentStatus;
}

export function CookieAccordion({
  cookies,
  category,
  description,
  consentStatus,
}: CookieAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Map category to consent status key
  const consentKey = category.toLowerCase().replace(" ", "");
  const hasConsent = consentStatus[consentKey] ?? false;

  // Group cookies by type
  const groupedByType = cookies.reduce(
    (acc, cookie) => {
      const type = cookie.type || "cookie";
      if (!acc[type]) acc[type] = [];
      acc[type].push(cookie);
      return acc;
    },
    {} as Record<string, CookieInfo[]>,
  );

  const typeLabels = {
    cookie: "Cookies",
    localStorage: "Local Storage",
    sessionStorage: "Session Storage",
  };

  return (
    <div className="border-t border-gray-200 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="accordion-trigger w-full px-4 py-6 text-left transition-all hover:opacity-80"
        id={`category-${category.toLowerCase().replace(/\s+/g, "-")}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-900 md:text-2xl">
              {category}
            </h2>
            <ContentBadge variant={hasConsent ? "secondary" : "outline"}>
              {cookies.length} {cookies.length === 1 ? "item" : "items"}
            </ContentBadge>
            <ContentBadge variant={hasConsent ? "secondary" : "outline"}>
              {hasConsent ? "Accepted" : "Not Accepted"}
            </ContentBadge>
          </div>
          <ChevronDown
            className={cn(
              "h-5 w-5 text-gray-500 transition-transform duration-200",
              isOpen && "rotate-180",
            )}
          />
        </div>
      </button>

      <div
        className={cn(
          "overflow-hidden transition-all duration-300",
          isOpen ? "max-h-[2000px] pb-6" : "max-h-0",
        )}
      >
        <div className="space-y-6 px-4 pb-6">
          <p className="text-gray-600">{description}</p>

          {Object.entries(groupedByType).map(([type, items]) => (
            <div key={type} className="space-y-4">
              <h3 className="text-lg font-normal text-gray-800">
                {typeLabels[type as keyof typeof typeLabels]}
              </h3>

              <div className="divide-y divide-gray-200 border border-gray-200 bg-gray-50">
                {items.map((cookie, index) => (
                  <div key={`${cookie.name}-${index}`} className="p-4">
                    <div className="mb-3 flex items-start justify-between">
                      <h4 className="font-normal text-gray-900">
                        {cookie.name}
                      </h4>
                      <ContentBadge variant="outline" className="text-xs">
                        {cookie.source}
                      </ContentBadge>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600">
                      <div>
                        <span className="font-normal">Purpose:</span>{" "}
                        {cookie.purpose}
                      </div>
                      <div>
                        <span className="font-normal">Duration:</span>{" "}
                        {cookie.duration}
                      </div>
                      <div>
                        <span className="font-normal">Legal Basis:</span>{" "}
                        {cookie.gdprBasis}
                      </div>
                      {cookie.value && (
                        <details className="mt-2">
                          <summary className="cursor-pointer font-normal text-gray-700 hover:text-gray-900">
                            Show value
                          </summary>
                          <pre className="mt-2 overflow-x-auto bg-gray-100 p-2 text-xs">
                            {cookie.value}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

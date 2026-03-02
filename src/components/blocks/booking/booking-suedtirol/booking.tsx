"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";
import { HOTEL_CONFIG } from "@/hotel-config";

type BookingWidgetProps = {
  lang?: "de" | "it" | "en";
  propertyId?: number;
  widgetId?: string;
  accentColor?: string;
  backgroundColor?: string;
  textColor?: string;
  promotion?: [string | null, string | null, string | null];
};

const LEGAL_URLS = {
  privacy: HOTEL_CONFIG.legal.privacy,
  terms: HOTEL_CONFIG.legal.imprint,
};

export function Booking({
  lang = "de",
  propertyId = 10314,
  widgetId = "Bs-BookingWidget",
  accentColor = "var(--primary)",
  backgroundColor = "var(--muted)",
  textColor = "var(--foreground)",
  promotion = [null, "alpin ads", null],
}: BookingWidgetProps) {
  const initializedRef = useRef(false);

  const privacyURL = LEGAL_URLS.privacy[lang] || LEGAL_URLS.privacy.de;
  const termsURL = LEGAL_URLS.terms[lang] || LEGAL_URLS.terms.de;

  const initWidget = () => {
    if (initializedRef.current) return;
    const w = window as unknown as Record<string, unknown>;
    const BookingSuedtirol = (w["BookingSüdtirol"] || w.BookingSuedtirol) as
      | Record<string, unknown>
      | undefined;
    const Widgets = BookingSuedtirol?.Widgets as
      | Record<string, unknown>
      | undefined;
    const BookingFn = Widgets?.Booking as
      | ((selector: string, config: Record<string, unknown>) => void)
      | undefined;

    if (BookingFn) {
      const el = document.getElementById(widgetId);
      if (el) {
        el.innerHTML = "";
      }
      BookingFn(`#${widgetId}`, {
        id: widgetId,
        propertyId,
        lang,
        privacyURL,
        termsURL,
        promotion,
      });
      initializedRef.current = true;
    }
  };

  useEffect(() => {
    initializedRef.current = false;
    let attempts = 0;

    const tryInit = () => {
      try {
        const w = window as unknown as Record<string, unknown>;
        const B = (w["BookingSüdtirol"] || w.BookingSuedtirol) as
          | Record<string, unknown>
          | undefined;
        const Widgets = B?.Widgets as Record<string, unknown> | undefined;
        if (Widgets?.Booking) {
          initWidget();
          return true;
        }
      } catch {
        // ignore
      }
      return false;
    };

    if (!tryInit()) {
      const iv = setInterval(() => {
        attempts++;
        if (tryInit() || attempts > 60) {
          clearInterval(iv);
        }
      }, 150);
      return () => clearInterval(iv);
    }
  }, [widgetId, lang, propertyId, privacyURL, termsURL]);

  return (
    <div>
      <div id={widgetId} />
      <style jsx global>{`
        #${widgetId} {
          --booking-bg: ${backgroundColor};
          --booking-accent: ${accentColor};
          --booking-text: ${textColor};
          background: var(--booking-bg);
          color: var(--booking-text);
          padding: 16px;
          border-radius: 12px;
        }
        #${widgetId} button,
        #${widgetId} .btn,
        #${widgetId} a[class*="btn"],
        #${widgetId} [role="button"] {
          background-color: var(--booking-accent) !important;
          border-color: var(--booking-accent) !important;
          color: #fff !important;
        }
        #${widgetId} button:hover,
        #${widgetId} .btn:hover,
        #${widgetId} a[class*="btn"]:hover,
        #${widgetId} [role="button"]:hover {
          filter: brightness(0.95);
        }
        #${widgetId} input,
        #${widgetId} select,
        #${widgetId} textarea {
          background-color: #ffffff !important;
          color: #1b1b1b !important;
        }
        #${widgetId} a {
          color: var(--booking-accent);
        }
        #${widgetId} *:focus-visible {
          outline: 2px solid var(--booking-accent);
          outline-offset: 2px;
        }
      `}</style>
      <Script
        id="booking-suedtirol-js"
        src="https://widget.bookingsuedtirol.com/v2/bundle.js"
        strategy="afterInteractive"
        onLoad={initWidget}
      />
    </div>
  );
}

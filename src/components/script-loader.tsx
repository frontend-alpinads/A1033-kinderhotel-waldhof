"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

// Type declarations
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    CookieScript?: {
      instance?: {
        on: (event: string, callback: () => void) => void;
      };
    };
  }
}

interface ConsentState {
  hasFullConsent: boolean;
  consentGiven: boolean;
  categories: string[];
}

// Configuration constants
const COOKIE_SCRIPT_URL = process.env.NEXT_PUBLIC_COOKIE_SCRIPT_URL;
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

export function ScriptsLoader() {
  const [consentState, setConsentState] = useState<ConsentState>({
    hasFullConsent: false,
    consentGiven: false,
    categories: [],
  });
  const [gtmLoaded, setGtmLoaded] = useState(false);

  useEffect(() => {
    // Store original cookie getter to avoid recursion
    const originalCookieDescriptor = Object.getOwnPropertyDescriptor(
      Document.prototype,
      "cookie",
    );
    const originalCookieGetter = originalCookieDescriptor?.get;

    // Helper function to check consent without recursion
    const checkConsentWithoutRecursion = (): boolean => {
      if (!originalCookieGetter) return false;

      try {
        const currentCookies = originalCookieGetter.call(document);
        const cookieValue = currentCookies
          .split("; ")
          .find((row: string) => row.startsWith("CookieScriptConsent="))
          ?.split("=")[1];

        if (cookieValue) {
          const decoded = decodeURIComponent(cookieValue);
          const parsed = JSON.parse(decoded);
          const categories = parsed.categories
            ? JSON.parse(parsed.categories)
            : [];
          return (
            parsed.action === "accept" &&
            ((categories.includes("performance") &&
              categories.includes("targeting") &&
              categories.includes("functionality")) ||
              categories.length === 0)
          );
        }
      } catch {
        return false;
      }
      return false;
    };

    // Block ALL tracking before any scripts load
    const blockAllTracking = () => {
      // Get original cookie descriptor before overriding
      const originalCookieSetter = originalCookieDescriptor?.set;

      if (originalCookieSetter && originalCookieGetter) {
        Object.defineProperty(document, "cookie", {
          set: function (value: string) {
            const cookieName = value.split("=")[0].trim();
            const trackingCookies = [
              "_fbp",
              "_gcl_au",
              "IDE",
              "test_cookie",
              "_ga",
              "_gid",
              "_gat",
              "fr",
              "_fbc",
            ];

            // Check consent without recursion
            const hasConsent = checkConsentWithoutRecursion();
            const isTrackingCookie = trackingCookies.some((tc) =>
              cookieName.includes(tc),
            );

            if (isTrackingCookie && !hasConsent) {
              console.log(`🚫 BLOCKED cookie: ${cookieName} (no consent)`);
              return;
            } else if (isTrackingCookie && hasConsent) {
              console.log(`✅ ALLOWED cookie: ${cookieName} (consent granted)`);
            }

            return originalCookieSetter.call(document, value);
          },
          get: function () {
            return originalCookieGetter.call(document);
          },
          configurable: true,
        });
      }

      // Block image tracking pixels
      const originalImageSrc = Object.getOwnPropertyDescriptor(
        HTMLImageElement.prototype,
        "src",
      );
      if (originalImageSrc && originalImageSrc.set) {
        Object.defineProperty(HTMLImageElement.prototype, "src", {
          set: function (value: string) {
            const trackingDomains = [
              "doubleclick.net",
              "google-analytics.com",
              "googleadservices.com",
              "googlesyndication.com",
              "facebook.com",
              "facebook.net",
            ];

            const hasConsent = checkConsentWithoutRecursion();

            if (
              !hasConsent &&
              trackingDomains.some((domain) => value.includes(domain))
            ) {
              console.log(`🚫 BLOCKED tracking pixel: ${value}`);
              return;
            }

            return originalImageSrc.set!.call(this, value);
          },
          get: originalImageSrc.get,
          configurable: true,
        });
      }

      // Block script creation for tracking domains
      const originalCreateElement = document.createElement.bind(document);
      (
        document as Document & { createElement: typeof document.createElement }
      ).createElement = function (
        tagName: string,
        options?: ElementCreationOptions,
      ) {
        const element = originalCreateElement(tagName, options);

        if (tagName.toLowerCase() === "script") {
          const script = element as HTMLScriptElement;
          const originalSrcSetter = Object.getOwnPropertyDescriptor(
            HTMLScriptElement.prototype,
            "src",
          )?.set;

          if (originalSrcSetter) {
            Object.defineProperty(script, "src", {
              set: function (value: string) {
                const trackingDomains = [
                  "googletagmanager.com",
                  "google-analytics.com",
                  "googleadservices.com",
                  "googlesyndication.com",
                  "doubleclick.net",
                  "facebook.net",
                  "facebook.com",
                  "connect.facebook.net",
                ];

                const hasConsent = checkConsentWithoutRecursion();

                if (
                  !hasConsent &&
                  trackingDomains.some((domain) => value.includes(domain))
                ) {
                  console.log(`🚫 BLOCKED script: ${value} (no consent)`);
                  return;
                }

                return originalSrcSetter.call(this, value);
              },
              get: function () {
                return this.getAttribute("src") || "";
              },
              configurable: true,
            });
          }
        }

        return element;
      };

      console.log("🛡️ Comprehensive tracking blocker initialized");
    };

    // Check consent status
    const checkConsentStatus = (): ConsentState => {
      try {
        const cookieValue = document.cookie
          .split("; ")
          .find((row) => row.startsWith("CookieScriptConsent="))
          ?.split("=")[1];

        if (!cookieValue) {
          return { hasFullConsent: false, consentGiven: false, categories: [] };
        }

        const decoded = decodeURIComponent(cookieValue);
        const parsed = JSON.parse(decoded);

        let categories: string[] = [];
        try {
          categories = parsed.categories ? JSON.parse(parsed.categories) : [];
        } catch {
          categories = [];
        }

        // Only allow full consent if ALL categories are accepted
        const hasFullConsent =
          parsed.action === "accept" &&
          ((categories.includes("performance") &&
            categories.includes("targeting") &&
            categories.includes("functionality")) ||
            categories.length === 0); // "Accept All" case

        return {
          hasFullConsent,
          consentGiven: parsed.action === "accept",
          categories,
        };
      } catch {
        return { hasFullConsent: false, consentGiven: false, categories: [] };
      }
    };

    // Initialize blocking immediately
    blockAllTracking();

    // Initialize consent mode
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: unknown[]) {
      window.dataLayer!.push(args);
    }
    window.gtag = gtag;

    // Set strictest defaults
    gtag("consent", "default", {
      ad_storage: "denied",
      analytics_storage: "denied",
      functionality_storage: "denied",
      personalization_storage: "denied",
      security_storage: "granted",
      wait_for_update: 500,
    });

    // Track previous consent state to avoid duplicate updates
    let previousConsentState = { hasFullConsent: false };

    // Monitor consent changes
    const handleConsentChange = () => {
      const newConsentState = checkConsentStatus();

      // Only update if consent state actually changed
      if (
        newConsentState.hasFullConsent !== previousConsentState.hasFullConsent
      ) {
        previousConsentState = {
          hasFullConsent: newConsentState.hasFullConsent,
        };
        setConsentState(newConsentState);

        if (window.gtag) {
          if (newConsentState.hasFullConsent) {
            // Update consent mode
            window.gtag("consent", "update", {
              ad_storage: "granted",
              analytics_storage: "granted",
              functionality_storage: "granted",
              personalization_storage: "granted",
            });

            console.log("✅ Full consent granted - GTM can now load");
          } else {
            // Keep everything denied
            window.gtag("consent", "update", {
              ad_storage: "denied",
              analytics_storage: "denied",
              functionality_storage: "denied",
              personalization_storage: "denied",
            });

            console.log("🚫 Partial or no consent - GTM blocked");
          }
        }
      }
    };

    // Check initial consent
    handleConsentChange();

    // Listen for Cookie Script events
    const checkInterval = setInterval(() => {
      const cookieScript = window.CookieScript;
      if (cookieScript?.instance) {
        try {
          // Check if 'on' method exists
          if (typeof cookieScript.instance.on === "function") {
            cookieScript.instance.on("consent", handleConsentChange);
          } else {
            // Fallback: listen for consent changes via cookie polling
            console.log(
              "CookieScript.instance.on not available, using fallback",
            );
          }
        } catch (error) {
          console.log("Error setting up CookieScript listener:", error);
        }
        clearInterval(checkInterval);
      }
    }, 100);

    // Also check periodically for consent changes
    const consentCheckInterval = setInterval(handleConsentChange, 1000);

    return () => {
      clearInterval(checkInterval);
      clearInterval(consentCheckInterval);
    };
  }, []);

  return (
    <>
      {/* Cookie Script - GDPR Compliant Cookie Banner */}
      <Script
        id="cookie-script"
        strategy="afterInteractive"
        src={COOKIE_SCRIPT_URL}
      />

      {/* Only load GTM if we have FULL consent and it hasn't been loaded yet */}
      {consentState.hasFullConsent && !gtmLoaded && (
        <>
          {/* Google Tag Manager */}
          <Script
            id="gtm-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${GTM_ID}');
              `,
            }}
            onLoad={() => {
              setGtmLoaded(true);
              console.log("✅ GTM script loaded successfully");
            }}
          />

          {/* Google Tag Manager (noscript) */}
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        </>
      )}
    </>
  );
}

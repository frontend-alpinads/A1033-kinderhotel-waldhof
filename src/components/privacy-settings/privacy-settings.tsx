"use client";

import { useEffect, useState } from "react";
import { CookieAccordion } from "./cookie-accordion";
import { ContentBadge } from "./content-badge";
import { TocLink } from "./toc-link";
import { CookieInfo, ConsentStatus, GroupedCookies } from "./types";

const HOTEL_NAME = process.env.NEXT_PUBLIC_HOTEL_NAME;
const HOTEL_ADDRESS = process.env.NEXT_PUBLIC_HOTEL_ADDRESS;
const HOTEL_PHONE = process.env.NEXT_PUBLIC_HOTEL_PHONE;
const HOTEL_EMAIL = process.env.NEXT_PUBLIC_HOTEL_EMAIL;
const PRIVACY_SETTINGS_LAST_UPDATED =
  process.env.NEXT_PUBLIC_PRIVACY_SETTINGS_LAST_UPDATED;

// Helper function to get category descriptions
const getCategoryDescription = (category: string): string => {
  const descriptions: Record<string, string> = {
    Necessary:
      "Essential cookies required for the website to function properly. These cannot be disabled.",
    Analytics:
      "Cookies used to understand how visitors interact with the website, helping to improve user experience.",
    Performance:
      "Cookies that help measure website performance and loading times.",
    Marketing:
      "Cookies used to track visitors across websites to display relevant advertisements.",
    Targeting:
      "Cookies that build profiles of your interests to show you relevant ads on other sites.",
    Functionality:
      "Cookies that enable enhanced functionality and personalization.",
    Preferences:
      "Cookies that remember your choices and preferences for a better experience.",
    Other:
      "Cookies that don&apos;t fit into standard categories or have unknown purposes.",
    Unknown:
      "Items detected but not yet categorized. Please contact us for more information.",
  };
  return descriptions[category] || descriptions.Other;
};

export function PrivacySettings() {
  const [groupedCookies, setGroupedCookies] = useState<GroupedCookies[]>([]);
  const [consentStatus, setConsentStatus] = useState<ConsentStatus>({});
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const detectCookies = () => {
      // Get cookies from document.cookie
      const allCookies = document.cookie.split(";").reduce(
        (acc, cookie) => {
          const [name, value] = cookie.trim().split("=");
          if (name && value) {
            acc[name] = decodeURIComponent(value);
          }
          return acc;
        },
        {} as Record<string, string>,
      );

      // Also check localStorage and sessionStorage for tracking items
      const storageItems: Record<string, string> = {};

      // Check localStorage
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (
            key &&
            (key.includes("_gcl") ||
              key.includes("_ga") ||
              key.includes("_fb") ||
              key.includes("lastExternal") ||
              key.includes("topics") ||
              key.toLowerCase().includes("referrer"))
          ) {
            storageItems[`localStorage:${key}`] =
              localStorage.getItem(key) || "";
          }
        }
      } catch {
        console.log("Could not access localStorage");
      }

      // Check sessionStorage
      try {
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          if (
            key &&
            (key.includes("_gcl") ||
              key.includes("_ga") ||
              key.includes("_fb") ||
              key.toLowerCase().includes("referrer"))
          ) {
            storageItems[`sessionStorage:${key}`] =
              sessionStorage.getItem(key) || "";
          }
        }
      } catch {
        console.log("Could not access sessionStorage");
      }

      // Combine cookies and storage items
      const allTrackingItems = { ...allCookies, ...storageItems };

      // Define cookie information based on known cookies
      const cookieDatabase: Record<
        string,
        Omit<CookieInfo, "name" | "value">
      > = {
        // Cookie Script cookies
        CookieScriptConsent: {
          category: "Necessary",
          purpose: "Stores user consent preferences for cookie categories",
          duration: "1 year",
          source: "Cookie-Script.com",
          gdprBasis: "Consent management (Art. 6(1)(c) GDPR)",
        },
        cookiescript_accept: {
          category: "Necessary",
          purpose: "Tracks whether user has made a consent choice",
          duration: "Session",
          source: "Cookie-Script.com",
          gdprBasis: "Consent management (Art. 6(1)(c) GDPR)",
        },
        // Google Analytics cookies
        _ga: {
          category: "Analytics",
          purpose:
            "Distinguishes unique users by assigning a randomly generated number",
          duration: "2 years",
          source: "Google Analytics",
          gdprBasis: "Consent (Art. 6(1)(a) GDPR)",
        },
        _gid: {
          category: "Analytics",
          purpose: "Distinguishes users for 24 hours",
          duration: "24 hours",
          source: "Google Analytics",
          gdprBasis: "Consent (Art. 6(1)(a) GDPR)",
        },
        "_ga_*": {
          category: "Analytics",
          purpose: "Google Analytics 4 session and user tracking",
          duration: "2 years",
          source: "Google Analytics 4",
          gdprBasis: "Consent (Art. 6(1)(a) GDPR)",
        },
        // Google Ads / Marketing cookies
        _gcl_au: {
          category: "Marketing",
          purpose:
            "Used by Google AdSense for experimenting with advertisement efficiency",
          duration: "3 months",
          source: "Google Ads",
          gdprBasis: "Consent (Art. 6(1)(a) GDPR)",
        },
        // Facebook Pixel
        _fbp: {
          category: "Marketing",
          purpose: "Used by Facebook to deliver advertisement products",
          duration: "3 months",
          source: "Facebook",
          gdprBasis: "Consent (Art. 6(1)(a) GDPR)",
        },
        // DoubleClick
        IDE: {
          category: "Targeting",
          purpose:
            "Used by Google DoubleClick to track user behavior across websites",
          duration: "13 months",
          source: "DoubleClick",
          gdprBasis: "Consent (Art. 6(1)(a) GDPR)",
        },
        test_cookie: {
          category: "Targeting",
          purpose: "Used to check if the browser supports cookies",
          duration: "15 minutes",
          source: "DoubleClick",
          gdprBasis: "Consent (Art. 6(1)(a) GDPR)",
        },
        // localStorage items
        _gcl_ls: {
          category: "Marketing",
          purpose:
            "Google conversion linker localStorage item for tracking ad conversions",
          duration: "90 days",
          source: "Google Ads",
          gdprBasis: "Consent (Art. 6(1)(a) GDPR)",
        },
        "localStorage:_gcl_ls": {
          category: "Marketing",
          purpose:
            "Google conversion linker localStorage item for tracking ad conversions",
          duration: "90 days",
          source: "Google Ads",
          gdprBasis: "Consent (Art. 6(1)(a) GDPR)",
        },
        "localStorage:lastExternalReferrer": {
          category: "Analytics",
          purpose: "Stores the last external referrer for attribution tracking",
          duration: "Persistent",
          source: "Analytics",
          gdprBasis: "Consent (Art. 6(1)(a) GDPR)",
        },
        "localStorage:lastExternalReferrerTime": {
          category: "Analytics",
          purpose: "Timestamp of the last external referrer",
          duration: "Persistent",
          source: "Analytics",
          gdprBasis: "Consent (Art. 6(1)(a) GDPR)",
        },
        "localStorage:topicsLastReferenceTime": {
          category: "Analytics",
          purpose: "Timestamp for topic tracking",
          duration: "Persistent",
          source: "Analytics",
          gdprBasis: "Consent (Art. 6(1)(a) GDPR)",
        },
        // Next.js specific
        __nextDevClientId: {
          category: "Necessary",
          purpose: "Next.js development server client identification",
          duration: "Session",
          source: "Next.js Development",
          gdprBasis: "Legitimate interest (Art. 6(1)(f) GDPR)",
        },
        NEXT_LOCALE: {
          category: "Preferences",
          purpose: "Stores the user&apos;s language preference",
          duration: "1 year",
          source: "Next.js Application",
          gdprBasis: "Contract performance (Art. 6(1)(b) GDPR)",
        },
      };

      const detectedCookies: CookieInfo[] = Object.entries(allTrackingItems)
        .filter(([name, value]) => name && value) // Only include actual items
        .map(([key, value]) => {
          // Determine the type based on the key prefix
          let type: "cookie" | "localStorage" | "sessionStorage" = "cookie";
          let name = key;

          if (key.startsWith("localStorage:")) {
            type = "localStorage";
            name = key.replace("localStorage:", "");
          } else if (key.startsWith("sessionStorage:")) {
            type = "sessionStorage";
            name = key.replace("sessionStorage:", "");
          }

          const info = cookieDatabase[name] ||
            cookieDatabase[key] ||
            cookieDatabase[name.replace(/_[A-Z0-9]+$/, "_*")] || {
              category: "Unknown",
              purpose:
                "Purpose not documented - please contact website administrator",
              duration: "Unknown",
              source: "Unknown",
              gdprBasis: "To be determined",
            };

          return {
            name,
            value: value.length > 50 ? value.substring(0, 50) + "..." : value,
            type,
            ...info,
          };
        });

      // Group cookies by category
      const grouped = detectedCookies.reduce((acc, cookie) => {
        const existing = acc.find((g) => g.category === cookie.category);
        if (existing) {
          existing.items.push(cookie);
        } else {
          acc.push({
            category: cookie.category,
            items: [cookie],
            description: getCategoryDescription(cookie.category),
          });
        }
        return acc;
      }, [] as GroupedCookies[]);

      // Sort categories and items within each category
      const categoryOrder = [
        "Necessary",
        "Analytics",
        "Performance",
        "Marketing",
        "Targeting",
        "Functionality",
        "Preferences",
        "Other",
        "Unknown",
      ];

      grouped.sort((a, b) => {
        const indexA = categoryOrder.indexOf(a.category);
        const indexB = categoryOrder.indexOf(b.category);
        return indexA - indexB;
      });

      grouped.forEach((group) => {
        group.items.sort((a, b) => {
          // Sort by type first (cookies, localStorage, sessionStorage)
          if (a.type !== b.type) {
            const typeOrder = ["cookie", "localStorage", "sessionStorage"];
            return typeOrder.indexOf(a.type!) - typeOrder.indexOf(b.type!);
          }
          return a.name.localeCompare(b.name);
        });
      });

      setGroupedCookies(grouped);
    };

    const checkConsentStatus = () => {
      // Parse Cookie Script consent from cookie data
      try {
        const cookieValue = document.cookie
          .split("; ")
          .find((row) => row.startsWith("CookieScriptConsent="))
          ?.split("=")[1];

        if (cookieValue) {
          const decoded = decodeURIComponent(cookieValue);
          const parsed = JSON.parse(decoded);

          // Parse categories - it might be a JSON string or undefined (for Accept All)
          let categories: string[] = [];
          try {
            if (parsed.categories) {
              categories = JSON.parse(parsed.categories);
            }
          } catch {
            categories = [];
          }

          setConsentStatus({
            necessary: true, // Always true
            analytics:
              parsed.action === "accept" &&
              (categories.length === 0 || categories.includes("performance")),
            performance:
              parsed.action === "accept" &&
              (categories.length === 0 || categories.includes("performance")),
            marketing:
              parsed.action === "accept" &&
              (categories.length === 0 || categories.includes("targeting")),
            targeting:
              parsed.action === "accept" &&
              (categories.length === 0 || categories.includes("targeting")),
            functionality:
              parsed.action === "accept" &&
              (categories.length === 0 || categories.includes("functionality")),
            preferences:
              parsed.action === "accept" &&
              (categories.length === 0 || categories.includes("functionality")),
          });
        } else {
          setConsentStatus({
            necessary: true,
            analytics: false,
            performance: false,
            marketing: false,
            targeting: false,
            functionality: false,
            preferences: false,
          });
        }
      } catch {
        setConsentStatus({
          necessary: true,
          analytics: false,
          performance: false,
          marketing: false,
          targeting: false,
          functionality: false,
          preferences: false,
        });
      }
    };

    detectCookies();
    checkConsentStatus();

    // Refresh every 2 seconds to catch new cookies
    const interval = setInterval(() => {
      detectCookies();
      checkConsentStatus();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Track active section for ToC highlighting (stable scroll-based, low flicker)
  useEffect(() => {
    const sectionIds = [
      "what-are-cookies",
      "how-we-use-cookies",
      "your-choices",
      "manage-cookies",
      "active-cookies",
      "our-customers",
      "policy-updates",
      "contact",
    ];

    const SCROLL_OFFSET = 160; // account for header/top spacing
    let ticking = false;

    const computeActive = () => {
      const scrollYWithOffset = window.scrollY + SCROLL_OFFSET;
      let current = sectionIds[0];
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.offsetTop <= scrollYWithOffset) {
          current = id;
        } else {
          break;
        }
      }
      setActiveId((prev) => (prev !== current ? current : prev));
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        computeActive();
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    // initialize on mount
    computeActive();

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-[1200px] px-6 py-20">
        {/* Header */}
        <div className="border-x border-t border-gray-200 p-8 text-center">
          <h1
            className="mb-6"
            style={{
              fontSize: "48px",
              fontWeight: 600,
              lineHeight: "56px",
              letterSpacing: "-1.5px",
              color: "#171717",
            }}
          >
            Cookie Policy
          </h1>
          <p
            style={{
              color: "#666666",
              fontSize: "16px",
              fontWeight: 400,
              lineHeight: "24px",
            }}
          >
            Last Updated {PRIVACY_SETTINGS_LAST_UPDATED}
          </p>
        </div>

        <div className="flex border border-gray-200">
          {/* Main Content */}
          <div className="mx-8 my-8 max-w-3xl flex-1">
            {/* Section 1: What are Cookies */}
            <section id="what-are-cookies" className="mb-16 scroll-mt-24">
              <h2
                className="mb-6"
                style={{
                  fontSize: "32px",
                  fontWeight: 600,
                  lineHeight: "40px",
                  letterSpacing: "-1.28px",
                  color: "#171717",
                }}
              >
                What are Cookies, Pixels and Local Storage?
              </h2>
              <div
                className="space-y-4"
                style={{
                  color: "#666666",
                  fontSize: "16px",
                  fontWeight: 400,
                  lineHeight: "24px",
                }}
              >
                <p>
                  Cookies are small files that websites place on your computer
                  as you browse the web. Like many commercial websites, we use
                  cookies. Cookies — and similar technologies — do lots of
                  different jobs, like letting you navigate between pages
                  efficiently, remembering your preferences, and generally
                  improving the user experience. Cookies and other technologies
                  may also be used to measure the effectiveness of marketing and
                  otherwise assist us in making your use of the Platform and its
                  features more relevant and useful to you.
                </p>
                <p>
                  Pixel tags (also known as web beacons or pixels) are small
                  blocks of code on a web page or in an email notification.
                  Pixels allow companies to collect information such as an
                  individual&apos;s IP address, when the individual viewed the
                  pixel and the type of browser used. We use pixel tags to
                  understand whether you&apos;ve interacted with content on our
                  Platform, which helps us measure and improve our Platform and
                  personalize your experience.
                </p>
                <p>
                  Local storage allows a website to store information locally on
                  your computer or mobile device. Local storage is mainly used
                  to store and retrieve data in HTML pages from the same domain.
                  We use local storage to customize what we show you based on
                  your past interactions with our Platform.
                </p>
                <p>
                  It is important to understand that cookies (and the
                  technologies listed above) collect personal information as
                  well as non-identifiable information.
                </p>
              </div>
            </section>

            {/* Section 2: How We Use Cookies */}
            <section id="how-we-use-cookies" className="mb-16 scroll-mt-24">
              <h2
                className="mb-6"
                style={{
                  fontSize: "32px",
                  fontWeight: 600,
                  lineHeight: "40px",
                  letterSpacing: "-1.28px",
                  color: "#171717",
                }}
              >
                How and Why We Use Cookies
              </h2>
              <p
                className="mb-6"
                style={{
                  color: "#666666",
                  fontSize: "16px",
                  fontWeight: 400,
                  lineHeight: "24px",
                }}
              >
                We use both 1st party cookies (which are set by us) and 3rd
                party cookies (which are set by a server located outside the
                domain of our Site). Some of the cookies or similar technologies
                that we use are &quot;strictly necessary&quot; in that they are
                essential to the Site. Without them, the Site will not work.
                Other cookies or similar technologies, while not essential, help
                us improve our Platform or measure audiences. Why we use cookies
                is describe below in more detail.
              </p>

              {/* Cookie Categories */}
              <div className="space-y-6">
                <div>
                  <h3
                    className="mb-3"
                    style={{
                      fontSize: "18px",
                      fontWeight: 500,
                      color: "#171717",
                    }}
                  >
                    Strictly Necessary or Essential Cookies:
                  </h3>
                  <p
                    style={{
                      color: "#666666",
                      fontSize: "16px",
                      fontWeight: 400,
                      lineHeight: "24px",
                    }}
                  >
                    These cookies are necessary for the Site to function and
                    cannot be switched off in our systems. For example, we use
                    cookies to authenticate you. When you log on to our
                    websites, authentication cookies are set which let us know
                    who you are during a browsing session. We have to load
                    essential cookies for legitimate interests pursued by us in
                    delivering our Site&apos;s essential functionality to you.
                  </p>
                </div>

                <div>
                  <h3
                    className="mb-3"
                    style={{
                      fontSize: "18px",
                      fontWeight: 500,
                      color: "#171717",
                    }}
                  >
                    Functionality Cookies:
                  </h3>
                  <p
                    style={{
                      color: "#666666",
                      fontSize: "16px",
                      fontWeight: 400,
                      lineHeight: "24px",
                    }}
                  >
                    These cookies are used to enable certain additional
                    functionality on our Site, such as storing your preferences
                    (e.g. username) and assisting us in providing support or
                    payment services to you so we know your browser or operating
                    system. This functionality improves user experience and
                    enables us to provide better Services and a more efficient
                    Platform.
                  </p>
                </div>

                <div>
                  <h3
                    className="mb-3"
                    style={{
                      fontSize: "18px",
                      fontWeight: 500,
                      color: "#171717",
                    }}
                  >
                    Performance and Analytics Cookies:
                  </h3>
                  <p
                    style={{
                      color: "#666666",
                      fontSize: "16px",
                      fontWeight: 400,
                      lineHeight: "24px",
                    }}
                  >
                    These cookies allow us to count visits and traffic sources
                    so we can measure and improve the performance of our Site.
                    They help us to know which pages are the most and least
                    popular and see how visitors navigate the Site. Performance
                    cookies are used to help us with our analytics, including to
                    compile statistics and analytics about your use of and
                    interaction with the Site, including details about how and
                    where our Site are accessed, how often you visit or use the
                    Site, the date and time of your visits, your actions on the
                    Site, and other similar traffic, usage, and trend data.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 3: Your Choices */}
            <section id="your-choices" className="mb-16 scroll-mt-24">
              <h2
                className="mb-6"
                style={{
                  fontSize: "32px",
                  fontWeight: 600,
                  lineHeight: "40px",
                  letterSpacing: "-1.28px",
                  color: "#171717",
                }}
              >
                Your Choices
              </h2>
              <div
                className="space-y-4"
                style={{
                  color: "#666666",
                  fontSize: "16px",
                  fontWeight: 400,
                  lineHeight: "24px",
                }}
              >
                <p>
                  You can learn more about cookies by visiting{" "}
                  <a
                    href="https://www.allaboutcookies.org/"
                    className="underline hover:no-underline"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#0068D6" }}
                  >
                    https://www.allaboutcookies.org/
                  </a>
                  , which includes additional useful information on cookies and
                  how to block cookies using different types of browsers.
                </p>
                <p>
                  If you&apos;d like to remove or disable cookies via your
                  browser, please refer to your browser&apos;s configuration
                  documentation. Please note, however, that by blocking or
                  deleting all cookies used on the Site, you may not be able to
                  take full advantage of the Site and you may not be able to
                  properly log on to the Site.
                </p>
                <p>
                  For analytics, we use Google Analytics. To opt out from Google
                  Analytics, you can download a plug-in by visiting{" "}
                  <a
                    href="https://tools.google.com/dlpage/gaoptout"
                    className="underline hover:no-underline"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#0068D6" }}
                  >
                    https://tools.google.com/dlpage/gaoptout
                  </a>
                  .
                </p>
              </div>
            </section>

            {/* Section 4: Cookie Management */}
            <section id="manage-cookies" className="mb-16 scroll-mt-24">
              <h2
                className="mb-6"
                style={{
                  fontSize: "32px",
                  fontWeight: 600,
                  lineHeight: "40px",
                  letterSpacing: "-1.28px",
                  color: "#171717",
                }}
              >
                Manage Your Cookie Settings
              </h2>

              {/* Cookie Settings Button */}
              <div className="mb-8">
                <p
                  className="mb-4"
                  style={{
                    color: "#666666",
                    fontSize: "16px",
                    fontWeight: 400,
                    lineHeight: "24px",
                  }}
                >
                  Click the button below to review and update your cookie
                  preferences:
                </p>
                <button
                  onClick={() => {
                    const cookieScript = (
                      window as Window & {
                        CookieScript?: {
                          instance?: {
                            show(): void;
                          };
                        };
                      }
                    ).CookieScript;
                    if (cookieScript?.instance) {
                      cookieScript.instance.show();
                    }
                  }}
                  className="rounded-none bg-black px-5 py-2.5 text-sm font-normal text-white transition-colors hover:bg-gray-800"
                >
                  Manage Cookie Settings
                </button>
              </div>

              {/* Current Consent Status */}
              <div className="mb-8">
                <h3
                  className="mb-4"
                  style={{
                    fontSize: "18px",
                    fontWeight: 500,
                    color: "#171717",
                  }}
                >
                  Your Current Consent Status
                </h3>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {[
                    { key: "necessary", label: "Necessary" },
                    { key: "analytics", label: "Analytics" },
                    { key: "marketing", label: "Marketing" },
                    { key: "targeting", label: "Targeting" },
                    { key: "functionality", label: "Functionality" },
                    { key: "preferences", label: "Preferences" },
                    { key: "performance", label: "Performance" },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center gap-2">
                      <ContentBadge
                        variant={
                          consentStatus[item.key] ? "secondary" : "outline"
                        }
                      >
                        {item.label}
                      </ContentBadge>
                      <span className="text-sm text-gray-600">
                        {consentStatus[item.key] ? "✓" : "✗"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Section 5: Currently Active Cookies */}
            <section id="active-cookies" className="mb-16 scroll-mt-24">
              <h2
                className="mb-6"
                style={{
                  fontSize: "32px",
                  fontWeight: 600,
                  lineHeight: "40px",
                  letterSpacing: "-1.28px",
                  color: "#171717",
                }}
              >
                Currently Active Cookies & Storage
              </h2>
              <p
                className="mb-6"
                style={{
                  color: "#666666",
                  fontSize: "16px",
                  fontWeight: 400,
                  lineHeight: "24px",
                }}
              >
                Below is a real-time view of all cookies and storage items
                currently active on your device:
              </p>

              {groupedCookies.length === 0 ? (
                <div className="rounded-none border border-green-200 bg-green-50 p-8 text-center">
                  <div className="mb-4">
                    <span className="text-4xl">🎉</span>
                  </div>
                  <h3 className="mb-2 text-lg font-normal text-green-800">
                    Excellent GDPR Compliance!
                  </h3>
                  <p className="text-green-700">
                    No tracking cookies or storage items detected. This
                    indicates perfect GDPR compliance - no tracking occurs
                    without your explicit consent.
                  </p>
                </div>
              ) : (
                <div className="space-y-0 overflow-hidden border border-gray-200">
                  {groupedCookies.map((group, index) => (
                    <CookieAccordion
                      key={`${group.category}-${index}`}
                      cookies={group.items}
                      category={group.category}
                      description={group.description}
                      consentStatus={consentStatus}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Section 6: Our Customers */}
            <section id="our-customers" className="mb-16 scroll-mt-24">
              <h2
                className="mb-6"
                style={{
                  fontSize: "32px",
                  fontWeight: 600,
                  lineHeight: "40px",
                  letterSpacing: "-1.28px",
                  color: "#171717",
                }}
              >
                Our Customers
              </h2>
              <p
                style={{
                  color: "#666666",
                  fontSize: "16px",
                  fontWeight: 400,
                  lineHeight: "24px",
                }}
              >
                Customer who separately use cookies or similar technologies on
                their website hosted by {HOTEL_NAME} are independently and
                solely responsible for management of the data collected through
                those cookies, compliance with all laws related to usage of
                these technologies and notifying End Users as required by
                applicable laws.
              </p>
            </section>

            {/* Section 7: Updates to This Policy */}
            <section id="policy-updates" className="mb-16 scroll-mt-24">
              <h2
                className="mb-6"
                style={{
                  fontSize: "32px",
                  fontWeight: 600,
                  lineHeight: "40px",
                  letterSpacing: "-1.28px",
                  color: "#171717",
                }}
              >
                Changes to This Cookie Policy
              </h2>
              <p
                style={{
                  color: "#666666",
                  fontSize: "16px",
                  fontWeight: 400,
                  lineHeight: "24px",
                }}
              >
                We may update this Cookie Policy from time to time, at our sole
                discretion. If so, we will post an updated Cookie Policy within
                the Platform. Changes, modifications, additions, or deletions
                will be effective immediately on their posting to the Platform.
                We encourage you to review this Cookie Policy regularly for any
                changes. Your continued use of the Platform and/or your
                continued provision of personal information to us after the
                posting of the updated Cookie Policy will be subject to the
                terms of the then-current Privacy Policy and Cookie Policy. If
                you continue to use the Platform you will be deemed to have
                accepted the change.
              </p>
            </section>

            {/* Section 8: Contact Information */}
            <section id="contact" className="mb-16 scroll-mt-24">
              <h2
                className="mb-6"
                style={{
                  fontSize: "32px",
                  fontWeight: 600,
                  lineHeight: "40px",
                  letterSpacing: "-1.28px",
                  color: "#171717",
                }}
              >
                Contact Information
              </h2>
              <p
                className="mb-4"
                style={{
                  color: "#666666",
                  fontSize: "16px",
                  fontWeight: 400,
                  lineHeight: "24px",
                }}
              >
                If you have any questions or concerns about this Cookie Policy,
                please email us at{" "}
                <a
                  href={`mailto:${HOTEL_EMAIL}`}
                  className="text-[#0068D6] underline hover:no-underline"
                >
                  {HOTEL_EMAIL}
                </a>
                .
              </p>
            </section>
          </div>

          {/* Table of Contents - Right Sidebar */}
          <aside className="mx-8 hidden w-68 flex-shrink-0 border-l border-gray-200 lg:block">
            <div className="sticky top-24 my-8">
              <h2 className="mb-4 pl-6 text-lg font-bold text-[#171717]">
                Cookie Policy
              </h2>
              <nav className="pl-6">
                <ul className="space-y-2">
                  <li>
                    <TocLink
                      href="#what-are-cookies"
                      active={activeId === "what-are-cookies"}
                    >
                      What are Cookies, Pixels and Local Storage?
                    </TocLink>
                  </li>
                  <li>
                    <TocLink
                      href="#how-we-use-cookies"
                      active={activeId === "how-we-use-cookies"}
                    >
                      How and Why We Use Cookies
                    </TocLink>
                  </li>
                  <li>
                    <TocLink
                      href="#your-choices"
                      active={activeId === "your-choices"}
                    >
                      Your Choices
                    </TocLink>
                  </li>
                  <li>
                    <TocLink
                      href="#manage-cookies"
                      active={activeId === "manage-cookies"}
                    >
                      Manage Your Cookie Settings
                    </TocLink>
                  </li>
                  <li>
                    <TocLink
                      href="#active-cookies"
                      active={activeId === "active-cookies"}
                    >
                      Currently Active Cookies & Storage
                    </TocLink>
                  </li>
                  <li>
                    <TocLink
                      href="#our-customers"
                      active={activeId === "our-customers"}
                    >
                      Our Customers
                    </TocLink>
                  </li>
                  <li>
                    <TocLink
                      href="#policy-updates"
                      active={activeId === "policy-updates"}
                    >
                      Changes to This Cookie Policy
                    </TocLink>
                  </li>
                  <li>
                    <TocLink href="#contact" active={activeId === "contact"}>
                      Contact Information
                    </TocLink>
                  </li>
                </ul>
              </nav>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

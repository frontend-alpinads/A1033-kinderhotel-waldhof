import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["de", "en", "it"] as const;
type Locale = (typeof locales)[number];
const defaultLocale: Locale = "de";

const LOCALE_HINTS: Record<string, Locale> = {
  "thank-you": "en",
  grazie: "it",
  danke: "de",
  "privacy-settings": "en",
  "impostazioni-privacy": "it",
  datenschutzeinstellungen: "de",
};

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const segments = pathname.split("/").filter(Boolean);

  // console.log("Request pathname:", pathname);

  let locale: Locale = defaultLocale;

  const firstSeg = segments[0];
  const lastSeg = segments[segments.length - 1];

  if (firstSeg && locales.includes(firstSeg as Locale)) {
    // Explicit locale prefix: /en/...
    locale = firstSeg as Locale;
  } else if (lastSeg && locales.includes(lastSeg as Locale)) {
    // Locale suffix: /.../en
    locale = lastSeg as Locale;
  } else if (firstSeg && LOCALE_HINTS[firstSeg]) {
    // Locale hint from first segment
    locale = LOCALE_HINTS[firstSeg];
  }

  // console.log("Determined locale:", locale);

  // Set request header (readable by server components via headers())
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-locale", locale);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};

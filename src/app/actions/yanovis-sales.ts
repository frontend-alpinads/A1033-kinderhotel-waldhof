"use server";

import type { ExtendedEnquiryFormData } from "./email-submission";

type YanovisStay = {
  arrival: string | null;
  departure: string | null;
  alternativeArrival?: string | null;
  alternativeDeparture?: string | null;
};

type YanovisCustomer = {
  salutation?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  language?: string;
  country?: string;
  data?: {
    partner_id?: string;
    language?: string;
    type?: string; // e.g., "person"
    gender?: string; // 'm' | 'f'
    name_prefix?: string; // "Herr" | "Frau"
    lastmod?: string; // ISO timestamp
  };
};

type YanovisSelection = {
  rooms?: string[];
  offer?: string | null;
  boardOptions?: string[];
};

type YanovisOccupancy = {
  adults?: number;
  children?: number;
  childrenAges?: number[];
};

export type YanovisSalePayload = {
  externalReference?: string;
  language?: string;
  type?: string;
  partner_sale_id?: string;
  partner_sale_slug?: string;
  requested_at?: string;
  declined?: boolean;
  partner_modified_at?: string;
  partner_created_at?: string;
  customer: YanovisCustomer;
  stay: YanovisStay;
  occupancy?: YanovisOccupancy;
  selection?: YanovisSelection;
  message?: string | null;
  consents?: {
    newsletter?: boolean;
    privacyAccepted?: boolean;
  };
};

export type YanovisPostResult = {
  ok: boolean;
  status: number;
  requestId?: string;
  responseBody?: unknown;
  errorMessage?: string;
};

function parseDeRangeToIso(range: string | undefined): {
  arrival: string | null;
  departure: string | null;
} {
  if (!range) return { arrival: null, departure: null };
  const parts = range.split("-").map((p) => p.trim());
  if (parts.length !== 2) return { arrival: null, departure: null };

  const [start, end] = parts;
  const toIso = (de: string) => {
    // de-DE like 31.12.2025
    const m = de.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/);
    if (!m) return null;
    const [, dd, mm, yyyy] = m;
    const iso = `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
    return iso;
  };

  return { arrival: toIso(start) || null, departure: toIso(end) || null };
}

function buildPayload(
  data: ExtendedEnquiryFormData,
  correlationId: string,
  type: string | undefined,
  partnerId: string | undefined,
): YanovisSalePayload {
  const phone = [data.phonePrefix, data.phoneNumber].filter(Boolean).join(" ");

  const primary = parseDeRangeToIso(data.dates);
  const alternative = parseDeRangeToIso(data.alternativeDates);

  const rooms = data.selectedRoom?.selectedRooms || [];
  const adults = rooms.reduce((sum, r) => sum + (r.guests || 0), 0);
  const children = rooms.reduce((sum, r) => sum + (r.children || 0), 0);
  const childrenAges = rooms
    .flatMap((r) => r.childAges || [])
    .map((c) => c.age)
    .filter((n) => Number.isFinite(n));
  const roomNames = rooms.map((r) => r.room?.name).filter(Boolean) as string[];
  const boardOptions = rooms
    .map((r) => r.boardOption)
    .filter(Boolean) as string[];

  const sanitizeLang = (val?: string) =>
    val && /^[a-zA-Z]{2}$/.test(val) ? val.toLowerCase() : undefined;

  const nowIso = new Date().toISOString();

  return {
    externalReference: correlationId,
    language: sanitizeLang(data.language),
    type,
    partner_sale_id: correlationId,
    partner_sale_slug: correlationId,
    requested_at: nowIso,
    declined: false,
    partner_modified_at: nowIso,
    partner_created_at: nowIso,
    customer: {
      salutation: data.salutation,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone,
      language: sanitizeLang(data.language),
      country: data.country,
      data: {
        partner_id: partnerId,
        language: sanitizeLang(data.language),
        type: "person",
        gender:
          data.salutation === "frau"
            ? "f"
            : data.salutation === "herr"
              ? "m"
              : undefined,
        name_prefix:
          data.salutation === "frau"
            ? "Frau"
            : data.salutation === "herr"
              ? "Herr"
              : undefined,
        lastmod: nowIso,
      },
    },
    stay: {
      arrival: primary.arrival,
      departure: primary.departure,
      alternativeArrival: alternative.arrival,
      alternativeDeparture: alternative.departure,
    },
    occupancy: {
      adults: adults || undefined,
      children: children || undefined,
      childrenAges: childrenAges.length ? childrenAges : undefined,
    },
    selection: {
      rooms: roomNames.length ? roomNames : undefined,
      offer: data.selectedOffer?.title || data.offer || null,
      boardOptions: boardOptions.length ? boardOptions : undefined,
    },
    message: data.message || null,
    consents: {
      newsletter: !!data.newsletter,
      privacyAccepted: !!data.privacyAccepted,
    },
  };
}

function getAuthHeader(user: string, pass: string): string {
  const token = Buffer.from(`${user}:${pass}`).toString("base64");
  return `Basic ${token}`;
}

async function postWithTimeout(
  url: string,
  options: RequestInit & { timeoutMs?: number },
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    options.timeoutMs ?? 10000,
  );
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

export async function postYanovisSale(
  data: ExtendedEnquiryFormData,
  {
    correlationId,
  }: {
    correlationId: string;
  },
): Promise<YanovisPostResult> {
  const enabled = process.env.YANOVIS_ENABLED === "true";
  if (!enabled) {
    return { ok: false, status: 0, errorMessage: "YANOVIS_DISABLED" };
  }

  if (!data.privacyAccepted) {
    return { ok: false, status: 0, errorMessage: "PRIVACY_NOT_ACCEPTED" };
  }

  const base =
    process.env.YANOVIS_API_BASE || "https://testing-api.yanovis.com";
  const username = process.env.YANOVIS_USERNAME;
  const password = process.env.YANOVIS_PASSWORD;
  const type = process.env.YANOVIS_TYPE || "request";
  const partnerId = process.env.YANOVIS_PARTNER_ID;

  if (!username || !password) {
    return {
      ok: false,
      status: 0,
      errorMessage: "YANOVIS_CREDENTIALS_MISSING",
    };
  }

  const url = `${base.replace(/\/$/, "")}/pub/zer/sales`;
  const payload = buildPayload(data, correlationId, type, partnerId);

  const headers = {
    Authorization: getAuthHeader(username, password),
    "Content-Type": "application/json",
    Accept: "application/json",
    // safe to include correlation for debugging on their side if recorded
    "X-Correlation-Id": correlationId,
  } as Record<string, string>;

  let attempt = 0;
  let lastResp: Response | undefined;
  let lastErr: unknown;

  while (attempt < 2) {
    try {
      const resp = await postWithTimeout(url, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
        timeoutMs: 10000,
      });
      lastResp = resp;
      const status = resp.status;
      const text = await resp.text();
      let body: unknown;
      try {
        body = text ? JSON.parse(text) : undefined;
      } catch {
        body = text;
      }

      if (resp.ok) {
        return {
          ok: true,
          status,
          responseBody: body,
        };
      }

      // Retry on 5xx once
      if (status >= 500 && status < 600 && attempt === 0) {
        attempt++;
        continue;
      }

      return {
        ok: false,
        status,
        responseBody: body,
        errorMessage:
          typeof body === "object" && body !== null
            ? JSON.stringify(body)
            : String(body ?? "Unknown error"),
      };
    } catch (err) {
      lastErr = err;
      if (attempt === 0) {
        attempt++;
        continue;
      }
      break;
    }
  }

  return {
    ok: false,
    status: lastResp?.status ?? 0,
    errorMessage:
      lastErr instanceof Error ? lastErr.message : "YANOVIS_POST_FAILED",
  };
}

"use server";

import { Offer } from "@/shared-types";
import { filterActiveOffers } from "@/utils/offer-utils";

// Seekda Services API Configuration (for Specials/Packages)
const SEEKDA_API_URL =
  "https://switch.seekda.com/switch/latest/json/services.json";
const SEEKDA_PROPERTY_CODE = process.env.SEEKDA_PROPERTY_CODE;
const SEEKDA_TOKEN = process.env.SEEKDA_TOKEN;

// TypeScript types for Seekda Services API Response

interface SeekdaServiceImage {
  url: string;
  title: string | null;
}

interface SeekdaServiceVideo {
  url?: string;
  title?: string | null;
}

interface SeekdaService {
  code: string;
  title: string;
  description: string | null;
  teaser: string | null;
  category_code: string | null;
  category_codes: string[];
  unit_price: number;
  tax_group_code: string | null;
  available_on_request: boolean;
  max_per_booking: number | null;
  images: SeekdaServiceImage[];
  videos: SeekdaServiceVideo[];
}

interface SeekdaResult {
  services: SeekdaService[];
  metadata: Record<string, unknown>;
}

interface SeekdaRootResponse {
  success: boolean;
  result: SeekdaResult;
}

// Helper function to strip HTML tags from text
function stripHtmlTags(html: string | null): string {
  if (!html) return "";

  // Replace common HTML entities
  let text = html
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&sup2;/g, "²");

  // Remove HTML tags
  text = text.replace(/<[^>]*>/g, "");

  // Clean up extra whitespace
  text = text.replace(/\s+/g, " ").trim();

  return text;
}

// Helper function to generate default date range (wide range to show all services)
function generateDateRange(): { startDate: string; endDate: string } {
  const today = new Date();
  const twoYearsLater = new Date();
  twoYearsLater.setFullYear(twoYearsLater.getFullYear() + 2);

  // Format as YYYY-MM-DD
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return {
    startDate: formatDate(today),
    endDate: formatDate(twoYearsLater),
  };
}

// Helper function to transform Seekda service to our Offer type
function transformService(seekdaService: SeekdaService): Offer {
  // Build features array from category codes and request status
  const features: string[] = [...(seekdaService.category_codes || [])];

  // Add "On Request" if service requires request
  if (seekdaService.available_on_request) {
    features.push("Auf Anfrage");
  }

  // Get description - prefer teaser, fallback to description
  let description = "";
  if (seekdaService.teaser) {
    description = stripHtmlTags(seekdaService.teaser);
  } else if (seekdaService.description) {
    description = stripHtmlTags(seekdaService.description);
  }

  // Extract first image URL or use placeholder
  let imageSrc = "/placeholder.webp";
  if (seekdaService.images && seekdaService.images.length > 0) {
    imageSrc = seekdaService.images[0].url;
  }

  return {
    title: seekdaService.title,
    validityPeriods: [], // Services don't have specific date ranges
    nights: 1, // Default to 1 as services are typically one-time activities
    price: seekdaService.unit_price || 0,
    description,
    features,
    imageSrc,
  };
}

// Main server action to get service/special list from Seekda API
export async function getOfferList(
  languageCode: string = "de",
  propertyCode?: string,
  token?: string,
  startDate?: string,
  endDate?: string,
): Promise<{
  success: boolean;
  offers?: Offer[];
  error?: string;
}> {
  try {
    // Validate credentials
    const finalPropertyCode = propertyCode || SEEKDA_PROPERTY_CODE;
    const finalToken = token || SEEKDA_TOKEN;

    if (!finalPropertyCode || !finalToken) {
      console.error("Seekda API credentials not configured");
      return { success: false, error: "API credentials not configured" };
    }

    // Generate default date range if not provided
    const dateRange = generateDateRange();
    const finalStartDate = startDate || dateRange.startDate;
    const finalEndDate = endDate || dateRange.endDate;

    // Convert language code to uppercase for Seekda API (de -> DE, en -> EN, it -> IT)
    const seekdaLanguageCode = languageCode.toUpperCase();

    // Build API URL with query parameters
    const url = new URL(SEEKDA_API_URL);
    url.searchParams.append("skd-property-code", finalPropertyCode);
    url.searchParams.append("token", finalToken);
    url.searchParams.append("skd-start-date", finalStartDate);
    url.searchParams.append("skd-end-date", finalEndDate);
    url.searchParams.append("skd-language-code", seekdaLanguageCode);

    console.log("=== SEEKDA SERVICES API REQUEST ===");
    console.log("URL:", url.toString());
    console.log("Property Code:", finalPropertyCode);
    console.log("Token:", finalToken.substring(0, 5) + "...");
    console.log("Language:", seekdaLanguageCode);
    console.log("Date Range:", finalStartDate, "to", finalEndDate);

    // Make API request
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store", // Don't cache for debugging
    });

    console.log("Response Status:", response.status, response.statusText);

    if (!response.ok) {
      const responseText = await response.text();
      console.error("Response body:", responseText);
      return {
        success: false,
        error: `API error: ${response.status} ${response.statusText}`,
      };
    }

    // Parse JSON response
    const jsonResponse: SeekdaRootResponse = await response.json();

    // LOG COMPLETE RESPONSE FOR DEBUGGING
    console.log("=== SEEKDA API RESPONSE ===");
    console.log(JSON.stringify(jsonResponse, null, 2));

    // Check for API errors
    if (!jsonResponse.success) {
      console.error("Seekda API returned success=false");
      return {
        success: false,
        error: "API returned unsuccessful response",
      };
    }

    // Extract services from response
    const result = jsonResponse.result;
    const servicesData = result?.services;

    if (!servicesData || servicesData.length === 0) {
      console.log("⚠️ No services found in response");
      console.log("Result object keys:", Object.keys(result || {}));
      return {
        success: true,
        offers: [],
      };
    }

    console.log(`✅ Found ${servicesData.length} services in Seekda response`);
    servicesData.forEach((service, index) => {
      console.log(`  ${index + 1}. ${service.title} - €${service.unit_price}`);
    });

    // Transform services to our Offer type
    const offers = servicesData.map((service) => transformService(service));

    // Filter active offers (all Seekda services pass through since they have no dates)
    const activeOffers = filterActiveOffers(offers);

    // Sort offers by price (cheapest to most expensive)
    const sortedOffers = activeOffers.sort((a, b) => a.price - b.price);

    console.log(
      `📊 Transformed: ${offers.length} → Filtered: ${sortedOffers.length}`,
    );

    return {
      success: true,
      offers: sortedOffers,
    };
  } catch (error) {
    console.error("❌ Error fetching services from Seekda:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

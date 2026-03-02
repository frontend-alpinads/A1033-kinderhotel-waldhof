"use server";

import { Room } from "@/shared-types";

// Seekda API Configuration
const SEEKDA_API_URL =
  "https://switch.seekda.com/switch/latest/json/ratesAverage.json";
const SEEKDA_PROPERTY_CODE = process.env.SEEKDA_PROPERTY_CODE;
const SEEKDA_TOKEN = process.env.SEEKDA_TOKEN;

// TypeScript types for Seekda API Response

interface SeekdaAmenityInfo {
  code: string;
  detail: string;
  title: string;
  quantity: number;
}

interface SeekdaImageInfo {
  url: string;
  description: string | null;
  title: string | null;
  width: number;
  height: number;
  alternativeSizes?: Array<{
    url: string;
    description: string | null;
    title: string | null;
    width: number;
    height: number;
    category: string;
    size: string;
  }>;
}

interface SeekdaRate {
  code: string;
  title: string | null;
  description: string | null;
  meal_plan_code: string;
  cancel_policy_code: string;
  guarantee_policy_code: string;
  category_codes: string[];
  prices: Record<string, number[]>;
}

interface SeekdaRoom {
  code: string;
  title: string;
  description: string;
  amenities: string[];
  amenitiesInfo: SeekdaAmenityInfo[];
  images: string[];
  imagesInfo: SeekdaImageInfo[];
  rates: SeekdaRate[];
  min_occupancy: number;
  std_occupancy: number;
  max_occupancy: number;
}

interface SeekdaResult {
  currency: string;
  rooms: SeekdaRoom[];
  packages: unknown[];
  metadata: {
    policies: {
      guarantees: unknown[];
      cancellations: unknown[];
    };
  };
  price_information: string[];
}

interface SeekdaRootResponse {
  success: boolean;
  result: SeekdaResult;
}

function decodeHtmlEntities(input: string): string {
  if (!input) return "";

  // Named entities we care about for DE/IT content (expand as needed)
  const named: Record<string, string> = {
    "&nbsp;": " ",
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#39;": "'",
    "&apos;": "'",
    "&sup2;": "²",
    "&ouml;": "ö",
    "&Ouml;": "Ö",
    "&auml;": "ä",
    "&Auml;": "Ä",
    "&uuml;": "ü",
    "&Uuml;": "Ü",
    "&szlig;": "ß",
    "&euro;": "€",
  };

  let text = input;
  for (const [k, v] of Object.entries(named)) {
    text = text.replaceAll(k, v);
  }

  // Numeric entities: &#246; and hex: &#xF6;
  text = text.replace(/&#(\d+);/g, (_, num) =>
    String.fromCodePoint(Number(num)),
  );
  text = text.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) =>
    String.fromCodePoint(parseInt(hex, 16)),
  );

  return text;
}

function fixMojibake(input: string): string {
  if (!input) return "";

  // Heuristic: typical UTF-8-as-latin1 artifacts (e.g. "GemÃ¼tlichkeit")
  if (!/[ÃÂâ€]/.test(input)) return input;

  try {
    const decoded = Buffer.from(input, "latin1").toString("utf8");
    // If decoding makes it worse, keep original
    if (!decoded || decoded.includes("�")) return input;
    return decoded;
  } catch {
    return input;
  }
}

// Helper function to strip HTML tags from text
function stripHtmlTags(html: string): string {
  if (!html) return "";

  // Decode entities + fix common encoding issues first
  let text = fixMojibake(decodeHtmlEntities(html));

  // Remove HTML tags
  text = text.replace(/<[^>]*>/g, "");

  // Clean up extra whitespace
  text = text.replace(/\s+/g, " ").trim();

  return text;
}

// Helper function to extract area from description
function extractAreaFromDescription(description: string): string {
  if (!description) return "N/A";

  // Strip HTML first to get clean text
  const cleanText = stripHtmlTags(description);

  // Match patterns like "55-60 m²", "40 m²", "14-18 m²"
  const areaMatch = cleanText.match(/(\d+(?:-\d+)?)\s*m²/i);

  if (areaMatch && areaMatch[1]) {
    return `${areaMatch[1]} m²`;
  }

  return "N/A";
}

// Helper function to calculate minimum price from all rates
function calculateMinPrice(rates: SeekdaRate[]): number {
  if (!rates || rates.length === 0) return 0;

  let minPrice = Infinity;

  for (const rate of rates) {
    if (!rate.prices) continue;

    // Iterate through all date ranges in prices
    for (const dateKey in rate.prices) {
      const pricesArray = rate.prices[dateKey];
      if (Array.isArray(pricesArray) && pricesArray.length > 0) {
        // Use the first index (min_price_min_occupancy)
        const price = pricesArray[0];
        if (typeof price === "number" && price > 0 && price < minPrice) {
          minPrice = price;
        }
      }
    }
  }

  return minPrice === Infinity ? 0 : minPrice;
}

// Helper function to format capacity string
function formatCapacity(min: number, std: number, max: number): string {
  if (min === max) {
    return `${max}`;
  }
  return `${min}-${max}`;
}

function pickBestImageUrl(info: SeekdaImageInfo): string {
  const candidates: Array<{ url: string; width: number; height: number }> = [];
  if (info?.url)
    candidates.push({ url: info.url, width: info.width, height: info.height });
  if (info?.alternativeSizes?.length) {
    for (const alt of info.alternativeSizes) {
      if (alt?.url)
        candidates.push({ url: alt.url, width: alt.width, height: alt.height });
    }
  }

  // Prefer the largest image (by area)
  candidates.sort((a, b) => b.width * b.height - a.width * a.height);
  return candidates[0]?.url || info.url;
}

function getRoomImageUrls(seekdaRoom: SeekdaRoom): string[] {
  if (
    Array.isArray(seekdaRoom.imagesInfo) &&
    seekdaRoom.imagesInfo.length > 0
  ) {
    return seekdaRoom.imagesInfo.map(pickBestImageUrl).filter(Boolean);
  }
  return (seekdaRoom.images || []).filter(Boolean);
}

function normalizeRoomName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\(.*?\)/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function pickBetterRoom(a: Room, b: Room): Room {
  const score = (r: Room) => {
    const imagesCount = (r.images?.length || 0) + (r.image ? 1 : 0);
    const descLen = (r.longDescription || r.description || "").length;
    const priced = r.price > 0 ? 1 : 0;
    return priced * 1_000_000 + imagesCount * 1_000 + descLen;
  };
  return score(a) >= score(b) ? a : b;
}

function dedupeRoomsByTitle(rooms: Room[]): Room[] {
  const map = new Map<string, Room>();
  for (const room of rooms) {
    const key = normalizeRoomName(room.name);
    const existing = map.get(key);
    map.set(key, existing ? pickBetterRoom(existing, room) : room);
  }
  return Array.from(map.values());
}

// Helper function to categorize rooms by type
function categorizeRooms(rooms: Room[]): Room[] {
  return rooms.map((room) => {
    const roomNameLower = room.name.toLowerCase();

    // Suites take priority
    if (roomNameLower.includes("suite")) {
      return { ...room, type: "suites" };
    }

    if (
      roomNameLower.includes("southside") ||
      roomNameLower.includes("south side") ||
      roomNameLower.includes("südseite") ||
      roomNameLower.includes("suedseite")
    ) {
      return { ...room, type: "southside" };
    }

    if (
      roomNameLower.includes("westside") ||
      roomNameLower.includes("west side") ||
      roomNameLower.includes("westseite") ||
      roomNameLower.includes("pool")
    ) {
      return { ...room, type: "poolWestside" };
    }

    if (roomNameLower.includes("basic")) {
      return { ...room, type: "basic" };
    }

    // Return room unchanged if no keywords found
    return room;
  });
}

// Helper function to transform Seekda room to our Room type
function transformRoom(seekdaRoom: SeekdaRoom, currency: string): Room {
  // Extract features from amenitiesInfo
  const features: string[] = seekdaRoom.amenitiesInfo
    ? seekdaRoom.amenitiesInfo.map((amenity) => amenity.title)
    : [];

  // Extract images
  const images: string[] = getRoomImageUrls(seekdaRoom);

  // Extract area from description
  const area = extractAreaFromDescription(seekdaRoom.description);

  // Calculate minimum price from all rates
  const price = calculateMinPrice(seekdaRoom.rates);

  // Format capacity
  const capacity = formatCapacity(
    seekdaRoom.min_occupancy,
    seekdaRoom.std_occupancy,
    seekdaRoom.max_occupancy,
  );

  // Strip HTML from description
  const cleanDescription = stripHtmlTags(seekdaRoom.description);

  return {
    id: seekdaRoom.code,
    code: seekdaRoom.code,
    name: seekdaRoom.title,
    description: cleanDescription,
    price,
    currency,
    capacity,
    area,
    image: images[0] || "/placeholder-room.jpg",
    images: images.length > 1 ? images : undefined,
    type: "hotel", // Default type, will be updated by categorizeRooms
    features,
    longDescription: cleanDescription,
    includedServices: features,
  };
}

// Main server action to get room list from Seekda API
export async function getRoomList(
  languageCode: string = "de",
  propertyCode?: string,
  token?: string,
): Promise<{
  success: boolean;
  rooms?: Room[];
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

    // Convert language code to uppercase for Seekda API (de -> DE, en -> EN, it -> IT)
    const seekdaLanguageCode = languageCode.toUpperCase();

    // Build API URL with query parameters
    const url = new URL(SEEKDA_API_URL);
    url.searchParams.append("skd-property-code", finalPropertyCode);
    url.searchParams.append("token", finalToken);
    url.searchParams.append("skd-language-code", seekdaLanguageCode);

    console.log("Sending request to Seekda API...");
    console.log("Request URL:", url.toString());

    // Make API request
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      console.error(
        `Seekda API error: ${response.status} ${response.statusText}`,
      );
      return {
        success: false,
        error: `API error: ${response.status} ${response.statusText}`,
      };
    }

    // Parse JSON response
    const jsonResponse: SeekdaRootResponse = await response.json();

    // Check for API errors
    if (!jsonResponse.success) {
      console.error("Seekda API returned error:", jsonResponse);
      return {
        success: false,
        error: "API returned unsuccessful response",
      };
    }

    // Extract rooms from response
    const result = jsonResponse.result;
    const roomsData = result?.rooms;

    if (!roomsData || roomsData.length === 0) {
      console.log("No rooms found in response");
      return {
        success: true,
        rooms: [],
      };
    }

    // Get currency from result
    const currency = result.currency || "EUR";

    // Transform rooms to our Room type
    const transformed = roomsData.map((room) => transformRoom(room, currency));

    // Remove duplicate room entries (e.g. same room once priced and once "on request")
    const deduped = dedupeRoomsByTitle(transformed);

    // Sort rooms by price (most expensive to cheapest)
    const sortedRooms = deduped.sort((a, b) => b.price - a.price);

    // Apply categorization
    const categorizedRooms = categorizeRooms(sortedRooms);

    console.log(
      `Successfully fetched ${categorizedRooms.length} rooms from Seekda`,
    );

    return {
      success: true,
      rooms: categorizedRooms,
    };
  } catch (error) {
    console.error("Error fetching rooms from Seekda:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

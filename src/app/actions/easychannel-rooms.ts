"use server";

import { XMLParser, XMLBuilder } from "fast-xml-parser";
import { Room } from "@/shared-types";

// EasyChannel API Configuration
const EASYCHANNEL_API_URL = "https://easychannel.it/mss/mss_service.php";
const EASYCHANNEL_USER = process.env.EASYCHANNEL_USER;
const EASYCHANNEL_PASSWORD = process.env.EASYCHANNEL_PASSWORD;
const EASYCHANNEL_SOURCE = process.env.EASYCHANNEL_SOURCE;
const EASYCHANNEL_HOTEL_ID = process.env.EASYCHANNEL_HOTEL_ID;

// TypeScript types for EasyChannel API

// Request Types
interface EasyChannelCredentials {
  user: string;
  password: string;
  source: string;
}

interface EasyChannelPaging {
  start: number;
  limit: number;
}

interface EasyChannelHeader {
  credentials: EasyChannelCredentials;
  method: string;
  paging: EasyChannelPaging;
  result_id?: string;
}

interface EasyChannelSearch {
  lang: string;
  id?: string;
  id_ofchannel?: string;
}

interface EasyChannelOptions {
  room_details?: string;
}

interface EasyChannelRequest {
  search: EasyChannelSearch;
  options?: EasyChannelOptions;
}

interface EasyChannelRootRequest {
  root: {
    version: string;
    header: EasyChannelHeader;
    request: EasyChannelRequest;
  };
}

// Response Types
interface EasyChannelError {
  code: number;
  message: string;
}

interface EasyChannelRateLimit {
  limit: string;
  remaining: number;
  reset: number;
}

interface EasyChannelResponseHeader {
  error: EasyChannelError;
  result_id: string;
  source?: string;
  source_id?: string;
  paging: EasyChannelPaging & { count: number; total: number };
  rate_limit?: EasyChannelRateLimit;
  time: string;
}

interface EasyChannelFeature {
  id: string;
  title: string;
}

interface EasyChannelPicture {
  url: string;
  time: number;
  width: number;
  height: number;
  copyright?: string;
  title?: string;
}

interface EasyChannelOccupancy {
  min: number;
  max: number;
  std: number;
}

interface EasyChannelProperties {
  area?: number;
  bed_rooms?: number;
  living_rooms?: number;
  dining_rooms?: number;
  bath_rooms?: number;
  wc_rooms?: number;
}

interface EasyChannelPricelist {
  offer_id: string;
  offer_typ: number;
  offer_base_id: string;
  special_typ: number;
}

interface EasyChannelRoom {
  room_id: string;
  room_type?: number;
  room_code?: string;
  room_lts_id?: string;
  occupancy?: EasyChannelOccupancy;
  price_from?: number;
  properties?: EasyChannelProperties;
  title: string;
  description?: string;
  features?: string | number;
  features_view?: {
    feature: EasyChannelFeature | EasyChannelFeature[];
  };
  pictures?: {
    picture: EasyChannelPicture | EasyChannelPicture[];
  };
  room_numbers?: {
    number: string | string[];
  };
  pricelist?: EasyChannelPricelist | EasyChannelPricelist[];
}

interface EasyChannelRootResponse {
  root: {
    header: EasyChannelResponseHeader;
    result?: {
      hotel?: {
        id: string;
        id_lts: string;
        bookable: string;
        currency?: string;
        channel?: {
          channel_id: string;
          room_description?: {
            room?: EasyChannelRoom | EasyChannelRoom[];
          };
        };
      };
    };
    debug?: unknown;
  };
}

// Helper function to build XML request
function buildXMLRequest(
  lang: string = "de",
  hotelId?: string,
  roomDetails?: string,
): string {
  const requestData: EasyChannelRootRequest = {
    root: {
      version: "2.0",
      header: {
        credentials: {
          user: EASYCHANNEL_USER || "",
          password: EASYCHANNEL_PASSWORD || "",
          source: EASYCHANNEL_SOURCE || "",
        },
        method: "getRoomList",
        paging: {
          start: 0,
          limit: 0,
        },
      },
      request: {
        search: {
          lang,
          id: hotelId || EASYCHANNEL_HOTEL_ID,
          id_ofchannel: "hgv",
        },
        options: roomDetails ? { room_details: roomDetails } : undefined,
      },
    },
  };

  const builder = new XMLBuilder({
    ignoreAttributes: false,
    format: true,
    suppressEmptyNode: true,
  });

  const xmlContent = builder.build(requestData);
  return `<?xml version="1.0"?>\n${xmlContent}`;
}

// Helper function to parse XML response
function parseXMLResponse(xmlString: string): EasyChannelRootResponse {
  const parser = new XMLParser({
    ignoreAttributes: false,
    parseAttributeValue: true,
    parseTagValue: true,
    trimValues: true,
    numberParseOptions: {
      hex: false,
      leadingZeros: false,
    },
    allowBooleanAttributes: true,
    cdataPropName: "__cdata",
  });

  // console.log("XML parser: ", xmlString);

  return parser.parse(xmlString) as EasyChannelRootResponse;
}

// Room code mapping based on room names
// Maps room names to AlpineBits room codes
const ROOM_CODE_MAPPING: Record<string, string> = {
  Apfelchalet: "ZAPF",
  'Doppelzimmer "Martin"': "DZM",
  "Doppelzimmer Martin": "DZM",
  'Stadelzimmer "Gala Plus"': "DASU",
  "Stadelzimmer Gala Plus": "DASU",
  'Stadelzimmer "Gala"': "DASUK",
  "Stadelzimmer Gala": "DASUK",
  'Stadelzimmer "Morgenduft"': "STASU",
  "Stadelzimmer Morgenduft": "STASU",
  Gartensuite: "GASU",
  Gartenloft: "GALOF",
  "Doppelzimmer Basic": "DZBA",
  "Doppelzimmer Berg": "DZBE",
  "Doppelzimmer Garten": "DZGA",
  "Doppelzimmer Garten Plus": "DZGAP",
  "Appartement-Suite im Landhaus": "APLA",
};

// Helper function to get room code from room name
function getRoomCode(roomName: string): string | undefined {
  // Try exact match first
  if (ROOM_CODE_MAPPING[roomName]) {
    return ROOM_CODE_MAPPING[roomName];
  }

  // Try case-insensitive match
  const normalizedName = roomName.toLowerCase();
  for (const [key, value] of Object.entries(ROOM_CODE_MAPPING)) {
    if (key.toLowerCase() === normalizedName) {
      return value;
    }
  }

  // Try partial match (if room name contains the key)
  for (const [key, value] of Object.entries(ROOM_CODE_MAPPING)) {
    if (normalizedName.includes(key.toLowerCase())) {
      return value;
    }
  }

  return undefined;
}

// Helper function to extract area from description text
function extractAreaFromDescription(description?: string): number {
  if (!description) return 0;

  // Match patterns like "ca. 46 m²" or "46 m²", extracting just the main area number
  // This will match the first occurrence before any "inkl." text
  const areaMatch = description.match(/(?:ca\.\s*)?(\d+(?:[.,]\d+)?)\s*m²/i);

  if (areaMatch && areaMatch[1]) {
    // Replace comma with dot for decimal parsing
    const areaStr = areaMatch[1].replace(",", ".");
    return parseFloat(areaStr);
  }

  return 0;
}

// Helper function to transform EasyChannel room to our Room type
function transformRoom(easyChannelRoom: EasyChannelRoom): Room {
  // Extract features from features_view
  let features: string[] = [];
  if (easyChannelRoom.features_view?.feature) {
    const featuresArray = Array.isArray(easyChannelRoom.features_view.feature)
      ? easyChannelRoom.features_view.feature
      : [easyChannelRoom.features_view.feature];
    features = featuresArray.map((f) => f.title);
  }

  // Extract images
  let images: string[] = [];
  if (easyChannelRoom.pictures?.picture) {
    const picturesArray = Array.isArray(easyChannelRoom.pictures.picture)
      ? easyChannelRoom.pictures.picture
      : [easyChannelRoom.pictures.picture];
    images = picturesArray.map((p) => p.url);
  }

  // Extract area from properties field
  const areaValue = easyChannelRoom.properties?.area || 0;

  // If area is 0 or not provided, try extracting from description
  const finalAreaValue =
    areaValue > 0
      ? areaValue
      : extractAreaFromDescription(easyChannelRoom.description);

  const area = `${finalAreaValue} m²`;

  // Format capacity with null safety
  let capacity = "N/A";
  if (easyChannelRoom.occupancy) {
    const { min, max } = easyChannelRoom.occupancy;
    if (min !== undefined && max !== undefined) {
      capacity =
        min === max
          ? `Für ${max} Person${max > 1 ? "en" : ""}`
          : `Für ${min}-${max} Personen`;
    }
  }

  return {
    id: easyChannelRoom.room_id,
    code: getRoomCode(easyChannelRoom.title),
    name: easyChannelRoom.title,
    description: easyChannelRoom.description || "",
    price: easyChannelRoom.price_from || 0,
    currency: "EUR",
    capacity,
    area,
    image: images[0] || "/placeholder-room.jpg",
    images: images.length > 1 ? images : undefined,
    type: "zimmer", // Default type, can be adjusted based on business logic
    features,
    longDescription: easyChannelRoom.description || "",
    includedServices: features, // Using features as included services for now
  };
}

function categorizeRooms(rooms: Room[]): Room[] {
  return rooms.map((room) => {
    const roomNameLower = room.name.toLowerCase();

    // Check for "suite" first (takes priority)
    if (roomNameLower.includes("suite")) {
      return { ...room, type: "chalet" };
    }
    // Check for "apartment" or "appartment" (handle both spellings)
    else if (
      roomNameLower.includes("apartment") ||
      roomNameLower.includes("appartment")
    ) {
      return { ...room, type: "chalet" };
    }

    // Return room unchanged if no keywords found
    return room;
  });
}

// Main server action to get room list
export async function getRoomList(
  lang: string = "de",
  hotelId?: string,
  roomDetails: string = "233836", // Default channel ID for full room details
): Promise<{
  success: boolean;
  rooms?: Room[];
  error?: string;
  rateLimit?: EasyChannelRateLimit;
}> {
  try {
    // Validate credentials
    if (
      !EASYCHANNEL_USER ||
      !EASYCHANNEL_PASSWORD ||
      !EASYCHANNEL_SOURCE ||
      !EASYCHANNEL_HOTEL_ID
    ) {
      console.error("EasyChannel API credentials not configured");
      return { success: false, error: "API credentials not configured" };
    }

    // Build XML request
    const xmlRequest = buildXMLRequest(lang, hotelId, roomDetails);

    console.log("Sending request to EasyChannel API...");

    // Make API request
    const response = await fetch(EASYCHANNEL_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/xml; charset=utf-8",
        "Accept-Encoding": "gzip, deflate",
      },
      body: xmlRequest,
    });

    if (!response.ok) {
      console.error(
        `EasyChannel API error: ${response.status} ${response.statusText}`,
      );
      return {
        success: false,
        error: `API error: ${response.status} ${response.statusText}`,
      };
    }

    // Parse XML response
    const xmlResponse = await response.text();
    const parsedResponse = parseXMLResponse(xmlResponse);

    // Check for API errors
    const header = parsedResponse.root.header;
    if (header.error.code !== 0) {
      console.error("EasyChannel API returned error:", header.error);
      return {
        success: false,
        error: header.error.message,
      };
    }

    // Extract rooms from response
    const result = parsedResponse.root.result;
    const roomData = result?.hotel?.channel?.room_description?.room;

    if (!roomData) {
      console.log("No rooms found in response");
      return {
        success: true,
        rooms: [],
        rateLimit: header.rate_limit,
      };
    }

    // Normalize rooms to array
    const roomsArray = Array.isArray(roomData) ? roomData : [roomData];

    // Transform rooms to our Room type
    const rooms = roomsArray.map((room) => transformRoom(room));

    // Filter out specific rooms (Garten/Garden/Giardino and De Luxe)
    const filteredRooms = rooms.filter((room) => {
      const nameLower = room.name.toLowerCase();
      return (
        !nameLower.includes("garten") &&
        !nameLower.includes("garden") &&
        !nameLower.includes("giardino") &&
        !nameLower.includes("de luxe")
      );
    });

    // Sort rooms by price (cheapest to most expensive)
    const sortedRooms = filteredRooms.sort((a, b) => a.price - b.price);

    console.log(
      `Successfully fetched ${sortedRooms.length} rooms from EasyChannel (${rooms.length - sortedRooms.length} filtered out)`,
    );

    const categorizedRooms = categorizeRooms(sortedRooms);

    // console.log("Categorized Rooms:", categorizedRooms);

    return {
      success: true,
      rooms: categorizedRooms,
      rateLimit: header.rate_limit,
    };
  } catch (error) {
    console.error("Error fetching rooms from EasyChannel:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

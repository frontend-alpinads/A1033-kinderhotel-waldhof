"use server";

import { XMLParser, XMLBuilder } from "fast-xml-parser";
import { Offer, ValidityPeriod } from "@/shared-types";
import { filterActiveOffers } from "@/utils/offer-utils";

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

interface EasyChannelRoom {
  room_seq: number;
  room_type: number;
  person: number | number[];
}

interface EasyChannelValidity {
  valid: number;
  offers: number;
  service: number;
  date_from?: string;
  date_to?: string;
  room?: EasyChannelRoom;
}

interface EasyChannelSearchSpecial {
  typ: number;
  validity: EasyChannelValidity;
}

interface EasyChannelSearch {
  lang: string;
  id: string;
  search_special: EasyChannelSearchSpecial;
}

interface EasyChannelOptions {
  special_details?: string;
  hotel_details?: string;
}

interface EasyChannelOrderField {
  field: string;
  dir: string;
}

interface EasyChannelRequest {
  search: EasyChannelSearch;
  options?: EasyChannelOptions;
  order?: EasyChannelOrderField;
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

interface EasyChannelPicture {
  url: string;
  time: number;
  width: number;
  height: number;
  copyright?: string;
  title?: string;
}

interface EasyChannelFeature {
  id: string;
  title: string;
}

interface EasyChannelService {
  id: string;
  title: string;
}

interface EasyChannelSpecial {
  offer_id: string;
  status: number;
  valid: number;
  offer_typ: number;
  special_typ: number;
  special_premium: number;
  days_arrival: number;
  days_departure: number;
  days_dur_min: number;
  days_dur_max: number;
  days_arrival_min: number;
  days_arrival_max: number;
  children_min: number;
  children_max: number;
  adults_min: number;
  adults_max: number;
  pers_age_min: number;
  child_age_min: number;
  child_age_max: number;
  adult_age_min: number;
  valid_start: string;
  valid_end: string;
  title: string;
  description?: string;
  price_from?: number;
  price_to?: number;
  features_view?: {
    feature: EasyChannelFeature | EasyChannelFeature[];
  };
  services_view?: {
    service: EasyChannelService | EasyChannelService[];
  };
  pictures?: {
    picture: EasyChannelPicture | EasyChannelPicture[];
  };
  hotels?: {
    hotel:
      | {
          id: string;
          channel?: {
            channel_id: string;
            from_price?: number;
          };
        }
      | Array<{
          id: string;
          channel?: {
            channel_id: string;
            from_price?: number;
          };
        }>;
  };
}

interface EasyChannelRootResponse {
  root: {
    header: EasyChannelResponseHeader;
    result?: {
      special?: EasyChannelSpecial | EasyChannelSpecial[];
    };
    debug?: unknown;
  };
}

// Helper function to build XML request
function buildXMLRequest(
  lang: string = "de",
  hotelId?: string,
  specialDetails?: string,
  hotelDetails?: string,
  dateFrom?: string,
  dateTo?: string,
  roomSeq: number = 1,
  roomType: number = 1,
  persons: number[] = [18, 18],
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
        method: "getSpecialList",
        paging: {
          start: 0,
          limit: 0,
        },
        result_id: "",
      },
      request: {
        search: {
          lang,
          id: hotelId || (EASYCHANNEL_HOTEL_ID as string),
          search_special: {
            typ: 7,
            validity: {
              valid: 0,
              offers: 0,
              service: 0,
              ...(dateFrom && { date_from: dateFrom }),
              ...(dateTo && { date_to: dateTo }),
              room: {
                room_seq: roomSeq,
                room_type: roomType,
                person: persons,
              },
            },
          },
        },
        options:
          specialDetails || hotelDetails
            ? {
                ...(specialDetails && { special_details: specialDetails }),
                // ...(hotelDetails && { hotel_details: hotelDetails }),
              }
            : undefined,
        order: {
          field: "valid_start",
          dir: "asc",
        },
      },
    },
  };

  const builder = new XMLBuilder({
    ignoreAttributes: false,
    format: true,
    suppressEmptyNode: false,
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

  return parser.parse(xmlString) as EasyChannelRootResponse;
}

// Helper function to format date from YYYY-MM-DD to DD.MM.YYYY
function formatDate(dateString: string): string {
  const [year, month, day] = dateString.split("-");
  return `${day}.${month}.${year}`;
}

// Helper function to calculate nights from date range
function calculateNights(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

// Helper function to transform EasyChannel special to our Offer type
function transformOffer(easyChannelSpecial: EasyChannelSpecial): Offer {
  // Extract features from features_view
  let features: string[] = [];
  if (easyChannelSpecial.features_view?.feature) {
    const featuresArray = Array.isArray(
      easyChannelSpecial.features_view.feature,
    )
      ? easyChannelSpecial.features_view.feature
      : [easyChannelSpecial.features_view.feature];
    features = featuresArray.map((f) => f.title);
  }

  // Extract services
  if (easyChannelSpecial.services_view?.service) {
    const servicesArray = Array.isArray(
      easyChannelSpecial.services_view.service,
    )
      ? easyChannelSpecial.services_view.service
      : [easyChannelSpecial.services_view.service];
    features = [...features, ...servicesArray.map((s) => s.title)];
  }

  // Extract image
  let imageSrc = "/placeholder.png";
  if (easyChannelSpecial.pictures?.picture) {
    const picturesArray = Array.isArray(easyChannelSpecial.pictures.picture)
      ? easyChannelSpecial.pictures.picture
      : [easyChannelSpecial.pictures.picture];
    if (picturesArray.length > 0) {
      imageSrc = picturesArray[0].url;
    }
  }

  // Calculate nights
  const nights =
    easyChannelSpecial.days_dur_min > 0 ? easyChannelSpecial.days_dur_min : 1;

  // Extract price from hotels.hotel.channel.from_price
  let price = 0;
  if (easyChannelSpecial.hotels?.hotel) {
    const hotelData = Array.isArray(easyChannelSpecial.hotels.hotel)
      ? easyChannelSpecial.hotels.hotel[0]
      : easyChannelSpecial.hotels.hotel;
    price = hotelData?.channel?.from_price || 0;
  }
  // Fallback to price_from if hotels data is not available
  if (price === 0 && easyChannelSpecial.price_from) {
    price = easyChannelSpecial.price_from;
  }

  return {
    title: easyChannelSpecial.title,
    validityPeriods: [
      {
        from: formatDate(easyChannelSpecial.valid_start),
        to: formatDate(easyChannelSpecial.valid_end),
      },
    ],
    nights,
    minNights: easyChannelSpecial.days_dur_min > 0 ? easyChannelSpecial.days_dur_min : undefined,
    price,
    description: easyChannelSpecial.description || "",
    features,
    imageSrc,
  };
}

// Main server action to get offer list
export async function getOfferList(
  lang: string = "de",
  hotelId?: string,
  specialDetails: string = "23", // Default for special details with pictures
  hotelDetails?: string, // Default for hotel details including images
  dateFrom?: string,
  dateTo?: string,
  roomSeq: number = 1,
  roomType: number = 1,
  persons: number[] = [18, 18],
): Promise<{
  success: boolean;
  offers?: Offer[];
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
    const xmlRequest = buildXMLRequest(
      lang,
      hotelId,
      specialDetails,
      hotelDetails,
      dateFrom,
      dateTo,
      roomSeq,
      roomType,
      persons,
    );

    console.log("Sending request to EasyChannel API...");

    // console.log(xmlRequest);

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

    // console.log("Received response from EasyChannel API", xmlResponse);

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

    // Extract offers from response
    const result = parsedResponse.root.result;
    const specialData = result?.special;

    if (!specialData) {
      console.log("No offers found in response");
      return {
        success: true,
        offers: [],
        rateLimit: header.rate_limit,
      };
    }

    // Normalize offers to array
    const specialsArray = Array.isArray(specialData)
      ? specialData
      : [specialData];

    // Filter only valid and active offers
    const validSpecials = specialsArray.filter(
      (special) => special.valid === 1 && special.status === 1,
    );

    // Transform offers to our Offer type
    const transformedOffers = validSpecials.map((special) =>
      transformOffer(special),
    );

    // Filter active/future offers (removes past offers based on endDate and minNights)
    const activeOffers = filterActiveOffers(transformedOffers);

    // Group offers by title to merge multiple validity periods
    const groupedOffersMap = new Map<string, Offer>();
    for (const offer of activeOffers) {
      const existingOffer = groupedOffersMap.get(offer.title);
      if (existingOffer) {
        // Merge validity periods - add current offer's periods
        existingOffer.validityPeriods = [
          ...existingOffer.validityPeriods,
          ...offer.validityPeriods,
        ];

        // Update price to lowest if this offer has lower price
        if (offer.price > 0 && offer.price < existingOffer.price) {
          existingOffer.price = offer.price;
        }
      } else {
        groupedOffersMap.set(offer.title, { ...offer });
      }
    }

    const offers = Array.from(groupedOffersMap.values());

    console.log(
      `Successfully fetched ${transformedOffers.length} offers from EasyChannel, ${activeOffers.length} active, ${offers.length} after grouping`,
    );

    return {
      success: true,
      offers,
      rateLimit: header.rate_limit,
    };
  } catch (error) {
    console.error("Error fetching offers from EasyChannel:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

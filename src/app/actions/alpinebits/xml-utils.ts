// XML parsing and building utilities for AlpineBits

import { XMLParser, XMLBuilder } from "fast-xml-parser";
import type {
  OTAResponse,
  ParsedHandshakeResponse,
  HandshakeRequest,
  ParsedInventoryResponse,
  ParsedRatePlanPullResponse,
  ParsedGuestReservationResponse,
  GuestReservationPayload,
  HotelInventory,
  RoomCategory,
  HotelRatePlans,
  RatePlanInfo,
  ParsedRatePlanResponse,
  ParsedFreeRoomsResponse,
} from "./types";

// ============================================================================
// XML PARSER CONFIGURATION
// ============================================================================

const parserOptions = {
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  parseAttributeValue: true,
  trimValues: true,
  removeNSPrefix: true, // Remove namespace prefixes for easier parsing
};

const builderOptions = {
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  format: true,
  suppressEmptyNode: true,
};

export const xmlParser = new XMLParser(parserOptions);
export const xmlBuilder = new XMLBuilder(builderOptions);

// ============================================================================
// XML PARSING HELPERS
// ============================================================================

/**
 * Parse XML string to JavaScript object
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseXML<T = any>(xmlString: string): T {
  try {
    return xmlParser.parse(xmlString);
  } catch (error) {
    throw new Error(
      `Failed to parse XML: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Extract OTA errors, warnings, and success from parsed XML
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function extractOTAResponse(parsed: any): OTAResponse {
  // Try to find the response root (could be various OTA response types)
  const responseRoot = Object.keys(parsed).find((key) => key.endsWith("RS"));

  if (!responseRoot) {
    throw new Error("No OTA response root found in XML");
  }

  const response = parsed[responseRoot];
  const otaResponse: OTAResponse = {};

  // Check for success
  if (response.Success !== undefined) {
    otaResponse.success = {};
  }

  // Check for warnings
  if (response.Warnings?.Warning) {
    const warnings = Array.isArray(response.Warnings.Warning)
      ? response.Warnings.Warning
      : [response.Warnings.Warning];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    otaResponse.warnings = warnings.map((w: any) => ({
      type: w["@_Type"] || "",
      code: w["@_Code"] || "",
      shortText: w["@_ShortText"] || "",
      message: w["#text"] || w.ShortText || "",
    }));
  }

  // Check for errors
  if (response.Errors?.Error) {
    const errors = Array.isArray(response.Errors.Error)
      ? response.Errors.Error
      : [response.Errors.Error];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    otaResponse.errors = errors.map((e: any) => ({
      type: e["@_Type"] || "",
      code: e["@_Code"] || "",
      shortText: e["@_ShortText"] || "",
      message: e["#text"] || e.ShortText || "",
    }));
  }

  return otaResponse;
}

/**
 * Check if OTA response indicates success
 */
export function isOTASuccess(otaResponse: OTAResponse): boolean {
  return otaResponse.success !== undefined && !otaResponse.errors?.length;
}

/**
 * Get error message from OTA response
 */
export function getOTAErrorMessage(otaResponse: OTAResponse): string | null {
  if (otaResponse.errors && otaResponse.errors.length > 0) {
    return otaResponse.errors
      .map((e) => e.message || e.shortText || `Error ${e.code}`)
      .join("; ");
  }
  return null;
}

// ============================================================================
// SPECIFIC RESPONSE PARSERS
// ============================================================================

/**
 * Parse Handshake (OTA_PingRS) response
 */
export function parseHandshakeResponse(
  xmlString: string,
): ParsedHandshakeResponse {
  const parsed = parseXML(xmlString);
  const otaResponse = extractOTAResponse(parsed);

  // Extract EchoData with version info
  const response = parsed.OTA_PingRS || parsed["OTA_PingRS"];

  if (response?.EchoData) {
    try {
      const echoData = JSON.parse(response.EchoData);
      return {
        ...otaResponse,
        versions: echoData.versions,
      };
    } catch (error) {
      // EchoData might not be JSON, return without versions
      return otaResponse;
    }
  }

  return otaResponse;
}

/**
 * Parse FreeRooms (OTA_HotelInvCountNotifRS) response
 */
export function parseFreeRoomsResponse(
  xmlString: string,
): ParsedFreeRoomsResponse {
  const parsed = parseXML(xmlString);
  const otaResponse = extractOTAResponse(parsed);

  const response =
    parsed.OTA_HotelInvCountNotifRS || parsed["OTA_HotelInvCountNotifRS"];

  return {
    ...otaResponse,
    hotelCode: response?.["@_HotelCode"],
  };
}

/**
 * Parse RatePlan (OTA_HotelRatePlanNotifRS) response
 */
export function parseRatePlanResponse(
  xmlString: string,
): ParsedRatePlanResponse {
  const parsed = parseXML(xmlString);
  const otaResponse = extractOTAResponse(parsed);

  const response =
    parsed.OTA_HotelRatePlanNotifRS || parsed["OTA_HotelRatePlanNotifRS"];

  return {
    ...otaResponse,
    hotelCode: response?.["@_HotelCode"],
    ratePlanCode: response?.["@_RatePlanCode"],
  };
}

// ============================================================================
// XML BUILDERS FOR REQUESTS
// ============================================================================

/**
 * Build Handshake (OTA_PingRQ) XML request
 */
export function buildHandshakeXML(handshakeData: HandshakeRequest): string {
  const echoDataJson = JSON.stringify(handshakeData);

  const obj = {
    "?xml": {
      "@_version": "1.0",
      "@_encoding": "UTF-8",
    },
    OTA_PingRQ: {
      "@_xmlns": "http://www.opentravel.org/OTA/2003/05",
      "@_Version": "8.000",
      EchoData: echoDataJson,
    },
  };

  return xmlBuilder.build(obj);
}

/**
 * Build FreeRooms (OTA_HotelInvCountNotifRQ) XML request
 */
export function buildFreeRoomsXML(data: {
  hotelCode: string;
  hotelName?: string;
  invTypeCode: string;
  start: string;
  end: string;
  count: number;
}): string {
  const obj = {
    "?xml": {
      "@_version": "1.0",
      "@_encoding": "UTF-8",
    },
    OTA_HotelInvCountNotifRQ: {
      "@_xmlns": "http://www.opentravel.org/OTA/2003/05",
      "@_Version": "4",
      UniqueID: {
        "@_Type": "16",
        "@_ID": "1",
        "@_Instance": "CompleteSet",
      },
      Inventories: {
        "@_HotelCode": data.hotelCode,
        ...(data.hotelName && { "@_HotelName": data.hotelName }),
        Inventory: {
          StatusApplicationControl: {
            "@_Start": data.start,
            "@_End": data.end,
            "@_InvTypeCode": data.invTypeCode,
          },
          InvCounts: {
            InvCount: {
              "@_CountType": "2",
              "@_Count": data.count,
            },
          },
        },
      },
    },
  };

  return xmlBuilder.build(obj);
}

/**
 * Build RatePlan (OTA_HotelRatePlanNotifRQ) XML request
 */
export function buildRatePlanXML(data: {
  hotelCode: string;
  ratePlanCode: string;
  roomTypeCode: string;
  currencyCode: string;
  start: string;
  end: string;
  pricePerNight: number;
}): string {
  const obj = {
    "?xml": {
      "@_version": "1.0",
      "@_encoding": "UTF-8",
    },
    OTA_HotelRatePlanNotifRQ: {
      "@_xmlns": "http://www.opentravel.org/OTA/2003/05",
      "@_Version": "3.14",
      POS: {
        Source: {
          RequestorID: {
            "@_Type": "16",
            "@_ID": data.hotelCode,
          },
        },
      },
      RatePlans: {
        "@_HotelCode": data.hotelCode,
        RatePlan: {
          "@_RatePlanCode": data.ratePlanCode,
          Rates: {
            Rate: {
              "@_Start": data.start,
              "@_End": data.end,
              "@_InvTypeCode": data.roomTypeCode,
              BaseByGuestAmts: {
                BaseByGuestAmt: {
                  "@_AmountAfterTax": data.pricePerNight.toFixed(2),
                  "@_CurrencyCode": data.currencyCode,
                },
              },
            },
          },
        },
      },
    },
  };

  return xmlBuilder.build(obj);
}

// ============================================================================
// NEW XML BUILDERS FOR PULL/PUSH REQUESTS
// ============================================================================

/**
 * Build Inventory Pull (OTA_HotelDescriptiveInfoRQ) XML request
 * Used to retrieve room categories, amenities, and hotel information
 */
export function buildInventoryPullXML(hotelCode: string): string {
  const obj = {
    "?xml": {
      "@_version": "1.0",
      "@_encoding": "UTF-8",
    },
    OTA_HotelDescriptiveInfoRQ: {
      "@_xmlns": "http://www.opentravel.org/OTA/2003/05",
      "@_Version": "3.000",
      POS: {
        Source: {
          RequestorID: {
            "@_Type": "16",
            "@_ID": hotelCode,
          },
        },
      },
      HotelDescriptiveInfos: {
        HotelDescriptiveInfo: {
          "@_HotelCode": hotelCode,
          "@_SendGuestRooms": true,
          "@_SendAmenities": true,
          "@_SendMultimediaObjects": true,
        },
      },
    },
  };

  return xmlBuilder.build(obj);
}

/**
 * Build Rate Plans Pull (OTA_HotelRatePlanRQ) XML request
 * Used to retrieve pricing and rate plan information
 */
export function buildRatePlanPullXML(hotelCode: string): string {
  const obj = {
    "?xml": {
      "@_version": "1.0",
      "@_encoding": "UTF-8",
    },
    OTA_HotelRatePlanRQ: {
      "@_xmlns": "http://www.opentravel.org/OTA/2003/05",
      "@_Version": "3.000",
      POS: {
        Source: {
          RequestorID: {
            "@_Type": "16",
            "@_ID": hotelCode,
          },
        },
      },
      RatePlans: {
        RatePlanCandidates: {
          RatePlanCandidate: {
            "@_RatePlanCode": "ALL",
          },
        },
      },
    },
  };

  return xmlBuilder.build(obj);
}

/**
 * Build Guest Reservation (OTA_HotelResNotifRQ) XML request
 * Used to send booking requests to the hotel PMS
 */
export function buildGuestReservationXML(
  payload: GuestReservationPayload,
): string {
  const {
    hotelCode,
    roomTypeCode,
    ratePlanCode,
    start,
    end,
    adults,
    children = 0,
    guestName,
    guestSurname,
    email,
    phone,
    notes,
  } = payload;

  const obj = {
    "?xml": {
      "@_version": "1.0",
      "@_encoding": "UTF-8",
    },
    OTA_HotelResNotifRQ: {
      "@_xmlns": "http://www.opentravel.org/OTA/2003/05",
      "@_Version": "3.000",
      POS: {
        Source: {
          RequestorID: {
            "@_Type": "16",
            "@_ID": hotelCode,
          },
        },
      },
      HotelReservations: {
        HotelReservation: {
          RoomStays: {
            RoomStay: {
              RoomTypes: {
                RoomType: {
                  "@_RoomTypeCode": roomTypeCode,
                },
              },
              ...(ratePlanCode && {
                RatePlans: {
                  RatePlan: {
                    "@_RatePlanCode": ratePlanCode,
                  },
                },
              }),
              GuestCounts: {
                GuestCount: [
                  {
                    "@_AgeQualifyingCode": "10",
                    "@_Count": adults,
                  },
                  ...(children > 0
                    ? [
                        {
                          "@_AgeQualifyingCode": "8",
                          "@_Count": children,
                        },
                      ]
                    : []),
                ],
              },
              TimeSpan: {
                "@_Start": start,
                "@_End": end,
              },
            },
          },
          ResGuests: {
            ResGuest: {
              Profiles: {
                ProfileInfo: {
                  Profile: {
                    Customer: {
                      PersonName: {
                        GivenName: guestName,
                        ...(guestSurname && { Surname: guestSurname }),
                      },
                      Email: email,
                      ...(phone && {
                        Telephone: {
                          "@_PhoneNumber": phone,
                        },
                      }),
                    },
                  },
                },
              },
            },
          },
          ...(notes && {
            ResGlobalInfo: {
              Comments: {
                Comment: notes,
              },
            },
          }),
        },
      },
    },
  };

  return xmlBuilder.build(obj);
}

// ============================================================================
// NEW RESPONSE PARSERS
// ============================================================================

/**
 * Parse Inventory Pull (OTA_HotelDescriptiveInfoRS) response
 */
export function parseInventoryPullResponse(
  xmlString: string,
): ParsedInventoryResponse {
  const parsed = parseXML(xmlString);
  const otaResponse = extractOTAResponse(parsed);

  const response =
    parsed.OTA_HotelDescriptiveInfoRS || parsed["OTA_HotelDescriptiveInfoRS"];

  if (!response) {
    return otaResponse;
  }

  try {
    const hotelDescriptiveContent =
      response.HotelDescriptiveContents?.HotelDescriptiveContent;

    if (!hotelDescriptiveContent) {
      return otaResponse;
    }

    const hotelCode = hotelDescriptiveContent["@_HotelCode"];
    const hotelName = hotelDescriptiveContent["@_HotelName"];

    // Extract room categories
    const guestRooms = hotelDescriptiveContent.FacilityInfo?.GuestRooms;
    const roomCategories: RoomCategory[] = [];

    if (guestRooms?.GuestRoom) {
      const rooms = Array.isArray(guestRooms.GuestRoom)
        ? guestRooms.GuestRoom
        : [guestRooms.GuestRoom];

      for (const room of rooms) {
        const roomCategory: RoomCategory = {
          roomTypeCode: room["@_RoomTypeCode"] || room["@_ID"] || "",
          roomTypeName: room.TypeRoom?.["@_Name"],
          maxOccupancy: room["@_MaxOccupancy"],
          standardOccupancy: room["@_StandardOccupancy"],
          description:
            room.Description?.Text ||
            room.MultimediaDescriptions?.MultimediaDescription?.TextItems
              ?.TextItem?.Description,
          amenities: extractAmenities(room.Amenities),
          images: extractImages(room.MultimediaDescriptions),
        };

        roomCategories.push(roomCategory);
      }
    }

    const inventory: HotelInventory = {
      hotelCode: hotelCode || "",
      hotelName,
      roomCategories,
    };

    return {
      ...otaResponse,
      inventory,
    };
  } catch (error) {
    console.error("Error parsing inventory response:", error);
    return otaResponse;
  }
}

/**
 * Parse Rate Plans Pull (OTA_HotelRatePlanRS) response
 */
export function parseRatePlanPullResponse(
  xmlString: string,
): ParsedRatePlanPullResponse {
  const parsed = parseXML(xmlString);
  const otaResponse = extractOTAResponse(parsed);

  const response = parsed.OTA_HotelRatePlanRS || parsed["OTA_HotelRatePlanRS"];

  if (!response) {
    return otaResponse;
  }

  try {
    const ratePlansData = response.RatePlans;
    const hotelCode = ratePlansData?.["@_HotelCode"];

    if (!ratePlansData?.RatePlan) {
      return otaResponse;
    }

    const ratePlansArray = Array.isArray(ratePlansData.RatePlan)
      ? ratePlansData.RatePlan
      : [ratePlansData.RatePlan];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ratePlans: RatePlanInfo[] = ratePlansArray.map((rp: any) => {
      const ratePlan: RatePlanInfo = {
        ratePlanCode: rp["@_RatePlanCode"] || "",
        ratePlanName: rp["@_RatePlanName"] || rp.RatePlanDescription?.Text,
        description: rp.Description?.Text,
      };

      // Extract rates if available
      if (rp.Rates?.Rate) {
        const ratesArray = Array.isArray(rp.Rates.Rate)
          ? rp.Rates.Rate
          : [rp.Rates.Rate];

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ratePlan.rates = ratesArray.map((rate: any) => ({
          start: rate["@_Start"] || "",
          end: rate["@_End"] || "",
          price:
            parseFloat(
              rate.BaseByGuestAmts?.BaseByGuestAmt?.["@_AmountAfterTax"] ||
                rate["@_Amount"] ||
                "0",
            ) || 0,
        }));

        ratePlan.roomTypeCode = ratesArray[0]?.["@_InvTypeCode"];
        ratePlan.currencyCode =
          ratesArray[0]?.BaseByGuestAmts?.BaseByGuestAmt?.["@_CurrencyCode"];
      }

      // Extract booking rules if available
      if (rp.BookingRules?.BookingRule) {
        const rules = Array.isArray(rp.BookingRules.BookingRule)
          ? rp.BookingRules.BookingRule[0]
          : rp.BookingRules.BookingRule;

        ratePlan.bookingRules = {
          minLOS: rules.LengthsOfStay?.LengthOfStay?.["@_MinMaxMessageType"]
            ? rules.LengthsOfStay.LengthOfStay["@_Time"]
            : undefined,
          maxLOS: rules.LengthsOfStay?.LengthOfStay?.["@_MaxMaxMessageType"]
            ? rules.LengthsOfStay.LengthOfStay["@_Time"]
            : undefined,
          minAdvancedBooking: rules.DOW_Restrictions?.["@_MinAdvancedBooking"],
          maxAdvancedBooking: rules.DOW_Restrictions?.["@_MaxAdvancedBooking"],
        };
      }

      return ratePlan;
    });

    const hotelRatePlans: HotelRatePlans = {
      hotelCode: hotelCode || "",
      ratePlans,
    };

    return {
      ...otaResponse,
      ratePlans: hotelRatePlans,
    };
  } catch (error) {
    console.error("Error parsing rate plans response:", error);
    return otaResponse;
  }
}

/**
 * Parse Guest Reservation (OTA_HotelResNotifRS) response
 */
export function parseGuestReservationResponse(
  xmlString: string,
): ParsedGuestReservationResponse {
  const parsed = parseXML(xmlString);
  const otaResponse = extractOTAResponse(parsed);

  const response = parsed.OTA_HotelResNotifRS || parsed["OTA_HotelResNotifRS"];

  if (!response) {
    return otaResponse;
  }

  try {
    const hotelReservation = response.HotelReservations?.HotelReservation;

    if (!hotelReservation) {
      return otaResponse;
    }

    const reservationId =
      hotelReservation.UniqueID?.["@_ID"] ||
      hotelReservation.ResGlobalInfo?.UniqueID?.["@_ID"];

    const confirmationNumber =
      hotelReservation["@_ConfirmationNumber"] ||
      hotelReservation.ResGlobalInfo?.["@_ConfirmationNumber"];

    const hotelCode =
      hotelReservation.RoomStays?.RoomStay?.BasicPropertyInfo?.["@_HotelCode"];

    return {
      ...otaResponse,
      reservationId,
      confirmationNumber,
      hotelCode,
    };
  } catch (error) {
    console.error("Error parsing reservation response:", error);
    return otaResponse;
  }
}

// ============================================================================
// HELPER FUNCTIONS FOR PARSING
// ============================================================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractAmenities(amenitiesData: any): string[] | undefined {
  if (!amenitiesData?.Amenity) {
    return undefined;
  }

  const amenities = Array.isArray(amenitiesData.Amenity)
    ? amenitiesData.Amenity
    : [amenitiesData.Amenity];

  return (
    amenities
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((a: any) => a["@_RoomAmenityCode"] || a.Description || "")
      .filter((a: string) => a !== "")
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractImages(multimediaData: any): string[] | undefined {
  if (!multimediaData?.MultimediaDescription?.ImageItems?.ImageItem) {
    return undefined;
  }

  const images = Array.isArray(
    multimediaData.MultimediaDescription.ImageItems.ImageItem,
  )
    ? multimediaData.MultimediaDescription.ImageItems.ImageItem
    : [multimediaData.MultimediaDescription.ImageItems.ImageItem];

  return (
    images
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((img: any) => img.ImageFormat?.URL || "")
      .filter((url: string) => url !== "")
  );
}

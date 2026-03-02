"use server";

// AlpineBits Server Actions for Next.js
// Implements handshake and guest reservations

import { postAlpineBits } from "./alpinebits/client";
import {
  buildHandshakeXML,
  buildGuestReservationXML,
  parseHandshakeResponse,
  parseGuestReservationResponse,
  isOTASuccess,
  getOTAErrorMessage,
} from "./alpinebits/xml-utils";
import type {
  ActionResponse,
  ParsedHandshakeResponse,
  ParsedGuestReservationResponse,
  GuestReservationPayload,
  SendRequestFormPayload,
  SendRequestFormResponse,
} from "./alpinebits/types";

// ============================================================================
// HANDSHAKE ACTION
// ============================================================================

/**
 * Perform AlpineBits handshake to negotiate supported versions and actions
 *
 * This should be called first to establish communication with the AlpineBits server
 * and determine which protocol versions and actions are mutually supported.
 *
 * @param compress - Optional: enable gzip compression for the request
 * @returns Parsed handshake response with supported versions and actions
 */
export async function alpinebitsHandshake(
  compress: boolean = false,
): Promise<ActionResponse<ParsedHandshakeResponse>> {
  try {
    // Define client capabilities
    const handshakeData = {
      versions: [
        {
          version: "2024-10",
          actions: [
            { action: "action_OTA_Ping" },
            { action: "action_OTA_HotelInvCountNotif_FreeRooms" },
            { action: "action_OTA_HotelDescriptiveContentNotif_Inventory" },
            { action: "action_OTA_HotelRatePlanNotif_RatePlans" },
            { action: "action_OTA_Read" },
          ],
        },
      ],
    };

    // Build XML request
    const xmlRequest = buildHandshakeXML(handshakeData);

    // Send request to server
    const { body } = await postAlpineBits({
      action: "OTA_Ping:Handshaking",
      xmlRequest,
      compress,
    });

    // Parse XML response
    const parsedResponse = parseHandshakeResponse(body);

    // Check for errors
    if (!isOTASuccess(parsedResponse)) {
      const errorMessage = getOTAErrorMessage(parsedResponse);
      return {
        success: false,
        error: errorMessage || "Handshake failed with unknown error",
        warnings: parsedResponse.warnings,
      };
    }

    return {
      success: true,
      data: parsedResponse,
      warnings: parsedResponse.warnings,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error during handshake",
    };
  }
}

// ============================================================================
// GUEST RESERVATION ACTION
// ============================================================================

/**
 * Send guest reservation/booking request to the AlpineBits server
 *
 * This action sends a booking request to the hotel PMS with guest information,
 * room type, dates, and occupancy details.
 *
 * @param payload - Guest reservation data
 * @param compress - Optional: enable gzip compression for the request
 * @returns Parsed response with confirmation details
 *
 * @example
 * ```typescript
 * const result = await sendGuestReservation({
 *   hotelCode: "HTL001",
 *   roomTypeCode: "DOUBLE",
 *   start: "2025-12-20",
 *   end: "2025-12-25",
 *   adults: 2,
 *   children: 1,
 *   guestName: "John",
 *   guestSurname: "Doe",
 *   email: "john@example.com",
 *   phone: "+1234567890",
 *   notes: "High floor preferred"
 * });
 *
 * if (result.success) {
 *   console.log("Reservation ID:", result.data?.reservationId);
 * }
 * ```
 */
export async function sendGuestReservation(
  payload: GuestReservationPayload,
  compress: boolean = false,
): Promise<ActionResponse<ParsedGuestReservationResponse>> {
  try {
    // Validate payload
    if (!payload.hotelCode || !payload.roomTypeCode) {
      return {
        success: false,
        error: "hotelCode and roomTypeCode are required",
      };
    }

    if (!payload.start || !payload.end) {
      return {
        success: false,
        error: "start and end dates are required (format: YYYY-MM-DD)",
      };
    }

    if (!payload.guestName || !payload.email) {
      return {
        success: false,
        error: "guestName and email are required",
      };
    }

    if (typeof payload.adults !== "number" || payload.adults < 1) {
      return {
        success: false,
        error: "adults must be a positive number",
      };
    }

    // Build XML request
    const xmlRequest = buildGuestReservationXML(payload);

    // Send request to server
    const { body } = await postAlpineBits({
      action: "OTA_HotelResNotif:GuestRequests",
      xmlRequest,
      compress,
    });

    // Parse XML response
    const parsedResponse = parseGuestReservationResponse(body);

    // Check for errors
    if (!isOTASuccess(parsedResponse)) {
      const errorMessage = getOTAErrorMessage(parsedResponse);
      return {
        success: false,
        error: errorMessage || "Guest reservation failed with unknown error",
        warnings: parsedResponse.warnings,
      };
    }

    return {
      success: true,
      data: parsedResponse,
      warnings: parsedResponse.warnings,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error sending guest reservation",
    };
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Test AlpineBits connection
 *
 * Performs a simple handshake to verify that the AlpineBits server is reachable
 * and credentials are valid.
 *
 * @returns Success status
 */
export async function testAlpineBitsConnection(): Promise<
  ActionResponse<boolean>
> {
  const result = await alpinebitsHandshake();

  if (result.success) {
    return {
      success: true,
      data: true,
    };
  }

  return {
    success: false,
    error: result.error || "Connection test failed",
  };
}

// ============================================================================
// SEND REQUEST FORM (New Gateway API)
// ============================================================================

/**
 * Send a booking request through the AlpineBits Gateway using the sendRequestForm endpoint
 *
 * This is a simplified REST API endpoint that accepts form-urlencoded data
 * and does not require XML formatting. No authentication is required.
 *
 * @param payload - Booking request data
 * @returns Response with reservation ID
 *
 * @example
 * ```typescript
 * const result = await sendRequestForm({
 *   propertykey: "abc123",
 *   from: "2024-02-01",
 *   until: "2024-02-03",
 *   guest_lastname: "Mustermann",
 *   guest_firstname: "Max",
 *   guest_email: "max@mustermann.de",
 *   rooms: [
 *     {
 *       category: "SUITE",
 *       rateplan: "STD_BB",
 *       adults: 2,
 *       childAges: [7, 4],
 *       total: 580.00
 *     }
 *   ],
 *   total: 580.00,
 *   utm_source: "Alpin Ads Landing Page"
 * });
 *
 * if (result.success) {
 *   console.log("Booking ID:", result.data?.data?.id);
 * }
 * ```
 */
export async function sendRequestForm(
  payload: SendRequestFormPayload,
): Promise<ActionResponse<SendRequestFormResponse>> {
  try {
    // Validate mandatory fields
    if (!payload.propertykey) {
      return {
        success: false,
        error: "propertykey is required",
      };
    }

    if (!payload.from || !payload.until) {
      return {
        success: false,
        error: "from and until dates are required (format: YYYY-MM-DD)",
      };
    }

    if (!payload.guest_lastname) {
      return {
        success: false,
        error: "guest_lastname is required",
      };
    }

    // Build JSON request body
    const requestBody: Record<string, any> = {
      // Mandatory fields
      propertykey: payload.propertykey,
      from: payload.from,
      until: payload.until,
      guest_lastname: payload.guest_lastname,
    };

    // Add optional guest fields
    if (payload.externalid) requestBody.externalid = payload.externalid;
    if (payload.guest_language)
      requestBody.guest_language = payload.guest_language;
    if (payload.guest_title) requestBody.guest_title = payload.guest_title;
    if (payload.guest_firstname)
      requestBody.guest_firstname = payload.guest_firstname;
    if (payload.guest_gender) requestBody.guest_gender = payload.guest_gender;
    if (payload.guest_birthdate)
      requestBody.guest_birthdate = payload.guest_birthdate;
    if (payload.guest_address)
      requestBody.guest_address = payload.guest_address;
    if (payload.guest_city) requestBody.guest_city = payload.guest_city;
    if (payload.guest_zipcode)
      requestBody.guest_zipcode = payload.guest_zipcode;
    if (payload.guest_country)
      requestBody.guest_country = payload.guest_country;
    if (payload.guest_telephone)
      requestBody.guest_telephone = payload.guest_telephone;
    if (payload.guest_email) requestBody.guest_email = payload.guest_email;

    // Add room details (dynamic fields)
    if (payload.rooms && payload.rooms.length > 0) {
      payload.rooms.forEach((room, index) => {
        const roomNumber = index + 1; // Rooms are 1-indexed

        if (room.category)
          requestBody[`room_${roomNumber}_category`] = room.category;
        if (room.rateplan)
          requestBody[`room_${roomNumber}_rateplan`] = room.rateplan;
        if (room.mealplan)
          requestBody[`room_${roomNumber}_mealplan`] = room.mealplan;
        if (room.total !== undefined)
          requestBody[`room_${roomNumber}_total`] = room.total.toString();
        if (room.adults !== undefined)
          requestBody[`room_${roomNumber}_adults`] = room.adults.toString();

        // Add child ages
        if (room.childAges && room.childAges.length > 0) {
          room.childAges.forEach((age, childIndex) => {
            const childNumber = childIndex + 1; // Children are 1-indexed
            requestBody[`room_${roomNumber}_child_${childNumber}_age`] =
              age.toString();
          });
        }
      });
    }

    // Add additional fields
    if (payload.comment) requestBody.comment = payload.comment;
    if (payload.utm_source) requestBody.utm_source = payload.utm_source;
    if (payload.utm_medium) requestBody.utm_medium = payload.utm_medium;
    if (payload.utm_campaign) requestBody.utm_campaign = payload.utm_campaign;
    if (payload.total !== undefined)
      requestBody.total = payload.total.toString();

    // Make the request
    const endpoint =
      process.env.ALPINEBITS_ENDPOINT ||
      "https://alpinebits-gateway.ando.cloud/api/v1/sendRequestForm";

    console.log("Request Body (JSON):", JSON.stringify(requestBody, null, 2));

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: `Request failed with status ${response.status}: ${errorText}`,
      };
    }

    const result: SendRequestFormResponse = await response.json();

    if (!result.success) {
      return {
        success: false,
        error: "Request was not successful",
      };
    }

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error sending request form",
    };
  }
}

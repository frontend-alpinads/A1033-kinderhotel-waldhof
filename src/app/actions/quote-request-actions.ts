"use server";

// TypeScript Types for Guest Request API
export interface RoomRequest {
  adultCount?: number;
  childAges?: string; // JSON array string like "[3,7,12]"
  roomType?: string;
  roomTypeCode?: string;
  roomClassificationCode?: string;
}

export interface GuestRequestInput {
  // Required fields
  hotelCode: string;
  checkInDate: string; // YYYY-MM-DD format
  checkOutDate: string; // YYYY-MM-DD format
  guestLastName: string;
  guestEmail: string;
  rooms: RoomRequest[];

  // Optional fields
  hotelName?: string;
  guestFirstName?: string;
  guestPhone?: string;
  guestLanguage?: string;
  guestGender?: string; // "Male", "Female", "Unknown"
  guestCountryCode?: string; // ISO 3166-1 alpha-2
  guestBirthDate?: string; // YYYY-MM-DD

  // Guest address
  guestAddressLine?: string;
  guestCity?: string;
  guestZipCode?: string;
  guestNamePrefix?: string; // Mr, Mrs, Ms, Dr
  guestNameTitle?: string; // Academic title

  // Tracking & Marketing
  externalReservationId?: string;
  externalSource?: string; // Default: "Alpin Ads"
  externalContext?: string; // Default: "Alpin Ads"

  // Comments
  customerComment?: string;
  additionalInfo?: string;
  petsInfo?: string;

  // Opt-ins
  newsletterOptIn?: boolean;
  catalogOptIn?: boolean;

  // Booking channel
  bookingChannelCode?: string;
  bookingChannelName?: string;
  bookingChannelEmail?: string;
}

export interface GuestRequestResponse {
  success: boolean;
  message: string;
  enquiryGroupId: string;
  count: number;
  data: Array<{
    id: string;
    uniqueId: string;
    externalReservationId: string;
    hotelCode: string;
    resStatus: string;
    createDateTime: number;
    checkInDate: string;
    checkOutDate: string;
    guestEmail: string;
    guestLastName: string;
    [key: string]: any;
  }>;
}

export interface GuestRequestError {
  success: false;
  error: string;
}

/**
 * Validates the guest request data before sending to API
 */
function validateGuestRequestData(data: GuestRequestInput): string | null {
  // Required fields
  if (!data.hotelCode) return "Hotel code is required";
  if (!data.guestLastName) return "Last name is required";
  if (!data.guestEmail) return "Email is required";
  if (!data.checkInDate) return "Check-in date is required";
  if (!data.checkOutDate) return "Check-out date is required";

  // Date format validation (YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(data.checkInDate)) {
    return "Check-in date must be in YYYY-MM-DD format";
  }
  if (!dateRegex.test(data.checkOutDate)) {
    return "Check-out date must be in YYYY-MM-DD format";
  }

  // Date logic validation
  const checkIn = new Date(data.checkInDate);
  const checkOut = new Date(data.checkOutDate);
  if (checkOut <= checkIn) {
    return "Check-out date must be after check-in date";
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.guestEmail)) {
    return "Invalid email address";
  }

  return null;
}

/**
 * Creates a guest request in the Quote Request API
 * @param data - Guest request input data
 * @returns Promise with response or error
 */
export async function createGuestRequest(
  data: GuestRequestInput,
): Promise<GuestRequestResponse | GuestRequestError> {
  try {
    const apiUrl = process.env.QUOTE_REQUEST_API_URL;
    const apiKey = process.env.QUOTE_REQUEST_API_KEY;

    // Check if API is configured
    if (!apiUrl || !apiKey) {
      console.warn(
        "Quote Request API not configured (QUOTE_REQUEST_API_URL or QUOTE_REQUEST_API_KEY missing)",
      );
      return {
        success: false,
        error: "Quote Request API not configured",
      };
    }

    // Validate data
    const validationError = validateGuestRequestData(data);
    if (validationError) {
      console.error("Guest request validation failed:", validationError);
      return {
        success: false,
        error: validationError,
      };
    }

    console.log("Sending guest request to Quote Request API...");
    console.log("Request data:", {
      ...data,
      rooms: data.rooms.length,
    });

    // Make API request
    const response = await fetch(`${apiUrl}/api/guest-requests`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Quote Request API error:", result);
      return {
        success: false,
        error: result.error || "Failed to create guest request",
      };
    }

    console.log(
      "Guest request created successfully:",
      result.enquiryGroupId,
      `(${result.count} room(s))`,
    );

    return result;
  } catch (error) {
    console.error("Guest request error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

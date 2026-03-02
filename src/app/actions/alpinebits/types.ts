// AlpineBits TypeScript type definitions

// ============================================================================
// HANDSHAKE TYPES
// ============================================================================

export type AlpineBitsVersion = {
  version: string;
  actions: Array<{ action: string }>;
};

export type HandshakeRequest = {
  versions: AlpineBitsVersion[];
};

export type HandshakeResponse = {
  versions: AlpineBitsVersion[];
  // Server echoes back supported versions/actions
};

// ============================================================================
// INVENTORY PULL TYPES (Get Room Info)
// ============================================================================

export type RoomCategory = {
  roomTypeCode: string;
  roomTypeName?: string;
  maxOccupancy?: number;
  standardOccupancy?: number;
  description?: string;
  amenities?: string[];
  images?: string[];
};

export type HotelInventory = {
  hotelCode: string;
  hotelName?: string;
  roomCategories: RoomCategory[];
};

// ============================================================================
// RATE PLANS PULL TYPES (Get Pricing Info)
// ============================================================================

export type RatePlanInfo = {
  ratePlanCode: string;
  ratePlanName?: string;
  roomTypeCode?: string;
  currencyCode?: string;
  rates?: Array<{
    start: string;
    end: string;
    price: number;
  }>;
  description?: string;
  bookingRules?: {
    minLOS?: number;
    maxLOS?: number;
    minAdvancedBooking?: number;
    maxAdvancedBooking?: number;
  };
};

export type HotelRatePlans = {
  hotelCode: string;
  ratePlans: RatePlanInfo[];
};

// ============================================================================
// GUEST RESERVATION TYPES (Send Booking Request)
// ============================================================================

export type GuestReservationPayload = {
  hotelCode: string;
  roomTypeCode: string;
  ratePlanCode?: string;
  start: string; // ISO date "YYYY-MM-DD"
  end: string; // ISO date "YYYY-MM-DD"
  adults: number;
  children?: number;
  guestName: string;
  guestSurname?: string;
  email: string;
  phone?: string;
  notes?: string;
};

// ============================================================================
// SEND REQUEST FORM TYPES (New Gateway API)
// ============================================================================

export type RoomDetails = {
  category?: string;
  rateplan?: string;
  mealplan?: "RO" | "BB" | "HB" | "FB" | "AI";
  total?: number;
  adults?: number;
  childAges?: number[];
};

export type SendRequestFormPayload = {
  // Mandatory fields
  propertykey: string;
  from: string; // YYYY-MM-DD
  until: string; // YYYY-MM-DD
  guest_lastname: string;

  // Optional fields
  externalid?: string;
  guest_language?: string; // ISO 639 2-letter code
  guest_title?: string;
  guest_firstname?: string;
  guest_gender?: "m" | "f";
  guest_birthdate?: string; // YYYY-MM-DD
  guest_address?: string;
  guest_city?: string;
  guest_zipcode?: string;
  guest_country?: string; // ISO 3166 2-letter code
  guest_telephone?: string;
  guest_email?: string;

  // Room details (dynamic based on number of rooms)
  rooms?: RoomDetails[];

  // Additional fields
  comment?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  total?: number; // Grand total of the reservation
};

export type SendRequestFormResponse = {
  success: boolean;
  data?: {
    id: string;
    externalid?: string;
  };
};

// ============================================================================
// DEPRECATED TYPES (Legacy Push Operations)
// ============================================================================

/** @deprecated Use inventory pull instead */
export type FreeRoomsPayload = {
  hotelCode: string;
  hotelName?: string;
  invTypeCode: string;
  start: string;
  end: string;
  count: number;
};

/** @deprecated Use rate plans pull instead */
export type RatePlanPayload = {
  hotelCode: string;
  ratePlanCode: string;
  roomTypeCode: string;
  currencyCode: string;
  start: string;
  end: string;
  pricePerNight: number;
};

// ============================================================================
// OTA RESPONSE TYPES
// ============================================================================

export type OTAError = {
  type: string;
  code: string;
  shortText?: string;
  message?: string;
};

export type OTAWarning = {
  type: string;
  code: string;
  shortText?: string;
  message?: string;
};

export type OTASuccess = object;

export type OTAResponse = {
  success?: OTASuccess;
  warnings?: OTAWarning[];
  errors?: OTAError[];
};

// ============================================================================
// CLIENT OPTIONS
// ============================================================================

export type AlpineBitsPostOptions = {
  action: string;
  xmlRequest?: string; // XML string to send in the request
  compress?: boolean; // Enable gzip compression
};

export type AlpineBitsResponse = {
  status: number;
  body: string;
  compressed?: boolean;
};

// ============================================================================
// SERVER ACTION RESPONSE TYPES
// ============================================================================

export type ActionResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  warnings?: OTAWarning[];
};

// ============================================================================
// PARSED RESPONSE TYPES
// ============================================================================

export type ParsedHandshakeResponse = OTAResponse & {
  versions?: AlpineBitsVersion[];
};

export type ParsedInventoryResponse = OTAResponse & {
  inventory?: HotelInventory;
};

export type ParsedRatePlanPullResponse = OTAResponse & {
  ratePlans?: HotelRatePlans;
};

export type ParsedGuestReservationResponse = OTAResponse & {
  reservationId?: string;
  hotelCode?: string;
  confirmationNumber?: string;
};

/** @deprecated */
export type ParsedFreeRoomsResponse = OTAResponse & {
  hotelCode?: string;
};

/** @deprecated */
export type ParsedRatePlanResponse = OTAResponse & {
  hotelCode?: string;
  ratePlanCode?: string;
};

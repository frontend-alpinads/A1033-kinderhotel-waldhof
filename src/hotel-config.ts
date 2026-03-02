// ============================================
// HOTEL_CONFIG - Core hotel identity & contact
// ============================================
export const HOTEL_CONFIG = {
  name: "Hotel Name",
  shortName: "Hotel",
  type: "Hotel" as const,

  location: {
    street: "Musterstraße 1",
    postalCode: "IT-39000",
    city: "Stadt",
    region: "Südtirol",
    country: "Italien",
    coordinates: {
      lat: 46.5,
      lng: 11.5,
    },
  },

  contact: {
    email: "info@example.com",
    phone: {
      main: { display: "+39 0000 000 000", href: "tel:+390000000000" },
      whatsapp: {
        display: "",
        href: "",
      },
    },
    website: {
      main: "https://www.example.com",
      booking: "",
    },
  },

  social: {
    facebook: "",
    instagram: "",
    youtube: undefined,
  },

  legal: {
    taxId: "",
    imprint: {
      de: "",
      en: "",
      it: "",
    },
    privacy: {
      de: "",
      en: "",
      it: "",
    },
  },

  branding: {
    logo: {
      main: "/full-logo.png",
      mobile: "/full-logo-mobile.svg",
      alt: "/placeholder.svg",
    },
    dimensions: {
      mobile: { width: 132, height: 74 },
      desktop: { width: 189, height: 138 },
    },
  },

  copyright: {
    year: 2026,
    holder: "Hotel Name",
  },
};

// ============================================
// BOOKING_CONFIG - Reservation settings
// ============================================
export const BOOKING_CONFIG = {
  bookingUrls: {
    de: "",
    en: "",
    it: "",
  },

  dates: {
    minBookingDate: "2026-02-21",
  },

  checkIn: {
    from: "14:00",
    to: "",
  },

  checkOut: {
    until: "11:00",
  },

  touristTax: {
    amount: 3.5,
    currency: "EUR",
    per: "person/day",
    exemptUnderAge: 14,
  },

  cancellation: {
    tiers: [
      { daysBeforeArrival: 60, fee: 0, description: "Free cancellation" },
      { daysBeforeArrival: 21, fee: 30, feeType: "percent" as const },
      { daysBeforeArrival: 7, fee: 75, feeType: "percent" as const },
      { daysBeforeArrival: 0, fee: 95, feeType: "percent" as const },
    ],
    depositRefundable: false,
  },

  policies: {
    pets: { allowed: false, fee: 0, per: "" },
    additionalPerson: { fee: 0, per: "night" },
    breakfastOnlyDeduction: { amount: 0, per: "person" },
  },
};

// ============================================
// TECHNICAL_CONFIG - Dev/deployment settings
// ============================================
export const TECHNICAL_CONFIG = {
  projectId: "hotel-template",

  urls: {
    production: "https://example.com",
    staging: "",
  },

  analytics: {
    gtmId: "GTM-PNP7DSX2",
  },

  email: {
    from: "info@example.com",
    replyTo: "info@example.com",
    transactional: "hotel@updates.alpinads.app",
    assetsBaseUrl: "https://example.com",
  },

  credits: {
    agency: "Alpin Ads",
    agencyUrl: "https://alpinads.com/",
  },
};

// ============================================
// SEO_CONFIG - Metadata for all languages
// ============================================
export const SEO_CONFIG = {
  baseUrl: "https://example.com",
  ogImage: "/placeholder.svg",

  home: {
    de: {
      title: "Hotel Name - Urlaub in Südtirol",
      description:
        "Willkommen im Hotel Name in Südtirol. Genießen Sie Ihren Urlaub mit Wellness, Frühstück und traumhaftem Blick auf die Dolomiten.",
      ogTitle: "Hotel Name - Urlaub in Südtirol",
      ogDescription:
        "Hotel Name: Ihr Urlaubsziel in Südtirol mit Wellness und Frühstück.",
      ogLocale: "de_DE",
    },
    en: {
      title: "Hotel Name - Holiday in South Tyrol",
      description:
        "Welcome to Hotel Name in South Tyrol. Enjoy your holiday with wellness, breakfast and stunning views of the Dolomites.",
      ogTitle: "Hotel Name - Holiday in South Tyrol",
      ogDescription:
        "Hotel Name: Your holiday destination in South Tyrol with wellness and breakfast.",
      ogLocale: "en_US",
    },
    it: {
      title: "Hotel Name - Vacanza in Alto Adige",
      description:
        "Benvenuti all'Hotel Name in Alto Adige. Godetevi la vostra vacanza con wellness, colazione e vista mozzafiato sulle Dolomiti.",
      ogTitle: "Hotel Name - Vacanza in Alto Adige",
      ogDescription:
        "Hotel Name: La vostra destinazione di vacanza in Alto Adige con wellness e colazione.",
      ogLocale: "it_IT",
    },
  },

  keywords: [
    "Hotel Südtirol",
    "Urlaub Dolomiten",
    "Holiday South Tyrol",
    "Vacanza Alto Adige",
    "Wellness Südtirol",
  ],
};

// ============================================
// Helper functions
// ============================================
export function getHotelConfig() {
  return HOTEL_CONFIG;
}
export function getBookingConfig(): BookingConfigLegacy {
  return bookingConfig;
}
export function getTechnicalConfig() {
  return TECHNICAL_CONFIG;
}
export function getSeoConfig() {
  return SEO_CONFIG;
}

// ============================================
// Legacy aliases for backward compatibility
// ============================================
export interface HotelProfile {
  address: {
    line1: string;
    line2: string;
  };
  contact: {
    email: string;
    phone: {
      display: string;
      href: string;
    };
  };
  hotelName: string;
  social: {
    instagram?: string;
    facebook?: string;
    youtube?: string;
    whatsapp?: string;
  };
  legal: {
    imprintBaseUrl: string;
    privacyBaseUrl: string;
  };
  credits: {
    alpinAdsUrl: string;
  };
  logo: {
    src: string;
    mobileSrc: string;
    mobile: {
      width: number;
      height: number;
    };
    desktop: {
      width: number;
      height: number;
    };
  };
}

export const hotelProfile: HotelProfile = {
  hotelName: HOTEL_CONFIG.name,
  address: {
    line1: HOTEL_CONFIG.location.street,
    line2: `${HOTEL_CONFIG.location.postalCode} ${HOTEL_CONFIG.location.city}, ${HOTEL_CONFIG.location.region} - ${HOTEL_CONFIG.location.country}`,
  },
  contact: {
    email: HOTEL_CONFIG.contact.email,
    phone: HOTEL_CONFIG.contact.phone.main,
  },
  social: {
    ...HOTEL_CONFIG.social,
    whatsapp: HOTEL_CONFIG.contact.phone.whatsapp.href,
  },
  legal: {
    imprintBaseUrl: HOTEL_CONFIG.legal.imprint.de,
    privacyBaseUrl: HOTEL_CONFIG.legal.privacy.de,
  },
  credits: { alpinAdsUrl: TECHNICAL_CONFIG.credits.agencyUrl },
  logo: {
    src: HOTEL_CONFIG.branding.logo.main,
    mobileSrc: HOTEL_CONFIG.branding.logo.mobile,
    mobile: HOTEL_CONFIG.branding.dimensions.mobile,
    desktop: HOTEL_CONFIG.branding.dimensions.desktop,
  },
};

export interface SiteConfig {
  baseUrl: string;
  ogImage: string;
}

export const siteConfig: SiteConfig = {
  baseUrl: SEO_CONFIG.baseUrl,
  ogImage: SEO_CONFIG.ogImage,
};

export interface BookingConfigLegacy {
  minDate: string;
}

export const bookingConfig: BookingConfigLegacy = {
  minDate: BOOKING_CONFIG.dates.minBookingDate,
};

export function getHotelProfile(): HotelProfile {
  return hotelProfile;
}

export function getSiteConfig(): SiteConfig {
  return siteConfig;
}

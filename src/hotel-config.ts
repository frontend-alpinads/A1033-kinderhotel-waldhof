// ============================================
// HOTEL_CONFIG - Core hotel identity & contact
// ============================================
export const HOTEL_CONFIG = {
  name: "Kinderhotel Waldhof",
  shortName: "Waldhof",
  type: "Resort" as const,

  location: {
    street: "Dorfstraße 1",
    postalCode: "A-5611",
    city: "Großarl",
    region: "Salzburg",
    country: "Österreich",
    coordinates: {
      lat: 47.2333,
      lng: 13.2167,
    },
  },

  contact: {
    email: "info@kinderhotel-waldhof.at",
    phone: {
      main: { display: "+43 6414 200", href: "tel:+436414200" },
      whatsapp: {
        display: "",
        href: "",
      },
    },
    website: {
      main: "https://www.kinderhotel-waldhof.at",
      booking: "https://www.kinderhotel-waldhof.at/zimmer-leistungen/urlaubsanfrage/",
    },
  },

  social: {
    facebook: "https://www.facebook.com/kinderhotelwaldhof",
    instagram: "https://www.instagram.com/kinderhotel_waldhof",
    youtube: undefined,
  },

  legal: {
    taxId: "",
    imprint: {
      de: "https://www.kinderhotel-waldhof.at/impressum/",
      en: "https://www.kinderhotel-waldhof.at/en/imprint/",
      it: "",
    },
    privacy: {
      de: "https://www.kinderhotel-waldhof.at/datenschutz/",
      en: "https://www.kinderhotel-waldhof.at/en/privacy/",
      it: "",
    },
  },

  branding: {
    logo: {
      main: "https://www.kinderhotel-waldhof.at/hotel-aussen/winter/2024/1100/image-thumb__1100__ce-intro-mobile/andreschoenherr_PANO0001-Pano.jpg",
      mobile: "https://www.kinderhotel-waldhof.at/hotel-aussen/winter/2024/1100/image-thumb__1100__ce-intro-mobile/andreschoenherr_PANO0001-Pano.jpg",
      alt: "https://www.kinderhotel-waldhof.at/hotel-aussen/winter/2024/1100/image-thumb__1100__ce-intro-mobile/andreschoenherr_PANO0001-Pano.jpg",
    },
    dimensions: {
      mobile: { width: 132, height: 74 },
      desktop: { width: 189, height: 138 },
    },
  },

  copyright: {
    year: 2026,
    holder: "Kinderhotel Waldhof",
  },
};

// ============================================
// BOOKING_CONFIG - Reservation settings
// ============================================
export const BOOKING_CONFIG = {
  bookingUrls: {
    de: "https://www.kinderhotel-waldhof.at/zimmer-leistungen/urlaubsanfrage/",
    en: "https://www.kinderhotel-waldhof.at/zimmer-leistungen/urlaubsanfrage/",
    it: "https://www.kinderhotel-waldhof.at/zimmer-leistungen/urlaubsanfrage/",
  },

  dates: {
    minBookingDate: "2026-03-09",
  },

  checkIn: {
    from: "15:00",
    to: "20:00",
  },

  checkOut: {
    until: "11:00",
  },

  touristTax: {
    amount: 2.5,
    currency: "EUR",
    per: "person/day",
    exemptUnderAge: 15,
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
  projectId: "A1033",

  urls: {
    production: "https://example.com",
    staging: "",
  },

  analytics: {
    gtmId: "GTM-PNP7DSX2",
  },

  email: {
    from: "noreply@example.com",
    replyTo: "info@kinderhotel-waldhof.at",
    transactional: "kinderhotel-waldhof@updates.alpinads.app",
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
  ogImage: "https://www.kinderhotel-waldhof.at/hotel-aussen/winter/2024/1100/image-thumb__1100__ce-intro-mobile/andreschoenherr_PANO0001-Pano.jpg",

  home: {
    de: {
      title: "Kinderhotel Waldhof Großarl – Premium Familienurlaub in Salzburg | All Inclusive",
      description: "Das Premium Kinderhotel Waldhof in Großarl, Salzburg: Familienurlaub All Inclusive mit Skiwiese, TUFFI Spieleparadies, 80h Kinderbetreuung, Wellnesswelt & mehr. Jetzt unverbindlich anfragen!",
      ogTitle: "Kinderhotel Waldhof Großarl – Unvergesslicher Familienurlaub in den Alpen",
      ogDescription: "Premium Kinderhotel in Großarl, Salzburg. All Inclusive für die ganze Familie: Skiwiese, Indoor-Spieleparadies, Kinderbetreuung 80h/Woche, Wellnesswelt & Kulinarik. Träume werden wahr!",
      ogLocale: "de_DE",
    },
    en: {
      title: "Kinderhotel Waldhof Großarl – Premium Family Hotel in Salzburg | All Inclusive",
      description: "The Premium Kinderhotel Waldhof in Großarl, Salzburg: Family holidays all inclusive with ski slope, TUFFI play paradise, 80h childcare, wellness world & more. Enquire now!",
      ogTitle: "Kinderhotel Waldhof Großarl – Unforgettable Family Holidays in the Alps",
      ogDescription: "Premium kids hotel in Großarl, Salzburg. All inclusive for the whole family: ski slope, indoor play paradise, 80h/week childcare, wellness world & cuisine. Dreams come true!",
      ogLocale: "en_GB",
    },
    it: {
      title: "Kinderhotel Waldhof Großarl – Hotel Premium per Famiglie a Salisburgo | All Inclusive",
      description: "Il Premium Kinderhotel Waldhof a Großarl, Salisburgo: vacanze in famiglia all inclusive con pista da sci, paradiso giochi TUFFI, 80h assistenza bambini, mondo benessere e altro. Richiedi ora!",
      ogTitle: "Kinderhotel Waldhof Großarl – Vacanze familiari indimenticabili sulle Alpi",
      ogDescription: "Premium hotel per bambini a Großarl, Salisburgo. All inclusive per tutta la famiglia: pista da sci, paradiso giochi al coperto, 80h/settimana assistenza bambini, mondo benessere e cucina. I sogni diventano realtà!",
      ogLocale: "it_IT",
    },
  },

  keywords: ["Kinderhotel Waldhof","Kinderhotel Großarl","Familienhotel Salzburg","Premium Kinderhotel Österreich","Familienurlaub Alpen","All Inclusive Kinderhotel","Skiurlaub mit Kindern","Kinderbetreuung Hotel","Familienhotel Salzburger Land","Winterurlaub Familie Österreich","Sommerurlaub Familie Salzburg","Hotel mit Spieleparadies","Familienhotel mit Wellness","Ponyreiten Hotel Kinder","Ski Amadé Familienhotel"],
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

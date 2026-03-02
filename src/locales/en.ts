import type { Dictionary } from "./types";

const en: Dictionary = {
  metadata: {
    title: "Hotel Name - Holiday in South Tyrol",
    description:
      "Welcome to Hotel Name in South Tyrol. Enjoy wellness, breakfast and stunning views of the Dolomites.",
    ogTitle: "Hotel Name - Holiday in South Tyrol",
    ogDescription:
      "Hotel Name: Your holiday destination in South Tyrol with wellness and breakfast.",
  },
  nav: {
    rooms: "Apartments",
    offers: "Offers",
    services: "Services",
    gallery: "Gallery",
    testimonials: "Reviews",
    callNow: "Call Now",
    bookNow: "Book Now",
    enquiryNow: "Enquiry Now",
  },
  offers: {
    badge: "Offers",
    title: "Your Holiday Highlights",
    description:
      "Discover our offers for your perfect holiday in South Tyrol. From relaxing wellness days to active hiking and skiing experiences in the Dolomites.",
    offerDetails: "Offer details",
    learnMore: "Learn More",
    from: "from",
    includedServices: "Included Services:",
    offerIncludes: "Our offer includes:",
    availablePeriods: "Available Periods",
    morePeriods: "more periods",
    tabs: {
      selectedDates: "Selected Dates",
      otherPeriods: "Other Periods",
    },
  },
  rooms: {
    badge: "Rooms & Suites",
    title: "Our Accommodations",
    description:
      "Comfortable rooms with mountain views. Modern amenities and traditional South Tyrolean charm for your perfect stay.",
    tabs: {
      all: "All",
      rooms: "Apartments",
      suites: "Suites",
    },
    gourmetPension: "With Breakfast",
    roomType: "Apartment Type:",
    roomInformation: "Apartment Information",
    roomInformationZimmer: "Apartment Information",
    roomInformationChalet: "Suite Information",
    closeDetails: "Close Details",
    previousImage: "Previous Image",
    nextImage: "Next Image",
    goToImage: "Go to Image",
    perNight: "per night",
    additionalPersonPrice: "€30 for each additional person",
    priceNote: "plus applicable tourist tax",
    includedServices: "Included Services:",
    available: "{count} available",
    image: "Image",
    carousel: {
      viewingText: "{total} accommodations available in total",
      viewingTextRooms: "{total} apartments available in total",
      viewingTextChalets: "{total} suites available in total",
      previousSlide: "Previous slide",
      nextSlide: "Next slide",
    },
  },
  testimonials: {
    badge: "Guest Voices",
    title: "What Our Guests Say",
    description:
      "Authentic experiences from guests who have stayed with us – from room design to personal service and unforgettable experiences.",
  },
  faqs: {
    badge: "Good to Know",
    title: "Everything for Your Perfect Stay",
    description:
      "From check-in and wellness to tips for your holiday – here you'll find all important information for your stay.",
  },
  footer: {
    links: {
      title: "Links",
      rooms: "Apartments",
      gallery: "Gallery",
    },
    legal: {
      title: "Legal",
      imprint: "Legal Notice",
      privacy: "Privacy Policy",
      privacySettings: "Privacy Settings",
    },
    contact: {
      title: "Contact",
      mobile: "",
    },
    social: {
      title: "Social",
    },
    copyright: "© 2026, Hotel Name",
    credits: "Ads and Code by",
  },
  common: {
    readMore: "Read More",
    request: "Enquire Now",
    close: "Close",
    back: "Back",
    next: "Next",
    previous: "Previous",
    loading: "Loading...",
    apply: "Apply",
    arrivalDeparture: "Arrival & Departure",

    // Hero V10 specific
    verifiedGuest: "Verified Guest",
    startingFrom: "Starting from",
    freeNonBinding: "Free & non-binding",
    replyWithin2Hours: "Reply within 2 hours",
    makeRequest: "Make a Request",
    verifiedReviews: "verified reviews",

    planYourStay: "Plan Your Stay",
    bookingUrl: "",

    arrival: "Arrival",
    departure: "Departure",
    enquiry: "Enquiry Now",
    locale: "en",
    localeString: "en-US",

    adults: {
      one: "Adult",
      other: "Adults",
    },
    children: {
      one: "Child",
      other: "Children",
    },
    childAge: "Child Age",
    years: {
      one: "Year",
      other: "Years",
    },
    night: {
      one: "Night",
      other: "Nights",
    },
    guests: {
      one: "Guest",
      other: "Guests",
    },
    photo: {
      one: "Photo",
      other: "Photos",
    },
    perPerson: " per person per night",
    perPersonOnly: " per person",
    perPersonPerStay: " per person per stay",
    perNightFor2: " per night for 2 persons",
    from: "from",
    for: "For",
    persons: "persons",
    save: "Save",
    edit: "Edit",
    remove: "Remove",
    search: "Search...",
    popular: "Popular",
    allCountries: "All Countries",

    // Offer selection
    offerSelection: {
      title: "Choose Offer",
      noOffersInPeriod: "No offers available for this period",
      selectWillResetDates: "Selecting an offer will reset your dates",
      tryAdjustingDates:
        "Try adjusting your dates or check other available periods.",
    },

    // Date selection
    dateSelection: {
      title: "Choose Date",
      chooseYourDates: "Choose Your Dates",
      addAlternativeDate: "Add Alternative Date",
      removeAlternativeDate: "Remove Alternative Date",
      alternativeArrivalDeparture: "Alternative Arrival & Departure",
      chooseAlternativeDates: "Choose Alternative Dates",
      applyDates: "Apply Dates",
      nightsFrom: "{count} {nights} from {from} to {to}",
      selectedDatesLabel: "Dates",
      offersAvailable: "Offers available",
      flexibility: {
        exactDates: "Exact Dates",
        plusMinus1Day: "± 1 Day",
        plusMinus2Days: "± 2 Days",
        plusMinus3Days: "± 3 Days",
        plusMinus7Days: "± 7 Days",
        plusMinus14Days: "± 14 Days",
      },
    },

    // Room selection
    roomSelection: {
      title: "Choose Apartment & Number of Guests",
      chooseRoom: "Choose Apartment",
      addAnotherRoom: "Add Another Apartment",
      pleaseChooseRoom: "Please choose an apartment",
      board: "Board",
      withBreakfast: "Bed and Breakfast",
      halfBoard: "Half Board",
      room: {
        one: "Apartment",
        other: "Apartments",
      },
    },

    // Guest selection
    guestSelection: {
      title: "Choose Guests",
      chooseGuests: "Choose guests",
    },

    // Offer/Room availability
    noOffersAvailable: "No offers available",
    noRoomsAvailable: "No apartments available",

    // Validation errors
    validation: {
      required: "This field is required",
      invalidEmail: "Please enter a valid email address",
      submissionError: "An error occurred. Please try again.",
    },
  },
};

export default en;

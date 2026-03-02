export interface Dictionary {
  metadata: {
    title: string;
    description: string;
    ogTitle: string;
    ogDescription: string;
  };
  nav: {
    rooms: string;
    offers: string;
    services: string;
    gallery: string;
    testimonials: string;
    callNow: string;
    bookNow: string;
    enquiryNow: string;
  };
  offers: {
    badge: string;
    title: string;
    description: string;
    offerDetails: string;
    learnMore: string;
    from: string;
    includedServices: string;
    offerIncludes: string;
    availablePeriods: string;
    morePeriods: string;
    tabs: {
      selectedDates: string;
      otherPeriods: string;
    };
  };
  rooms: {
    badge: string;
    title: string;
    description: string;
    tabs: {
      all: string;
      rooms: string;
      suites: string;
    };
    gourmetPension: string;
    roomType: string;
    roomInformation: string;
    roomInformationZimmer: string;
    roomInformationChalet: string;
    closeDetails: string;
    previousImage: string;
    nextImage: string;
    goToImage: string;
    perNight: string;
    additionalPersonPrice: string;
    priceNote: string;
    includedServices: string;
    available: string;
    image: string;
    carousel: {
      viewingText: string;
      viewingTextRooms: string;
      viewingTextChalets: string;
      previousSlide: string;
      nextSlide: string;
    };
  };
  testimonials: {
    badge: string;
    title: string;
    description: string;
  };
  faqs: {
    badge: string;
    title: string;
    description: string;
  };
  footer: {
    links: {
      title: string;
      rooms: string;
      gallery: string;
    };
    legal: {
      title: string;
      imprint: string;
      privacy: string;
      privacySettings: string;
    };
    contact: {
      title: string;
      mobile: string;
    };
    social: {
      title: string;
    };
    copyright: string;
    credits: string;
  };
  common: {
    readMore: string;
    request: string;
    planYourStay: string;
    close: string;
    back: string;
    next: string;
    previous: string;
    loading: string;
    arrival: string;
    departure: string;
    arrivalDeparture: string;
    apply: string;
    locale: string;
    enquiry: string;
    localeString: string;
    bookingUrl: string;
    // Hero V10 specific
    verifiedGuest: string;
    startingFrom: string;
    freeNonBinding: string;
    replyWithin2Hours: string;
    makeRequest: string;
    verifiedReviews: string;
    adults: {
      one: string;
      other: string;
    };
    children: {
      one: string;
      other: string;
    };
    childAge: string;
    years: {
      one: string;
      other: string;
    };
    night: {
      one: string;
      other: string;
    };
    guests: {
      one: string;
      other: string;
    };
    photo: {
      one: string;
      other: string;
    };
    perPerson: string;
    perPersonOnly: string;
    perPersonPerStay: string;
    perNightFor2: string;
    from: string;
    for: string;
    persons: string;
    save: string;
    edit: string;
    remove: string;
    search: string;
    popular: string;
    allCountries: string;
    offerSelection: {
      title: string;
      noOffersInPeriod: string;
      selectWillResetDates: string;
      tryAdjustingDates: string;
    };
    dateSelection: {
      title: string;
      chooseYourDates: string;
      addAlternativeDate: string;
      removeAlternativeDate: string;
      alternativeArrivalDeparture: string;
      chooseAlternativeDates: string;
      applyDates: string;
      nightsFrom: string;
      selectedDatesLabel: string;
      offersAvailable: string;
      flexibility: {
        exactDates: string;
        plusMinus1Day: string;
        plusMinus2Days: string;
        plusMinus3Days: string;
        plusMinus7Days: string;
        plusMinus14Days: string;
      };
    };
    roomSelection: {
      title: string;
      chooseRoom: string;
      addAnotherRoom: string;
      pleaseChooseRoom: string;
      board: string;
      withBreakfast: string;
      halfBoard: string;
      room: {
        one: string;
        other: string;
      };
    };
    guestSelection: {
      title: string;
      chooseGuests: string;
    };
    noOffersAvailable: string;
    noRoomsAvailable: string;
    validation: {
      required: string;
      invalidEmail: string;
      submissionError: string;
    };
  };
}

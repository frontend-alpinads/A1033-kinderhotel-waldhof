import type { EnquiryFormTranslations } from "../types";

const en: EnquiryFormTranslations = {
  // Common UI labels
  close: "Close",
  back: "Back",
  next: "Next",
  previous: "Previous",
  loading: "Loading...",
  apply: "Apply",
  arrivalDeparture: "Arrival & Departure",
  arrival: "Arrival",
  departure: "Departure",
  save: "Save",
  edit: "Edit",
  remove: "Remove",
  search: "Search...",
  popular: "Popular",
  allCountries: "All Countries",
  from: "from",
  for: "For",
  persons: "persons",
  perPerson: " per person per night",

  // Locale settings
  locale: "en",
  localeString: "en-US",

  // Plurals
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
    title: "Choose Room & Number of Guests",
    chooseRoom: "Choose Room",
    addAnotherRoom: "Add Another Room",
    pleaseChooseRoom: "Please choose a room",
    board: "Board",
    halfBoard: "Half Board",
    withBreakfast: "With Breakfast",
    withoutBreakfast: "Without Breakfast",
    room: {
      one: "Room",
      other: "Rooms",
    },
  },

  // Guest selection
  guestSelection: {
    title: "Choose Guests",
    chooseGuests: "Choose guests",
  },

  // Offer selection
  offerSelection: {
    title: "Choose Offer",
    noOffersInPeriod: "No offers available in this period",
    selectWillResetDates: "Selecting an offer will reset the dates",
    tryAdjustingDates:
      "Try adjusting your dates or check other available periods.",
  },

  // Validation errors
  validation: {
    required: "This field is required",
    invalidEmail: "Please enter a valid email address",
    submissionError: "An error occurred. Please try again.",
  },

  // Offer tabs
  offerTabs: {
    selectedDates: "Selected Dates",
    otherPeriods: "Other Periods",
  },

  // Availability messages
  noOffersAvailable: "No offers available",
  noRoomsAvailable: "No rooms available",

  // Opening notice
  openingNotice: "",

  // Form content
  form: {
    roomType: {
      label: "Room Type",
      roomOnly: "Room Only",
      roomWithOffer: "Room with Offer",
    },
    dates: {
      label: "Arrival and Departure*",
      alternative: "Alternative Date",
    },
    offer: {
      label: "Offer",
      choose: "Choose Offer",
    },
    room: {
      label: "Room",
      chooseWithGuests: "Room and Number of Guests",
    },
    salutation: {
      label: "Salutation",
      mr: "Mr",
      mrs: "Mrs",
    },
    firstName: "First Name*",
    lastName: "Last Name*",
    phone: "Phone*",
    email: "Email*",
    emailSuggestion: "Did you mean",
    message: "Message",
    newsletter: "I would like to receive the newsletter regularly",
    privacyPolicy: {
      prefix: "*I accept the ",
      linkText: "privacy policy",
      suffix: "",
    },
    responseTime:
      "We will respond within 24 hours with your personalized offer.",
    submit: "Check Availability Now",
    submitting: "Sending...",
  },
};

export default en;

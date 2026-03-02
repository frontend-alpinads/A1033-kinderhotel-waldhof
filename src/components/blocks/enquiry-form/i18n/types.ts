/**
 * Types for the enquiry form's self-contained translations
 */

export type Locale = "de" | "en" | "it";

export interface PluralForm {
  one: string;
  other: string;
}

export interface DateSelectionTranslations {
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
}

export interface RoomSelectionTranslations {
  title: string;
  chooseRoom: string;
  addAnotherRoom: string;
  pleaseChooseRoom: string;
  board: string;
  halfBoard: string;
  withBreakfast: string;
  withoutBreakfast: string;
  room: PluralForm;
}

export interface GuestSelectionTranslations {
  title: string;
  chooseGuests: string;
}

export interface OfferSelectionTranslations {
  title: string;
  noOffersInPeriod: string;
  selectWillResetDates: string;
  tryAdjustingDates: string;
}

export interface ValidationTranslations {
  required: string;
  invalidEmail: string;
  submissionError: string;
}

export interface OfferTabsTranslations {
  selectedDates: string;
  otherPeriods: string;
}

export interface FormTranslations {
  roomType: {
    label: string;
    roomOnly: string;
    roomWithOffer: string;
  };
  dates: {
    label: string;
    alternative: string;
  };
  offer: {
    label: string;
    choose: string;
  };
  room: {
    label: string;
    chooseWithGuests: string;
  };
  salutation: {
    label: string;
    mr: string;
    mrs: string;
  };
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  emailSuggestion: string;
  message: string;
  newsletter: string;
  privacyPolicy: {
    prefix: string;
    linkText: string;
    suffix: string;
  };
  responseTime: string;
  submit: string;
  submitting: string;
}

export interface EnquiryFormTranslations {
  // Common UI labels
  close: string;
  back: string;
  next: string;
  previous: string;
  loading: string;
  apply: string;
  arrivalDeparture: string;
  arrival: string;
  departure: string;
  save: string;
  edit: string;
  remove: string;
  search: string;
  popular: string;
  allCountries: string;
  from: string;
  for: string;
  persons: string;
  perPerson: string;

  // Locale settings
  locale: string;
  localeString: string;

  // Plurals
  adults: PluralForm;
  children: PluralForm;
  childAge: string;
  years: PluralForm;
  night: PluralForm;
  guests: PluralForm;

  // Section translations
  dateSelection: DateSelectionTranslations;
  roomSelection: RoomSelectionTranslations;
  guestSelection: GuestSelectionTranslations;
  offerSelection: OfferSelectionTranslations;
  validation: ValidationTranslations;

  // Offer tabs
  offerTabs: OfferTabsTranslations;

  // Availability messages
  noOffersAvailable: string;
  noRoomsAvailable: string;

  // Opening notice (optional, for section header)
  openingNotice?: string;

  // Form content
  form: FormTranslations;
}

import type { EnquiryFormTranslations } from "../types";

const de: EnquiryFormTranslations = {
  // Common UI labels
  close: "Schließen",
  back: "Zurück",
  next: "Weiter",
  previous: "Zurück",
  loading: "Wird geladen...",
  apply: "Übernehmen",
  arrivalDeparture: "Ankunft & Abreise",
  arrival: "Anreise",
  departure: "Abreise",
  save: "Speichern",
  edit: "Bearbeiten",
  remove: "Entfernen",
  search: "Suchen...",
  popular: "Beliebt",
  allCountries: "Alle Länder",
  from: "ab",
  for: "Für",
  persons: "Personen",
  perPerson: " pro Person pro Nacht",

  // Locale settings
  locale: "de",
  localeString: "de-DE",

  // Plurals
  adults: {
    one: "Erwachsener",
    other: "Erwachsene",
  },
  children: {
    one: "Kind",
    other: "Kinder",
  },
  childAge: "Alter Kind",
  years: {
    one: "Jahr",
    other: "Jahre",
  },
  night: {
    one: "Nacht",
    other: "Nächte",
  },
  guests: {
    one: "Gast",
    other: "Gäste",
  },

  // Date selection
  dateSelection: {
    title: "Datum wählen",
    chooseYourDates: "Wählen Sie Ihre Daten",
    addAlternativeDate: "Alternativtermin hinzufügen",
    removeAlternativeDate: "Alternativtermin entfernen",
    alternativeArrivalDeparture: "Alternative Anreise & Abreise",
    chooseAlternativeDates: "Alternative Daten auswählen",
    applyDates: "Daten übernehmen",
    nightsFrom: "{count} {nights} von {from} bis {to}",
    selectedDatesLabel: "Daten",
    offersAvailable: "Angebote verfügbar",
    flexibility: {
      exactDates: "Genaue Daten",
      plusMinus1Day: "± 1 Tag",
      plusMinus2Days: "± 2 Tage",
      plusMinus3Days: "± 3 Tage",
      plusMinus7Days: "± 7 Tage",
      plusMinus14Days: "± 14 Tage",
    },
  },

  // Room selection
  roomSelection: {
    title: "Zimmer & Gästeanzahl wählen",
    chooseRoom: "Zimmer auswählen",
    addAnotherRoom: "Weiteres Zimmer hinzufügen",
    pleaseChooseRoom: "Bitte wählen Sie ein Zimmer",
    board: "Verpflegung",
    halfBoard: "Halbpension",
    withBreakfast: "Mit Frühstück",
    withoutBreakfast: "Ohne Frühstück",
    room: {
      one: "Zimmer",
      other: "Zimmer",
    },
  },

  // Guest selection
  guestSelection: {
    title: "Gäste wählen",
    chooseGuests: "Gäste auswählen",
  },

  // Offer selection
  offerSelection: {
    title: "Angebot wählen",
    noOffersInPeriod: "Keine Angebote in diesem Zeitraum verfügbar",
    selectWillResetDates:
      "Bei Auswahl eines Angebots wird das Datum zurückgesetzt",
    tryAdjustingDates:
      "Passen Sie Ihre Daten an oder prüfen Sie andere verfügbare Zeiträume.",
  },

  // Validation errors
  validation: {
    required: "Dieses Feld ist erforderlich",
    invalidEmail: "Bitte geben Sie eine gültige E-Mail-Adresse ein",
    submissionError:
      "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.",
  },

  // Offer tabs
  offerTabs: {
    selectedDates: "Ausgewählte Daten",
    otherPeriods: "Andere Zeiträume",
  },

  // Availability messages
  noOffersAvailable: "Keine Angebote verfügbar",
  noRoomsAvailable: "Keine Zimmer verfügbar",

  // Opening notice
  openingNotice: "",

  // Form content
  form: {
    roomType: {
      label: "Zimmertyp",
      roomOnly: "Nur Zimmer",
      roomWithOffer: "Zimmer mit Angebot",
    },
    dates: {
      label: "Ankunft und Abreise*",
      alternative: "Alternativer Termin",
    },
    offer: {
      label: "Angebot",
      choose: "Angebot auswählen",
    },
    room: {
      label: "Zimmer",
      chooseWithGuests: "Zimmer und Gästeanzahl",
    },
    salutation: {
      label: "Anrede",
      mr: "Herr",
      mrs: "Frau",
    },
    firstName: "Vorname*",
    lastName: "Nachname*",
    phone: "Telefon*",
    email: "E-Mail*",
    emailSuggestion: "Meinten Sie",
    message: "Nachricht",
    newsletter: "Ich möchte regelmäßig den Newsletter erhalten",
    privacyPolicy: {
      prefix: "*Ich akzeptiere die ",
      linkText: "Datenschutzbestimmungen",
      suffix: "",
    },
    responseTime:
      "Wir melden uns innerhalb von 24 Stunden mit Ihrem persönlichen Angebot.",
    submit: "Jetzt Verfügbarkeit prüfen",
    submitting: "Wird gesendet...",
  },
};

export default de;

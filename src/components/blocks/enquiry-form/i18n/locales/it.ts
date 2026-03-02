import type { EnquiryFormTranslations } from "../types";

const it: EnquiryFormTranslations = {
  // Common UI labels
  close: "Chiudi",
  back: "Indietro",
  next: "Avanti",
  previous: "Indietro",
  loading: "Caricamento...",
  apply: "Applica",
  arrivalDeparture: "Arrivo e Partenza",
  arrival: "Arrivo",
  departure: "Partenza",
  save: "Salva",
  edit: "Modifica",
  remove: "Rimuovi",
  search: "Cerca...",
  popular: "Popolari",
  allCountries: "Tutti i Paesi",
  from: "da",
  for: "Per",
  persons: "persone",
  perPerson: " per persona per notte",

  // Locale settings
  locale: "it",
  localeString: "it-IT",

  // Plurals
  adults: {
    one: "Adulto",
    other: "Adulti",
  },
  children: {
    one: "Bambino",
    other: "Bambini",
  },
  childAge: "Età bambino",
  years: {
    one: "anno",
    other: "anni",
  },
  night: {
    one: "Notte",
    other: "Notti",
  },
  guests: {
    one: "Ospite",
    other: "Ospiti",
  },

  // Date selection
  dateSelection: {
    title: "Scegli data",
    chooseYourDates: "Scegli le tue date",
    addAlternativeDate: "Aggiungi data alternativa",
    removeAlternativeDate: "Rimuovi data alternativa",
    alternativeArrivalDeparture: "Arrivo e partenza alternativi",
    chooseAlternativeDates: "Scegli date alternative",
    applyDates: "Applica date",
    nightsFrom: "{count} {nights} da {from} a {to}",
    selectedDatesLabel: "Date",
    offersAvailable: "Offerte disponibili",
    flexibility: {
      exactDates: "Date esatte",
      plusMinus1Day: "± 1 giorno",
      plusMinus2Days: "± 2 giorni",
      plusMinus3Days: "± 3 giorni",
      plusMinus7Days: "± 7 giorni",
      plusMinus14Days: "± 14 giorni",
    },
  },

  // Room selection
  roomSelection: {
    title: "Scegli camera e numero di ospiti",
    chooseRoom: "Scegli camera",
    addAnotherRoom: "Aggiungi un'altra camera",
    pleaseChooseRoom: "Scegli una camera",
    board: "Trattamento",
    halfBoard: "Mezza pensione",
    withBreakfast: "Con colazione",
    withoutBreakfast: "Senza colazione",
    room: {
      one: "Camera",
      other: "Camere",
    },
  },

  // Guest selection
  guestSelection: {
    title: "Scegli ospiti",
    chooseGuests: "Scegli ospiti",
  },

  // Offer selection
  offerSelection: {
    title: "Scegli offerta",
    noOffersInPeriod: "Nessuna offerta disponibile in questo periodo",
    selectWillResetDates:
      "Selezionando un'offerta, le date verranno reimpostate",
    tryAdjustingDates:
      "Prova a modificare le date o controlla altri periodi disponibili.",
  },

  // Validation errors
  validation: {
    required: "Questo campo è obbligatorio",
    invalidEmail: "Inserisci un indirizzo email valido",
    submissionError: "Si è verificato un errore. Riprova.",
  },

  // Offer tabs
  offerTabs: {
    selectedDates: "Date selezionate",
    otherPeriods: "Altri periodi",
  },

  // Availability messages
  noOffersAvailable: "Nessuna offerta disponibile",
  noRoomsAvailable: "Nessuna camera disponibile",

  // Opening notice
  openingNotice: "",

  // Form content
  form: {
    roomType: {
      label: "Tipo di camera",
      roomOnly: "Solo camera",
      roomWithOffer: "Camera con offerta",
    },
    dates: {
      label: "Arrivo e partenza*",
      alternative: "Data alternativa",
    },
    offer: {
      label: "Offerta",
      choose: "Seleziona offerta",
    },
    room: {
      label: "Camera",
      chooseWithGuests: "Camera e numero di ospiti",
    },
    salutation: {
      label: "Titolo",
      mr: "Sig.",
      mrs: "Sig.ra",
    },
    firstName: "Nome*",
    lastName: "Cognome*",
    phone: "Telefono*",
    email: "Email*",
    emailSuggestion: "Intendevi",
    message: "Messaggio",
    newsletter: "Desidero ricevere regolarmente la newsletter",
    privacyPolicy: {
      prefix: "*Accetto ",
      linkText: "l'informativa sulla privacy",
      suffix: "",
    },
    responseTime:
      "Risponderemo entro 24 ore con la tua offerta personalizzata.",
    submit: "Verifica disponibilità",
    submitting: "Invio in corso...",
  },
};

export default it;

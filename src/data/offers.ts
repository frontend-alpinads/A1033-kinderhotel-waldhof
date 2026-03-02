import { OfferData } from "../shared-types";

// Template offers - replace with actual hotel offers
export const offersData: OfferData[] = [
  {
    title: {
      de: "Frühlingsspezial 5=4",
      en: "Spring Special 5=4",
      it: "Speciale Primavera 5=4",
    },
    validityPeriods: [{ from: "01.04.2026", to: "30.05.2026" }],
    nights: 5,
    minNights: 5,
    price: 400,
    description: {
      de: "Gönnen Sie sich mehr Zeit für Erholung und Naturgenuss. Bei einem Aufenthalt von fünf Nächten zahlen Sie nur vier.",
      en: "Treat yourself to more time for relaxation and enjoying nature. Stay for five nights and pay for only four.",
      it: "Concedetevi più tempo per rilassarvi e godervi la natura. Con un soggiorno di cinque notti pagate solo quattro.",
    },
    features: {
      de: ["Wandern", "Wellness", "Frühstück"],
      en: ["Hiking", "Wellness", "Breakfast"],
      it: ["Escursioni", "Benessere", "Colazione"],
    },
    imageSrc: "/placeholder.svg",
    inclusions: {
      de: [
        "5 Übernachtungen zum Preis von 4",
        "Tägliches Frühstück",
        "Nutzung des Wellnessbereichs",
        "Kostenloser Parkplatz",
      ],
      en: [
        "5 nights for the price of 4",
        "Daily breakfast",
        "Use of wellness area",
        "Free parking",
      ],
      it: [
        "5 pernottamenti al prezzo di 4",
        "Colazione giornaliera",
        "Uso dell'area wellness",
        "Parcheggio gratuito",
      ],
    },
  },
  {
    title: {
      de: "Sommerwoche 7=6",
      en: "Summer Week 7=6",
      it: "Settimana Estiva 7=6",
    },
    validityPeriods: [
      { from: "01.06.2026", to: "31.08.2026" },
    ],
    nights: 7,
    minNights: 7,
    price: 600,
    description: {
      de: "Erleben Sie einen unvergesslichen Sommerurlaub in den Dolomiten. Sieben Nächte buchen, nur sechs bezahlen.",
      en: "Experience an unforgettable summer holiday in the Dolomites. Book seven nights, pay for only six.",
      it: "Vivete un'indimenticabile vacanza estiva nelle Dolomiti. Prenotate sette notti, pagate solo sei.",
    },
    features: {
      de: ["Bergerlebnis", "Wellness", "Halbpension"],
      en: ["Mountain experience", "Wellness", "Half board"],
      it: ["Esperienza montana", "Benessere", "Mezza pensione"],
    },
    imageSrc: "/placeholder.svg",
    inclusions: {
      de: [
        "7 Übernachtungen zum Preis von 6",
        "Halbpension",
        "Nutzung des Wellnessbereichs",
        "Geführte Wanderung",
        "Kostenloser Parkplatz",
      ],
      en: [
        "7 nights for the price of 6",
        "Half board",
        "Use of wellness area",
        "Guided hike",
        "Free parking",
      ],
      it: [
        "7 pernottamenti al prezzo di 6",
        "Mezza pensione",
        "Uso dell'area wellness",
        "Escursione guidata",
        "Parcheggio gratuito",
      ],
    },
  },
  {
    title: {
      de: "Herbstgenuss 4=3",
      en: "Autumn Delight 4=3",
      it: "Piacere d'Autunno 4=3",
    },
    validityPeriods: [{ from: "01.10.2026", to: "15.11.2026" }],
    nights: 4,
    minNights: 4,
    price: 300,
    description: {
      de: "Erleben Sie die goldene Jahreszeit in den Bergen. Vier Nächte buchen, nur drei bezahlen.",
      en: "Experience the golden season in the mountains. Book four nights, pay for only three.",
      it: "Vivete la stagione dorata in montagna. Prenotate quattro notti, pagate solo tre.",
    },
    features: {
      de: ["Herbsturlaub", "Wellness", "Kulinarik"],
      en: ["Autumn holiday", "Wellness", "Culinary"],
      it: ["Vacanza autunnale", "Benessere", "Culinaria"],
    },
    imageSrc: "/placeholder.svg",
    inclusions: {
      de: [
        "4 Übernachtungen zum Preis von 3",
        "Tägliches Frühstück",
        "Nutzung des Wellnessbereichs",
        "Kostenloser Parkplatz",
      ],
      en: [
        "4 nights for the price of 3",
        "Daily breakfast",
        "Use of wellness area",
        "Free parking",
      ],
      it: [
        "4 pernottamenti al prezzo di 3",
        "Colazione giornaliera",
        "Uso dell'area wellness",
        "Parcheggio gratuito",
      ],
    },
  },
];

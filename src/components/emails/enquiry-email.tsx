import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { hotelProfile } from "@/hotel-config";

interface EnquiryEmailProps {
  roomType: "room-only" | "room-with-offer";
  salutation: "herr" | "frau";
  firstName?: string;
  lastName?: string;
  fullName?: string;
  phonePrefix?: string;
  phoneNumber?: string;
  language?: string;
  country?: string;
  email: string;
  dates: string;
  alternativeDates?: string;
  dateFlexibility?: 0 | 1 | 2 | 3 | 7 | 14;
  offer?: string;
  room?: string;
  guests: string;
  message?: string;
  newsletter: boolean;
  privacyAccepted: boolean;
  roomOccupancies?: Array<{
    roomName?: string;
    adults: number;
    children: number;
    childrenAges?: number[];
  }>;
}

export const EnquiryEmail = ({
  roomType,
  salutation,
  firstName,
  lastName,
  fullName,
  phonePrefix,
  phoneNumber,
  language,
  country,
  email,
  dates,
  alternativeDates,
  dateFlexibility,
  offer,
  room,
  guests,
  message,
  newsletter,
  privacyAccepted,
  roomOccupancies,
}: EnquiryEmailProps) => {
  const displayFullName =
    [firstName, lastName].filter(Boolean).join(" ") || fullName;
  const customerName = displayFullName || "Gast";

  return (
    <Html lang={"de"}>
      <Head />
      <Preview>Neue Anfrage von {customerName} - {hotelProfile.hotelName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={h1}>Neue Anfrage - {hotelProfile.hotelName}</Heading>
          </Section>

          <Section style={section}>
            <Text style={label}>Art der Anfrage:</Text>
            <Text style={value}>
              {roomType === "room-only" ? "Nur Zimmer" : "Zimmer mit Angebot"}
            </Text>
          </Section>

          <Section style={section}>
            <Text style={label}>Anrede:</Text>
            <Text style={value}>{salutation === "herr" ? "Herr" : "Frau"}</Text>
          </Section>

          {firstName && (
            <Section style={section}>
              <Text style={label}>Vorname:</Text>
              <Text style={value}>{firstName}</Text>
            </Section>
          )}

          {lastName && (
            <Section style={section}>
              <Text style={label}>Nachname:</Text>
              <Text style={value}>{lastName}</Text>
            </Section>
          )}

          {!firstName && !lastName && fullName && (
            <Section style={section}>
              <Text style={label}>Name:</Text>
              <Text style={value}>{fullName}</Text>
            </Section>
          )}

          {phoneNumber && (
            <Section style={section}>
              <Text style={label}>Telefon:</Text>
              <Text style={value}>
                {`${phonePrefix ? phonePrefix + " " : ""}${phoneNumber}`}
              </Text>
            </Section>
          )}

          {language && (
            <Section style={section}>
              <Text style={label}>Sprache:</Text>
              <Text style={value}>{language}</Text>
            </Section>
          )}

          {country && (
            <Section style={section}>
              <Text style={label}>Land:</Text>
              <Text style={value}>{country}</Text>
            </Section>
          )}

          <Section style={section}>
            <Text style={label}>E-Mail:</Text>
            <Text style={value}>{email}</Text>
          </Section>

          <Section style={section}>
            <Text style={label}>Anreise & Abreise:</Text>
            <Text style={value}>{dates}</Text>
          </Section>

          {alternativeDates && (
            <Section style={section}>
              <Text style={label}>Alternativtermin:</Text>
              <Text style={value}>{alternativeDates}</Text>
            </Section>
          )}

          {offer && roomType === "room-with-offer" && (
            <Section style={section}>
              <Text style={label}>Gewähltes Angebot:</Text>
              <Text style={value}>{offer}</Text>
            </Section>
          )}

          {/* Room occupancy - show detailed info if available */}
          {roomOccupancies && roomOccupancies.length > 0 ? (
            <Section style={section}>
              <Text style={label}>Zimmerbelegung & Kinderalter:</Text>
              {roomOccupancies.map((occ, idx) => {
                const hasChildren = occ.children > 0;
                const agesText =
                  hasChildren && occ.childrenAges && occ.childrenAges.length > 0
                    ? ` (Alter: ${occ.childrenAges.join(", ")})`
                    : "";
                const roomPrefix = occ.roomName
                  ? `${occ.roomName}: `
                  : "Kein Zimmer ausgewählt: ";
                return (
                  <Text style={value} key={idx}>
                    {roomPrefix}
                    {occ.adults} Erwachsene
                    {hasChildren ? `, ${occ.children} Kinder` : ""}
                    {agesText}
                  </Text>
                );
              })}
            </Section>
          ) : (
            /* Show old room field only if no roomOccupancies */
            room && (
              <Section style={section}>
                <Text style={label}>Zimmer:</Text>
                <Text style={value}>{room}</Text>
              </Section>
            )
          )}

          <Section style={section}>
            <Text style={label}>Gäste:</Text>
            <Text style={value}>{guests}</Text>
          </Section>

          {message && (
            <Section style={section}>
              <Text style={label}>Nachricht:</Text>
              <Text style={value}>{message}</Text>
            </Section>
          )}

          {dateFlexibility !== undefined && dateFlexibility > 0 && (
            <Section style={section}>
              <Text style={label}>Terminflexibilität:</Text>
              <Text style={value}>
                ± {dateFlexibility} {dateFlexibility === 1 ? "Tag" : "Tage"}
              </Text>
            </Section>
          )}

          <Section style={section}>
            <Text style={label}>Newsletter:</Text>
            <Text style={value}>{newsletter ? "Ja" : "Nein"}</Text>
          </Section>

          <Section style={section}>
            <Text style={label}>Datenschutz akzeptiert:</Text>
            <Text style={value}>{privacyAccepted ? "Ja" : "Nein"}</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: "#faf7f5", // --muted
  fontFamily: "Arial, sans-serif",
};

const container = {
  margin: "0 auto",
  padding: "0",
  maxWidth: "600px",
  backgroundColor: "#ffffff", // --background
};

const header = {
  backgroundColor: "#ad826f", // --primary
  padding: "32px 20px",
  margin: "0",
};

const h1 = {
  color: "#ffffff", // --primary-foreground
  fontSize: "26px",
  fontWeight: "600",
  lineHeight: "32px",
  margin: "0",
  textAlign: "center" as const,
};

const section = {
  margin: "0",
  padding: "20px",
  borderBottom: "1px solid #5d453426", // --border
};

const label = {
  color: "#252626", // --secondary
  fontSize: "13px",
  fontWeight: "600",
  margin: "0 0 6px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
};

const value = {
  color: "#3b2b20cc", // --muted-foreground
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0",
};

export default EnquiryEmail;

import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { hotelProfile, TECHNICAL_CONFIG } from "@/hotel-config";

interface ConfirmationEmailProps {
  salutation?: "herr" | "frau";
  firstName?: string;
  lastName?: string;
  fullName?: string;
  email?: string;
  dates?: string;
  dateFlexibility?: 0 | 1 | 2 | 3 | 7 | 14;
  offer?: string;
  room?: string;
  guests?: string;
  message?: string;
  language?: string;
  hotelName?: string;
  requestType?: "room-only" | "room-with-offer";
  roomOccupancies?: Array<{
    roomName?: string;
    adults: number;
    children: number;
    childrenAges?: number[];
  }>;
}

// Translations for all 3 locales
const getTranslations = (hotelName: string) => ({
  de: {
    preview: `Vielen Dank für Ihre Anfrage - ${hotelName}`,
    heading: "Vielen Dank für Ihre Anfrage",
    greetingMale: "Sehr geehrter Herr",
    greetingFemale: "Sehr geehrte Frau",
    introText: `vielen Dank, dass Sie sich für ${hotelName} interessieren. Wir haben Ihre Anfrage erhalten und freuen uns, Ihnen bald ein passendes Angebot zusenden zu dürfen.`,
    infoBoxLine1: "Wir antworten in der Regel innerhalb von 24 Stunden.",
    infoBoxLine2: "Bitte prüfen Sie auch Ihren Spam-Ordner.",
    summaryHeader: "Ihre Anfrage im Überblick:",
    labelRequestType: "ART DER ANFRAGE",
    labelTravelDates: "ANREISE & ABREISE",
    labelRoom: "ZIMMER",
    labelRoomOccupancy: "ZIMMERBELEGUNG",
    labelGuests: "GÄSTE",
    labelMessage: "IHRE NACHRICHT",
    requestTypeRoomOnly: "Nur Zimmer",
    requestTypeRoomWithOffer: "Zimmer mit Angebot",
    noRoomSelected: "Kein Zimmer ausgewählt",
    adults: "Erwachsene",
    children: "Kinder",
    childAges: "Alter",
    contactTitle: "Kontakt",
    addressTitle: "Adresse",
    footerDisclaimer:
      "Dies ist eine automatische Nachricht. Bitte antworten Sie nicht direkt auf diese E-Mail. Bei Fragen können Sie uns gerne kontaktieren.",
  },
  en: {
    preview: `Thank you for your inquiry - ${hotelName}`,
    heading: "Thank you for your inquiry",
    greetingMale: "Dear Mr.",
    greetingFemale: "Dear Ms.",
    introText: `thank you for your interest in ${hotelName}. We have received your inquiry and look forward to sending you a suitable offer soon.`,
    infoBoxLine1: "We usually respond within 24 hours.",
    infoBoxLine2: "Please also check your spam folder.",
    summaryHeader: "Your request at a glance:",
    labelRequestType: "TYPE OF REQUEST",
    labelTravelDates: "ARRIVAL & DEPARTURE",
    labelRoom: "ROOM",
    labelRoomOccupancy: "ROOM OCCUPANCY",
    labelGuests: "GUESTS",
    labelMessage: "YOUR MESSAGE",
    requestTypeRoomOnly: "Room only",
    requestTypeRoomWithOffer: "Room with offer",
    noRoomSelected: "No room selected",
    adults: "Adults",
    children: "Children",
    childAges: "Ages",
    contactTitle: "Contact",
    addressTitle: "Address",
    footerDisclaimer:
      "This is an automated message. Please do not reply directly to this email. If you have any questions, feel free to contact us.",
  },
  it: {
    preview: `Grazie per la tua richiesta - ${hotelName}`,
    heading: "Grazie per la tua richiesta",
    greetingMale: "Caro",
    greetingFemale: "Cara",
    introText: `grazie per il tuo interesse per ${hotelName}. Abbiamo ricevuto la tua richiesta e saremo lieti di inviarti presto un'offerta adatta.`,
    infoBoxLine1: "Di solito rispondiamo entro 24 ore.",
    infoBoxLine2: "Controlla anche la tua cartella spam.",
    summaryHeader: "La tua richiesta in sintesi:",
    labelRequestType: "TIPO DI RICHIESTA",
    labelTravelDates: "ARRIVO & PARTENZA",
    labelRoom: "CAMERA",
    labelRoomOccupancy: "OCCUPAZIONE CAMERA",
    labelGuests: "OSPITI",
    labelMessage: "IL TUO MESSAGGIO",
    requestTypeRoomOnly: "Solo camera",
    requestTypeRoomWithOffer: "Camera con offerta",
    noRoomSelected: "Nessuna camera selezionata",
    adults: "Adulti",
    children: "Bambini",
    childAges: "Età",
    contactTitle: "Contatto",
    addressTitle: "Indirizzo",
    footerDisclaimer:
      "Questo è un messaggio automatico. Si prega di non rispondere direttamente a questa e-mail. Per qualsiasi domanda, non esitate a contattarci.",
  },
});

type Language = "de" | "en" | "it";

const BASE_URL = TECHNICAL_CONFIG.email.assetsBaseUrl;

export const ConfirmationEmail = ({
  salutation = "herr",
  firstName = "-",
  lastName = "-",
  fullName = "-",
  email = "-",
  dates = "-",
  offer = "-",
  room = "-",
  guests = "-",
  message = "-",
  language = "de",
  hotelName = hotelProfile.hotelName,
  requestType = "room-only",
  roomOccupancies,
}: ConfirmationEmailProps) => {
  const lang = (language?.toLowerCase() || "de") as Language;
  const translations = getTranslations(hotelName);
  const t = translations[lang] || translations.de;

  const displayName = firstName || fullName || lastName || "";

  return (
    <Html lang={lang}>
      <Head />
      <Preview>{t.preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <table
              width="100%"
              cellPadding="0"
              cellSpacing="0"
              style={{ borderCollapse: "collapse" }}
            >
              <tr>
                <td style={{ width: "100px", verticalAlign: "middle" }}>
                  <Img
                    src={BASE_URL + hotelProfile.logo.src}
                    // width="80"
                    // height="58"
                    alt={hotelName}
                    style={{ display: "block", height: "60px" }}
                  />
                </td>
                <td style={{ verticalAlign: "middle", textAlign: "right" }}>
                  <Heading style={h1}>{t.heading}</Heading>
                </td>
              </tr>
            </table>
          </Section>

          {/* Content */}
          <Section style={content}>
            {/* Greeting */}
            <Text style={greeting}>
              {salutation === "frau" ? t.greetingFemale : t.greetingMale}{" "}
              {displayName},
            </Text>

            {/* Intro text */}
            <Text style={paragraph}>{t.introText}</Text>

            {/* Info box */}
            <Section style={infoBox}>
              <Text style={infoBoxText}>{t.infoBoxLine1}</Text>
              <Text style={infoBoxText}>{t.infoBoxLine2}</Text>
            </Section>

            {/* Summary header */}
            <Text style={summaryHeader}>{t.summaryHeader}</Text>

            {/* Request type */}
            {requestType && (
              <Section style={summarySection}>
                <Text style={summaryLabel}>{t.labelRequestType}</Text>
                <Text style={summaryValue}>
                  {requestType === "room-only"
                    ? t.requestTypeRoomOnly
                    : t.requestTypeRoomWithOffer}
                  {offer && requestType === "room-with-offer" && ` – ${offer}`}
                </Text>
              </Section>
            )}

            {/* Travel dates */}
            <Section style={summarySection}>
              <Text style={summaryLabel}>{t.labelTravelDates}</Text>
              <Text style={summaryValue}>{dates}</Text>
            </Section>

            {/* Room occupancy - show this if we have detailed room occupancy data */}
            {roomOccupancies && roomOccupancies.length > 0 ? (
              <Section style={summarySection}>
                <Text style={summaryLabel}>{t.labelRoomOccupancy}</Text>
                {roomOccupancies.map((occupancy, index) => (
                  <Text key={index} style={summaryValue}>
                    {occupancy.roomName
                      ? `${occupancy.roomName}: `
                      : `${t.noRoomSelected}: `}
                    {occupancy.adults} {t.adults}
                    {occupancy.children > 0 && (
                      <>
                        , {occupancy.children} {t.children}
                        {occupancy.childrenAges &&
                          occupancy.childrenAges.length > 0 && (
                            <>
                              {" "}
                              ({t.childAges}:{" "}
                              {occupancy.childrenAges.join(", ")})
                            </>
                          )}
                      </>
                    )}
                  </Text>
                ))}
              </Section>
            ) : (
              /* Room - show old format only if no roomOccupancies */
              room && (
                <Section style={summarySection}>
                  <Text style={summaryLabel}>{t.labelRoom}</Text>
                  <Text style={summaryValue}>{room}</Text>
                </Section>
              )
            )}

            {/* Guests */}
            {guests && (
              <Section style={summarySection}>
                <Text style={summaryLabel}>{t.labelGuests}</Text>
                <Text style={summaryValue}>{guests}</Text>
              </Section>
            )}

            {/* Message */}
            {message && (
              <Section style={summarySection}>
                <Text style={summaryLabel}>{t.labelMessage}</Text>
                <Text style={summaryValue}>{message}</Text>
              </Section>
            )}
          </Section>

          {/* Footer */}
          <Section style={footer}>
            {/* Contact box */}
            <Section style={contactBox}>
              {/* Centered logo */}
              <Img
                src={BASE_URL + hotelProfile.logo.src}
                // width="80"
                // height="58"
                alt={hotelName}
                style={{
                  display: "block",
                  margin: "0 auto 24px",
                  height: "60px",
                }}
              />

              {/* Contact label */}
              <Text style={sectionLabel}>{t.contactTitle}:</Text>

              {/* Phone and Email boxes side by side */}
              <table
                width="100%"
                cellPadding="0"
                cellSpacing="0"
                style={{ borderCollapse: "collapse" }}
              >
                <tr>
                  <td style={{ width: "50%", paddingRight: "8px" }}>
                    <Link
                      href={hotelProfile.contact.phone.href}
                      style={contactButton}
                    >
                      <Img
                        src={`${BASE_URL}/icon/call.svg`}
                        width="20"
                        height="20"
                        alt="Phone"
                        style={contactButtonIcon}
                      />
                      <span style={contactButtonText}>
                        {hotelProfile.contact.phone.display}
                      </span>
                    </Link>
                  </td>
                  <td style={{ width: "50%", paddingLeft: "8px" }}>
                    <Link
                      href={`mailto:${hotelProfile.contact.email}`}
                      style={contactButton}
                    >
                      <Img
                        src={`${BASE_URL}/icon/email.svg`}
                        width="20"
                        height="20"
                        alt="Email"
                        style={contactButtonIcon}
                      />
                      <span style={contactButtonText}>
                        {hotelProfile.contact.email}
                      </span>
                    </Link>
                  </td>
                </tr>
              </table>

              {/* Address label */}
              <Text style={sectionLabel}>{t.addressTitle}:</Text>

              {/* Address text */}
              <Text style={addressText}>
                {hotelProfile.address.line1}
                <br />
                {hotelProfile.address.line2}
              </Text>
            </Section>

            {/* Disclaimer */}
            <Section style={disclaimerSection}>
              <Text style={disclaimer}>{t.footerDisclaimer}</Text>
            </Section>

            {/* Social icons */}
            <Section style={socialSection}>
              <table
                cellPadding="0"
                cellSpacing="0"
                style={{
                  borderCollapse: "collapse",
                  margin: "0 auto",
                }}
              >
                <tr>
                  {hotelProfile.social.youtube && (
                    <td style={{ padding: "0 8px" }}>
                      <Link
                        href={hotelProfile.social.youtube}
                        style={socialIconLink}
                      >
                        <Img
                          src={`${BASE_URL}/icon/youtube.svg`}
                          width="16"
                          height="16"
                          alt="YouTube"
                          style={socialIconImg}
                        />
                      </Link>
                    </td>
                  )}
                  {hotelProfile.social.instagram && (
                    <td style={{ padding: "0 8px" }}>
                      <Link
                        href={hotelProfile.social.instagram}
                        style={socialIconLink}
                      >
                        <Img
                          src={`${BASE_URL}/icon/instagram.svg`}
                          width="16"
                          height="16"
                          alt="Instagram"
                          style={socialIconImg}
                        />
                      </Link>
                    </td>
                  )}
                  {hotelProfile.social.facebook && (
                    <td style={{ padding: "0 8px" }}>
                      <Link
                        href={hotelProfile.social.facebook}
                        style={socialIconLink}
                      >
                        <Img
                          src={`${BASE_URL}/icon/facebook.svg`}
                          width="16"
                          height="16"
                          alt="Facebook"
                          style={socialIconImg}
                        />
                      </Link>
                    </td>
                  )}
                </tr>
              </table>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Design system colors from globals.css
const colors = {
  background: "#ffffff", // --background
  foreground: "#3b2b20", // --foreground
  border: "#5d453426", // --border
  muted: "#faf7f5", // --muted
  mutedForeground: "#3b2b20cc", // --muted-foreground
  primary: "#ad826f", // --primary
  primaryForeground: "#ffffff", // --primary-foreground
  secondary: "#252626", // --secondary
  card: "#ffffff", // --card
  cardForeground: "#3b2b20", // --card-foreground
};

// Styling
const main = {
  backgroundColor: colors.background,
  fontFamily: "Montserrat, Arial, sans-serif",
};

const container = {
  margin: "0 auto",
  maxWidth: "600px",
  backgroundColor: colors.background,
  padding: "20px 12px",
};

const header = {
  backgroundColor: colors.muted,
  padding: "24px 32px",
  marginBottom: "10px",
};

const h1 = {
  color: colors.foreground,
  fontSize: "20px",
  fontWeight: "600",
  lineHeight: "28px",
  margin: "0",
  textAlign: "right" as const,
};

const content = {
  padding: "20px 20px 0",
  backgroundColor: colors.card,
};

const greeting = {
  color: colors.cardForeground,
  fontSize: "18px",
  fontWeight: "600",
  lineHeight: "26px",
  margin: "0 0 16px",
};

const paragraph = {
  color: colors.foreground,
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0 0 24px",
};

const infoBox = {
  backgroundColor: colors.muted,
  padding: "20px 24px",
  margin: "0 0 32px",
};

const infoBoxText = {
  color: colors.foreground,
  fontSize: "14px",
  lineHeight: "22px",
  margin: "0 0 4px",
};

const summaryHeader = {
  color: colors.cardForeground,
  fontSize: "18px",
  fontWeight: "600",
  lineHeight: "26px",
  margin: "0 0 24px",
};

const summarySection = {
  borderBottom: `1px solid ${colors.border}`,
  paddingBottom: "16px",
  marginBottom: "16px",
};

const summaryLabel = {
  color: colors.mutedForeground,
  fontSize: "11px",
  fontWeight: "600",
  lineHeight: "16px",
  margin: "0 0 4px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
};

const summaryValue = {
  color: colors.cardForeground,
  fontSize: "15px",
  lineHeight: "22px",
  margin: "0",
};

const footer = {
  backgroundColor: colors.primaryForeground,
  padding: "20px",
};

const contactBox = {
  backgroundColor: colors.background,
  padding: "32px 24px",
  marginBottom: "24px",
  textAlign: "center" as const,
};

const sectionLabel = {
  color: colors.foreground,
  fontSize: "16px",
  fontWeight: "600",
  lineHeight: "24px",
  margin: "24px 0 16px",
  textAlign: "center" as const,
};

const contactButton = {
  display: "block",
  backgroundColor: colors.card,
  border: `1px solid ${colors.border}`,
  padding: "12px 8px",
  color: colors.foreground,
  fontSize: "14px",
  textDecoration: "none",
  textAlign: "center" as const,
};

const contactButtonIcon = {
  display: "inline",
  marginRight: "8px",
  verticalAlign: "middle",
};

const contactButtonText = {
  display: "inline-block",
  fontSize: "14px",
};

const addressText = {
  color: colors.foreground,
  fontSize: "14px",
  lineHeight: "22px",
  margin: "0",
  textAlign: "center" as const,
};

const disclaimerSection = {
  padding: "0 16px 24px",
};

const disclaimer = {
  color: colors.foreground,
  fontSize: "16px",
  lineHeight: "26px",
  margin: "0",
  textAlign: "center" as const,
};

const socialSection = {
  borderTop: `1px solid ${colors.border}`,
  paddingTop: "24px",
  textAlign: "center" as const,
};

const socialIconLink = {
  display: "inline-block",
  width: "32px",
  backgroundColor: colors.background,
  textDecoration: "none",
  verticalAlign: "middle",
};

const socialIconImg = {
  display: "block",
  margin: "8px",
};

export default ConfirmationEmail;

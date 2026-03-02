"use server";

import { after } from "next/server";
import { Resend } from "resend";
import { EnquiryEmail } from "@/components/emails/enquiry-email";
import { ConfirmationEmail } from "@/components/emails/confirmation-email";
import { pretty, render } from "@react-email/render";
import { getHotelProfile, getTechnicalConfig } from "@/hotel-config";

import { Offer, Room } from "@/shared-types";
import { createGuestRequest, GuestRequestInput } from "./quote-request-actions";

const toEmail = process.env.HOTEL_EMAIL as string;

// Form data type (matching the current form structure)
export interface EnquiryFormData {
  salutation: "herr" | "frau";
  offer: string;
  room: string;
  dates: string;
  datesIso?: { arrival: string; departure: string };
  alternativeDates?: string;
  alternativeDatesIso?: { arrival: string; departure: string };
  dateFlexibility?: 0 | 1 | 2 | 3 | 7 | 14;
  guests: string;
  firstName: string;
  lastName: string;
  phonePrefix: string;
  phoneNumber: string;
  language: string;
  country: string;
  email: string;
  message: string;
  newsletter: boolean;
  privacyAccepted: boolean;
  source: "google" | "meta" | undefined;
}

// Extended form data with selected objects
export interface ExtendedEnquiryFormData extends EnquiryFormData {
  selectedOffer?: Offer | null;
  selectedRoom?: {
    selectedRooms: Array<{
      id: string;
      room: Room;
      guests: number;
      children: number;
      childAges: Array<{ age: number }>;
      boardOption: "with-breakfast" | "half-board";
    }>;
  } | null;
  guestSelection?: {
    adults: number;
    children: number;
    childAges: number[];
  };
}

// Helper function to build room occupancies with guestSelection fallback
function buildRoomOccupancies(formData: ExtendedEnquiryFormData) {
  // Use selectedRoom if available
  if (formData.selectedRoom?.selectedRooms?.length) {
    return formData.selectedRoom.selectedRooms.map((sel) => {
      const isPlaceholder = sel.room.id === "placeholder";
      return {
        roomName: !isPlaceholder ? sel.room?.name : undefined,
        adults: sel.guests,
        children: sel.children,
        childrenAges: sel.childAges?.map((c) => c.age) || [],
      };
    });
  }

  // Fallback to guestSelection
  if (formData.guestSelection) {
    return [
      {
        roomName: undefined,
        adults: formData.guestSelection.adults,
        children: formData.guestSelection.children,
        childrenAges: formData.guestSelection.childAges || [],
      },
    ];
  }

  return [];
}

// Helper function to parse German date format to ISO
function parseGermanDate(dateStr: string): string | null {
  const parts = dateStr.trim().split(".");
  if (parts.length !== 3) return null;
  const [day, month, year] = parts;

  const isoDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;

  // Validate the date is actually valid
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return null;

  // Verify the date components match (catches invalid dates like Feb 30)
  if (
    date.getFullYear() !== parseInt(year) ||
    date.getMonth() !== parseInt(month) - 1 ||
    date.getDate() !== parseInt(day)
  ) {
    return null;
  }

  return isoDate;
}

// Helper function to transform form data to Quote Request API payload
function transformToGuestRequestPayload(
  formData: ExtendedEnquiryFormData,
): GuestRequestInput | null {
  try {
    // Get hotel code from environment
    const hotelCode = process.env.QUOTE_REQUEST_HOTEL_CODE;
    if (!hotelCode) {
      console.warn(
        "QUOTE_REQUEST_HOTEL_CODE not configured, skipping Quote Request",
      );
      return null;
    }

    // Use ISO dates directly if available (preferred), fallback to parsing German format
    let checkInDate: string | null;
    let checkOutDate: string | null;

    const hotelProfile = getHotelProfile();

    if (formData.datesIso?.arrival && formData.datesIso?.departure) {
      // Use ISO dates directly - no parsing needed, no timezone issues
      checkInDate = formData.datesIso.arrival;
      checkOutDate = formData.datesIso.departure;
    } else {
      // Fallback: parse German format "DD.MM.YYYY - DD.MM.YYYY" (backward compatibility)
      const dateRange = formData.dates.split(" - ");
      if (dateRange.length !== 2) {
        console.warn("Invalid date format, skipping Quote Request");
        return null;
      }

      checkInDate = parseGermanDate(dateRange[0]);
      checkOutDate = parseGermanDate(dateRange[1]);
    }

    if (!checkInDate || !checkOutDate) {
      console.warn("Failed to parse dates, skipping Quote Request");
      return null;
    }

    // Validate mandatory fields
    if (!formData.lastName || !formData.email) {
      console.warn(
        "Missing required guest information, skipping Quote Request",
      );
      return null;
    }

    // Build phone number
    const guestPhone =
      formData.phonePrefix && formData.phoneNumber
        ? `${formData.phonePrefix}${formData.phoneNumber}`
        : undefined;

    // Map salutation to gender
    const guestGender =
      formData.salutation === "herr"
        ? "Male"
        : formData.salutation === "frau"
          ? "Female"
          : undefined;

    // Build rooms array
    const rooms =
      formData.selectedRoom?.selectedRooms &&
      formData.selectedRoom.selectedRooms.length > 0
        ? formData.selectedRoom.selectedRooms.map((sel) => {
            const isPlaceholder = sel.room.id === "placeholder";
            return {
              adultCount: sel.guests || 2,
              childAges:
                sel.childAges && sel.childAges.length > 0
                  ? JSON.stringify(sel.childAges.map((c) => c.age))
                  : undefined,
              // Only include room type info if not a placeholder
              roomType: !isPlaceholder ? sel.room.name || undefined : undefined,
              roomTypeCode: !isPlaceholder
                ? sel.room.code || sel.room.id || undefined
                : undefined,
            };
          })
        : formData.guestSelection
          ? [
              {
                adultCount: formData.guestSelection.adults,
                childAges:
                  formData.guestSelection.childAges.length > 0
                    ? JSON.stringify(formData.guestSelection.childAges)
                    : undefined,
              },
            ]
          : [{ adultCount: 2 }]; // Use guestSelection if available, otherwise default to 2 adults

    // Build base payload
    const payload: GuestRequestInput = {
      hotelCode,
      hotelName: hotelProfile.hotelName,
      checkInDate,
      checkOutDate,
      guestFirstName: formData.firstName || undefined,
      guestLastName: formData.lastName,
      guestEmail: formData.email,
      guestPhone,
      guestLanguage: formData.language || "de",
      guestGender,
      guestCountryCode: formData.country || undefined,
      customerComment: formData.message ? `${formData.message}` : undefined,
      newsletterOptIn: formData.newsletter || false,
      externalSource: "Alpin Ads",
      externalContext: "Landing Page",
      rooms,
    };

    return payload;
  } catch (error: unknown) {
    console.error("Error transforming to Guest Request payload:", error);
    return null;
  }
}

// Helper function to send email to Mail Hook API (non-blocking backup/logging)
async function sendToMailHook(
  customerEmail: string,
  customerName: string,
  hotelEmail: string,
  subject: string,
  html: string,
  salutation?: string,
  land?: string,
  language?: string,
  newsletter?: boolean,
  source?: "google" | "meta",
): Promise<{ success: boolean; data?: unknown; error?: string }> {
  // 1. Check if API key exists (return early if missing)
  if (!process.env.MAIL_HOOK_KEY) {
    console.warn(
      "MAIL_HOOK_KEY not configured, skipping Mail Hook (graceful degradation)",
    );
    return { success: false, error: "MAIL_HOOK_KEY not configured" };
  }

  try {
    // 2. Wrap fetch in try-catch for network errors
    const response = await fetch("https://mail-hook.vercel.app/api/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.MAIL_HOOK_KEY}`,
      },
      body: JSON.stringify({
        customerEmail,
        customerName,
        hotelEmail,
        subject,
        html,
        sentAt: new Date().toISOString(),
        salutation,
        land,
        language,
        newsletter,
        source,
      }),
    });

    // 3. Validate response content-type before parsing JSON
    const contentType = response.headers.get("content-type");
    let data: unknown;

    // 4. Handle both JSON and non-JSON responses
    if (contentType && contentType.includes("application/json")) {
      try {
        data = await response.json();
      } catch (parseError) {
        console.error("Mail Hook JSON parse error:", parseError);
        return {
          success: false,
          error: "Invalid JSON response from Mail Hook API",
        };
      }
    } else {
      // Non-JSON response (e.g., HTML error page)
      const textResponse = await response.text();
      console.error("Mail Hook non-JSON response:", textResponse.slice(0, 200));
      return {
        success: false,
        error: `Non-JSON response from Mail Hook API (status: ${response.status})`,
      };
    }

    // Handle non-2xx HTTP status codes
    if (!response.ok) {
      // Type-safe error extraction from API responses
      const errorMessage =
        typeof data === "object" &&
        data !== null &&
        "error" in data &&
        typeof data.error === "string"
          ? data.error
          : `HTTP ${response.status}`;

      console.error("Mail Hook API Error:", errorMessage, data);
      return {
        success: false,
        error: errorMessage,
        data,
      };
    }

    // 5. Return structured success object
    console.log("Mail Hook API Success");
    return { success: true, data };
  } catch (error: unknown) {
    // 6. Network errors, timeouts, and other fetch failures
    const errorMessage =
      error instanceof Error ? error.message : "Unknown network error";
    console.error("Mail Hook network error:", errorMessage);
    return {
      success: false,
      error: `Network error: ${errorMessage}`,
    };
  }
}

// Main server action function
export async function submitEnquiry(formData: ExtendedEnquiryFormData) {
  try {
    // Step 1: Validate environment variables
    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured");
      return { success: false, error: "Email service not configured" };
    }

    // Log warning (not error) if Mail Hook key is missing - allows graceful degradation
    if (!process.env.MAIL_HOOK_KEY) {
      console.warn(
        "MAIL_HOOK_KEY not configured - Mail Hook backup/logging will be skipped",
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const computedFullName = [formData.firstName, formData.lastName]
      .filter(Boolean)
      .join(" ");
    const customerName = computedFullName || "Gast";

    // Get hotel configuration
    const hotelProfile = getHotelProfile();
    const technicalConfig = getTechnicalConfig();
    const hotelName = hotelProfile.hotelName;

    // Determine email source and subject based on type
    const config = {
      from: `${hotelName} <${technicalConfig.email.transactional}>`,
      subject: `Neue Anfrage von ${customerName} - ${hotelName}`,
    };

    // Step 2: Prepare email props (once) - Create shared emailProps object to avoid duplication
    // Derive roomType from selectedOffer presence
    const roomType: "room-only" | "room-with-offer" = formData.selectedOffer
      ? "room-with-offer"
      : "room-only";
    const emailProps = {
      roomType,
      salutation: formData.salutation,
      firstName: formData.firstName,
      lastName: formData.lastName,
      fullName: computedFullName,
      phonePrefix: formData.phonePrefix,
      phoneNumber: formData.phoneNumber,
      language: formData.language,
      country: formData.country,
      email: formData.email,
      dates: formData.dates,
      alternativeDates: formData.alternativeDates,
      dateFlexibility: formData.dateFlexibility,
      offer: formData.offer,
      room: formData.room,
      guests: formData.guests,
      message: formData.message,
      newsletter: formData.newsletter,
      privacyAccepted: formData.privacyAccepted,
      roomOccupancies: buildRoomOccupancies(formData),
    };

    // Step 3: Render email HTML (once) using @react-email/render for Mail Hook
    const emailHtml = await pretty(await render(EnquiryEmail(emailProps)));

    // Step 4: Prepare all props upfront for full parallelization
    const hotelEmail = hotelProfile.contact.email;

    const languageLower = formData.language?.toLowerCase() || "de";
    const confirmationSubjects: Record<string, string> = {
      de: `Bestätigung Ihrer Anfrage - ${hotelName}`,
      en: `Confirmation of your inquiry - ${hotelName}`,
      it: `Conferma della tua richiesta - ${hotelName}`,
    };

    const confirmationSubject =
      confirmationSubjects[languageLower] || confirmationSubjects.de;

    const confirmationProps = {
      salutation: formData.salutation,
      firstName: formData.firstName,
      lastName: formData.lastName,
      fullName: computedFullName,
      email: formData.email,
      dates: formData.dates,
      dateFlexibility: formData.dateFlexibility,
      offer: formData.offer,
      room: formData.room,
      guests: formData.guests,
      message: formData.message,
      language: formData.language,
      hotelName: hotelName,
      roomOccupancies: buildRoomOccupancies(formData),
    };

    // Prepare guest request payload
    const guestRequestPayload = transformToGuestRequestPayload(formData);

    // Schedule all email/API operations to run AFTER the response is sent
    // This makes the form submission feel instant
    after(async () => {
      const failures: string[] = [];

      console.log("Background: Starting email operations...");
      console.log("- Mail Hook API (backup/logging)");
      console.log(`- Main email from ${config.from} to ${toEmail}`);
      console.log(`- Confirmation email to ${formData.email}`);
      console.log("- Guest Request API");

      // Main enquiry email (critical)
      try {
        const result = await resend.emails.send({
          from: config.from,
          to: [toEmail],
          subject: config.subject,
          react: EnquiryEmail(emailProps),
        });
        if (result.error) {
          failures.push(`Main enquiry email: ${result.error.message}`);
          console.error("✗ Main email error:", result.error);
        } else {
          console.log("✓ Main email sent successfully");
        }
      } catch (e) {
        failures.push(`Main enquiry email: ${(e as Error).message}`);
        console.error("✗ Main email exception:", e);
      }

      // Confirmation email
      try {
        const result = await resend.emails.send({
          from: `${hotelName} <${hotelEmail}>`,
          to: [formData.email],
          replyTo: toEmail,
          subject: confirmationSubject,
          react: ConfirmationEmail(confirmationProps),
        });
        if (result.error) {
          failures.push(`Confirmation email: ${result.error.message}`);
          console.error("✗ Confirmation email error:", result.error);
        } else {
          console.log("✓ Confirmation email sent successfully");
        }
      } catch (e) {
        failures.push(`Confirmation email: ${(e as Error).message}`);
        console.error("✗ Confirmation email exception:", e);
      }

      // Guest request API
      if (guestRequestPayload) {
        try {
          const result = await createGuestRequest(guestRequestPayload);
          if (result && "success" in result && result.success) {
            console.log(
              "✓ Guest request created successfully:",
              result.enquiryGroupId,
              `(${result.count} room(s))`,
            );
          } else {
            const errorMsg =
              result && "error" in result ? result.error : "Unknown error";
            failures.push(`Guest request API: ${errorMsg}`);
            console.warn("✗ Guest request failed:", errorMsg);
          }
        } catch (e) {
          failures.push(`Guest request API: ${(e as Error).message}`);
          console.error("✗ Guest request exception:", e);
        }
      }

      // Mail Hook (non-critical backup)
      try {
        const result = await sendToMailHook(
          formData.email,
          customerName,
          toEmail,
          config.subject,
          emailHtml,
          formData.salutation,
          formData.country?.toUpperCase(),
          formData.language?.toUpperCase(),
          formData.newsletter,
          formData.source,
        );
        if (result.success) {
          console.log("✓ Mail Hook sent successfully");
        } else {
          failures.push(`Mail Hook: ${result.error || "Unknown error"}`);
          console.warn("✗ Mail Hook failed:", result.error);
        }
      } catch (e) {
        failures.push(`Mail Hook: ${(e as Error).message}`);
        console.error("✗ Mail Hook exception:", e);
      }

      // Send error notification if any failures occurred
      if (failures.length > 0) {
        console.log(
          `Background: ${failures.length} operation(s) failed, sending error notification...`,
        );
        try {
          await resend.emails.send({
            from: "Submission Error <submission-error@updates.alpinads.app>",
            to: ["fath@alpinads.com"],
            subject: `Background Job Failures - ${hotelName}`,
            text: `The following operations failed for submission from ${formData.email}:

${failures.join("\n")}

Guest: ${customerName}
Email: ${formData.email}
Dates: ${formData.dates}

Check Vercel logs for full error details.`,
          });
          console.log("✓ Error notification sent to fath@alpinads.com");
        } catch (notifyError) {
          console.error("✗ Failed to send error notification:", notifyError);
        }
      } else {
        console.log("Background: All operations completed successfully");
      }
    });

    // Return success immediately - don't wait for emails
    return {
      success: true,
      emailSent: true,
      confirmationEmailSent: true,
    };
  } catch (error) {
    console.error("Email sending error:", error);
    return {
      success: false,
      error: `Email sending failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

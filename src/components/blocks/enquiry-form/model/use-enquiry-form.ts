"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { track } from "@vercel/analytics/react";
import { triggerLeadEvent } from "@/utils/gtm";
import { Offer, Room } from "@/shared-types";
import {
  ExtendedEnquiryFormData,
  submitEnquiry,
} from "@/app/actions/email-submission";
import { getCountryFromPrefix } from "@/data/phone-codes";
import { useEnquiryFormTranslations } from "../i18n";
import { useLocale } from "@/lib/i18n/context";
import { THANK_YOU_SLUG_BY_LOCALE } from "@/lib/routes/registry";
import type {
  DateSelectionValue,
  EnquiryFormData,
  SelectedRoomData,
  SelectedRoomSelection,
  UseEnquiryFormParams,
} from "./types";
import { formatDateRangeDe, formatGuestText } from "./mappers";
import { getEnquiryFieldError, validateEnquiryForm } from "./validation";
import { autoMapGuestsToRooms } from "./room-capacity";
import { useAdSource } from "./use-ad-source";

export function useEnquiryForm({
  selectedDates,
  setSelectedDates,
  guestSelection,
  setGuestSelection,
  prefilledOffer,
  setPrefilledOffer,
  prefilledRoom,
  setPrefilledRoom,
  availableRooms,
}: UseEnquiryFormParams) {
  const router = useRouter();
  const t = useEnquiryFormTranslations();
  const locale = useLocale();

  const adSourceName = useAdSource();

  // Ref to skip redundant guest mapping when handleGuestSelect already handled it
  const skipNextGuestMappingRef = useRef(false);

  // State management
  const [salutation, setSalutation] = useState<"herr" | "frau">("herr");
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const defaultPrefix = "+49";
  const [formData, setFormData] = useState<EnquiryFormData>({
    offer: "",
    room: "",
    dates: "",
    alternativeDates: "",
    dateFlexibility: 0,
    guests: formatGuestText(2, 0, [], t),
    firstName: "",
    lastName: "",
    phonePrefix: defaultPrefix,
    phoneNumber: "",
    language: locale.toUpperCase(),
    country: getCountryFromPrefix(defaultPrefix) || "",
    // Common fields
    email: "",
    message: "",
    newsletter: false,
    privacyAccepted: false,
  });
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);

  // Derive roomType from selectedOffer - no need for separate state
  const roomType = selectedOffer ? "room-with-offer" : "room-only";

  const [selectedRoom, setSelectedRoom] =
    useState<SelectedRoomSelection | null>(null);

  // State for guest selection picker
  const [selectedGuests, setSelectedGuests] = useState<{
    adults: number;
    children: number;
    childAges: number[];
  }>({
    adults: guestSelection.adults || 2,
    children: guestSelection.children || 0,
    childAges: guestSelection.childAges || [],
  });

  // Pre-fill form with zustand booking data
  useEffect(() => {
    // Skip if handleGuestSelect already updated the rooms
    if (skipNextGuestMappingRef.current) {
      skipNextGuestMappingRef.current = false;
      return;
    }

    if (selectedDates?.arrival && selectedDates?.departure) {
      const formattedDates = formatDateRangeDe(
        selectedDates.arrival,
        selectedDates.departure,
      );

      const { adults, children, childAges } = guestSelection;

      setFormData((prev) => ({
        ...prev,
        dates: formattedDates,
        datesIso: {
          arrival: selectedDates.arrival,
          departure: selectedDates.departure,
        },
        guests: formatGuestText(adults, children, childAges, t),
      }));

      // Only set default room selection if no room is already selected
      // Don't overwrite existing room selections (even placeholders) to preserve guest distribution
      if (!selectedRoom || selectedRoom.selectedRooms.length === 0) {
        // Create placeholder with initial guest distribution
        const createPlaceholder = (
          guestCount?: number,
          childrenCount?: number,
          childAgesData?: { age: number }[],
        ): SelectedRoomData => ({
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
          room: {
            id: "placeholder",
            name: t.roomSelection.pleaseChooseRoom,
            description: "",
            price: 0,
            currency: "EUR",
            capacity: "",
            area: "",
            image: "/placeholder.png",
            type: "all",
            features: [],
            longDescription: "",
            includedServices: [],
          } as Room,
          guests: guestCount ?? 0,
          children: childrenCount ?? 0,
          childAges: childAgesData ?? [],
          boardOption: "half-board" as const,
        });

        // Use auto-mapping to properly distribute guests across rooms based on capacity
        const updatedRooms = autoMapGuestsToRooms(
          { adults, children, childAges },
          [],
          availableRooms,
          createPlaceholder,
        );

        setSelectedRoom({ selectedRooms: updatedRooms });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDates, guestSelection]);

  // Auto-detect country from phone prefix
  useEffect(() => {
    if (formData.phonePrefix) {
      const country = getCountryFromPrefix(formData.phonePrefix);
      if (country && formData.country !== country) {
        setFormData((prev) => ({ ...prev, country }));
      }
    }
  }, [formData.phonePrefix, formData.country]);

  // Pre-fill form with offer data
  useEffect(() => {
    if (prefilledOffer) {
      // Set the selected offer (roomType is derived automatically)
      setSelectedOffer(prefilledOffer);

      // Clear existing dates first to prevent invalid date ranges
      // Users must select dates within the offer's valid period
      setFormData((prev) => ({
        ...prev,
        offer: prefilledOffer.title,
        dates: "",
        alternativeDates: "",
      }));

      // Clear the prefilled offer after using it (one-time use)
      setPrefilledOffer(undefined);
    }
  }, [prefilledOffer, setPrefilledOffer]);

  // Pre-fill form with room data
  useEffect(() => {
    if (prefilledRoom) {
      const createPlaceholder = (
        guestCount?: number,
        childrenCount?: number,
        childAgesData?: { age: number }[],
      ): SelectedRoomData => ({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        room: {
          id: "placeholder",
          name: t.roomSelection.pleaseChooseRoom,
          description: "",
          price: 0,
          currency: "EUR",
          capacity: "",
          area: "",
          image: "/placeholder.png",
          type: "all",
          features: [],
          longDescription: "",
          includedServices: [],
        } as Room,
        guests: guestCount ?? 0,
        children: childrenCount ?? 0,
        childAges: childAgesData ?? [],
        boardOption: "half-board" as const,
      });

      // Start with prefilledRoom as the first selection
      const initialRoom: SelectedRoomData = {
        id: prefilledRoom.id,
        room: prefilledRoom,
        guests: 0, // Will be set by autoMapGuestsToRooms
        children: 0,
        childAges: [],
        boardOption: "half-board" as const,
      };

      // Use auto-mapping to properly distribute guests across rooms
      const mappedRooms = autoMapGuestsToRooms(
        guestSelection,
        [initialRoom],
        availableRooms,
        createPlaceholder,
      );

      setSelectedRoom({ selectedRooms: mappedRooms });

      // Update form data with room name and guest info
      const { adults, children, childAges } = guestSelection;

      setFormData((prev) => ({
        ...prev,
        room: prefilledRoom.name,
        guests: formatGuestText(adults, children, childAges, t),
      }));

      // Clear the prefilled room after using it (one-time use)
      setPrefilledRoom(undefined);
    }
    // We intentionally avoid including translation objects in the dependency array to
    // prevent unintended resets/reformatting when locale dictionaries update.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefilledRoom, setPrefilledRoom, guestSelection]);

  // Handler functions
  const handleDateSelect = (dates: DateSelectionValue) => {
    const formattedDates = formatDateRangeDe(dates.arrival, dates.departure);

    const formattedAlternativeDates = formatDateRangeDe(
      dates.alternativeArrival,
      dates.alternativeDeparture,
    );

    setFormData({
      ...formData,
      dates: formattedDates,
      datesIso:
        dates.arrival && dates.departure
          ? { arrival: dates.arrival, departure: dates.departure }
          : undefined,
      alternativeDates: formattedAlternativeDates,
      alternativeDatesIso:
        dates.alternativeArrival && dates.alternativeDeparture
          ? {
              arrival: dates.alternativeArrival,
              departure: dates.alternativeDeparture,
            }
          : undefined,
      dateFlexibility: dates.dateFlexibility ?? 0,
    });

    // Also update the booking store so room selection can access the dates
    if (dates.arrival && dates.departure) {
      setSelectedDates({ arrival: dates.arrival, departure: dates.departure });
    }
  };

  const handleOfferSelect = (offer: Offer | null) => {
    setSelectedOffer(offer);

    let shouldClearDates = true;

    if (offer && selectedDates?.arrival && selectedDates?.departure) {
      // Parse YYYY-MM-DD format as local time (not UTC)
      const [arrYear, arrMonth, arrDay] = selectedDates.arrival
        .split("-")
        .map(Number);
      const checkin = new Date(arrYear, arrMonth - 1, arrDay);
      checkin.setHours(0, 0, 0, 0);

      const [depYear, depMonth, depDay] = selectedDates.departure
        .split("-")
        .map(Number);
      const checkout = new Date(depYear, depMonth - 1, depDay);
      checkout.setHours(0, 0, 0, 0);

      // Helper to parse DD.MM.YYYY date format
      const parseOfferDate = (dateStr: string): Date => {
        const [day, month, year] = dateStr.split(".").map(Number);
        const date = new Date(year, month - 1, day);
        date.setHours(0, 0, 0, 0);
        return date;
      };

      // Build periods array from offer
      const periods = offer.validityPeriods.map((p) => ({
        start: parseOfferDate(p.effectiveFrom || p.from),
        end: parseOfferDate(p.to),
      }));

      // Check if dates fit within ANY period
      const isWithinAnyPeriod = periods.some(
        (period) => checkin >= period.start && checkout <= period.end,
      );

      // Check minNights requirement
      const currentNights = Math.round(
        (checkout.getTime() - checkin.getTime()) / (1000 * 60 * 60 * 24),
      );
      const meetsMinNights =
        !offer.minNights || currentNights >= offer.minNights;

      // Only keep dates if BOTH conditions are met
      if (isWithinAnyPeriod && meetsMinNights) {
        shouldClearDates = false;
      }
    }

    if (shouldClearDates) {
      setFormData({
        ...formData,
        offer: offer?.title || "",
        dates: "",
        alternativeDates: "",
      });
    } else {
      setFormData({
        ...formData,
        offer: offer?.title || "",
      });
    }
  };

  const handleOfferRemove = () => {
    setSelectedOffer(null);
    setFormData({ ...formData, offer: "" });
  };

  const handleRoomSelect = (selection: SelectedRoomSelection) => {
    setSelectedRoom(selection);

    if (selection.selectedRooms.length === 0) {
      setFormData({
        ...formData,
        room: "",
        guests: formatGuestText(2, 0, [], t),
      });
      return;
    }

    // Format room text for display
    const roomTexts = selection.selectedRooms.map((room) => room.room.name);
    const totalGuests = selection.selectedRooms.reduce(
      (sum, room) => sum + room.guests,
      0,
    );
    const totalChildren = selection.selectedRooms.reduce(
      (sum, room) => sum + room.children,
      0,
    );
    const allChildAges = selection.selectedRooms.flatMap((room) =>
      room.childAges.map((child) => child.age),
    );

    // Join all room names with commas
    const roomText = roomTexts.join(", ");

    setFormData({
      ...formData,
      room: roomText,
      guests: formatGuestText(totalGuests, totalChildren, allChildAges, t),
    });
  };

  const handleGuestSelect = (guests: {
    adults: number;
    children: number;
    childAges: number[];
  }) => {
    setSelectedGuests(guests);

    setFormData({
      ...formData,
      guests: formatGuestText(
        guests.adults,
        guests.children,
        guests.childAges,
        t,
      ),
    });

    // Skip the next useEffect mapping since we're handling it here
    skipNextGuestMappingRef.current = true;

    // Also update the booking store so room selection can access the guest data
    setGuestSelection(guests);

    // Auto-map guests to rooms based on capacity
    const createPlaceholder = (
      guestCount?: number,
      childrenCount?: number,
      childAgesData?: { age: number }[],
    ): SelectedRoomData => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      room: {
        id: "placeholder",
        name: t.roomSelection.pleaseChooseRoom,
        description: "",
        price: 0,
        currency: "EUR",
        capacity: "",
        area: "",
        image: "/placeholder.png",
        type: "all",
        features: [],
        longDescription: "",
        includedServices: [],
      } as Room,
      guests: guestCount ?? 0,
      children: childrenCount ?? 0,
      childAges: childAgesData ?? [],
      boardOption: "half-board" as const,
    });

    const currentRooms = selectedRoom?.selectedRooms ?? [];
    const updatedRooms = autoMapGuestsToRooms(
      guests,
      currentRooms,
      availableRooms,
      createPlaceholder,
    );

    setSelectedRoom({ selectedRooms: updatedRooms });
  };

  const handleSalutationChange = (newSalutation: "herr" | "frau") => {
    setSalutation(newSalutation);
    // Clear validation errors
    setValidationErrors([]);
    // Clear salutation-specific fields when changing
    setFormData({
      ...formData,
      firstName: "",
      lastName: "",
    });
  };

  // Validation functions
  const validateForm = () => {
    return validateEnquiryForm(formData, t.validation);
  };

  const getFieldError = (fieldType: string) => {
    if (validationErrors.length === 0) return null;
    return getEnquiryFieldError(fieldType, formData, t.validation);
  };

  const hasFieldError = (fieldType: string) => {
    return getFieldError(fieldType) !== null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validateForm();
    setValidationErrors(errors);

    if (errors.length > 0) {
      return;
    }

    // Ensure childAges count matches children count before submission
    let syncedSelectedRoom = selectedRoom;
    if (selectedRoom?.selectedRooms) {
      const syncedRooms = selectedRoom.selectedRooms.map((room) => {
        const currentChildAges = room.childAges || [];
        if (currentChildAges.length < room.children) {
          // Pad with age 0 for missing entries
          const padded = [...currentChildAges];
          while (padded.length < room.children) {
            padded.push({ age: 0 });
          }
          return { ...room, childAges: padded };
        }
        if (currentChildAges.length > room.children) {
          // Trim excess
          return { ...room, childAges: currentChildAges.slice(0, room.children) };
        }
        return room;
      });
      syncedSelectedRoom = { selectedRooms: syncedRooms };
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Prepare extended form data for submission
      const extendedFormData: ExtendedEnquiryFormData = {
        salutation,
        selectedOffer,
        selectedRoom: syncedSelectedRoom,
        guestSelection,
        source: adSourceName,
        ...formData,
      };

      // Submit to ReGuest API
      const result = await submitEnquiry(extendedFormData);

      if (result.success) {
        track("request-form-submitted");
        triggerLeadEvent();
        // Redirect to thank you page
        router.push(THANK_YOU_SLUG_BY_LOCALE[locale]);
        resetForm();
      } else {
        // Show error message
        setSubmitError(result.error || t.validation.submissionError);
      }
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitError(t.validation.submissionError);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSalutation("herr");
    setValidationErrors([]);
    setSubmitError(null);
    setSelectedOffer(null);
    setSelectedRoom(null);
    setFormData({
      offer: "",
      room: "",
      dates: "",
      datesIso: undefined,
      alternativeDates: "",
      alternativeDatesIso: undefined,
      dateFlexibility: 0,
      guests: formatGuestText(2, 0, [], t),
      firstName: "",
      lastName: "",
      phonePrefix: "+49",
      phoneNumber: "",
      language: locale.toUpperCase(),
      country: getCountryFromPrefix("+49") || "",
      email: "",
      message: "",
      newsletter: false,
      privacyAccepted: false,
    });
  };

  const updateFormData = (updates: Partial<typeof formData>) => {
    setFormData({ ...formData, ...updates });
  };

  const clearValidationErrors = () => {
    setValidationErrors([]);
  };

  return {
    // State
    roomType,
    salutation,
    validationErrors,
    isSubmitting,
    submitError,
    formData,
    selectedOffer,
    selectedRoom,
    // Handlers
    handleDateSelect,
    handleOfferSelect,
    handleOfferRemove,
    handleRoomSelect,
    handleGuestSelect,
    selectedGuests,
    handleSalutationChange,
    handleSubmit,
    resetForm,
    updateFormData,
    clearValidationErrors,
    // Validation
    validateForm,
    getFieldError,
    hasFieldError,
  };
}

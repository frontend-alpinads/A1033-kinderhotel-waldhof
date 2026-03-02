"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ErrorText } from "@/components/ui/error-text";
import { useBookingStore } from "@/stores/booking-store";
import { getEmailSuggestion } from "@/lib/email-suggestion";
import { DesktopOfferSelection } from "./features/offers/desktop-offer-selection";
import { DesktopRoomSelection } from "./features/rooms/desktop-room-selection";
import { SelectedOfferCard } from "./features/offers/selected-offer-card";
import { MobileOfferSelection } from "./features/offers/mobile-offer-selection";
import { MobileRoomSelection } from "./features/rooms/mobile-room-selection";
import { DesktopGuestsPicker } from "./features/guests/desktop-guests-picker";
import { MobileGuestsPicker } from "./features/guests/mobile-guests-picker";
import { EmailHint } from "./components/email-hint";
import {
  BedIcon,
  CalendarDotsIcon,
  CaretDownIcon,
  TagIcon,
  CheckIcon,
  UsersIcon,
  InfoIcon,
} from "@phosphor-icons/react";
import { useEnquiryForm } from "./model/use-enquiry-form";
import { PhonePrefixSelector } from "./components/phone-prefix-selector";
import { DesktopDatePicker } from "./features/date/desktop-date-picker";
import { MobileDatePicker } from "./features/date/mobile-date-picker";
import { useRoomsAndOffers } from "@/components/providers/rooms-and-offers-provider";
import {
  getEffectiveMinDate,
  parseOfferEndDate,
  shouldShowOpeningNotice,
} from "@/lib/booking-utils";
import { useLocale } from "@/lib/i18n";
import { PRIVACY_SLUG_BY_LOCALE } from "@/lib/routes/registry";
import {
  EnquiryFormProvider,
  useEnquiryFormTranslations,
  type Locale,
} from "./i18n";

interface EnquiryFormProps {
  type?: "hotel";
  locale?: Locale;
  openingNotice?: string;
}

function EnquiryFormContent({
  type = "hotel",
  openingNotice,
}: Omit<EnquiryFormProps, "locale">) {
  const t = useEnquiryFormTranslations();
  const { rooms: availableRooms, offers } = useRoomsAndOffers();
  const [emailSuggestion, setEmailSuggestion] = useState<string | null>(null);
  const {
    selectedDates,
    setSelectedDates,
    guestSelection,
    setGuestSelection,
    prefilledOffer,
    setPrefilledOffer,
    prefilledRoom,
    setPrefilledRoom,
  } = useBookingStore();

  // Use the custom hook for all state management and logic
  const {
    salutation,
    validationErrors,
    isSubmitting,
    submitError,
    formData,
    selectedOffer,
    selectedRoom,
    handleSalutationChange,
    handleDateSelect,
    handleOfferSelect,
    handleOfferRemove,
    handleRoomSelect,
    handleGuestSelect,
    selectedGuests,
    handleSubmit,
    updateFormData,
    clearValidationErrors,
    getFieldError,
    hasFieldError,
  } = useEnquiryForm({
    type,
    selectedDates,
    setSelectedDates,
    guestSelection,
    setGuestSelection,
    prefilledOffer,
    setPrefilledOffer,
    prefilledRoom,
    setPrefilledRoom,
    availableRooms,
  });

  const showOpeningNotice = shouldShowOpeningNotice();
  const effectiveOpeningNotice = openingNotice ?? t.openingNotice;

  return (
    <div className="bg-background flex flex-col gap-8 rounded-none p-3 md:p-8 lg:w-full">
      {/* Opening Notice Banner */}
      {showOpeningNotice && effectiveOpeningNotice && (
        <div className="bg-foreground/10 flex items-center gap-3 border p-4">
          <InfoIcon weight="fill" className="text-foreground size-5" />
          <p className="text-foreground text-sm font-medium">
            {effectiveOpeningNotice}
          </p>
        </div>
      )}

      {/* Form Fields */}
      <div className="flex flex-col gap-4">
        {/* Date Selection & Guests Selection */}
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Guests Selection - Shows first on mobile, right side on desktop */}
          <div className="relative">
            {/* Desktop Guests Picker */}
            <div className="relative max-md:hidden">
              <DesktopGuestsPicker
                onGuestSelect={handleGuestSelect}
                selectedGuests={selectedGuests}
              >
                <div className="border-border hover:border-secondary flex cursor-pointer items-center justify-between rounded-none border border-solid p-3 transition-colors lg:flex-1 lg:shrink-0 lg:px-4">
                  <div className="flex items-center gap-4 py-3">
                    <div className="flex size-6 shrink-0 items-center justify-center">
                      <UsersIcon className="text-primary size-6" />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <span
                        className={`text-base leading-normal font-normal ${formData.guests ? "text-foreground" : "text-foreground/70"}`}
                      >
                        {formData.guests || t.guestSelection.chooseGuests}{" "}
                      </span>
                    </div>
                  </div>
                  <div className="flex size-6 shrink-0 items-center justify-center">
                    <CaretDownIcon className="text-primary size-6" />
                  </div>
                </div>
              </DesktopGuestsPicker>
            </div>

            {/* Mobile Guests Picker */}
            <div className="relative md:hidden">
              <MobileGuestsPicker
                onGuestSelect={handleGuestSelect}
                selectedGuests={selectedGuests}
              >
                <div className="border-border hover:border-secondary flex cursor-pointer items-center justify-between rounded-none border border-solid p-3 transition-colors lg:flex-1 lg:shrink-0 lg:px-4">
                  <div className="flex items-center gap-4 py-3">
                    <div className="flex size-6 shrink-0 items-center justify-center">
                      <UsersIcon className="text-primary size-6" />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <span
                        className={`text-base leading-normal font-normal ${formData.guests ? "text-foreground" : "text-foreground/70"}`}
                      >
                        {formData.guests || t.guestSelection.chooseGuests}
                      </span>
                    </div>
                  </div>
                  <div className="flex size-6 shrink-0 items-center justify-center">
                    <CaretDownIcon className="text-primary size-6" />
                  </div>
                </div>
              </MobileGuestsPicker>
            </div>
          </div>

          {/* Date Selection - Shows second on mobile, left side on desktop */}
          <div className="relative">
            {/* Desktop Date Picker */}
            <div className="relative max-md:hidden">
              <DesktopDatePicker
                key={selectedOffer?.title || "no-offer"}
                onDateSelect={(dates) => {
                  handleDateSelect(dates);
                  // Clear validation errors when user selects dates
                  if (validationErrors.length > 0) {
                    clearValidationErrors();
                  }
                }}
                selectedDates={selectedDates}
                minDate={getEffectiveMinDate(
                  selectedOffer?.validityPeriods[0]?.effectiveFrom,
                )}
                maxDate={parseOfferEndDate(
                  selectedOffer?.validityPeriods[
                    selectedOffer.validityPeriods.length - 1
                  ]?.to,
                )}
                minNights={selectedOffer?.minNights}
                offers={offers}
                selectedOffer={selectedOffer ?? undefined}
              >
                <div
                  className={`flex cursor-pointer items-center justify-between rounded-none border border-solid p-3 transition-colors lg:px-4 ${
                    hasFieldError("dates")
                      ? "border-destructive bg-destructive/10"
                      : "border-border hover:border-secondary"
                  }`}
                >
                  <div className="flex items-center gap-4 py-3">
                    <div className="flex size-6 shrink-0 items-center justify-center">
                      <CalendarDotsIcon className="text-primary size-6" />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <span
                        className={`text-base leading-normal font-normal ${formData.dates ? "text-foreground" : "text-foreground/70"}`}
                      >
                        {formData.dates || t.form.dates.label}
                        {formData.alternativeDates && (
                          <span className="">
                            , {t.form.dates.alternative}:{" "}
                            {formData.alternativeDates}
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="flex size-6 shrink-0 items-center justify-center">
                    <CaretDownIcon className="text-primary size-6" />
                  </div>
                </div>
              </DesktopDatePicker>
              <ErrorText message={getFieldError("dates")} />
            </div>

            {/* Mobile Date Picker */}
            <div className="relative md:hidden">
              <MobileDatePicker
                key={selectedOffer?.title || "no-offer"}
                onDateSelect={(dates) => {
                  handleDateSelect(dates);
                  // Clear validation errors when user selects dates
                  if (validationErrors.length > 0) {
                    clearValidationErrors();
                  }
                }}
                selectedDates={selectedDates}
                minDate={getEffectiveMinDate(
                  selectedOffer?.validityPeriods[0]?.effectiveFrom,
                )}
                maxDate={parseOfferEndDate(
                  selectedOffer?.validityPeriods[
                    selectedOffer.validityPeriods.length - 1
                  ]?.to,
                )}
                minNights={selectedOffer?.minNights}
                offers={offers}
                selectedOffer={selectedOffer ?? undefined}
              >
                <div
                  className={`flex cursor-pointer items-center justify-between rounded-none border border-solid p-3 transition-colors lg:px-4 ${
                    hasFieldError("dates")
                      ? "border-destructive bg-destructive/10"
                      : "border-border hover:border-secondary"
                  }`}
                >
                  <div className="flex items-center gap-4 py-3">
                    <div className="flex size-6 shrink-0 items-center justify-center">
                      <CalendarDotsIcon className="text-primary size-6" />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <span
                        className={`text-base leading-normal font-normal ${formData.dates ? "text-foreground" : "text-foreground/70"}`}
                      >
                        {formData.dates || t.form.dates.label}
                        {formData.alternativeDates && (
                          <span className="">
                            , {t.form.dates.alternative}:{" "}
                            {formData.alternativeDates}
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="flex size-6 shrink-0 items-center justify-center">
                    <CaretDownIcon className="text-primary size-6" />
                  </div>
                </div>
              </MobileDatePicker>
              <ErrorText message={getFieldError("dates")} />
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {/* Offer Selection */}
          <div className="relative">
            {/* Desktop Offer Selection */}
            <div className="relative max-md:hidden">
              <DesktopOfferSelection
                onOfferSelect={handleOfferSelect}
                selectedOffer={selectedOffer}
              >
                {selectedOffer ? (
                  <div className="cursor-pointer lg:flex-1">
                    <SelectedOfferCard
                      offer={selectedOffer}
                      onRemove={handleOfferRemove}
                      // onEdit={() => {}}
                    />
                  </div>
                ) : (
                  <div className="border-border hover:border-secondary flex cursor-pointer items-center justify-between rounded-none border border-solid p-3 transition-colors lg:flex-1 lg:shrink-0 lg:px-4">
                    <div className="flex items-center gap-4 py-3">
                      <div className="flex size-6 shrink-0 items-center justify-center">
                        <TagIcon className="text-primary size-6" />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <span
                          className={`text-base leading-normal font-normal ${formData.offer ? "text-foreground" : "text-foreground/70"}`}
                        >
                          {formData.offer || t.form.offer.choose}
                        </span>
                      </div>
                    </div>
                    <div className="flex size-6 shrink-0 items-center justify-center">
                      <CaretDownIcon className="text-primary size-6" />
                    </div>
                  </div>
                )}
              </DesktopOfferSelection>
            </div>

            {/* Mobile Offer Selection */}
            <div className="relative md:hidden">
              <MobileOfferSelection
                onOfferSelect={handleOfferSelect}
                selectedOffer={selectedOffer}
              >
                {selectedOffer ? (
                  <div className="cursor-pointer lg:flex-1">
                    <SelectedOfferCard
                      offer={selectedOffer}
                      onRemove={handleOfferRemove}
                      // onEdit={() => {}}
                    />
                  </div>
                ) : (
                  <div className="border-border hover:border-secondary flex cursor-pointer items-center justify-between rounded-none border border-solid p-3 transition-colors lg:flex-1 lg:shrink-0 lg:px-4">
                    <div className="flex items-center gap-4 py-3">
                      <div className="flex size-6 shrink-0 items-center justify-center">
                        <TagIcon className="text-primary size-6" />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <span
                          className={`text-base leading-normal font-normal ${formData.offer ? "text-foreground" : "text-foreground/70"}`}
                        >
                          {formData.offer || t.form.offer.choose}
                        </span>
                      </div>
                    </div>
                    <div className="flex size-6 shrink-0 items-center justify-center">
                      <CaretDownIcon className="text-primary size-6" />
                    </div>
                  </div>
                )}
              </MobileOfferSelection>
            </div>
          </div>
          {/* Room Selection */}
          <div className="relative">
            {/* Desktop Room Selection */}
            <div className="relative max-md:hidden">
              <DesktopRoomSelection
                onRoomSelect={handleRoomSelect}
                selectedRoom={selectedRoom || undefined}
              >
                <div className="border-border hover:border-secondary flex cursor-pointer items-center justify-between rounded-none border border-solid p-3 transition-colors lg:flex-1 lg:shrink-0 lg:px-4">
                  <div className="flex items-center gap-4 py-3">
                    <div className="flex size-6 shrink-0 items-center justify-center">
                      <BedIcon className="text-primary size-6" />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <span
                        className={`text-base leading-normal font-normal ${selectedRoom?.selectedRooms.length ? "text-foreground" : "text-foreground/70"}`}
                      >
                        {selectedRoom?.selectedRooms.length
                          ? `${selectedRoom.selectedRooms.length} ${selectedRoom.selectedRooms.length === 1 ? t.roomSelection.room.one : t.roomSelection.room.other}`
                          : t.form.room.chooseWithGuests}
                      </span>
                    </div>
                  </div>
                  <div className="flex size-6 shrink-0 items-center justify-center">
                    <CaretDownIcon className="text-primary size-6" />
                  </div>
                </div>
              </DesktopRoomSelection>
            </div>

            {/* Mobile Room Selection */}
            <div className="relative md:hidden">
              <MobileRoomSelection
                onRoomSelect={handleRoomSelect}
                selectedRoom={selectedRoom || undefined}
              >
                <div className="border-border hover:border-secondary flex cursor-pointer items-center justify-between rounded-none border border-solid p-3 transition-colors lg:flex-1 lg:shrink-0 lg:px-4">
                  <div className="flex items-center gap-4 py-3">
                    <div className="flex size-6 shrink-0 items-center justify-center">
                      <BedIcon className="text-primary size-6" />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <span
                        className={`text-base leading-normal font-normal ${selectedRoom?.selectedRooms.length ? "text-foreground" : "text-foreground/70"}`}
                      >
                        {selectedRoom?.selectedRooms.length
                          ? `${selectedRoom.selectedRooms.length} ${selectedRoom.selectedRooms.length === 1 ? t.roomSelection.room.one : t.roomSelection.room.other}`
                          : t.form.room.chooseWithGuests}
                      </span>
                    </div>
                  </div>
                  <div className="flex size-6 shrink-0 items-center justify-center">
                    <CaretDownIcon className="text-primary size-6" />
                  </div>
                </div>
              </MobileRoomSelection>
            </div>
          </div>
        </div>
      </div>

      {/* Salutation Selection */}
      <div className="flex flex-col gap-3">
        <h3 className="text-primary text-base lg:text-xl lg:leading-[140%]">
          {t.form.salutation.label}
        </h3>
        <div className="flex gap-2 max-lg:flex-wrap">
          <button
            type="button"
            onClick={() => handleSalutationChange("herr")}
            className={`min-h-[45px] rounded-none px-5 py-3 text-base leading-normal font-normal tracking-[0.8px] transition-colors duration-150 ${
              salutation === "herr"
                ? "bg-foreground/10 text-foreground border-foreground/20 border border-solid"
                : "border-foreground/20 text-foreground hover:border-secondary bg-primary-foreground cursor-pointer border border-solid"
            }`}
          >
            {t.form.salutation.mr}
          </button>
          <button
            type="button"
            onClick={() => handleSalutationChange("frau")}
            className={`min-h-[45px] rounded-none px-5 py-3 text-base leading-normal font-normal tracking-[0.8px] transition-colors duration-150 ${
              salutation === "frau"
                ? "bg-foreground/10 text-foreground border-foreground/20 border border-solid"
                : "border-foreground/20 text-foreground hover:border-secondary bg-primary-foreground cursor-pointer border border-solid"
            }`}
          >
            {t.form.salutation.mrs}
          </button>
        </div>
      </div>

      {/* Personal Information */}
      <div className="flex flex-col gap-4">
        {/* First Name & Last Name Row */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-x-4">
          {/* First Name */}
          <div className="relative">
            <div
              className={`flex items-center rounded-none border border-solid px-5 py-5.75 ${
                hasFieldError("firstName")
                  ? "border-destructive bg-destructive/10"
                  : "border-border"
              }`}
            >
              <input
                type="text"
                placeholder={t.form.firstName}
                className="text-foreground w-full bg-transparent text-base leading-normal font-normal outline-none placeholder:text-[#888888]"
                value={formData.firstName}
                onChange={(e) => {
                  updateFormData({ firstName: e.target.value });
                  if (validationErrors.length > 0) {
                    clearValidationErrors();
                  }
                }}
              />
            </div>
            <ErrorText message={getFieldError("firstName")} />
          </div>

          {/* Last Name */}
          <div className="relative">
            <div
              className={`flex items-center rounded-none border border-solid px-5 py-5.75 ${
                hasFieldError("lastName")
                  ? "border-destructive bg-destructive/10"
                  : "border-border"
              }`}
            >
              <input
                type="text"
                placeholder={t.form.lastName}
                className="text-foreground w-full bg-transparent text-base leading-normal font-normal outline-none placeholder:text-[#888888]"
                value={formData.lastName}
                onChange={(e) => {
                  updateFormData({ lastName: e.target.value });
                  if (validationErrors.length > 0) {
                    clearValidationErrors();
                  }
                }}
              />
            </div>
            <ErrorText message={getFieldError("lastName")} />
          </div>
        </div>

        {/* Phone & Email Row */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-x-4">
          {/* Phone - Prefix and Number */}
          <div className="relative">
            <div className="flex gap-4">
              <PhonePrefixSelector
                value={formData.phonePrefix}
                onChange={(prefix) => {
                  updateFormData({ phonePrefix: prefix });
                  if (validationErrors.length > 0) {
                    clearValidationErrors();
                  }
                }}
                hasError={hasFieldError("phonePrefix")}
              />
              <div
                className={`flex flex-1 items-center rounded-none border border-solid px-5 py-5.75 ${
                  hasFieldError("phoneNumber")
                    ? "border-destructive bg-destructive/10"
                    : "border-border"
                }`}
              >
                <input
                  type="tel"
                  placeholder={t.form.phone}
                  className="text-foreground w-full bg-transparent text-base leading-normal font-normal outline-none placeholder:text-[#888888]"
                  value={formData.phoneNumber}
                  onChange={(e) => {
                    updateFormData({ phoneNumber: e.target.value });
                    if (validationErrors.length > 0) {
                      clearValidationErrors();
                    }
                  }}
                />
              </div>
            </div>
            <ErrorText
              message={
                getFieldError("phonePrefix") || getFieldError("phoneNumber")
              }
            />
          </div>

          {/* Email */}
          <div className="relative">
            <div
              className={`flex items-center rounded-none border border-solid px-5 py-5.75 ${
                hasFieldError("email")
                  ? "border-destructive bg-destructive/10"
                  : "border-border"
              }`}
            >
              <input
                type="email"
                placeholder={t.form.email}
                className="text-foreground w-full bg-transparent text-base leading-normal font-normal outline-none placeholder:text-[#888888]"
                value={formData.email}
                onChange={(e) => {
                  const newEmail = e.target.value;
                  updateFormData({ email: newEmail });
                  // Check for email domain typo suggestion
                  const suggestion = getEmailSuggestion(newEmail);
                  setEmailSuggestion(suggestion);
                  if (validationErrors.length > 0) {
                    clearValidationErrors();
                  }
                }}
              />
            </div>
            {emailSuggestion && !hasFieldError("email") && (
              <EmailHint
                suggestion={emailSuggestion}
                onAccept={(correctedEmail) => {
                  updateFormData({ email: correctedEmail });
                  setEmailSuggestion(null);
                }}
              />
            )}
            <ErrorText message={getFieldError("email")} />
          </div>
        </div>
      </div>

      {/* Message Field */}
      <div className="relative">
        <div
          className={`flex min-h-40 items-start rounded-none border border-solid px-5 py-4 ${
            hasFieldError("message")
              ? "border-destructive bg-destructive/10"
              : "border-border"
          }`}
        >
          <textarea
            placeholder={t.form.message}
            rows={5}
            className="text-foreground w-full bg-transparent text-base leading-normal font-normal outline-none placeholder:text-[#888888]"
            value={formData.message}
            onChange={(e) => {
              updateFormData({ message: e.target.value });
              if (validationErrors.length > 0) {
                clearValidationErrors();
              }
            }}
          />
        </div>
        <ErrorText message={getFieldError("message")} />
      </div>

      {/* Checkboxes */}
      <div className="flex flex-col gap-3">
        <div className="flex gap-3">
          <div
            className={`border-primary mt-0.5 flex size-4.5 flex-none cursor-pointer items-center justify-center rounded-none border border-solid ${formData.newsletter ? "bg-primary" : "bg-primary-foreground"}`}
            onClick={() => updateFormData({ newsletter: !formData.newsletter })}
          >
            {formData.newsletter && (
              <CheckIcon className="size-3 text-white" weight="bold" />
            )}
          </div>
          <label
            onClick={() => updateFormData({ newsletter: !formData.newsletter })}
            className="cursor-pointer text-base leading-normal font-normal"
          >
            {t.form.newsletter}
          </label>
        </div>
        <div className="relative">
          <div className="flex gap-3">
            <div
              className={`mt-0.5 flex size-4.5 flex-none cursor-pointer items-center justify-center rounded-none border border-solid ${
                hasFieldError("privacyAccepted")
                  ? "border-destructive bg-destructive/10"
                  : "border-primary"
              } ${formData.privacyAccepted ? "bg-primary" : "bg-primary-foreground"}`}
              onClick={() => {
                updateFormData({
                  privacyAccepted: !formData.privacyAccepted,
                });
                if (validationErrors.length > 0) {
                  clearValidationErrors();
                }
              }}
            >
              {formData.privacyAccepted && (
                <CheckIcon className="size-3 text-white" weight="bold" />
              )}
            </div>
            <label
              onClick={() => {
                updateFormData({
                  privacyAccepted: !formData.privacyAccepted,
                });
                if (validationErrors.length > 0) {
                  clearValidationErrors();
                }
              }}
              className="cursor-pointer text-base leading-normal font-normal"
            >
              {t.form.privacyPolicy.prefix}
              <Link
                href={PRIVACY_SLUG_BY_LOCALE[t.locale as Locale]}
                className="underline hover:opacity-80"
                target="_blank"
                onClick={(e) => e.stopPropagation()}
              >
                {t.form.privacyPolicy.linkText}
              </Link>
              {t.form.privacyPolicy.suffix}
            </label>
          </div>
          <ErrorText message={getFieldError("privacyAccepted")} />
        </div>
      </div>

      {/* Error Display */}
      <ErrorText message={submitError} variant="banner" />

      {/* Submit Section */}
      <div className="flex items-center justify-between gap-10 max-lg:flex-col max-lg:gap-6">
        <p className="text-foreground text-base leading-normal font-normal opacity-70">
          {t.form.responseTime}
        </p>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="max-lg:w-full"
        >
          {isSubmitting ? t.form.submitting : t.form.submit}
        </Button>
      </div>
    </div>
  );
}

export function EnquiryForm({
  locale,
  type = "hotel",
  openingNotice,
}: EnquiryFormProps) {
  const currentLocale = useLocale();
  return (
    <EnquiryFormProvider locale={locale ?? currentLocale}>
      <EnquiryFormContent type={type} openingNotice={openingNotice} />
    </EnquiryFormProvider>
  );
}

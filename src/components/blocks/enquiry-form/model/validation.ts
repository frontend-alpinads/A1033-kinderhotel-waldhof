import type { EnquiryFormData } from "./types";

export type EnquiryValidationText = {
  required: string;
  invalidEmail: string;
};

export function isValidEmail(email: string) {
  return /[^\s@]+@[^\s@]+\.[^\s@]+/.test(email);
}

export function validateEnquiryForm(
  formData: EnquiryFormData,
  validation: EnquiryValidationText,
) {
  const errors: string[] = [];

  // Validate primary date range (always required)
  if (!formData.dates.trim()) {
    errors.push(validation.required);
  }

  // Required fields
  if (!formData.firstName.trim()) {
    errors.push(validation.required);
  }
  if (!formData.lastName.trim()) {
    errors.push(validation.required);
  }
  if (!formData.phonePrefix.trim()) {
    errors.push(validation.required);
  }
  if (!formData.phoneNumber.trim()) {
    errors.push(validation.required);
  }

  // Validate email (always required)
  if (!formData.email.trim()) {
    errors.push(validation.required);
  } else if (!isValidEmail(formData.email.trim())) {
    errors.push(validation.invalidEmail);
  }

  // Validate privacy policy acceptance
  if (!formData.privacyAccepted) {
    errors.push(validation.required);
  }

  return errors;
}

export function getEnquiryFieldError(
  fieldType: string,
  formData: EnquiryFormData,
  validation: EnquiryValidationText,
) {
  if (fieldType === "dates") {
    return !formData.dates.trim() ? validation.required : null;
  }
  if (fieldType === "firstName") {
    return !formData.firstName.trim() ? validation.required : null;
  }
  if (fieldType === "lastName") {
    return !formData.lastName.trim() ? validation.required : null;
  }
  if (fieldType === "phonePrefix") {
    return !formData.phonePrefix.trim() ? validation.required : null;
  }
  if (fieldType === "phoneNumber") {
    return !formData.phoneNumber.trim() ? validation.required : null;
  }
  if (fieldType === "email") {
    if (!formData.email.trim()) {
      return validation.required;
    }
    if (!isValidEmail(formData.email.trim())) {
      return validation.invalidEmail;
    }
    return null;
  }
  if (fieldType === "privacyAccepted") {
    return !formData.privacyAccepted ? validation.required : null;
  }
  return null;
}

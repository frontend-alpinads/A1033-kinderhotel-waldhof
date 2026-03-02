import type { SelectedDates } from "./types";

export function formatDateRangeDe(
  arrival: string | undefined,
  departure: string | undefined,
) {
  if (!arrival || !departure) return "";
  return `${new Date(arrival).toLocaleDateString("de-DE")} - ${new Date(
    departure,
  ).toLocaleDateString("de-DE")}`;
}

export function parseDateRangeString(
  range: string | undefined | null,
): SelectedDates {
  if (!range) return { arrival: "", departure: "" };
  const [arrival, departure] = range.split(" - ");
  return { arrival: arrival ?? "", departure: departure ?? "" };
}

export function formatGuestText(
  adults: number,
  children: number,
  childAges: number[],
  translations: {
    adults: { one: string; other: string };
    children: { one: string; other: string };
  },
): string {
  const adultsText =
    adults === 1 ? translations.adults.one : translations.adults.other;
  const childrenText =
    children === 1 ? translations.children.one : translations.children.other;

  let guestText = `${adults} ${adultsText}, ${children} ${childrenText}`;

  if (children > 0 && childAges.length > 0) {
    guestText += ` (${childAges.join(", ")})`;
  }

  return guestText;
}

import type { Offer, Room } from "@/shared-types";

export type GuestSelection = {
  adults: number;
  children: number;
  childAges: number[];
};

export type SelectedDates = {
  arrival: string;
  departure: string;
};

export type DateFlexibility = 0 | 1 | 2 | 3 | 7 | 14;

export type DateSelectionValue = SelectedDates & {
  alternativeArrival?: string;
  alternativeDeparture?: string;
  dateFlexibility?: DateFlexibility;
};

export type ChildAgeData = {
  age: number;
};

export type BoardOption = "half-board";

export type SelectedRoomData = {
  id: string;
  room: Room;
  guests: number;
  children: number;
  childAges: ChildAgeData[];
  boardOption: BoardOption;
};

export type SelectedRoomSelection = {
  selectedRooms: SelectedRoomData[];
};

export type EnquiryFormData = {
  offer: string;
  room: string;
  dates: string;
  datesIso?: SelectedDates;
  alternativeDates: string;
  alternativeDatesIso?: SelectedDates;
  dateFlexibility: DateFlexibility;
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
};

export interface UseEnquiryFormParams {
  type?: "hotel";
  selectedDates?: SelectedDates;
  setSelectedDates: (dates: SelectedDates) => void;
  guestSelection: GuestSelection;
  setGuestSelection: (guests: GuestSelection) => void;
  prefilledOffer?: Offer;
  setPrefilledOffer: (offer: Offer | undefined) => void;
  prefilledRoom?: Room;
  setPrefilledRoom: (room: Room | undefined) => void;
  availableRooms: Room[];
}

import { Offer, Room } from "@/shared-types";
import { create } from "zustand";

export interface BookingData {
  selectedDates?: {
    arrival: string;
    departure: string;
  };
  guestSelection: {
    adults: number;
    children: number;
    childAges: number[];
  };
  prefilledOffer?: Offer;
  prefilledRoom?: Room;
}

interface BookingStore extends BookingData {
  setSelectedDates: (
    dates: { arrival: string; departure: string } | undefined,
  ) => void;
  setGuestSelection: (guests: {
    adults: number;
    children: number;
    childAges: number[];
  }) => void;
  setPrefilledOffer: (offer: Offer | undefined) => void;
  setPrefilledRoom: (room: Room | undefined) => void;
  clearBookingData: () => void;
}

export const useBookingStore = create<BookingStore>((set) => ({
  selectedDates: undefined,
  guestSelection: {
    adults: 2,
    children: 0,
    childAges: [],
  },
  prefilledOffer: undefined,
  prefilledRoom: undefined,
  setSelectedDates: (dates) => set({ selectedDates: dates }),
  setGuestSelection: (guests) => set({ guestSelection: guests }),
  setPrefilledOffer: (offer) => set({ prefilledOffer: offer }),
  setPrefilledRoom: (room) => set({ prefilledRoom: room }),
  clearBookingData: () =>
    set({
      selectedDates: undefined,
      guestSelection: {
        adults: 2,
        children: 0,
        childAges: [],
      },
      prefilledOffer: undefined,
      prefilledRoom: undefined,
    }),
}));

import type { Room } from "@/shared-types";
import type { SelectedRoomData } from "./types";

/**
 * Parses the capacity string from a room to get the maximum number of guests.
 * Handles formats like:
 * - "For 1-2 persons"
 * - "Für 1–2 Personen"
 * - "2-4 persons"
 * - "Up to 6 guests"
 */
export function getRoomMaxCapacity(room: Room): number {
  const capacityStr = room.capacity || "";

  // Try to extract numbers from the capacity string
  // Handles both hyphen (-) and en-dash (–)
  const match = capacityStr.match(/(\d+)[-–]?(\d+)?/);

  if (!match) {
    // Default to 2 if we can't parse the capacity
    return 2;
  }

  // If there's a range (e.g., "2-4"), return the max (4)
  // If there's just a single number (e.g., "2"), return that
  const max = match[2] ? parseInt(match[2]) : parseInt(match[1]);

  return max || 2;
}

/**
 * Parses the capacity string to get the minimum number of guests.
 */
export function getRoomMinCapacity(room: Room): number {
  const capacityStr = room.capacity || "";

  const match = capacityStr.match(/(\d+)[-–]?(\d+)?/);

  if (!match) {
    return 1;
  }

  return parseInt(match[1]) || 1;
}

/**
 * Checks if a room can accommodate the specified number of guests.
 */
export function canRoomAccommodate(room: Room, totalGuests: number): boolean {
  const maxCapacity = getRoomMaxCapacity(room);
  return totalGuests <= maxCapacity;
}

/**
 * Finds rooms that can accommodate a specific number of guests.
 */
export function findSuitableRooms(
  rooms: Room[],
  totalGuests: number,
): Room[] {
  return rooms.filter((room) => canRoomAccommodate(room, totalGuests));
}

/**
 * Calculates how many additional guests a room can still accommodate.
 */
export function getRemainingCapacity(
  room: Room,
  currentGuests: number,
): number {
  const maxCapacity = getRoomMaxCapacity(room);
  return Math.max(0, maxCapacity - currentGuests);
}

/**
 * Auto-maps guests to rooms based on room capacity.
 * This is used when the guest count changes to distribute guests across selected rooms.
 */
export function autoMapGuestsToRooms(
  guestSelection: { adults: number; children: number; childAges: number[] },
  currentRooms: SelectedRoomData[],
  availableRooms: Room[],
  createPlaceholderRoom: (
    guests?: number,
    children?: number,
    childAges?: { age: number }[],
  ) => SelectedRoomData,
): SelectedRoomData[] {
  const totalGuests = guestSelection.adults + guestSelection.children;

  // If no rooms selected, create placeholder rooms to fit all guests
  if (currentRooms.length === 0) {
    // Find the largest room capacity
    const maxRoomCapacity =
      availableRooms.length > 0
        ? Math.max(...availableRooms.map(getRoomMaxCapacity))
        : 4;

    // Calculate how many rooms we need
    const roomsNeeded = Math.ceil(totalGuests / maxRoomCapacity);

    const newRooms: SelectedRoomData[] = [];
    let remainingAdults = guestSelection.adults;
    let remainingChildren = guestSelection.children;
    let childAgeIndex = 0;

    for (let i = 0; i < roomsNeeded; i++) {
      const guestsInThisRoom = Math.min(remainingAdults, maxRoomCapacity);
      const remainingCapacity = maxRoomCapacity - guestsInThisRoom;
      const childrenInThisRoom = Math.min(remainingChildren, remainingCapacity);

      const childAges: { age: number }[] = [];
      for (let j = 0; j < childrenInThisRoom; j++) {
        childAges.push({
          age: guestSelection.childAges[childAgeIndex] ?? 0,
        });
        childAgeIndex++;
      }

      newRooms.push(
        createPlaceholderRoom(guestsInThisRoom, childrenInThisRoom, childAges),
      );

      remainingAdults -= guestsInThisRoom;
      remainingChildren -= childrenInThisRoom;
    }

    return newRooms;
  }

  // Distribute guests across existing rooms
  const updatedRooms = [...currentRooms];
  let remainingAdults = guestSelection.adults;
  let remainingChildren = guestSelection.children;
  let childAgeIndex = 0;

  for (let i = 0; i < updatedRooms.length; i++) {
    const room = updatedRooms[i];
    const roomCapacity =
      room.room.id === "placeholder" && availableRooms.length > 0
        ? getRoomMaxCapacity(availableRooms[0])
        : getRoomMaxCapacity(room.room);

    // Assign adults first
    const adultsInThisRoom = Math.min(remainingAdults, roomCapacity);
    remainingAdults -= adultsInThisRoom;

    // Then children with remaining capacity
    const remainingCapacity = roomCapacity - adultsInThisRoom;
    const childrenInThisRoom = Math.min(remainingChildren, remainingCapacity);
    remainingChildren -= childrenInThisRoom;

    // Collect child ages for this room
    const childAges: { age: number }[] = [];
    for (let j = 0; j < childrenInThisRoom; j++) {
      childAges.push({
        age: guestSelection.childAges[childAgeIndex] ?? 0,
      });
      childAgeIndex++;
    }

    updatedRooms[i] = {
      ...room,
      guests: adultsInThisRoom,
      children: childrenInThisRoom,
      childAges,
    };
  }

  // If there are still unassigned guests, add more rooms
  while (remainingAdults > 0 || remainingChildren > 0) {
    const maxRoomCapacity =
      availableRooms.length > 0
        ? Math.max(...availableRooms.map(getRoomMaxCapacity))
        : 4;

    const guestsInNewRoom = Math.min(remainingAdults, maxRoomCapacity);
    const remainingCapacity = maxRoomCapacity - guestsInNewRoom;
    const childrenInNewRoom = Math.min(remainingChildren, remainingCapacity);

    const childAges: { age: number }[] = [];
    for (let j = 0; j < childrenInNewRoom; j++) {
      childAges.push({
        age: guestSelection.childAges[childAgeIndex] ?? 0,
      });
      childAgeIndex++;
    }

    updatedRooms.push(
      createPlaceholderRoom(guestsInNewRoom, childrenInNewRoom, childAges),
    );

    remainingAdults -= guestsInNewRoom;
    remainingChildren -= childrenInNewRoom;
  }

  return updatedRooms;
}

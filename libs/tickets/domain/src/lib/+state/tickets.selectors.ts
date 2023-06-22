import { createSelector } from "@ngrx/store";
import { ticketsFeature } from "./tickets.reducer";

export const selectActiveUserFlights = createSelector(
  // Selectors
  ticketsFeature.selectFlights,
  ticketsFeature.selectBookings,
  ticketsFeature.selectUser,
  // Projector
  (flights, bookings, user) => {
    const activeUserPassengerId = user.passengerId;
    const activeUserFlightIds = bookings
      .filter(b => b.passengerId === activeUserPassengerId)
      .map(b => b.flightId);
    const activeUserFlights = flights
      .filter(f => activeUserFlightIds.includes(f.id));

    return activeUserFlights;
  }
);

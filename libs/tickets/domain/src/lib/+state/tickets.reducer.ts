import { provideEffects } from '@ngrx/effects';
import { Store, createFeature, createReducer, createSelector, on, provideState } from "@ngrx/store";
import { Flight } from "../entities/flight";
import { ticketsActions } from "./tickets.actions";
import { EnvironmentProviders, inject, makeEnvironmentProviders } from "@angular/core";
import { TicketsEffects } from './tickets.effects';


export interface TicketsState {
  flights: Flight[];
  basket: Record<number, boolean>;
  statistics: unknown;
  passengers: Record<number, {
    id: number;
    firstname: string;
    lastname: string;
  }>;
  bookings: {
    flightId: number;
    passengerId: number;
  }[];
  user: {
    username: string;
    passengerId: number;
  };
}

export const initialTicketsState: TicketsState = {
  flights: [],
  basket: {},
  statistics: {},
  passengers: {
    1: {
      id: 1,
      firstname: 'Mary',
      lastname: 'Doe'
    }
  },
  bookings: [
    { flightId: 1342, passengerId: 1},
    // { flightId: 1343, passengerId: 1},
    { flightId: 1344, passengerId: 1}
  ],
  user: {
    username: 'mary.doe',
    passengerId: 1
  }
};


export const ticketsFeature = createFeature({
  name: 'tickets',
  reducer: createReducer(
    initialTicketsState,

    on(ticketsActions.flightsLoaded, (state, action) => ({
      ...state,
      flights: action.flights
    }))
  ),
  extraSelectors: ({
    selectFlights,
    selectBookings,
    selectUser
  }) => ({
    selectActiveUserFlights: createSelector(
      // Selectors
      selectFlights,
      selectBookings,
      selectUser,
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
    )
  })
});

export function provideTicketsFeature(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideState(ticketsFeature),
    provideEffects(TicketsEffects)
  ]);
}

export function injectTicketsFacade() {
  const store = inject(Store);

  return {
    flights$: store.select(ticketsFeature.selectFlights),
    search: (from: string, to: string) => store.dispatch(
      ticketsActions.flightsLoad({ from, to })
    )
  };
}

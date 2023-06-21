import { provideEffects } from '@ngrx/effects';
import { createFeature, createReducer, on, provideState } from "@ngrx/store";
import { Flight } from "../entities/flight";
import { ticketsActions } from "./tickets.actions";
import { EnvironmentProviders, makeEnvironmentProviders } from "@angular/core";


export interface TicketsState {
  flights: Flight[];
  basket: Record<number, boolean>;
  statistics: unknown;
}

export const initialTicketsState: TicketsState = {
  flights: [],
  basket: {},
  statistics: {}
};


export const ticketsFeature = createFeature({
  name: 'tickets',
  reducer: createReducer(
    initialTicketsState,

    on(ticketsActions.flightsLoaded, (state, action) => ({
      ...state,
      flights: action.flights
    }))
  )
});

export function provideTicketsFeature(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideState(ticketsFeature),
    provideEffects()
  ]);
}

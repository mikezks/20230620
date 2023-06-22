import { createActionGroup, props } from '@ngrx/store';
import { Flight } from '../entities/flight';


export const ticketsActions = createActionGroup({
  source: 'Tickets',
  events: {
    'Flights load': props<{ from: string; to: string }>(),
    'Flights loaded': props<{ flights: Flight[] }>(),
    'Flight update': props<{ flight: Flight }>()
  }
});

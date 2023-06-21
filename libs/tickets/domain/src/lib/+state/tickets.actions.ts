import { createActionGroup, props } from '@ngrx/store';
import { Flight } from '../entities/flight';


export const ticketsActions = createActionGroup({
  source: 'Tickets',
  events: {
    'Flights loaded': props<{ flights: Flight[] }>()
  }
});

import { CommonModule } from '@angular/common';
import { Component, Injector, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { CityPipe } from '@flight-demo/shared/ui-common';
import { Flight, injectTicketsFacade } from '@flight-demo/tickets/domain';
import { FlightCardComponent } from '../flight-card/flight-card.component';

@Component({
  selector: 'app-flight-search',
  standalone: true,
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.css'],
  imports: [CommonModule, FormsModule, CityPipe, FlightCardComponent],
})
export class FlightSearchComponent {
  ticketsFacade = injectTicketsFacade();
  injector = inject(Injector);

  from = signal('London', {
    equal: (a, b) => a === b
  });
  to = signal('New York');
  flights = toSignal(this.ticketsFacade.flights$, {
    requireSync: true
  });
  flightInfo = computed(() => `From ${ this.from() } to ${ this.to() }.`)

  selectedFlight: Flight | undefined;

  basket: Record<number, boolean> = {
    3: true,
    5: true,
  };

  constructor() {

    this.from.set('Wien');
    this.to.set('Frankfurt');

    console.log(this.from());
  }

  search(): void {
    effect(() => console.log(this.from(), this.to()), {
      injector: this.injector
    });
    if (!this.from || !this.to) {
      return;
    }

    // Reset properties
    this.selectedFlight = undefined;

    this.ticketsFacade.search(this.from(), this.to());
  }

  select(f: Flight): void {
    this.selectedFlight = { ...f };
  }
}

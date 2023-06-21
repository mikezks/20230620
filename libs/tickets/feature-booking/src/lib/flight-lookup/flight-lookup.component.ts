import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Flight, FlightLookupFacade, FlightService } from '@flight-demo/tickets/domain';
import { catchError, combineLatest, debounceTime, delay, filter, iif, map, merge, Observable, of, startWith, Subject, switchMap, takeUntil } from 'rxjs';


interface LookupViewModel {
  flights: Flight[];
  online: boolean;
  loading: boolean;
  error: unknown;
}


@Component({
  selector: 'tickets-flight-lookup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './flight-lookup.component.html',
  styleUrls: ['./flight-lookup.component.css'],
})
export class FlightLookupComponent implements OnInit, OnDestroy {
  private facade = inject(FlightLookupFacade);

  control = new FormControl('', { nonNullable: true });

  // Source
  private close$ = new Subject<void>();

  from$ = this.control.valueChanges.pipe(
    filter((v) => v.length >= 3),
    debounceTime(300)
  );

  // Sink
  flights$ = this.facade.flights$;
  error$ = this.facade.error$;
  loading$ = this.facade.loading$;
  online$ = this.facade.online$;

  vm$ = this.initComplexState();

  ngOnInit(): void {
    this.from$.subscribe((value) => {
      this.facade.lookup(value);
    });

    this.online$.pipe(takeUntil(this.close$)).subscribe((v) => {
      console.log('online', v);
    });
  }

  private flightService = inject(FlightService);

  private initComplexState(): Observable<LookupViewModel> {
    return combineLatest({
      input: this.from$,
      online: this.facade.online$
    }).pipe(
      switchMap(state => merge(
        // Loading State
        of({
          flights: [],
          online: state.online,
          loading: true,
          error: undefined
        }),
        iif(
          () => state.online,
          this.flightService.find(state.input, '').pipe(
            delay(1_000),
            // Loading Success State
            map(flights => ({
              flights,
              online: state.online,
              loading: false,
              error: undefined
            })),
            // Loading Error State
            catchError(err => of({
              flights: [],
              online: state.online,
              loading: false,
              error: err
            }))
          ),
          // Offline State
          of({
            flights: [],
            online: state.online,
            loading: false,
            error: undefined
          })
        )
      )),
      // Initial State
      startWith({
        flights: [],
        online: true,
        loading: false,
        error: undefined
      })
    );
  }

  ngOnDestroy(): void {
    this.close$.next();
  }
}

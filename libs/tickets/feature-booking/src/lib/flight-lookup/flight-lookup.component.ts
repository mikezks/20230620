import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlightLookupFacade } from '@flight-demo/tickets/domain';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, debounceTime, filter, map, share, Subject, Subscription, take, takeUntil, tap, timer } from 'rxjs';

@Component({
  selector: 'tickets-flight-lookup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './flight-lookup.component.html',
  styleUrls: ['./flight-lookup.component.css'],
})
export class FlightLookupComponent implements OnInit, OnDestroy {
  facade = inject(FlightLookupFacade);

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

  destroy$ = new Subject<void>();
  timer$ = timer(0, 1_000).pipe(
    tap(num => console.log('Observable Producer', num)),
    // take(5)
    // share()
    takeUntil(this.destroy$)
  );
  subscription = new Subscription();

  ngOnInit(): void {
    /* this.from$.subscribe((value) => {
      this.facade.lookup(value);
    });

    this.online$.pipe(takeUntil(this.close$)).subscribe((v) => {
      console.log('online', v);
    }); */

    this.rxjsDemo();
  }

  /* private stateService = inject(StateService);
  timerChild$ = this.stateService.timer$;
  customStream$ = this.timerChild$.pipe(
    map(num => num * 100),
    share()
  ); */

  rxjsDemo(): void {
    this.subscription.add(
      this.timer$.subscribe(console.log)
    );
  }

  ngOnDestroy(): void {
    this.close$.next();
    // this.subscription.unsubscribe();
    this.destroy$.next();
  }
}

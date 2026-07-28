import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  computed,
  effect,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { startWith } from 'rxjs';

import { I18nService } from '../../../../core/i18n/i18n.service';
import { TEXT_KEYS } from '../../../../core/i18n/text-keys';
import { AIRPORTS } from '../../data/airports.data';
import { FlightSearch } from '../../models/flight-search.model';
import {
  dateRangeValidator,
  differentAirportsValidator,
  passengerCountsValidator,
} from '../../utils/search.validators';

@Component({
  selector: 'search-form',
  imports: [ReactiveFormsModule],
  templateUrl: './search-form.html',
  styleUrl: './search-form.scss',
})
export class SearchForm implements OnChanges {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  protected readonly i18n = inject(I18nService);
  protected readonly textKeys = TEXT_KEYS;

  @Input() initialSearch: FlightSearch | null = null;
  @Output() readonly searchSubmitted = new EventEmitter<FlightSearch>();

  readonly airports = AIRPORTS;
  readonly today = new Date().toISOString().slice(0, 10);

  readonly form = this.formBuilder.group(
    {
      tripType: this.formBuilder.control<FlightSearch['tripType']>('one-way'),
      origin: this.formBuilder.control('', Validators.required),
      destination: this.formBuilder.control('', Validators.required),
      departureDate: this.formBuilder.control('', Validators.required),
      returnDate: this.formBuilder.control(''),
      passengers: this.formBuilder.group({
        adults: this.formBuilder.control(1, [Validators.required, Validators.min(1)]),
        children: this.formBuilder.control(0, [Validators.required, Validators.min(0)]),
        infants: this.formBuilder.control(0, [Validators.required, Validators.min(0)]),
      }),
    },
    {
      validators: [differentAirportsValidator, dateRangeValidator, passengerCountsValidator],
    },
  );

  private readonly selectedOrigin = toSignal(
    this.form.controls.origin.valueChanges.pipe(startWith(this.form.controls.origin.value)),
    { initialValue: this.form.controls.origin.value },
  );

  private readonly selectedPassengers = toSignal(
    this.form.controls.passengers.valueChanges.pipe(
      startWith(this.form.controls.passengers.getRawValue()),
    ),
    { initialValue: this.form.controls.passengers.getRawValue() },
  );

  readonly destinationAirports = computed(() =>
    this.airports.filter((airport) => airport.code !== this.selectedOrigin()),
  );

  readonly passengerTotal = computed(() => {
    const passengers = this.selectedPassengers();

    return (passengers.adults ?? 0) + (passengers.children ?? 0) + (passengers.infants ?? 0);
  });

  constructor() {
    effect(() => {
      const origin = this.selectedOrigin();

      if (origin && this.form.controls.destination.value === origin) {
        this.form.controls.destination.setValue('');
        this.form.updateValueAndValidity();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialSearch']) {
      this.patchInitialSearch();
    }
  }

  swapAirports(): void {
    const origin = this.form.controls.origin.value;
    const destination = this.form.controls.destination.value;

    this.form.patchValue({ origin: destination, destination: origin });
    this.form.updateValueAndValidity();
  }

  submitSearch(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();

    this.searchSubmitted.emit({
      ...value,
      returnDate: value.tripType === 'round-trip' ? value.returnDate : null,
    });
  }

  private patchInitialSearch(): void {
    const search = this.initialSearch;

    if (!search) {
      return;
    }

    this.form.reset({
      tripType: search.tripType,
      origin: search.origin,
      destination: search.destination,
      departureDate: search.departureDate,
      returnDate: search.returnDate ?? '',
      passengers: {
        adults: search.passengers.adults,
        children: search.passengers.children,
        infants: search.passengers.infants,
      },
    });
  }
}

import { computed, Injectable, signal } from '@angular/core';

import {
  ConfirmedBooking,
  PassengerDraft,
  SelectedFare,
  SelectedFlight,
} from '../models/booking-flow.model';
import { STORAGE_KEYS } from '../constants/storage-keys';
import { FlightSearch } from '../../features/search/models/flight-search.model';

@Injectable({ providedIn: 'root' })
export class BookingStore {
  private readonly searchState = signal<FlightSearch | null>(this.readSearch());
  private readonly selectedFlightState = signal<SelectedFlight | null>(null);
  private readonly selectedFareState = signal<SelectedFare | null>(null);
  private readonly passengersState = signal<PassengerDraft | null>(null);
  private readonly confirmedBookingState = signal<ConfirmedBooking | null>(null);

  readonly search = this.searchState.asReadonly();
  readonly selectedFlight = this.selectedFlightState.asReadonly();
  readonly selectedFare = this.selectedFareState.asReadonly();
  readonly passengers = this.passengersState.asReadonly();
  readonly confirmedBooking = this.confirmedBookingState.asReadonly();

  readonly hasSearch = computed(() => this.searchState() !== null);
  readonly hasSelectedFlight = computed(() => this.selectedFlightState() !== null);
  readonly hasSelectedFare = computed(() => this.selectedFareState() !== null);
  readonly hasValidPassengers = computed(() => this.passengersState()?.isValid === true);
  readonly hasConfirmedBooking = computed(() => this.confirmedBookingState() !== null);

  saveSearch(search: FlightSearch): void {
    this.searchState.set(search);
    this.selectedFlightState.set(null);
    this.selectedFareState.set(null);
    this.passengersState.set(null);
    this.confirmedBookingState.set(null);
    localStorage.setItem(STORAGE_KEYS.flightSearch, JSON.stringify(search));
  }

  clearSearch(): void {
    this.searchState.set(null);
    this.selectedFlightState.set(null);
    this.selectedFareState.set(null);
    this.passengersState.set(null);
    this.confirmedBookingState.set(null);
    localStorage.removeItem(STORAGE_KEYS.flightSearch);
  }

  private readSearch(): FlightSearch | null {
    const value = localStorage.getItem(STORAGE_KEYS.flightSearch);

    if (!value) {
      return null;
    }

    try {
      return JSON.parse(value) as FlightSearch;
    } catch {
      localStorage.removeItem(STORAGE_KEYS.flightSearch);
      return null;
    }
  }
}

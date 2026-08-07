import { computed, Injectable, signal } from '@angular/core';

import {
  ConfirmedBooking,
  PassengerDraft,
  SeatsDraft,
  ServicesDraft,
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
  private readonly seatsState = signal<SeatsDraft | null>(null);
  private readonly servicesState = signal<ServicesDraft | null>(null);
  private readonly confirmedBookingState = signal<ConfirmedBooking | null>(null);

  readonly search = this.searchState.asReadonly();
  readonly selectedFlight = this.selectedFlightState.asReadonly();
  readonly selectedFare = this.selectedFareState.asReadonly();
  readonly passengers = this.passengersState.asReadonly();
  readonly seats = this.seatsState.asReadonly();
  readonly services = this.servicesState.asReadonly();
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
    this.seatsState.set(null);
    this.servicesState.set(null);
    this.confirmedBookingState.set(null);
    localStorage.setItem(STORAGE_KEYS.flightSearch, JSON.stringify(search));
  }

  saveFlight(flight: SelectedFlight): void {
    this.selectedFlightState.set(flight);
    this.selectedFareState.set(null);
    this.passengersState.set(null);
    this.seatsState.set(null);
    this.servicesState.set(null);
    this.confirmedBookingState.set(null);
  }

  saveFare(fare: SelectedFare): void {
    this.selectedFareState.set(fare);
    this.passengersState.set(null);
    this.seatsState.set(null);
    this.servicesState.set(null);
    this.confirmedBookingState.set(null);
  }

  savePassengers(passengers: PassengerDraft): void {
    this.passengersState.set(passengers);
    this.seatsState.set(null);
    this.servicesState.set(null);
    this.confirmedBookingState.set(null);
  }

  saveSeats(seats: SeatsDraft): void {
    this.seatsState.set(seats);
    this.servicesState.set(null);
    this.confirmedBookingState.set(null);
  }

  saveServices(services: ServicesDraft): void {
    this.servicesState.set(services);
    this.confirmedBookingState.set(null);
  }

  clearSearch(): void {
    this.searchState.set(null);
    this.selectedFlightState.set(null);
    this.selectedFareState.set(null);
    this.passengersState.set(null);
    this.seatsState.set(null);
    this.servicesState.set(null);
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

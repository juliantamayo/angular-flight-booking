import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DsBottomSummary, DsBottomSummaryConfig } from '@skybooking/design-system';

import { I18nService } from '../../../../core/i18n/i18n.service';
import { TEXT_KEYS } from '../../../../core/i18n/text-keys';
import { BookingStore } from '../../../../core/state/booking.store';
import { AIRPORTS } from '../../../search/data/airports.data';
import { SearchForm } from '../../../search/components/search-form/search-form.component';
import { FlightSearch } from '../../../search/models/flight-search.model';
import { FlightCard } from '../../components/flight-card/flight-card.component';
import { SelectedFlightSummary } from '../../components/selected-flight-summary/selected-flight-summary.component';
import { FLIGHT_OPTIONS } from '../../data/flight-options.data';
import { FlightFare, FlightOption } from '../../models/flight-option.model';

type FlightDirection = 'outbound' | 'return';

interface SelectedFlightFare {
  readonly direction: FlightDirection;
  readonly flight: FlightOption;
  readonly fare: FlightFare;
}

@Component({
  selector: 'app-flight-results-page',
  imports: [DsBottomSummary, FlightCard, SearchForm, SelectedFlightSummary],
  templateUrl: './flight-results-page.component.html',
  styleUrl: './styles/flight-results-page.styles.scss',
})
export class FlightResultsPage {
  private readonly router = inject(Router);
  private readonly store = inject(BookingStore);
  protected readonly i18n = inject(I18nService);
  protected readonly textKeys = TEXT_KEYS;

  readonly search = this.store.search;
  readonly flights = FLIGHT_OPTIONS;
  readonly expandedFlightId = signal<string | null>(null);
  readonly isModifyOpen = signal(false);
  readonly activeDirection = signal<FlightDirection>('outbound');
  readonly outboundSelection = signal<SelectedFlightFare | null>(null);
  readonly returnSelection = signal<SelectedFlightFare | null>(null);
  readonly passengerTotal = computed(() => {
    const passengers = this.search()?.passengers;

    return passengers ? passengers.adults + passengers.children + passengers.infants : 0;
  });
  readonly canContinue = computed(() => {
    const search = this.search();

    if (!search) {
      return false;
    }

    return search.tripType === 'one-way'
      ? this.outboundSelection() !== null
      : this.outboundSelection() !== null && this.returnSelection() !== null;
  });
  readonly reservationTotal = computed(() => {
    const outbound = this.outboundSelection()?.fare.price ?? 0;
    const returnFare = this.returnSelection()?.fare.price ?? 0;

    return (outbound + returnFare) * this.passengerTotal();
  });
  readonly bottomSummaryConfig = computed<DsBottomSummaryConfig>(() => ({
    actionLabel: 'Continuar',
    total: this.formatCurrency(this.reservationTotal()),
    totalLabel: 'Total de tu reserva:',
  }));

  airportName(code: string): string {
    const airport = AIRPORTS.find((item) => item.code === code);
    return airport ? `${airport.city} (${airport.code})` : code;
  }

  airportCity(code: string): string {
    return AIRPORTS.find((item) => item.code === code)?.city ?? code;
  }

  dateSummary(search: FlightSearch): string {
    return search.returnDate ? `${search.departureDate} - ${search.returnDate}` : search.departureDate;
  }

  passengerSummary(): string {
    const total = this.passengerTotal();

    return total === 1 ? '1 Adulto' : `${total} Pasajeros`;
  }

  toggleModify(): void {
    this.isModifyOpen.update((isOpen) => !isOpen);
  }

  modifySearch(search: FlightSearch): void {
    this.store.saveSearch(search);
    this.resetSelections();
    this.expandedFlightId.set(null);
    this.isModifyOpen.set(false);
  }

  toggleFlight(flightId: string): void {
    this.expandedFlightId.update((currentFlightId) =>
      currentFlightId === flightId ? null : flightId,
    );
  }

  selectFare(flight: FlightOption, fare: FlightFare): void {
    const search = this.search();

    if (!search) {
      return;
    }

    const selection: SelectedFlightFare = {
      direction: this.activeDirection(),
      flight,
      fare,
    };

    if (selection.direction === 'outbound') {
      this.outboundSelection.set(selection);

      if (search.tripType === 'round-trip') {
        this.activeDirection.set('return');
        this.expandedFlightId.set(null);
        return;
      }
    } else {
      this.returnSelection.set(selection);
    }
  }

  continueBooking(): void {
    const search = this.search();
    const outbound = this.outboundSelection();

    if (!search || !outbound || !this.canContinue()) {
      return;
    }

    this.store.saveFlight({
      id: outbound.flight.id,
      flightNumber: outbound.flight.flightNumber,
      operator: outbound.flight.operator,
      origin: search.origin,
      destination: search.destination,
      departureTime: outbound.flight.departureTime,
      arrivalTime: outbound.flight.arrivalTime,
      durationMinutes: outbound.flight.durationMinutes,
    });
    this.store.saveFare({
      code: outbound.fare.code,
      name: outbound.fare.name,
      cabin: outbound.fare.cabin,
      price: this.reservationTotal(),
    });

    void this.router.navigate(['/passengers']);
  }

  editSelection(direction: FlightDirection): void {
    this.activeDirection.set(direction);
    this.expandedFlightId.set(null);

    if (direction === 'outbound') {
      this.outboundSelection.set(null);
      this.returnSelection.set(null);
    } else {
      this.returnSelection.set(null);
    }
  }

  selectedOrigin(search: FlightSearch, direction: FlightDirection): string {
    return direction === 'outbound' ? search.origin : search.destination;
  }

  selectedDestination(search: FlightSearch, direction: FlightDirection): string {
    return direction === 'outbound' ? search.destination : search.origin;
  }

  selectedDate(search: FlightSearch, direction: FlightDirection): string {
    return direction === 'outbound' ? search.departureDate : (search.returnDate ?? search.departureDate);
  }

  directionTitle(search: FlightSearch): string {
    const origin = this.airportCity(this.selectedOrigin(search, this.activeDirection()));
    const destination = this.airportCity(this.selectedDestination(search, this.activeDirection()));

    return this.activeDirection() === 'outbound'
      ? `Vuelo de ida ${origin} a ${destination}`
      : `Vuelo de vuelta ${origin} a ${destination}`;
  }

  segmentTitle(search: FlightSearch, direction: FlightDirection): string {
    const origin = this.airportCity(this.selectedOrigin(search, direction));
    const destination = this.airportCity(this.selectedDestination(search, direction));

    return direction === 'outbound'
      ? `Vuelo de ida ${origin} a ${destination}`
      : `Vuelo de vuelta ${origin} a ${destination}`;
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-CO', {
      currency: 'COP',
      maximumFractionDigits: 0,
      style: 'currency',
    }).format(value);
  }

  private resetSelections(): void {
    this.activeDirection.set('outbound');
    this.outboundSelection.set(null);
    this.returnSelection.set(null);
  }
}

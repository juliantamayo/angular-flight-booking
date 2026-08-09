import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DsBottomSummary, DsBottomSummaryConfig } from '@skybooking/design-system';

import { I18nService } from '../../../../core/i18n/i18n.service';
import { TEXT_KEYS } from '../../../../core/i18n/text-keys';
import { SeatColumn, SelectedSeat } from '../../../../core/models/booking-flow.model';
import { BookingStore } from '../../../../core/state/booking.store';
import { BookingStepIndicator } from '../../../../shared/components/booking-step-indicator/booking-step-indicator.component';

interface SeatOption {
  readonly column: SeatColumn;
  readonly isEmergencyExit: boolean;
  readonly isOccupied: boolean;
  readonly label: string;
  readonly price: number;
  readonly row: number;
  readonly type: 'standard' | 'preferred' | 'extra-legroom';
}

@Component({
  selector: 'app-seats-page',
  imports: [BookingStepIndicator, DsBottomSummary],
  templateUrl: './seats-page.component.html',
  styleUrl: './styles/seats-page.styles.scss',
})
export class SeatsPage {
  protected readonly i18n = inject(I18nService);
  private readonly router = inject(Router);
  private readonly store = inject(BookingStore);
  protected readonly textKeys = TEXT_KEYS;
  private readonly occupiedSeatLabels = new Set(['1A', '1D', '1F', '2B', '2E', '4A', '4B', '4C', '6D', '8F']);

  readonly columns: readonly SeatColumn[] = ['A', 'B', 'C', 'D', 'E', 'F'];
  readonly activePassengerIndex = signal(0);
  readonly selectedFlight = this.store.selectedFlight;
  readonly selectedFare = this.store.selectedFare;
  readonly selectedSeatsByPassenger = signal<ReadonlyMap<number, SeatOption>>(new Map());
  readonly rows = Array.from({ length: 15 }, (_, index) => index + 1);
  readonly passengerNames = computed(() => {
    const passengers = this.store.passengers()?.passengers ?? [];

    return passengers.map((passenger, index) => {
      const name = `${passenger.firstName} ${passenger.lastName}`.trim();
      return name || `${this.i18n.translate(this.textKeys.seats.page.fallbackPassenger)} ${index + 1}`;
    });
  });
  readonly selectedSeats = computed(() =>
    Array.from(this.selectedSeatsByPassenger().entries()).map(
      ([passengerIndex, seat]): SelectedSeat => ({
        column: seat.column,
        label: seat.label,
        passengerIndex,
        price: seat.price,
        row: seat.row,
      }),
    ),
  );
  readonly seatsTotal = computed(() =>
    this.selectedSeats().reduce((total, seat) => total + seat.price, 0),
  );
  readonly reservationTotal = computed(() => (this.selectedFare()?.price ?? 0) + this.seatsTotal());
  readonly bottomSummaryConfig = computed<DsBottomSummaryConfig>(() => ({
    actionLabel: this.i18n.translate(this.textKeys.common.continue),
    closeSummaryAriaLabel: this.i18n.translate(this.textKeys.common.purchaseSummaryCloseAriaLabel),
    summaryAriaLabel: this.i18n.translate(this.textKeys.common.purchaseSummaryAriaLabel),
    summarySections: [
      {
        title: this.i18n.translate(this.textKeys.seats.summary.flight),
        items: [
          {
            label: this.flightRouteLabel(),
            meta: this.flightMetaLabel(),
            value:
              this.selectedFlight()?.flightNumber ??
              this.i18n.translate(this.textKeys.seats.summary.pending),
          },
          {
            label: this.i18n.translate(this.textKeys.seats.summary.fare),
            meta:
              this.selectedFare()?.cabin === 'business'
                ? this.i18n.translate(this.textKeys.seats.summary.cabinBusiness)
                : this.i18n.translate(this.textKeys.seats.summary.cabinEconomy),
            value:
              this.selectedFare()?.name ??
              this.i18n.translate(this.textKeys.seats.summary.pending),
          },
        ],
      },
      {
        title: this.i18n.translate(this.textKeys.seats.summary.seats),
        items: this.seatSummaryItems(),
      },
    ],
    summaryTitle: this.i18n.translate(this.textKeys.common.purchaseSummaryTitle),
    total: this.formatCurrency(this.reservationTotal()),
    totalLabel: this.i18n.translate(this.textKeys.seats.summary.totalLabel),
  }));

  seat(row: number, column: SeatColumn): SeatOption {
    const label = `${row}${column}`;
    const isEmergencyExit = row === 11 || row === 12;
    const type = isEmergencyExit ? 'extra-legroom' : row <= 3 ? 'preferred' : 'standard';

    return {
      column,
      isEmergencyExit,
      isOccupied: this.occupiedSeatLabels.has(label),
      label,
      price: type === 'extra-legroom' ? 65000 : type === 'preferred' ? 42000 : 0,
      row,
      type,
    };
  }

  selectPassenger(index: number): void {
    this.activePassengerIndex.set(index);
  }

  selectSeat(seat: SeatOption): void {
    if (seat.isOccupied || this.isSelectedByAnotherPassenger(seat)) {
      return;
    }

    const nextSelectedSeats = new Map(this.selectedSeatsByPassenger());
    nextSelectedSeats.set(this.activePassengerIndex(), seat);
    this.selectedSeatsByPassenger.set(nextSelectedSeats);
    this.moveToNextPendingPassenger();
  }

  seatState(seat: SeatOption): string {
    if (seat.isOccupied) {
      return this.i18n.translate(this.textKeys.seats.page.statusOccupied);
    }

    if (this.isSelectedByCurrentPassenger(seat)) {
      return this.i18n.translate(this.textKeys.seats.page.statusSelected);
    }

    if (this.isSelectedByAnotherPassenger(seat)) {
      return this.i18n.translate(this.textKeys.seats.page.statusAssigned);
    }

    return seat.price ? this.formatCurrency(seat.price) : this.i18n.translate(this.textKeys.seats.page.statusNoCost);
  }

  seatAriaLabel(seat: SeatOption): string {
    return `${this.i18n.translate(this.textKeys.seats.page.seatAriaPrefix)} ${seat.label}, ${this.seatState(seat)}`;
  }

  selectedSeatForPassenger(index: number): SeatOption | undefined {
    return this.selectedSeatsByPassenger().get(index);
  }

  isSelectedByCurrentPassenger(seat: SeatOption): boolean {
    return this.selectedSeatsByPassenger().get(this.activePassengerIndex())?.label === seat.label;
  }

  isSelectedByAnotherPassenger(seat: SeatOption): boolean {
    return Array.from(this.selectedSeatsByPassenger().entries()).some(
      ([passengerIndex, selectedSeat]) =>
        passengerIndex !== this.activePassengerIndex() && selectedSeat.label === seat.label,
    );
  }

  continueToServices(): void {
    this.store.saveSeats({
      selectedSeats: this.selectedSeats(),
      total: this.seatsTotal(),
    });

    void this.router.navigate(['/services']);
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-CO', {
      currency: 'COP',
      maximumFractionDigits: 0,
      style: 'currency',
    }).format(value);
  }

  private flightRouteLabel(): string {
    const flight = this.selectedFlight();

    return flight
      ? `${flight.origin} a ${flight.destination}`
      : this.i18n.translate(this.textKeys.seats.summary.selectedFlightFallback);
  }

  private flightMetaLabel(): string {
    const flight = this.selectedFlight();

    return flight
      ? `${flight.departureTime} - ${flight.arrivalTime}, ${this.durationLabel(flight.durationMinutes)}`
      : this.i18n.translate(this.textKeys.seats.summary.pending);
  }

  private seatSummaryItems(): readonly { label: string; meta?: string; value: string }[] {
    if (!this.selectedSeats().length) {
      return [
        {
          label: this.i18n.translate(this.textKeys.seats.summary.seatSelection),
          value: this.i18n.translate(this.textKeys.seats.summary.noSeats),
        },
      ];
    }

    return this.passengerNames().map((passengerName, index) => {
      const selectedSeat = this.selectedSeatForPassenger(index);

      return {
        label: passengerName,
        meta: selectedSeat ? this.formatCurrency(selectedSeat.price) : undefined,
        value: selectedSeat?.label ?? this.i18n.translate(this.textKeys.seats.page.noSeat),
      };
    });
  }

  private durationLabel(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (!hours) {
      return `${remainingMinutes}m`;
    }

    return remainingMinutes ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  }

  private moveToNextPendingPassenger(): void {
    const nextPassengerIndex = this.passengerNames().findIndex(
      (_, index) => !this.selectedSeatsByPassenger().has(index),
    );

    if (nextPassengerIndex >= 0) {
      this.activePassengerIndex.set(nextPassengerIndex);
    }
  }
}

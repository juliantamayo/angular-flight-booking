import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DsBottomSummary, DsBottomSummaryConfig } from '@skybooking/design-system';

import { SeatColumn, SelectedSeat } from '../../../../core/models/booking-flow.model';
import { BookingStore } from '../../../../core/state/booking.store';

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
  imports: [DsBottomSummary],
  templateUrl: './seats-page.component.html',
  styleUrl: './styles/seats-page.styles.scss',
})
export class SeatsPage {
  private readonly router = inject(Router);
  private readonly store = inject(BookingStore);
  private readonly occupiedSeatLabels = new Set(['1A', '1D', '1F', '2B', '2E', '4A', '4B', '4C', '6D', '8F']);

  readonly columns: readonly SeatColumn[] = ['A', 'B', 'C', 'D', 'E', 'F'];
  readonly activePassengerIndex = signal(0);
  readonly selectedFare = this.store.selectedFare;
  readonly selectedSeatsByPassenger = signal<ReadonlyMap<number, SeatOption>>(new Map());
  readonly rows = Array.from({ length: 15 }, (_, index) => index + 1);
  readonly passengerNames = computed(() => {
    const passengers = this.store.passengers()?.passengers ?? [];

    return passengers.map((passenger, index) => {
      const name = `${passenger.firstName} ${passenger.lastName}`.trim();
      return name || `Pasajero ${index + 1}`;
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
    actionLabel: 'Continuar',
    total: this.formatCurrency(this.reservationTotal()),
    totalLabel: 'Total de tu reserva:',
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
      return 'Ocupado';
    }

    if (this.isSelectedByCurrentPassenger(seat)) {
      return 'Seleccionado';
    }

    if (this.isSelectedByAnotherPassenger(seat)) {
      return 'Asignado';
    }

    return seat.price ? this.formatCurrency(seat.price) : 'Sin costo';
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

  private moveToNextPendingPassenger(): void {
    const nextPassengerIndex = this.passengerNames().findIndex(
      (_, index) => !this.selectedSeatsByPassenger().has(index),
    );

    if (nextPassengerIndex >= 0) {
      this.activePassengerIndex.set(nextPassengerIndex);
    }
  }
}

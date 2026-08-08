import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';

import { BookingStore } from '../../../../core/state/booking.store';

@Component({
  selector: 'app-confirmation-page',
  templateUrl: './confirmation-page.component.html',
  styleUrl: './styles/confirmation-page.styles.scss',
})
export class ConfirmationPage {
  private readonly router = inject(Router);
  private readonly store = inject(BookingStore);

  readonly confirmedBooking = this.store.confirmedBooking;
  readonly selectedFare = this.store.selectedFare;
  readonly selectedFlight = this.store.selectedFlight;
  readonly passengers = this.store.passengers;
  readonly selectedSeats = this.store.seats;
  readonly selectedServices = this.store.services;
  readonly reservationTotal = computed(
    () =>
      (this.selectedFare()?.price ?? 0) +
      (this.selectedSeats()?.total ?? 0) +
      (this.selectedServices()?.total ?? 0),
  );

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-CO', {
      currency: 'COP',
      maximumFractionDigits: 0,
      style: 'currency',
    }).format(value);
  }

  passengerName(index: number): string {
    const passenger = this.passengers()?.passengers[index];
    const name = `${passenger?.firstName ?? ''} ${passenger?.lastName ?? ''}`.trim();

    return name || `Pasajero ${index + 1}`;
  }

  passengerType(index: number): string {
    const type = this.passengers()?.passengers[index]?.type;

    if (type === 'child') {
      return 'Nino';
    }

    if (type === 'infant') {
      return 'Infante';
    }

    return 'Adulto';
  }

  seatForPassenger(index: number): string {
    return (
      this.selectedSeats()?.selectedSeats.find((seat) => seat.passengerIndex === index)?.label ??
      'Sin asiento'
    );
  }

  returnHome(): void {
    this.store.clearSearch();
    void this.router.navigate(['/search']);
  }
}

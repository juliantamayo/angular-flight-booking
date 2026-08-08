import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DsBottomSummary, DsBottomSummaryConfig } from '@skybooking/design-system';

import { BookingStore } from '../../../../core/state/booking.store';

@Component({
  selector: 'app-payment-page',
  imports: [DsBottomSummary],
  templateUrl: './payment-page.component.html',
  styleUrl: './styles/payment-page.styles.scss',
})
export class PaymentPage {
  private readonly router = inject(Router);
  private readonly store = inject(BookingStore);

  readonly selectedFare = this.store.selectedFare;
  readonly selectedFlight = this.store.selectedFlight;
  readonly selectedSeats = this.store.seats;
  readonly selectedServices = this.store.services;
  readonly reservationTotal = computed(
    () =>
      (this.selectedFare()?.price ?? 0) +
      (this.selectedSeats()?.total ?? 0) +
      (this.selectedServices()?.total ?? 0),
  );
  readonly bottomSummaryConfig = computed<DsBottomSummaryConfig>(() => ({
    actionAriaLabel: 'Pagar reserva simulada',
    actionLabel: 'Pagar',
    summaryAriaLabel: 'Ver resumen de compra',
    summarySections: [
      {
        title: 'Vuelo',
        items: [
          {
            label: this.flightRouteLabel(),
            meta: this.flightMetaLabel(),
            value: this.selectedFlight()?.flightNumber ?? 'Pendiente',
          },
          {
            label: 'Tarifa',
            meta: this.selectedFare()?.cabin === 'business' ? 'Business Class' : 'Economy',
            value: this.selectedFare()?.name ?? 'Pendiente',
          },
        ],
      },
      {
        title: 'Asientos',
        items: this.seatSummaryItems(),
      },
      {
        title: 'Servicios',
        items: this.serviceSummaryItems(),
      },
    ],
    summaryTitle: 'Resumen de compra',
    total: this.formatCurrency(this.reservationTotal()),
    totalLabel: 'Total a pagar:',
  }));

  payBooking(): void {
    this.store.confirmBooking({
      code: `SB-${Date.now().toString().slice(-6)}`,
    });

    void this.router.navigate(['/confirmation']);
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

    return flight ? `${flight.origin} a ${flight.destination}` : 'Vuelo seleccionado';
  }

  private flightMetaLabel(): string {
    const flight = this.selectedFlight();

    return flight
      ? `${flight.departureTime} - ${flight.arrivalTime}, ${this.durationLabel(flight.durationMinutes)}`
      : 'Pendiente';
  }

  private seatSummaryItems(): readonly { label: string; meta?: string; value: string }[] {
    const seats = this.selectedSeats()?.selectedSeats ?? [];

    if (!seats.length) {
      return [
        {
          label: 'Seleccion',
          value: 'Sin asientos',
        },
      ];
    }

    return seats.map((seat) => ({
      label: `Pasajero ${seat.passengerIndex + 1}`,
      meta: this.formatCurrency(seat.price),
      value: seat.label,
    }));
  }

  private serviceSummaryItems(): readonly { label: string; meta?: string; value: string }[] {
    const services = this.selectedServices()?.selectedServices ?? [];

    if (!services.length) {
      return [
        {
          label: 'Servicios adicionales',
          value: 'Sin agregar',
        },
      ];
    }

    return services.map((service) => ({
      label: service.name,
      value: this.formatCurrency(service.price),
    }));
  }

  private durationLabel(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (!hours) {
      return `${remainingMinutes}m`;
    }

    return remainingMinutes ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  }
}

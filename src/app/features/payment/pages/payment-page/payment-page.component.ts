import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DsBottomSummary, DsBottomSummaryConfig } from '@skybooking/design-system';

import { I18nService } from '../../../../core/i18n/i18n.service';
import { TEXT_KEYS } from '../../../../core/i18n/text-keys';
import { BookingStore } from '../../../../core/state/booking.store';
import { BookingStepIndicator } from '../../../../shared/components/booking-step-indicator/booking-step-indicator.component';

@Component({
  selector: 'app-payment-page',
  imports: [BookingStepIndicator, DsBottomSummary],
  templateUrl: './payment-page.component.html',
  styleUrl: './styles/payment-page.styles.scss',
})
export class PaymentPage {
  protected readonly i18n = inject(I18nService);
  private readonly router = inject(Router);
  private readonly store = inject(BookingStore);
  protected readonly textKeys = TEXT_KEYS;

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
    actionAriaLabel: this.i18n.translate(this.textKeys.payment.summary.actionAriaLabel),
    actionLabel: this.i18n.translate(this.textKeys.payment.summary.actionLabel),
    closeSummaryAriaLabel: this.i18n.translate(this.textKeys.common.purchaseSummaryCloseAriaLabel),
    summaryAriaLabel: this.i18n.translate(this.textKeys.common.purchaseSummaryAriaLabel),
    summarySections: [
      {
        title: this.i18n.translate(this.textKeys.payment.summary.flight),
        items: [
          {
            label: this.flightRouteLabel(),
            meta: this.flightMetaLabel(),
            value:
              this.selectedFlight()?.flightNumber ??
              this.i18n.translate(this.textKeys.payment.summary.pending),
          },
          {
            label: this.i18n.translate(this.textKeys.payment.summary.fare),
            meta:
              this.selectedFare()?.cabin === 'business'
                ? this.i18n.translate(this.textKeys.payment.summary.cabinBusiness)
                : this.i18n.translate(this.textKeys.payment.summary.cabinEconomy),
            value:
              this.selectedFare()?.name ?? this.i18n.translate(this.textKeys.payment.summary.pending),
          },
        ],
      },
      {
        title: this.i18n.translate(this.textKeys.payment.summary.seats),
        items: this.seatSummaryItems(),
      },
      {
        title: this.i18n.translate(this.textKeys.payment.summary.services),
        items: this.serviceSummaryItems(),
      },
    ],
    summaryTitle: this.i18n.translate(this.textKeys.common.purchaseSummaryTitle),
    total: this.formatCurrency(this.reservationTotal()),
    totalLabel: this.i18n.translate(this.textKeys.payment.summary.totalLabel),
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

    return flight
      ? `${flight.origin} a ${flight.destination}`
      : this.i18n.translate(this.textKeys.payment.summary.selectedFlightFallback);
  }

  private flightMetaLabel(): string {
    const flight = this.selectedFlight();

    return flight
      ? `${flight.departureTime} - ${flight.arrivalTime}, ${this.durationLabel(flight.durationMinutes)}`
      : this.i18n.translate(this.textKeys.payment.summary.pending);
  }

  private seatSummaryItems(): readonly { label: string; meta?: string; value: string }[] {
    const seats = this.selectedSeats()?.selectedSeats ?? [];

    if (!seats.length) {
      return [
        {
          label: this.i18n.translate(this.textKeys.payment.summary.seatSelection),
          value: this.i18n.translate(this.textKeys.payment.summary.noSeats),
        },
      ];
    }

    return seats.map((seat) => ({
      label: `${this.i18n.translate(this.textKeys.payment.summary.passenger)} ${seat.passengerIndex + 1}`,
      meta: this.formatCurrency(seat.price),
      value: seat.label,
    }));
  }

  private serviceSummaryItems(): readonly { label: string; meta?: string; value: string }[] {
    const services = this.selectedServices()?.selectedServices ?? [];

    if (!services.length) {
      return [
        {
          label: this.i18n.translate(this.textKeys.payment.summary.services),
          value: this.i18n.translate(this.textKeys.payment.summary.noServices),
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

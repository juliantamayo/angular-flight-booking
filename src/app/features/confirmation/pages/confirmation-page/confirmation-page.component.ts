import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DsIcon } from '@skybooking/design-system';

import { I18nService } from '../../../../core/i18n/i18n.service';
import { TEXT_KEYS, TranslationKey } from '../../../../core/i18n/text-keys';
import { PassengerInfo } from '../../../../core/models/booking-flow.model';
import { BookingStore } from '../../../../core/state/booking.store';

@Component({
  selector: 'app-confirmation-page',
  imports: [DsIcon],
  templateUrl: './confirmation-page.component.html',
  styleUrl: './styles/confirmation-page.styles.scss',
})
export class ConfirmationPage {
  protected readonly i18n = inject(I18nService);
  protected readonly textKeys = TEXT_KEYS;
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

    return name || `${this.i18n.translate(this.textKeys.confirmation.passengerFallback)} ${index + 1}`;
  }

  passengerType(index: number): string {
    const type = this.passengers()?.passengers[index]?.type ?? 'adult';
    const keyByType: Record<PassengerInfo['type'], TranslationKey> = {
      adult: this.textKeys.confirmation.passengerAdult,
      child: this.textKeys.confirmation.passengerChild,
      infant: this.textKeys.confirmation.passengerInfant,
    };

    return this.i18n.translate(keyByType[type]);
  }

  seatForPassenger(index: number): string {
    return (
      this.selectedSeats()?.selectedSeats.find((seat) => seat.passengerIndex === index)?.label ??
      this.i18n.translate(this.textKeys.confirmation.noSeat)
    );
  }

  returnHome(): void {
    this.store.clearSearch();
    void this.router.navigate(['/search']);
  }
}

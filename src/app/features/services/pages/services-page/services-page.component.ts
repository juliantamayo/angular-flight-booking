import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DsBottomSummary, DsBottomSummaryConfig } from '@skybooking/design-system';

import { I18nService } from '../../../../core/i18n/i18n.service';
import { TEXT_KEYS, TranslationKey } from '../../../../core/i18n/text-keys';
import { ServiceCode, SelectedService } from '../../../../core/models/booking-flow.model';
import { BookingStore } from '../../../../core/state/booking.store';
import { BookingStepIndicator } from '../../../../shared/components/booking-step-indicator/booking-step-indicator.component';

interface ServiceOption {
  readonly code: ServiceCode;
  readonly descriptionKey: TranslationKey;
  readonly nameKey: TranslationKey;
  readonly price: number;
}

@Component({
  selector: 'app-services-page',
  imports: [BookingStepIndicator, DsBottomSummary],
  templateUrl: './services-page.component.html',
  styleUrl: './styles/services-page.styles.scss',
})
export class ServicesPage {
  protected readonly i18n = inject(I18nService);
  private readonly router = inject(Router);
  private readonly store = inject(BookingStore);
  protected readonly textKeys = TEXT_KEYS;

  readonly selectedFare = this.store.selectedFare;
  readonly selectedFlight = this.store.selectedFlight;
  readonly selectedSeats = this.store.seats;
  readonly selectedServiceCodes = signal<ReadonlySet<ServiceCode>>(new Set());
  readonly services: readonly ServiceOption[] = [
    {
      code: 'extra-bag',
      descriptionKey: TEXT_KEYS.services.options.extraBagDescription,
      nameKey: TEXT_KEYS.services.options.extraBagName,
      price: 89000,
    },
    {
      code: 'priority-boarding',
      descriptionKey: TEXT_KEYS.services.options.priorityBoardingDescription,
      nameKey: TEXT_KEYS.services.options.priorityBoardingName,
      price: 36000,
    },
    {
      code: 'travel-insurance',
      descriptionKey: TEXT_KEYS.services.options.travelInsuranceDescription,
      nameKey: TEXT_KEYS.services.options.travelInsuranceName,
      price: 52000,
    },
    {
      code: 'flex-assistance',
      descriptionKey: TEXT_KEYS.services.options.flexAssistanceDescription,
      nameKey: TEXT_KEYS.services.options.flexAssistanceName,
      price: 42000,
    },
  ];
  readonly selectedServices = computed(() =>
    this.services.filter((service) => this.selectedServiceCodes().has(service.code)),
  );
  readonly servicesTotal = computed(() =>
    this.selectedServices().reduce((total, service) => total + service.price, 0),
  );
  readonly reservationTotal = computed(
    () =>
      (this.selectedFare()?.price ?? 0) + (this.selectedSeats()?.total ?? 0) + this.servicesTotal(),
  );
  readonly bottomSummaryConfig = computed<DsBottomSummaryConfig>(() => ({
    actionLabel: this.i18n.translate(this.textKeys.common.continue),
    summaryAriaLabel: this.i18n.translate(this.textKeys.services.summary.ariaLabel),
    summarySections: [
      {
        title: this.i18n.translate(this.textKeys.services.summary.flight),
        items: [
          {
            label: this.flightRouteLabel(),
            meta: this.flightMetaLabel(),
            value:
              this.selectedFlight()?.flightNumber ??
              this.i18n.translate(this.textKeys.services.summary.pending),
          },
          {
            label: this.i18n.translate(this.textKeys.services.summary.fare),
            meta:
              this.selectedFare()?.cabin === 'business'
                ? this.i18n.translate(this.textKeys.services.summary.cabinBusiness)
                : this.i18n.translate(this.textKeys.services.summary.cabinEconomy),
            value:
              this.selectedFare()?.name ?? this.i18n.translate(this.textKeys.services.summary.pending),
          },
        ],
      },
      {
        title: this.i18n.translate(this.textKeys.services.summary.seats),
        items: this.seatSummaryItems(),
      },
      {
        title: this.i18n.translate(this.textKeys.services.summary.services),
        items: this.serviceSummaryItems(),
      },
    ],
    summaryTitle: this.i18n.translate(this.textKeys.services.summary.title),
    total: this.formatCurrency(this.reservationTotal()),
    totalLabel: this.i18n.translate(this.textKeys.services.page.totalLabel),
  }));

  isSelected(code: ServiceCode): boolean {
    return this.selectedServiceCodes().has(code);
  }

  toggleService(code: ServiceCode, checked: boolean): void {
    const nextSelectedServices = new Set(this.selectedServiceCodes());

    if (checked) {
      nextSelectedServices.add(code);
    } else {
      nextSelectedServices.delete(code);
    }

    this.selectedServiceCodes.set(nextSelectedServices);
  }

  continueToPayment(): void {
    this.store.saveServices({
      selectedServices: this.selectedServices().map((service): SelectedService => ({
        code: service.code,
        name: this.i18n.translate(service.nameKey),
        price: service.price,
      })),
      total: this.servicesTotal(),
    });

    void this.router.navigate(['/payment']);
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
      : this.i18n.translate(this.textKeys.services.summary.selectedFlightFallback);
  }

  private flightMetaLabel(): string {
    const flight = this.selectedFlight();

    return flight
      ? `${flight.departureTime} - ${flight.arrivalTime}, ${this.durationLabel(flight.durationMinutes)}`
      : this.i18n.translate(this.textKeys.services.summary.pending);
  }

  private seatSummaryItems(): readonly { label: string; meta?: string; value: string }[] {
    const seats = this.selectedSeats()?.selectedSeats ?? [];

    if (!seats.length) {
      return [
        {
          label: this.i18n.translate(this.textKeys.services.summary.seatSelection),
          value: this.i18n.translate(this.textKeys.services.summary.noSeats),
        },
      ];
    }

    return seats.map((seat) => ({
      label: `${this.i18n.translate(this.textKeys.services.summary.passenger)} ${seat.passengerIndex + 1}`,
      meta: this.formatCurrency(seat.price),
      value: seat.label,
    }));
  }

  private serviceSummaryItems(): readonly { label: string; meta?: string; value: string }[] {
    if (!this.selectedServices().length) {
      return [
        {
          label: this.i18n.translate(this.textKeys.services.page.title),
          value: this.i18n.translate(this.textKeys.services.summary.noServices),
        },
      ];
    }

    return this.selectedServices().map((service) => ({
      label: this.i18n.translate(service.nameKey),
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

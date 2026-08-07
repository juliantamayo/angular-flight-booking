import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DsBottomSummary, DsBottomSummaryConfig } from '@skybooking/design-system';

import { ServiceCode, SelectedService } from '../../../../core/models/booking-flow.model';
import { BookingStore } from '../../../../core/state/booking.store';

interface ServiceOption {
  readonly code: ServiceCode;
  readonly description: string;
  readonly name: string;
  readonly price: number;
}

@Component({
  selector: 'app-services-page',
  imports: [DsBottomSummary],
  templateUrl: './services-page.component.html',
  styleUrl: './styles/services-page.styles.scss',
})
export class ServicesPage {
  private readonly router = inject(Router);
  private readonly store = inject(BookingStore);

  readonly selectedFare = this.store.selectedFare;
  readonly selectedFlight = this.store.selectedFlight;
  readonly selectedSeats = this.store.seats;
  readonly selectedServiceCodes = signal<ReadonlySet<ServiceCode>>(new Set());
  readonly services: readonly ServiceOption[] = [
    {
      code: 'extra-bag',
      description: 'Agrega una maleta de bodega de 23 kg para tu viaje.',
      name: 'Equipaje adicional',
      price: 89000,
    },
    {
      code: 'priority-boarding',
      description: 'Aborda antes y manten tus objetos esenciales cerca.',
      name: 'Embarque prioritario',
      price: 36000,
    },
    {
      code: 'travel-insurance',
      description: 'Proteccion basica para imprevistos antes y durante el viaje.',
      name: 'Asistencia de viaje',
      price: 52000,
    },
    {
      code: 'flex-assistance',
      description: 'Soporte preferencial para cambios o dudas sobre tu reserva.',
      name: 'Soporte flexible',
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
    actionLabel: 'Continuar',
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
    totalLabel: 'Total de tu reserva:',
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

  continueToReview(): void {
    this.store.saveServices({
      selectedServices: this.selectedServices().map((service): SelectedService => ({
        code: service.code,
        name: service.name,
        price: service.price,
      })),
      total: this.servicesTotal(),
    });

    void this.router.navigate(['/review']);
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
    if (!this.selectedServices().length) {
      return [
        {
          label: 'Servicios adicionales',
          value: 'Sin agregar',
        },
      ];
    }

    return this.selectedServices().map((service) => ({
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

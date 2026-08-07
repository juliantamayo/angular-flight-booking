import { Component, EventEmitter, Input, Output } from '@angular/core';

import { FlightFare, FlightOption } from '../../models/flight-option.model';

@Component({
  selector: 'selected-flight-summary',
  templateUrl: './selected-flight-summary.component.html',
  styleUrl: './styles/selected-flight-summary.styles.scss',
})
export class SelectedFlightSummary {
  @Input({ required: true }) segmentTitle = '';
  @Input({ required: true }) date = '';
  @Input({ required: true }) flight!: FlightOption;
  @Input({ required: true }) fare!: FlightFare;
  @Input({ required: true }) origin = '';
  @Input({ required: true }) destination = '';

  @Output() readonly editRequested = new EventEmitter<void>();

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-CO', {
      currency: 'COP',
      maximumFractionDigits: 0,
      style: 'currency',
    }).format(value);
  }

  upgradeFareName(): string {
    if (this.fare.code === 'basic') {
      return 'Classic';
    }

    if (this.fare.code === 'classic') {
      return 'Flex';
    }

    return 'Business';
  }
}

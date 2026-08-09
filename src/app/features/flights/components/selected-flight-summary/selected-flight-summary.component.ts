import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { DsIcon } from '@skybooking/design-system';

import { I18nService } from '../../../../core/i18n/i18n.service';
import { TEXT_KEYS } from '../../../../core/i18n/text-keys';
import { FlightFare, FlightOption } from '../../models/flight-option.model';

@Component({
  selector: 'selected-flight-summary',
  imports: [DsIcon],
  templateUrl: './selected-flight-summary.component.html',
  styleUrl: './styles/selected-flight-summary.styles.scss',
})
export class SelectedFlightSummary {
  protected readonly i18n = inject(I18nService);
  protected readonly textKeys = TEXT_KEYS;

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

}

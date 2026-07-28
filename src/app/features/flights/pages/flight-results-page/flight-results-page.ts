import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { I18nService } from '../../../../core/i18n/i18n.service';
import { TEXT_KEYS } from '../../../../core/i18n/text-keys';
import { BookingStore } from '../../../../core/state/booking.store';
import { AIRPORTS } from '../../../search/data/airports.data';

@Component({
  selector: 'app-flight-results-page',
  imports: [RouterLink],
  templateUrl: './flight-results-page.html',
  styleUrl: './flight-results-page.scss',
})
export class FlightResultsPage {
  private readonly store = inject(BookingStore);
  protected readonly i18n = inject(I18nService);
  protected readonly textKeys = TEXT_KEYS;

  readonly search = this.store.search;

  airportName(code: string): string {
    const airport = AIRPORTS.find((item) => item.code === code);
    return airport ? `${airport.city} (${airport.code})` : code;
  }
}

import { Component, EventEmitter, Input, Output, inject } from '@angular/core';

import { I18nService } from '../../../../core/i18n/i18n.service';
import { TEXT_KEYS, TranslationKey } from '../../../../core/i18n/text-keys';
import { FlightSearch } from '../../models/flight-search.model';

@Component({
  selector: 'app-recent-searches',
  templateUrl: './recent-searches.component.html',
  styleUrl: './styles/recent-searches.styles.scss',
})
export class RecentSearches {
  protected readonly i18n = inject(I18nService);
  protected readonly textKeys = TEXT_KEYS;

  @Input({ required: true }) searches: readonly FlightSearch[] = [];

  @Output() readonly recentSearchRemoved = new EventEmitter<FlightSearch>();
  @Output() readonly recentSearchSelected = new EventEmitter<FlightSearch>();

  dateSummary(search: FlightSearch): string {
    return search.returnDate ? `${search.departureDate} - ${search.returnDate}` : search.departureDate;
  }

  passengerSummary(search: FlightSearch): string {
    const total = search.passengers.adults + search.passengers.children + search.passengers.infants;
    const passengerKey =
      total === 1
        ? this.textKeys.search.recentSearchesPassengerSingular
        : this.textKeys.search.recentSearchesPassengerPlural;

    return `${total} ${this.i18n.translate(passengerKey)}`;
  }

  removeSearchAriaLabel(search: FlightSearch): string {
    return this.searchActionLabel(search, this.textKeys.search.recentSearchesRemoveAriaPrefix);
  }

  selectSearchAriaLabel(search: FlightSearch): string {
    return this.searchActionLabel(search, this.textKeys.search.recentSearchesSelectAriaPrefix);
  }

  removeSearch(search: FlightSearch): void {
    this.recentSearchRemoved.emit(search);
  }

  selectSearch(search: FlightSearch): void {
    this.recentSearchSelected.emit(search);
  }

  private routeSummary(search: FlightSearch): string {
    return `${search.origin} ${this.i18n.translate(this.textKeys.search.recentSearchesRouteConnector)} ${search.destination}`;
  }

  private searchActionLabel(search: FlightSearch, actionKey: TranslationKey): string {
    return `${this.i18n.translate(actionKey)} ${this.routeSummary(search)}, ${this.dateSummary(search)}`;
  }
}

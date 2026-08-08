import { Component, EventEmitter, Input, Output } from '@angular/core';

import { FlightSearch } from '../../models/flight-search.model';

@Component({
  selector: 'app-recent-searches',
  templateUrl: './recent-searches.component.html',
  styleUrl: './styles/recent-searches.styles.scss',
})
export class RecentSearches {
  @Input({ required: true }) searches: readonly FlightSearch[] = [];

  @Output() readonly recentSearchRemoved = new EventEmitter<FlightSearch>();
  @Output() readonly recentSearchSelected = new EventEmitter<FlightSearch>();

  dateSummary(search: FlightSearch): string {
    return search.returnDate ? `${search.departureDate} - ${search.returnDate}` : search.departureDate;
  }

  passengerSummary(search: FlightSearch): string {
    const total = search.passengers.adults + search.passengers.children + search.passengers.infants;

    return total === 1 ? '1 pasajero' : `${total} pasajeros`;
  }

  removeSearch(search: FlightSearch): void {
    this.recentSearchRemoved.emit(search);
  }

  selectSearch(search: FlightSearch): void {
    this.recentSearchSelected.emit(search);
  }
}

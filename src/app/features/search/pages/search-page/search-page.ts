import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';

import { I18nService } from '../../../../core/i18n/i18n.service';
import { TEXT_KEYS } from '../../../../core/i18n/text-keys';
import { BookingStore } from '../../../../core/state/booking.store';
import { SearchForm } from '../../components/search-form/search-form';
import { FlightSearch } from '../../models/flight-search.model';

@Component({
  selector: 'app-search-page',
  imports: [SearchForm],
  templateUrl: './search-page.html',
  styleUrl: './search-page.scss',
})
export class SearchPage {
  private readonly router = inject(Router);
  private readonly store = inject(BookingStore);
  protected readonly i18n = inject(I18nService);
  protected readonly textKeys = TEXT_KEYS;

  readonly savedSearch = this.store.search;
  readonly hasSavedSearch = computed(() => this.savedSearch() !== null);

  searchFlights(search: FlightSearch): void {
    this.store.saveSearch(search);
    void this.router.navigate(['/flights']);
  }
}

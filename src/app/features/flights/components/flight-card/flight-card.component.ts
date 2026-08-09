import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  computed,
  inject,
  signal,
} from '@angular/core';
import { DsSegmentedControl, DsSegmentedControlConfig } from '@skybooking/design-system';

import { I18nService } from '../../../../core/i18n/i18n.service';
import { TEXT_KEYS } from '../../../../core/i18n/text-keys';
import { FareCabin, FlightFare, FlightOption } from '../../models/flight-option.model';

@Component({
  selector: 'flight-card',
  imports: [DsSegmentedControl],
  templateUrl: './flight-card.component.html',
  styleUrl: './styles/flight-card.styles.scss',
})
export class FlightCard {
  protected readonly i18n = inject(I18nService);
  protected readonly textKeys = TEXT_KEYS;

  private readonly farePanelTransitionMs = 280;
  private closeTimer: ReturnType<typeof setTimeout> | null = null;
  private openTimer: ReturnType<typeof setTimeout> | null = null;

  @Input({ required: true }) flight!: FlightOption;
  @Input({ required: true }) origin = '';
  @Input({ required: true }) destination = '';
  @Input() expanded = false;

  @Output() readonly toggled = new EventEmitter<string>();
  @Output() readonly fareSelected = new EventEmitter<FlightFare>();

  readonly renderFarePanel = signal(false);
  readonly isFarePanelVisible = signal(false);
  readonly activeCabin = signal<FareCabin>('economy');
  readonly visibleFares = computed(() =>
    this.flight.fares.filter((fare) => fare.cabin === this.activeCabin()),
  );

  readonly hasBusinessFares = computed(() =>
    this.flight.fares.some((fare) => fare.cabin === 'business'),
  );
  readonly cabinControlConfig = computed<DsSegmentedControlConfig<FareCabin>>(() => ({
    ariaLabel: this.i18n.translate(this.textKeys.flights.cabinAriaLabel),
    options: [
      { label: this.i18n.translate(this.textKeys.flights.cabinEconomy), value: 'economy' },
      {
        disabled: !this.hasBusinessFares(),
        label: this.i18n.translate(this.textKeys.flights.cabinBusiness),
        value: 'business',
      },
    ],
    size: 'md',
    value: this.activeCabin(),
  }));

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['expanded']) {
      this.syncFarePanelState();
    }
  }

  ngOnDestroy(): void {
    this.clearFarePanelTimers();
  }

  lowestFare(): number {
    return Math.min(...this.flight.fares.map((fare) => fare.price));
  }

  durationLabel(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (!hours) {
      return `${remainingMinutes}m`;
    }

    return remainingMinutes ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  }

  stopsLabel(stops: number): string {
    if (stops === 0) {
      return this.i18n.translate(this.textKeys.flights.directFlight);
    }

    const stopLabel =
      stops === 1
        ? this.i18n.translate(this.textKeys.flights.stopSingular)
        : this.i18n.translate(this.textKeys.flights.stopPlural);

    return `${stops} ${stopLabel}`;
  }

  selectCabin(cabin: FareCabin): void {
    this.activeCabin.set(cabin);
  }

  cabinLabel(cabin: FareCabin): string {
    return cabin === 'business'
      ? this.i18n.translate(this.textKeys.flights.cabinBusiness)
      : this.i18n.translate(this.textKeys.flights.cabinEconomy);
  }

  selectFareAriaLabel(fare: FlightFare): string {
    return [
      this.i18n.translate(this.textKeys.flights.selectFareAriaPrefix),
      this.cabinLabel(fare.cabin),
      fare.name,
      this.i18n.translate(this.textKeys.flights.selectFareAriaPriceConnector),
      this.formatCurrency(fare.price),
    ].join(' ');
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-CO', {
      currency: 'COP',
      maximumFractionDigits: 0,
      style: 'currency',
    }).format(value);
  }

  private syncFarePanelState(): void {
    this.clearFarePanelTimers();

    if (this.expanded) {
      this.renderFarePanel.set(true);
      this.openTimer = setTimeout(() => {
        this.isFarePanelVisible.set(true);
        this.openTimer = null;
      });
      return;
    }

    this.isFarePanelVisible.set(false);
    this.closeTimer = setTimeout(() => {
      this.renderFarePanel.set(false);
      this.closeTimer = null;
    }, this.farePanelTransitionMs);
  }

  private clearFarePanelTimers(): void {
    if (this.openTimer) {
      clearTimeout(this.openTimer);
      this.openTimer = null;
    }

    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
      this.closeTimer = null;
    }
  }
}

import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  computed,
  signal,
} from '@angular/core';
import { DsSegmentedControl, DsSegmentedControlConfig } from '@skybooking/design-system';

import { FareCabin, FlightFare, FlightOption } from '../../models/flight-option.model';

@Component({
  selector: 'flight-card',
  imports: [DsSegmentedControl],
  templateUrl: './flight-card.component.html',
  styleUrl: './styles/flight-card.styles.scss',
})
export class FlightCard {
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
    ariaLabel: 'Cabina',
    options: [
      { label: 'Economy', value: 'economy' },
      { disabled: !this.hasBusinessFares(), label: 'Business Class', value: 'business' },
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
    return stops === 0 ? 'Directo' : `${stops} escala(s)`;
  }

  selectCabin(cabin: FareCabin): void {
    this.activeCabin.set(cabin);
  }

  cabinLabel(cabin: FareCabin): string {
    return cabin === 'business' ? 'Business Class' : 'Economy';
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

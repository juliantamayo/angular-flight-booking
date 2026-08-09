import { Component, ElementRef, ViewChild, computed, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DsBottomSummary, DsBottomSummaryConfig } from '@skybooking/design-system';

import { I18nService } from '../../../../core/i18n/i18n.service';
import { TEXT_KEYS, TranslationKey } from '../../../../core/i18n/text-keys';
import { PassengerInfo } from '../../../../core/models/booking-flow.model';
import { BookingStore } from '../../../../core/state/booking.store';
import { BookingStepIndicator } from '../../../../shared/components/booking-step-indicator/booking-step-indicator.component';
import { BookingHolder } from '../../components/booking-holder/booking-holder.component';
import { PersonalInformation } from '../../components/personal-information/personal-information.component';

@Component({
  selector: 'app-passenger-form-page',
  imports: [BookingHolder, BookingStepIndicator, DsBottomSummary, PersonalInformation, ReactiveFormsModule],
  templateUrl: './passenger-form-page.component.html',
  styleUrl: './styles/passenger-form-page.styles.scss',
})
export class PassengerFormPage {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  protected readonly i18n = inject(I18nService);
  private readonly router = inject(Router);
  private readonly store = inject(BookingStore);
  protected readonly textKeys = TEXT_KEYS;

  readonly search = this.store.search;
  readonly selectedFare = this.store.selectedFare;
  readonly passengerLabels = this.buildPassengerLabels();
  readonly expandedPassengerIndexes = signal<ReadonlySet<number>>(new Set([0]));
  readonly form = this.formBuilder.group({
    contact: this.formBuilder.group({
      email: this.formBuilder.control('', [Validators.required, Validators.email]),
      phone: this.formBuilder.control('', [Validators.required, Validators.minLength(7)]),
    }),
    passengers: this.formBuilder.array(this.passengerLabels.map((label) => this.createPassengerGroup(label.type))),
  });
  readonly bottomSummaryConfig = computed<DsBottomSummaryConfig>(() => ({
    actionLabel: this.i18n.translate(this.textKeys.passengers.page.continue),
    total: this.formatCurrency(this.selectedFare()?.price ?? 0),
    totalLabel: this.i18n.translate(this.textKeys.passengers.page.totalLabel),
  }));

  @ViewChild('bookingHolderSection') private bookingHolderSection?: ElementRef<HTMLElement>;

  get passengers() {
    return this.form.controls.passengers;
  }

  submitPassengers(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.expandInvalidPassengers();
      return;
    }

    const value = this.form.getRawValue();

    this.store.savePassengers({
      contact: value.contact,
      isValid: true,
      passengers: value.passengers,
    });

    void this.router.navigate(['/seats']);
  }

  passengerTitle(index: number): string {
    const passenger = this.passengerLabels[index];

    if (!passenger) {
      return `${this.i18n.translate(this.textKeys.passengers.page.fallbackPassenger)} ${index + 1}`;
    }

    return `${this.passengerTypeLabel(passenger.type)} ${index + 1}`;
  }

  isPassengerExpanded(index: number): boolean {
    return this.expandedPassengerIndexes().has(index);
  }

  setPassengerExpanded(index: number, expanded: boolean): void {
    const nextExpandedIndexes = new Set(this.expandedPassengerIndexes());

    if (expanded) {
      nextExpandedIndexes.add(index);
    } else {
      nextExpandedIndexes.delete(index);
    }

    this.expandedPassengerIndexes.set(nextExpandedIndexes);
  }

  continueFromPassenger(index: number): void {
    const nextIndex = index + 1;

    if (nextIndex < this.passengers.length) {
      this.expandedPassengerIndexes.set(new Set([nextIndex]));
      return;
    }

    this.expandedPassengerIndexes.set(new Set());
    this.focusBookingHolder();
  }

  private createPassengerGroup(type: PassengerInfo['type']) {
    return this.formBuilder.group({
      birthDate: this.formBuilder.control('', Validators.required),
      documentNumber: this.formBuilder.control('', Validators.required),
      documentType: this.formBuilder.control('CC', Validators.required),
      firstName: this.formBuilder.control('', Validators.required),
      lastName: this.formBuilder.control('', Validators.required),
      type: this.formBuilder.control(type),
    });
  }

  private buildPassengerLabels(): Array<{ type: PassengerInfo['type'] }> {
    const passengers = this.search()?.passengers;
    const labels: Array<{ type: PassengerInfo['type'] }> = [];

    for (let index = 0; index < (passengers?.adults ?? 1); index += 1) {
      labels.push({ type: 'adult' });
    }

    for (let index = 0; index < (passengers?.children ?? 0); index += 1) {
      labels.push({ type: 'child' });
    }

    for (let index = 0; index < (passengers?.infants ?? 0); index += 1) {
      labels.push({ type: 'infant' });
    }

    return labels;
  }

  private passengerTypeLabel(type: PassengerInfo['type']): string {
    const keyByType: Record<PassengerInfo['type'], TranslationKey> = {
      adult: this.textKeys.passengers.page.adult,
      child: this.textKeys.passengers.page.child,
      infant: this.textKeys.passengers.page.infant,
    };

    return this.i18n.translate(keyByType[type]);
  }

  private expandInvalidPassengers(): void {
    const nextExpandedIndexes = new Set(this.expandedPassengerIndexes());

    this.passengers.controls.forEach((passenger, index) => {
      if (passenger.invalid) {
        nextExpandedIndexes.add(index);
      }
    });

    this.expandedPassengerIndexes.set(nextExpandedIndexes);
  }

  private focusBookingHolder(): void {
    const element = this.bookingHolderSection?.nativeElement;

    if (!element) {
      return;
    }

    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    element.querySelector<HTMLElement>('input')?.focus({ preventScroll: true });
  }

  private formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-CO', {
      currency: 'COP',
      maximumFractionDigits: 0,
      style: 'currency',
    }).format(value);
  }
}

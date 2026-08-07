import { Component, ElementRef, ViewChild, computed, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DsBottomSummary, DsBottomSummaryConfig } from '@skybooking/design-system';

import { PassengerInfo } from '../../../../core/models/booking-flow.model';
import { BookingStore } from '../../../../core/state/booking.store';
import { EmergencyContact } from '../../components/emergency-contact/emergency-contact.component';
import { PersonalInformation } from '../../components/personal-information/personal-information.component';

@Component({
  selector: 'app-passenger-form-page',
  imports: [DsBottomSummary, EmergencyContact, PersonalInformation, ReactiveFormsModule],
  templateUrl: './passenger-form-page.component.html',
  styleUrl: './styles/passenger-form-page.styles.scss',
})
export class PassengerFormPage {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly router = inject(Router);
  private readonly store = inject(BookingStore);

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
    actionLabel: 'Continuar',
    total: this.formatCurrency(this.selectedFare()?.price ?? 0),
    totalLabel: 'Total de tu reserva:',
  }));

  @ViewChild('emergencyContactSection') private emergencyContactSection?: ElementRef<HTMLElement>;

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
    return this.passengerLabels[index]?.label ?? `Pasajero ${index + 1}`;
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
    this.focusEmergencyContact();
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

  private buildPassengerLabels(): Array<{ label: string; type: PassengerInfo['type'] }> {
    const passengers = this.search()?.passengers;
    const labels: Array<{ label: string; type: PassengerInfo['type'] }> = [];

    for (let index = 0; index < (passengers?.adults ?? 1); index += 1) {
      labels.push({ label: `Adulto ${index + 1}`, type: 'adult' });
    }

    for (let index = 0; index < (passengers?.children ?? 0); index += 1) {
      labels.push({ label: `Nino ${index + 1}`, type: 'child' });
    }

    for (let index = 0; index < (passengers?.infants ?? 0); index += 1) {
      labels.push({ label: `Infante ${index + 1}`, type: 'infant' });
    }

    return labels;
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

  private focusEmergencyContact(): void {
    const element = this.emergencyContactSection?.nativeElement;

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

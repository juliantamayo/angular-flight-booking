import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DsButton, DsButtonConfig, DsExpansionPanel } from '@skybooking/design-system';

@Component({
  selector: 'app-personal-information',
  imports: [DsButton, DsExpansionPanel, ReactiveFormsModule],
  templateUrl: './personal-information.component.html',
  styleUrl: './styles/personal-information.styles.scss',
})
export class PersonalInformation {
  @Input() expanded = false;
  @Input({ required: true }) passengerGroup!: FormGroup;
  @Input({ required: true }) title = '';

  @Output() readonly expandedChange = new EventEmitter<boolean>();
  @Output() readonly nextClicked = new EventEmitter<void>();

  readonly nextButtonConfig: DsButtonConfig = {
    label: 'Siguiente',
    size: 'lg',
    type: 'button',
    variant: 'secondary',
  };

  hasError(field: 'birthDate' | 'documentNumber' | 'firstName' | 'lastName'): boolean {
    const control = this.passengerGroup.get(field);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  requestNext(): void {
    if (this.passengerGroup.invalid) {
      this.passengerGroup.markAllAsTouched();
      return;
    }

    this.nextClicked.emit();
  }
}

import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-emergency-contact',
  imports: [ReactiveFormsModule],
  templateUrl: './emergency-contact.component.html',
  styleUrl: './styles/emergency-contact.styles.scss',
})
export class EmergencyContact {
  @Input({ required: true }) contactGroup!: FormGroup;

  hasError(field: 'email' | 'phone'): boolean {
    const control = this.contactGroup.get(field);
    return !!control && control.invalid && (control.touched || control.dirty);
  }
}

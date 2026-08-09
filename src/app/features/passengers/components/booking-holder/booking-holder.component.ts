import { Component, Input, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { I18nService } from '../../../../core/i18n/i18n.service';
import { TEXT_KEYS } from '../../../../core/i18n/text-keys';

@Component({
  selector: 'app-booking-holder',
  imports: [ReactiveFormsModule],
  templateUrl: './booking-holder.component.html',
  styleUrl: './styles/booking-holder.styles.scss',
})
export class BookingHolder {
  protected readonly i18n = inject(I18nService);
  protected readonly textKeys = TEXT_KEYS;

  @Input({ required: true }) holderGroup!: FormGroup;

  hasError(field: 'email' | 'phone'): boolean {
    const control = this.holderGroup.get(field);
    return !!control && control.invalid && (control.touched || control.dirty);
  }
}

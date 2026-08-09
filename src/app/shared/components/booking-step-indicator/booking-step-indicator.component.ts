import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map, startWith } from 'rxjs';

import { BOOKING_STEPS } from '../../../core/constants/booking-steps';
import { I18nService } from '../../../core/i18n/i18n.service';
import { TEXT_KEYS } from '../../../core/i18n/text-keys';

@Component({
  selector: 'app-booking-step-indicator',
  templateUrl: './booking-step-indicator.component.html',
  styleUrl: './styles/booking-step-indicator.styles.scss',
})
export class BookingStepIndicator {
  private readonly router = inject(Router);
  protected readonly i18n = inject(I18nService);
  protected readonly textKeys = TEXT_KEYS;

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  );

  readonly totalSteps = BOOKING_STEPS.length;
  readonly currentStep = computed(() => {
    const path = this.currentUrl().split('?')[0].split('#')[0];
    const stepIndex = BOOKING_STEPS.findIndex((step) => step.path === path);

    return stepIndex >= 0 ? stepIndex + 1 : null;
  });
}

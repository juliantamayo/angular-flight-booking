import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { BookingStore } from '../state/booking.store';

export const confirmationGuard: CanActivateFn = () => {
  const store = inject(BookingStore);
  const router = inject(Router);

  return store.hasConfirmedBooking() ? true : router.createUrlTree(['/payment']);
};

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { BookingStore } from '../state/booking.store';

export const passengersGuard: CanActivateFn = () => {
  const store = inject(BookingStore);
  const router = inject(Router);

  return store.hasValidPassengers() ? true : router.createUrlTree(['/passengers']);
};

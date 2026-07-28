import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const differentAirportsValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const origin = control.get('origin')?.value;
  const destination = control.get('destination')?.value;

  return origin && destination && origin === destination ? { sameAirports: true } : null;
};

export const dateRangeValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const tripType = control.get('tripType')?.value;
  const departureDate = control.get('departureDate')?.value;
  const returnDate = control.get('returnDate')?.value;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (departureDate && new Date(`${departureDate}T00:00:00`) < today) {
    return { pastDepartureDate: true };
  }

  if (tripType === 'round-trip') {
    if (!returnDate) {
      return { missingReturnDate: true };
    }

    if (
      departureDate &&
      new Date(`${returnDate}T00:00:00`) < new Date(`${departureDate}T00:00:00`)
    ) {
      return { returnBeforeDeparture: true };
    }
  }

  return null;
};

export const passengerCountsValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const passengers = control.get('passengers');
  const adults = Number(passengers?.get('adults')?.value ?? 0);
  const children = Number(passengers?.get('children')?.value ?? 0);
  const infants = Number(passengers?.get('infants')?.value ?? 0);
  const total = adults + children + infants;

  if (adults < 1) {
    return { missingAdult: true };
  }

  if (infants > adults) {
    return { tooManyInfants: true };
  }

  if (total > 9) {
    return { tooManyPassengers: true };
  }

  return null;
};

import { Routes } from '@angular/router';

import { bookingSearchGuard } from './core/guards/booking-search.guard';
import { confirmationGuard } from './core/guards/confirmation.guard';
import { passengersGuard } from './core/guards/passengers.guard';
import { selectedFareGuard } from './core/guards/selected-fare.guard';
import { selectedFlightGuard } from './core/guards/selected-flight.guard';

export const routes: Routes = [
  {
    path: '',
    title: 'Buscar vuelos | SkyBooking',
    loadComponent: () =>
      import('./features/search/pages/search-page/search-page').then((m) => m.SearchPage),
  },
  {
    path: 'flights',
    title: 'Seleccionar vuelo | SkyBooking',
    canActivate: [bookingSearchGuard],
    loadComponent: () =>
      import('./features/flights/pages/flight-results-page/flight-results-page').then(
        (m) => m.FlightResultsPage,
      ),
  },
  {
    path: 'fare',
    title: 'Seleccionar tarifa | SkyBooking',
    canActivate: [bookingSearchGuard, selectedFlightGuard],
    loadComponent: () =>
      import('./features/fares/pages/fare-selection-page/fare-selection-page').then(
        (m) => m.FareSelectionPage,
      ),
  },
  {
    path: 'passengers',
    title: 'Datos de pasajeros | SkyBooking',
    canActivate: [bookingSearchGuard, selectedFlightGuard, selectedFareGuard],
    loadComponent: () =>
      import('./features/passengers/pages/passenger-form-page/passenger-form-page').then(
        (m) => m.PassengerFormPage,
      ),
  },
  {
    path: 'review',
    title: 'Revisar compra | SkyBooking',
    canActivate: [bookingSearchGuard, selectedFlightGuard, selectedFareGuard, passengersGuard],
    loadComponent: () =>
      import('./features/review/pages/booking-review-page/booking-review-page').then(
        (m) => m.BookingReviewPage,
      ),
  },
  {
    path: 'confirmation',
    title: 'Reserva confirmada | SkyBooking',
    canActivate: [confirmationGuard],
    loadComponent: () =>
      import('./features/confirmation/pages/confirmation-page/confirmation-page').then(
        (m) => m.ConfirmationPage,
      ),
  },
  {
    path: '**',
    title: 'Pagina no encontrada | SkyBooking',
    loadComponent: () =>
      import('./shared/pages/not-found-page/not-found-page').then((m) => m.NotFoundPage),
  },
];

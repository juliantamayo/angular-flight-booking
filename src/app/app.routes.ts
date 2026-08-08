import { Routes } from '@angular/router';

import { bookingSearchGuard } from './core/guards/booking-search.guard';
import { confirmationGuard } from './core/guards/confirmation.guard';
import { passengersGuard } from './core/guards/passengers.guard';
import { selectedFareGuard } from './core/guards/selected-fare.guard';
import { selectedFlightGuard } from './core/guards/selected-flight.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'search',
  },
  {
    path: 'search',
    title: 'Buscar vuelos | SkyBooking',
    loadComponent: () =>
      import('./features/search/pages/search-page/search-page.component').then((m) => m.SearchPage),
  },
  {
    path: 'flights',
    title: 'Seleccionar vuelo | SkyBooking',
    canActivate: [bookingSearchGuard],
    loadComponent: () =>
      import('./features/flights/pages/flight-results-page/flight-results-page.component').then(
        (m) => m.FlightResultsPage,
      ),
  },
  {
    path: 'fare',
    title: 'Seleccionar tarifa | SkyBooking',
    canActivate: [bookingSearchGuard, selectedFlightGuard],
    loadComponent: () =>
      import('./features/fares/pages/fare-selection-page/fare-selection-page.component').then(
        (m) => m.FareSelectionPage,
      ),
  },
  {
    path: 'passengers',
    title: 'Datos de pasajeros | SkyBooking',
    canActivate: [bookingSearchGuard, selectedFlightGuard, selectedFareGuard],
    loadComponent: () =>
      import('./features/passengers/pages/passenger-form-page/passenger-form-page.component').then(
        (m) => m.PassengerFormPage,
      ),
  },
  {
    path: 'seats',
    title: 'Seleccionar asientos | SkyBooking',
    canActivate: [bookingSearchGuard, selectedFlightGuard, selectedFareGuard, passengersGuard],
    loadComponent: () =>
      import('./features/seats/pages/seats-page/seats-page.component').then((m) => m.SeatsPage),
  },
  {
    path: 'services',
    title: 'Servicios adicionales | SkyBooking',
    canActivate: [bookingSearchGuard, selectedFlightGuard, selectedFareGuard, passengersGuard],
    loadComponent: () =>
      import('./features/services/pages/services-page/services-page.component').then(
        (m) => m.ServicesPage,
      ),
  },
  {
    path: 'payment',
    title: 'Pago | SkyBooking',
    canActivate: [bookingSearchGuard, selectedFlightGuard, selectedFareGuard, passengersGuard],
    loadComponent: () =>
      import('./features/payment/pages/payment-page/payment-page.component').then(
        (m) => m.PaymentPage,
      ),
  },
  {
    path: 'review',
    title: 'Revisar compra | SkyBooking',
    canActivate: [bookingSearchGuard, selectedFlightGuard, selectedFareGuard, passengersGuard],
    loadComponent: () =>
      import('./features/review/pages/booking-review-page/booking-review-page.component').then(
        (m) => m.BookingReviewPage,
      ),
  },
  {
    path: 'confirmation',
    title: 'Reserva confirmada | SkyBooking',
    canActivate: [confirmationGuard],
    loadComponent: () =>
      import('./features/confirmation/pages/confirmation-page/confirmation-page.component').then(
        (m) => m.ConfirmationPage,
      ),
  },
  {
    path: '**',
    title: 'Pagina no encontrada | SkyBooking',
    loadComponent: () =>
      import('./shared/pages/not-found-page/not-found-page.component').then((m) => m.NotFoundPage),
  },
];

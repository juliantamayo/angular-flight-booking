import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-booking-review-page',
  imports: [RouterLink],
  template: `
    <section class="placeholder-page" aria-labelledby="review-title">
      <p class="placeholder-page__eyebrow">Paso 5 de 5</p>
      <h1 id="review-title" class="placeholder-page__title">Revisar compra</h1>
      <p class="placeholder-page__description">Esta pantalla reunira itinerario, pasajeros, tarifa y precio simulado.</p>
      <a class="placeholder-page__link" routerLink="/passengers">Volver a pasajeros</a>
    </section>
  `,
  styleUrl: '../../../../shared/styles/placeholder-page.scss',
})
export class BookingReviewPage {}

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-confirmation-page',
  imports: [RouterLink],
  template: `
    <section class="placeholder-page" aria-labelledby="confirmation-title">
      <p class="placeholder-page__eyebrow">Reserva simulada</p>
      <h1 id="confirmation-title" class="placeholder-page__title">Reserva confirmada</h1>
      <p class="placeholder-page__description">Esta pantalla mostrara el codigo de reserva cuando exista confirmacion.</p>
      <a class="placeholder-page__link" routerLink="/search">Volver al inicio</a>
    </section>
  `,
  styleUrl: '../../../../shared/styles/placeholder-page.scss',
})
export class ConfirmationPage {}

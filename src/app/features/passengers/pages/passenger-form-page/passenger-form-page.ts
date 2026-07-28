import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-passenger-form-page',
  imports: [RouterLink],
  template: `
    <section class="placeholder-page" aria-labelledby="passengers-title">
      <p class="placeholder-page__eyebrow">Paso 4 de 5</p>
      <h1 id="passengers-title" class="placeholder-page__title">Datos de pasajeros</h1>
      <p class="placeholder-page__description">Esta pantalla se implementara despues de seleccionar tarifa.</p>
      <a class="placeholder-page__link" routerLink="/fare">Volver a tarifas</a>
    </section>
  `,
  styleUrl: '../../../../shared/styles/placeholder-page.scss',
})
export class PassengerFormPage {}

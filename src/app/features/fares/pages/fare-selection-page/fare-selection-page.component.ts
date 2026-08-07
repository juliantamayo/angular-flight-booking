import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-fare-selection-page',
  imports: [RouterLink],
  template: `
    <section class="placeholder-page" aria-labelledby="fare-title">
      <p class="placeholder-page__eyebrow">Paso 3 de 5</p>
      <h1 id="fare-title" class="placeholder-page__title">Seleccionar tarifa</h1>
      <p class="placeholder-page__description">Esta pantalla se implementara cuando cerremos resultados de vuelos.</p>
      <a class="placeholder-page__link" routerLink="/flights">Volver a resultados</a>
    </section>
  `,
  styleUrl: '../../../../shared/styles/placeholder-page.scss',
})
export class FareSelectionPage {}

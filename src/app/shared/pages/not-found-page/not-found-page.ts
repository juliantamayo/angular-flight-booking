import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found-page',
  imports: [RouterLink],
  template: `
    <section class="placeholder-page" aria-labelledby="not-found-title">
      <p class="placeholder-page__eyebrow">404</p>
      <h1 id="not-found-title" class="placeholder-page__title">Pagina no encontrada</h1>
      <p class="placeholder-page__description">La ruta que intentaste abrir no existe en SkyBooking.</p>
      <a class="placeholder-page__link" routerLink="/">Ir al buscador</a>
    </section>
  `,
  styleUrl: '../../styles/placeholder-page.scss',
})
export class NotFoundPage {}

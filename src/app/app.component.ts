import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

import { I18nService } from './core/i18n/i18n.service';
import { TEXT_KEYS } from './core/i18n/text-keys';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './styles/app.styles.scss',
})
export class App {
  protected readonly i18n = inject(I18nService);
  protected readonly textKeys = TEXT_KEYS;
}

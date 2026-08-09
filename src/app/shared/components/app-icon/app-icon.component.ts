import { Component, computed, input, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { APP_ICONS, AppIconName } from '../../icons/app-icons';

@Component({
  selector: 'app-icon',
  templateUrl: './app-icon.component.html',
  styleUrl: './styles/app-icon.styles.scss',
})
export class AppIcon {
  private readonly sanitizer = inject(DomSanitizer);

  readonly name = input.required<AppIconName>();

  readonly content = computed<SafeHtml>(() => {
    const icon = APP_ICONS[this.name()];
    const markup = icon
      .map(([tag, attrs]) => {
        const attributes = Object.entries(attrs)
          .map(([key, value]) => `${key}="${this.escapeAttribute(value)}"`)
          .join(' ');

        return `<${tag} ${attributes}></${tag}>`;
      })
      .join('');

    return this.sanitizer.bypassSecurityTrustHtml(markup);
  });

  private escapeAttribute(value: unknown): string {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
}

import { Component, computed, inject, input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { DS_ICONS, DsIconName } from './ds-icons';

@Component({
  selector: 'ds-icon',
  templateUrl: './ds-icon.component.html',
  styleUrl: './styles/ds-icon.styles.scss',
})
export class DsIcon {
  private readonly sanitizer = inject(DomSanitizer);

  readonly name = input.required<DsIconName>();

  readonly content = computed<SafeHtml>(() => {
    const icon = DS_ICONS[this.name()];
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

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { DsButtonConfig } from './button-config.model';

@Component({
  selector: 'ds-button',
  templateUrl: './ds-button.component.html',
  styleUrl: './styles/ds-button.styles.scss',
})
export class DsButton {
  @Input({ required: true }) config!: DsButtonConfig;
  @Input() disabled = false;

  @Output() readonly buttonClicked = new EventEmitter<MouseEvent>();

  get isDisabled(): boolean {
    return this.disabled || Boolean(this.config.disabled);
  }

  get iconPosition(): 'start' | 'end' {
    return this.config.iconPosition ?? 'start';
  }

  get size(): 'sm' | 'md' | 'lg' {
    return this.config.size ?? 'md';
  }

  get type(): 'button' | 'submit' | 'reset' {
    return this.config.type ?? 'button';
  }

  get variant(): 'primary' | 'secondary' | 'text' {
    return this.config.variant ?? 'primary';
  }
}

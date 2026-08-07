import { Component, EventEmitter, Input, Output } from '@angular/core';

import {
  DsSegmentedControlConfig,
  DsSegmentedControlOption,
  DsSegmentedControlSize,
} from './segmented-control-config.model';

@Component({
  selector: 'ds-segmented-control',
  templateUrl: './ds-segmented-control.component.html',
  styleUrl: './styles/ds-segmented-control.styles.scss',
})
export class DsSegmentedControl<T extends string = string> {
  @Input({ required: true }) config!: DsSegmentedControlConfig<T>;

  @Output() readonly valueChanged = new EventEmitter<T>();

  get size(): DsSegmentedControlSize {
    return this.config.size ?? 'md';
  }

  isSelected(option: DsSegmentedControlOption<T>): boolean {
    return option.value === this.config.value;
  }

  selectOption(option: DsSegmentedControlOption<T>): void {
    if (option.disabled || this.isSelected(option)) {
      return;
    }

    this.valueChanged.emit(option.value);
  }
}

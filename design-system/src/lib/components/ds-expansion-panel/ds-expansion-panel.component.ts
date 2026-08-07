import { Component, EventEmitter, Input, Output } from '@angular/core';

let nextExpansionPanelId = 0;

@Component({
  selector: 'ds-expansion-panel',
  templateUrl: './ds-expansion-panel.component.html',
  styleUrl: './styles/ds-expansion-panel.styles.scss',
})
export class DsExpansionPanel {
  private readonly panelId = `ds-expansion-panel-${nextExpansionPanelId++}`;

  @Input() expanded = false;
  @Input({ required: true }) title = '';

  @Output() readonly expandedChange = new EventEmitter<boolean>();

  get contentId(): string {
    return `${this.panelId}-content`;
  }

  get triggerId(): string {
    return `${this.panelId}-trigger`;
  }

  toggle(): void {
    this.expanded = !this.expanded;
    this.expandedChange.emit(this.expanded);
  }
}

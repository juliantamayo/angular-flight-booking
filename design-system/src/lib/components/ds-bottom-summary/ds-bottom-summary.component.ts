import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  inject,
  signal,
} from '@angular/core';

import { DsButton, DsButtonConfig } from '../ds-button';
import { DsIcon } from '../ds-icon';
import { DsBottomSummaryConfig, DsBottomSummarySection } from './bottom-summary-config.model';

@Component({
  selector: 'ds-bottom-summary',
  imports: [DsButton, DsIcon],
  templateUrl: './ds-bottom-summary.component.html',
  styleUrl: './styles/ds-bottom-summary.styles.scss',
})
export class DsBottomSummary implements AfterViewInit, OnDestroy {
  private readonly defaultFooterGapPx = 16;
  private readonly defaultFooterSelector = '.app-shell__footer';
  private readonly document = inject(DOCUMENT);
  private animationFrameId: number | null = null;

  @Input({ required: true }) config!: DsBottomSummaryConfig;

  @Output() readonly actionClicked = new EventEmitter<void>();

  readonly footerOffset = signal(0);
  readonly isSummaryOpen = signal(false);

  get actionConfig(): DsButtonConfig {
    return {
      ariaLabel: this.config.actionAriaLabel,
      label: this.config.actionLabel,
      size: 'lg',
      type: 'button',
      variant: 'primary',
    };
  }

  get hasSummary(): boolean {
    return Boolean(this.config.summarySections?.length);
  }

  get summarySections(): readonly DsBottomSummarySection[] {
    return this.config.summarySections ?? [];
  }

  ngAfterViewInit(): void {
    const windowRef = this.document.defaultView;

    if (!windowRef) {
      return;
    }

    this.updateFooterOffset();
    windowRef.addEventListener('scroll', this.queueFooterOffsetUpdate, { passive: true });
    windowRef.addEventListener('resize', this.queueFooterOffsetUpdate);
  }

  ngOnDestroy(): void {
    const windowRef = this.document.defaultView;

    if (!windowRef) {
      return;
    }

    windowRef.removeEventListener('scroll', this.queueFooterOffsetUpdate);
    windowRef.removeEventListener('resize', this.queueFooterOffsetUpdate);

    if (this.animationFrameId !== null) {
      windowRef.cancelAnimationFrame(this.animationFrameId);
    }
  }

  protected emitAction(): void {
    this.actionClicked.emit();
  }

  protected toggleSummary(): void {
    if (!this.hasSummary) {
      return;
    }

    this.isSummaryOpen.update((isOpen) => !isOpen);
  }

  private readonly queueFooterOffsetUpdate = (): void => {
    const windowRef = this.document.defaultView;

    if (!windowRef || this.animationFrameId !== null) {
      return;
    }

    this.animationFrameId = windowRef.requestAnimationFrame(() => {
      this.animationFrameId = null;
      this.updateFooterOffset();
    });
  };

  private updateFooterOffset(): void {
    const windowRef = this.document.defaultView;
    const footer = this.document.querySelector<HTMLElement>(
      this.config.footerSelector ?? this.defaultFooterSelector,
    );

    if (!windowRef || !footer) {
      this.footerOffset.set(0);
      return;
    }

    const footerRect = footer.getBoundingClientRect();
    const visibleFooterHeight =
      footerRect.top < windowRef.innerHeight && footerRect.bottom > 0
        ? Math.min(footerRect.bottom, windowRef.innerHeight) - Math.max(footerRect.top, 0)
        : 0;
    const footerOffset = visibleFooterHeight
      ? visibleFooterHeight + (this.config.footerGapPx ?? this.defaultFooterGapPx)
      : 0;

    this.footerOffset.set(Math.max(0, Math.ceil(footerOffset)));
  }
}

export interface DsBottomSummaryConfig {
  readonly actionAriaLabel?: string;
  readonly actionLabel: string;
  readonly closeSummaryAriaLabel?: string;
  readonly footerGapPx?: number;
  readonly footerSelector?: string;
  readonly summaryAriaLabel?: string;
  readonly summarySections?: readonly DsBottomSummarySection[];
  readonly summaryTitle?: string;
  readonly total: string;
  readonly totalLabel: string;
}

export interface DsBottomSummarySection {
  readonly items: readonly DsBottomSummaryItem[];
  readonly title: string;
}

export interface DsBottomSummaryItem {
  readonly label: string;
  readonly meta?: string;
  readonly value: string;
}

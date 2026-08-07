export type DsSegmentedControlSize = 'sm' | 'md';

export interface DsSegmentedControlOption<T extends string = string> {
  readonly disabled?: boolean;
  readonly label: string;
  readonly value: T;
}

export interface DsSegmentedControlConfig<T extends string = string> {
  readonly ariaLabel: string;
  readonly options: readonly DsSegmentedControlOption<T>[];
  readonly size?: DsSegmentedControlSize;
  readonly value: T;
}

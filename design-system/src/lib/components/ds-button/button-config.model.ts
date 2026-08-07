export type DsButtonVariant = 'primary' | 'secondary' | 'text';
export type DsButtonSize = 'sm' | 'md' | 'lg';
export type DsButtonType = 'button' | 'submit' | 'reset';
export type DsButtonIconPosition = 'start' | 'end';

export interface DsButtonConfig {
  readonly ariaLabel?: string;
  readonly disabled?: boolean;
  readonly fullWidth?: boolean;
  readonly icon?: string;
  readonly iconPosition?: DsButtonIconPosition;
  readonly label: string;
  readonly size?: DsButtonSize;
  readonly type?: DsButtonType;
  readonly variant?: DsButtonVariant;
}

import { ArrowLeftRight } from 'lucide';

export const APP_ICONS = {
  'arrow-left-right': ArrowLeftRight,
} as const;

export type AppIconName = keyof typeof APP_ICONS;

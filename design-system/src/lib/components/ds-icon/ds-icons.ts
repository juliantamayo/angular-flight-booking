import { ArrowLeftRight, Check, Pencil, Plane, ShoppingCart } from 'lucide';

export const DS_ICONS = {
  'arrow-left-right': ArrowLeftRight,
  check: Check,
  pencil: Pencil,
  plane: Plane,
  'shopping-cart': ShoppingCart,
} as const;

export type DsIconName = keyof typeof DS_ICONS;

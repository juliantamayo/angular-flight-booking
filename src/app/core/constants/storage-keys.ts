export const STORAGE_KEYS = {
  flightSearch: 'skybooking.search',
  language: 'skybooking.language',
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

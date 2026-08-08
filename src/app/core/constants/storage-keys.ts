export const STORAGE_KEYS = {
  flightSearch: 'skybooking.search',
  language: 'skybooking.language',
  recentSearches: 'skybooking.recent-searches',
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

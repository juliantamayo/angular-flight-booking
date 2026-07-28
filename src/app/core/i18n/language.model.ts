export const LANGUAGE_CODES = ['es', 'en'] as const;

export type LanguageCode = (typeof LANGUAGE_CODES)[number];

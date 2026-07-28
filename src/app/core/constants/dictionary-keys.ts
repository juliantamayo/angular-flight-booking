export const DICTIONARY_KEYS = {
  airports: 'airports',
  tripTypes: 'tripTypes',
  passengerTypes: 'passengerTypes',
  documentTypes: 'documentTypes',
  nationalities: 'nationalities',
  fareTypes: 'fareTypes',
  timeBands: 'timeBands',
} as const;

export type DictionaryKey = (typeof DICTIONARY_KEYS)[keyof typeof DICTIONARY_KEYS];

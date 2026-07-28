export const TEXT_KEYS = {
  app: {
    skipToContent: 'app.skipToContent',
    brandAria: 'app.brandAria',
    tagline: 'app.tagline',
    step: 'app.step',
    help: 'app.help',
    headerControls: 'app.headerControls',
    languageSelector: 'app.languageSelector',
    languageSpanish: 'app.languageSpanish',
    languageEnglish: 'app.languageEnglish',
    footerDisclaimer: 'app.footerDisclaimer',
  },
  search: {
    eyebrow: 'search.eyebrow',
    title: 'search.title',
    subtitle: 'search.subtitle',
    savedSearch: 'search.savedSearch',
    tripType: 'search.tripType',
    oneWay: 'search.oneWay',
    roundTrip: 'search.roundTrip',
    origin: 'search.origin',
    destination: 'search.destination',
    selectOrigin: 'search.selectOrigin',
    selectDestination: 'search.selectDestination',
    swapAirports: 'search.swapAirports',
    sameAirportsError: 'search.sameAirportsError',
    departureDate: 'search.departureDate',
    returnDate: 'search.returnDate',
    pastDepartureDateError: 'search.pastDepartureDateError',
    missingReturnDateError: 'search.missingReturnDateError',
    returnBeforeDepartureError: 'search.returnBeforeDepartureError',
    passengers: 'search.passengers',
    adults: 'search.adults',
    children: 'search.children',
    infants: 'search.infants',
    missingAdultError: 'search.missingAdultError',
    tooManyInfantsError: 'search.tooManyInfantsError',
    tooManyPassengersError: 'search.tooManyPassengersError',
    submit: 'search.submit',
  },
  flights: {
    eyebrow: 'flights.eyebrow',
    title: 'flights.title',
    subtitle: 'flights.subtitle',
    savedSearch: 'flights.savedSearch',
    route: 'flights.route',
    departure: 'flights.departure',
    return: 'flights.return',
    notApplicable: 'flights.notApplicable',
    passengers: 'flights.passengers',
    adults: 'flights.adults',
    children: 'flights.children',
    infants: 'flights.infants',
    editSearch: 'flights.editSearch',
    to: 'flights.to',
  },
} as const;

type NestedTextKeys = typeof TEXT_KEYS;

type NestedValues<T> = T extends string
  ? T
  : {
      [K in keyof T]: NestedValues<T[K]>;
    }[keyof T];

export type TextKey = NestedValues<NestedTextKeys>;

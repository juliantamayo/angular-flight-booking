export type TripType = 'one-way' | 'round-trip';

export interface PassengerCounts {
  readonly adults: number;
  readonly children: number;
  readonly infants: number;
}

export interface FlightSearch {
  readonly tripType: TripType;
  readonly origin: string;
  readonly destination: string;
  readonly departureDate: string;
  readonly returnDate: string | null;
  readonly passengers: PassengerCounts;
}

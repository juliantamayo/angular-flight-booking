export type FareCode = 'basic' | 'classic' | 'flex';
export type FareCabin = 'economy' | 'business';

export interface FlightFare {
  readonly code: FareCode;
  readonly name: string;
  readonly cabin: FareCabin;
  readonly price: number;
  readonly highlighted?: boolean;
  readonly benefits: readonly string[];
  readonly restrictions: readonly string[];
}

export interface FlightOption {
  readonly id: string;
  readonly airline: string;
  readonly flightNumber: string;
  readonly operator: string;
  readonly departureTime: string;
  readonly arrivalTime: string;
  readonly durationMinutes: number;
  readonly stops: number;
  readonly fares: readonly FlightFare[];
}
